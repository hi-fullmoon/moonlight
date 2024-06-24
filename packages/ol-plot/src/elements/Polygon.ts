import { getCenter } from 'ol/extent';
import { Polygon } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import PlotBase, { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { calcCenter, calcMidPoint } from './utils';

export interface PlotPolygonOptions extends PlotBaseOptions {}

class PlotPolygon extends PlotBase {
  constructor(options: PlotPolygonOptions) {
    super(options);

    this.initFeatureStyle();
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

  initControlPoints() {
    const geom = this.feature.getGeometry() as Polygon;

    const coordinates = geom.getCoordinates().flat(1);

    // 锚点
    this.anchorPoints = this.genAnchors(coordinates);

    // 中心点
    const extend = geom.getExtent();
    this.centerPoint = getCenter(extend);
  }

  /**
   * 生成锚点
   */
  genAnchors(coordinates: number[][]) {
    const anchors: AnchorPointOption[] = [];

    // 锚点
    for (let i = 0, len = coordinates.length; i < len; i++) {
      const coord1 = coordinates[i];

      anchors.push({ type: 'anchor', coordinate: coord1 });

      if (i < len - 1) {
        const coord2 = coordinates[i + 1];
        const mid = calcMidPoint(coord1, coord2);
        anchors.push({ type: 'ghost', coordinate: mid });
      }

      // 面是一个闭合的线，所以需要处理首尾相连的线上的锚点
      if (i === len - 1) {
        const coord2 = coordinates[0];
        const mid = calcMidPoint(coord1, coord2);
        anchors.push({ type: 'ghost', coordinate: mid });
      }
    }

    return anchors;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  setCenterPoint(center: number[], anchors: AnchorPointOption[]) {
    this.centerPoint = center;
    this.anchorPoints = anchors;

    // 处理几何点
    const coordinates = this.getCoordinates$(anchors);
    this.setCoordinates([coordinates]);
  }

  /**
   * 处理锚点，这里主要是处理 ghost anchor
   */
  resolveAnchors(anchors: AnchorPointOption[]) {
    const coordinates: number[][] = [];
    for (let i = 0, len = anchors.length; i < len; i++) {
      const anchor = anchors[i];
      if (anchor.type === 'anchor') {
        coordinates.push(anchor.coordinate);
      }
    }
    return this.genAnchors(coordinates);
  }

  setAnchorPoints(points: AnchorPointOption[], updateGhost = true) {
    this.anchorPoints = updateGhost ? this.resolveAnchors(points) : points;

    // 处理几何点
    const coordinates = this.getCoordinates$(points);
    this.setCoordinates([coordinates]);

    this.centerPoint = calcCenter(coordinates);
  }

  getCoordinates$(anchors: AnchorPointOption[]) {
    return anchors.filter((point) => point.type === 'anchor').map((point) => point.coordinate);
  }
}

export default PlotPolygon;
