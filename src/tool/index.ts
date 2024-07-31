//configure chat tool
// decide if tool calls is required
// invoke tool
// make a second request with the tool response

import OpenAI from 'openai';
const openai = new OpenAI();

function getTimeOfDay() {
  return '10.20';
}

function getOrderStatus(orderId: string) {
  console.log(`Getting order id ${orderId}`);
  const orderAsNumber = parseInt(orderId);

  if (orderAsNumber % 2 === 0) {
    return 'IN_PROGRESS';
  }
  return 'COMPLETED';
}

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are helpful assistance that gives information and order status',
    },

    {
      role: 'user',
      content: 'What is the order of status 34341 ',
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
          name: 'getOrderStatus',
          description: 'Return the status of order',
          parameters: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
                description: 'The id of order to get status',
              },
            },
            required: ['orderId'],
          },
        },
      },
    ],
    tool_choice: 'auto', // the engine which call to use
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

    if (toolName === 'getOrderStatus') {
      const args = toolCall.function.arguments;
      const parsArgs = JSON.parse(args);
      const toolResp = getOrderStatus(parsArgs.orderId);
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

callOpenAIWithTools();
