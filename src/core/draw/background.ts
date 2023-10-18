import {BaseDrawer} from './base.ts';
import {Area} from '../model/area.ts';
import state from '../store/state.ts';

export class BackgroundDrawer extends BaseDrawer {

  area: Area | undefined;

  draw(): Area {
    this.$ctx.fillStyle = '#f3f3f3';
    // this.$ctx.fillRect(.5, .5, 35.5, 19.5);
    this.$ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);

    // this.$ctx.strokeStyle = '#a1a1a1';
    // this.$ctx.lineWidth = .5;
    // this.$ctx.strokeRect(.5, .5, 36, 20);

    this.area = new Area(0, 0, state.canvasWidth, state.canvasHeight);
    return this.area;
  }

}
