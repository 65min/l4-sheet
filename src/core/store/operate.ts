import {Point} from '../model/point.ts';
import {CellIndex} from '../def/cell-area.ts';

type OperateType = 'scroll-h' | 'scroll-v' | 'select-cell' | 'select-multi-cell' | 'resize-col'  | 'resize-row' | '';

interface ScrollHState {
  initOffsetX: number;
  beginPoint: Point;
  endPoint: Point;
}
interface ScrollVState {
  initOffsetY: number;
  beginPoint: Point;
  endPoint: Point;
}

interface SelectCellState {
  deselect: boolean; // 是否反选
  beginCell: CellIndex; // 开始单元格
  endCell: CellIndex; // 结束单元格
}

interface ResizeColSatate {
  resizeIndex: number;
  initWidth: number;
  beginX: number;
  endX: number;
}
interface ResizeRowSatate {
  resizeIndex: number;
  initHeight: number;
  beginY: number;
  endY: number;
}

class Operate {

  private _type: OperateType;
  private _scrollHState: ScrollHState = {initOffsetX: 0, beginPoint: null, endPoint: null};
  private _scrollVState: ScrollVState = {initOffsetY: 0, beginPoint: null, endPoint: null};
  private _selectCellState: SelectCellState = {deselect: false, beginCell: [-1, -1], endCell: [-1, -1]}
  private _resizeColState: ResizeColSatate = {resizeIndex: -1, initWidth: -1, beginX: null, endX: null}
  private _resizeRowState: ResizeRowSatate = {resizeIndex: -1, initHeight: -1, beginY: null, endY: null}

  get type(): OperateType {
    return this._type;
  }

  set type(value: OperateType) {
    this._type = value;
  }

  get scrollHState(): ScrollHState {
    return this._scrollHState;
  }

  set scrollHState(value: ScrollHState) {
    this._scrollHState = value;
  }

  get scrollVState(): ScrollVState {
    return this._scrollVState;
  }

  set scrollVState(value: ScrollVState) {
    this._scrollVState = value;
  }

  get selectCellState(): SelectCellState {
    return this._selectCellState;
  }

  set selectCellState(value: SelectCellState) {
    this._selectCellState = value;
  }

  get resizeColState(): ResizeColSatate {
    return this._resizeColState;
  }

  set resizeColState(value: ResizeColSatate) {
    this._resizeColState = value;
  }

  get resizeRowState(): ResizeRowSatate {
    return this._resizeRowState;
  }

  set resizeRowState(value: ResizeRowSatate) {
    this._resizeRowState = value;
  }
}

const operate = new Operate();

// window.operate = operate;

export default operate;
