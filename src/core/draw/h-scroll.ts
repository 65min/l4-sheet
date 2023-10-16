import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';


const MIN_X = config.rowHeaderWidth;

const BACKGROUND_COLOR = '#b2dfdb';
const BAR_COLOR = '#26a69a';
const BORDER_COLOR = '#00796b';

/**
 * 横向滚动条
 */
export class HScroll extends BaseDrawer {

  private barLength: number = 0;

  private _offsetX: number;


  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(value: number) {
    this._offsetX = value;
  }

  constructor(context: CanvasRenderingContext2D, offsetX: number = 0) {
    super(context);
    this._offsetX = offsetX;
  }

  draw(): Area[] {
    const {canvasWidth, contentWidth, viewWidth} = state;
    const {canvasHeight} = state;

    let ratio = viewWidth / contentWidth;
    state.hScrollRatio = ratio;
    // console.log(ratio);
    if (ratio < .05) {
      ratio = .05;
    }
    this.barLength = state.hScrollRatio * viewWidth;

    // 整个滚动条区域
    this.$ctx.fillStyle = BACKGROUND_COLOR
    // this.$ctx.fillRect(config.rowHeaderWidth, canvasHeight - 16, viewWidth, 16);
    this.$ctx.fillRect(0, canvasHeight - 16, canvasWidth, 16);

    // 边框线
    this.$ctx.strokeStyle = BORDER_COLOR;
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(config.rowHeaderWidth + .5, canvasHeight - 16 + .5, viewWidth, 15);

    let barX1 = config.rowHeaderWidth + 2 + this._offsetX;
    // let barX2 = barX1 + this.barLength;
    // console.log(barX);
    if (barX1 < MIN_X + 2) {
      barX1 = MIN_X + 2;
    }
    if (barX1 + this.barLength - MIN_X + 2 > viewWidth) {
      barX1 = viewWidth - this.barLength + MIN_X - 2;
    }
    // 内部滚动条
    this.$ctx.fillStyle = BAR_COLOR;
    this.$ctx.fillRect(barX1, canvasHeight - 16 + 2, this.barLength, 12);

    const barArea = new Area(barX1, canvasHeight - 16 + 1, barX1 + this.barLength, canvasHeight - 16 + 1 + 13);
    const scrollArea = new Area(config.rowHeaderWidth, canvasHeight - 16, viewWidth, 16);

    return [barArea, scrollArea];
  }

}
