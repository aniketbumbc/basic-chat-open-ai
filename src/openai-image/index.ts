import OpenAI from 'openai';

const openai = new OpenAI();

const QUESTION = process.argv[2] || 'Basket ball paying cat';

async function generateImage() {
  const response = await openai.images.generate({
    prompt: QUESTION,
    model: 'dall-e-2',
    style: 'vivid',
    size: '512x512',
    n: 1,
  });

  console.log(response);
}

generateImage();
