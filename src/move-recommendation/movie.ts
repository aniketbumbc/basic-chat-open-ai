import OpenAI from 'openai';
import { join } from 'path/posix';
import { readFileSync, writeFileSync } from 'fs';
import csvtojsonV2 from 'csvtojson';
const openai = new OpenAI();

//const CsvPath = join(__dirname, 'netflix_titles.csv');

// csvtojsonV2()
//   .fromFile(CsvPath)
//   .then((jsonData) => {
//     const dataString = JSON.stringify(jsonData);
//     const dataBuffer = Buffer.from(dataString);
//     const path = join(__dirname, 'movie.json');
//     writeFileSync(path, dataBuffer);
//   });

const movieData = [
  {
    title: 'Latino',
    description:
      'On this reality show, singles from Latin America and Spain are challenged to give up sex. But here, abstinence comes with a silver lining: US$100,000.',
  },
  {
    title: 'A StoryBots Space Adventure',
    description:
      "Join the StoryBots and the space travelers of the historic Inspiration4 mission as they search for answers to kids' questions about space.",
  },
  {
    title: 'Travels with My Father',
    description:
      'Jovial comic Jack Whitehall invites his stuffy father, Michael, to travel with him through Southeast Asia in an attempt to strengthen their bond.',
  },
];

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

function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataBuffer);
  console.log(`Saved data to ${fileName}`);
}

async function main() {
  // const data = loadDataJson('movie.json');
  const titles = movieData.map((movie) => movie.title);
  const embedded = await generateEmbedding(titles);
  const dataWithEmbeddedings = [];
  for (let i = 0; i < titles.length; i++) {
    dataWithEmbeddedings.push({
      input: titles[i],
      embedding: embedded.data[i].embedding,
    });
  }
  saveDataToJsonFile(dataWithEmbeddedings, 'movieDataWithEmbeddedings.json');
}

main();
