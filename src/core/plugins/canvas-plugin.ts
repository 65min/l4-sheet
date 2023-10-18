import {PluginType} from './plugin-type.enum.ts';
import BasePlugin from './base-plugin.ts';
import {TableHeaderDrawer} from '../draw/table-header.ts';
import {ColHeaderDrawer} from '../draw/col-header.ts';
import {RowHeaderDrawer} from '../draw/row-header.ts';
import headerStore from '../store/header-store.ts';
import {CellContentDrawer} from '../draw/cell-content.ts';
import cellStore from '../store/cell-store.ts';
import state from '../store/state.ts';
import {HScroll} from '../draw/h-scroll.ts';
import store from '../store';
import scroll from '../store/scroll.ts';
import {BackgroundDrawer} from '../draw/background.ts';
import control from '../store/control.ts';
import {VScroll} from '../draw/v-scroll.ts';
import config from '../config';
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

  hScroll: HScroll | undefined;

  vScroll: VScroll | undefined;


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

    this.$ctx = this.$canvas.getContext('2d')!;

    this.background = new BackgroundDrawer(this.$ctx);
    cellStore.backgroundArea = this.background.draw();

    this.tableHeader = new TableHeaderDrawer(this.$ctx);
    const tableHeaderArea = this.tableHeader.draw();

    this.colHeader = new ColHeaderDrawer(this.$ctx, 26);
    const colHeaderArea = this.colHeader.draw();
    state.colNum = 26;

    this.rowHeader = new RowHeaderDrawer(this.$ctx, 100);
    const rowHeaderArea = this.rowHeader.draw();
    state.rowNum = 100;

    state.viewWidth = state.canvasWidth - 36;
    state.viewHeight = state.canvasHeight - 20;

    this.cellContent = new CellContentDrawer(this.$ctx, 100, 26);
    const cellContentArea = this.cellContent.draw();

    headerStore.tableHeaderArea = tableHeaderArea;
    headerStore.colHeaderArea = colHeaderArea;
    headerStore.rowHeaderArea = rowHeaderArea;

    cellStore.cellContentArea = cellContentArea;

    control.tableHeader = this.tableHeader;
    control.rowHeader = this.rowHeader;
    control.colHeader = this.colHeader;
    control.cellContent = this.cellContent;
    control.background = this.background;

    const showScroll = this.showScroll();
    if (showScroll.h) {
      state.vScrollWidth = config.scroll.width;
      state.viewWidth = state.viewWidth - config.scroll.width;

      this.hScroll = new HScroll(this.$ctx);
      scroll.hScroll = this.hScroll;
      const [hScrollBarArea, leftBtnArea, rightBtnArea, hScrollArea] = this.hScroll.draw();
      scroll.hScrollBarArea = hScrollBarArea;
      scroll.hScrollArea = hScrollArea;
      scroll.hScrollLArea = leftBtnArea;
      scroll.hScrollRArea = rightBtnArea;
    }
    if (showScroll.v) {
      state.hScrollHeight = config.scroll.width;
      state.viewHeight = state.viewHeight - config.scroll.width;

      this.vScroll = new VScroll(this.$ctx);
      scroll.vScroll = this.vScroll;
      const [vScrollBarArea, leftBtnArea, rightBtnArea, vScrollArea] = this.vScroll.draw();
      scroll.vScrollBarArea = vScrollBarArea;
      scroll.vScrollArea = vScrollArea;
      scroll.vScrollLArea = leftBtnArea;
      scroll.vScrollRArea = rightBtnArea;
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
