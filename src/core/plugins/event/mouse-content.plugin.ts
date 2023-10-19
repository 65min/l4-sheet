import BasePlugin from '../base-plugin.ts';
import store from '../../store';
import {PluginType} from '../plugin-type.enum.ts';
import {AreaUtil} from '../../utils/area-util.ts';
import {Point} from '../../model/point.ts';
import config from '../../config';
import state from '../../store/state.ts';
import selectArea from '../../store/select-area.ts';
import operate from '../../store/operate.ts';
import areaStore from '../../store/area.store.ts';
import controlStore from '../../store/control.store.ts';

export default class MouseContentPlugin extends BasePlugin {

  type = PluginType.EventMouseContent;

  init(): void {
    this.initContentEvent();
  }

  private initContentEvent() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent.bind(this));
    this.$target.addEventListener('mousedown', this.handleMousedownEvent.bind(this));
  }

  private isEventInCell(event: MouseEvent): [number, number] | null {
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
    if (operate.type) {
      return ;
    }
    store.$canvas.style.cursor = 'default';
    if (this.isEventInCell(event)) {
      store.$canvas.style.cursor = 'cell';
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

  private handleMousedownEvent(event: MouseEvent) {
    if (!event.ctrlKey) {
      const cellIndex = this.isEventInCell(event);
      if (cellIndex) {
        const [cri, cci] = selectArea.selectCell;
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
        selectArea.selectCell = cellIndex;
        selectArea.selectAreas = [[...cellIndex, ...cellIndex]];

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
      }
    }
  }

}
