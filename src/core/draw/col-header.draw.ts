import {BaseDrawer} from './base.draw.ts';
import {Area} from '../model/area.ts';
import {CommonUtil} from '../utils/common.util.ts';
import state from '../store/state.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import areaStore from '../store/area.store.ts';
import selectArea from '../store/select-area.ts';
import {Point} from '../model/point.ts';
import {CellArea} from '../def/cell-area.ts';
import cacheStore from '../store/cache.store.ts';

export class ColHeaderDrawer extends BaseDrawer {

  areas: Area[] | undefined;

  num: number;

  private _hoverIndex: number;

  // offsetX: number = 0;

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

    const selectAreaColIndexes = []
    selectArea.selectedCellAreas.forEach((sa: CellArea) => {
      selectAreaColIndexes.push([sa[1], sa[3]]);
    });

    // 背景
    CanvasUtil.drawRect(this.$ctx, config.rowHeaderWidth, 0, 1e10, config.colHeaderHeight, {fillStyle: '#e9e9e9', strokeStyle: '#aeaeae'});

    let offsetX = config.rowHeaderWidth;
    for (let i = 0; i < this.num; i++) {

      let width = cacheStore.colWidthArr[i];
      let x1 = (offsetX - state.offsetX) | 0;
      const x2 = x1 + width;

      if (x1 < config.rowHeaderWidth) {
        x1 = config.rowHeaderWidth;
        width = x2 - x1;
      }

      if (x1 > state.canvasWidth) {
        this.areas.push(null);
        continue;
      }

      if (x2 < config.rowHeaderWidth) {
        offsetX = offsetX + cacheStore.colWidthArr[i];
        this.areas.push(null);
        continue;
      }

      const inSelectArea = selectAreaColIndexes.findIndex(item => {
        return (item[0] <= i && item[1] >= i) || (item[1] <= i && item[0] >= i) || state.mergeCells.findIndex(m => m[1] <= i && m[1] + m[3] - 1 >= i) >= 0
      }) >= 0;
      // if (this.hoverIndex === i) {
      //   CanvasUtil.drawRect(this.$ctx, x1, 0, width, config.colHeaderHeight, {strokeStyle: '#aeaeae', fillStyle: '#e4efee'})
      // } else {
        CanvasUtil.drawRect(this.$ctx, x1, 0, width, config.colHeaderHeight, {strokeStyle: '#aeaeae', fillStyle: inSelectArea? '#dddddd' : '#e9e9e9'})
      // }

      if ((x2 - x1) / 2 - 2 > 5) {
        this.$ctx.fillStyle = '#787878';
        this.$ctx.font = '12px MicroSoft YaHei';
        this.$ctx.textAlign = 'center';
        this.$ctx.textBaseline = 'middle';

        this.$ctx.fillText(CommonUtil.index2Alpha(i), x1 + (x2 - x1) / 2, 12);
      }

      const area = new Area(x1, 0, x1 + width, config.colHeaderHeight);
      this.areas.push(area);
      offsetX = offsetX + cacheStore.colWidthArr[i];

      if (inSelectArea) {
        CanvasUtil.drawLine(
          this.$ctx,
          [
            Point.build(x1, config.colHeaderHeight),
            Point.build(x1 + width, config.colHeaderHeight)
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

  drawIndex(index: number) {
    if (index < 0 || index > areaStore.colHeaderArea.length - 1) {
      throw new Error(`index: ${index} error`);
    }
    const area = areaStore.colHeaderArea[index];
    if (!area) {
      return;
    }

    const {x1, x2} = area;
    if (index === this.hoverIndex) {
      this.$ctx.fillStyle = '#e0f2f1';
    } else {
      this.$ctx.fillStyle = '#e9e9e9';
    }
    this.$ctx.fillRect(x1, 0, x2 - x1, config.colHeaderHeight);
    this.$ctx.strokeStyle = '#aeaeae';
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(x1 +.5, .5, x2 - x1, config.colHeaderHeight);

    if ((x2 - x1) / 2 - 2 > 5) {
      this.$ctx.fillStyle = '#787878';
      this.$ctx.font = '12px MicroSoft YaHei';
      this.$ctx.textAlign = 'center';
      this.$ctx.textBaseline = 'middle';
      this.$ctx.fillText(CommonUtil.index2Alpha(index), x1 + (x2 - x1) / 2, 12);
    }
  }

}
