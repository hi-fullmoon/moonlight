import { EasyLayoutOption } from '.';
import { COLUMNS, CONTAINER_PADDING, LAYOUT_MARGIN } from './constants';

function createRound(methodName: 'round' | 'ceil' | 'floor') {
  const func = Math[methodName];
  return (number: number, precision: number) => {
    precision = precision == null ? 0 : precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292);
    if (precision) {
      let pair = `${number}e`.split('e');
      // @ts-ignore-next-line
      const value = func(`${pair[0]}e${+pair[1] + precision}`);
      pair = `${value}e`.split('e');
      return +`${pair[0]}e${+pair[1] - precision}`;
    }
    return func(number);
  };
}

const round = createRound('round');

/**
 * 计算 colWidth
 */
export const calcColWidth = (width: number) => {
  return (width - LAYOUT_MARGIN[0] * (COLUMNS - 1) - CONTAINER_PADDING[0] * 2) / COLUMNS;
};

/**
 * 计算布局位置
 */
export const calcPosition = (
  x: number,
  y: number,
  colWidth: number,
  rowHeight: number,
  margin: [number, number] = LAYOUT_MARGIN,
) => {
  const posX = round(x / (colWidth + margin[0]), 2);
  const posY = round(y / (rowHeight + margin[1]), 2);
  return { x: posX, y: posY };
};

/**
 * 计算真实位置
 */
export const calcRealPosition = (
  x: number,
  y: number,
  colWidth: number,
  rowHeight: number,
  margin: [number, number] = LAYOUT_MARGIN,
) => {
  const posX = round(x * colWidth + x * margin[0], 2);
  const posY = round(y * rowHeight + y * margin[1], 2);
  return { x: posX, y: posY };
};

interface Size {
  width: number;
  height: number;
}

/**
 * 计算布局尺寸
 */
export const calcSize = (
  w: number,
  h: number,
  colWidth: number,
  rowHeight: number,
  margin: [number, number] = LAYOUT_MARGIN,
): Size => {
  const width = round((w + margin[0]) / (colWidth + margin[0]), 2);
  const height = round((h + margin[1]) / (rowHeight + margin[1]), 2);
  return { width, height };
};

/**
 * 计算真实的尺寸
 */
export const calcRealSize = (
  w: number,
  h: number,
  colWidth: number,
  rowHeight: number,
  margin: [number, number] = LAYOUT_MARGIN,
): Size => {
  const width = round(w * colWidth + (w - 1) * margin[0], 2);
  const height = round(h * rowHeight + (h - 1) * margin[1], 2);
  return { width, height };
};

/**
 * 处理布局参数，排除没必要的数据
 */
export const resolveGridLayout = (layout: any) => {
  let ret: any = {};
  ret.type = 'grid';
  ['i', 'x', 'y', 'w', 'h', 'z'].forEach((key) => (ret[key] = layout[key]));
  return ret as EasyLayoutOption;
};
