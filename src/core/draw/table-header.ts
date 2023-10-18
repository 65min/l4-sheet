import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import config from '../config';
import {CanvasUtil} from '../utils/canvas-util.ts';
import {Point} from '../model/point.ts';

export class TableHeaderDrawer extends BaseDrawer {

  area: Area | undefined;

  draw(): Area {
    // console.log('draw table header')
    this.$ctx.fillStyle = '#e9e9e9';
    // this.$ctx.fillRect(.5, .5, 35.5, 19.5);
    this.$ctx.fillRect(0, 0, config.rowHeaderWidth, 20);
    this.$ctx.strokeStyle = '#a1a1a1';

    this.$ctx.lineWidth = .5;
    this.$ctx.strokeRect(.5, .5, config.rowHeaderWidth, 20);

    CanvasUtil.drawPath(
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
