import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RegisterService } from "../../services/register.service";
import { Users } from "../../models/user.model";
import { LocalStorageService } from "src/app/services/local-storage.service";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { AlertService } from "src/app/services/alert.service";
import { StatusCode } from "src/app/enums/status-code.enum";


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']

})
export class RegisterUserComponent implements OnInit {
  id: number;
  editMode = false;
  userForm: FormGroup;
  imagePreview: string;

  keyPhoto = 'photo';
  keyFullName = 'fullName';
  keyUserName = 'userName';
  keyEmail = 'email';
  keyPassword = 'password';


  constructor (private registerService: RegisterService,
              private router : Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private alertService: AlertService) {

  }

    ngOnInit() {
      const segments = this.route.snapshot.url.map(segment => segment.path);
      this.editMode = segments.includes('edit');
      console.log(this.editMode);

      this.initForm();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.imagePreview = result;
        const base64Image = result.split(',')[1];
        this.userForm.patchValue({ photo: base64Image });
      }
    };
    reader.readAsDataURL(file);
  }


    onSubmit() {
      if(!this.userForm.valid) {
        return;
      }

      const user: Users = {
        userPhoto: this.userForm.value.photo,
        userFullName: this.userForm.value.fullName,
        userName: this.userForm.value.userName,
        userEmail: this.userForm.value.email,
        userPassword: this.userForm.value.password
            };


    if (this.editMode) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  onCancel() {
    this.router.navigate(['/contac']);
  }

  private initForm() {
    let photo = '';
    let fullName = '';
    let userName = '';
    let email = '';
    let password = '';

    if (this.editMode) {
      const userData = this.localStorageService.getItem('user');
      photo = userData.userPhoto;
      fullName = userData.userFullName;
      userName = userData.userName;
      email = userData.userEmail;
      password = userData.userPassword;

      // Asignar la URL de la imagen a la propiedad imagePreview
      this.imagePreview = photo;
    }

    this.userForm = new FormGroup({

      [`${this.keyPhoto}`]: new FormControl(photo, Validators.required),
      [`${this.keyFullName}`]: new FormControl(fullName, Validators.required),
      [`${this.keyUserName}`]: new FormControl(userName, Validators.required),
      [`${this.keyEmail}`]: new FormControl(email, [Validators.required, Validators.email]),
      [`${this.keyPassword}`]: new FormControl(password, [Validators.required, Validators.minLength(6)])
    });
  }

  private updateUser(user: Users) {
    this.registerService.updateUser(user).subscribe(data => {
      console.log(data);
      if (data.statusCode === StatusCode.Success) {
        this.alertService.showSuccessAlert('Usuario Actualizado Exitosamente', 'Usuario actualizado con éxito')
          .then(() => {
            this.registerService.setUserData(user);
            this.router.navigate(['/contac']);
          });
      }
    });
  }

  private createUser(user: Users) {
    this.registerService.signup(user).subscribe({
      next: resData => {
        console.log(resData);
        const statusCode = resData.statusCode;
        const message = resData.friendlyMessage[0];
        if (statusCode === StatusCode.Success) {
          this.alertService.showSuccessAlert(message, 'success')
            .then(() => {
              this.router.navigate(['/login'], { queryParams: { message } });
            });
        } 
      }
    });
  }

}
