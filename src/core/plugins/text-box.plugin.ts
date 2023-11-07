import BasePlugin from './base-plugin.ts';
import {PluginType} from './plugin-type.enum.ts';
import cacheStore from '../store/cache.store.ts';
import state from '../store/state.ts';
import config from '../config';
import {Cell} from '../def/cell.ts';
import EditUtil from '../utils/edit.util.ts';

export default class TextBoxPlugin extends BasePlugin {

  type = PluginType.TextBox;

  fontColor: string;

  // bgColor: string;
  //
  // bold: boolean;
  //
  // italic: boolean;
  //
  // underline: boolean;
  //
  // hTextAlign: 'left' | 'center' | 'right';
  initText: string;
  cell: Cell;

  width: number;

  height: number;

  left: number;

  top: number;

  $textbox: HTMLDivElement;

  constructor(selector: string) {
    super(selector);
  }

  init(): void {
    const wrap = document.querySelector(`[${cacheStore.ra}-textbox]`);
    if (!wrap) {
      this.$textbox = document.createElement('div');
      this.$textbox.setAttribute(`${cacheStore.ra}-textbox`, '');
      this.$textbox.setAttribute('contenteditable', 'plaintext-only');

      this.$textbox.addEventListener('input', (_event) => {
        this.$textbox.style.height = 'auto';
        this.$textbox.style.height = this.$textbox.scrollHeight - 2 + 'px';
      });
      this.$textbox.addEventListener('keydown', (event) => {
        // console.log(event.altKey, event.shiftKey, event.ctrlKey);
        console.log(event);
        if (event.code === 'Escape') {
          EditUtil.cancelEdit();
          return;
        }
        if (event.code === 'Enter' && !event.altKey) {
          // this.$textbox.removeEventListener('blur', this.endEdit);
          EditUtil.endEdit();
          // this.$textbox.addEventListener('blur', this.endEdit);
          return;
        }
      });
      this.$textbox.addEventListener('blur', EditUtil.endEdit);
    }

    this.$textbox.innerText = this.cell?.t || '';
    this.setStyle();
    this.$target!.append(this.$textbox);
  }

  private setStyle() {

    this.$textbox.style.position = 'absolute';
    this.$textbox.style.left = `${this.left + 1}px`;
    this.$textbox.style.top = `${this.top + 1}px`;

    // this.$textbox.style.height = '100%';
    this.$textbox.style.padding = '0';
    this.$textbox.style.borderStyle = 'solid 0px';
    this.$textbox.style.border = '0';
    this.$textbox.style.outline = 'none';
    this.$textbox.style.resize = 'none';
    this.$textbox.style.overflow = 'hidden';
    this.$textbox.style.fontSize = '12px';

    this.$textbox.style.maxWidth = state.viewWidth - this.left + config.rowHeaderWidth - 1 + 'px';

    this.$textbox.style.backgroundColor = '#ffffff';
    if (this.fontColor) {
      this.$textbox.style.color = this.fontColor;
    }
    if (this.cell?.bc) {
      this.$textbox.style.backgroundColor = this.cell?.bc;
    }
    if (this.cell?.b) {
      this.$textbox.style.fontWeight = 'bold';
    }
    if (this.cell?.i) {
      this.$textbox.style.fontStyle = 'italic';
    }
    if (this.cell?.u) {
      this.$textbox.style.textDecoration = 'underline';
    }
    if (this.cell?.hta) {
      this.$textbox.style.textAlign = this.cell?.hta;
    }
    if (this.width != undefined) {
      this.$textbox.style.minWidth = `${this.width - 1}px`;
    }
    if (this.height != undefined) {
      this.$textbox.style.minHeight = `${this.height - 1}px`;
    }
  }

  public hide() {
    this.$textbox.style.display = 'none';
  }

  public show() {
    this.$textbox.style.display = 'block';
    setTimeout(() => {
      let range = window.getSelection();//创建range
      range.selectAllChildren(this.$textbox);//range 选择obj下所有子内容
      range.collapseToEnd();//光标移至最后
    }, 20);
  }

  public moveToEnd() {
    let range = window.getSelection();//创建range
    range.selectAllChildren(this.$textbox);//range 选择obj下所有子内容
    range.collapseToEnd();//光标移至最后
  }


}
