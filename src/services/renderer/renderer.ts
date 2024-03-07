import { inject, injectable } from "inversify";
import { GameEventsType, IGameEvents, OnBeforeFrame, OnFrame } from "../events/game-events.type";
import { GameType, IGame } from "../game/game.type";
import { serviceIdentifier } from "../utils";
import { BlockRendererType, IBlockRenderer } from "./block-renderer";
import { GridRendererType, IGridRenderer } from "./grid-renderer";
import { GameScreenType, IGameScreen } from "./screen.type";

@injectable()
export class Renderer implements IRenderer, OnBeforeFrame, OnFrame {
  @inject(GameScreenType)
  readonly screen!: IGameScreen;

  @inject(BlockRendererType)
  readonly blockRenderer!: IBlockRenderer;

  @inject(GridRendererType)
  readonly gridRenderer!: IGridRenderer;

  @inject(GameType)
  readonly game!: IGame;

  constructor(
    @inject(GameEventsType)
    readonly events: IGameEvents,
  ) {
    this.events.beforeFrame.subscribe(this);
    this.events.frame.subscribe(this);
  }

  get ctx() {
    return this.screen.context;
  }

  onBeforeFrame(): void {
    this.clearScreen();
  }

  onFrame(): void {
    this.render();
  }

  clearScreen(): void {
    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);

    this.gridRenderer.render(this.game.grid());

    this.blockRenderer.render(this.game.getCurrentBlock());
  }
}

export interface IRenderer {
  render(): void;
}

export const RendererType = serviceIdentifier<IRenderer>('Renderer');