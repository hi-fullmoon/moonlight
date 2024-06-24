/**
 * 标绘元素的抽象类
 */

import { Feature } from 'ol';
import { PlotType } from '../typings';

export interface AnchorPointOption {
  /**
   * 目前有两种种类型，
   * 锚点，用于改变标绘形态
   * 幽灵锚点，用于进化为锚点
   */
  type: 'anchor' | 'ghost';

  /**
   * 控制点坐标位置
   */
  coordinate: number[];

  [P: string]: any;
}

export interface PlotBaseOptions {
  type: PlotType;
  feature: Feature;
}

abstract class PlotBase {
  /**
   * 类型
   */
  type: PlotType;

  /**
   * 具体feature
   */
  feature: Feature;

  /**
   * 具体的 geom
   */
  geometry: any;

  /**
   * 是否处于激活状态
   */
  active: boolean;

  /**
   * 元素坐标集合，形成一个元素的几何特征，是一个二维数组
   */
  coordinates: number[][];

  /**
   * 锚点
   */
  anchorPoints: AnchorPointOption[];

  /**
   * 中心点
   */
  centerPoint: number[];

  constructor(options: PlotBaseOptions) {
    const { type, feature } = options;

    this.type = type;
    this.feature = feature;
    this.geometry = feature.getGeometry();
    this.active = false;
    this.coordinates = [];
    this.anchorPoints = [];
    this.centerPoint = [];
  }

  /**
   * 初始化控制点
   */
  initControlPoints() {}

  /**
   * 激活态
   */
  abstract activate(): void;

  /**
   * 取消激活态
   */
  abstract deactivate(): void;

  /**
   * 更新几何点位
   *
   * coordinate 可能是一个二维数组，也可能是一个三维数据
   */
  setCoordinates(coordinates: any[]) {
    // @ts-ignore
    this.feature.getGeometry().setCoordinates(coordinates);
  }

  /**
   * 更新锚点
   */
  abstract setAnchorPoints(points: AnchorPointOption[], updateGhost?: boolean): void;

  /**
   * 更新中心点
   */
  abstract setCenterPoint(center: number[], anchors?: AnchorPointOption[]): void;

  /**
   * 获取 feature 本体
   */
  getFeature() {
    return this.feature;
  }

  /**
   * 获取具体的 geom
   */
  getGeometry() {
    return this.feature.getGeometry();
  }

  /**
   * 是否处于激活状态
   */
  isActive() {
    return this.active;
  }

  /**
   * 清理操作
   */
  destroy() {
    this.active = false;
    this.coordinates = [];
    this.anchorPoints = [];
    this.centerPoint = [];
  }
}

export default PlotBase;
