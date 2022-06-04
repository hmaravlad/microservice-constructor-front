import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

export interface ConfirmModel {
  title:string;
  message:string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;

  confirm() {
    this.result = true;
    this.close();
  }
}