import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SliderSignFormComponent } from './slider-sign-form/slider-sign-form.component';
import { TasksComponent } from './tasks/tasks.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'
import { AuthInterceptorService } from './auth-interceptor.service';
import { SmallSpinnerComponent } from './loading-spinner/small-spinner/small-spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, SliderSignFormComponent, TasksComponent, LoadingSpinnerComponent, SmallSpinnerComponent],
  imports: [HttpClientModule, AppRoutingModule, ReactiveFormsModule, BrowserModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
