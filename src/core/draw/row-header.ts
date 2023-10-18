import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';


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

    // 背景
    this.$ctx.fillStyle = '#e9e9e9';
    this.$ctx.fillRect(0, config.colHeaderHeight, config.rowHeaderWidth, 1e10);
    this.$ctx.strokeStyle = '#aeaeae';
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(.5, config.colHeaderHeight +.5, config.rowHeaderWidth, 1e10);

    let offsetY = config.colHeaderHeight;
    for (let i = 0; i < this.num; i++) {

      let height = config.rowHeight;
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
        offsetY = offsetY + config.rowHeight;
        this.areas.push(null);
        continue;
      }

      if (i === this.hoverIndex) {
        this.$ctx.fillStyle = '#e0f2f1';
      } else {
        this.$ctx.fillStyle = '#e9e9e9';
      }
      this.$ctx.fillRect(0, y1, config.rowHeaderWidth, height);
      this.$ctx.strokeStyle = '#aeaeae';
      this.$ctx.lineWidth = .5;
      this.$ctx.strokeRect(.5, y1 + .5, config.rowHeaderWidth, height);

      if ((y2 - y1) / 2 - 2 > 3) {
        this.$ctx.fillStyle = '#787878';
        this.$ctx.font = '12px MicroSoft YaHei';
        this.$ctx.textAlign = 'center';
        this.$ctx.textBaseline = 'middle';

        this.$ctx.fillText(i + 1 + '', .5 + 18, y1 + (y2 - y1) / 2 + 2);
      }

      const area = new Area(0, y1, config.rowHeaderWidth, y1 + height);
      this.areas.push(area);
      offsetY = offsetY + config.rowHeight;
    }

    return this.areas;
  }

}
