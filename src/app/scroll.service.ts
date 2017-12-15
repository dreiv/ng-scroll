import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { auditTime } from 'rxjs/operators';

/** Time in ms to throttle the scrolling events by default. */
export const DEFAULT_SCROLL_TIME = 20;

const previousPosition: number = -1;

@Injectable()
export class ScrollService {
  /** Keeps track of the global `scroll` subscription. */
  globalSubscription: Subscription | null;

  /** Subject for notifying that a registered scrollable reference element has been scrolled. */
  private _scrolled = new Subject<void>();

  constructor(private ngZone: NgZone) {}

  scrolled$(auditTimeInMs: number = DEFAULT_SCROLL_TIME): Observable<string> {
    return Observable.create(observer => {
      if (!this.globalSubscription) {
        this.addGlobalListener();
      }

      // In the case of a 0ms delay, use an observable without auditTime
      // since it does add a perceptible delay in processing overhead.
      const subscription = auditTimeInMs > 0
        ? this._scrolled.pipe(auditTime(auditTimeInMs)).subscribe(() => {
              this.ngZone.run(() => {
                  observer.next(`${document.scrollingElement.scrollTop}`);
              });
          })
        : this._scrolled.subscribe(observer);
    });
  }

  /** Sets up the global scroll listener. */
  private addGlobalListener() {
    this.globalSubscription = this.ngZone.runOutsideAngular(() => {
      return fromEvent(window.document, 'scroll', { passive: true })
        .subscribe((event: any) => {
          const el = event.currentTarget.scrollingElement;

          this._scrolled.next();
          console.log('top: ', el.scrollTop);
        });
    });
  }
}
