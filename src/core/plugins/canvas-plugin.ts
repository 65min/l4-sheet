import {PluginType} from './plugin-type.enum.ts';
import BasePlugin from './base-plugin.ts';
import {TableHeaderDrawer} from '../draw/table-header.draw.ts';
import {ColHeaderDrawer} from '../draw/col-header.draw.ts';
import {RowHeaderDrawer} from '../draw/row-header.draw.ts';
import {CellContentDrawer} from '../draw/cell-content.draw.ts';
import state from '../store/state.ts';
import {HScrollDraw} from '../draw/h-scroll.draw.ts';
import store from '../store';
import {BackgroundDrawer} from '../draw/background.draw.ts';
import control from '../store/control.store.ts';
import {VScrollDraw} from '../draw/v-scroll.draw.ts';
import config from '../config';
import {SelectAreaDrawer} from '../draw/select-area.draw.ts';
import areaStore from '../store/area.store.ts';
import {CacheUtil} from '../utils/cache.util.ts';

//
// (function () {
//   if (window.customElements.get('l4-canvas') === undefined) {
//
//     const template = document.createElement('template');
//     template.innerHTML = `
//       <canvas class="l4__canvas" width="800" height="600">
//       浏览器不支持canvas特性
//       </canvas>
//     `;
//
//     class Toolbar extends HTMLElement {
//
//       constructor() {
//         super();
//         const shadow = this.attachShadow( { mode: 'closed' } );
//         const content = template.content.cloneNode(true);
//         shadow.append(content);
//       }
//
//     }
//
//     window.customElements.define('l4-canvas', Toolbar);
//   }
//
// })();


export default class CanvasPlugin extends BasePlugin {

  type = PluginType.Canvas;

  $canvas: HTMLCanvasElement | undefined;

  $ctx: CanvasRenderingContext2D | undefined;

  background: BackgroundDrawer | undefined;

  tableHeader: TableHeaderDrawer | undefined;

  colHeader: ColHeaderDrawer | undefined;

  rowHeader: RowHeaderDrawer | undefined;

  cellContent: CellContentDrawer | undefined;

  hScroll: HScrollDraw | undefined;

  vScroll: VScrollDraw | undefined;

  selectArea: SelectAreaDrawer | undefined;


  constructor(selector: string) {
    super(selector);
  }

  init(): void {
    this.$canvas = document.createElement('canvas');
    this.$canvas.innerHTML = '浏览器不支持Canvas特性';
    this.$canvas.style.height = 'auto';
    this.$canvas.style.overflow = 'auto';
    this.$canvas.classList.add('l4__canvas');
    this.$canvas.draggable = false;
    // this.$canvas.ondragstart = (event) => {
    //   // event.target
    //   // console.log(event.target)
    //   event.preventDefault();
    // }
    this.$canvas.width = 1440;
    this.$canvas.height = 675;
    this.$target!.append(this.$canvas);
    store.$canvas = this.$canvas;
    state.canvasWidth = 1440;
    state.canvasHeight = 675;

    // const widthArr = CacheUtil.computeColWidth(state.colNum);
    // cacheStore.colWidthArr = widthArr[0];
    // cacheStore.totalColWidthArr = widthArr[1];
    // const heightArr = CacheUtil.computeRowHeight(state.rowNum);
    // cacheStore.rowHeightArr = heightArr[0];
    // cacheStore.totalRowHeightArr = heightArr[1];
    areaStore.cellContentArea = [];
    for (let i = 0; i <= state.rowNum; i++) {
      areaStore.cellContentArea.push(new Array(state.colNum).fill(null));
    }
    CacheUtil.setWidthHeightArr(state.rowNum, state.colNum);

    this.$ctx = this.$canvas.getContext('2d')!;
    store.$ctx = this.$ctx;

    this.background = new BackgroundDrawer(this.$ctx);
    areaStore.backgroundArea = this.background.draw();

    this.tableHeader = new TableHeaderDrawer(this.$ctx);
    const tableHeaderArea = this.tableHeader.draw();

    this.colHeader = new ColHeaderDrawer(this.$ctx, state.colNum);
    const colHeaderArea = this.colHeader.draw();
    // state.colNum = 26;

    this.rowHeader = new RowHeaderDrawer(this.$ctx, state.rowNum);
    const rowHeaderArea = this.rowHeader.draw();
    // state.rowNum = 100;

    state.viewWidth = state.canvasWidth - 36;
    state.viewHeight = state.canvasHeight - 20;

    this.cellContent = new CellContentDrawer(this.$ctx, state.rowNum, state.colNum);
    const cellContentArea = this.cellContent.draw();

    this.selectArea = new SelectAreaDrawer(this.$ctx);
    this.selectArea.draw();

    areaStore.tableHeaderArea = tableHeaderArea;
    areaStore.colHeaderArea = colHeaderArea;
    areaStore.rowHeaderArea = rowHeaderArea;

    areaStore.cellContentArea = cellContentArea;

    control.tableHeader = this.tableHeader;
    control.rowHeader = this.rowHeader;
    control.colHeader = this.colHeader;
    control.cellContent = this.cellContent;
    control.background = this.background;
    control.selectArea = this.selectArea;

    const showScroll = this.showScroll();
    if (showScroll.h) {
      state.vScrollWidth = config.scroll.width;
      state.viewWidth = state.viewWidth - config.scroll.width;

      this.hScroll = new HScrollDraw(this.$ctx);
      control.hScroll = this.hScroll;
      const [hScrollBarArea, leftBtnArea, rightBtnArea, hScrollArea] = this.hScroll.draw();
      areaStore.hScrollBarArea = hScrollBarArea;
      areaStore.hScrollArea = hScrollArea;
      areaStore.hScrollLArea = leftBtnArea;
      areaStore.hScrollRArea = rightBtnArea;
    }
    if (showScroll.v) {
      state.hScrollHeight = config.scroll.width;
      state.viewHeight = state.viewHeight - config.scroll.width;

      this.vScroll = new VScrollDraw(this.$ctx);
      control.vScroll = this.vScroll;
      const [vScrollBarArea, leftBtnArea, rightBtnArea, vScrollArea] = this.vScroll.draw();
      areaStore.vScrollBarArea = vScrollBarArea;
      areaStore.vScrollArea = vScrollArea;
      areaStore.vScrollLArea = leftBtnArea;
      areaStore.vScrollRArea = rightBtnArea;
    }

  }

  showScroll(): {h: boolean, v: boolean} {

    // @ts-ignore
    let {viewWidth, viewHeight, contentWidth, contentHeight, vScrollWidth, hScrollHeight} = state;

    const showHScroll = viewWidth < contentWidth;
    const showVScroll = viewHeight < contentHeight;

    if (!showHScroll && !showVScroll) {
      return {h: false, v: false};
    } else if (showHScroll && !showVScroll) {
      hScrollHeight = 16;
      viewHeight = viewHeight - 16;
      const showVScroll = viewHeight < contentHeight;
      return {h: showHScroll, v: showVScroll};
    } else if (!showHScroll && showVScroll) {
      hScrollHeight = 16;
      viewWidth = viewWidth - 16;
      const showHScroll = viewWidth < contentWidth;
      return {h: showHScroll, v: showVScroll};
    }

    return {h: true, v: true};
  }

}
