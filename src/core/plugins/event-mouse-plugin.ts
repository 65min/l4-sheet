import BasePlugin from './base-plugin.ts';
import {PluginType} from './plugin-type.enum.ts';
import {AreaUtil} from '../utils/area-util.ts';
import {Point} from '../model/point.ts';
import scroll from '../store/scroll.ts';
import operate from '../store/operate.ts';
import control from '../store/control.ts';
import state from '../store/state.ts';
import headerStore from '../store/header-store.ts';
import cellStore from '../store/cell-store.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas-util.ts';


export default class EventMousePlugin extends BasePlugin {

  type = PluginType.EventMouse;

  handleMousedown = (event: MouseEvent) => {
    const {offsetX, offsetY} = event;

    const mousedownPoint = new Point(offsetX, offsetY);
    const isInHScrollBarArea = AreaUtil.inArea(mousedownPoint, scroll.hScrollBarArea);
    if (isInHScrollBarArea) {
      operate.type = 'scroll-h';
      operate.scrollHState.beginPoint = mousedownPoint;
      operate.scrollHState.initOffsetX = scroll.hScroll.offsetX;
      return ;
    }

    const isInVScrollBarArea = AreaUtil.inArea(mousedownPoint, scroll.vScrollBarArea);
    if (isInVScrollBarArea) {
      operate.type = 'scroll-v';
      operate.scrollVState.beginPoint = mousedownPoint;
      operate.scrollVState.initOffsetY = scroll.vScroll.offsetY;
      return ;
    }
  }

  handleMousemove = (event: MouseEvent) => {
    // console.log(event);
    const {offsetX, offsetY} = event;
    if (operate.type === 'scroll-h' && event.button === 0) {
      operate.scrollHState.endPoint = new Point(offsetX, offsetY);

      let totalOffsetX = operate.scrollHState.initOffsetX + operate.scrollHState.endPoint.x - operate.scrollHState.beginPoint.x;

      if (totalOffsetX < 0) {
        totalOffsetX = 0;
      }

      scroll.hScroll.offsetX = totalOffsetX;
      state.offsetX = totalOffsetX / state.hScrollRatio;
      if (state.offsetX > state.contentWidth - 160) {
        state.offsetX = state.contentWidth - 160;
      }
      scroll.hScroll.offsetX = state.offsetX * state.hScrollRatio;
      state.emptyWidth = CanvasUtil.computeEmptyWidth(state.offsetX);

      this.refreshView();
    } else if (operate.type === 'scroll-v' && event.button === 0) {
      operate.scrollVState.endPoint = new Point(offsetX, offsetY);

      let totalOffsetY = operate.scrollVState.initOffsetY + operate.scrollVState.endPoint.y - operate.scrollVState.beginPoint.y;

      if (totalOffsetY < 0) {
        totalOffsetY = 0;
      }

      scroll.vScroll.offsetY = totalOffsetY;
      state.offsetY = totalOffsetY / state.vScrollRatio;
      if (state.offsetY > state.contentHeight - 100) {
        state.offsetY = state.contentHeight - 100;
      }
      scroll.vScroll.offsetY = state.offsetY * state.vScrollRatio;
      state.emptyHeight = CanvasUtil.computeEmptyHeight(state.offsetY);

      this.refreshView();
    } else {
      const point = new Point(offsetX, offsetY);
      scroll.hScroll.hover = AreaUtil.inArea(point, scroll.hScrollBarArea);
      scroll.hScroll.leftButtonStatus.hover = AreaUtil.inArea(point, scroll.hScrollLArea);
      scroll.hScroll.rightButtonStatus.hover = AreaUtil.inArea(point, scroll.hScrollRArea);
      scroll.hScroll.draw();
      scroll.vScroll.hover = AreaUtil.inArea(point, scroll.vScrollBarArea);
      scroll.vScroll.leftButtonStatus.hover = AreaUtil.inArea(point, scroll.vScrollLArea);
      scroll.vScroll.rightButtonStatus.hover = AreaUtil.inArea(point, scroll.vScrollRArea);
      scroll.vScroll.draw();
    }
  }

  handleMouseup(event: MouseEvent) {
    if (operate.type === 'scroll-h' && event.button === 0) {
      operate.type = '';
      operate.scrollHState.beginPoint = null;
      operate.scrollHState.endPoint = null;
      operate.scrollHState.initOffsetX = 0;
    }
    if (operate.type === 'scroll-v' && event.button === 0) {
      operate.type = '';
      operate.scrollVState.beginPoint = null;
      operate.scrollVState.endPoint = null;
      operate.scrollVState.initOffsetY = 0;
    }
  }

