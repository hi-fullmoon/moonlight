import { LayoutOption, LineOption } from './provider';

type LineType = 'vertical' | 'horizontal';

export const noop = () => {};

export const getDistance = (a: number, b: number) => {
  return a - b;
};

export const resolveLineValues = (target: LayoutOption, comparer: LayoutOption, type: LineType) => {
  const { w: W, h: H, x: X, y: Y } = target;
  const { w, h, x, y } = comparer;

  const T = Y + H / 2;
  const R = X + W / 2;
  const B = Y + H / 2;
  const L = X + W / 2;

  const t = y + h / 2;
  const r = x + w / 2;
  const b = y + h / 2;
  const l = x + w / 2;

  const directionValues: { [key in LineType]: number[] } = {
    vertical: [t, b, T, B],
    horizontal: [l, r, L, R],
  };

  const num = directionValues[type].sort((a, b) => a - b);
  const length = num[num.length - 1] - num[0];
  const offset = Math.min(...directionValues[type]);

  const result: LineOption = {
    length,
  };

  if (type === 'horizontal') {
    result.left = offset;
  }

  if (type === 'vertical') {
    result.top = offset;
  }

  return result;
};

/**
 * 阈值
 */
const THRESHOLD = 4;

/**
 * 处理水平方向的线
 */
export const resolveHorizontalLines = (target: LayoutOption, comparer: LayoutOption) => {
  let hLines: LineOption[] = [
    // top - top
    {
      distance: getDistance(target.y, comparer.y),
      top: comparer.y,
    },
    // top - bottom
    {
      distance: getDistance(target.y, comparer.y + comparer.h),
      top: comparer.y + comparer.h,
    },
    // center - center
    {
      distance: getDistance(target.y + target.h / 2, comparer.y + comparer.h / 2),
      top: comparer.y + comparer.h / 2,
    },
    // bottom - top
    {
      distance: getDistance(target.y + target.h, comparer.y),
      top: comparer.y,
    },
    // bottom - bottom
    {
      distance: getDistance(target.y + target.h, comparer.y + comparer.h),
      top: comparer.y + comparer.h,
    },
  ]
    .filter((item) => Math.abs(item.distance) <= THRESHOLD)
    .map((line) => {
      const { length, left } = resolveLineValues(target, comparer, 'horizontal');
      return {
        ...line,
        left,
        length,
      };
    });

  return hLines;
};

/**
 * 处理竖直方向的线
 */
export const resolveVerticalLines = (target: LayoutOption, comparer: LayoutOption) => {
  let vLines: LineOption[] = [
    // left - left
    {
      distance: getDistance(target.x, comparer.x),
      left: comparer.x,
    },
    // left - right
    {
      distance: getDistance(target.x, comparer.x + comparer.w),
      left: comparer.x + comparer.w,
    },
    // center - center
    {
      distance: getDistance(target.x + target.w / 2, comparer.x + comparer.w / 2),
      left: comparer.x + comparer.w / 2,
    },
    // right - left
    {
      distance: getDistance(target.x + target.w, comparer.x),
      left: comparer.x,
    },
    // right - right
    {
      distance: getDistance(target.x + target.w, comparer.x + comparer.w),
      left: comparer.x + comparer.w,
    },
  ]
    .filter((item) => Math.abs(item.distance) <= THRESHOLD)
    .map((line) => {
      const { length, top } = resolveLineValues(target, comparer, 'vertical');
      return {
        ...line,
        top,
        length,
      };
    });

  return vLines;
};
