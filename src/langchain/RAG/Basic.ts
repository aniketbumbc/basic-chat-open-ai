import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.8,
});

const data = [
  'My name is John.',
  'My name is Bob.',
  'My favorite food is pizza',
  'My favorite food is pasta',
];

const question = 'What i eat for dinner with no bread ?';

async function main() {
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  await vectorStore.addDocuments(
    data.map((content) => new Document({ pageContent: content }))
  );

  // create data retrieval 2 most similar argument retrieve
  const retriever = vectorStore.asRetriever({ k: 2 });

  // get si,ilar relevant documents
  const results = await retriever._getRelevantDocuments(question);
  const resultDocs = results.map((result) => result.pageContent);

  console.log(resultDocs);

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
