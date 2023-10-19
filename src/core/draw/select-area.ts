import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import selectArea from '../store/select-area.ts';
import {CanvasUtil} from '../utils/canvas.util.ts';
import store from '../store';
import areaStore from '../store/area.store.ts';
import {Point} from '../model/point.ts';
import {AreaUtil} from '../utils/area.util.ts';

export class SelectAreaDrawer extends BaseDrawer {

  draw(): Area | Area[] | Area[][] {
    if (selectArea.selectedCellAreas.length === 1) {
      return this.drawSingleArea(selectArea.selectedCellAreas[0]);
    } else if (selectArea.selectedCellAreas.length > 1) {
      return this.drawMultiArea(selectArea.selectedCellAreas, selectArea.selectedCell);
    }
    return [];
  }

  private drawSingleArea(selectCell: [number, number, number, number]): Area {
    const totalArea = this.computeArea(selectCell);

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

  private computeArea(selectCell: [number, number, number, number]): Area {
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

  private drawMultiArea(selectCells: [number, number, number, number][], selectCell: [number, number, number, number]): Area[] {

    const areaArr = []
    selectCells.forEach((selectCell: [number, number, number, number]) => {
      const totalArea = this.computeArea(selectCell);
      const {x1, x2, y1, y2} = totalArea;
      CanvasUtil.drawRect(
        store.$ctx,
        x1 + 3,
        y1 + 3,
        x2 - x1 - 5,
        y2 - y1 - 5,
        {fillStyle: '#bbbbbb50', lineWidth: 3}
      );
      areaArr.push(totalArea);
    });

    return areaArr;
  }
}
