import type { Clock } from '../../application/ports/clock';

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
