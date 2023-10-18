import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';
import config from '../config';
import operate from '../store/operate.ts';
import {CanvasUtil} from '../utils/canvas-util.ts';
import {Point} from '../model/point.ts';
import {ButtonStatus} from '../def/button-status.ts';


// const MIN_X = config.rowHeaderWidth;
// const MIN_X = config.rowHeaderWidth + config.scroll.width + 2;
// const MAX_X = config.rowHeaderWidth + config.scroll.width + 2;

const BACKGROUND_COLOR = '#e0e0e0';
const BAR_COLOR = '#bdbdbd';
const BAR_COLOR__HOVER = '#9e9e9e';
// const BORDER_COLOR = '#9e9e9e';

/**
 * 横向滚动条
 */
export class HScroll extends BaseDrawer {

  private barLength: number = 0;

  private _offsetX: number;

  private _hover: boolean;

  // private _lBtnHover: boolean;
  //
  // private _rBtnHover: boolean;

  private _leftButtonStatus: ButtonStatus = {disabled: false, hover: false};
  private _rightButtonStatus: ButtonStatus = {disabled: false, hover: false};

  private bar_limit_x1: number;
  private bar_limit_x2: number;


  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(value: number) {
    this._offsetX = value;
  }

  get hover(): boolean {
    return this._hover;
  }

  set hover(value: boolean) {
    this._hover = value;
  }

  // get lBtnHover(): boolean {
  //   return this._lBtnHover;
  // }
  //
  // set lBtnHover(value: boolean) {
  //   this._lBtnHover = value;
  // }
  //
  // get rBtnHover(): boolean {
  //   return this._rBtnHover;
  // }
  //
  // set rBtnHover(value: boolean) {
  //   this._rBtnHover = value;
  // }

  get leftButtonStatus(): ButtonStatus {
    return this._leftButtonStatus;
  }

  set leftButtonStatus(value: ButtonStatus) {
    this._leftButtonStatus = value;
  }

  get rightButtonStatus(): ButtonStatus {
    return this._rightButtonStatus;
  }

  set rightButtonStatus(value: ButtonStatus) {
    this._rightButtonStatus = value;
  }

  constructor(context: CanvasRenderingContext2D, offsetX: number = 0) {
    super(context);
    this._offsetX = offsetX;
  }

  draw(): Area[] {

    const {canvasWidth, canvasHeight, contentWidth, viewWidth} = state;

    let ratio = (viewWidth - config.scroll.width + 4) / (contentWidth + state.emptyWidth);
    state.hScrollRatio = ratio;
    if (ratio < .05) {
      ratio = .05;
    }
    this.barLength = state.hScrollRatio * (viewWidth - config.scroll.width - config.scroll.width);

    // 整个滚动条区域
    this.$ctx.fillStyle = BACKGROUND_COLOR
    // this.$ctx.fillRect(config.rowHeaderWidth, canvasHeight - 16, viewWidth, 16);
    this.$ctx.fillRect(0, canvasHeight - config.scroll.width, canvasWidth, config.scroll.width);

    // 左按钮 + 右按钮
    CanvasUtil.drawPath(
      this.$ctx,
      [
        new Point(config.rowHeaderWidth + config.scroll.width - 4, state.canvasHeight - config.scroll.width + 4),
        new Point(config.rowHeaderWidth + config.scroll.width - 4, state.canvasHeight - 4),
        new Point(config.rowHeaderWidth + 4, state.canvasHeight - config.scroll.width / 2),
      ],
      {
        fillStyle: (this.leftButtonStatus.disabled || !this.leftButtonStatus.hover)? BAR_COLOR : BAR_COLOR__HOVER
      }
    );
    CanvasUtil.drawPath(
      this.$ctx,
      [
        new Point(canvasWidth - config.scroll.width - config.scroll.width + 4, state.canvasHeight - config.scroll.width + 4),
        new Point(canvasWidth - config.scroll.width - config.scroll.width + 4, state.canvasHeight - 4),
        new Point(canvasWidth - config.scroll.width - 4, state.canvasHeight - config.scroll.width / 2),
      ],
      {
        fillStyle: (this.rightButtonStatus.disabled || !this.rightButtonStatus.hover)? BAR_COLOR : BAR_COLOR__HOVER
      }
    );

    this.bar_limit_x1 = config.rowHeaderWidth + config.scroll.width + 2;
    this.bar_limit_x2 = canvasWidth - config.scroll.width  - config.scroll.width - 2;

    // 中间滚动条x坐标
    let barX1 = config.rowHeaderWidth + config.scroll.width + this.offsetX;
    if (barX1 < this.bar_limit_x1) {
      barX1 = this.bar_limit_x1;
    }
    if (barX1 + this.barLength > this.bar_limit_x2) {
      barX1 = this.bar_limit_x2 - this.barLength;
    }
    // 内部滚动条
    this.$ctx.fillStyle = BAR_COLOR;
    if (this.hover || operate.type === 'scroll-h') {
      this.$ctx.fillStyle = BAR_COLOR__HOVER;
    }
    this.$ctx.fillRect(barX1, canvasHeight - config.scroll.width + 2, this.barLength, config.scroll.width - 4);

    const barArea = new Area(barX1, canvasHeight - config.scroll.width, barX1 + this.barLength, canvasHeight);
    const scrollArea = new Area(config.rowHeaderWidth, canvasHeight - config.scroll.width, viewWidth, config.scroll.width);
    // this.$ctx.strokeRect(config.rowHeaderWidth + .5, canvasHeight - config.scroll.width + .5, config.scroll.width - 1, config.scroll.width - 1);

    const buttonArea = [
      new Area(config.rowHeaderWidth, canvasHeight - config.scroll.width, config.rowHeaderWidth + config.scroll.width, canvasHeight),
      new Area(canvasWidth - config.scroll.width - config.scroll.width, canvasHeight - config.scroll.width, canvasWidth - config.scroll.width, canvasHeight)
    ]

    return [barArea, ...buttonArea, scrollArea];
  }

}
