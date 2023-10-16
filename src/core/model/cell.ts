import {Point} from './point.ts';


export class Cell {
  /**
   * 初始位置
   */
  point: Point | undefined;
  /**
   * 位移
   */
  offset: Point | undefined;
  /**
   * 实际位置
   */
  position: Point | undefined;
  width: number = 0;

  height: number = 0;
}
