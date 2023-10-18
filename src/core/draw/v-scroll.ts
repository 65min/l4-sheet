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
export class VScroll extends BaseDrawer {

  private barLength: number = 0;

  private _offsetY: number;

  private _hover: boolean;

  // private _lBtnHover: boolean;
  //
  // private _rBtnHover: boolean;

  private _leftButtonStatus: ButtonStatus = {disabled: false, hover: false};
  private _rightButtonStatus: ButtonStatus = {disabled: false, hover: false};

  private bar_limit_y1: number;
  private bar_limit_y2: number;


  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(value: number) {
    this._offsetY = value;
  }

  get hover(): boolean {
    return this._hover;
  }

  set hover(value: boolean) {
    this._hover = value;
  }

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

  constructor(context: CanvasRenderingContext2D, offsetY: number = 0) {
    super(context);
    this._offsetY = offsetY;
  }

  draw(): Area[] {

    const {canvasWidth, canvasHeight, contentHeight, viewHeight} = state;

    let ratio = (viewHeight - config.scroll.width + 4) / (contentHeight + state.emptyHeight);
    state.vScrollRatio = ratio;
    if (ratio < .05) {
      ratio = .05;
    }
    this.barLength = state.vScrollRatio * (viewHeight - config.scroll.width - config.scroll.width);

    // 整个滚动条区域
    this.$ctx.fillStyle = BACKGROUND_COLOR
    // this.$ctx.fillRect(config.rowHeaderWidth, canvasHeight - 16, viewHeight, 16);
    this.$ctx.fillRect(canvasWidth - config.scroll.width, 1, config.scroll.width, canvasHeight);

    // 左按钮 + 右按钮
    CanvasUtil.drawPath(
      this.$ctx,
      [
        new Point(state.canvasWidth - config.scroll.width + 4, config.colHeaderHeight + config.scroll.width - 4),
        new Point(state.canvasWidth - 4, config.colHeaderHeight + config.scroll.width - 4),
        new Point(state.canvasWidth - config.scroll.width / 2, config.colHeaderHeight + 4),
      ],
      {
        fillStyle: (this.leftButtonStatus.disabled || !this.leftButtonStatus.hover)? BAR_COLOR : BAR_COLOR__HOVER
      }
    );
    CanvasUtil.drawPath(
      this.$ctx,
      [
        new Point(state.canvasWidth - config.scroll.width + 4, state.canvasHeight - config.scroll.width - config.scroll.width + 4),
        new Point(state.canvasWidth - 4, state.canvasHeight - config.scroll.width - config.scroll.width + 4),
        new Point(state.canvasWidth - config.scroll.width / 2, state.canvasHeight - config.scroll.width - 4),
      ],
      {
        fillStyle: (this.rightButtonStatus.disabled || !this.rightButtonStatus.hover)? BAR_COLOR : BAR_COLOR__HOVER
      }
    );

    this.bar_limit_y1 = config.colHeaderHeight + config.scroll.width + 2;
    this.bar_limit_y2 = canvasHeight - config.scroll.width  - config.scroll.width - 2;

    // 中间滚动条x坐标
    let barY1 = config.colHeaderHeight + config.scroll.width + this.offsetY;
    if (barY1 < this.bar_limit_y1) {
      barY1 = this.bar_limit_y1;
    }
    if (barY1 + this.barLength > this.bar_limit_y2) {
      barY1 = this.bar_limit_y2 - this.barLength;
    }
    // 内部滚动条
    this.$ctx.fillStyle = BAR_COLOR;
    if (this.hover || operate.type === 'scroll-h') {
      this.$ctx.fillStyle = BAR_COLOR__HOVER;
    }
    this.$ctx.fillRect(canvasWidth - config.scroll.width + 2, barY1, config.scroll.width - 4, this.barLength);

    const barArea = new Area(canvasWidth - config.scroll.width, barY1, canvasWidth - config.scroll.width + config.scroll.width, barY1 + this.barLength);
    const scrollArea = new Area(canvasWidth - config.scroll.width, config.colHeaderHeight, canvasWidth, canvasHeight - config.scroll.width - config.scroll.width);

    const buttonArea = [
      new Area(canvasWidth - config.scroll.width, config.colHeaderHeight, canvasWidth, config.colHeaderHeight + config.scroll.width),
      new Area(canvasWidth - config.scroll.width, canvasHeight - config.scroll.width - config.scroll.width, canvasWidth, canvasHeight - config.scroll.width)
    ]

    return [barArea, ...buttonArea, scrollArea];
  }

}
