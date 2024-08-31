import { HfInference } from '@huggingface/inference';
import { writeFile } from 'fs/promises';
import path from 'path';

const inference = new HfInference(process.env.HF_TOKEN);

console.log(process.env.HF_TOKEN);

async function embed() {
  const output = await inference.textToImage({
    inputs: 'watching cat with iphone and samsung tv',
    model: 'stabilityai/stable-diffusion-2-1',
  });

  console.log(output);

  const buffer = await output.arrayBuffer();

  const folderPath = 'src/images';
  const fileName = `${Date.now().toString()}.jpg`;
  const filePath = path.join(folderPath, fileName);
  // Saving image
  await writeFile(filePath, Buffer.from(buffer));
}

embed();
