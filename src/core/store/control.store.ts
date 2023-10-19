import {RowHeaderDrawer} from '../draw/row-header.ts';
import {ColHeaderDrawer} from '../draw/col-header.ts';
import {CellContentDrawer} from '../draw/cell-content.ts';
import {TableHeaderDrawer} from '../draw/table-header.ts';
import {BackgroundDrawer} from '../draw/background.ts';
import {SelectAreaDrawer} from '../draw/select-area.ts';
import {HScroll} from '../draw/h-scroll.ts';
import {VScroll} from '../draw/v-scroll.ts';

const tableHeader: TableHeaderDrawer = null;
const rowHeader: RowHeaderDrawer = null;
const colHeader: ColHeaderDrawer = null;
const cellContent: CellContentDrawer = null;
const background: BackgroundDrawer = null;
const selectArea: SelectAreaDrawer = null;


const hScroll: HScroll = null;
const vScroll: VScroll = null;

export default {
  tableHeader,
  rowHeader,
  colHeader,
  cellContent,
  background,
  selectArea,

  hScroll,
  vScroll
}
