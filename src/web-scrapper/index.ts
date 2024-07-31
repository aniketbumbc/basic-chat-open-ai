import OpenAI from 'openai';
const openai = new OpenAI();
let booksData: any = [];
import { fetBooksApi } from './fetch';

function getTimeOfDay() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let timeOfDay = 'AM';
  if (hours > 12) {
    hours = hours - 12;
    timeOfDay = 'PM';
  }

  return hours + ':' + minutes + ':' + seconds + ' ' + timeOfDay;
}

async function getBookList() {
  return await fetBooksApi().then((data) => {
    if (data.length) {
      booksData = data;
      printData(booksData);
    }
  });
}

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are helpful assistance that gives information for 54 years people',
    },

    {
      role: 'user',
      content: 'Get current time of the day and tell me what to eat,wear drink',
    },
  ];
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: context,
    tools: [
      {
        type: 'function',
        function: {
          name: 'getTimeOfDay',
          description: 'Get the time of day',
        },
      },
    ],
    tool_choice: 'auto',
  });

  const willInvokeFunction = response.choices[0].finish_reason === 'tool_calls';
  const toolCall = response.choices[0].message.tool_calls![0];

  if (willInvokeFunction) {
    const toolName = toolCall.function.name;
    if (toolName === 'getTimeOfDay') {
      const toolResp = getTimeOfDay();
      context.push(response.choices[0].message);
      context.push({
        role: 'tool',
        content: toolResp,
        tool_call_id: toolCall.id,
      });
    }
  }

  const secondResp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: context,
  });

  console.log(secondResp.choices[0].message.content);
}

//callOpenAIWithTools();
getBookList();
function printData(booksData: any) {
  console.log(booksData);
}
