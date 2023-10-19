import {Point} from '../model/point.ts';
import {Area} from '../model/area.ts';


export class AreaUtil {

  /**
   * 点是否在区域里
   * @param point
   * @param area
   */
  public static inArea(point: Point, area: Area): boolean {
    if (!point || !area) {
      return false;
    }
    const {x, y} = point;
    const {x1, y1, x2, y2} = area;
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  }

  /**
   * 计算最小的包围area
   *
   * @param areas
   */
  public static computeMinArea(areas: Area[]): Area {
    const x1 = Math.min(...areas.map((area: Area) => area.x1));
    const x2 = Math.max(...areas.map((area: Area) => area.x2));
    const y1 = Math.min(...areas.map((area: Area) => area.y1));
    const y2 = Math.max(...areas.map((area: Area) => area.y2));
    return new Area(x1, y1, x2, y2);
  }
}
