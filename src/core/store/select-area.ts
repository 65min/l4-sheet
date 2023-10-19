
class SelectArea {
  rowIndex: number;
  colIndex: number;
  selectedCell: [number, number];
  selectedCellAreas: [number, number, number, number][];
}

const selectArea: SelectArea = {
  rowIndex: -1,
  colIndex: -1,
  selectedCell: [-1, -1],
  selectedCellAreas: []
}
// window.selectArea = selectArea;
export default selectArea;
