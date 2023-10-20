import {CellIndex} from '../def/cell-area.ts';

export class CellIndexUtil {

  public static equals(a: CellIndex, b: CellIndex): boolean {
    if (a === b) {
      return true;
    }

    return a[0] === b[0] && a[1] === b[1];
  }
}
