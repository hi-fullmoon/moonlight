import { Feature, Map } from 'ol';
import PlotCircle from './elements/Circle';
import PlotEllipse from './elements/Ellipse';
import PlotLine from './elements/Line';
import PlotPoint from './elements/Point';
import PlotPolygon from './elements/Polygon';
import PlotRectangle from './elements/Rectangle';
import PlotText from './elements/Text';
import PlotArrow from './elements/Arrow';
import PlotMeasureDistance from './elements/MeasureDistance';
import PlotMeasureArea from './elements/MeasureArea';
import { PlotType } from './typings';

export interface ElementOptions {
  feature: Feature;
  iconMap?: { [key: string]: any };
  map: Map;
}

function createElement(type: PlotType, options: ElementOptions) {
  const { feature, iconMap, map } = options || {};

  switch (type) {
    case 'POINT':
      return new PlotPoint({ type, feature, iconMap });
    case 'LINE':
      return new PlotLine({ type, feature });
    case 'POLYGON':
      return new PlotPolygon({ type, feature });
    case 'CIRCLE':
      return new PlotCircle({ type, feature });
    case 'ELLIPSE':
      return new PlotEllipse({ type, feature });
    case 'RECTANGLE':
      return new PlotRectangle({ type, feature });
    case 'TEXT':
      return new PlotText({ type, feature, iconMap, map });
    case 'ARROW':
      return new PlotArrow({ type, feature, map });
    case 'MEASURE_DISTANCE':
      return new PlotMeasureDistance({ type, feature, map });
    case 'MEASURE_AREA':
      return new PlotMeasureArea({ type, feature, map });
    default:
      return null;
  }
}

export default createElement;
