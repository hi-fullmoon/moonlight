/**
 * 删除类
 */

import { Feature, Map, Overlay } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import PlotBase from './elements/PlotBase';
import EventBus from './EventBus';

interface RemoveOptions {
  map: Map;
  layer: VectorLayer<any>;
  elements: PlotBase[];
}

class Remove {
  map: Map | null;

  layer: VectorLayer<Feature>;

  elements: PlotBase[];

  overlays: Overlay[];

  constructor({ map, layer, elements }: RemoveOptions) {
    this.map = map;
    this.layer = layer;
    this.elements = elements;
    this.overlays = [];

    this.genRemoveIcons();
  }

  /**
   * 生成删除图标
   */
  genRemoveIcons() {
    this.elements.forEach((element, index) => {
      const { type, centerPoint } = element;

      if (!centerPoint || centerPoint.length === 0) return;

      const dom = document.createElement('div');
      dom.classList.add('m-ol-plot-delete-icon');
      dom.style.width = 15 + 'px';
      dom.style.height = 15 + 'px';
      dom.style.backgroundColor = 'red';
      dom.style.textAlign = 'center';
      dom.style.cursor = 'pointer';
      dom.style.color = '#ffffff';
      dom.style.lineHeight = 14 + 'px';
      dom.style.borderRadius = '50%';
      dom.dataset.index = index + '';
      dom.innerHTML = '-';

      const overlay = new Overlay({
        element: dom,
        offset: type === 'POINT' || type === 'TEXT' ? [0, 25] : [0, 16],
        positioning: 'center-center',
        position: this.getIconPosition(element),
      });

      dom.addEventListener('click', this.handleRemove);

      this.overlays.push(overlay);
      this.map!.addOverlay(overlay);
    });
  }

  /**
   * 计算 icon 位置
   */
  getIconPosition(element: PlotBase) {
    const { type, centerPoint, feature } = element;

    switch (type) {
      case 'POINT':
      case 'TEXT':
        return centerPoint;
      case 'LINE':
      case 'MEASURE_DISTANCE': {
        const anchorPoints = element.anchorPoints;
        const coordinate1 = anchorPoints[0].coordinate;
        const coordinate2 = anchorPoints[anchorPoints.length - 1].coordinate;
        if (coordinate1[1] > coordinate2[1]) {
          return coordinate2;
        }
        return coordinate1;
      }
      case 'POLYGON':
      case 'MEASURE_AREA': {
        const yList = element.anchorPoints.map((anchor) => anchor.coordinate[1]);
        const yMin = Math.min(...yList);
        return [centerPoint[0], yMin];
      }
      case 'CIRCLE': {
        const radius = feature.get('radius') || 0;
        return [centerPoint[0], centerPoint[1] - radius];
      }
      case 'ELLIPSE': {
        const minorRadius = feature.get('minorRadius') || 0;
        return [centerPoint[0], centerPoint[1] - minorRadius];
      }
      case 'RECTANGLE': {
        const coordinates: number[][] = feature.get('coordinates') || [];
        const yList = coordinates.map((coordinate) => coordinate[1]);
        const yMin = Math.min(...yList);
        return [centerPoint[0], yMin];
      }
      default:
        return centerPoint;
    }
  }

  /**
   * 移除元素
   */
  handleRemove = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = Number(target.dataset.index);
    const element = this.elements[index];

    this.elements.splice(index, 1);

    EventBus.emit('removed', index);

    // 从图层上删除
    this.layer.getSource()?.removeFeature(element.feature);

    this.resetRemoveIcons();

    // 元素清理工作
    element.destroy();

    // 移除删除按钮
    const overlay = this.overlays[index];
    this.map?.removeOverlay(overlay);
  };

  /**
   * 重置删除按钮
   */
  resetRemoveIcons() {
    this.overlays.forEach((overlay) => {
      const element = overlay.getElement() as HTMLDivElement;
      element.removeEventListener('click', this.handleRemove);

      this.map!.removeOverlay(overlay);
    });

    this.genRemoveIcons();
  }

  /**
   * 做一些清理操作
   */
  destroy() {
    this.overlays.forEach((overlay) => {
      this.map!.removeOverlay(overlay);
      const element = overlay.getElement() as HTMLDivElement;
      element.removeEventListener('click', this.handleRemove);
    });

    this.elements = [];
    this.map = null;
    this.overlays = [];
  }
}

export default Remove;
