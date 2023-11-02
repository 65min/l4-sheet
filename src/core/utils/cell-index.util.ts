import {CellArea, CellIndex} from '../def/cell-area.ts';
import state from '../store/state.ts';
import {CellAreaUtil} from './cell-area.util.ts';

export class CellIndexUtil {

  public static equals(a: CellIndex, b: CellIndex): boolean {
    if (a === b) {
      return true;
    }

    return a[0] === b[0] && a[1] === b[1];
  }

  /**
   * 选择区域是否有效
   * @param ci
   */
  public static valid(ci: CellIndex): boolean {
    return ci[0] >= 0 && ci[1] >= 0;
  }

  public static getParentCell(cellIndex: CellIndex): CellIndex {
    const targetCell = state.mergeCells.find(item => {
      const cellArea: CellArea = [item[0], item[1], item[0] + item[2] - 1, item[1] + item[3] - 1];
      return CellAreaUtil.cellAreaContainsCell(cellArea, cellIndex);
    });
    if (targetCell) {
      return [targetCell[0], targetCell[1]];
    }
    return null;
  }
}
