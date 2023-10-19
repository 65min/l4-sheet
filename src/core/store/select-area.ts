
class SelectArea {
  rowIndex: number;
  colIndex: number;
  selectCell: [number, number];
  selectAreas: [number, number, number, number][];
}

const selectArea: SelectArea = {
  rowIndex: -1,
  colIndex: -1,
  selectCell: [-1, -1],
  selectAreas: []
}
// window.selectArea = selectArea;
export default selectArea;
