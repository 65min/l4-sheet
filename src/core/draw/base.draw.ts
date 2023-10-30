import {Area} from '../model/area.ts';

export abstract class BaseDrawer {

  $ctx: CanvasRenderingContext2D;

  public abstract draw(): Area | Area[] | Area[][];

  constructor(context: CanvasRenderingContext2D) {
    this.$ctx = context;
  }

}
