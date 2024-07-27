import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openai = new OpenAI();

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are helpful chatbot give answers short',
  },
];

async function createChatCompletion() {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: context,
  });

  const responseMessages = response.choices[0].message;

  context.push({
    role: 'assistant',
    content: responseMessages.content,
  });

  console.log(
    `${response.choices[0].message.role}: ${response.choices[0].message.content}`
  );
}

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: 'user',
    content: userInput,
  });
  await createChatCompletion();
});
