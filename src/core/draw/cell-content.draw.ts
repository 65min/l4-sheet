import {BaseDrawer} from './base.draw.ts';
import {Area} from '../model/area.ts';
import state, {MergeCell} from '../store/state.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import areaStore from '../store/area.store.ts';
import cacheStore from '../store/cache.store.ts';
import {CellIndex} from '../def/cell-area.ts';
import {CellIndexUtil} from '../utils/cell-index.util.ts';

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

  offsetX: number;
  offsetY: number;

  restOffsetX: number = 0; // 遮挡单元格的被遮挡部分x长度
  restOffsetY: number = 0; // 遮挡单元格的被遮挡部分y长度

  beginRow: number = 0;
  endRow: number;
  beginCol: number = 0;
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

  public computeDeltaXY(offsetX: number, offsetY: number, deltaX: number = 0, deltaY: number = 0): [number, number, number, number] {

    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    deltaX = (deltaX || 0);
    deltaY = (deltaY || 0);

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.deltaX = deltaX;
    this.deltaY = deltaY;

    if (deltaX || deltaY) {
      // debugger;
    }

    if (deltaY >= 0) {
      let totalHeight = -this.restOffsetY;
      for (let i = this.beginRow; i < cacheStore.rowHeightArr.length; i++) {
        totalHeight = totalHeight + cacheStore.rowHeightArr[i];
        if (deltaY > totalHeight) {
          this.beginRow = i;
        } else {
          break;
        }
      }
      totalHeight = -this.restOffsetY;
      for (let i = this.endRow; i < cacheStore.rowHeightArr.length; i++) {
        totalHeight = totalHeight + cacheStore.rowHeightArr[i];
        if (deltaY > totalHeight) {
          this.endRow = i;
        } else {
          break;
        }
      }
    } else {
      let totalHeight = this.restOffsetY;
      for (let i = this.beginRow; i >= 0; i--) {
        totalHeight = totalHeight + cacheStore.rowHeightArr[i];
        if (-deltaY > totalHeight) {
          this.beginRow = i;
        } else {
          break;
        }
      }
      totalHeight = this.restOffsetY;
      for (let i = this.endRow; i >= 0; i--) {
        totalHeight = totalHeight + cacheStore.rowHeightArr[i];
        if (-deltaY > totalHeight) {
          this.endRow = i;
        } else {
          break;
        }
      }
    }

    if (deltaX >= 0) {
      let totalWidth = -this.restOffsetX;
      for (let i = this.beginCol; i < cacheStore.colWidthArr.length; i++) {
        totalWidth = totalWidth + cacheStore.colWidthArr[i];
        if (deltaX > totalWidth) {
          this.beginCol = i;
        } else {
          break;
        }
      }
      totalWidth = -this.restOffsetX;
      for (let i = this.endCol; i < cacheStore.colWidthArr.length; i++) {
        totalWidth = totalWidth + cacheStore.colWidthArr[i];
        if (deltaX > totalWidth) {
          this.endCol = i;
        } else {
          break;
        }
      }
    } else {
      let totalWidth = this.restOffsetX;
      for (let i = this.beginCol; i >= 0; i--) {
        totalWidth = totalWidth + cacheStore.colWidthArr[i];
        if (-deltaX > totalWidth) {
          this.beginCol = i;
        } else {
          break;
        }
      }
      totalWidth = this.restOffsetX;
      for (let i = this.endCol; i >= 0; i--) {
        totalWidth = totalWidth + cacheStore.colWidthArr[i];
        if (-deltaX > totalWidth) {
          this.endCol = i;
        } else {
          break;
        }
      }
    }

    let beginRow, endRow, beginCol, endCol;

    if (deltaX >= 0) {
      for (let i = (this.beginCol || 0); i < cacheStore.totalColWidthArr.length; i++) {
        const totalColWidth = cacheStore.totalColWidthArr[i];
        let preTotalColWidth: number;
        if (i === 0) {
          preTotalColWidth = 0;
        } else {
          preTotalColWidth = cacheStore.totalColWidthArr[i - 1];
        }

        if (preTotalColWidth <= offsetX && totalColWidth > offsetX) {
          beginCol = i;
          this.restOffsetX = offsetX - preTotalColWidth;
        }
        if (totalColWidth > offsetX + state.viewWidth) {
          endCol = i;
          break;
        }
      }
      const rightOffsetX = offsetX + state.viewWidth;
      for (let i = (this.endCol || 0); i < cacheStore.totalColWidthArr.length; i++) {
        const totalColWidth = cacheStore.totalColWidthArr[i];
        let preTotalColWidth: number;
        if (i === 0) {
          preTotalColWidth = 0;
        } else {
          preTotalColWidth = cacheStore.totalColWidthArr[i - 1];
        }

        if (preTotalColWidth <= rightOffsetX && totalColWidth > rightOffsetX) {
          endCol = i;
          break;
        }
      }
    } else {
      for (let i = (this.beginCol || 0); i >= 0; i--) {
        const totalColWidth = cacheStore.totalColWidthArr[i];
        let preTotalColWidth: number;
        if (i === 0) {
          preTotalColWidth = 0;
        } else {
          preTotalColWidth = cacheStore.totalColWidthArr[i - 1];
        }

        if (preTotalColWidth <= offsetX && totalColWidth > offsetX) {
          beginCol = i;
          this.restOffsetX = offsetX - preTotalColWidth;
          break;
        }
      }
      for (let i = (this.endCol || 0); i >= 0; i--) {
        const totalColWidth = cacheStore.totalColWidthArr[i];
        let preTotalColWidth: number;
        if (i === 0) {
          preTotalColWidth = 0;
        } else {
          preTotalColWidth = cacheStore.totalColWidthArr[i - 1];
        }

        if (preTotalColWidth <= (offsetX + state.viewWidth) && totalColWidth > (offsetX + state.viewWidth)) {
          endCol = i;
          break;
        }
      }
    }

    if (deltaY >= 0) {
      for (let i = (this.beginRow || 0); i < cacheStore.totalRowHeightArr.length; i++) {
        const totalRowHeight = cacheStore.totalRowHeightArr[i];
        let preTotalRowWidth: number;
        if (i === 0) {
          preTotalRowWidth = 0;
        } else {
          preTotalRowWidth = cacheStore.totalRowHeightArr[i - 1];
        }

        if (preTotalRowWidth <= offsetY && totalRowHeight > offsetY) {
          beginRow = i;
          this.restOffsetY = offsetY - preTotalRowWidth;
        }
        if (totalRowHeight > offsetY + state.viewHeight) {
          endRow = i;
          break;
        }
      }
      const bottomOffsetY = offsetY + state.viewHeight;
      for (let i = (this.endRow || 0); i < cacheStore.totalRowHeightArr.length; i++) {
        const totalRowHeight = cacheStore.totalRowHeightArr[i];
        let preTotalRowWidth: number;
        if (i === 0) {
          preTotalRowWidth = 0;
        } else {
          preTotalRowWidth = cacheStore.totalRowHeightArr[i - 1];
        }

        if (preTotalRowWidth <= bottomOffsetY && totalRowHeight > bottomOffsetY) {
          endRow = i;
          break;
        }
      }
    } else {
      for (let i = (this.beginRow || 0); i >= 0; i--) {
        const totalRowHeight = cacheStore.totalRowHeightArr[i];
        let preTotalRowWidth: number;
        if (i === 0) {
          preTotalRowWidth = 0;
        } else {
          preTotalRowWidth = cacheStore.totalRowHeightArr[i - 1];
        }

        if (preTotalRowWidth <= offsetY && totalRowHeight > offsetY) {
          beginRow = i;
          this.restOffsetY = offsetY - preTotalRowWidth;
          break;
        }
      }
      for (let i = (this.endRow || 0); i >= 0; i--) {
        const totalRowHeight = cacheStore.totalRowHeightArr[i];
        let preTotalRowWidth: number;
        if (i === 0) {
          preTotalRowWidth = 0;
        } else {
          preTotalRowWidth = cacheStore.totalRowHeightArr[i - 1];
        }

        if (preTotalRowWidth <= (offsetY + state.viewHeight) && totalRowHeight > (offsetY + state.viewHeight)) {
          endRow = i;
          break;
        }
      }
    }

    if (endRow === undefined) {
      endRow = this.rowNum - 1;
    }
    if (endCol === undefined) {
      endCol = this.colNum - 1;
    }

    // console.log(beginRow, endRow, beginCol, endCol)
    return [beginRow, endRow, beginCol, endCol];
  }

  draw(): Area[][] {
    this.areas = areaStore.cellContentArea;
    areaStore.cellContentMergeArea = {};

    const mergeParentCellIndexes: CellIndex[] = [];
    for (let i = this.beginRow; i <= this.endRow; i++) {
      for (let j = this.beginCol; j <= this.endCol; j++) {
        this.areas[i][j] = null; // 清空area
        if (cacheStore.mergeCellIndexes[i] && cacheStore.mergeCellIndexes[i][j]) {
          const mergeParentCellIndex = cacheStore.mergeCellIndexes[i][j];
          if (mergeParentCellIndex) {
            const exist = mergeParentCellIndexes.findIndex(item => CellIndexUtil.equals(item, mergeParentCellIndex)) >= 0;
            if (!exist) {
              mergeParentCellIndexes.push(mergeParentCellIndex);
            }
          }
        }
      }
    }

    // console.time('computeDeltaXY');
    const [beginRow, endRow, beginCol, endCol] = this.computeDeltaXY(state.offsetX, state.offsetY, state.deltaX, state.deltaY);
    // console.timeEnd('computeDeltaXY');
    // console.time('initarray');

    // console.timeEnd('initarray');
    //
    // console.time('draw cell');
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

        if (cacheStore.mergeCellIndexes[i] && cacheStore.mergeCellIndexes[i][j]) {
          if (areaStore.cellContentMergeArea[i] === undefined) {
            areaStore.cellContentMergeArea[i] = {}
          }
          areaStore.cellContentMergeArea[i][j] = new Area(x, y, x + cellWidth, y + cellHeight);
          continue;
        }

        this.areas[i][j] = new Area(x, y, x + cellWidth, y + cellHeight);
        CanvasUtil.drawRect(this.$ctx, x, y, cellWidth, cellHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
      }
    }

    for (let i = 0; i < mergeParentCellIndexes.length; i++) {
      const [pRi, pCi] = mergeParentCellIndexes[i];

      let pOffsetX = config.rowHeaderWidth;
      if (pCi) {
        pOffsetX = pOffsetX + cacheStore.totalColWidthArr[pCi - 1];
      }
      let pOffsetY = config.colHeaderHeight;
      if (pRi) {
        pOffsetY = pOffsetY + cacheStore.totalRowHeightArr[pRi - 1];
      }

      let x = Math.floor(pOffsetX - state.offsetX);
      let y = Math.floor(pOffsetY - state.offsetY);

      let cellWidth = 0;
      let cellHeight = 0;
      const targetMergeCell = state.mergeCells.find((item: MergeCell) => item[0] === pRi && item[1] === pCi);
      const [, , rs, cs]  = targetMergeCell;
      for (let m = 0; m < rs; m++) {
        cellHeight = cellHeight + cacheStore.rowHeightArr[pRi + m];
      }
      for (let n = 0; n < cs; n++) {
        cellWidth = cellWidth + cacheStore.colWidthArr[pCi + n];
      }

      CanvasUtil.drawRect(this.$ctx, x, y, cellWidth, cellHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
      this.areas[pRi][pCi] = new Area(x, y, x + cellWidth, y + cellHeight);
    }

    // console.timeEnd('draw cell');

    state.deltaX = 0;
    state.deltaY = 0;
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

    let cellWidth = 0;
    let cellHeight = 0;
    const targetMergeCell = state.mergeCells.find((item: MergeCell) => item[0] === ri && item[1] === ci);
    if (targetMergeCell) {
      const [, , rs, cs]  = targetMergeCell;
      for (let m = 0; m < rs; m++) {
        cellHeight = cellHeight + cacheStore.rowHeightArr[ri + m];
      }
      for (let n = 0; n < cs; n++) {
        cellWidth = cellWidth + cacheStore.colWidthArr[ci + n];
      }

      CanvasUtil.drawRect(this.$ctx, area.x1, area.y1, cellWidth, cellHeight, {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
    } else {
      CanvasUtil.drawRect(this.$ctx, area.x1, area.y1, cacheStore.colWidthArr[ci], cacheStore.rowHeightArr[ri], {fillStyle: '#ffffff', strokeStyle: '#aeaeae'});
    }
  }
}
