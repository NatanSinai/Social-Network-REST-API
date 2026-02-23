import { GoogleGenAI } from '@google/genai';
import { envVar } from '@utils';
import axios from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { v4 as uuidv4 } from 'uuid';

export default class AIService {
  private ai = new GoogleGenAI({ apiKey: envVar.GEMINI_API_KEY });

  async generateImage(prompt: string) {
    const response = await axios.post(
      'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3-medium-diffusers',
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${envVar.HUGGING_FACE_API_KEY}`, Accept: 'image/png' },
        responseType: 'arraybuffer',
      },
    );

    const fileName = `${uuidv4()}.jpg`;
    const filePath = join(cwd(), envVar.FILE_UPLOADS_BASE_PATH, fileName);

    writeFileSync(filePath, Buffer.from(response.data));

    const fullFilePathInServer = `${envVar.BASE_URL}/${envVar.FILE_UPLOADS_BASE_PATH}/${fileName}`;

    return fullFilePathInServer;
  }

  async generateContent(title: string, imageBuffer: Buffer) {
    const prompt = `
Write ONE short, natural-sounding social media post (max 2 sentences) based on this title: "${title}".

Do not provide multiple options.
Do not explain anything.
Do not add commentary.
Avoid excessive hashtags.
Keep it warm, simple, and realistic.
`;

    const result = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }, { inlineData: { data: imageBuffer.toString('base64'), mimeType: 'image/jpeg' } }],
        },
      ],
    });

    return result.text || '';
  }
}
