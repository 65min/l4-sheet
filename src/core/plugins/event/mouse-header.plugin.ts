import BasePlugin from '../base-plugin.ts';
import control from '../../store/control.store.ts';
import {PluginType} from '../plugin-type.enum.ts';
import areaStore from '../../store/area.store.ts';
import controlStore from '../../store/control.store.ts';
import {Point} from '../../model/point.ts';
import {AreaUtil} from '../../utils/area.util.ts';
import cacheStore from '../../store/cache.store.ts';
import {Area} from '../../model/area.ts';
import store from '../../store';
import operate from '../../store/operate.ts';
import state from '../../store/state.ts';
import {ViewUtil} from '../../utils/view.util.ts';
import {CanvasUtil} from '../../utils/canvas.util.ts';
import config from '../../config';
import {CacheUtil} from '../../utils/cache.util.ts';

export default class MouseHeaderPlugin extends BasePlugin {

  type = PluginType.EventMouseHeader;

  resizeColIndex = -1;
  resizeRowIndex = -1;

  init(): void {
    this.initHeader();
  }

  handleMousemoveEvent(event: MouseEvent) {

    const point = Point.build(event.offsetX, event.offsetY);
    const inColHeader = AreaUtil.inArea(point, new Area(config.rowHeaderWidth, 0, config.rowHeaderWidth + state.viewWidth, config.colHeaderHeight));
    const inRowHeader = AreaUtil.inArea(point, new Area(0, config.colHeaderHeight, config.rowHeaderWidth, config.colHeaderHeight + state.viewHeight));
    if (!inColHeader && !inRowHeader) {
      return ;
    }

    store.$canvas.style.cursor = 'default';
    const inColHeaderEdge = this.isEventInColHeaderEdge(event);
    if (inColHeaderEdge >= 0) {
      this.resizeColIndex = inColHeaderEdge;
      if (inColHeaderEdge >= 0) {
        store.$canvas.style.cursor = 'col-resize';
      }
    } else {
      const inRowHeaderEdge = this.isEventInRowHeaderEdge(event);
      this.resizeRowIndex = inRowHeaderEdge;
      if (inRowHeaderEdge >= 0) {
        store.$canvas.style.cursor = 'row-resize';
      }
    }

    const {vScroll, hScroll} = controlStore;
    if (vScroll) {
      vScroll.draw();
    }
    if (hScroll) {
      hScroll.draw();
    }
  }

  // private isEventInColHeader(event: { offsetX: number, offsetY: number }): number | null {
  //   const point = new Point(event.offsetX, event.offsetY);
  //   for (let i = 0; i < areaStore.colHeaderArea.length; i++) {
  //     const colHeaderArea = areaStore.colHeaderArea[i];
  //     if (colHeaderArea && AreaUtil.inArea(point, colHeaderArea)) {
  //       return i;
  //     }
  //   }
  //
  //   return -1;
  // }

  /**
   * 鼠标是否处于单元格边缘处
   * @param event
   * @private
   */
  private isEventInColHeaderEdge(event: { offsetX: number, offsetY: number }): number | null {
    const point = new Point(event.offsetX, event.offsetY);

    for (let i = 0; i < areaStore.colHeaderArea.length; i++) {
      const colWidth = cacheStore.colWidthArr[i];
      const colHeaderArea = areaStore.colHeaderArea[i];
      if (!colHeaderArea) {
        continue;
      }
      if (colWidth <= 3) {
        if (AreaUtil.inArea(point, colHeaderArea)) {
          return i;
        }
      } else {
        const rightColHeaderArea = new Area(colHeaderArea.x2 - 3, colHeaderArea.y1, colHeaderArea.x2, colHeaderArea.y2);
        if (AreaUtil.inArea(point, rightColHeaderArea)) {
          // debugger;
          return i;
        }
        const leftColHeaderArea = new Area(colHeaderArea.x1, colHeaderArea.y1, colHeaderArea.x1 + 3, colHeaderArea.y2);
        if (AreaUtil.inArea(point, leftColHeaderArea)) {
          return i - 1;
        }
      }
    }

    return -1;
  }

  /**
   * 鼠标是否处于单元格边缘处
   * @param event
   * @private
   */
  private isEventInRowHeaderEdge(event: { offsetX: number, offsetY: number }): number | null {
    const point = new Point(event.offsetX, event.offsetY);

    for (let i = 0; i < areaStore.rowHeaderArea.length; i++) {
      const rowHeight = cacheStore.rowHeightArr[i];
      const rowHeaderArea = areaStore.rowHeaderArea[i];
      if (!rowHeaderArea) {
        continue;
      }
      if (rowHeight <= 3) {
        if (AreaUtil.inArea(point, rowHeaderArea)) {
          return i;
        }
      } else {
        const bottomRowHeaderArea = new Area(rowHeaderArea.x1, rowHeaderArea.y2 - 3, rowHeaderArea.x2, rowHeaderArea.y2);
        if (AreaUtil.inArea(point, bottomRowHeaderArea)) {
          return i;
        }
        const topRowHeaderArea = new Area(rowHeaderArea.x1, rowHeaderArea.y1, rowHeaderArea.x2, rowHeaderArea.y1 + 3);
        if (AreaUtil.inArea(point, topRowHeaderArea)) {
          return i - 1;
        }
      }
    }

    return -1;
  }

