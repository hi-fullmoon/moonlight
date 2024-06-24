import { Point, Polygon } from 'ol/geom';
import { Style, Stroke, Fill } from 'ol/style';
import PlotBase, { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { calcDistance, genEllipse } from './utils';

interface PlotEllipseOptions extends PlotBaseOptions {}

class PlotEllipse extends PlotBase {
  constructor(options: PlotEllipseOptions) {
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

    if (geom instanceof Point) {
      const center = this.feature.get('center') || [0, 0];
      const majorRadius = this.feature.get('majorRadius') || 0;
      const minorRadius = this.feature.get('minorRadius') || 1;
      const polygon = genEllipse(center, majorRadius, minorRadius);
      this.feature.setGeometry(polygon);
    }
  }

  initControlPoints() {
    // 中心点
    const center = this.feature.get('center') || [0, 0];
    this.centerPoint = center;

    // 锚点
    const majorRadius = this.feature.get('majorRadius') || 0;
    const minorRadius = this.feature.get('minorRadius') || 1;

    // 横轴上的点
    const anchor1: number[] = [center[0] + majorRadius, center[1]];
    // 纵轴上的点
    const anchor2: number[] = [center[0], center[1] + minorRadius];

    this.anchorPoints = [
      {
        type: 'anchor',
        coordinate: anchor1,
        attr: 'major',
      },
      {
        type: 'anchor',
        coordinate: anchor2,
        attr: 'minor',
      },
    ];
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  setCoordinates() {}

  setCenterPoint(center: number[], anchors?: AnchorPointOption[]) {
    const prevCenter = this.centerPoint;

    // 中心点
    this.centerPoint = center;
    this.feature.set('center', center);

    // 锚点
    this.anchorPoints = anchors || [];

    if (this.anchorPoints.length === 0) return;

    // 更新几何点
    const dx = center[0] - prevCenter[0];
    const dy = center[1] - prevCenter[1];
    const geom = this.feature.getGeometry() as Polygon;
    const coordinates = geom.getCoordinates()[0].map((coordinate) => [coordinate[0] + dx, coordinate[1] + dy]);

    geom.setCoordinates([coordinates]);
  }

  /**
   * 目前major anchor 和 minor anchor 顺序是不变的，放心直接按索引获取
   */
  setAnchorPoints(points: AnchorPointOption[]) {
    const [majorPoint, minorPoint] = points;

    const majorCoord = majorPoint.coordinate;
    const minorCoord = minorPoint.coordinate;

    const center = this.centerPoint;

    const coordinate1 = [majorCoord[0], center[1]];
    const coordinate2 = [center[0], minorCoord[1]];

    // 这里需要重写 anchor 坐标
    majorPoint.coordinate = coordinate1;
    minorPoint.coordinate = coordinate2;

    // 重新计算 majorRadius 和 minorRadius
    const majorRadius = calcDistance(center, coordinate1);
    const minorRadius = calcDistance(center, coordinate2);

    this.feature.set('majorRadius', majorRadius);
    this.feature.set('minorRadius', minorRadius);

    this.anchorPoints = points;

    const polygon = genEllipse(center, majorRadius, minorRadius);
    this.feature.setGeometry(polygon);
  }
}

export default PlotEllipse;
