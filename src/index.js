import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openai = new OpenAI();

async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Your response will be like 35 years human',
      },
      {
        role: 'user',
        content: 'how tall mount everest is?',
      },
    ],
  });

  console.log(response.choices[0].message);
  console.log(response.choices[0].message.content);
}

/**
 *  To understand token
 */

// function encodePrompt() {
//   const prompt = 'how are you today';
//   const encoder = encoding_for_model('gpt-3.5-turbo');
//   const words = encoder.encode(prompt);
//   console.log(words);
// }

// encodePrompt();

main();
