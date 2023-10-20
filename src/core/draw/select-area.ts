import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import selectArea from '../store/select-area.ts';
import {CanvasUtil} from '../utils/canvas.util.ts';
import store from '../store';
import areaStore from '../store/area.store.ts';
import {Point} from '../model/point.ts';
import {AreaUtil} from '../utils/area.util.ts';
import {CellAreaUtil} from '../utils/cell-area.util.ts';
import {CellArea, CellIndex} from '../def/cell-area.ts';

export class SelectAreaDrawer extends BaseDrawer {

  draw(): Area | Area[] | Area[][] {
    if (selectArea.selectedCellAreas.length === 1) {
      return this.drawSingleArea(selectArea.selectedCellAreas[0], selectArea.selectedCell);
    } else if (selectArea.selectedCellAreas.length > 1) {
      return this.drawMultiArea(selectArea.selectedCellAreas, selectArea.selectedCell);
    }
    return [];
  }

  private drawSingleArea(cellArea: CellArea, selectCell: CellIndex): Area {
    const totalArea = this.computeArea(cellArea);

    const splitedCellAreas = CellAreaUtil.splitWithoutTargetCell(cellArea, [...selectCell, ...selectCell]);

    splitedCellAreas.forEach(item => {
      const itemArea = this.computeArea(item);
      const {x1, x2, y1, y2} = itemArea;
      CanvasUtil.drawRect(store.$ctx, x1, y1, x2 - x1, y2 - y1, {fillStyle: '#cccccc77', lineWidth: 0});
    })

    const {x1, x2, y1, y2} = totalArea;
    CanvasUtil.drawLine(
      store.$ctx,
      [
        Point.build(x1 + .5, y1 + .5), Point.build(x2 + .5, y1 + .5),
        Point.build(x2 + .5, y1 + .5), Point.build(x2 + .5, y2 + .5),
        Point.build(x2 + .5, y2 + .5), Point.build(x1 + .5, y2 + .5),
        Point.build(x1 + .5, y1 + .5), Point.build(x2 + .5, y1 + .5),
      ],
      {strokeStyle: '#26a69a', lineWidth: 3}
    );

    return totalArea;
  }

  private computeArea(selectCell: CellArea): Area {
    // const area = selectArea.selectAreas[0];
    if (!selectCell) {
      return ;
    }
    const [ri1, ci1, ri2, ci2] = selectCell;

    const areas = [];
    for (let i = ri1; i <= ri2; i++) {
      for (let j = ci1; j <= ci2; j++) {
        const cellArea = areaStore.cellContentArea[i][j];
        if (cellArea) {
          areas.push(cellArea);
        }
      }
    }

    return AreaUtil.computeMinArea(areas);
  }

  private drawMultiArea(selectCells: CellArea[], selectCell: CellIndex): Area[] {

    const areaArr = []
    selectCells.forEach((selectCellArea: CellArea) => {
      const totalArea = this.computeArea(selectCellArea);
      const {x1, x2, y1, y2} = totalArea;
      const containBeginCell = CellAreaUtil.cellAreaContainsCell(selectCellArea, selectCell);
      if (containBeginCell) {
        // CanvasUtil.drawRect(
        //   store.$ctx,
        //   x1 + 3,
        //   y1 + 3,
        //   x2 - x1 - 5,
        //   y2 - y1 - 5,
        //   {fillStyle: '#bbbbbb00', strokeStyle: '#ff0000', lineWidth: .5}
        // );
        CanvasUtil.drawLine(
          store.$ctx,
          [
            Point.build(x1 + 2.5, y1 + 2.5),
            Point.build(x2 - 1.5, y1 + 2.5),
            Point.build(x2 - 1.5, y2 - 1.5),
            Point.build(x1 + 2.5, y2 - 1.5),
            Point.build(x1 + 2.5, y1 + 2.5),
          ],
          {strokeStyle: '#26a69a', lineWidth: 1}
        );

      } else {
        CanvasUtil.drawRect(
          store.$ctx,
          x1 + 3,
          y1 + 3,
          x2 - x1 - 5,
          y2 - y1 - 5,
          {fillStyle: '#bbbbbb50', lineWidth: 3}
        );
      }
      areaArr.push(totalArea);
    });

    return areaArr;
  }
}
