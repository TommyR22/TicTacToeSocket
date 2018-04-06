import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepperComponent } from './stepper/stepper.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NotifyComponent } from './notify/notify.component';
import { TableGameComponent } from './table-game/table-game.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    CarouselComponent,
    NotifyComponent,
    TableGameComponent,
    HeaderComponent
  ],
  providers: [],
  exports: [
    CarouselComponent,
    NotifyComponent,
    TableGameComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
