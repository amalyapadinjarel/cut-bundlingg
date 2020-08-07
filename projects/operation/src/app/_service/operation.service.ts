import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { OperationSharedService } from './operation-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Operation } from '../models/operations.model';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';

@Injectable(
  // {  providedIn: 'root'}
)
export class OperationService {

  public apiSubscription: Subscription;
  public subs: SubSink;

  constructor(
    private apiService: ApiService,
    private _shared: OperationSharedService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    public router: Router

  ) { }

  //method to save the form data in cache and load the data
  //save(id?: number): Promise<any> {
  save(exit): Promise<any> {
    this._shared.loading = true;
    let isCreate = this._shared.id == 0;
    return new Promise((resolve, reject) => {
      this.saveData(this._shared.id)
        .then(res => {

           this.inputService.resetInputCache(this._shared.appPath);
          this._shared.loading = false;
          this._shared.listData = null; //to refresh list
          this._shared.refreshData.next(true);
          resolve(true);
          this.alertUtils.showAlerts(res)
        }, err => {
          if (err) {
            this.alertUtils.showAlerts('Failed to ' + ((isCreate ? 'save' : 'edit') + ' document. ') + err);
          }
          this._shared.loading = false;
          resolve(false);
        })
    });

  }

  //method to save data from cache to the backend by calling post or put
  saveData(id): Promise<any> {
    return new Promise((resolve, reject) => {
      let inValid;
      this._shared.lineKeys.forEach(key => {
        let inputs = this.inputService.getInput(this._shared[key + 'Path']);
        if (inputs) {
          inValid = inputs.some(grp => {
            if (grp) {
              return Object.keys(grp).some(key => {
                if (grp[key] && grp[key].status != 'ok' && grp[key].status != 'changed') {
                  return true;
                }
              });
            }
          });
        }

      });
      if (inValid) {
        reject('Please fill mandatory fields.');
      } else {

        let saveData= this.inputService.getCache(this._shared.appPath)['operations'];
        // console.log("saveData=", saveData)

        if (saveData) {
          // this._shared.lineKeys.forEach(key => {
          //   if (!saveData[key]) saveData[key] = [];

          // });
          let observable;
          observable = this.apiService.post('/operations', saveData)
          observable
            .catch(err => {
              reject(err);
            })
            .subscribe(res => {
              if (res && res.success) {
                //this._shared.id = res.data && res.data.opId ? res.data.opId : this._shared.id;
                resolve(res&& res.message)
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


  //Method to check for duplicate operation code
  duplicateOperationCodeCheck(tmp) {
    return new Promise((resolve, reject) => {
      this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + tmp)
        .catch(err => {
          reject(err);
          return err;

        })
        .subscribe(data => {
          if (data.duplicate == true) {
            this.alertUtils.showAlerts('Duplicate operation code -' + tmp + ' !');
            resolve(true);
          } else resolve(false);
        })
    })
  }

}
