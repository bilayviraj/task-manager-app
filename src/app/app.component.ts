import { Component, OnInit } from '@angular/core';
import { ParticlesConfig } from './particles-config';

declare let particlesJS: any; // Required to be properly interpreted by TypeScript.


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    this.invokeParticles();
  }

  invokeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }

}
