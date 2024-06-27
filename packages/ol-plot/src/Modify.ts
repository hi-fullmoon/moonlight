/**
 * 修改类，修改单个 feature
 */

import { Feature, Map, MapBrowserEvent, Overlay } from 'ol';
import { ANCHOR_POINT_ID_PREFIX, CENTER_POINT_ID } from './constants';
import PlotBase, { AnchorPointOption } from './elements/PlotBase';
import EventBus from './EventBus';

interface PointRecord {
  id: string;
  type: 'anchor' | 'ghost' | 'center';
  element?: HTMLElement;
}

interface DrawOptions {
  map: Map;
  feature?: Feature;
}

class Modify {
  /**
   * ol map
   */
  map: Map;

  /**
   * 当前操作的 element
   */
  element: PlotBase | null;

  /**
   * 控制点
   */
  overlays: Overlay[];

  /**
   * 当前点击的点信息
   */
  pointRecord: PointRecord | null;

  /**
   * 锚点 id 和 index 的关系
   */
  anchorPointIdIndexMap: { [id: string]: number };

  /**
   * 中心点最开始的位置，目的是为了计算其他锚点的偏移量
   */
  startCoordinate: number[];

  constructor(options: DrawOptions) {
    const { map } = options;

    this.map = map;
    this.element = null;
    this.overlays = [];
    this.pointRecord = null;
    this.anchorPointIdIndexMap = {};
    this.startCoordinate = [];
  }

  /**
   * 当前正在编辑的 feature
   */
  setElement(element: PlotBase | null) {
    this.element = element;

    if (element) {
      this.addControlPoints();
      this.map.on('pointermove', this.handleMapPointerMove);
    } else {
      this.removeControlPoints();
      this.map.un('pointermove', this.handleMapPointerMove);
    }
  }

  /**
   * 添加控制点，包括控制点和中心点
   */
  addControlPoints() {
    if (!this.element) return;

    // 锚点
    const anchorPoints = this.element.anchorPoints;

    for (let i = 0; i < anchorPoints.length; i++) {
      const point = anchorPoints[i];
      const id = `${ANCHOR_POINT_ID_PREFIX}${i}`;
      const cls = point.type === 'anchor' ? 'ml-plot-anchor-point' : 'ml-plot-ghost-anchor-point';

      const element = this.createElement(id, cls, point.type, i);

      const overlay = new Overlay({
        id,
        element: element,
        positioning: 'center-center',
        position: point.coordinate,
      });

      this.overlays.push(overlay);
      this.map.addOverlay(overlay);

      this.anchorPointIdIndexMap[id] = i;

      element.addEventListener('mousedown', this.handleAnchorPointMouseDown);
    }

    // 中心点
    const centerPoint = this.element.centerPoint;
    const element = this.createElement(CENTER_POINT_ID, 'ml-plot-center-point', 'center', 0);

    const overlay = new Overlay({
      id: CENTER_POINT_ID,
      element: element,
      positioning: 'center-center',
      position: centerPoint,
    });

    this.overlays.push(overlay);
    this.map.addOverlay(overlay);

    element.addEventListener('mousedown', this.handleCenterPointMouseDown);
  }

  /**
   * 创建一个 overlay element
   */
  createElement(id: string, className: string, type: string, index: number) {
    const element = document.createElement('div');
    element.dataset.id = id;
    element.dataset.type = type;
    element.dataset.index = index.toString();
    element.classList.add(className);
    return element;
  }

  /**
   * 移除控制点
   */
  removeControlPoints() {
    for (let i = 0; i < this.overlays.length; i++) {
      const overlay = this.overlays[i];

      const element = overlay.getElement() as HTMLDivElement;

      element.removeEventListener('mousedown', this.handleAnchorPointMouseDown);

      this.map.removeOverlay(this.overlays[i]);
    }

    this.overlays = [];
  }

