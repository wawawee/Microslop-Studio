export interface GeneratedFrame {
  id: string;
  sceneId: number;
  imageUrl: string;
  prompt: string;
  engine: 'cloud' | 'local';
  timestamp: number;
  seed: number;
  firstFrame?: string;
  lastFrame?: string;
  isVideo?: boolean;
}

export type EngineType = 'cloud' | 'local';


