import {PluginType} from './plugin-type.enum.ts';
import BasePlugin from './base-plugin.ts';
import cacheStore from '../store/cache.store.ts';
import controlStore from '../store/control.store.ts';
import selectArea from '../store/select-area.ts';
import {CellAreaUtil} from '../utils/cell-area.util.ts';
import {MsgUtil} from '../utils/msg.util.ts';
import state from '../store/state.ts';
import {ViewUtil} from '../utils/view.util.ts';
import {MergeCellUtil} from '../utils/merge-cell.util.ts';

(function () {
  if (window.customElements.get('l4-toolbar') === undefined) {

    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="//at.alicdn.com/t/c/font_4309728_2a6q4p5vx7t.css">
      <style>
        .icon-wrap {
            padding: 5px;
        }
        .icon-item {
            padding: 2px 5px;
            display: inline-block;
            border-radius: 2px;
        }
        .icon-item > [disabled] {
            color: #aaaaaa;
        }
        .icon {
            font-size: 20px;
        }
        .icon-item:hover {
            cursor: pointer;
            background-color: #fcfcfc;
         }
      </style>
      <div class="icon-wrap">
        <div class="icon-item">
          <i class="l4-icon l4--merge-cells icon" ${cacheStore.ra}></i>
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

    const mergeBtn = controlStore.toolbarShadow.querySelector(`.l4--merge-cells[${ra}]`);
    // console.log(mergeBtn);
    const mergeBtnDisabled = mergeBtn.hasAttribute('disabled');
    mergeBtn.removeEventListener('click', this.mergeCells);
    if (!mergeBtnDisabled) {
      mergeBtn.addEventListener('click', this.mergeCells)
    }
  }


  mergeCells() {
    // const is
    if (selectArea.selectedCellAreas.length === 0) {
      controlStore.selectArea.setDefault();
      return ;
    }

    if (CellAreaUtil.isSingleCell(selectArea.selectedCellAreas)) {
      return ;
    }

    if (selectArea.selectedCellAreas.length > 1) {
      MsgUtil.toast('选择区域无效');
      return ;
    }

    const [ri1, ci1, ri2, ci2] = selectArea.selectedCellAreas[0];

    state.mergeCells.push([ri1, ci1, ri2 - ri1 + 1, ci2 - ci1 + 1]);

    cacheStore.mergeCellIndexes = MergeCellUtil.computeMergeCellIndex(state.mergeCells);

    ViewUtil.refreshView(ViewUtil.drawSelectCell);
  }

}