  refreshView() {

    cellStore.backgroundArea = control.background.draw();
    cellStore.cellContentArea = control.cellContent.draw();
    headerStore.tableHeaderArea = control.tableHeader.draw();

    headerStore.colHeaderArea = control.colHeader.draw();
    headerStore.rowHeaderArea = control.rowHeader.draw();

    headerStore.rowHeaderArea = control.rowHeader.draw();

    const [hScrollBarArea, hLeftBtnArea, hRightBtnArea, hScrollArea] = scroll.hScroll.draw();
    scroll.hScrollBarArea = hScrollBarArea;
    scroll.hScrollArea = hScrollArea;
    scroll.hScrollLArea = hLeftBtnArea;
    scroll.hScrollRArea = hRightBtnArea;

    const [vScrollBarArea, vLeftBtnArea, vRightBtnArea, vScrollArea] = scroll.vScroll.draw();
    scroll.vScrollBarArea = vScrollBarArea;
    scroll.vScrollArea = vScrollArea;
    scroll.vScrollLArea = vLeftBtnArea;
    scroll.vScrollRArea = vRightBtnArea;
  }

  handleScroll(event: WheelEvent) {
    const {deltaY} = event;
    let {offsetY} = state;
    offsetY = offsetY + deltaY;
    if (offsetY < 0) {
      offsetY = 0;
    } else if (offsetY > state.rowNum * config.rowHeight - 100) {
      offsetY = state.rowNum * config.rowHeight - 100
    }

    state.emptyHeight = CanvasUtil.computeEmptyHeight(offsetY);

    state.offsetY = offsetY
    scroll.vScroll.offsetY = offsetY * state.vScrollRatio;
    this.refreshView();
  }

  handleMouseover(event: MouseEvent) {
    const {offsetX, offsetY} = event;

    const mousedownPoint = new Point(offsetX, offsetY);
    const isInHScrollBarArea = AreaUtil.inArea(mousedownPoint, scroll.hScrollBarArea);
    if (isInHScrollBarArea) {
      // operate.type = 'scroll-h';
      // operate.scrollHState.beginPoint = mousedownPoint;
      // operate.scrollHState.initOffsetX = scroll.hScroll.offsetX;
      scroll.hScroll.hover = true;
      scroll.hScroll.draw();
      return ;
    }

    const isInVScrollBarArea = AreaUtil.inArea(mousedownPoint, scroll.vScrollBarArea);
    if (isInVScrollBarArea) {
      // console.log('in v bar')
      operate.type = 'scroll-v';
      operate.scrollVState.beginPoint = mousedownPoint;
      operate.scrollVState.initOffsetY = scroll.vScroll.offsetY;
      return ;
    }
  }

  handleScrollBtn(event: MouseEvent) {
    const point = new Point(event.offsetX, event.offsetY);
    const hlBtn = AreaUtil.inArea(point, scroll.hScrollLArea); // 横向左侧按钮
    const hrBtn = AreaUtil.inArea(point, scroll.hScrollRArea); // 横向右侧按钮
    const vlBtn = AreaUtil.inArea(point, scroll.vScrollLArea); // 竖向左侧按钮
    const vrBtn = AreaUtil.inArea(point, scroll.vScrollRArea); // 竖向右侧按钮
    if (hlBtn) {
      // console.log('h scroll left btn click');
      let {offsetX} = state;
      offsetX = offsetX - 80;
      if (offsetX < 0) {
        offsetX = 0;
      }
      scroll.hScroll.offsetX = offsetX * state.hScrollRatio;
      state.offsetX = offsetX;
      state.emptyWidth = CanvasUtil.computeEmptyWidth(offsetX);

      this.refreshView();
    } else if (hrBtn) {
      let {offsetX} = state;
      offsetX = offsetX + 80;
      if (offsetX > state.contentWidth - 160) {
        offsetX = state.contentWidth - 160
      }
      scroll.hScroll.offsetX = offsetX * state.hScrollRatio;
      state.offsetX = offsetX;
      state.emptyWidth = CanvasUtil.computeEmptyWidth(offsetX);

      this.refreshView();
    } else if (vlBtn) {
      // console.log('h scroll left btn click');
      let {offsetY} = state;
      offsetY = offsetY - 100;
      if (offsetY < 0) {
        offsetY = 0;
      }
      scroll.vScroll.offsetY = offsetY * state.vScrollRatio;
      state.offsetY = offsetY;
      state.emptyWidth = CanvasUtil.computeEmptyHeight(offsetY);

      this.refreshView();
    } else if (vrBtn) {
      let {offsetY} = state;
      offsetY = offsetY + 100;
      if (offsetY > state.contentHeight - 100) {
        offsetY = state.contentHeight - 100
      }
      scroll.vScroll.offsetY = offsetY * state.vScrollRatio;
      state.offsetY = offsetY;
      state.emptyWidth = CanvasUtil.computeEmptyHeight(offsetY);

      this.refreshView();
    }

    event.preventDefault();
  }

  init(): void {
    // document.addEventListener('mousemove');
    this.initScrollbar();
    // this.handleScrollBtn = this.handleScrollBtn.bind(this);
  }

  private initScrollbar() {
    this.$target.addEventListener('mousedown', this.handleMousedown);
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
    this.$target.addEventListener('mousewheel', this.handleScroll.bind(this));

    this.$target.addEventListener('mousedown', this.handleScrollBtn.bind(this))

    // this.$target.addEventListener('mouseover', this.handleMouseover)
  }

}
