import { Component, Input, OnInit } from '@angular/core';
import { Contac } from '../../models/contac.model';
import { ActivatedRoute, Params, Route, Router, UrlTree } from '@angular/router';
import { ContacService } from '../../services/contac.service';
import { DataStorageService } from '../shared/data-storage.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-contac-details',
  templateUrl: './contac-details.component.html',
  styleUrls: ['./contac-details.component.scss']
})
export class ContacDetailsComponent implements OnInit {
  @Input() contacto: Contac;

  id: number;

  constructor(private contacService: ContacService,
              private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];

      //   const selectedContact = this.localStorageService.getItem('selectedContact');
      //   if (selectedContact && selectedContact.contactId === this.id) {
      //     this.contacto = selectedContact;
      //     console.log(this.contacto);
      // }
      this.contacto = this.localStorageService.getItem('selectedContact');
    }
      );

  }

  onEditContac() {
    this.router.navigate(['contac', 'list', this.id, 'edit']);

  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
