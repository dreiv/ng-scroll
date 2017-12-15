let _isBrowser: boolean;

/** Whether the Angular application is being rendered in the browser. */
export function isBrowser(): boolean {
  if (_isBrowser == null) {
    _isBrowser = typeof document === 'object' && !!document
  }

  return _isBrowser;
}

let _IOS: boolean;

/** Whether the current platform is Apple iOS. */
export function isIOS(): boolean {
  if (_IOS == null) {
    _IOS = isBrowser() && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  return _IOS;
}
