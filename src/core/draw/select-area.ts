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
    let area = null;
    if (selectArea.selectedCellAreas.length === 1) {
      area = this.drawSingleArea(selectArea.selectedCellAreas[0]);
    } else if (selectArea.selectedCellAreas.length > 1) {
      area = this.drawMultiArea(selectArea.selectedCellAreas);
    }
    this.drawDeselectedCellArea(selectArea.deSelectedCellArea);
    return area;
  }

  private drawSingleArea(cellArea: CellArea): Area {
    const totalArea = this.computeArea(cellArea);

    const selectCellAreaBeginCell: CellIndex = [cellArea[0], cellArea[1]];
    const splitedCellAreas = CellAreaUtil.splitWithoutTargetCell(cellArea, [...selectCellAreaBeginCell, ...selectCellAreaBeginCell]);

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

  private computeArea(cellArea: CellArea): Area {
    // const area = selectArea.selectAreas[0];
    if (!cellArea) {
      return ;
    }
    // const [ri1, ci1, ri2, ci2] = selectCell;
    const ri1 = Math.min(cellArea[0], cellArea[2]);
    const ri2 = Math.max(cellArea[0], cellArea[2]);
    const ci1 = Math.min(cellArea[1], cellArea[3]);
    const ci2 = Math.max(cellArea[1], cellArea[3]);

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

  private drawMultiArea(selectCellAreas: CellArea[]): Area[] {

    const areaArr = []
    selectCellAreas.forEach((selectCellArea: CellArea, index: number) => {
      const totalArea = this.computeArea(selectCellArea);
      if (index === selectCellAreas.length - 1) {
        const selectCellAreaBeginCell: CellIndex = [selectCellArea[0], selectCellArea[1]];
        const splitedCellAreas = CellAreaUtil.splitWithoutTargetCell(selectCellArea, [...selectCellAreaBeginCell, ...selectCellAreaBeginCell]);

        {
          const {x1, x2, y1, y2} = this.computeArea([...selectCellAreaBeginCell, ...selectCellAreaBeginCell]);
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
        }

        splitedCellAreas.forEach((item: CellArea, index: number) => {
          const itemArea = this.computeArea(item);
          const {x1, x2, y1, y2} = itemArea;
          if (index === 0 && index === splitedCellAreas.length - 1) {
            CanvasUtil.drawRect(store.$ctx, x1 + 3, y1 + 3, x2 - x1 - 5, y2 - y1 - 5, {fillStyle: '#cccccc77', lineWidth: 0});
          } else if (index === 0) {
            CanvasUtil.drawRect(store.$ctx, x1, y1 + 3, x2 - x1 - 2, y2 - y1 - 3, {fillStyle: '#cccccc77', lineWidth: 0});
          } else if (index === splitedCellAreas.length - 1) {
            CanvasUtil.drawRect(store.$ctx, x1 + 3, y1, x2 - x1 - 5, y2 - y1 - 2, {fillStyle: '#cccccc77', lineWidth: 0});
          } else {
            CanvasUtil.drawRect(store.$ctx, x1, y1, x2 - x1, y2 - y1, {fillStyle: '#cccccc77', lineWidth: 0});
          }
        });

      } else {

        const {x1, x2, y1, y2} = totalArea;
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

  private drawDeselectedCellArea(deselectedCellArea: CellArea) {
    // console.log('draw deselect cell area', deselectedCellArea);
    if (deselectedCellArea == null) {
      return ;
    }

    const totalArea = this.computeArea(deselectedCellArea);
    const {x1, x2, y1, y2} = totalArea;
    CanvasUtil.drawRect(
      store.$ctx,
      x1,
      y1,
      x2 - x1,
      y2 - y1,
      {fillStyle: '#ffffff80', lineWidth: 2, strokeStyle: '#bdbdbd'}
    );
  }
}
