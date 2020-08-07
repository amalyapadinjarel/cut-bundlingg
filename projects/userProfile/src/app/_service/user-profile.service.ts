import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { UserProfileSharedService } from './user-profile-shared.service';
import { UserProfile } from '../models/user-profile';
import { AuthService } from '../../../../authentication/src/app/_services/auth.service';

@Injectable(
  // {  providedIn: 'root'}
)
export class UserProfileService {
 

  public apiSubscription: Subscription;
  public subs: SubSink;

  constructor(
    private apiService: ApiService,
    private _shared: UserProfileSharedService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    public router: Router
  ) { }

  changePassword(formData: any) {
    return this.apiService.put('/userProfile/changePassword/' + formData.userId, { user: formData });
  }

  saveProfile(formData: any) {
    return this.apiService.put('/userProfile/editProfile/' + formData.userId, { header: formData });
  }
  //method to fetch form data
  fetchFormData(id?: number) {
    return new Promise((resolve, reject) => {
      this.apiService.get('/user-app/' + this._shared.id)
        .subscribe(data => {
          if (data.user) {
            resolve(new UserProfile(data.user));
          }
          else
            reject();
        }, err => reject(err));


    });
  }

  //method to save the form data in cache and load the data
  save(exit): Promise<any> {
    console.log("inside save() in service")
    this._shared.loading = true;
    return new Promise((resolve, reject) => {
      this.saveData(this._shared.id)
        .then(res => {
          this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
          this._shared.loading = false;
          this._shared.refreshData.next(true);
          resolve(true);
        }, err => {
          if (err) {
            this.alertUtils.showAlerts('Failed to edit document.', err);
          }
          this._shared.loading = false;
          resolve(false);
        })
    });

  }


  //method to save data from cache to the backend by calling post or put
  saveData(id): Promise<any> {
    console.log("Inside saveData")
    return new Promise((resolve, reject) => {
      let inValid;

      //Checking if inputs are valid in header
      let inputs = this.inputService.getInput(this._shared.headerPath);
      if (inputs) {
        inValid = Object.keys(inputs).some(key => {
          if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
            return true;
          }
        });
      }

      if (inValid) {
        reject('Please fill mandatory fields.');
      } else {
        let saveData = this._cache.getCachedValue(this._shared.appPath);
        if (saveData) {
          // console.log("savedata=", saveData)
          let observable;
          observable = this.apiService.put('/userProfile/' + id, saveData)
          observable
            .catch(err => {
              reject(err);
              // return err;
            })
            .subscribe(res => {
              if (res && res.success) {
                // this._shared.id = res.data && res.data.userId ? res.data.userId : this._shared.id;
                this.alertUtils.showAlerts(res.message);
                resolve(res);

              } else {
                reject(res && res.message ? res.message : 'Unknown error');
              }
            })
        } else {
          reject('No changes detected');
        }
      }
    });

  }




}
