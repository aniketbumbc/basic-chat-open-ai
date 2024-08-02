import OpenAI from 'openai';
import { writeFileSync, createReadStream } from 'fs';

const openAI = new OpenAI();

async function createTranscription() {
  const response = await openAI.audio.transcriptions.create({
    file: createReadStream('src/openai-image/audio_test.mp3'),
    model: 'whisper-1',
    language: 'en',
  });

  console.log(response);
}

async function textSpeech() {
  const sampleText =
    "Even before the euphoria of the T20 World Cup win had a chance to fade, Rohit Sharma is gearing up to lead his side in yet another global event in six months. This time, it's a different format, one that India haven't dipped their toes into for more than half of 2024. With only six scheduled games to find their rhythm before the Champions Trophy next year, the Indian captain has clarified that the upcoming ODI series against Sri Lanka in Colombo will not be played on a 'practice ground'. International cricket is serious business, he asserted, even if a few experiments are on the agenda.";

  const response = await openAI.audio.speech.create({
    input: sampleText,
    model: 'tts-1',
    voice: 'alloy',
    response_format: 'mp3',
  });
  console.log(response);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync('src/images/test.mp3', buffer);
}

textSpeech();
