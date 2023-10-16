import BasePlugin from './base-plugin.ts';
import {PluginType} from './plugin-type.enum.ts';
import store from '../store';


export default class EventDragPlugin extends BasePlugin {

  type = PluginType.EventDrag;

  handleDrag = (event: DragEvent) => {
    // console.log(event.target === store.$canvas);
    if (event.target === store.$canvas) {
      event.preventDefault();
    }
  }

  handleDragStart = (event: DragEvent) => {
    // console.log(event.target === store.$canvas);
    if (event.target === store.$canvas) {
      // event.preventDefault();
      event.dataTransfer.setDragImage(new Image(0, 0), 0, 0)
    }
  }

  init(): void {
    document.addEventListener('drag', this.handleDrag)
    document.addEventListener('dragstart', this.handleDragStart)
  }

}
