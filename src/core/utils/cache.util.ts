import state from '../store/state.ts';
import config from '../config';

export class CacheUtil {

  public static computeCellWidth(colNum: number): number[] {

    const cellWidthArr: number[] = [];
    for (let i = 0; i < colNum; i++) {
      let cellWidth = state.cols[i]?.w;
      if (cellWidth === undefined) {
        cellWidth = config.colWidth;
      }
      cellWidthArr[i] = cellWidth;
    }

    return cellWidthArr;
  }
  public static computeCellHeight(rowNum: number): number[] {

    const cellHeightArr: number[] = [];
    for (let i = 0; i < rowNum; i++) {
      let cellHeight = state.rows[i]?.h;
      if (cellHeight === undefined) {
        cellHeight = config.rowHeight;
      }
      cellHeightArr[i] = cellHeight;
    }

    return cellHeightArr;
  }

}
