import { LineString } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import PlotBase, { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { calcMidPoint } from './utils';

export interface PlotLineOptions extends PlotBaseOptions {}

class PlotLine extends PlotBase {
  constructor(options: PlotLineOptions) {
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
    const geom = this.feature.getGeometry() as LineString;
    const coordinates = geom.getCoordinates();

    // 锚点
    this.anchorPoints = this.genAnchors(coordinates);

    // 中心点
    this.centerPoint = this.getCenter(coordinates);
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
    }
    return anchors;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  setAnchorPoints(points: AnchorPointOption[], updateGhost = true) {
    this.anchorPoints = updateGhost ? this.resolveAnchors(points) : points;

    // 处理几何点
    const coordinates = this.resolveCoordinates(points);
    this.setCoordinates(coordinates);

    // 中心点可能会变化
    this.centerPoint = this.getCenter(coordinates);
  }

  /**
   * 计算中心点
   * NOTE: 比较特殊，其实不是中心点，目前选取在坐标系中最高的一个点
   */
  getCenter(coordinates: number[][]) {
    if (coordinates.length === 0) {
      return [0, 0];
    }

    const offset = 0.06;
    const coordinate = coordinates[0];
    return [coordinate[0], coordinate[1] + offset];
  }

  setCenterPoint(center: number[], anchors: AnchorPointOption[]) {
    this.centerPoint = center;
    this.anchorPoints = anchors;
    this.setCoordinates(this.resolveCoordinates(anchors));
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

  /**
   * 通过锚点得到几何坐标
   */
  resolveCoordinates(anchors: AnchorPointOption[]) {
    const coordinates: number[][] = [];
    for (let i = 0, len = anchors.length; i < len; i++) {
      const anchor = anchors[i];
      if (anchor.type === 'anchor') {
        coordinates.push(anchor.coordinate);
      }
    }
    return coordinates;
  }
}

export default PlotLine;
