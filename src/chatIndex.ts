import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openai = new OpenAI();
const encoder = encoding_for_model('gpt-3.5-turbo');
const MAX_TOKENS = 40;

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

  if (response.usage && response.usage.total_tokens > MAX_TOKENS) {
    deleteOlderMessages();
  }

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

function deleteOlderMessages() {
  let contextLength = getContextLength();

  console.log('Current Context Length', contextLength);

  while (contextLength > MAX_TOKENS) {
    for (let i = 0; i < context.length; i++) {
      const message = context[i];
      if (message.role != 'system') {
        context.splice(i, 1);
        contextLength = getContextLength();
        console.log('New context length: ' + contextLength);
        break;
      }
    }
  }
}

function getContextLength() {
  let length = 0;
  context.forEach((msg) => {
    if (typeof msg.content == 'string') {
      length += encoder.encode(msg.content).length;
    } else if (Array.isArray(msg.content)) {
      msg.content.forEach((msgContent) => {
        if (msgContent.type == 'text') {
          length += encoder.encode(msgContent.text).length;
        }
      });
    }
  });

  return length;
}
