

const state = {
  colNum: 125,
  rowNum: 7890,
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

  cols: {1: {w: 100}, 3: {w: 160}},
  rows: {4: {h: 90}, 5: {h: 130}},
  // cols: {},
  // rows: {},
}

// window.state = state;

export default state;
