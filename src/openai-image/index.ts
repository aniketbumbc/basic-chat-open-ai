import OpenAI from 'openai';
import { writeFileSync } from 'fs';
import path from 'path';
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

// Save locally image

async function generateImageAndSave() {
  const response = await openai.images.generate({
    prompt: QUESTION,
    model: 'dall-e-2',
    style: 'vivid',
    size: '512x512',
    n: 1,
    response_format: 'b64_json',
  });
  const rawImage = response.data[0].b64_json;

  if (rawImage) {
    const nameImage = `${response.created}.png`;
    const folderPath = 'src/images';
    const filePath = path.join(folderPath, nameImage);
    writeFileSync(filePath, Buffer.from(rawImage, 'base64'));
  }
}

async function generateAdvanceImageAndSave() {
  const response = await openai.images.generate({
    prompt: QUESTION,
    model: 'dall-e-3',
    quality: 'hd',
    size: '1024x1024',

    response_format: 'b64_json',
  });
  const rawImage = response.data[0].b64_json;

  if (rawImage) {
    const nameImage = `${response.created}.png`;
    const folderPath = 'src/images';
    const filePath = path.join(folderPath, nameImage);
    writeFileSync(filePath, Buffer.from(rawImage, 'base64'));
  }
}

generateAdvanceImageAndSave();
