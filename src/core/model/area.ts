import {Point} from './point.ts';


export class Area {
  x1: number;
  y1: number;

  x2: number;
  y2: number;

  p1: Point;
  p2: Point;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = Math.min(x1, x2);
    this.y1 = Math.min(y1, y2);
    this.x2 = Math.max(x1, x2);
    this.y2 = Math.max(y1, y2);

    this.p1 = new Point(this.x1, this.y1);
    this.p2 = new Point(this.x2, this.y2);
  }
}