  // private isEventInRowHeader(event: { offsetX: number, offsetY: number }): number | null {
  //   const point = new Point(event.offsetX, event.offsetY);
  //   for (let i = 0; i < areaStore.rowHeaderArea.length; i++) {
  //     const rowHeaderArea = areaStore.rowHeaderArea[i];
  //     if (rowHeaderArea && AreaUtil.inArea(point, rowHeaderArea)) {
  //       return i;
  //     }
  //   }
  //
  //   return -1;
  // }

  handleMouseleaveEvent() {
    control.colHeader.hoverIndex = -1;
    control.rowHeader.hoverIndex = -1;
    control.colHeader.draw();
    control.rowHeader.draw();
    if (control.hScroll) {
      control.hScroll.draw();
    }
    if (control.vScroll) {
      control.vScroll.draw();
    }
  }

  handleMousedownEvent(event: MouseEvent) {
    if (store.$canvas.style.cursor === 'col-resize') {

      const inColHeaderEdge = this.isEventInColHeaderEdge(event);

      operate.type = 'resize-col';
      operate.resizeColState.resizeIndex = inColHeaderEdge;
      operate.resizeColState.initWidth = cacheStore.colWidthArr[this.resizeColIndex];
      operate.resizeColState.beginX = event.offsetX;
    } else if (store.$canvas.style.cursor === 'row-resize') {

      const inColHeaderEdge = this.isEventInRowHeaderEdge(event);

      operate.type = 'resize-row';
      operate.resizeRowState.resizeIndex = inColHeaderEdge;
      operate.resizeRowState.initHeight = cacheStore.rowHeightArr[this.resizeRowIndex];
      operate.resizeRowState.beginY = event.offsetY;
    }
  }

  handleMousemoveResizeEvent(event: MouseEvent) {
    if (operate.type === 'resize-col') {
      // operate.type = 'resize-col';
      operate.resizeColState.endX = event.offsetX;

      const resizeIndex = operate.resizeColState.resizeIndex;
      let deltaX = operate.resizeColState.endX - operate.resizeColState.beginX;

      if (state.cols[resizeIndex] === undefined) {
        state.cols[resizeIndex] = {};
      }
      let width = operate.resizeColState.initWidth + deltaX;
      if (width < 0) {
        width = 0;
      }
      cacheStore.colWidthArr[resizeIndex] = width;
      state.cols[resizeIndex].w = cacheStore.colWidthArr[resizeIndex];

      ViewUtil.refreshView(ViewUtil.drawSelectCell);
      CacheUtil.setWidthHeightArr(state.rowNum, state.colNum);

      CanvasUtil.drawRemark(store.$ctx, `列宽${width}px`, Point.build(operate.resizeColState.beginX + 30, config.colHeaderHeight), {});
    } else if (operate.type === 'resize-row') {
      // operate.type = 'resize-row';
      operate.resizeRowState.endY = event.offsetY;

      const resizeIndex = operate.resizeRowState.resizeIndex;
      let deltaY = operate.resizeRowState.endY - operate.resizeRowState.beginY;

      if (state.rows[resizeIndex] === undefined) {
        state.rows[resizeIndex] = {};
      }
      let height = operate.resizeRowState.initHeight + deltaY;
      if (height < 0) {
        height = 0;
      }
      cacheStore.rowHeightArr[resizeIndex] = height;
      state.rows[resizeIndex].h = cacheStore.rowHeightArr[resizeIndex];

      ViewUtil.refreshView(ViewUtil.drawSelectCell);
      CacheUtil.setWidthHeightArr(state.rowNum, state.colNum);

      CanvasUtil.drawRemark(store.$ctx, `行高${height}px`, Point.build(config.rowHeaderWidth, operate.resizeRowState.beginY + 30), {});
    }
  }

  handleMouseupEvent(_event: MouseEvent) {
    if (operate.type === 'resize-col') {
      operate.type = '';
      operate.resizeColState.resizeIndex = -1;
      operate.resizeColState.initWidth = -1;
      operate.resizeColState.beginX = null;
      operate.resizeColState.endX = null;

      ViewUtil.refreshView(ViewUtil.drawSelectCell);
    } else if (operate.type === 'resize-row') {
      operate.type = '';
      operate.resizeRowState.resizeIndex = -1;
      operate.resizeRowState.initHeight = -1;
      operate.resizeRowState.beginY = null;
      operate.resizeRowState.endY = null;

      ViewUtil.refreshView(ViewUtil.drawSelectCell);
    }
  }

  initHeader() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent.bind(this));
    this.$target.addEventListener('mouseleave', this.handleMouseleaveEvent);

    this.$target.addEventListener('mousedown', this.handleMousedownEvent.bind(this));
    // this.$target.addEventListener('mousemove', this.handleMousemoveResizeEvent.bind(this));
    document.addEventListener('mousemove', this.handleMousemoveResizeEvent);
    this.$target.addEventListener('mouseup', this.handleMouseupEvent.bind(this));
  }
}
