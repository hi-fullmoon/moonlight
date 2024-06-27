import { Map, Overlay } from 'ol';
import PlotPoint, { PlotPointOptions } from './Point';
import { Icon, Style } from 'ol/style';
import EventBus from '../EventBus';

interface PlotTextOptions extends PlotPointOptions {
  map: Map;
}

class PlotText extends PlotPoint {
  map: Map | null;

  overlay: Overlay | null;

  textarea: HTMLElement | null;

  constructor({ map, ...restOptions }: PlotTextOptions) {
    super(restOptions);

    // 设置图标
    const style = new Style();
    style.setImage(new Icon({ src: '' }));
    this.feature.setStyle(style);

    this.map = map;
    this.overlay = null;
    this.textarea = null;

    this.createOverlay();
  }

  /**
   * 创建一个 texarea
   */
  createTextarea() {
    const textarea = document.createElement('div');
    textarea.classList.add('textarea');
    const text = this.feature.get('text');
    if (text) textarea.innerHTML = text.replace(/\n/g, '<br />');
    textarea.autofocus = true;
    textarea.addEventListener('blur', this.handleTextareaChange);
    return textarea;
  }

  /**
   * 创建一个 overlay
   */
  createOverlay() {
    const element = document.createElement('div');
    element.classList.add('ml-plot-text-popup');

    this.textarea = this.createTextarea();
    element.appendChild(this.textarea);

    this.overlay = new Overlay({
      element,
      offset: [12, 0],
      positioning: 'center-left',
      position: this.centerPoint,
    });

    this.map?.addOverlay(this.overlay);
  }

  handleTextareaChange = (e: FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const value = (e.target as HTMLDivElement).innerText;
    this.feature.set('text', value);

    EventBus.trigger('modified', this);
  };

  activate() {
    super.activate();

    if (!this.textarea) {
      return;
    }

    this.overlay?.setPosition(this.centerPoint);

    this.textarea.contentEditable = 'true';
    this.textarea.classList.add('active');
    this.textarea.focus();
  }

  deactivate() {
    super.deactivate();

    if (!this.textarea) {
      return;
    }

    this.textarea.contentEditable = 'false';
    this.textarea.classList.remove('active');
  }

  setCenterPoint(center: number[]) {
    super.setCenterPoint(center);
    this.overlay?.setPosition(this.centerPoint);
  }

  destroy() {
    super.destroy();

    if (this.map && this.overlay) this.map.removeOverlay(this.overlay);
    this.map = null;
    this.overlay = null;
    this.textarea?.removeEventListener('blur', this.handleTextareaChange);
    this.textarea = null;
  }
}

export default PlotText;
