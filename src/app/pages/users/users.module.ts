import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RegisterUserComponent } from "./pages/register/register-user.component";
import { UsersRoutingModule } from "./users-routing.module";


@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    UsersRoutingModule]
})

export class UsersModule {}
