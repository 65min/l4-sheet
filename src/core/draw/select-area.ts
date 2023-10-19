import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import selectArea from '../store/select-area.ts';
import {CanvasUtil} from '../utils/canvas-util.ts';
import store from '../store';
import areaStore from '../store/area.store.ts';
import {Point} from '../model/point.ts';

export class SelectAreaDrawer extends BaseDrawer {

  draw(): Area | Area[] | Area[][] {
    if (selectArea.selectAreas.length === 1) {
      return this.drawSingleArea();
    }
    return undefined;
  }

  private drawSingleArea() {
    const area = selectArea.selectAreas[0];
    if (!area) {
      return ;
    }
    const [ri1, ci1, ri2, ci2] = area;

    for (let i = ri1; i <= ri2; i++) {
      for (let j = ci1; j <= ci2; j++) {
        const cellArea = areaStore.cellContentArea[i][j];
        if (cellArea) {
          const {x1, x2, y1, y2} = cellArea;
          CanvasUtil.drawRect(store.$ctx, x1 + .5, y1 + .5, x2 - x1, y2 - y1, {fillStyle: '#eeeeee88'});

          CanvasUtil.drawLine(
            store.$ctx,
            [
              Point.build(x1 + .5, y1 + .5), Point.build(x2 + .5, y1 + .5),
              Point.build(x2 + .5, y1 + .5), Point.build(x2 + .5, y2 + .5),
              Point.build(x2 + .5, y2 + .5), Point.build(x1 + .5, y2 + .5),
              Point.build(x1 + .5, y1 + .5), Point.build(x2 + .5, y1 + .5),
            ],
            {strokeStyle: '#26a69a', lineWidth: 3});

          return new Area(x1, y1, x2, y2);
        }
      }
    }
  }
}
