import OpenAI from 'openai';
const openai = new OpenAI();
let booksData: any = [];
import { fetchBooksApi } from './fetch';

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

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are helpful assistance that gives information for 54 years people',
    },

    {
      role: 'user',
      content: 'I would like to top 10 books from list',
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

      {
        type: 'function',
        function: {
          name: 'fetchBooksApi',
          description: 'Getting the list of the books from goodReaders.',
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

    if (toolName === 'fetchBooksApi') {
      const toolResp = await fetchBooksApi().then((data) => data);
      const newJsonResp = JSON.stringify(toolResp);
      context.push(response.choices[0].message);
      context.push({
        role: 'tool',
        content: newJsonResp,
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

callOpenAIWithTools();
