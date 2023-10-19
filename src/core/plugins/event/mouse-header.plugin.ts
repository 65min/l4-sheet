import BasePlugin from '../base-plugin.ts';
import config from '../../config';
import control from '../../store/control.store.ts';
import state from '../../store/state.ts';
import {PluginType} from '../plugin-type.enum.ts';
import areaStore from '../../store/area.store.ts';
import controlStore from '../../store/control.store.ts';
// import store from '../../store';

export default class MouseHeaderPlugin extends BasePlugin {

  type = PluginType.EventMouseHeader;

  init(): void {
    this.initHeader();
  }

  handleMousemoveEvent(event: MouseEvent) {
    // console.log(event);
    // const point = new Point(event.offsetX, event.offsetY);
    // control.colHeader.hoverIndex = -1;

    {
      const currentHoverIndex = control.colHeader.hoverIndex;
      control.colHeader.hoverIndex = -1;
      let drawFlag = false;
      if (event.offsetY <= config.colHeaderHeight && event.offsetX < (config.rowHeaderWidth + state.viewWidth) && event.offsetX > config.rowHeaderWidth) {
        for (let i = 0; i < areaStore.colHeaderArea.length; i++) {
          const area = areaStore.colHeaderArea[i];
          if (!area) {
            continue;
          }
          if (area.x1 <= event.offsetX && area.x2 >= event.offsetX) {
            if (currentHoverIndex === i) {
              break;
            } else {
              drawFlag = true;
              control.colHeader.hoverIndex = i;
            }
            break;
          }
        }

        if (drawFlag) {
          // 是否只绘制发生变化的单元格 TODO
          control.colHeader.draw();
        }
      } else {
        control.colHeader.draw();
      }
    }
    {
      const currentHoverIndex = control.rowHeader.hoverIndex;
      control.rowHeader.hoverIndex = -1;
      let drawFlag = false;
      if (event.offsetX <= config.rowHeaderWidth && event.offsetY < (config.colHeaderHeight + state.viewHeight) && event.offsetY > config.colHeaderHeight) {
        for (let i = 0; i < areaStore.rowHeaderArea.length; i++) {
          const area = areaStore.rowHeaderArea[i];
          if (!area) {
            continue;
          }
          if (area.y1 <= event.offsetY && area.y2 >= event.offsetY) {
            if (currentHoverIndex === i) {
              break;
            } else {
              drawFlag = true;
              control.rowHeader.hoverIndex = i;
            }
            break;
          }
        }

        if (drawFlag) {
          // 是否只绘制发生变化的单元格 TODO
          control.rowHeader.draw();
        }
      } else {
        control.rowHeader.draw();
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

  initHeader() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent);
    this.$target.addEventListener('mouseleave', this.handleMouseleaveEvent);
  }
}
