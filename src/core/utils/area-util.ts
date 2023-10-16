import {Point} from '../model/point.ts';
import {Area} from '../model/area.ts';


export class AreaUtil {

  /**
   * 点是否在区域里
   * @param point
   * @param area
   */
  public static inArea(point: Point, area: Area): boolean {
    const {x, y} = point;
    const {x1, y1, x2, y2} = area;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  }

}
