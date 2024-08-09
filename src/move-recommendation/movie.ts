import OpenAI from 'openai';
import { join } from 'path/posix';
import { readFileSync, writeFileSync } from 'fs';
import { consineSimilarity, dotProduct } from '../embeddings/util';
const openai = new OpenAI();

console.log('What movies do you like?');
console.log('...............');
process.stdin.addListener('data', async function (input) {
  let userInput = input.toString().trim();
  await main(userInput);
});

export async function generateEmbedding(input: any | any[]) {
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

async function main(input: any) {
  const dataWithEmbeddings = loadDataJson('netflix-movies-embeddings.json');
  const inputEmbeddings = await generateEmbedding(input);
  const similarities = [];
  for (const entry of dataWithEmbeddings) {
    const similarity = consineSimilarity(
      entry.embedding,
      inputEmbeddings.data[0].embedding
    );
    similarities.push({
      input: entry.name,
      similarity,
    });
  }
  console.log(`Similarity of ${input} with:`);
  const sortedSimilarites = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  sortedSimilarites.slice(0, 5).forEach((data) => {
    console.log(`${data.input}: ${data.similarity}`);
  });
}
