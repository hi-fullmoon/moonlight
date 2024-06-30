import dayjf from 'dayjs';
import { nanoid } from 'nanoid';

const toString = Object.prototype.toString;

export function isObject(obj: any) {
  return toString.call(obj) === '[object Object]';
}

export function isArray(obj: any) {
  return toString.call(obj) === '[object Array]';
}

export function noop() {}

export function getDateValue(value: string) {
  return value ? dayjf(value).unix() * 1000 : null;
}

export function genRule() {
  return {
    id: nanoid(8),
    type: 'RULE',
    fieldType: undefined,
    fieldId: undefined,
    operator: undefined,
    value: undefined,
  };
}

export function genGroup() {
  return {
    id: nanoid(8),
    type: 'GROUP',
    combinator: 'AND',
    children: [genRule()],
  };
}
