import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Contac } from '../../models/contac.model';
import { ContacService } from '../../services/contac.service';
import { AlertService } from 'src/app/services/alert.service';
import { StatusCode } from 'src/app/enums/status-code.enum';
import { PhoneComponent } from '../../components/phone/phone.component';
import { MovilComponent } from '../../components/movil/movil.component';
import { WhatsappComponent } from '../../components/whatsapp/whatsapp.component';
import { MatDialog } from '@angular/material/dialog';
import { TagsDialogComponent } from '../../components/tags/tagsDialog.component';


@Component({
  selector: 'app-contac-edit',
  templateUrl: './contac-edit.component.html',
  styleUrls: ['./contac-edit.component.scss']
})
export class ContacEditComponent implements OnInit {
    id: number;
    editMode = false;
    contactForm: FormGroup;
    imagePreview: string;
    keyId = 'id';
    keyName = 'name';
    keyLastName = 'lastName';
    keyCompany = 'company';
    keyBirthday = 'birthday';
    keyNotes = 'notes';
    keyAlias = 'alias';
    keyPhoto = 'photo';
    keyEmails = 'emails';
    keyTags = 'tags';
    keyPhones = 'phones';

    private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    @ViewChild('phoneContainer', { read: ViewContainerRef }) phoneContainer!: ViewContainerRef;
    @ViewChild('movilContainer', { read: ViewContainerRef }) movilContainer!: ViewContainerRef;
    @ViewChild('whatsappContainer', { read: ViewContainerRef }) whatsappContainer!: ViewContainerRef;

    private dynamicComponentRef: ComponentRef<PhoneComponent | MovilComponent | WhatsappComponent>;


