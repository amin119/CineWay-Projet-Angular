import { AfterViewInit, Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements AfterViewInit {
  private route = inject(ActivatedRoute);

  movieId = this.route.snapshot.paramMap.get('id');
  heroVisible = signal(false);
  autoplayEnabled = signal(false);
  isMuted = signal(true);

@ViewChild('hero') hero!: ElementRef;
@ViewChild('trailer') trailer?: ElementRef<HTMLVideoElement>;
  trailerUrl = computed<SafeResourceUrl>(() => {
  const url =
    'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'

  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
});
private sanitizer = inject(DomSanitizer);

 ngAfterViewInit() {
  
    this.observeHero();
    this.setupAutoplayDelay();
  }

  playPauseEffect = effect(() => {
    const video = this.trailer?.nativeElement;
    if (!video) return;
    if (!this.autoplayEnabled()) return;
    if (this.heroVisible()) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });


   private observeHero() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.heroVisible.set(entry.isIntersecting);
      },
      { threshold: 0.6 } // 60% visible
    );

    observer.observe(this.hero.nativeElement);
  }

  private setupAutoplayDelay() {
    setTimeout(() => {
      this.autoplayEnabled.set(true);
    }, 3000);
  }



toggleAudio() {
  const video = this.trailer?.nativeElement;
  if (!video) return;

  video.muted = !video.muted;
  this.isMuted.set(video.muted);
}

}
