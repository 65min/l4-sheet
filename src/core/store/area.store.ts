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

interface AreaStore {
  hScrollArea: Area;
  hScrollBarArea: Area;
  hScrollLArea: Area;
  hScrollRArea: Area;
  vScrollArea: Area;
  vScrollBarArea: Area;
  vScrollLArea: Area;
  vScrollRArea: Area;

  tableHeaderArea: Area;
  colHeaderArea: Area[];
  rowHeaderArea: Area[]

  cellContentArea: Area[][];
  backgroundArea: Area;
}

let areaStore: AreaStore = {
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

const queue: AreaStore[] = [];
// window.areaStore = areaStore;

export default areaStore;

export function setAreaStore(newAreaStore: AreaStore) {
  areaStore = newAreaStore;
}
