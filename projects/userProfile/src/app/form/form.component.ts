import { Component, OnInit } from '@angular/core';
import { UserProfileSharedService } from '../_service/user-profile-shared.service';
import { DateUtilities } from 'app/shared/utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  // styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }

})
export class FormComponent implements OnInit {

  constructor(
    public _shared:UserProfileSharedService,
    public dateUtils: DateUtilities
  ) { }

  ngOnInit(): void {
  }

}
