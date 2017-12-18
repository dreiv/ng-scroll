import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { auditTime } from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/share';
import { isIOS } from './utils';
import 'rxjs/add/operator/mapTo';
import "rxjs/add/operator/filter";

export enum ScrollDirection {
    UP = 'up',
    DOWN = 'down'
}

export interface ScrollEvent {
  direction: ScrollDirection;
  position: number;
}

/** Time in ms to throttle the scrolling events by default. */
export const DEFAULT_SCROLL_TIME = 20;

@Injectable()
export class ScrollService {
  /** Subject for notifying that a registered scrollable reference element has been scrolled. */
  private _scrolled$: Subject<Element> = new Subject<Element>();

  private previousScrollTop: number;
  private previousScrollHeight: number;

  constructor(private ngZone: NgZone) {
    this.addGlobalListener();
  }

  scrolled$(auditTimeInMs: number = DEFAULT_SCROLL_TIME): Observable<ScrollEvent> {
    return Observable.create( observer => {

      // In the case of a 0ms delay, use an observable without auditTime
      // since it does add a perceptible delay in processing overhead.
      const scrolledSubscription: Observable<Element> = auditTimeInMs > 0
        ? this._scrolled$.pipe(auditTime(auditTimeInMs))
        : this._scrolled$;

      scrolledSubscription
        .filter((scrollingElement: HTMLElement) => scrollingElement.scrollHeight > scrollingElement.clientHeight)
        .subscribe((scrollingElement: HTMLElement) => {
          const scrollHeight = scrollingElement.scrollHeight;

          if ( scrollHeight === this.previousScrollHeight ) {
            const scrollTop = isIOS()
              // Eliminate IOs over scrolling by constraining the scroll value range.
              ? Math.max(Math.min(scrollingElement.scrollTop, scrollHeight - window.innerHeight), 0)
              : scrollingElement.scrollTop;

            if ( this.previousScrollTop && scrollTop !== this.previousScrollTop ) {
              const direction: ScrollDirection = scrollTop > this.previousScrollTop
                ? ScrollDirection.DOWN
                : ScrollDirection.UP;

              this.ngZone.run(() => {
                observer.next({
                  direction: direction,
                  position: scrollTop
                });
              });
            }
            this.previousScrollTop = scrollTop;
          }
          this.previousScrollHeight = scrollHeight;
      });
    }).share();
  }

  /** Sets up the global scroll listener. */
  private addGlobalListener() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window.document, 'scroll', { passive: true })
        .subscribe(() => this._scrolled$.next(document.scrollingElement));
    });
  }
}
