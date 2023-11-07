import selectArea from '../store/select-area.ts';
import {CellIndex} from '../def/cell-area.ts';
import controlStore from '../store/control.store.ts';
import state from '../store/state.ts';
import cacheStore from '../store/cache.store.ts';
import wrapStore from '../store/wrap.store.ts';
import {PluginType} from '../plugins/plugin-type.enum.ts';
import config from '../config';
import {Cell} from '../def/cell.ts';
import {ViewUtil} from './view.util.ts';


export default class EditUtil {

  public static beginEditCell() {
    let left: number = 0;
    let top: number = 0;
    const selectedCellArea = selectArea.selectedCellAreas[selectArea.selectedCellAreas.length - 1];
    const targetCellIndex: CellIndex = [selectedCellArea[4], selectedCellArea[5]];
    let [targetRi, targetCi] = targetCellIndex;
    if (targetRi <= controlStore.cellContent.beginRow) {
      if (targetRi === 0) {
        state.offsetY = 0;
      } else {
        state.offsetY = cacheStore.totalColWidthArr[targetRi - 1]
      }
      top = state.offsetY;
    } else if (targetRi >= controlStore.cellContent.endRow) {
      let totalHeight = 0;
      for (let i = targetRi; i >= 0; i--) {
        if (totalHeight < state.viewHeight && totalHeight + cacheStore.rowHeightArr[i] >= state.viewHeight) {
          state.offsetY = cacheStore.totalRowHeightArr[i];
          break;
        }
        totalHeight = totalHeight + cacheStore.rowHeightArr[i];
      }
      top = state.offsetY;
    } else {
      top = cacheStore.totalRowHeightArr[targetRi - 1];
    }

    if (targetCi <= controlStore.cellContent.beginCol) {
      if (targetCi === 0) {
        state.offsetX = 0;
      } else {
        state.offsetX = cacheStore.totalColWidthArr[targetCi - 1]
      }
      left = state.offsetX;
    } else if (targetCi >= controlStore.cellContent.endCol) {
      let totalWidth = 0;
      for (let i = targetCi; i >= 0; i--) {
        if (totalWidth < state.viewWidth && totalWidth + cacheStore.colWidthArr[i] >= state.viewWidth) {
          state.offsetX = cacheStore.totalColWidthArr[i];
          break;
        }
        totalWidth = totalWidth + cacheStore.colWidthArr[i];
      }
      left = state.offsetX;
    } else {
      left = cacheStore.totalColWidthArr[targetCi - 1];
    }

    const textBox = wrapStore.wrap.getPlugin(PluginType.TextBox);
    textBox.left = left + config.rowHeaderWidth;
    textBox.top = top + config.colHeaderHeight + 64;
    textBox.width = cacheStore.colWidthArr[targetCi];
    textBox.height = cacheStore.rowHeightArr[targetRi];

    let cell: Cell = {};
    if (state.cells[targetRi]) {
      cell = state.cells[targetRi][targetCi] || {};
    }
    textBox.cell = cell;
    textBox.initText = cell.t || '';

    textBox.init();
    textBox.show();

    cacheStore.editCellIndex = [targetRi, targetCi];
  }


  public static endEdit(): void {
    if (cacheStore.editCellIndex === null) {
      return ;
    }
    const textbox = wrapStore.wrap.getPlugin(PluginType.TextBox);
    const $textbox = wrapStore.wrap.getPlugin(PluginType.TextBox).$textbox;
    if ($textbox === undefined) {
      return;
    }
    const text = $textbox.innerText;
    const [ri, ci] = cacheStore.editCellIndex;
    if (state.cells[ri] === undefined) {
      state.cells[ri] = {};
    }
    if (state.cells[ri][ci] === undefined) {
      state.cells[ri][ci] = {};
    }
    state.cells[ri][ci].v = text;
    state.cells[ri][ci].t = text;

    $textbox.innerText = '';

    textbox.hide();
    cacheStore.editCellIndex = null;
    ViewUtil.refreshView(ViewUtil.drawSelectCell);
  }

  public static cancelEdit(): void {
    const textbox = wrapStore.wrap.getPlugin(PluginType.TextBox);
    const $textbox = wrapStore.wrap.getPlugin(PluginType.TextBox).$textbox;
    if ($textbox === undefined) {
      return;
    }

    $textbox.innerText = '';

    textbox.hide();
    cacheStore.editCellIndex = null;
    ViewUtil.refreshView(ViewUtil.drawSelectCell);
  }
}
