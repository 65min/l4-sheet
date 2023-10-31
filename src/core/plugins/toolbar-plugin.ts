import {PluginType} from './plugin-type.enum.ts';
import BasePlugin from './base-plugin.ts';

(function () {
  if (window.customElements.get('l4-toolbar') === undefined) {

    const template = document.createElement('template');
    template.innerHTML = `
      <div>
<!--        L4-Sheet -->
      </div>
    `;

    class Toolbar extends HTMLElement {

      constructor() {
        super();
        const shadow = this.attachShadow( { mode: 'closed' } );
        const content = template.content.cloneNode(true);
        shadow.append(content);
      }

    }

    window.customElements.define('l4-toolbar', Toolbar);
  }

})();


export default class ToolbarPlugin extends BasePlugin {

  type = PluginType.ToolBar;

  constructor(selector: string) {
    super(selector);
  }

  init(): void {
    const div = document.createElement('l4-toolbar');
    this.$target!.append(div)
  }


}
