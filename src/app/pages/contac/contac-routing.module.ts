import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContacStartComponent } from "./pages/contac-start/contac-start.component";
import { ContacDetailsComponent } from "./pages/contac-details/contac-details.component";
import { ContacEditComponent } from "./pages/contac-edit/contac-edit.component";
import { ContacListComponent } from "./pages/contac-list/contac-list.component";
import { ContacComponent } from "./pages/contac/contac.component";

const routes: Routes = [
  { path: 'list', component: ContacListComponent},
  { path: 'list/:id', component: ContacDetailsComponent},
  {path: 'list/:id/edit', component: ContacEditComponent},
  {path: 'new', component: ContacEditComponent},
  {path: '**', redirectTo: 'list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})

export class ContacRoutingModule{}
