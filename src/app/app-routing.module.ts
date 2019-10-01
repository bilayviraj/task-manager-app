import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { NgModule } from '@angular/core';
import { SliderSignFormComponent } from './slider-sign-form/slider-sign-form.component';

const appRoutes: Routes = [
    { path: '', component: TasksComponent},
    { path: 'signin', component: SliderSignFormComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})


export class AppRoutingModule {}