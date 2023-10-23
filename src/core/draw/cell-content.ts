import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import areaStore from '../store/area.store.ts';
import cacheStore from '../store/cache.store.ts';

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

    this.areas = [];
    this.width = 0;
    this.height = 0;

    let offsetY = config.colHeaderHeight;
    let width = 0;
    // let height = 0;

    for (let i = 0; i < this.rowNum; i ++) {

      const lineArray = new Array(this.colNum).fill(null);
      this.areas.push(lineArray);

      let offsetX = config.rowHeaderWidth;
      let cellHeight = cacheStore.rowHeightArr[i];

      for (let j = 0; j < this.colNum; j ++) {

        let cellWidth = cacheStore.colWidthArr[j];
        let x = Math.floor(offsetX - state.offsetX);
        let y = Math.floor(offsetY - state.offsetY);

        if (i === 0) {
          width = width + cellWidth;
        }

        if (x + cellWidth < config.rowHeaderWidth) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + cellWidth;
          continue;
        }
        if (x > state.canvasWidth) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + cellWidth;
          continue;
        }

        if (y + cellHeight < config.colHeaderHeight) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + cellWidth;
          // offsetY = offsetY + config.rowHeight;
          continue;
        }
        if (y > state.canvasHeight) {
          // this.areas[this.areas.length - 1].push(null);
          offsetX = offsetX + cellWidth;
          // offsetY = offsetY + config.rowHeight;
          // continue;
          break;
        }

        CanvasUtil.drawRect(this.$ctx, x, y, cellWidth, cellHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
        offsetX = offsetX + cellWidth;

        lineArray[j] = new Area(x, y, x + cellWidth, y + cellHeight);
        // this.areas[this.areas.length - 1].push(new Area(x, y, x + config.colWidth, y + config.rowHeight));
      }
      offsetY = offsetY + cellHeight;
    }

    // 宽度和高度先按单元格默认宽度高度计算，后期调整
    this.width = width;
    // this.height = this.rowNum * config.rowHeight;

    // 计算高度
    let height = 0;
    for (let i = 0; i < state.rowNum; i++) {
      const row = state.rows[i];
      if (!row) {
        height = height + config.rowHeight;
      } else {
        height = height + row.h || config.rowHeight;
      }
    }
    this.height = height;

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

    CanvasUtil.drawRect(this.$ctx, area.x1, area.y1, cacheStore.colWidthArr[ci], cacheStore.rowHeightArr[ri], {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
  }
}
