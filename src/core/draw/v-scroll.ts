import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';
import operate from '../store/operate.ts';


const MIN_Y = config.colHeaderHeight;

const BACKGROUND_COLOR = '#e0e0e0';
const BAR_COLOR = '#bdbdbd';
const BAR_COLOR__HOVER = '#9e9e9e';
const BORDER_COLOR = '#9e9e9e';

/**
 * 纵向滚动条
 */
export class VScroll extends BaseDrawer {

  private barLength: number = 0;

  private _offsetY: number;

  private _hover: boolean;


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

  get hover(): boolean {
    return this._hover;
  }

  set hover(value: boolean) {
    this._hover = value;
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
    this.$ctx.fillRect(canvasWidth - config.scroll.width, 0, config.scroll.width, canvasHeight - config.scroll.width);

    // 边框线
    this.$ctx.strokeStyle = BORDER_COLOR
    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(canvasWidth - config.scroll.width + .5, config.colHeaderHeight + .5, config.scroll.width - 1, viewHeight - 1);


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
    if (this.hover || operate.type === 'scroll-v') {
      this.$ctx.fillStyle = BAR_COLOR__HOVER;
    }
    this.$ctx.fillRect(canvasWidth - config.scroll.width + 2, barY1, config.scroll.width - 4, this.barLength);

    const barArea = new Area(canvasWidth - config.scroll.width + 2, barY1, canvasWidth - config.scroll.width + 2 + 13, barY1 + this.barLength);
    const scrollArea = new Area(config.colHeaderHeight, canvasWidth - config.scroll.width, config.scroll.width, viewHeight);

    return [barArea, scrollArea];
  }

}
