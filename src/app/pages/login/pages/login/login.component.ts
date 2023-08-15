import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../../../users/services/register.service';
import { ResultDataUser, ResultUser, Users } from '../../../users/models/user.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataResult } from '../../models/login.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  userData: Users;


  constructor(private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute,
              private registerService: RegisterService,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

      this.registerService.getUser('10').subscribe (resUser => {
      const data: ResultUser = resUser.result;
      this.userData = data.user;

      this.localStorageService.setItem('user', this.userData);
      console.log("Se guardo correctamente",this.userData);

    });

    const authUser = form.value.email;
    const authPassword = form.value.password;

      this.loginService.Login(authUser,authPassword).subscribe (resData => {
        if (resData.succeed) {
          this.loginService.autoLogout();
          this.router.navigate(['/contac']);
        } else {
          console.log(resData);
          this.errorMessage = resData.friendlyMessage[0];
        }
    });
    form.reset();
  }

}
