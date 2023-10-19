import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import areaStore from '../store/area.store.ts';

export class CellContentDrawer extends BaseDrawer {

  areas: Area[][] | undefined;

  rowNum: number;
  colNum: number;

  private _width: number;
  private _height: number;


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

  constructor(ctx: CanvasRenderingContext2D, rowNum: number, colNum: number) {
    super(ctx);
    this.rowNum = rowNum;
    this.colNum = colNum;
  }

  draw(): Area[][] {
    //
    // state.offsetX;
    // state.offsetY;

    this.areas = [];
    this._width = 0;
    this._height = 0;

    let offsetY = config.colHeaderHeight;
    for (let i = 0; i < this.rowNum; i ++) {
      const lineArray = new Array(this.colNum).fill(null);
      this.areas.push(lineArray);

      let offsetX = config.rowHeaderWidth;

      for (let j = 0; j < this.colNum; j ++) {

        let x = Math.floor(offsetX - state.offsetX);
        let y = Math.floor(offsetY - state.offsetY);

        if (x + config.colWidth < config.rowHeaderWidth) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          continue;
        }
        if (x > state.canvasWidth) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          continue;
          break;
        }

        if (y + config.rowHeight < config.colHeaderHeight) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          // offsetY = offsetY + config.rowHeight;
          continue;
        }
        if (y > state.canvasHeight) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + config.colWidth;
          // offsetY = offsetY + config.rowHeight;
          // continue;
          break;
        }

        CanvasUtil.drawRect(this.$ctx, x, y, config.colWidth, config.rowHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
        offsetX = offsetX + config.colWidth;

        lineArray[j] = new Area(x, y, x + config.colWidth, y + config.rowHeight);
        // this.areas[this.areas.length - 1].push(new Area(x, y, x + config.colWidth, y + config.rowHeight));
      }
      offsetY = offsetY + config.rowHeight;
    }

    // TODO 宽度和高度先按单元格默认宽度高度计算，后期调整
    this.width = this.colNum * config.colWidth;
    this.height = this.rowNum * config.rowHeight;

    state.contentWidth = this.width;
    state.contentHeight = this.height;

    return this.areas;
  }

  /**
   * 根据行index和列index绘制单元格
   *
   * @param ri
   * @param ci
   */
  public drawCell(ri: number, ci: number) {
    if (ri < 0) {
      return ;
    }
    if (ri >= state.rowNum) {
      return ;
    }
    if (ci < 0) {
      return ;
    }
    if (ci >= state.colNum) {
      return ;
    }
    const area = areaStore.cellContentArea[ri][ci];
    if (area === null) {
      return ;
    }

    CanvasUtil.drawRect(this.$ctx, area.x1, area.y1, config.colWidth, config.rowHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});

  }
}
