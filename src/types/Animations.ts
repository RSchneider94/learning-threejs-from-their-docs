import { Position } from './Common';

export interface Animation {
  rotation?: Partial<Position>;
  position?: Partial<Position>;
}

export interface AnimationToExecute {
  elementId: number | string;
  animation: Animation;
}
