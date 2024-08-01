import OpenAI from 'openai';
const openai = new OpenAI();
import { fetchBooksApi } from './fetch';
const pageNumber = process.argv[2] || '2';

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
      content: 'give detail information',
    },

    {
      role: 'user',
      content:
        '5 books list with number ' +
        pageNumber +
        'there introduction and writer name',
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
          description: 'get booklist based on enter number',
          parameters: {
            type: 'object',
            properties: {
              bookPage: {
                type: 'integer',
                description: 'The bookPage number',
              },
            },
            required: ['bookPage'],
          },
        },
      },
    ],
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
      const args = toolCall.function.arguments;
      const parsArgs = JSON.parse(args);
      console.log('pageArgs', parsArgs);
      const toolResp = await fetchBooksApi(parsArgs.bookPage);
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
