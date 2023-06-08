import { Position } from './Common';

export interface TextConfig {
  fontSize: number;
  color: string | number;
  position: Position;
}

export interface AddTextConfig extends Pick<TextConfig, 'position'> {
  fontSize?: number;
  color?: string | number;
}
