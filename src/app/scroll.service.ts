import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';
import { auditTime } from 'rxjs/operators';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/share';
import { isIOS } from './utils';
import 'rxjs/add/operator/mapTo';

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
  /** Subject for notifying that a registered scrollable reference element has been resized. */
  private resized$: Subject<Element> = new Subject<Element>();

  private previousScrollTop: number;
  private previousOffsetHeight: number;

  constructor(private ngZone: NgZone) {
    this.addGlobalListeners();
  }

  direction$(auditTimeInMs: number = DEFAULT_SCROLL_TIME): Observable<ScrollDirection> {
    return Observable.create(observer => {
      this.resized$.subscribe((scrollingElement: HTMLElement) => this.previousScrollTop = scrollingElement.scrollTop);

      // In the case of a 0ms delay, use an observable without auditTime
      // since it does add a perceptible delay in processing overhead.
      const scrolledSubscription = auditTimeInMs > 0
        ? this.scrolled$.pipe(auditTime(auditTimeInMs))
        : this.scrolled$;

      scrolledSubscription.subscribe((scrollingElement: HTMLElement) => {
        const currentScrollTop = isIOS()
          // Eliminate IOs over scrolling by constraining scroll value range.
          ? Math.max(Math.min(scrollingElement.scrollTop, scrollingElement.scrollHeight - window.innerHeight), 0)
          : scrollingElement.scrollTop;
        const offsetHeight = scrollingElement.offsetHeight;

        if (offsetHeight === this.previousOffsetHeight
              && currentScrollTop !== this.previousScrollTop) {
          const direction: ScrollDirection = currentScrollTop > this.previousScrollTop
            ? ScrollDirection.DOWN
            : ScrollDirection.UP;

          this.ngZone.run(() => {
            observer.next(direction);
          });
        }

        this.previousScrollTop = currentScrollTop;
        this.previousOffsetHeight = offsetHeight;
      });

    }).distinctUntilChanged()
      .share();
  }

  /** Sets up the global scroll listener. */
  private addGlobalListeners() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window.document, 'scroll', { passive: true })
        .subscribe(() => this.scrolled$.next(document.scrollingElement));

      merge(
        fromEvent(window, 'resize', { passive: true }),
        fromEvent(window, 'orientationchange', { passive: true })
      ).subscribe(() => this.resized$.next(document.scrollingElement));
    });
  }
}
