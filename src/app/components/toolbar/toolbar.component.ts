import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResultDataUser, ResultUser, Users } from '../../pages/users/models/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoginService } from '../../pages/login/services/login.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RegisterService } from 'src/app/pages/users/services/register.service';
import { ContacService } from 'src/app/pages/contac/services/contac.service';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userData: Users;
  contactCount: number;
  id: number;
  storageUpdatedSubscription: Subscription;

  // @ViewChild('menuCollapse') menuCollapse: ElementRef;

  constructor (private loginService: LoginService,
              public router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private registerService: RegisterService,
              private contacService: ContacService,
              private alertService: AlertService
              ) {

}

  ngOnInit() {
    this.updateUserData();

    // this.localStorageService.storageUpdated$().subscribe(() => {
    //   this.updateUserData();
    // });
    this.storageUpdatedSubscription = this.localStorageService.storageUpdated$().subscribe(() => {
      this.updateUserData();
    });

    this.registerService.userData$.subscribe(user => {
      this.userData = user;
    });

  }


  ngAfterViewInit() {
    this.contacService.getContactCount().subscribe(count => {
      setTimeout(() => { // Agrega un retraso para permitir que Angular complete la detección de cambios
        this.contactCount = count;
      });
    });

  }

  private updateUserData() {
    this.userData = this.localStorageService.getItem('user');
  }

  onLogOut() {
    this.alertService.showLogoutConfirmationAlert().then((result) => {
      if (result.isConfirmed) {
        this.loginService.logOut().subscribe(resData => {
          console.log(resData);
          this.localStorageService.removeItem('accessToken');
          this.localStorageService.removeItem('refreshToken');
          this.localStorageService.removeItem('user');
          this.userData = null;
          this.router.navigate(['/login']);
        });
      }
    });
  }

  onEditUser() {
    this.router.navigate(['/register', 'edit']);
  }

  onAbout() {
    this.router.navigate(['/about']);
  }


  ngOnDestroy() {
    if (this.storageUpdatedSubscription) {
      this.storageUpdatedSubscription.unsubscribe();
    }
  }


}
