import { Component } from '@angular/core';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public direction = 'up';
  public above: string;
  public below: string;
  private filler = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae enim ut purus pulvinar vehicula ut eget erat. Morbi luctus libero in dui interdum consequat. Vivamus pretium sagittis orci vitae aliquam. Ut posuere sed tortor nec viverra. Pellentesque elementum, ante eget sodales consectetur, velit purus eleifend lectus, et gravida nisl purus faucibus magna. Duis auctor, diam egestas aliquam ullamcorper, elit est malesuada velit, quis placerat dolor libero et enim. Ut sit amet sem sed lorem elementum sagittis sit amet at nisi. Morbi elementum aliquam sollicitudin. Vivamus fringilla, magna non rutrum venenatis, metus sem feugiat diam, vel egestas neque est a augue. Curabitur nisl mi, facilisis ut ultrices ac, tempor nec diam. Duis eget nisl erat. Vivamus ut pretium magna, vel volutpat nunc. Donec varius est id leo auctor eleifend. Quisque sit amet augue felis. Vivamus placerat maximus orci ut efficitur. Mauris ut finibus magna, ac maximus sapien. Quisque odio nisi, cursus convallis dignissim eu, dapibus et leo. Maecenas fermentum nunc ac sapien egestas convallis. Maecenas tincidunt commodo tortor at sollicitudin. Donec at tempus mauris, aliquet commodo sem. Curabitur vestibulum tristique tortor, ac fringilla nunc aliquam quis. Donec feugiat, leo eget ultricies pharetra, libero augue tristique sapien, vel sagittis libero velit id sem. Phasellus rhoncus eget turpis quis commodo. Nulla suscipit interdum luctus. Duis pretium, lectus eget faucibus dignissim, est magna sollicitudin velit, eu dictum magna massa eu nisl. Pellentesque ornare imperdiet fringilla. Mauris consequat lectus non enim pretium bibendum. Curabitur hendrerit sem ac nisl vulputate, sed egestas nibh egestas. Aenean sed convallis purus, porta porta augue. Donec id pellentesque velit. Proin ut libero dignissim, tempus sapien vitae, malesuada arcu. Mauris eget dignissim metus. Nunc aliquam sapien non lectus congue condimentum. In hac habitasse platea dictumst. Sed congue, orci id suscipit condimentum, neque elit luctus velit, sit amet accumsan enim augue sit amet lacus. Etiam eget porttitor diam, non lacinia dui. Quisque mollis, quam et ultrices laoreet, nisi turpis vestibulum mauris, in iaculis erat elit ac enim. Pellentesque a nulla nisl. Ut vitae enim non urna dapibus malesuada quis id mi. Nunc iaculis suscipit nulla, vulputate consectetur purus. Aenean dignissim feugiat ipsum dignissim ultricies. Aenean aliquam dapibus velit. Donec sit amet commodo leo. Etiam velit massa, imperdiet vitae aliquet sed, dapibus id sem. Donec a enim et enim imperdiet ultricies vel a turpis. Vivamus lacinia, mauris vel mollis tempus, tellus enim vulputate felis, at pretium nisi est in risus. Integer aliquam vel elit quis dignissim. Sed euismod lorem neque. Ut commodo dapibus nunc, ut auctor sapien elementum at. Donec porta turpis vitae imperdiet maximus. Aliquam magna leo, pulvinar et erat varius, interdum sagittis massa. Nullam luctus leo non pretium eleifend. Suspendisse molestie purus mauris. Vivamus porttitor vestibulum felis, non dignissim eros. Nulla facilisi. Nulla accumsan libero in odio viverra, non efficitur mi tempus. Fusce scelerisque malesuada ipsum, id condimentum magna fermentum eget. Suspendisse sem turpis, varius non ex ac, ultrices pulvinar ligula. Curabitur id felis malesuada, ultricies dui ac, malesuada erat. Interdum et malesuada fames ac ante ipsum primis in faucibus.';

  constructor(private scroll: ScrollService) {
    scroll.scrolled$().subscribe((blah) => {
      this.direction = blah;
    });
  }

  addContentAbove() {
    this.above += this.filler;
  }

  addContentBelow() {
    this.below += this.filler;
  }
}
