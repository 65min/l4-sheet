import {Area} from '../model/area.ts';

const hScrollArea: Area = null;
const hScrollBarArea: Area = null;
const hScrollLArea: Area = null;
const hScrollRArea: Area = null;
const vScrollArea: Area = null;
const vScrollBarArea: Area = null;
const vScrollLArea: Area = null;
const vScrollRArea: Area = null

const tableHeaderArea: Area = null;
const colHeaderArea: Area[] = null;
const rowHeaderArea: Area[] = null;

const cellContentArea: Area[][] = null;
const backgroundArea: Area = null;

const areaStore = {
  hScrollArea,
  hScrollBarArea,
  hScrollLArea,
  hScrollRArea,
  vScrollArea,
  vScrollBarArea,
  vScrollLArea,
  vScrollRArea,

  tableHeaderArea,
  colHeaderArea,
  rowHeaderArea,

  cellContentArea,
  backgroundArea
};

// window.areaStore = areaStore;

export default areaStore;
