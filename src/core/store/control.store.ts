import {RowHeaderDrawer} from '../draw/row-header.draw.ts';
import {ColHeaderDrawer} from '../draw/col-header.draw.ts';
import {CellContentDrawer} from '../draw/cell-content.draw.ts';
import {TableHeaderDrawer} from '../draw/table-header.draw.ts';
import {BackgroundDrawer} from '../draw/background.draw.ts';
import {SelectAreaDrawer} from '../draw/select-area.draw.ts';
import {HScrollDraw} from '../draw/h-scroll.draw.ts';
import {VScrollDraw} from '../draw/v-scroll.draw.ts';

const tableHeader: TableHeaderDrawer = null;
const rowHeader: RowHeaderDrawer = null;
const colHeader: ColHeaderDrawer = null;
const cellContent: CellContentDrawer = null;
const background: BackgroundDrawer = null;
const selectArea: SelectAreaDrawer = null;


const hScroll: HScrollDraw = null;
const vScroll: VScrollDraw = null;

const controlStore = {
  tableHeader,
  rowHeader,
  colHeader,
  cellContent,
  background,
  selectArea,

  hScroll,
  vScroll
}
window.controlStore = controlStore;
export default controlStore;
