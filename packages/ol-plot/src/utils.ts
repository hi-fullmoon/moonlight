import { Circle, LineString, Point, Polygon } from 'ol/geom';
import PlotBase from './elements/PlotBase';
import { PlotType } from './typings';

/**
 * 通过 plotType 得到 geom
 */
export const getGeomByPlotType = (type: PlotType) => {
  switch (type) {
    case 'POINT':
    case 'CIRCLE':
    case 'ELLIPSE':
    case 'TEXT':
      return new Point([0, 0]);
    case 'LINE':
    case 'ARROW':
    case 'MEASURE_DISTANCE':
      return new LineString([]);
    case 'POLYGON':
    case 'RECTANGLE':
    case 'MEASURE_AREA':
      return new Polygon([]);
    default:
      return new Point([0, 0]);
  }
};

/**
 * 将 elements 的信息转换成 geojson 格式数据
 */
export const toGeoJson = (elements: PlotBase[]) => {
  const ret: any = {
    type: 'FeatureCollection',
    features: [],
  };

  elements.forEach((element) => {
    const { type, feature } = element;
    const geom = feature.getGeometry();

    let featureObj: any = null;

    switch (type) {
      case 'POINT': {
        const coordinates = (geom as Point).getCoordinates();
        const icon = feature.get('icon');
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates,
          },
          properties: {
            type: 'POINT',
            icon,
          },
        };
        break;
      }
      case 'TEXT': {
        const coordinates = (geom as Point).getCoordinates();
        const text = feature.get('text');
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates,
          },
          properties: {
            type: 'TEXT',
            text,
          },
        };
        break;
      }
      case 'LINE': {
        const coordinates = (geom as LineString).getCoordinates();
        if (coordinates.length > 0) {
          featureObj = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
            properties: {
              type: 'LINE',
            },
          };
        }
        break;
      }
      case 'POLYGON': {
        const coordinates = (geom as Polygon).getCoordinates();
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates,
          },
          properties: {
            type: 'POLYGON',
          },
        };
        break;
      }
      case 'CIRCLE': {
        const coordinates = (geom as Circle).getCenter();
        const radius = feature.get('radius');
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates,
          },
          properties: {
            type: 'CIRCLE',
            radius,
          },
        };
        break;
      }
      case 'ELLIPSE': {
        const center = feature.get('center');
        const majorRadius = feature.get('majorRadius');
        const minorRadius = feature.get('minorRadius');
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center,
          },
          properties: {
            type: 'ELLIPSE',
            center,
            majorRadius,
            minorRadius,
          },
        };
        break;
      }
      case 'RECTANGLE': {
        const coordinates = feature.get('coordinates');
        featureObj = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [],
          },
          properties: {
            type: 'RECTANGLE',
            coordinates,
          },
        };
        break;
      }
      case 'ARROW': {
        const coordinates = (geom as LineString).getCoordinates();
        if (coordinates.length > 0) {
          featureObj = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
            properties: {
              type: 'ARROW',
            },
          };
        }
        break;
      }
      case 'MEASURE_DISTANCE': {
        const coordinates = (geom as LineString).getCoordinates();
        if (coordinates.length > 0) {
          featureObj = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
            properties: {
              type: 'MEASURE_DISTANCE',
            },
          };
        }
        break;
      }
      case 'MEASURE_AREA': {
        const coordinates = (geom as LineString).getCoordinates();
        if (coordinates.length > 0) {
          featureObj = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates,
            },
            properties: {
              type: 'MEASURE_AREA',
            },
          };
        }
        break;
      }
      default:
        featureObj = null;
    }

    if (featureObj) ret.features.push(featureObj);
  });

  return ret;
};
