import {CommonUtil} from '../utils/common.util.ts';
import {CellIndex} from '../def/cell-area.ts';

export type MergeCellIndex = {[key: number]: {[key: number]: CellIndex}}; // 如单元格[0, 0]跨2行3列，则：｛1: {1: [0, 0]}｝

interface CacheStore {
  colWidthArr: number[];
  totalColWidthArr: number[];
  rowHeightArr: number[];
  totalRowHeightArr: number[];
  raf: number;
  ra: string;

  mergeCellIndexes: MergeCellIndex;

}

const cacheStore: CacheStore = {
  colWidthArr: [],
  totalColWidthArr: [],
  rowHeightArr: [],
  totalRowHeightArr: [],
  raf: null,
  ra: CommonUtil.randomAlphabet(6),
  mergeCellIndexes: {},
}

window.cacheStore = cacheStore;
export default cacheStore;
