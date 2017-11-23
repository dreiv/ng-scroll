import { Component } from '@angular/core';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  template: `<h1>hello world</h1>`,
  styles: ['h1 {height: 5000px}']
})
export class AppComponent {
  constructor(private scroll: ScrollService) {
    scroll.scrolled$().subscribe(() => {
      console.log('triggered');
    });
  }
}
