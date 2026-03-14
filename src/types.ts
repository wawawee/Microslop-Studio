export interface GeneratedFrame {
  id: string;
  sceneId: number;
  imageUrl: string;
  prompt: string;
  engine: 'cloud' | 'local';
  timestamp: number;
}

export type EngineType = 'cloud' | 'local';
