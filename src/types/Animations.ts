import { Position } from './Common';

interface Animation {
  rotation?: Partial<Position>;
  position?: Partial<Position>;
}

export interface AnimationToExecute {
  elementId: number | string;
  animation: Animation;
}
