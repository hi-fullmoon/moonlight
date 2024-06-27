/**
 * 点
 */

import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import PlotBase, { PlotBaseOptions } from './PlotBase';

export interface PlotPointOptions extends PlotBaseOptions {
  iconMap?: { [key: string]: any };
}

class PlotPoint extends PlotBase {
  constructor({ iconMap, ...restOptions }: PlotPointOptions) {
    super(restOptions);

    this.initFeatureStyle(iconMap);
    this.initControlPoints();
  }

  /**
   * 初始化 feature 样式
   */
  initFeatureStyle(iconMap: { [key: string]: any } = {}) {
    const style = new Style();
    const icon = this.feature.get('icon') as string;

    if (iconMap[icon]) {
      style.setImage(
        new Icon({
          src: iconMap[icon],
        }),
      );
    }

    this.feature.setStyle(style);
  }

  /**
   * 初始化控制点
   */
  initControlPoints() {
    this.centerPoint = (this.feature.getGeometry() as Point).getCoordinates();
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  /**
   * 重写父类方法
   */
  setCoordinates() {}

  setAnchorPoints() {}

  setCenterPoint(center: number[]) {
    this.centerPoint = center;
    (this.feature.getGeometry() as Point).setCoordinates(center);
  }
}

export default PlotPoint;
