import {CellArea, CellIndex} from '../def/cell-area.ts';

export class CellAreaUtil {

  /**
   * 单元格区域是否包含单元格
   *
   * @param cellArea
   * @param cell
   */
  public static cellAreaContainsCell(cellArea: CellArea, cell: CellIndex): boolean {
    let [r1, c1, r2, c2] = [
      Math.min(cellArea[0], cellArea[2]),
      Math.min(cellArea[1], cellArea[3]),
      Math.max(cellArea[0], cellArea[2]),
      Math.max(cellArea[1], cellArea[3]),
    ];

    return r1 <= cell[0] && r2 >= cell[0] && c1 <= cell[1] && c2 >= cell[1];
  }

  public static computeMinCellArea(cellArea1: CellIndex, cellArea2: CellIndex): CellArea {
    const [r1, c1] = cellArea1;
    const [r2, c2] = cellArea2;
    return [Math.min(r1, r2), Math.min(c1, c2), Math.max(r1, r2), Math.max(c1, c2)];
  }

  /**
   *
   * @param cellArea
   * @param excludeCellArea
   */
  public static splitWithoutTargetCell(cellArea: CellArea, excludeCellArea: CellArea): CellArea[] {
    const results = [];

    results.push([cellArea[0], cellArea[1], excludeCellArea[0] - 1, cellArea[3]]);
    results.push([excludeCellArea[0], cellArea[1], excludeCellArea[2], excludeCellArea[1] - 1]);
    results.push([excludeCellArea[0], excludeCellArea[1] + 1, excludeCellArea[2], cellArea[3]]);
    results.push([excludeCellArea[0] + 1, cellArea[1], cellArea[2], cellArea[3]]);

    return results.filter(item => CellAreaUtil.include(cellArea, item));
  }

  /**
   * 判断范围a是否包含返回b
   * @param a 大范围
   * @param b 小范围
   */
  public static include(a: CellArea, b: CellArea): boolean {
    const aRi1 = Math.min(a[0], a[2]);
    const aRi2 = Math.max(a[0], a[2]);
    const aCi1 = Math.min(a[1], a[3]);
    const aCi2 = Math.max(a[1], a[3]);

    const bRi1 = Math.min(b[0], b[2]);
    const bRi2 = Math.max(b[0], b[2]);
    const bCi1 = Math.min(b[1], b[3]);
    const bCi2 = Math.max(b[1], b[3]);

    return aRi1 <= bRi1 && aRi2 >= bRi2 && aCi1 <= bCi1 && aCi2 >= bCi2;
  }
}
