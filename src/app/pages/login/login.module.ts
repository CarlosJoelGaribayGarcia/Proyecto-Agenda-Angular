import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./pages/login/login.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoginRoutingModule } from "./login-routing.module";


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoginRoutingModule]
})

export class LoginModule {}
