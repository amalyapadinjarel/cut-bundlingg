import { Component, OnInit } from '@angular/core';
import { UserProfileSharedService } from '../../_service/user-profile-shared.service';
import { User } from 'app/shared/models';
import { UserService } from 'app/shared/services';
import { UserProfileService } from '../../_service/user-profile.service';
import { AlertUtilities } from 'app/shared/utils';
import { PersonnelNumLOVConfig, CountryCodeLOVConfig } from '../../../../../user/src/app/models/lov-config';

@Component({
  selector: 'general-card',
  templateUrl: './general-card.component.html',
  styleUrls: ['./general-card.component.scss']
})
export class GeneralCardComponent implements OnInit {
  currentUserId: string;
	currentUser: User;
  loading=true;
  disabled:any={};

  
  constructor(
    public _shared:UserProfileSharedService,
    private userService:UserService,
    private _service:UserProfileService,
    private alertUtils:AlertUtilities
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
		this._shared.id = this.currentUser.userId;
		this.loadData();
  }
  openSignatureUploader(){

  }
  
  loadData() {
		this.setLoading(true);
		this._service.fetchFormData(this._shared.id).then((data: any) => {
			this._shared.setFormHeader(data);
			this.setLoading(false);
		}, err => {
			this.setLoading(false);
			if (err) {
				this.alertUtils.showAlerts(err, true);
			}
		});
	}
  

  setLoading(flag) {
		this.loading = flag;
		this._shared.loading = flag;
		this._shared.headerLoading = flag;
	}
	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
	}

}
