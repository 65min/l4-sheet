import areaStore from '../store/area.store.ts';
import control from '../store/control.store.ts';
import selectArea from '../store/select-area.ts';
import controlStore from '../store/control.store.ts';

export class ViewUtil {

  /**
   * 刷新视图
   *
   * @param cellInitHandler
   */
  public static refreshView(cellInitHandler: Function = null) {
    areaStore.backgroundArea = control.background.draw();
    areaStore.cellContentArea = control.cellContent.draw();

    if (cellInitHandler) {
      cellInitHandler();
    }
    areaStore.tableHeaderArea = control.tableHeader.draw();

    areaStore.colHeaderArea = control.colHeader.draw();
    areaStore.rowHeaderArea = control.rowHeader.draw();

    areaStore.rowHeaderArea = control.rowHeader.draw();

    if (control.hScroll) {
      const [hScrollBarArea, hLeftBtnArea, hRightBtnArea, hScrollArea] = control.hScroll.draw();
      areaStore.hScrollBarArea = hScrollBarArea;
      areaStore.hScrollArea = hScrollArea;
      areaStore.hScrollLArea = hLeftBtnArea;
      areaStore.hScrollRArea = hRightBtnArea;
    }

    if (control.vScroll) {
      const [vScrollBarArea, vLeftBtnArea, vRightBtnArea, vScrollArea] = control.vScroll.draw();
      areaStore.vScrollBarArea = vScrollBarArea;
      areaStore.vScrollArea = vScrollArea;
      areaStore.vScrollLArea = vLeftBtnArea;
      areaStore.vScrollRArea = vRightBtnArea;
    }
  }

  public static drawSelectCell() {
    const [cri, cci] = selectArea.selectedCell;
    if (cri >= 0 && cci >= 0) {
      // controlStore.cellContent.drawCell(cri, cci);
      controlStore.selectArea.draw();
      controlStore.colHeader.draw();
      controlStore.rowHeader.draw();
      const {vScroll, hScroll} = controlStore;
      if (vScroll) {
        vScroll.draw();
      }
      if (hScroll) {
        hScroll.draw();
      }
    }
  }
}
