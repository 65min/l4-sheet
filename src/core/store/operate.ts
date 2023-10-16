import {Point} from '../model/point.ts';

type OperateType = 'scroll-h' | 'scroll-v' | '';


class Operate {

  private _type: OperateType;
  private _scrollHState: {
    initOffsetX: number;
    beginPoint: Point,
    endPoint: Point
  } = {initOffsetX: 0, beginPoint: null, endPoint: null};
  private _scrollVState: {
    initOffsetY: number;
    beginPoint: Point,
    endPoint: Point
  } = {initOffsetY: 0, beginPoint: null, endPoint: null};


  get type(): OperateType {
    return this._type;
  }

  set type(value: OperateType) {
    this._type = value;
  }

  get scrollHState(): { initOffsetX: number; beginPoint: Point; endPoint: Point } {
    return this._scrollHState;
  }

  set scrollHState(value: { initOffsetX: number; beginPoint: Point; endPoint: Point }) {
    this._scrollHState = value;
  }

  get scrollVState(): { initOffsetY: number; beginPoint: Point; endPoint: Point } {
    return this._scrollVState;
  }

  set scrollVState(value: { initOffsetY: number; beginPoint: Point; endPoint: Point }) {
    this._scrollVState = value;
  }
}

export default new Operate();
