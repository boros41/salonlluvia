import { AfterViewInit, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { About } from '../about/about';
import { Services } from '../services/services';
import { Team } from '../team/team';

@Component({
  selector: 'home',
  imports: [NgOptimizedImage, About, Services, Team],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {
  async ngAfterViewInit(): Promise<void> {
    await this.initializeGlide();
  }

  // https://glidejs.com/docs/options/
  // home page hero carousel
  private async initializeGlide(): Promise<void> {
    const {default: Glide} = await import("@glidejs/glide");

    const glide = new Glide('.glide', {
      autoplay: 3000,
    });

    glide.mount();
  }
}
