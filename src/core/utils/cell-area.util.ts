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

    excludeCellArea = CellAreaUtil.computeCellAreaIntersection(cellArea, excludeCellArea);
    if (excludeCellArea == null) {
      return [cellArea];
    }
    const results = [];

    const r1 = Math.min(cellArea[0], cellArea[2]);
    const r2 = Math.max(cellArea[0], cellArea[2]);
    const c1 = Math.min(cellArea[1], cellArea[3]);
    const c2 = Math.max(cellArea[1], cellArea[3]);

    const eR1 = Math.min(excludeCellArea[0], excludeCellArea[2]);
    const eR2 = Math.max(excludeCellArea[0], excludeCellArea[2]);
    const eC1 = Math.min(excludeCellArea[1], excludeCellArea[3]);
    const eC2 = Math.max(excludeCellArea[1], excludeCellArea[3]);

    results.push([r1, c1, eR1 - 1, c2]); // 上
    results.push([eR1, c1, eR2, eC1 - 1]); // 左
    results.push([eR1, eC2 + 1, eR2, c2]); // 右
    results.push([eR2 + 1, c1, r2, c2]); // 下

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

  public static equals(a: CellArea, b: CellArea): boolean {
    const aRi1 = Math.min(a[0], a[2]);
    const aRi2 = Math.max(a[0], a[2]);
    const aCi1 = Math.min(a[1], a[3]);
    const aCi2 = Math.max(a[1], a[3]);

    const bRi1 = Math.min(b[0], b[2]);
    const bRi2 = Math.max(b[0], b[2]);
    const bCi1 = Math.min(b[1], b[3]);
    const bCi2 = Math.max(b[1], b[3]);

    return aRi1 === bRi1 && aRi2 === bRi2 && aCi1 === bCi1 && aCi2 === bCi2;
  }

  /**
   * 计算两个区域的交集
   * @param a
   * @param b
   */
  public static computeCellAreaIntersection(a: CellArea, b: CellArea): CellArea {
    a = [
      Math.min(a[0], a[2]),
      Math.min(a[1], a[3]),
      Math.max(a[0], a[2]),
      Math.max(a[1], a[3]),
    ];
    b = [
      Math.min(b[0], b[2]),
      Math.min(b[1], b[3]),
      Math.max(b[0], b[2]),
      Math.max(b[1], b[3]),
    ];
    const result: CellArea = [
      Math.max(a[0], b[0]),
      Math.max(a[1], b[1]),
      Math.min(a[2], b[2]),
      Math.min(a[3], b[3]),
    ];
    if (result[0] > result[2]) {
      return null;
    }
    if (result[1] > result[3]) {
      return null;
    }
    return result;
  }
}
