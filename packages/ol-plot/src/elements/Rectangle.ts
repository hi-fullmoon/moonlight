import { getCenter } from 'ol/extent';
import { Polygon } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import PlotBase, { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { getRectangleCoordinates } from './utils';

interface PlotRectangleOptions extends PlotBaseOptions {}

class PlotRectRangle extends PlotBase {
  constructor(options: PlotRectangleOptions) {
    super(options);

    this.initFeatureStyle();
    this.initFeatureGeom();
    this.initControlPoints();
  }

  initFeatureStyle() {
    const style = new Style({
      stroke: new Stroke({
        width: 2,
        color: 'blue',
      }),
    });
    this.feature.setStyle(style);
  }

  initFeatureGeom() {
    const coordinates = this.feature.get('coordinates');
    if (!coordinates) return;
    const newCoordinates = getRectangleCoordinates(coordinates);
    const geom = this.feature.getGeometry() as Polygon;
    geom.setCoordinates([newCoordinates]);
  }

  initControlPoints() {
    const coordinates: number[][] = this.feature.get('coordinates') || [];
    const geom = this.feature.getGeometry() as Polygon;

    this.anchorPoints = coordinates.map((coordinate) => {
      return { type: 'anchor', coordinate };
    });

    this.centerPoint = getCenter(geom.getExtent());
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

    this.centerPoint = center;
    this.anchorPoints = anchors || [];

    const dx = center[0] - prevCenter[0];
    const dy = center[1] - prevCenter[1];
    const geom = this.feature.getGeometry() as Polygon;
    const coordinates = geom.getCoordinates()[0].map((coordinate) => [coordinate[0] + dx, coordinate[1] + dy]);
    geom.setCoordinates([coordinates]);

    const anchorCoodinates = this.anchorPoints.map((p) => p.coordinate);
    this.feature.set('coordinates', anchorCoodinates);
  }

  setAnchorPoints(points: AnchorPointOption[]) {
    this.anchorPoints = points;

    // 通过左上点、右下点得到矩形四个点的坐标
    const anchorCoordinates = points.map((p) => p.coordinate);

    // 当只有一个点的时候，就生成第二个点和第一个点相同
    if (!anchorCoordinates[1]) {
      anchorCoordinates[1] = anchorCoordinates[0];
    }

    const coordinates = getRectangleCoordinates(anchorCoordinates);

    const geom = this.feature.getGeometry() as Polygon;
    geom.setCoordinates([coordinates]);

    this.feature.set('coordinates', anchorCoordinates);

    // 重新计算中心点
    const extend = geom.getExtent();
    this.centerPoint = getCenter(extend);
  }
}

export default PlotRectRangle;
