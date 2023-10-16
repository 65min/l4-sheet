import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';

export class CellContentDrawer extends BaseDrawer {

  areas: Area[][] | undefined;

  rowNum: number;
  colNum: number;

  private _width: number;
  private _height: number;

  constructor(ctx: CanvasRenderingContext2D, rowNum: number, colNum: number) {
    super(ctx);
    this.rowNum = rowNum;
    this.colNum = colNum;
  }

  draw(): Area[][] {

    state.offsetX;
    state.offsetY;

    this.areas = [];
    this._width = 0;
    this._height = 0;

    let offsetY = config.colHeaderHeight;
    for (let i = 0; i < this.rowNum; i ++) {
      let offsetX = config.rowHeaderWidth;
      this.areas.push([]);

      for (let j = 0; j < this.colNum; j ++) {

        let x = (offsetX - state.offsetX) | 0;
        let y = (offsetY - state.offsetY) | 0;

        if (x + config.colWidth < config.rowHeaderWidth) {
          this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          continue;
        }
        if (x > state.canvasWidth) {
          this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          continue;
        }

        if (y + config.rowHeight < config.colHeaderHeight) {
          this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          // offsetY = offsetY + config.rowHeight;
          continue;
        }
        if (y > state.canvasHeight) {
          this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          // offsetY = offsetY + config.rowHeight;
          continue;
        }

        this.$ctx.fillStyle = '#ffffff';
        this.$ctx.fillRect(x, y, config.colWidth, config.rowHeight);
        this.$ctx.strokeStyle = '#aeaeae';
        this.$ctx.strokeRect(x + .5, y + .5, config.colWidth, config.rowHeight);
        offsetX = offsetX + config.colWidth;

        this.areas[this.areas.length - 1].push(new Area(offsetX, offsetY, config.colWidth, config.rowHeight));
      }
      offsetY = offsetY + config.rowHeight;
    }

    // TODO 宽度和高度先按单元格默认宽度高度计算，后期调整
    this._width = this.colNum * config.colWidth;
    this._height = this.rowNum * config.rowHeight;

    state.contentWidth = this.width;
    state.contentHeight = this.height;

    return this.areas;
  }


  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }
}
