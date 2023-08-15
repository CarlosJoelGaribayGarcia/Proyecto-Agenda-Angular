import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Contac } from '../../models/contac.model';

@Component({
  selector: 'app-contac-item',
  templateUrl: './contac-item.component.html',
  styleUrls: ['./contac-item.component.scss']
})
export class ContacItemComponent implements OnInit {
  @Input() contacto: Contac;
  @Input() index: number;
  @Output() contactSelected = new EventEmitter<Contac>();
  @Output() contactDeleted = new EventEmitter<number>();

  ngOnInit(): void {
  }

  // onSelectContact() {
  //   this.contactSelected.emit(this.contacto);
  // }

  onDeleteContact(index: number) {
    this.contactDeleted.emit(index);
  }


}

