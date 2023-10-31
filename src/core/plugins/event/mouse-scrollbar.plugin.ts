import BasePlugin from '../base-plugin.ts';
import {PluginType} from '../plugin-type.enum.ts';
import {AreaUtil} from '../../utils/area.util.ts';
import {Point} from '../../model/point.ts';
import operate from '../../store/operate.ts';
import state from '../../store/state.ts';
import {CanvasUtil} from '../../utils/canvas.util.ts';
import config from '../../config';
import areaStore from '../../store/area.store.ts';
import {ViewUtil} from '../../utils/view.util.ts';
import controlStore from '../../store/control.store.ts';


export default class MouseScrollbarPlugin extends BasePlugin {

  type = PluginType.EventMouseScrollbar;

  // private count = 0;

  private count = 0;

  handleMousedown = (event: MouseEvent) => {
    const {offsetX, offsetY} = event;

    const mousedownPoint = new Point(offsetX, offsetY);
    const isInHScrollBarArea = AreaUtil.inArea(mousedownPoint, areaStore.hScrollBarArea);
    if (isInHScrollBarArea) {
      operate.type = 'scroll-h';
      operate.scrollHState.beginPoint = mousedownPoint;
      operate.scrollHState.initOffsetX = controlStore.hScroll.offsetX;
      this.count = 0;
      return ;
    }

    const isInVScrollBarArea = AreaUtil.inArea(mousedownPoint, areaStore.vScrollBarArea);
    if (isInVScrollBarArea) {
      operate.type = 'scroll-v';
      operate.scrollVState.beginPoint = mousedownPoint;
      operate.scrollVState.initOffsetY = controlStore.vScroll.offsetY;
      this.count = 0;
      return ;
    }
  }

