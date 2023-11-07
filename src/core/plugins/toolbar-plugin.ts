import {PluginType} from './plugin-type.enum.ts';
import BasePlugin from './base-plugin.ts';
import cacheStore from '../store/cache.store.ts';
import controlStore from '../store/control.store.ts';
import selectArea from '../store/select-area.ts';
import {CellAreaUtil} from '../utils/cell-area.util.ts';
import state from '../store/state.ts';
import {ViewUtil} from '../utils/view.util.ts';
import {MergeCellUtil} from '../utils/merge-cell.util.ts';
import {CellArea} from '../def/cell-area.ts';

(function () {
  if (window.customElements.get('l4-toolbar') === undefined) {

    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="//at.alicdn.com/t/c/font_4309728_6v5awc15b2i.css">
      <style>
        .l4--icon-wrap {
            padding: 5px;
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Chrome/Safari/Opera */
            -khtml-user-select: none; /* Konqueror */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently not supported by any browser */
        }
        .l4--icon-item {
            padding: 2px 5px;
            display: inline-block;
            border-radius: 2px;
        }
        .l4--icon-item > [disabled] {
            color: #aaaaaa;
        }
        .l4--icon-divider {
            display: inline-block;
            width: 1px;
            height: 14px;
            position: relative;
            background-color: #aeaeae;
        }
        .l4--icon {
            font-size: 16px;
            color: #545454;
        }
        .l4--icon-label {
            font-size: 14px;
            display: inline-block;
            height: 20px;
            line-height: 20px;
            vertical-align: top;
            color: #545454;
            padding: 0 2px;
        }
        .l4--icon-item:hover {
            cursor: pointer;
            background-color: #fcfcfc;
         }
      </style>
      <div class="l4--icon-wrap">
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--undo l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--redo l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-divider">
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--merge-cell l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--split-cell l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-divider">
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--bold l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--italic l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--underline l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-divider">
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--align-left l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--align-center l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--align-right l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-divider">
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--bg-color l4--icon" ${cacheStore.ra}></i>
        </div>
        <div class="l4--icon-item">
          <i class="l4-icon l4-icon--font-color l4--icon" ${cacheStore.ra}></i>
        </div>
      </div>
    `;

    class Toolbar extends HTMLElement {

      constructor() {
        super();
        const shadow = this.attachShadow( { mode: 'closed' } );
        const content = template.content.cloneNode(true);
        shadow.append(content);

        controlStore.toolbarShadow = shadow;
      }

    }

    window.customElements.define('l4-toolbar', Toolbar);

  }

})();


export default class ToolbarPlugin extends BasePlugin {

  type = PluginType.ToolBar;

  constructor(selector: string) {
    super(selector);
  }

  init(): void {
    const toolbar = document.createElement('l4-toolbar');
    toolbar.setAttribute('id', cacheStore.ra);
    this.$target!.append(toolbar);

    this.bind();
  }

  bind(): void {

    const {ra} = cacheStore;

    const mergeBtn = controlStore.toolbarShadow.querySelector(`.l4-icon--merge-cell[${ra}]`);
    const splitBtn = controlStore.toolbarShadow.querySelector(`.l4-icon--split-cell[${ra}]`);
    const mergeBtnDisabled = mergeBtn.hasAttribute('disabled');
    const splitBtnDisabled = splitBtn.hasAttribute('disabled');
    mergeBtn.parentElement.removeEventListener('click', this.mergeCells);
    splitBtn.parentElement.removeEventListener('click', this.splitCells);
    if (!mergeBtnDisabled) {
      mergeBtn.parentElement.addEventListener('click', this.mergeCells)
    }
    if (!splitBtnDisabled) {
      splitBtn.parentElement.addEventListener('click', this.splitCells)
    }
  }

  /**
   * 合并单元格
   */
  mergeCells() {
    // const is
    if (selectArea.selectedCellAreas.length === 0) {
      controlStore.selectArea.setDefault();
      return ;
    }

    if (CellAreaUtil.isSingleCell(selectArea.selectedCellAreas)) {
      return ;
    }

    for (let i = 0; i < selectArea.selectedCellAreas.length; i++) {
      const selectedCellArea = selectArea.selectedCellAreas[i];
      state.mergeCells = state.mergeCells.filter(item => !CellAreaUtil.cellAreaContainsCell(selectedCellArea, [item[0], item[1]]));
      const [ri1, ci1, ri2, ci2] = CellAreaUtil.normalizeCellarea(selectedCellArea);
      selectArea.selectedCellAreas[i] = [ri1, ci1, ri1, ci1];
      state.mergeCells.push([ri1, ci1, ri2 - ri1 + 1, ci2 - ci1 + 1]);
    }

    cacheStore.mergeCellIndexes = MergeCellUtil.computeMergeCellIndex(state.mergeCells);
    ViewUtil.refreshView(ViewUtil.drawSelectCell);
  }

  /**
   * 取消合并单元格
   */
  splitCells() {
    for (let i = 0; i < selectArea.selectedCellAreas.length; i++) {
      const selectedCellArea = selectArea.selectedCellAreas[i];
      const selectedMergeCells = state.mergeCells.filter(item => CellAreaUtil.cellAreaContainsCell(selectedCellArea, [item[0], item[1]]));
      state.mergeCells = state.mergeCells.filter(item => selectedMergeCells.indexOf(item) < 0);

      const selectedMergeCellAreas: CellArea[] = MergeCellUtil.mergeCells2CellAreas(selectedMergeCells);

      const totalSelectedCellArea = selectedMergeCellAreas.reduce((prev, curr) => CellAreaUtil.computeCellAreaUnion(prev, curr), selectedCellArea);
      selectArea.selectedCellAreas[i] = totalSelectedCellArea;
    }

    cacheStore.mergeCellIndexes = MergeCellUtil.computeMergeCellIndex(state.mergeCells);
    ViewUtil.refreshView(ViewUtil.drawSelectCell);
  }

}
