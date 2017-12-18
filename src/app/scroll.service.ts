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

/** Time in ms to throttle the scrolling events by default. */
export const DEFAULT_SCROLL_TIME = 20;

@Injectable()
export class ScrollService {
  /** Subject for notifying that a registered scrollable reference element has been scrolled. */
  private scrolled$: Subject<Element> = new Subject<Element>();

  private previousScrollTop: number;
  private previousOffsetHeight: number;

  constructor(private ngZone: NgZone) {
    this.addGlobalListener();
  }

  direction$(auditTimeInMs: number = DEFAULT_SCROLL_TIME): Observable<ScrollDirection> {
    return Observable.create(observer => {

      // In the case of a 0ms delay, use an observable without auditTime
      // since it does add a perceptible delay in processing overhead.
      const scrolledSubscription: Observable<Element> = auditTimeInMs > 0
        ? this.scrolled$.pipe(auditTime(auditTimeInMs))
        : this.scrolled$;

      scrolledSubscription
        .filter((scrollingElement: HTMLElement) => scrollingElement.scrollHeight > scrollingElement.clientHeight)
        .subscribe((scrollingElement: HTMLElement) => {
          if ( scrollingElement.offsetHeight === this.previousOffsetHeight ) {
            const currentScrollTop = isIOS()
              // Eliminate IOs over scrolling by constraining the scroll value range.
              ? Math.max(Math.min(scrollingElement.scrollTop, scrollingElement.scrollHeight - window.innerHeight), 0)
              : scrollingElement.scrollTop;

            if ( this.previousScrollTop && currentScrollTop !== this.previousScrollTop ) {
              const direction: ScrollDirection = currentScrollTop > this.previousScrollTop
                ? ScrollDirection.DOWN
                : ScrollDirection.UP;

              this.ngZone.run(() => {
                observer.next(direction);
              });
            }

            this.previousScrollTop = currentScrollTop;
          }

          this.previousOffsetHeight = scrollingElement.offsetHeight;
      });
    }).distinctUntilChanged()
      .share();
  }

  /** Sets up the global scroll listener. */
  private addGlobalListener() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window.document, 'scroll', { passive: true })
        .subscribe(() => this.scrolled$.next(document.scrollingElement));
    });
  }
}
