import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.8,
  maxTokens: 700,
  verbose: false,
});

async function main() {
  const response = await model.invoke(
    'suggest 4 financial books for 30 years man'
  );

  const response2 = await model.batch([
    'suggest 4 top nutrition fruits',
    'suggest 4 financial books for 30 years man',
  ]);

  console.log(response2);
}

main();
