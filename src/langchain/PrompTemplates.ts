import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.8,
});

async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'write a short description for product: {product_name}'
  );

  /**
   *  Creating chain prompt-model
   */

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: 'Ferrari',
  });

  console.log(response.content);
}

async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'Write a short description of product for 30 years men'],
    ['human', '{product_name}'],
  ]);

  /**
   *  Creating chain prompt-model
   */

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: 'bicycle',
  });

  console.log(response.content);
}

fromMessage();
