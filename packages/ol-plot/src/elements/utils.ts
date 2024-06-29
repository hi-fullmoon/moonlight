import { boundingExtent, getCenter } from 'ol/extent';
import { Circle } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';

/**
 *  通过两个点，确定矩形四个点
 */
export const getRectangleCoordinates = (coordinates: number[][]) => {
  const [coord1, coord2] = coordinates;

  const xmin = Math.min(coord1[0], coord2[0]);
  const xmax = Math.max(coord1[0], coord2[0]);
  const ymin = Math.min(coord1[1], coord2[1]);
  const ymax = Math.max(coord1[1], coord2[1]);

  const tl = [xmin, ymax];
  const tr = [xmax, ymax];
  const br = [xmax, ymin];
  const bl = [xmin, ymin];

  return [tl, tr, br, bl];
};
/**
 * 生成一个椭圆
 */
export const genEllipse = (center: number[], majorRadius: number, minorRadius: number, radian?: number) => {
  const circle = new Circle(center, minorRadius);
  const polygon = fromCircle(circle, 100);
  polygon.scale(majorRadius / minorRadius, 1);

  polygon.rotate(radian || 0, center);
  return polygon;
};

/**
 * 计算两个坐标之间的距离
 */
export const calcDistance = (coord1: number[], coord2: number[]) => {
  return Math.sqrt(Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2));
};

/**
 * 计算两点中间的点
 */
export const calcMidPoint = (coord1: number[], coord2: number[]) => {
  return [(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2];
};

/**
 * 计算一组坐标的中心位置
 */
export const calcCenter = (coordinates: number[][]) => {
  const extend = boundingExtent(coordinates);
  return getCenter(extend);
};

/**
 * 格式化面积单位
 */
export const formatArea = (area: number) => {
  if (area > 10000) {
    return Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  }

  return Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
};

/**
 * 格式化距离单位
 */
export const formatLength = (length: number) => {
  let output: string;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};
