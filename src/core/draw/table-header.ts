import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas.util.ts';
import {Point} from '../model/point.ts';

export class TableHeaderDrawer extends BaseDrawer {

  area: Area | undefined;

  draw(): Area {
    CanvasUtil.drawRect(this.$ctx, 0, 0, config.rowHeaderWidth, config.colHeaderHeight, {fillStyle: '#e9e9e9', strokeStyle: '#a1a1a1'});

    CanvasUtil.fillPath(
      this.$ctx,
      [
        new Point(config.rowHeaderWidth - 2, config.colHeaderHeight - 12),
        new Point(config.rowHeaderWidth - 2, config.colHeaderHeight - 2),
        new Point(config.rowHeaderWidth - 12, config.colHeaderHeight - 2),
      ],
      {
        fillStyle: '#bbbbbb'
      }
    )

    this.area = new Area(0, 0, config.rowHeaderWidth, 20);
    return this.area;
  }
  
}
