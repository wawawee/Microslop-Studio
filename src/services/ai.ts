import { GoogleGenAI } from "@google/genai";

export async function generateCloudImage(prompt: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
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

export async function generateLocalImage(prompt: string, apiUrl: string): Promise<string> {
  try {
    // This is a placeholder for a local API call (e.g., LMStudio, Automatic1111, ComfyUI)
    // We'll simulate it or try to fetch if the user provided a real URL.
    if (!apiUrl || apiUrl.trim() === '') {
       throw new Error("Local API URL is required.");
    }
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x576" // 16:9 approx
      })
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
