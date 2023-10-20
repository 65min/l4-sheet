import {Point} from '../model/point.ts';
import {CellIndex} from '../def/cell-area.ts';

type OperateType = 'scroll-h' | 'scroll-v' | 'select-cell' | 'select-multi-cell' | '';


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
  private _selectCellState: {
    beginCell: CellIndex,
    endCell: CellIndex,
  } = {beginCell: [-1, -1], endCell: [-1, -1]}


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

  get selectCellState(): { beginCell: CellIndex; endCell: CellIndex } {
    return this._selectCellState;
  }

  set selectCellState(value: { beginCell: CellIndex; endCell: CellIndex }) {
    this._selectCellState = value;
  }
}

export default new Operate();
