import { GoogleGenAI } from "@google/genai";

export async function generateCloudImage(prompt: string, seed?: number, firstFrame?: string, lastFrame?: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const parts: any[] = [{ text: prompt }];

    // If a first frame is provided, add it as an image part for Gemini to use as context
    if (firstFrame) {
      const match = firstFrame.match(/^data:(image\/\w+);base64,(.*)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    // Add last frame if provided
    if (lastFrame) {
      const match = lastFrame.match(/^data:(image\/\w+);base64,(.*)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        seed: seed,
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    // Find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from Cloud API.");
  } catch (error) {
    console.error("Cloud generation error:", error);
    throw error;
  }
}

export async function generateCloudVideo(prompt: string, firstFrame?: string, lastFrame?: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    };

    let imageObj: any = undefined;

    if (firstFrame) {
      const match = firstFrame.match(/^data:(image\/\w+);base64,(.*)$/);
      if (match) {
        imageObj = {
          mimeType: match[1],
          imageBytes: match[2]
        };
      }
    }

    if (lastFrame) {
      const match = lastFrame.match(/^data:(image\/\w+);base64,(.*)$/);
      if (match) {
        config.lastFrame = {
          mimeType: match[1],
          imageBytes: match[2]
        };
      }
    }
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'A scene',
      image: imageObj,
      config: config
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("No video URI returned from Cloud API.");
    }

    const response = await fetch(downloadLink, {
      method: 'GET',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status}`);
    }

    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    console.error("Cloud video generation error:", error);
    throw error;
  }
}

export async function generateLocalImage(prompt: string, apiUrl: string, seed?: number, firstFrame?: string, lastFrame?: string): Promise<string> {
  try {
    // This is a placeholder for a local API call (e.g., LMStudio, Automatic1111, ComfyUI)
    // We'll simulate it or try to fetch if the user provided a real URL.
    if (!apiUrl || apiUrl.trim() === '') {
       throw new Error("Local API URL is required.");
    }
    
    const payload: any = {
      prompt: prompt,
      n: 1,
      size: "1024x576", // 16:9 approx
      seed: seed
    };

    if (firstFrame) {
      payload.image = firstFrame; // often used for init_image in local APIs
    }
    if (lastFrame) {
      payload.image_end = lastFrame; // some video models support this
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Local API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.data && data.data[0] && data.data[0].url) {
       return data.data[0].url;
    } else if (data.data && data.data[0] && data.data[0].b64_json) {
       return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    
    throw new Error("Unexpected response format from Local API.");
  } catch (error) {
    console.error("Local generation error:", error);
    throw error;
  }
}


