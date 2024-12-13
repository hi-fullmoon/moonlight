import { PlotEvent } from './typings';

export type EventListener = (args?: any) => void;

class EventBus {
  private events: Map<PlotEvent, Set<EventListener>>;

  constructor() {
    this.events = new Map();
  }

  emit(type: PlotEvent, args?: any): void {
    const listeners = this.events.get(type);
    if (listeners?.size) {
      listeners.forEach((listener) => {
        try {
          listener(args);
        } catch (error) {
          console.error(`Error in event listener for ${type}:`, error);
        }
      });
    }
  }

  on(type: PlotEvent, listener: EventListener): () => void {
    if (!this.events.has(type)) {
      this.events.set(type, new Set());
    }
    this.events.get(type)!.add(listener);
    return () => this.off(type, listener);
  }

  off(type: PlotEvent, listener: EventListener): void {
    const listeners = this.events.get(type);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.events.delete(type);
      }
    }
  }

  clear(type?: PlotEvent): void {
    if (type) {
      this.events.delete(type);
    } else {
      this.events.clear();
    }
  }
}

export default new EventBus();
