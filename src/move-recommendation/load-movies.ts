import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path/posix';
import csvtojsonV2 from 'csvtojson';
import OpenAI from 'openai';

const openai = new OpenAI();
// const csvPath = join(__dirname, 'netflix_titles.csv');

function convertDataToJsonFile(filePath: any, fileName: string) {
  csvtojsonV2()
    .fromFile(filePath)
    .then((jsonData) => {
      const dataString = JSON.stringify(jsonData);
      const dataBuffer = Buffer.from(dataString);
      const path = join(__dirname, fileName);
      writeFileSync(path, dataBuffer);
    });
}

//saveDataToJsonFile(csvPath, 'Netflix - Movies.json');

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

export async function generateEmbedding(input: any | any[]) {
  const response = await openai.embeddings.create({
    input: input,
    model: 'text-embedding-3-small',
  });

  return response;
}

async function main() {
  const loadJsonData = loadDataJson('Netflix_Movies.json');
  const selectedMovieData = loadJsonData.map((movies: any, index: number) => {
    return {
      id: index + 1,
      title: movies.title,
      description: movies.description,
    };
  });
  const sliceMovieData = selectedMovieData
    .slice(0, 1000)
    .map((movie: any) => movie.description);

  const embedded = await generateEmbedding(sliceMovieData);

  const dataWithEmbeddedings = [];
  for (let i = 0; i < sliceMovieData.length; i++) {
    dataWithEmbeddedings.push({
      name: selectedMovieData[i].title,
      description: sliceMovieData[i],
      embedding: embedded.data[i].embedding,
    });
  }

  saveDataToJsonFile(dataWithEmbeddedings, 'netflix-movies-embeddings.json');
}

main();