  /**
   * 锚点 mouse down 事件
   */
  handleAnchorPointMouseDown = (e: MouseEvent) => {
    if (!this.element) return;

    const target = e.target as HTMLDivElement;

    const id = target.dataset.id as string;
    let type = target.dataset.type as 'anchor' | 'ghost';
    const index = Number(target.dataset.index);

    if (type === 'anchor') {
      const overlay = this.map.getOverlayById(id);
      this.startCoordinate = overlay.getPosition() as number[];
    }

    // 将点击的 ghost 类型的锚点，直接修改为 anchor
    if (type === 'ghost') {
      this.element.anchorPoints = this.element.anchorPoints.map((anchor, idx) => {
        if (index === idx) return { ...anchor, type: 'anchor' };
        return anchor;
      });
    }

    this.pointRecord = { id, type, element: target };

    this.map.getViewport().addEventListener('mouseup', this.handleViewportMouseUp);
  };

  /**
   * 地图view report mouse up 事件，主要清除一些东西
   */
  handleViewportMouseUp = () => {
    if (this.pointRecord) {
      if (this.pointRecord.type === 'ghost') {
        this.element?.setAnchorPoints(this.element.anchorPoints);
        this.removeControlPoints();
        this.addControlPoints();
      }
    }

    this.pointRecord = null;

    EventBus.trigger('modified', this.element);

    this.map.getViewport().removeEventListener('mouseup', this.handleViewportMouseUp);
  };

  /**
   * 中心点 mouse down 事件
   */
  handleCenterPointMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const id = target.dataset.id as string;

    const overlay = this.map.getOverlayById(id);
    this.startCoordinate = overlay.getPosition() as number[];
    this.pointRecord = { id, type: 'center' };

    target.addEventListener('mouseup', this.handleCenterPointMouseUp);
  };

  /**
   * 中心点 mouse up 事件，主要清除一些东西
   */
  handleCenterPointMouseUp = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    this.pointRecord = null;

    target.removeEventListener('mouseup', this.handleCenterPointMouseUp);

    EventBus.trigger('modified', this.element);
  };

  /**
   * 地图 pointer move 事件
   *
   * 这里有三种 case
   * 1 模拟锚点拖动
   * 2 模拟幽冥锚点拖动
   * 3 模拟中心点拖动
   */
  handleMapPointerMove = (e: MapBrowserEvent<any>) => {
    if (!this.element || !this.pointRecord) return;

    const coordinate = e.coordinate;
    const { id: pointId, type } = this.pointRecord;
    const anchorPoints = this.element.anchorPoints;
    const centerPoint = this.element.centerPoint;

    const newAnchorPoints: AnchorPointOption[] = [];

    // 移动中心点，平移整个 feature
    if (type === 'center') {
      if (this.startCoordinate.length === 0) return;

      const dx = coordinate[0] - centerPoint[0];
      const dy = coordinate[1] - centerPoint[1];

      for (let i = 0, len = anchorPoints.length; i < len; i++) {
        const point = anchorPoints[i];
        const coord = point.coordinate;
        const newCoord = [coord[0] + dx, coord[1] + dy];
        newAnchorPoints.push({ ...point, coordinate: newCoord });
      }

      this.element.setCenterPoint(coordinate, newAnchorPoints);

      this.translateAnchors(newAnchorPoints);
      this.translateCenter(coordinate);

      return;
    }

    // 移动锚点
    // 这里会影响到中心点
    if (type === 'anchor' || type === 'ghost') {
      const index = this.anchorPointIdIndexMap[pointId];

      for (let i = 0, len = anchorPoints.length; i < len; i++) {
        const point = anchorPoints[i];

        if (index === i) {
          newAnchorPoints.push({ ...point, coordinate: coordinate });
        } else {
          newAnchorPoints.push({ ...point });
        }
      }

      this.element.setAnchorPoints(newAnchorPoints, type === 'anchor');

      // 必须在 setAnchorPoints 后调用
      this.translateAnchors(this.element.anchorPoints);
      this.translateCenter(this.element.centerPoint);

      return;
    }
  };

  /**
   * 平移锚点
   */
  translateAnchors(anchorPoints: AnchorPointOption[]) {
    for (let i = 0, len = anchorPoints.length; i < len; i++) {
      const point = anchorPoints[i];
      const anchorOverlay = this.map.getOverlayById(`${ANCHOR_POINT_ID_PREFIX}${i}`);
      anchorOverlay.setPosition(point.coordinate);
    }
  }

  /**
   * 平移中心点
   */
  translateCenter(center: number[]) {
    const centerOverlay = this.map.getOverlayById(CENTER_POINT_ID);
    centerOverlay.setPosition(center);
  }
}

export default Modify;
