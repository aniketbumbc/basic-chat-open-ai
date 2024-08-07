import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';
import { join } from 'path/posix';
const openai = new OpenAI();

export async function generateEmbedding(input: string | string[]) {
  const response = await openai.embeddings.create({
    input: input,
    model: 'text-embedding-3-small',
  });
  return response;
}

export function loadDataJson(fileName: string) {
  const path = join(__dirname, fileName);
  const rawData = readFileSync(path);
  return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataBuffer);
  console.log(`Saved data to ${fileName}`);
}

async function main() {
  const data = loadDataJson('data.json');
  const embedded = await generateEmbedding(data);
  const dataWithEmbeddedings = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddedings.push({
      input: data[i],
      embedding: embedded.data[i].embedding,
    });
  }

  saveDataToJsonFile(dataWithEmbeddedings, 'dataWithEmbeddedings.json');
}

main();
