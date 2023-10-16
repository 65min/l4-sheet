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
      console.log('in v bar')
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
      if (totalOffsetX > state.contentWidth - state.viewWidth) {
        totalOffsetX = state.contentWidth - state.viewWidth;
      }
      scroll.hScroll.offsetX = totalOffsetX;
      state.offsetX = totalOffsetX / state.hScrollRatio;
      if (state.offsetX > state.contentWidth - state.viewWidth) {
        state.offsetX = state.contentWidth - state.viewWidth;
      }

      this.refreshView();
    } else if (operate.type === 'scroll-v' && event.button === 0) {
      operate.scrollVState.endPoint = new Point(offsetX, offsetY);

      let totalOffsetY = operate.scrollVState.initOffsetY + operate.scrollVState.endPoint.y - operate.scrollVState.beginPoint.y;

      if (totalOffsetY < 0) {
        totalOffsetY = 0;
      }
      if (totalOffsetY > state.contentHeight - state.viewHeight) {
        totalOffsetY = state.contentHeight - state.viewHeight;
      }
      scroll.vScroll.offsetY = totalOffsetY;
      state.offsetY = totalOffsetY / state.vScrollRatio;
      if (state.offsetY > state.contentHeight - state.viewHeight) {
        state.offsetY = state.contentHeight - state.viewHeight;
      }

      this.refreshView();
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

    const [hScrollBarArea, hScrollArea] = scroll.hScroll.draw();
    scroll.hScrollBarArea = hScrollBarArea;
    scroll.hScrollArea = hScrollArea;
    const [vScrollBarArea, vScrollArea] = scroll.vScroll.draw();
    scroll.vScrollBarArea = vScrollBarArea;
    scroll.vScrollArea = vScrollArea;
  }

  handleScroll(event: WheelEvent) {
    // console.log(event);
    const {deltaY} = event;
    let {offsetY} = state;
    offsetY = offsetY + deltaY;
    if (offsetY < 0) {
      offsetY = 0;
    } else if (offsetY > state.rowNum * config.rowHeight - 100) {
      offsetY = state.rowNum * config.rowHeight - 100
    }

    state.offsetY = offsetY
    scroll.vScroll.offsetY = offsetY * state.vScrollRatio;
    this.refreshView();
  }

  init(): void {
    // document.addEventListener('mousemove');
    this.initScrollbar();
  }

  private initScrollbar() {
    this.$target.addEventListener('mousedown', this.handleMousedown);
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
    this.$target.addEventListener('mousewheel', (event) => {
      this.handleScroll(event as WheelEvent);
    });
  }

}
