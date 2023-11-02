import {CommonUtil} from '../utils/common.util.ts';

export type MergeCellIndex = {[key: number]: {[key: number]: [number, number]}};

interface CacheStore {
  colWidthArr: number[];
  totalColWidthArr: number[];
  rowHeightArr: number[];
  totalRowHeightArr: number[];
  raf: number;
  ra: string;

  mergeCellIndexes: MergeCellIndex
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
