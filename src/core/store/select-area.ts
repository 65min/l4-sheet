import {CellArea, CellIndex} from '../def/cell-area.ts';

class SelectArea {
  // rowIndex: number;
  // colIndex: number;
  selectedCell: CellIndex;
  selectedCellAreas: CellArea[];
}

const selectArea: SelectArea = {
  // rowIndex: -1,
  // colIndex: -1,
  selectedCell: [-1, -1],
  selectedCellAreas: []
}
// window.selectArea = selectArea;
export default selectArea;
