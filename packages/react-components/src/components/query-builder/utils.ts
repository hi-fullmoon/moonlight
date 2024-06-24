import dayjs from 'dayjs';

const toString = Object.prototype.toString;

export function isObject(obj: any) {
  return toString.call(obj) === '[object Object]';
}

export function isArray(obj: any) {
  return toString.call(obj) === '[object Array]';
}

export function noop() {

}
