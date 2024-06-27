/**
 * 标绘图层
 */

import { Feature, Map, MapBrowserEvent } from 'ol';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import createElement from './createElement';
import PlotBase from './elements/PlotBase';
import Draw from './Draw';
import Modify from './Modify';
import Remove from './Remove';
import { PlotEvent, PlotType } from './typings';
import EventBus from './EventBus';
import { getGeomByPlotType, serialize } from './utils';

interface DrawingOptions {
  icon?: string;
}

export interface PlotConstructorOptions {
  /**
   * ol map
   */
  map: Map;

  /**
   * 模式，有两种模式，一种是编辑模式，一种是查看模式
   */
  mode?: 'edit' | 'view';
}

class Plot {
  /**
   * 图标映射表
   */
  static iconMap: { [key: string]: any } = {};

  /**
   * 注册图标
   */
  static registerIcon(icons: { [key: string]: any }) {
    Plot.iconMap = { ...Plot.iconMap, ...icons };
  }

  /**
   * 当前标绘类的模式
   */
  mode: 'edit' | 'view';

  /**
   * ol map 实例
   */
  map: Map | null;

  /**
   * 当前图层实例
   */
  layer: VectorLayer<Feature> | null;

  /**
   * 图层上的元素
   */
  elements: PlotBase[];

  /**
   * 标绘绘制类
   */
  draw: Draw | null;

  /**
   * 标绘修改类
   */
  modify: Modify | null;

  /**
   * 标绘删除类
   */
  remove: Remove | null;

  /**
   * 当前选中的 element
   */
  activeElement: PlotBase | null;

  constructor(options: PlotConstructorOptions) {
    const { map, mode = 'view' } = options;

    this.activeElement = null;
    this.map = map;
    this.mode = mode;
    this.elements = [];
    this.layer = new VectorLayer({
      zIndex: 999,
      source: new VectorSource({
        features: [],
      }),
    });

    this.draw = null;
    this.remove = null;

    if (this.mode === 'edit') {
      this.modify = new Modify({ map: this.map });
      this.bindMapEvents();
    } else {
      this.modify = null;
    }
  }

  /**
   * 开始绘图
   */
  startDrawing(plotType: PlotType, options: DrawingOptions = {}) {
    if (!this.draw) {
      this.draw = new Draw({ map: this.map!, layer: this.layer! });
    }

    const { icon } = options;

    // 准备好需要画的元素
    const feature = new Feature();
    feature.set('type', plotType);

    // 给 feature 做一些初始化操作
    if (plotType === 'POINT') {
      feature.set('icon', icon || 'qidian');
    }

    feature.setGeometry(getGeomByPlotType(plotType));

    const element = this.createElement(feature) as PlotBase;
    this.elements.push(element);
    this.draw.open(element);
  }

  /**
   * 停止绘图
   */
  stopDrawing() {
    this.draw?.close(false);
  }

  /**
   * 开始删除
   * 删除和修改互斥
   */
  startRemoving() {
    if (!this.map || !this.layer) return;

    this.deactivate();
    this.modify?.removeControlPoints();
    this.remove = new Remove({ map: this.map, layer: this.layer, elements: this.elements });
  }

  /**
   * 结束删除
   */
  stopRemoving() {
    this.remove?.destroy();
  }

  clearNoEvent() {
    this.remove?.destroy();
    this.elements.forEach((element) => {
      element.destroy();
    });
    this.elements = [];
    this.layer?.getSource()?.clear();
  }

  /**
   * 标绘图层初始化
   */
  initData(geoJsonObject?: any) {
    this.clearNoEvent();

    const features = geoJsonObject ? new GeoJSON().readFeatures(geoJsonObject) : [];

    // 将元素存起来，并且重写 feature
    this.elements = features.map((feature) => this.createElement(feature)).filter(Boolean) as PlotBase[];

    this.layer?.setSource(
      new VectorSource({
        features: this.elements.map((el) => el.getFeature()),
      }),
    );
  }

