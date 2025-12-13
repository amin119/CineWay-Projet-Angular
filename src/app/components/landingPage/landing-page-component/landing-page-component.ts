import { Component, signal } from '@angular/core';
import { NavbarlandingPageComponent } from "../navbarlanding-page-component/navbarlanding-page-component";
import { WelcomeComponent } from "../welcome-component/welcome-component";
import { NowPlayingComponent } from "../now-playing-component/now-playing-component";
import { FooterComponent } from "../footer-component/footer-component";
import { PartnersComponent } from "../partners-component/partners-component";
import { HowItWorksComponent } from "../how-it-works-component/how-it-works-component";

@Component({
  selector: 'app-landing-page-component',
  imports: [NavbarlandingPageComponent, WelcomeComponent, NowPlayingComponent, FooterComponent, PartnersComponent, HowItWorksComponent],
  templateUrl: './landing-page-component.html',
  styleUrl: './landing-page-component.css',
})
export class LandingPageComponent {
  showNowPlaying = signal(false);

 onShowNowPlaying() {
  this.showNowPlaying.set(true);
  setTimeout(() => {
    document
      .getElementById('nowPlaying')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center', 
    });
  }, 0);
}
}
