import { PlotEvent } from './typings';

class EventEmitter {
  events: { [type in PlotEvent]?: Function[] };

  constructor() {
    this.events = {};
  }

  emit(type: PlotEvent, args?: any) {
    const listeners = this.events[type];
    if (listeners) {
      listeners.forEach((listener) => {
        listener.call(this, args);
      });
    }
  }

  on(type: PlotEvent, listener: Function) {
    const listeners = this.events[type];

    if (listeners) {
      listeners.push(listener);
      return;
    }

    this.events[type] = [];
    this.events[type]!.push(listener);
  }

  un(type: PlotEvent, listener: Function) {
    const listeners = this.events[type];
    if (listeners) {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }
}

export default new EventEmitter();
