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

  public static fillPath(ctx: CanvasRenderingContext2D, points: Point[], style: Style) {

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

  /**
   * 绘制矩形
   *
   * @param ctx
   * @param x
   * @param y
   * @param width
   * @param height
   * @param style
   */
  public static drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, style: Style) {
    if (style.fillStyle) {
      ctx.fillStyle = style.fillStyle;
    }
    ctx.fillRect(x, y, width, height);
    if (style.strokeStyle) {
      ctx.lineWidth = style.lineWidth || .5;
      ctx.strokeStyle = style.strokeStyle || '#aeaeae';
      ctx.strokeRect(x + .5, y + .5, width, height);
    }
  }

  /**
   * 绘制线条
   *
   * @param ctx
   * @param points
   * @param style
   */
  public static drawLine(ctx: CanvasRenderingContext2D, points: Point[], style: Style) {
    if (style.lineJoin) {
      ctx.lineJoin = style.lineJoin;
    } else {
      ctx.lineJoin = 'miter';
    }
    if (style.strokeStyle) {
      ctx.strokeStyle = style.strokeStyle;
    } else {
      ctx.strokeStyle = '#000000';
    }
    if (style.lineWidth) {
      ctx.lineWidth = style.lineWidth;
    } else {
      ctx.lineWidth = .5;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
  }

  /**
   * 绘制备注文本
   *
   * @param ctx
   * @param text
   * @param point
   * @param style
   */
  public static drawRemark(ctx: CanvasRenderingContext2D, text: string, point: Point, style: Style) {
    const {width} = ctx.measureText(text);

    const textFillStyle = style.fillStyle;

    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#aaaaaaaa';
    style.fillStyle = style.fillStyle || '#ffffff';
    style.strokeStyle = style.strokeStyle || '#aaaaaa';
    CanvasUtil.drawRect(ctx, point.x, point.y, width + 12, 24, style);

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = '#ffffffff';

    ctx.fillStyle = textFillStyle || '#565656';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'middle';

    if (style.font) {
      ctx.font = style.font;
    } else {
      ctx.font = '12px Microsoft YaHei';
    }

    ctx.fillText(text, point.x + 5, point.y + 14);
  }
}
