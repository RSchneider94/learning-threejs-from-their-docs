import { Animation } from './Animations';
import { Position } from './Common';
import { Text } from 'troika-three-text';

export interface TextElement {
  id: string;
  element: Text;
}

export interface TextConfig {
  fontSize: number;
  color: string | number;
  position: Position;
}

export interface AddTextConfig extends Pick<TextConfig, 'position'> {
  fontSize?: number;
  color?: string | number;
}
