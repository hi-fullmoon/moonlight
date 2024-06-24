import { Map } from 'ol';
import { AnchorPointOption, PlotBaseOptions } from './PlotBase';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import PlotLine from './Line';

interface PlotArrowOptions extends PlotBaseOptions {
  map: Map;
}

class PlotArrow extends PlotLine {
  constructor(options: PlotArrowOptions) {
    super(options);

    this.initFeatureStyle();
    this.initControlPoints();
  }

  initFeatureStyle() {
    const geom = this.feature?.getGeometry() as LineString;
    const style = [
      new Style({
        stroke: new Stroke({
          width: 3,
          color: 'blue',
        }),
      }),
    ];

    const coordinates = geom.getCoordinates();
    const len = coordinates.length;

    //最后点位才会有线头
    if (len >= 2) {
      const start = coordinates[len - 2];
      const end = coordinates[len - 1];
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const rotation = Math.atan2(dy, dx);
      style.push(
        new Style({
          geometry: new Point(end),
          image: new RegularShape({
            radius: 10,
            points: 3,
            rotation: -rotation + 12,
            displacement: [0, 0],
            fill: new Fill({
              color: 'blue',
            }),
          }),
        }),
      );
    }

    this.feature.setStyle(style);
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

    this.initFeatureStyle();
  }

  /**
   * 通过锚点得到几何坐标
   */
  resolveCoordinates(anchors: AnchorPointOption[]) {
    if (!anchors) return [];

    const coordinates: number[][] = [];
    for (let i = 0, len = anchors.length; i < len; i++) {
      const anchor = anchors[i];
      if (anchor.type === 'anchor') {
        coordinates.push(anchor.coordinate);
      }
    }
    return coordinates;
  }

  setAnchorPoints(points: AnchorPointOption[], updateGhost = true) {
    this.anchorPoints = updateGhost ? this.resolveAnchors(points) : points;

    // 处理几何点
    const coordinates = this.resolveCoordinates(points);
    this.setCoordinates(coordinates);

    this.initFeatureStyle();

    // 中心点可能会变化
    this.centerPoint = this.getCenter(coordinates);
  }
}

export default PlotArrow;
