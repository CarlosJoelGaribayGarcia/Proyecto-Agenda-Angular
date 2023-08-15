import { Component, EventEmitter, OnInit} from '@angular/core';
import { Contac } from '../../models/contac.model';
import { ContacService } from '../../services/contac.service';

@Component({
  selector: 'app-contac',
  templateUrl: './contac.component.html',
  styleUrls: ['./contac.component.scss'],
  providers: [ContacService]
})
export class ContacComponent implements OnInit {
  selectedContacto: Contac;


  constructor (private contactService: ContacService){}

  ngOnInit() {
    this.contactService.contactoSelected
    .subscribe(
      (contact: Contac) => {
        this.selectedContacto = contact;
      });
  }

}
