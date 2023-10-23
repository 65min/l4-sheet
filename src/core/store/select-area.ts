import {CellArea, CellIndex} from '../def/cell-area.ts';

class SelectArea {
  // rowIndex: number;
  // colIndex: number;
  selectedCell: CellIndex;
  selectedCellAreas: CellArea[]; // 选择区域
  deSelectedCellArea: CellArea | null; // 反选区域
}

const selectArea: SelectArea = {
  // rowIndex: -1,
  // colIndex: -1,
  selectedCell: [-1, -1],
  selectedCellAreas: [],
  deSelectedCellArea: null
}
// window.selectArea = selectArea;
export default selectArea;
