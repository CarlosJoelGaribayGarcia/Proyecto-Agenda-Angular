import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./pages/about/about.component";

const routes: Routes = [
  {path: '', component: AboutComponent},
  {path: '**', redirectTo: 'about'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})

export class AboutRoutingModule{}
