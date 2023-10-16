import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';


const MIN_Y = config.colHeaderHeight;

const BACKGROUND_COLOR = '#b2dfdb';
const BAR_COLOR = '#26a69a';
const BORDER_COLOR = '#00796b';

/**
 * 纵向滚动条
 */
export class VScroll extends BaseDrawer {

  private barLength: number = 0;

  private _offsetY: number;


  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(value: number) {
    this._offsetY = value;
  }

  constructor(context: CanvasRenderingContext2D, offsetY: number = 0) {
    super(context);
    this._offsetY = offsetY;
  }

  draw(): Area[] {
    const {contentHeight, viewHeight, canvasHeight} = state;
    const {canvasWidth} = state;

    let ratio = viewHeight / (contentHeight + state.emptyHeight);
    // console.log(ratio)
    state.vScrollRatio = ratio;
    // console.log(ratio);
    if (ratio < .05) {
      ratio = .05;
    }
    this.barLength = state.vScrollRatio * viewHeight;

    // 整个滚动条区域
    this.$ctx.fillStyle = BACKGROUND_COLOR;
    // this.$ctx.fillRect(canvasWidth - 16, config.colHeaderHeight, 16, viewHeight);
    this.$ctx.fillRect(canvasWidth - 16, 0, 16, canvasHeight - 16 );

    // 边框线
    this.$ctx.strokeStyle = BORDER_COLOR
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(canvasWidth - 16 + .5, config.colHeaderHeight + .5, 16, viewHeight - 1);

    let barY1 = config.colHeaderHeight + 2 + this._offsetY;
    // let barX2 = barX1 + this.barLength;
    // console.log(barX);
    if (barY1 < MIN_Y + 2) {
      barY1 = MIN_Y + 2;
    }
    if (barY1 + this.barLength - MIN_Y + 2 > viewHeight) {
      barY1 = viewHeight - this.barLength + MIN_Y - 2;
    }
    // 内部滚动条
    this.$ctx.fillStyle = BAR_COLOR;
    this.$ctx.fillRect(canvasWidth - 16 + 2, barY1, 13, this.barLength);

    // const barArea = new Area(canvasWidth - 16 + 2, barY1, 13, this.barLength);
    const barArea = new Area(canvasWidth - 16 + 2, barY1, canvasWidth - 16 + 2 + 13, barY1 + this.barLength);
    const scrollArea = new Area(config.colHeaderHeight, canvasWidth - 16, 16, viewHeight);

    return [barArea, scrollArea];
  }

}
