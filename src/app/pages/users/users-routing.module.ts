import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegisterUserComponent } from "./pages/register/register-user.component";

const routes: Routes = [
  {path: '', component: RegisterUserComponent},
  {path: 'edit', component: RegisterUserComponent},
  {path: '**', redirectTo: 'register'}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})

export class UsersRoutingModule{}
