import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.html',
  styleUrls: ['./parallax.scss']
})
export class ParallaxComponent {
  @Input() imageUrl: string = '';
  @Input() height: string = '400px';
}
