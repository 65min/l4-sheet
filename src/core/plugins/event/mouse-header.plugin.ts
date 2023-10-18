import BasePlugin from '../base-plugin.ts';
import config from '../../config';
import header from '../../store/header.ts';
import control from '../../store/control.ts';
import state from '../../store/state.ts';
// import store from '../../store';

export default class MouseHeaderPlugin extends BasePlugin {
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
        for (let i = 0; i < header.colHeaderArea.length; i++) {
          const area = header.colHeaderArea[i];
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
        for (let i = 0; i < header.rowHeaderArea.length; i++) {
          const area = header.rowHeaderArea[i];
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
  }

  handleMouseleaveEvent() {
    control.colHeader.hoverIndex = -1;
    control.rowHeader.hoverIndex = -1;
    control.colHeader.draw();
    control.rowHeader.draw();
  }

  initHeader() {
    this.$target.addEventListener('mousemove', this.handleMousemoveEvent);
    this.$target.addEventListener('mouseleave', this.handleMouseleaveEvent);
  }
}