  handleMousemove = (event: MouseEvent) => {

    if (!(this.count ++ % 5 == 0)) {
      return ;
    }

    // console.log(event);
    const {offsetX, offsetY} = event;
    if (operate.type === 'scroll-h' && event.button === 0) {
      operate.scrollHState.endPoint = new Point(offsetX, offsetY);

      let totalOffsetX = operate.scrollHState.initOffsetX + operate.scrollHState.endPoint.x - operate.scrollHState.beginPoint.x;

      if (totalOffsetX < 0) {
        totalOffsetX = 0;
      }

      controlStore.hScroll.offsetX = totalOffsetX;
      let newOffsetX = totalOffsetX / state.hScrollRatio;
      if (newOffsetX > state.contentWidth - 160) {
        newOffsetX = state.contentWidth - 160;
      }
      state.deltaX = newOffsetX - state.offsetX;
      state.deltaY = 0;
      state.offsetX = newOffsetX;
      controlStore.hScroll.offsetX = state.offsetX * state.hScrollRatio;
      state.emptyWidth = CanvasUtil.computeEmptyWidth(state.offsetX);

      this.refreshView();
    } else if (operate.type === 'scroll-v' && event.button === 0) {
      operate.scrollVState.endPoint = new Point(offsetX, offsetY);

      let totalOffsetY = operate.scrollVState.initOffsetY + operate.scrollVState.endPoint.y - operate.scrollVState.beginPoint.y;

      if (totalOffsetY < 0) {
        totalOffsetY = 0;
      }

      controlStore.vScroll.offsetY = totalOffsetY;

      let newOffsetY = totalOffsetY / state.vScrollRatio;
      if (newOffsetY > state.contentHeight - 100) {
        newOffsetY = state.contentHeight - 100;
      }
      state.deltaX = 0;
      state.deltaY = newOffsetY - state.offsetY;
      state.offsetY = newOffsetY;

      controlStore.vScroll.offsetY = state.offsetY * state.vScrollRatio;
      state.emptyHeight = CanvasUtil.computeEmptyHeight(state.offsetY);

      this.refreshView();
    } else {
      const point = new Point(offsetX, offsetY);
      if (controlStore.hScroll) {
        controlStore.hScroll.hover = AreaUtil.inArea(point, areaStore.hScrollBarArea);
        controlStore.hScroll.leftButtonStatus.hover = AreaUtil.inArea(point, areaStore.hScrollLArea);
        controlStore.hScroll.rightButtonStatus.hover = AreaUtil.inArea(point, areaStore.hScrollRArea);
        controlStore.hScroll.draw();
      }
      if (controlStore.vScroll) {
        controlStore.vScroll.hover = AreaUtil.inArea(point, areaStore.vScrollBarArea);
        controlStore.vScroll.leftButtonStatus.hover = AreaUtil.inArea(point, areaStore.vScrollLArea);
        controlStore.vScroll.rightButtonStatus.hover = AreaUtil.inArea(point, areaStore.vScrollRArea);
        controlStore.vScroll.draw();
      }
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
    ViewUtil.refreshView(() => controlStore.selectArea.draw());
  }

  handleScroll(event: WheelEvent) {
    if (!controlStore.vScroll) {
      return ;
    }

    const {deltaY} = event;
    let {offsetY} = state;
    offsetY = offsetY + deltaY;
    if (offsetY < 0) {
      offsetY = 0;
    } else if (offsetY > state.contentHeight - 100) {
      offsetY = state.contentHeight - 100
    }

    state.emptyHeight = CanvasUtil.computeEmptyHeight(offsetY);

    state.deltaX = 0;
    state.deltaY = offsetY - state.offsetY;
    state.offsetY = offsetY;

    controlStore.vScroll.offsetY = offsetY * state.vScrollRatio;
    this.refreshView();
  }

  handleScrollBtn(event: MouseEvent) {
    const point = new Point(event.offsetX, event.offsetY);
    const hlBtn = AreaUtil.inArea(point, areaStore.hScrollLArea); // 横向左侧按钮
    const hrBtn = AreaUtil.inArea(point, areaStore.hScrollRArea); // 横向右侧按钮
    const vlBtn = AreaUtil.inArea(point, areaStore.vScrollLArea); // 竖向左侧按钮
    const vrBtn = AreaUtil.inArea(point, areaStore.vScrollRArea); // 竖向右侧按钮
    if (hlBtn) {
      let {offsetX} = state;
      offsetX = offsetX - 80;
      if (offsetX < 0) {
        offsetX = 0;
      }
      controlStore.hScroll.offsetX = offsetX * state.hScrollRatio;

      let newOffsetX = offsetX;
      state.deltaX = newOffsetX - state.offsetX;
      state.deltaY = 0;
      state.offsetX = offsetX;
      state.emptyWidth = CanvasUtil.computeEmptyWidth(offsetX);

      this.refreshView();
    } else if (hrBtn) {
      let {offsetX} = state;
      offsetX = offsetX + 80;
      if (offsetX > state.contentWidth - 160) {
        offsetX = state.contentWidth - 160
      }
      controlStore.hScroll.offsetX = offsetX * state.hScrollRatio;

      let newOffsetX = offsetX;
      state.deltaX = newOffsetX - state.offsetX;
      state.deltaY = 0;
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
      controlStore.vScroll.offsetY = offsetY * state.vScrollRatio;

      let newOffsetY = offsetY;
      state.deltaX = 0;
      state.deltaY = newOffsetY - state.offsetY;
      state.offsetY = offsetY;
      state.emptyWidth = CanvasUtil.computeEmptyHeight(offsetY);

      this.refreshView();
    } else if (vrBtn) {
      let {offsetY} = state;
      offsetY = offsetY + 100;
      if (offsetY > state.contentHeight - 100) {
        offsetY = state.contentHeight - 100
      }
      controlStore.vScroll.offsetY = offsetY * state.vScrollRatio;

      let newOffsetY = offsetY;
      state.deltaX = 0;
      state.deltaY = newOffsetY - state.offsetY;
      state.offsetY = offsetY;
      state.emptyWidth = CanvasUtil.computeEmptyHeight(offsetY);

      this.refreshView();
    }

    event.preventDefault();
  }

  init(): void {
    this.initScrollbar();
  }

  private initScrollbar() {
    this.$target.addEventListener('mousedown', this.handleMousedown);
    document.addEventListener('mousemove', this.handleMousemove)
    document.addEventListener('mouseup', this.handleMouseup)
    this.$target.addEventListener('mousewheel', this.handleScroll.bind(this));

    this.$target.addEventListener('mousedown', this.handleScrollBtn.bind(this))
  }


}
