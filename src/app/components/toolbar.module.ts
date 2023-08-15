import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule,
            AppRoutingModule],
  exports: [ToolbarComponent], // Exportamos el componente para que pueda ser usado fuera del módulo
})
export class ToolbarModule {}
