import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SliderSignFormComponent } from './slider-sign-form/slider-sign-form.component';
import { TasksComponent } from './tasks/tasks.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'

@NgModule({
  declarations: [AppComponent, SliderSignFormComponent, TasksComponent, LoadingSpinnerComponent],
  imports: [HttpClientModule, AppRoutingModule, ReactiveFormsModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
