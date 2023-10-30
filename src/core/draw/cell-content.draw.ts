import {BaseDrawer} from './base.draw.ts';
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

  deltaX: number;
  deltaRow: number;
  deltaY: number;
  deltaCol: number;

  beginRow: number;
  endRow: number;
  beginCol: number;
  endCol: number;

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

  public computeDeltaXY(offsetX: number, offsetY: number): [number, number, number, number] {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;

    let beginRow, endRow, beginCol, endCol;

    for (let i = 0; i < cacheStore.totalColWidthArr.length; i++) {
      const totalColWidth = cacheStore.totalColWidthArr[i];
      let preTotalColWidth: number;
      if (i === 0) {
        preTotalColWidth = 0;
      } else {
        preTotalColWidth = cacheStore.totalColWidthArr[i - 1];
      }

      if (preTotalColWidth <= offsetX && totalColWidth > offsetX) {
        beginCol = i;
      }
      if (totalColWidth > offsetX + state.viewWidth) {
        endCol = i;
        break;
      }
    }
    for (let i = 0; i < cacheStore.totalRowHeightArr.length; i++) {
      const totalRowHeight = cacheStore.totalRowHeightArr[i];
      let preTotalRowWidth: number;
      if (i === 0) {
        preTotalRowWidth = 0;
      } else {
        preTotalRowWidth = cacheStore.totalRowHeightArr[i - 1];
      }

      if (preTotalRowWidth <= offsetY && totalRowHeight > offsetY) {
        beginRow = i;
      }
      if (totalRowHeight > offsetY + state.viewHeight) {
        endRow = i;
        break;
      }
    }

    return [beginRow, endRow, beginCol, endCol];
  }

  draw(): Area[][] {

    this.areas = areaStore.cellContentArea;
    const [beginRow, endRow, beginCol, endCol] = this.computeDeltaXY(state.offsetX, state.offsetY);
    for (let i = 0; i <= endRow; i++) {
      this.areas[i] = new Array(this.colNum).fill(null);
    }

    this.beginRow = beginRow;
    this.endRow = endRow;
    this.beginCol = beginCol;
    this.endCol = endCol;
    for (let i = this.beginRow; i <= this.endRow; i ++) {

      let cellHeight = cacheStore.rowHeightArr[i];

      for (let j = this.beginCol; j <= this.endCol; j ++) {

        let offsetX = config.rowHeaderWidth;
        if (j > 0) {
          offsetX = cacheStore.totalColWidthArr[j - 1] + config.rowHeaderWidth;
        }
        let offsetY  = config.colHeaderHeight;
        if (i > 0) {
          offsetY = cacheStore.totalRowHeightArr[i - 1] + config.colHeaderHeight;
        }

        let cellWidth = cacheStore.colWidthArr[j];
        let x = Math.floor(offsetX - state.offsetX);
        let y = Math.floor(offsetY - state.offsetY);

        CanvasUtil.drawRect(this.$ctx, x, y, cellWidth, cellHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
        this.areas[i][j] = new Area(x, y, x + cellWidth, y + cellHeight);
      }
    }

    state.contentWidth = cacheStore.totalColWidthArr[cacheStore.totalColWidthArr.length - 1];
    state.contentHeight = cacheStore.totalRowHeightArr[cacheStore.totalRowHeightArr.length - 1];

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
