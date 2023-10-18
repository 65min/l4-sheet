import BasePlugin from '../base-plugin.ts';
import store from '../../store';
import {PluginType} from '../plugin-type.enum.ts';
import cellContent from '../../store/cell-content.ts';
import {AreaUtil} from '../../utils/area-util.ts';
import {Point} from '../../model/point.ts';
import config from '../../config';
import state from '../../store/state.ts';

export default class MouseContentPlugin extends BasePlugin {

  type = PluginType.EventMouseContent;

  init(): void {
    this.initContentEvent();
  }

  private initContentEvent() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent)
  }

  handleMousemoveEvent(event: MouseEvent) {
    store.$canvas.style.cursor = 'default';
    const point = new Point(event.offsetX, event.offsetY);
    for (let i = 0; i < cellContent.cellContentArea.length; i++) {
      const rowArea = cellContent.cellContentArea[i];
      let flag = false;
      for (let j = 0; j < rowArea.length; j++) {
        const area = rowArea[j];
        if (area && AreaUtil.inArea(point, area)) {
          if (event.offsetX > config.rowHeaderWidth && event.offsetX < config.rowHeaderWidth + state.viewWidth &&
            event.offsetY > config.colHeaderHeight && event.offsetY < config.colHeaderHeight + state.viewHeight) {
            store.$canvas.style.cursor = 'cell';
            flag = true;
            break;
          }
        }
      }
      if (flag) {
        break;
      }
    }
  }

}
