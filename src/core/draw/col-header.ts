import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import {CommonUtil} from '../utils/common-util.ts';
import state from '../store/state.ts';
import config from '../config';
import header from '../store/header.ts';

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

    // 背景
    this.$ctx.fillStyle = '#e9e9e9';
    this.$ctx.fillRect(config.rowHeaderWidth, 0, 1e10, config.colHeaderHeight);
    this.$ctx.strokeStyle = '#aeaeae';
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(config.rowHeaderWidth +.5, .5, 1e10, config.colHeaderHeight);

    let offsetX = config.rowHeaderWidth;
    for (let i = 0; i < this.num; i++) {

      let width = config.colWidth;
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
        offsetX = offsetX + config.colWidth;
        this.areas.push(null);
        continue;
      }

      if (i === this.hoverIndex) {
        this.$ctx.fillStyle = '#e0f2f1';
      } else {
        this.$ctx.fillStyle = '#e9e9e9';
      }
      this.$ctx.fillRect(x1, 0, width, config.colHeaderHeight);
      this.$ctx.strokeStyle = '#aeaeae';
      this.$ctx.lineWidth = .5;
      this.$ctx.strokeRect(x1 +.5, .5, width, config.colHeaderHeight);

      if ((x2 - x1) / 2 - 2 > 5) {
        this.$ctx.fillStyle = '#787878';
        this.$ctx.font = '12px MicroSoft YaHei';
        this.$ctx.textAlign = 'center';
        this.$ctx.textBaseline = 'middle';

        this.$ctx.fillText(CommonUtil.index2Alpha(i), x1 + (x2 - x1) / 2, 12);
      }

      const area = new Area(x1, 0, x1 + width, config.colHeaderHeight);
      this.areas.push(area);
      offsetX = offsetX + config.colWidth;
    }

    return this.areas;
  }

  drawIndex(index: number) {
    if (index < 0 || index > header.colHeaderArea.length - 1) {
      throw new Error(`index: ${index} error`);
    }
    const area = header.colHeaderArea[index];
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
