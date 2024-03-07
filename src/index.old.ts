import 'reflect-metadata';
import './index.css';

let delta = 0;

const cv = document.querySelector<HTMLCanvasElement>('#screen')!;
const ctx = cv.getContext('2d')!;

const next_block_display_cv = document.querySelector<HTMLCanvasElement>('#next-block')!;
const next_block_display_ctx = next_block_display_cv.getContext('2d')!;

const points_display = document.querySelector<HTMLParagraphElement>('#points-display')!;

let random_block_factories = [
  () => FallingBlock({ body: [[0, 0], [1, 0]], color: '#f700ff' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0]], color: '#00f' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [1, -1]], color: '#0e0' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [0, -1]], color: '#f60' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [0, -1], [1, -1]], color: '#ed0' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [-1, -1]], color: '#0fd' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [-2, 0]], color: '#ff8282' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [-2, 0], [2, 0]], color: '#b700ff' }),
  () => FallingBlock({ body: [[0, 0], [1, 0], [-1, 0], [-1, -1], [1, -1]], color: '#8a1c00' }),
];

const debug_line = {
  '1:15': [1, 15, '#fff'],
  '2:15': [2, 15, '#fff'],
  '3:15': [3, 15, '#fff'],
  '4:15': [4, 15, '#fff'],
  '5:15': [5, 15, '#fff'],
  '6:15': [6, 15, '#fff'],
  '7:15': [7, 15, '#fff'],
  '8:15': [8, 15, '#fff'],
  '9:15': [9, 15, '#fff'],
  '10:15': [10, 15, '#fff'],
  '11:15': [11, 15, '#fff'],
  '12:15': [12, 15, '#fff'],
  '13:15': [13, 15, '#fff'],
  '14:15': [14, 15, '#fff'],
  '15:15': [15, 15, '#fff'],
}

const grid_width = cv.width;
const grid_height = cv.height;
const grid: Partial<Record<string, GridValue>> = {};

let points = 0;
let is_running = true;
let next_block = random_block();
let falling_block = get_next_block();

type Vec2Tuple = [x: number, y: number];
type GridValue = [x: number, y: number, color: string]

interface FallignBlockOptions {
  pos?: Vec2Tuple;
  body: Vec2Tuple[];
  color?: string;
}

update_points_display();

function FallingBlock({ pos = [7, 0], body, color = '#fff' }: FallignBlockOptions) {
  return {
    pos,
    body,
    color,
    movement_queue: [] as number[],
    fast_fall: false,
    rotate_times: 0
  };
}

function update_points_display() {
  points_display.innerText = `[ Points ${points} ]`;
}

function draw_next_block_on_display() {
  const { width, height } = next_block_display_cv;
  next_block_display_ctx.clearRect(0, 0, width, height);

  for (const part of iter_falling_parts(next_block)) {
    next_block_display_ctx.fillStyle = next_block.color;
    next_block_display_ctx.fillRect(part.x - 5, part.y + 2, 1, 1);
  }
}

function get_next_block() {
  const block = next_block;
  next_block = random_block();

  return block;
}

function random_block() {
  const index = Math.trunc(Math.random() * random_block_factories.length);

  return random_block_factories[index]();
}

function get_rotated_falling_block_body() {
  const rotated_body: Vec2Tuple[] = [];

  for (let [dx, dy] of falling_block.body) {
    // Aplica a rotação 90 graus no sentido anti-horário
    // (troca x e y, invertendo o sinal do x)
    const rotated_x = -dy;
    const rotated_y = dx;

    rotated_body.push([rotated_x, rotated_y]);
  }

  return rotated_body;
}

function check_game_over() {
  for (let collumn = 0; collumn < grid_width; collumn++) {
    if (grid[`${collumn}:0`] !== undefined) {
      return true;
    }
  }

  return false;
}

function make_fall_grid_lines(end = grid_height) {
  for (let line = end; line >= 0; line--) {
    for (let collumn = 0; collumn < grid_width; collumn++) {
      const old_key = `${collumn}:${line}`;

      const value = grid[old_key];
      if (value === undefined) continue;

      const [x, y, color] = value;
      const next_y = y + 1;

      grid[`${x}:${next_y}`] = [x, next_y, color];
      delete grid[old_key];
    }
  }

  console.log(grid);
}

