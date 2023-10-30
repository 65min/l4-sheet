import state from '../store/state.ts';
import config from '../config';
import cacheStore from '../store/cache.store.ts';

export class CacheUtil {

  public static computeColWidth(colNum: number): [number[], number[]] {

    const colWidthArr: number[] = [];
    const totalWidthArr: number[] = [];
    let width = 0;
    for (let i = 0; i < colNum; i++) {
      let colWidth = state.cols[i]?.w;
      if (colWidth === undefined) {
        colWidth = config.colWidth;
      }
      colWidthArr[i] = colWidth;

      width = width + colWidth;
      totalWidthArr.push(width);
    }

    return [colWidthArr, totalWidthArr];
  }
  public static computeRowHeight(rowNum: number): [number[], number[]] {

    const colHeightArr: number[] = [];
    const totalHeightArr: number[] = [];
    let height = 0;
    for (let i = 0; i < rowNum; i++) {
      let rowHeight = state.rows[i]?.h;
      if (rowHeight === undefined) {
        rowHeight = config.rowHeight;
      }
      colHeightArr[i] = rowHeight;

      height = height + rowHeight;
      totalHeightArr.push(height);
    }

    return [colHeightArr, totalHeightArr];
  }

  public static setWidthHeightArr(rowNum: number, colNum: number) {
    const widthArr = CacheUtil.computeColWidth(colNum);
    cacheStore.colWidthArr = widthArr[0];
    cacheStore.totalColWidthArr = widthArr[1];
    const heightArr = CacheUtil.computeRowHeight(rowNum);
    cacheStore.rowHeightArr = heightArr[0];
    cacheStore.totalRowHeightArr = heightArr[1];
  }

}
