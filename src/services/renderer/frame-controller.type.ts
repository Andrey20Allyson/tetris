import { serviceIdentifier } from "../utils";

export interface IFrameController {
  start(): void;
  pause(): void;
  resume(): void;
  frame(): void;
}

export const FrameControllerType = serviceIdentifier<IFrameController>('FrameController');