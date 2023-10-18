import BasePlugin from '../base-plugin.ts';
import {PluginType} from '../plugin-type.enum.ts';


export default class ClickPlugin extends BasePlugin {

  type = PluginType.EventClick;

  handleClick = (_e: MouseEvent) => {
    // console.log(e)
  }

  init(): void {
    this.$target.addEventListener('click', this.handleClick)
  }

}
