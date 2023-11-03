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
import {CellIndexUtil} from '../../utils/cell-index.util.ts';
import cacheStore from '../../store/cache.store.ts';

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

  private isEventInCell(event: { offsetX: number, offsetY: number }): CellIndex | null {
    const point = new Point(event.offsetX, event.offsetY);
    const {beginRow, beginCol, endRow, endCol} = controlStore.cellContent;
    for (let i = beginRow; i <= endRow; i++) {
      const rowArea = areaStore.cellContentArea[i];
      for (let j = beginCol; j <= endCol; j++) {
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
    if (type === 'scroll-h' || type === 'scroll-v' || type === 'resize-col' || type === 'resize-row') {
      return ;
    }
    if (store.$canvas.style.cursor !== 'row-resize' && store.$canvas.style.cursor !== 'col-resize') {
      store.$canvas.style.cursor = 'default';
    }
    if (this.isEventInCell(event)) {
      store.$canvas.style.cursor = 'cell';
    }

  }

  handleMousemoveSelectEvent(event: MouseEvent) {
    const {type} = operate;
    const cellIndex = this.isEventInCell(event);
    if (type === 'select-cell') {
      if (CellIndexUtil.equals(operate.selectCellState.endCell, cellIndex)) {
        return ;
      }
      operate.selectCellState.endCell = cellIndex;
      const {beginCell, endCell} = operate.selectCellState;
      // selectedCellAreas.push([...beginCell, ...endCell]);
      if (selectArea.selectedCellAreas.length === 0) {
        // selectArea.selectedCellAreas.push(CellAreaUtil.computeMinCellArea(beginCell, endCell));
        selectArea.selectedCellAreas.push([...beginCell, ...endCell, ...beginCell]);
      } else {
        // selectArea.selectedCellAreas[selectArea.selectedCellAreas.length - 1] = [...beginCell, ...endCell, ...beginCell];
        const endCellArea: CellArea = [...beginCell, ...endCell, ...beginCell];
        const mixMergeCellArea = this.mixMergeCell(endCellArea);
        // console.log(mixMergeCellArea);
        selectArea.selectedCellAreas[selectArea.selectedCellAreas.length - 1] = mixMergeCellArea;
      }

      ViewUtil.refreshView();
      controlStore.selectArea.draw();
    } else if (type === 'select-multi-cell') {
      if (CellIndexUtil.equals(operate.selectCellState.endCell, cellIndex)) {
        return ;
      }
      operate.selectCellState.endCell = cellIndex;
      const {beginCell, endCell} = operate.selectCellState;

      // 开始单元格是否在选择区域内
      if (operate.selectCellState.deselect) {
        const deSelectedCellArea: CellArea = [...beginCell, ...endCell, ...beginCell];
        const mixMergeCellDeselectedCellArea = this.mixMergeCell(deSelectedCellArea);
        selectArea.deSelectedCellArea = mixMergeCellDeselectedCellArea;
      } else {
        const endCellArea: CellArea = [...beginCell, ...endCell, ...beginCell];
        const mixMergeCellArea = this.mixMergeCell(endCellArea);
        selectArea.selectedCellAreas.splice(selectArea.selectedCellAreas.length - 1, 1, mixMergeCellArea)
      }

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
    selectArea.deSelectedCellArea = null;
    if (cellIndex) {
      ViewUtil.refreshView();
      // const [cri, cci] = selectArea.selectCell;
      selectArea.selectedCellAreas = selectArea.selectedCellAreas || [];
      selectArea.selectedCellAreas.forEach(selectArea => this.revertCells(selectArea));
      if (!event.ctrlKey) {
        selectArea.selectedCell = cellIndex;
        selectArea.selectedCellAreas = [[...cellIndex, ...cellIndex]];
      } else {
        // 是否反向选择
        operate.selectCellState.deselect = selectArea.selectedCellAreas.findIndex(item => CellAreaUtil.cellAreaContainsCell(item, cellIndex)) >= 0;
        const cellArea: CellArea = [...cellIndex, ...cellIndex, ...cellIndex];
        const mixMergeCellArea = this.mixMergeCell(cellArea);
        if (operate.selectCellState.deselect) {
          selectArea.deSelectedCellArea = mixMergeCellArea;
        } else {
          selectArea.selectedCellAreas.push(mixMergeCellArea);
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

  /**
   * 范围混合合并单元格
   *
   * @param cellArea
   * @private
   */
  private mixMergeCell(cellArea: CellArea): CellArea {
    const [ri1, ci1, ri2, ci2] = CellAreaUtil.normalizeCellarea(cellArea);
    const parentMergeCellAreas: CellArea[] = [];
    for (let i = ri1; i <= ri2; i++) {
      for (let j = ci1; j <= ci2; j++) {
        if (cacheStore.mergeCellIndexes[i] && cacheStore.mergeCellIndexes[i][j]) {
          const targetMergeCellIndex = cacheStore.mergeCellIndexes[i][j];
          const targetMergeCell = state.mergeCells.find((item) => targetMergeCellIndex[0] === item[0] && targetMergeCellIndex[1] === item[1])
          const existMergeCell = parentMergeCellAreas.find(item => targetMergeCell[0] === item[0] && targetMergeCell[1] === item[1]);
          if (!existMergeCell) {
            const [ri, ci, rs, cs] = targetMergeCell;
            parentMergeCellAreas.push([ri, ci, ri + rs - 1, ci + cs - 1]);
          }
        }
      }
    }

    // const mergeCellAreas = mergeCells.map(item => ([item[0], item[1], item[0] + item[2] -1, item[1] + item[3] -1] as CellArea));
    const resultCellArea = parentMergeCellAreas.reduce((prev, curr) => CellAreaUtil.computeCellAreaUnion(prev, curr), cellArea);
    if (CellAreaUtil.equals(cellArea, resultCellArea)) {
      return resultCellArea;
    }
    // 递归调用，检测是否有更大的选择区域
    return this.mixMergeCell(resultCellArea);
  }

  private handleMouseupEvent(_event: MouseEvent) {
    if (operate.type === 'select-cell' || operate.type === 'select-multi-cell') {
      if (selectArea.deSelectedCellArea) {
        for (let i = selectArea.selectedCellAreas.length - 1; i >= 0; i--) {
          const selectedCellArea = selectArea.selectedCellAreas[i];
          const subtractCellArea = CellAreaUtil.splitWithoutTargetCell(selectedCellArea, selectArea.deSelectedCellArea);
          subtractCellArea.sort(() => -1);
          selectArea.selectedCellAreas.splice(i, 1, ...subtractCellArea);
        }
      }
      ViewUtil.refreshView();
      selectArea.deSelectedCellArea = null;
      controlStore.selectArea.draw();
      // selectArea.deSelectedCellArea = null;
      operate.type = '';
      operate.selectCellState.beginCell = [-1, -1];
      operate.selectCellState.endCell = [-1, -1];
    }
  }

}
