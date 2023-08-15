import { NgModule } from "@angular/core";
import { ContacComponent } from "./pages/contac/contac.component";
import { ContacListComponent } from "./pages/contac-list/contac-list.component";
import { ContacDetailsComponent } from "./pages/contac-details/contac-details.component";
import { ContacItemComponent } from "./components/contac-item/contac-item.component";
import { ContacStartComponent } from "./pages/contac-start/contac-start.component";
import { ContacEditComponent } from "./pages/contac-edit/contac-edit.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContacRoutingModule } from "./contac-routing.module";
import { DesplegableDirective } from "./pages/shared/desplegable.directive";
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from "ngx-pagination";
import { PhoneComponent } from "./components/phone/phone.component";
import { MovilComponent } from "./components/movil/movil.component";
import { WhatsappComponent } from "./components/whatsapp/whatsapp.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TagsDialogComponent } from "./components/tags/tagsDialog.component";



@NgModule({
  declarations: [
    ContacComponent,
    ContacListComponent,
    ContacDetailsComponent,
    ContacItemComponent,
    ContacStartComponent,
    ContacEditComponent,
    DesplegableDirective,
    PhoneComponent,
    MovilComponent,
    WhatsappComponent,
    TagsDialogComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    ContacRoutingModule,
    MatPaginatorModule,
    NgxPaginationModule,
    FormsModule,
    MatDialogModule
  ]
})

export class ContacModule {}
