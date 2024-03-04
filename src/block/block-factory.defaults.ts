import { Vec2 } from "../base/vec";
import { CreateBlockOptions } from "../services/game/game.type";

export const BLOCK_OPTIONS_PRESET: CreateBlockOptions[] = [{
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
  ],
  color: '#f700ff'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
  ],
  color: '#00f'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(1, -1)
  ],
  color: '#0e0'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(0, -1)
  ],
  color: '#f60'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(0, -1),
    new Vec2(1, -1)
  ],
  color: '#ed0'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(-1, -1)
  ],
  color: '#0fd'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(-2, 0)
  ],
  color: '#ff8282'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(-2, 0),
    new Vec2(2, 0)
  ],
  color: '#b700ff'
}, {
  body: [
    new Vec2(0, 0),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(-1, -1),
    new Vec2(1, -1)
  ],
  color: '#8a1c00'
}];