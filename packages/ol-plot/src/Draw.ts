/**
 * 绘制类
 */

import { Map, MapBrowserEvent } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import PlotBase, { AnchorPointOption } from './elements/PlotBase';
import EventBus from './EventBus';
import { PlotType } from './typings';

export interface DrawOptions {
  map: Map;
  layer: VectorLayer<any>;
}

class Draw {
  /**
   * ol map
   */
  map: Map | null;

  /**
   * ol layer
   */
  layer: VectorLayer<any> | null;

  /**
   * 当前绘制的元素
   */
  element: PlotBase | null;

  /**
   * 一个标记，表示正在绘制中
   */
  drawing: boolean;

  /**
   * 当前绘制的坐标记录
   */
  coordinates: number[][];

  constructor({ map, layer }: DrawOptions) {
    this.map = map;
    this.layer = layer;
    this.element = null;
    this.drawing = false;
    this.coordinates = [];

    // this.bindEvents();
  }

  /**
   * 绘制开始
   */
  open(element: PlotBase) {
    this.drawing = true;
    this.element = element;

    this.bindEvents();
  }

  /**
   * 绘制结束
   */
  close(signal: boolean = true) {
    if (signal) EventBus.trigger('drawend', this.element);

    this.unBindEvents();

    this.drawing = false;
    this.element = null;
    this.coordinates = [];
  }

  /**
   * 绑定一些事件，为绘制做准备
   */
  bindEvents() {
    // FIXME:
    // 这里使用 click 和 dbclick 配置完成绘制工作，dbclick 会导致执行两次 click 事件
    // 有没有更高的解决方案？？？
    this.map?.on('click', this.handleMapClick);
    this.map?.on('dblclick', this.handleMapDblClick);
    this.map?.on('pointermove', this.handleMapPointerMove);
    this.map?.getViewport().addEventListener('contextmenu', this.handleMapContextMenu);
  }

  /**
   * 卸载事件
   */
  unBindEvents() {
    this.map?.un('click', this.handleMapClick);
    this.map?.un('pointermove', this.handleMapPointerMove);
    this.map?.getViewport().removeEventListener('contextmenu', this.handleMapContextMenu);
  }

  /**
   * 地图单击事件
   */
  handleMapClick = (e: MapBrowserEvent<UIEvent>) => {
    if (!this.drawing) return;
    if (!this.element) return;

    const coordinate = e.coordinate;
    const type = this.element.type;

    // 保证只添加一次 feature
    const features = this.layer?.getSource()?.getFeatures() || [];
    if (features.every((f) => f !== this.element?.feature)) {
      this.layer?.getSource()?.addFeature(this.element.feature);
    }

    this.coordinates.push(coordinate);

    // 点一次点击就完成了绘制
    if (type === 'POINT' || type === 'TEXT') {
      this.element.setCenterPoint(coordinate);

      // 改变事件循环顺序
      // 这样在结束后就不会选中
      setTimeout(() => this.close());
      return;
    }

    // 线
    if (type === 'LINE' || type === 'POLYGON' || type === 'MEASURE_AREA' || type === 'MEASURE_DISTANCE') {
      const anchors: AnchorPointOption[] = [...this.coordinates, coordinate].map((coord) => {
        return { type: 'anchor', coordinate: coord };
      });
      this.element.setAnchorPoints(anchors);
      return;
    }

    // 圆两次点击完成绘制
    if (type === 'CIRCLE') {
      if (this.coordinates.length === 1) {
        this.element.setCenterPoint(coordinate);
      } else {
        this.updatePoints(type, this.coordinates);

        setTimeout(() => this.close());
      }
      return;
    }

    if (type === 'ARROW') {
      if (this.coordinates.length === 1) {
        const anchors: AnchorPointOption[] = [...this.coordinates].map((coord) => {
          return { type: 'anchor', coordinate: coord };
        });
        this.element.setAnchorPoints(anchors);
      } else {
        this.updatePoints(type, this.coordinates);

        setTimeout(() => this.close());
      }
      return;
    }

    // 椭圆两次点击完成绘制
    if (type === 'ELLIPSE') {
      if (this.coordinates.length === 1) {
        this.element.setCenterPoint(coordinate);
      } else {
        this.close();
      }
      return;
    }

    // 矩形点击两次完成绘制
    if (type === 'RECTANGLE') {
      if (this.coordinates.length === 1) {
        this.updatePoints(type, this.coordinates);
      } else {
        setTimeout(() => this.close());
      }
      return;
    }
  };

  /**
   * 地图指针移动事件
   */
  handleMapPointerMove = (e: MapBrowserEvent<UIEvent>) => {
    if (!this.drawing) return;
    if (!this.element) return;
    if (this.coordinates.length === 0) return;

    const type = this.element.type;
    const coordinates = [...this.coordinates, e.coordinate];

    this.updatePoints(type, coordinates);
  };

  /**
   * 更新控制点
   */
  updatePoints(type: PlotType, coordinates: number[][]) {
    let anchors: AnchorPointOption[] = [];

    switch (type) {
      case 'LINE':
      case 'POLYGON':
      case 'MEASURE_AREA':
      case 'ARROW':
      case 'MEASURE_DISTANCE':
        anchors = coordinates.map((coord) => {
          return { type: 'anchor', coordinate: coord };
        });
        break;
      case 'RECTANGLE':
        anchors = coordinates.map((coordinate) => {
          return { type: 'anchor', coordinate };
        });
        break;
      case 'ELLIPSE':
        const [center, coordinate] = coordinates;
        const majorCoordinate = [coordinate[0], center[1]];
        const minorCoordinate = [center[0], coordinate[1]];
        anchors = [
          { type: 'anchor', coordinate: majorCoordinate },
          { type: 'anchor', coordinate: minorCoordinate },
        ];
        break;
      case 'CIRCLE':
        anchors = [{ type: 'anchor', coordinate: coordinates[1] }];
        break;
    }

    this.element!.setAnchorPoints(anchors);
  }

  /**
   * 地图双击事件，
   * 因为会触发一次单击事件，所以最终 coordinates 需要去掉最后一个
   */
  handleMapDblClick = () => {
    if (!this.drawing) return;
    if (!this.element) return;

    const anchors: AnchorPointOption[] = this.coordinates.slice(0, -1).map((coord) => {
      return { type: 'anchor', coordinate: coord };
    });
    this.element!.setAnchorPoints(anchors);
    this.close();
  };

  /**
   * 地图右键事件，绘制结束
   */
  handleMapContextMenu = (e: Event) => {
    e.preventDefault();
    const anchors: AnchorPointOption[] = this.coordinates.map((coord) => {
      return { type: 'anchor', coordinate: coord };
    });
    this.element!.setAnchorPoints(anchors);
    this.close();
  };

  /**
   * 销毁，做一些清理操作
   */
  destroy() {
    this.drawing = false;
    this.element = null;
    this.map = null;
    this.layer = null;
  }
}

export default Draw;
