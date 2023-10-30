
interface CacheStore {
  colWidthArr: number[];
  totalColWidthArr: number[];
  rowHeightArr: number[];
  totalRowHeightArr: number[];
  raf: number;
}

const cacheStore: CacheStore = {
  colWidthArr: [],
  totalColWidthArr: [],
  rowHeightArr: [],
  totalRowHeightArr: [],
  raf: null
}

window.cacheStore = cacheStore;
export default cacheStore;
