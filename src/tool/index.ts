//configure chat tool
// decide if tool calls is required
// invoke tool
// make a second request with the tool response

import OpenAI from 'openai';
const openai = new OpenAI();

function getTimeOfDay() {
  return '10.20';
}

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are helpful assistance that gives information',
    },

    {
      role: 'user',
      content: 'What is time of the day now morning or evening or night? ',
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
  }

  const secondResp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: context,
  });

  console.log(secondResp.choices[0].message.content);
}

callOpenAIWithTools();
