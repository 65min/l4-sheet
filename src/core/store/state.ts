import {Cell} from '../def/cell.ts';


export type MergeCell = [number, number, number, number]; // 分别为rowindex、colindex、rowspan、colspan

interface State {
  colNum: number;
  rowNum: number;
  canvasWidth: number;
  canvasHeight: number;
  contentWidth: number;
  contentHeight: number;
  viewWidth: number;
  viewHeight: number;
  vScrollWidth: number;
  hScrollHeight: number;
  vScrollRatio: number;
  hScrollRatio: number;
  offsetX: number;
  offsetY: number;
  deltaX: number;
  deltaY: number;
  emptyHeight: number;
  emptyWidth: number;

  cols: {[key: number]: {w?: number}};
  rows: {[key: number]: {h?: number}};

  mergeCells: MergeCell[];

  cells: {[key: number]: {[key: number]: Cell}}
}

const state: State = {
  colNum: 25,
  rowNum: 89,
  canvasWidth: 0, // canvas组件宽度
  canvasHeight: 0,
  contentWidth: 0, // 单元格宽度
  contentHeight: 0,
  viewWidth: 0, // 视图宽度
  viewHeight: 0,
  vScrollWidth: -1,
  hScrollHeight: -1,
  vScrollRatio: 1,
  hScrollRatio: 1,
  offsetX: 0,
  offsetY: 0,
  deltaX: 0,
  deltaY: 0,
  emptyHeight: 0,
  emptyWidth: 0,

  // cols: {1: {w: 100}, 3: {w: 160}, 6: {w: 150}},
  // rows: {4: {h: 90}, 5: {h: 130}},
  cols: {},
  rows: {},
  
  mergeCells: [],

  cells: {0: {0: {bc: '#00bcd4'}}}
}

window.state = state;

export default state;
