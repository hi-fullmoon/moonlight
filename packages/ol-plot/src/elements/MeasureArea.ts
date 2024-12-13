import { Map, Overlay } from 'ol';
import { Polygon } from 'ol/geom';
import { Projection } from 'ol/proj';
import { getArea } from 'ol/sphere';
import { AnchorPointOption } from './PlotBase';
import { PlotPointOptions } from './Point';
import PlotPolygon from './Polygon';
import { formatArea } from './utils';

interface PlotMeasureAreaOptions extends PlotPointOptions {
  map: Map;
}

class PlotMeasureArea extends PlotPolygon {
  element: HTMLDivElement | null = null;

  overlay: Overlay | null = null;

  map: Map | null;

  projection: Projection | null;

  constructor({ map, ...restOptions }: PlotMeasureAreaOptions) {
    super(restOptions);

    this.map = map;
    this.projection = this.map.getView().getProjection();

    this.createOverly();
  }

  createOverly() {
    if (!this.map) return;

    const center = this.centerPoint;
    const anchors = this.anchorPoints;

    if (center.length === 0 || anchors.length <= 1) {
      return;
    }

    const element = document.createElement('div');

    element.classList.add('m-ol-plot-tooltip-area');
    element.innerHTML = this.getArea();

    this.element = element;

    this.overlay = new Overlay({
      element,
      positioning: 'center-center',
      position: center,
      stopEvent: false,
    });

    this.map.addOverlay(this.overlay);
  }

  getArea() {
    const geom = this.feature.getGeometry() as Polygon;
    const area = getArea(geom, { projection: this.projection as Projection });
    return formatArea(area);
  }

  activate() {
    super.activate();

    this.overlay?.setOffset([0, -20]);
  }

  deactivate() {
    super.deactivate();

    this.overlay?.setOffset([0, 0]);
  }

  setCenterPoint(center: number[], anchors?: AnchorPointOption[]): void {
    super.setCenterPoint(center, anchors || []);

    if (!this.overlay) this.createOverly();
    this.overlay!.setPosition(this.centerPoint);
  }

  setAnchorPoints(points: AnchorPointOption[], updateGhost = true): void {
    super.setAnchorPoints(points, updateGhost);

    if (!this.overlay) this.createOverly();
    this.overlay!.setPosition(this.centerPoint);
    if (this.element) this.element.innerHTML = this.getArea();
  }

  destroy() {
    if (this.map && this.overlay) this.map.removeOverlay(this.overlay);

    this.map = null;
    this.projection = null;
    this.overlay = null;
    this.element = null;
  }
}

export default PlotMeasureArea;