  /**
   * 添加新元素
   */
  addElement(type: PlotType, options: any) {
    const { icon, coordinates } = options || {};

    const geom = getGeomByPlotType(type);
    const feature = new Feature();

    feature.setGeometry(geom);
    feature.set('type', type);

    if (type === 'POINT') {
      feature.set('icon', icon);
      geom.setCoordinates(coordinates);
    }

    const element = this.createElement(feature) as PlotBase;
    this.elements.push(element);
    this.layer?.getSource()?.addFeature(element.getFeature());
  }

  /**
   * 清空图层数据
   */
  clear() {
    this.elements.forEach((element) => {
      element.destroy();
    });
    this.elements = [];
    this.layer?.getSource()?.clear();
    this.clearNoEvent();
    EventBus.trigger('clear');
  }

  /**
   * 获取标绘数据，需要做序列化处理
   */
  getData() {
    return serialize(this.elements);
  }

  /**
   * 创建元素
   */
  createElement(feature: Feature) {
    const type = feature.get('type') as PlotType;
    const opts = {
      feature,
      iconMap: Plot.iconMap,
      map: this.map as Map,
    };
    return createElement(type, opts);
  }

  /**
   * 监听事件，
   * selected, drawend, modified, removed
   */
  on(type: PlotEvent, callback: Function) {
    EventBus.on(type, callback);
  }

  /**
   * 卸载事件
   */
  un(type: PlotEvent, callback: Function) {
    EventBus.un(type, callback);
  }

  /**
   * 地图销毁的一些
   */
  destroy() {
    this.layer?.getSource()?.dispose();

    this.map = null;
    this.layer = null;
    this.activeElement = null;

    this.unbindMapEvents();

    this.elements.forEach((element) => {
      element.destroy();
    });
    this.elements = [];

    this.draw?.destroy();
    this.remove?.destroy();
  }

  /**
   * 拿到具体的图层实例
   */
  getLayer() {
    return this.layer;
  }

  /**
   * 给 map 绑定事件
   */
  bindMapEvents() {
    this.map?.on('click', this.handleMapClick);
    this.map?.on('pointermove', this.handleMapPointerMove);
  }

  /**
   * 给 map 解绑事件
   */
  unbindMapEvents() {
    this.map?.un('click', this.handleMapClick);
    this.map?.un('pointermove', this.handleMapPointerMove);
  }

  /**
   * 单击事件
   * 如果正处于绘制中，就取消当前正在激活的元素
   */
  handleMapClick = (e: MapBrowserEvent<any>) => {
    if (this.draw?.drawing) {
      this.deactivate();
      return;
    }

    const feature = this.map?.forEachFeatureAtPixel(e.pixel, (feature) => feature);
    console.log(feature, 'feature');
    if (feature) {
      this.activate(feature as Feature);
    } else {
      this.deactivate();
    }
  };

  /**
   * 指针移动事件，正在绘制的时候使用默认就行了
   */
  handleMapPointerMove = (e: MapBrowserEvent<any>) => {
    if (this.draw?.drawing) return;

    const feature = this.map?.forEachFeatureAtPixel(e.pixel, (feature) => feature);

    if (feature) {
      if (this.map) this.map.getViewport().style.cursor = 'pointer';
    } else {
      if (this.map) this.map.getViewport().style.cursor = 'auto';
    }
  };

  /**
   * 选中一个 feature
   */
  activate(feature: Feature) {
    if (this.mode === 'view') return;
    if (feature === this.activeElement?.getFeature()) return;

    const element = this.elements.find((el) => el.getFeature() === feature);

    console.log(element, 'element');

    if (element) {
      EventBus.trigger('selected', element);

      this.deactivate();
      this.activeElement = element;
      this.activeElement.activate();
      this.modify!.setElement(this.activeElement);
    }
  }

  /**
   * 取消选中 feature
   */
  deactivate() {
    if (this.mode === 'view') return;
    if (!this.activeElement) return;

    this.activeElement.deactivate();
    this.activeElement = null;

    this.modify!.setElement(null);
  }
}

export default Plot;
