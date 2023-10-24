
interface CacheStore {
  colWidthArr: number[];
  rowHeightArr: number[];
  raf: number;
}

const cacheStore: CacheStore = {
  colWidthArr: [],
  rowHeightArr: [],
  raf: null
}

export default cacheStore;
