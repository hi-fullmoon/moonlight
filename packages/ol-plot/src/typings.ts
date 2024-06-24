/**
 * 标绘元素类型
 */
export type PlotType =
  | 'POINT'
  | 'LINE'
  | 'POLYGON'
  | 'CIRCLE'
  | 'ELLIPSE'
  | 'RECTANGLE'
  | 'TEXT'
  | 'ARROW'
  | 'MEASURE_DISTANCE'
  | 'MEASURE_AREA';

/**
 * 标绘事件类型
 */
export type PlotEvent = 'drawend' | 'modified' | 'removed' | 'selected' | 'clear';
