import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent {

  public dialogTitle = 'Delete record?';
  public message = 'This record will disappear permanently.';
  public description = '';
  public confirmText = 'DELETE';
  public cancelText = 'CANCEL';
  public value='';
  constructor(private dialogRef: MatDialogRef<ConfirmPopupComponent>) { }

  close(isCancel: boolean) {
    this.dialogRef.close(isCancel);
  }
}
