import state from '../store/state.ts';

export class CanvasUtil {

  public static computeEmptyHeight(offsetY: number): number {
    let emptyHeight = offsetY + state.viewHeight - state.contentHeight;
    if (emptyHeight < 0) {
      emptyHeight = 0;
    }
    return emptyHeight;
  }

}
