import BasePlugin from '../base-plugin.ts';
import {PluginType} from '../plugin-type.enum.ts';
import cacheStore from '../../store/cache.store.ts';
import {CommonUtil} from '../../utils/common.util.ts';
import EditUtil from '../../utils/edit.util.ts';
import wrapStore from '../../store/wrap.store.ts';

export default class EventGlobalPlugin extends BasePlugin {

  type = PluginType.EventGlobal;

  init(): void {
    this.initEvent();
  }

  private initEvent() {

    document.addEventListener('keydown', this.handleKeydownEvent.bind(this));
  }

  private handleKeydownEvent(event: KeyboardEvent): void {
    if (cacheStore.editCellIndex) {
      return ;
    }
    if (CommonUtil.isValidContent(event)) {
      EditUtil.beginEditCell();
      setTimeout(() => {
        const $textbox = wrapStore.wrap.getPlugin(PluginType.TextBox).$textbox;
        $textbox.innerText = event.key;
        wrapStore.wrap.getPlugin(PluginType.TextBox).moveToEnd();
      }, 0);
    }
    if (event.code === 'F2') {
      EditUtil.beginEditCell();
    }
  }
}
