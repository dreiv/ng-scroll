import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { passiveSupported } from './utils';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { auditTime } from 'rxjs/operators';

/** Time in ms to throttle the scrolling events by default. */
export const DEFAULT_SCROLL_TIME = 20;

@Injectable()
export class ScrollService {
  /** Keeps track of the global `scroll` and `resize` subscriptions. */
  _globalSubscription: Subscription | null = null;

  /** Subject for notifying that a registered scrollable reference element has been scrolled. */
  private _scrolled = new Subject<void>();

  constructor(private ngZone: NgZone) {
  }

  scrolled$(auditTimeInMs: number = DEFAULT_SCROLL_TIME): Observable<void> {
    return Observable.create(observer => {
      if (!this._globalSubscription) {
        this._addGlobalListener();
      }

      // In the case of a 0ms delay, use an observable without auditTime
      // since it does add a perceptible delay in processing overhead.
      if (auditTimeInMs > 0){
        this._scrolled.pipe(auditTime(auditTimeInMs)).subscribe(observer);
      } else {
        this._scrolled.subscribe(observer);
      }
    });
  }

  /** Sets up the global scroll and resize listeners. */
  private _addGlobalListener() {
    const eventOptions = passiveSupported
      ? { capture: true, passive: true }
      : true;

    this._globalSubscription = this.ngZone.runOutsideAngular(() => {
      return fromEvent(window.document, 'scroll', eventOptions)
        .subscribe(() => this._scrolled.next());
    });
  }
}
