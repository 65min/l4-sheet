import {PluginType} from './plugin-type.enum.ts';


export default abstract class BasePlugin {

  type: PluginType | null;

  private selector: string;

  $target: HTMLElement | null;

  public abstract init(): void;
  public destroy(): void {
    console.info(`插件 ${this.type} 已删除`);
  };

  constructor(selector: string | HTMLElement = null) {
    this.type = null;
    if (typeof selector === 'string') {
      this.selector = selector;
      this.$target = null;
      if (selector) {
        const targetNodes = document.querySelectorAll(selector);
        if (targetNodes.length === 0) {
          throw new Error(`Selector: ${selector} 无对应对象`);
        }
        if (targetNodes.length > 1) {
          throw new Error(`Selector: ${selector} 存在多个对象`);
        }

        this.$target = document.querySelector<Element>(this.selector)! as HTMLElement;
      }
    } else {
      this.$target = selector;
    }
  }
}