    // showTagsDialog: boolean = false;
    // newTag: string = '';
    tags: string[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private localStorageService: LocalStorageService,
              private contacService: ContacService,
              private alertService: AlertService,
              private resolver: ComponentFactoryResolver,
              private dialog: MatDialog){


  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      console.log(this.editMode);

      this.initForm();

    })
  }


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.imagePreview = result;
        const base64Image = result.split(',')[1];
        this.contactForm.patchValue({ photo: base64Image });
      }
    };
    reader.readAsDataURL(file);
  }


  onSubmit() {

    const contact: Contac = {
      contactId: this.contactForm.value.id,
      contactFirstName: this.contactForm.value.name,
      contactLastName: this.contactForm.value.lastName,
      contactCompany: this.contactForm.value.company,
      contactBirthday: this.contactForm.value.birthday,
      contactNotes: this.contactForm.value.notes,
      contactAlias: this.contactForm.value.alias,
      contactPhoto: this.contactForm.value.photo,
      contactEmails: this.contactForm.value.emails,
      contactTags: this.contactForm.value.tags,
      contactPhones: this.contactForm.value.phones
    }

    if (this.editMode) {

      this.updateContact(contact);
    } else {

      this.createContact(contact);
    }
  }


  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }


  //Inicializo el formulario
  private initForm() {

    const selectedContact = this.localStorageService.getItem('selectedContact');
    console.log(selectedContact);

    let contacId = '';
    let contacFirstName = '';
    let contacLastName = '';
    let contacCompany= '';
    let contacBirthday = '';
    let contacNotes = '';
    let contacAlias = '';
    let contacPhoto = '';
    let contacEmails = [];
    let contacTags = [];
    let contacPhones = [];

      if (this.editMode){
      contacId = selectedContact.contactId;
      contacFirstName = selectedContact.contactFirstName;
      contacLastName = selectedContact.contactLastName;
      contacCompany = selectedContact.contactCompany;
      contacBirthday = selectedContact.contactBirthday;
      contacNotes = selectedContact.contactNotes;
      contacAlias = selectedContact.contactAlias;
      contacPhoto = selectedContact.contactPhoto;
      contacEmails = selectedContact.contactEmails;
      contacTags = selectedContact.contactTags;
      contacPhones = selectedContact.contactPhones;

      this.imagePreview = contacPhoto;
    }

    this.contactForm = new FormGroup({
      [`${this.keyId}`]: new FormControl(contacId, Validators.required),
      [`${this.keyName}`]: new FormControl(contacFirstName, Validators.required),
      [`${this.keyLastName}`]: new FormControl(contacLastName, Validators.required),
      [`${this.keyCompany}`]: new FormControl(contacCompany, Validators.required),
      [`${this.keyBirthday}`]: new FormControl(contacBirthday, Validators.required),
      [`${this.keyNotes}`]: new FormControl(contacNotes, Validators.required),
      [`${this.keyAlias}`]: new FormControl(contacAlias, Validators.required),
      [`${this.keyPhoto}`]: new FormControl(contacPhoto, Validators.required),
      [`${this.keyEmails}`]: new FormArray([]),
      [`${this.keyTags}`]: new FormArray([]),
      [`${this.keyPhones}`]: new FormArray([])
    });

    if (contacEmails.length > 0) {
      const emailControls = contacEmails.map((email: any) =>
        new FormGroup({
          emailId: new FormControl(email.emailId),
          emailValue: new FormControl(email.emailValue, [Validators.required, Validators.pattern(this.emailRegex)]),
          editing: new FormControl(false),
        })
      );
      const emailsArray = this.contactForm.get(this.keyEmails) as FormArray;
      emailControls.forEach((control) => emailsArray.push(control));
    }

    if (contacTags.length > 0) {
      const tagControls = contacTags.map((tag: any) =>
        new FormGroup({
          tagId: new FormControl(tag.tagId),
          tagValue: new FormControl(tag.tagValue)
        })
      );
      const tagsArray = this.contactForm.get(this.keyTags) as FormArray;
      tagControls.forEach((control) => tagsArray.push(control));
    }

    // if (contacTags.length > 0) {
    //   const tagControls = this.contactForm.get(this.keyTags) as FormArray;
    //   contacTags.forEach((tag: any) => {
    //     tagControls.push(
    //       new FormGroup({
    //         tagId: new FormControl(tag.tagId),
    //         tagValue: new FormControl(tag.tagValue)
    //       })
    //     );
    //   });
    // }

    if (contacPhones.length > 0) {
      const phonesArray = this.contactForm.get(this.keyPhones) as FormArray;
      contacPhones.forEach((phone: any) => {
        phonesArray.push(
          new FormGroup({
            phoneType: new FormControl(phone.phoneType, Validators.required),
            phoneValue: new FormControl(phone.phoneValue, Validators.required)
          })
        );
      });
    }
  }

  private updateContact(contact: Contac) {
    this.dataStorageService.updateContacts(contact, this.id).subscribe({
      next: resData => {
        console.log(resData);
        const message = resData.friendlyMessage[0];
        if (resData.statusCode === StatusCode.Success) {
          this.alertService.showSuccessAlert(message, 'success')
            .then(() => {
              this.localStorageService.setItem('selectedContact', contact);
              this.onCancel();
            });
        }
      }
    });
  }

  private createContact(contact: Contac) {
    this.dataStorageService.createContacts(contact).subscribe({
      next: resData => {
        console.log(resData);
        const message = resData.friendlyMessage[0];
        if (resData.statusCode === StatusCode.Success) {
          this.alertService.showSuccessAlert(message, 'success')
            .then(() => {
              this.contacService.addContact(contact);
              console.log(this.contacService.getContacto());
              this.router.navigate(['/contac'], { queryParams: { message } });
            });
        }
      }
    });
  }

  onAddEmail() {
    const emailsArray = this.contactForm.get(this.keyEmails) as FormArray;
    emailsArray.push(
      new FormGroup({
        emailId: new FormControl(null),
        emailValue: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
        editing: new FormControl(true)
      })
    );
  }
  onDeleteEmail(index: number) {
    const emailsArray = this.contactForm.get(this.keyEmails) as FormArray;
    emailsArray.removeAt(index);
  }


  getEmailsControls(): AbstractControl[] {
    const emailsArray = this.contactForm.get(this.keyEmails) as FormArray;
    return emailsArray.controls;
  }

  onEditEmail(emailGroup: FormGroup) {
    emailGroup.controls.editing.setValue(true); // Habilitar la edición del correo
  }

  getPhoneImage(phoneType: string): string {
    switch (phoneType) {
      case 'phone':
        return 'https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-4/128/home2-512.png';
      case 'mobile':
        return 'https://cdn3.iconfinder.com/data/icons/smoothfill-device/30/device_001-smartphone-phone-mobile-cellphone-tel-iphone-128.png';
      case 'whatsapp':
        return 'https://cdn3.iconfinder.com/data/icons/social-media-black-white-2/512/BW_Whatsapp_glyph_svg-128.png';
      default:
        return '';
    }
  }


  addPhone(phoneType: string) {
    const componentFactory = this.getComponentFactory(phoneType);

    if (componentFactory) {
      this.destroyDynamicComponent();
      const componentRef = this.createComponent(componentFactory);
      this.listenToAddPhoneEvent(componentRef.instance);
      this.dynamicComponentRef = componentRef;
    }
  }

  private destroyDynamicComponent() {
    if (this.dynamicComponentRef) {
      // Destroy the previous dynamic component, if it exists.
      this.dynamicComponentRef.destroy();
    }
  }


  private getComponentFactory(phoneType: string): ComponentFactory<PhoneComponent | MovilComponent | WhatsappComponent> | null {
    switch (phoneType) {
      case 'phone':
        return this.resolver.resolveComponentFactory(PhoneComponent);
      case 'mobile':
        return this.resolver.resolveComponentFactory(MovilComponent);
      case 'whatsapp':
        return this.resolver.resolveComponentFactory(WhatsappComponent);
      default:
        return null;
    }
  }

  private createComponent(componentFactory: ComponentFactory<PhoneComponent | MovilComponent | WhatsappComponent>) {
    switch (componentFactory.componentType) {
      case PhoneComponent:
        return this.phoneContainer.createComponent(componentFactory);
      case MovilComponent:
        return this.movilContainer.createComponent(componentFactory);
      case WhatsappComponent:
        return this.whatsappContainer.createComponent(componentFactory);
      default:
        throw new Error('Component factory is not valid.');
    }
  }

  private listenToAddPhoneEvent(componentInstance: PhoneComponent | MovilComponent | WhatsappComponent) {
    componentInstance.addPhoneEvent.subscribe((phoneData: { phoneType: string, phoneValue: string }) => {
      const phonesArray = this.contactForm.get(this.keyPhones) as FormArray;
      phonesArray.push(
        new FormGroup({
          phoneType: new FormControl(phoneData.phoneType, Validators.required),
          phoneValue: new FormControl(phoneData.phoneValue, Validators.required)
        })
      );
    });
  }

  onDeletePhone(index: number) {
    const phonesArray = this.contactForm.get(this.keyPhones) as FormArray;
    phonesArray.removeAt(index);
  }

  onEditPhone(phone: any, index: number) {
    this.onDeletePhone(index);

    const phoneType = phone.phoneType;
    const componentFactory = this.getComponentFactory(phoneType);

    if (componentFactory) {
      // Destruir el componente dinámico existente antes de insertar uno nuevo
      this.destroyDynamicComponent();

      // Mostrar el componente dinámico correspondiente y ocultar los demás
      this.phoneContainer?.clear();
      this.movilContainer?.clear();
      this.whatsappContainer?.clear();

      const componentRef = this.createComponent(componentFactory);
      switch (phoneType) {
        case 'phone':
          const phoneForm = componentRef.instance.phoneForm;
          phoneForm.patchValue({
            telefono: phone.phoneValue.slice(0, 7)
          });
          this.phoneContainer?.insert(componentRef.hostView);
          break;

        case 'mobile':
          const movilForm = componentRef.instance.phoneForm;
          movilForm.patchValue({
            lada: phone.phoneValue.slice(0, 3),
            telefono: phone.phoneValue.slice(3)
          });
          this.movilContainer?.insert(componentRef.hostView);
          break;

        case 'whatsapp':
          const whatsappForm = componentRef.instance.phoneForm;
          whatsappForm.patchValue({
            clavePais: phone.phoneValue.slice(0, 3),
            lada: phone.phoneValue.slice(3, 6),
            telefono: phone.phoneValue.slice(6)
          });
          this.whatsappContainer?.insert(componentRef.hostView);
          break;
      }
      this.listenToAddPhoneEvent(componentRef.instance);

      this.dynamicComponentRef = componentRef;
    }
  }

  onAddTag() {
    const tagsArray = this.contactForm.get(this.keyTags) as FormArray;
    tagsArray.push(
      new FormGroup({
        tagId: new FormControl(null),
        tagValue: new FormControl('', [Validators.required])
      })
    );
  }

  onDeleteTag(index: number) {
    const tagsArray = this.contactForm.get(this.keyTags) as FormArray;
    tagsArray.removeAt(index);
  }

  // getTagsControls(): AbstractControl[] {
  //   const tagsArray = this.contactForm.get(this.keyTags) as FormArray;
  //   return tagsArray.controls;
  // }

  openTagDialog() {
    const storedTags = this.localStorageService.getItem('tags');
    this.tags = storedTags;
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '400px',
      data: { tags: this.tags || [] },
    });


    dialogRef.afterClosed().subscribe((selectedTags: any[]) => {
      // Verificar si se seleccionaron etiquetas y agregarlas al formulario
      if (selectedTags) {
        const tagsArray = this.contactForm.get(this.keyTags) as FormArray;
        const existingTags = tagsArray.controls.map((control: AbstractControl) => control.value.tagValue);
        selectedTags.forEach((tag) => {
          if (!existingTags.includes(tag.tagValue)) {
            tagsArray.push(
              new FormGroup({
                tagId: new FormControl(tag.tagId),
                tagValue: new FormControl(tag.tagValue)
              })
            );
          }
        });
      }
    });
  }

}

