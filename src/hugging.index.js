import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';

const promptValue = process.argv.slice(2)[0];
const imageName = Math.random(10).toFixed(2);

const payload = {
  prompt: 'Lighthouse on a cliff overlooking the ocean',
  output_format: 'jpeg',
};

const response = await axios.postForm(
  `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
  axios.toFormData(payload, new FormData()),
  {
    validateStatus: undefined,
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${process.env.IMAGE_API_KEY}`,
      Accept: 'image/*',
    },
  }
);

if (response.status === 200) {
  fs.writeFileSync(
    `./src/images/${promptValue + imageName}.jpeg`,
    Buffer.from(response.data)
  );
} else {
  throw new Error(`${response.status}: ${response.data.toString()}`);
}
