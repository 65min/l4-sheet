import {BaseDrawer} from './base.draw.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import selectArea from '../store/select-area.ts';
import {Point} from '../model/point.ts';
import {CellArea} from '../def/cell-area.ts';
import cacheStore from '../store/cache.store.ts';


export class RowHeaderDrawer extends BaseDrawer {

  areas: Area[] | undefined;

  num: number;

  private _hoverIndex: number;

  constructor(ctx: CanvasRenderingContext2D, num: number) {
    super(ctx);
    this.num = num;
  }


  get hoverIndex(): number {
    return this._hoverIndex;
  }

  set hoverIndex(value: number) {
    this._hoverIndex = value;
  }

  draw(): Area[] {

    this.areas = [];

    const selectAreaRowIndexes = []
    selectArea.selectedCellAreas.forEach((sa: CellArea) => {
      selectAreaRowIndexes.push([sa[0], sa[2]]);
    });

    // 背景
    CanvasUtil.drawRect(this.$ctx, 0, config.colHeaderHeight, config.rowHeaderWidth, 1e10, {fillStyle: '#dddddd', strokeStyle: '#aeaeae'});

    let offsetY = config.colHeaderHeight;
    for (let i = 0; i < this.num; i++) {

      let height = cacheStore.rowHeightArr[i];
      let y1 = (offsetY - state.offsetY) | 0;
      const y2 = y1 + height;

      if (y1 < config.colHeaderHeight) {
        y1 = config.colHeaderHeight;
        height = y2 - y1;
      }

      if (y1 > state.canvasHeight) {
        this.areas.push(null);
        continue;
      }

      if (y2 < config.colHeaderHeight) {
        offsetY = offsetY + cacheStore.rowHeightArr[i];
        this.areas.push(null);
        continue;
      }

      const inSelectArea = selectAreaRowIndexes.findIndex(item => item[0] <= i && item[1] >= i) >= 0;
      // if (this.hoverIndex === i) {
      //   CanvasUtil.drawRect(this.$ctx, 0, y1, config.rowHeaderWidth, height, {strokeStyle: '#aeaeae', fillStyle: '#e4efee'})
      // } else {
        CanvasUtil.drawRect(this.$ctx, 0, y1, config.rowHeaderWidth, height, {strokeStyle: '#aeaeae', fillStyle: inSelectArea? '#dadada' : '#e9e9e9'})
      // }

      if ((y2 - y1) / 2 - 2 > 3) {
        this.$ctx.fillStyle = '#787878';
        this.$ctx.font = '12px MicroSoft YaHei';
        this.$ctx.textAlign = 'center';
        this.$ctx.textBaseline = 'middle';

        this.$ctx.fillText(i + 1 + '', .5 + 18, y1 + (y2 - y1) / 2 + 2);
      }

      const area = new Area(0, y1, config.rowHeaderWidth, y1 + height);
      this.areas.push(area);
      offsetY = offsetY + cacheStore.rowHeightArr[i];

      if (inSelectArea) {
        CanvasUtil.drawLine(
          this.$ctx,
          [
            Point.build(config.rowHeaderWidth, y1),
            Point.build(config.rowHeaderWidth, y1 + height)
          ],
          {
            strokeStyle: '#26a69a',
            lineWidth: 2
          }
        )
      }
    }

    return this.areas;
  }

}
