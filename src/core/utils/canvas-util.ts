import state from '../store/state.ts';
import {Point} from '../model/point.ts';
import {Style} from '../def/style.ts';

export class CanvasUtil {

  public static computeEmptyWidth(offsetX: number): number {
    let emptyWidth = offsetX + state.viewWidth - state.contentWidth;
    if (emptyWidth < 0) {
      emptyWidth = 0;
    }
    return emptyWidth;
  }
  public static computeEmptyHeight(offsetY: number): number {
    let emptyHeight = offsetY + state.viewHeight - state.contentHeight;
    if (emptyHeight < 0) {
      emptyHeight = 0;
    }
    return emptyHeight;
  }

  public static drawPath(ctx: CanvasRenderingContext2D, points: Point[], style: Style) {

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i ++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[0].x, points[0].y);

    if (style.fillStyle) {
      ctx.fillStyle = style.fillStyle;
    }
    ctx.fill();

  }

}
