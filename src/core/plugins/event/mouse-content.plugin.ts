import BasePlugin from '../base-plugin.ts';
import store from '../../store';
import {PluginType} from '../plugin-type.enum.ts';
import {AreaUtil} from '../../utils/area.util.ts';
import {Point} from '../../model/point.ts';
import config from '../../config';
import state from '../../store/state.ts';
import selectArea from '../../store/select-area.ts';
import operate from '../../store/operate.ts';
import areaStore from '../../store/area.store.ts';
import controlStore from '../../store/control.store.ts';
import {CellAreaUtil} from '../../utils/cell-area.util.ts';
import {CellArea, CellIndex} from '../../def/cell-area.ts';
import {ViewUtil} from '../../utils/view.util.ts';

export default class MouseContentPlugin extends BasePlugin {

  type = PluginType.EventMouseContent;

  init(): void {
    this.initContentEvent();
  }

  private initContentEvent() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent.bind(this));

    this.$target.addEventListener('mousedown', this.handleMousedownEvent.bind(this));
    this.$target.addEventListener('mouseup', this.handleMouseupEvent.bind(this));
    this.$target.addEventListener('mousemove', this.handleMousemoveSelectEvent.bind(this));
  }

  private isEventInCell(event: MouseEvent): CellIndex | null {
    const point = new Point(event.offsetX, event.offsetY);
    for (let i = 0; i < areaStore.cellContentArea.length; i++) {
      const rowArea = areaStore.cellContentArea[i];
      for (let j = 0; j < rowArea.length; j++) {
        const area = rowArea[j];
        if (area && AreaUtil.inArea(point, area)) {
          if (event.offsetX > config.rowHeaderWidth && event.offsetX < config.rowHeaderWidth + state.viewWidth &&
            event.offsetY > config.colHeaderHeight && event.offsetY < config.colHeaderHeight + state.viewHeight) {
            return [i, j];
          }
        }
      }
    }

    return null;
  }

  handleMousemoveEvent(event: MouseEvent) {
    const {type} = operate;
    if (type === 'scroll-h' || type === 'scroll-v') {
      return ;
    }
    store.$canvas.style.cursor = 'default';
    if (this.isEventInCell(event)) {
      store.$canvas.style.cursor = 'cell';
    }

  }

  handleMousemoveSelectEvent(event: MouseEvent) {
    const {type} = operate;
    if (type === 'select-cell') {
      operate.selectCellState.endCell = this.isEventInCell(event);
      const {beginCell, endCell} = operate.selectCellState;
      // selectArea.selectedCellAreas.push([...beginCell, ...endCell]);
      if (selectArea.selectedCellAreas.length === 0) {
        selectArea.selectedCellAreas.push(CellAreaUtil.computeMinCellArea(beginCell, endCell));
      } else {
        selectArea.selectedCellAreas[selectArea.selectedCellAreas.length - 1] = CellAreaUtil.computeMinCellArea(beginCell, endCell);
      }

      // controlStore.selectArea.draw();
      ViewUtil.refreshView();
      controlStore.selectArea.draw();
    }
  }

  private drawNearbyCells(ri: number, ci: number) {
    controlStore.cellContent.drawCell(ri - 1, ci - 1);
    controlStore.cellContent.drawCell(ri - 1, ci);
    controlStore.cellContent.drawCell(ri - 1, ci + 1);
    controlStore.cellContent.drawCell(ri, ci - 1);
    controlStore.cellContent.drawCell(ri, ci);
    controlStore.cellContent.drawCell(ri, ci + 1);
    controlStore.cellContent.drawCell(ri + 1, ci - 1);
    controlStore.cellContent.drawCell(ri + 1, ci);
    controlStore.cellContent.drawCell(ri + 1, ci + 1);
  }

  private revertCells(selectCell: CellArea) {
    const [cri, cci] = selectCell;
    if (cri >= 0 && cci >= 0) {
      this.drawNearbyCells(cri, cci);
      controlStore.colHeader.draw();
      controlStore.rowHeader.draw();
      const {vScroll, hScroll} = controlStore;
      if (vScroll) {
        vScroll.draw();
      }
      if (hScroll) {
        hScroll.draw();
      }
    }
  }

  private handleMousedownEvent(event: MouseEvent) {
    const cellIndex = this.isEventInCell(event);
    if (cellIndex) {
      ViewUtil.refreshView();
      // const [cri, cci] = selectArea.selectCell;
      selectArea.selectedCellAreas.forEach(selectArea => this.revertCells(selectArea));
      selectArea.selectedCellAreas = selectArea.selectedCellAreas || [];
      if (!event.ctrlKey) {
        selectArea.selectedCell = cellIndex;
        selectArea.selectedCellAreas = [[...cellIndex, ...cellIndex]];
      } else {
        const cellArea: CellArea = [...cellIndex, ...cellIndex];
        const existIndex = selectArea.selectedCellAreas.findIndex(item => item[0] === cellArea[0] && item[1] === cellArea[1] && item[2] === cellArea[2] && item[3] === cellArea[3]);
        if (existIndex >= 0) {
          const removeCellArea = selectArea.selectedCellAreas.splice(existIndex, 1)[0];
          if (CellAreaUtil.cellAreaContainsCell(removeCellArea, selectArea.selectedCell)) {
            const lastCellArea = selectArea.selectedCellAreas[selectArea.selectedCellAreas.length - 1];
            selectArea.selectedCell = [lastCellArea[0], lastCellArea[1]];
          }
        } else {
          selectArea.selectedCellAreas.push(cellArea);
          selectArea.selectedCell = cellIndex;
        }
      }
      controlStore.selectArea.draw();
      controlStore.colHeader.draw();
      controlStore.rowHeader.draw();
      const {vScroll, hScroll} = controlStore;
      if (vScroll) {
        vScroll.draw();
      }
      if (hScroll) {
        hScroll.draw();
      }

      if (event.ctrlKey) {
        operate.type = 'select-multi-cell';
      } else {
        operate.type = 'select-cell';
      }
      operate.selectCellState.beginCell = cellIndex;
      operate.selectCellState.endCell = cellIndex;
    }
  }

  private handleMouseupEvent(_event: MouseEvent) {
    if (operate.type === 'select-cell') {
      operate.type = '';
      operate.selectCellState.beginCell = [-1, -1];
      operate.selectCellState.endCell = [-1, -1];
    }
  }

}
