/**
 *  Dot product and cosine similarities between embeddings
 */

import { generateEmbedding, loadDataJson } from './main';

function dotProduct(a: number[], b: number[]) {
  return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

function consineSimilarity(a: number[], b: number[]) {
  const product = dotProduct(a, b);
  const aMagnitude = Math.sqrt(
    a.map((value) => value * value).reduce((a, b) => a + b, 0)
  );
  const bMagnitude = Math.sqrt(
    a.map((value) => value * value).reduce((a, b) => a + b, 0)
  );

  return product / (aMagnitude * bMagnitude);
}

async function main() {
  const dataWithEmbeddings = loadDataJson('dataWithEmbeddedings.json');
  const input = 'flower';

  const inputEmbeddings = await generateEmbedding(input);

  const similarities = [];
  for (const entry of dataWithEmbeddings) {
    const similarity = consineSimilarity(
      entry.embedding,
      inputEmbeddings.data[0].embedding
    );

    similarities.push({
      input: entry.input,
      similarity,
    });
  }

  console.log(`Similarity of ${input} with:`);
  const sortedSimilarites = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );

  sortedSimilarites.forEach((data) => {
    console.log(`${data.input}: ${data.similarity}`);
  });
}

main();
