import { Map } from 'ol';
import PlotLine, { PlotLineOptions } from './Line';
import { formatLength } from './utils';
import { LineString, Point } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { Projection } from 'ol/proj';
import { AnchorPointOption } from './PlotBase';
import { Fill, RegularShape, Stroke, Style, Text } from 'ol/style';

interface PlotMeasureDistanceOptions extends PlotLineOptions {
  map: Map;
}

class PlotMeasureDistance extends PlotLine {
  projection: Projection | null;

  map: Map | null;
  labelStyle: Style;
  segmentStyles: Style[];

  constructor({ map, ...restOptions }: PlotMeasureDistanceOptions) {
    super(restOptions);

    this.map = map;
    this.projection = this.map.getView().getProjection();

    this.labelStyle = new Style({
      text: new Text({
        font: '14px Calibri,sans-serif',
        fill: new Fill({
          color: 'rgba(255, 255, 255, 1)',
        }),
        backgroundFill: new Fill({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        padding: [3, 3, 3, 3],
        textBaseline: 'bottom',
        offsetY: -15,
      }),
      image: new RegularShape({
        radius: 8,
        points: 3,
        angle: Math.PI,
        displacement: [0, 10],
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
      }),
    });

    // 点与点连线上的气泡样式
    this.segmentStyles = [
      new Style({
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
          padding: [2, 2, 2, 2],
          textBaseline: 'bottom',
          offsetY: -12,
        }),
        image: new RegularShape({
          radius: 6,
          points: 3,
          angle: Math.PI,
          displacement: [0, 8],
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
        }),
      }),
    ];

    this.initFeatureStyle();
  }

  initFeatureStyle() {
    if (!this.map) return;
    const center = this.centerPoint;
    const anchors = this.anchorPoints;

    if (center.length === 0 || anchors.length <= 1) {
      return;
    }

    let styles = [
      new Style({
        stroke: new Stroke({
          width: 3,
          color: 'blue',
        }),
      }),
    ];

    const geom = this.feature.getGeometry() as LineString;

    if (geom) {
      let count = 0;
      const _this = this;
      geom.forEachSegment(function (a, b) {
        const segment = new LineString([a, b]);
        const label = _this.getDistance(segment as LineString);
        if (_this.segmentStyles.length - 1 < count) {
          _this.segmentStyles.push(_this.segmentStyles[0].clone());
        }
        // 1/2位置生成气泡点
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        _this.segmentStyles[count].setGeometry(segmentPoint);
        _this.segmentStyles[count].getText().setText(label);
        styles.push(_this.segmentStyles[count]);
        count++;
      });
    }

    this.feature.setStyle(styles);
  }

  getDistance(line: LineString) {
    const lineLength = getLength(line, { projection: this.projection as Projection });
    return formatLength(lineLength);
  }

  setCenterPoint(center: number[], anchors?: AnchorPointOption[]): void {
    super.setCenterPoint(center, anchors || []);
    this.initFeatureStyle();
  }

  setAnchorPoints(points: AnchorPointOption[], updateGhost = true): void {
    super.setAnchorPoints(points, updateGhost);

    this.initFeatureStyle();
  }

  destroy() {
    this.map = null;
    this.projection = null;
  }
}

export default PlotMeasureDistance;
