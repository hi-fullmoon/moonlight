import { Circle, Point } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import PlotBase, { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { calcDistance } from './utils';

interface PlotCircleOptions extends PlotBaseOptions {}

class PlotCircle extends PlotBase {
  constructor(options: PlotCircleOptions) {
    super(options);

    this.initFeatureStyle();
    this.initFeatureGeom();
    this.initControlPoints();
  }

  initFeatureStyle() {
    const style = new Style({
      stroke: new Stroke({
        width: 3,
        color: 'blue',
      }),
    });
    this.feature.setStyle(style);
  }

  initFeatureGeom() {
    const geom = this.feature.getGeometry();
    const radius = (this.feature.get('radius') as number) || 0;

    let coordinate: number[] = [];

    if (geom instanceof Point) {
      coordinate = geom.getCoordinates();
      if (coordinate.length === 0) coordinate = [0, 0];
      this.feature.setGeometry(new Circle(coordinate, radius));
      return;
    }

    if (geom instanceof Circle) {
      coordinate = geom.getCenter();
      geom.setCenter(coordinate);
    }
  }

  // 必须在 initFeatureGeom 方法后调用
  initControlPoints() {
    const geom = this.feature.getGeometry() as Circle;
    const center = geom.getCenter();

    if (!center || center.length === 0) return;

    const radius = (this.feature.get('radius') as number) || 0;

    // 锚点
    const coordinate = [center[0] + radius, center[1]];
    const anchor: AnchorPointOption = { type: 'anchor', coordinate };
    this.anchorPoints = [anchor];

    // 中心点
    this.centerPoint = center;
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

  setAnchorPoints(points: AnchorPointOption[]) {
    this.anchorPoints = points;

    // 更新半径配置
    const coordinate = points[0].coordinate;
    const center = this.centerPoint;
    const radius = calcDistance(center, coordinate);

    this.feature.set('radius', radius);

    const geom = this.feature.getGeometry() as Circle;
    geom.setRadius(radius);
  }

  setCenterPoint(center: number[], anchors: AnchorPointOption[]) {
    this.centerPoint = center;
    this.anchorPoints = anchors;

    const geom = this.feature.getGeometry() as Circle;
    geom.setCenter(center);
  }
}

export default PlotCircle;
