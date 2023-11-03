import {MergeCell} from '../store/state.ts';
import {MergeCellIndex} from '../store/cache.store.ts';
import {CellArea} from '../def/cell-area.ts';

export class MergeCellUtil {

  /**
   * 计算合并单元格索引
   *
   * @param mergeCells
   */
  public static computeMergeCellIndex(mergeCells: MergeCell[]): MergeCellIndex {

    const result: MergeCellIndex = {};

    mergeCells.forEach((mergeCell: MergeCell) => {
      const [bRi, bCi] = mergeCell;

      for (let i = 0; i < mergeCell[2]; i++) {
        if (result[bRi + i] === undefined) {
          result[bRi + i] = {};
        }
        for (let j = 0; j < mergeCell[3]; j++) {
          result[bRi + i][bCi + j] = [bRi, bCi];
        }
      }

    });

    return result;

  }

  public static mergeCells2CellAreas(mergeCells: MergeCell[]): CellArea[] {
    return mergeCells.map((item: MergeCell) => ([item[0], item[1], item[0] + item[2] - 1, item[1] + item[3] - 1]));
  }

}