function destroy_completed_lines() {
  const changed_lines = Object
    .values(Array
      .from(iter_falling_parts())
      .reduce((acc, { y }) => {
        acc[y] = y;
        return acc;
      }, {} as Record<number, number>));

  let completed_lines = [];

  for (const line of changed_lines) {
    let is_completed = true;

    for (let collumn = 0; collumn < grid_width; collumn++) {
      if (grid[`${collumn}:${line}`] === undefined) {
        is_completed = false;
        break;
      }
    }

    if (is_completed) {
      completed_lines.push(line);
    }
  }

  for (const line of completed_lines) {
    for (let collumn = 0; collumn < grid_width; collumn++) {
      delete grid[`${collumn}:${line}`];
    }

    make_fall_grid_lines(line);
  }

  return completed_lines.length;
}

function can_rotate(rotated_body = get_rotated_falling_block_body()) {
  for (let [dx, dy] of rotated_body) {
    const [ox, oy] = falling_block.pos;
    const x = ox + dx;
    const y = oy + dy;

    if (x < 0 || x > grid_width - 1 || y > grid_height - 1 || grid[`${x}:${y}`] !== undefined) {
      return false;
    }
  }

  return true;
}

function draw() {
  draw_next_block_on_display();

  ctx.clearRect(0, 0, cv.width, cv.height);

  for (const key in grid) {
    let [x, y, color] = grid[key]!;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  for (const part of iter_falling_parts()) {
    ctx.fillStyle = falling_block.color;
    ctx.fillRect(part.x, part.y, 1, 1);
  }
}

function* iter_falling_parts(block = falling_block) {
  for (let [dx, dy] of block.body) {
    let [ox, oy] = block.pos;

    let x = ox + dx;
    let y = oy + dy;

    yield { x, y };
  }
}

function rotate_block() {
  falling_block.rotate_times++;
}

function frame() {
  if (is_running === false) return;

  requestAnimationFrame(frame);

  draw()
}

function freeze_falling_block() {
  for (const part of iter_falling_parts()) {
    grid[`${part.x}:${part.y}`] = [part.x, part.y, falling_block.color];
  }

  const destroyed_lines = destroy_completed_lines();

  if (destroyed_lines > 0) {
    points += grid_width * destroyed_lines ** 3;
    update_points_display();
  }

  const is_game_over = check_game_over();

  if (is_game_over) {
    is_running = false;

    return;
  }

  falling_block = get_next_block();
}

function tick() {
  if (is_running === false) return;

  delta++;
  setTimeout(tick, 1000 / 20);

  if (falling_block.rotate_times > 0) {
    falling_block.rotate_times -= 1;

    const rotated_body = get_rotated_falling_block_body();

    if (can_rotate(rotated_body)) {
      falling_block.body = rotated_body;
    }
  }

  let x_movement = falling_block.movement_queue.shift();

  if (x_movement !== undefined) {
    let can_move_on_x = true;

    for (const part of iter_falling_parts()) {
      const next_x_pos = part.x + x_movement;

      if (next_x_pos < 0 || next_x_pos > 15) {
        can_move_on_x = false;
        break;
      }

      if (grid[`${next_x_pos}:${part.y}`] !== undefined) {
        can_move_on_x = false;
        break;
      }
    }

    if (can_move_on_x) {
      falling_block.pos[0] += x_movement;
    }
  }

  if (delta % (falling_block.fast_fall ? 1 : 10) === 0) {
    let can_move = true;
    for (const part of iter_falling_parts()) {
      if (part.y >= grid_height - 1) {
        can_move = false;
        break;
      }

      if (grid[`${part.x}:${part.y + 1}`] !== undefined) {
        can_move = false;
        break;
      }
    }

    if (can_move === false) {
      freeze_falling_block();
      return;
    }

    falling_block.pos[1] += 1;
  }
}

function handle_keyboard_event(ev: KeyboardEvent) {
  if (ev.type === 'keydown') {
    switch (ev.code) {
      case 'ArrowLeft':
        falling_block.movement_queue.push(-1);
        return;
      case 'ArrowRight':
        falling_block.movement_queue.push(1);
        return;
      case 'ArrowDown':
        falling_block.fast_fall = true;
        return;
      case 'ArrowUp':
        rotate_block();
        return;
    }

    return;
  }

  if (ev.type === 'keyup') {
    switch (ev.code) {
      case 'ArrowDown':
        falling_block.fast_fall = false;
        return;
    }

    return;
  }
}

tick();
frame();

document.addEventListener('keydown', handle_keyboard_event);
document.addEventListener('keyup', handle_keyboard_event);