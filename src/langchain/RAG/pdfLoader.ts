import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.8,
});

const question = 'what is oocss approach?';

async function main() {
  const loader = new PDFLoader('path', {
    splitPages: false,
  });

  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    separators: [`. \n`],
  });

  const splitedDocs = await splitter.splitDocuments(docs);

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  await vectorStore.addDocuments(splitedDocs);

  // create data retrieval 2 most similar argument retrieve
  const retriever = vectorStore.asRetriever({ k: 2 });

  // get similar relevant documents
  const results = await retriever._getRelevantDocuments(question);
  const resultDocs = results.map((result) => result.pageContent);

  //   console.log(resultDocs);

  const templates = ChatPromptTemplate.fromMessages([
    [
      'system',
      'Answer the users question based on the following context: {context}',
    ],
    ['user', '{input}'],
  ]);

  const chain = templates.pipe(model);
  const response = await chain.invoke({
    input: question,
    context: resultDocs,
  });

  console.log(response.content);
}

main();
