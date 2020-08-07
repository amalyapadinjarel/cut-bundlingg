import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmbeddedURLSharedService } from './embedded-URL-shared.service';
import { EmbeddedURL } from '../models/embedded-url';
import { ConfirmPopupComponent } from 'app/shared/component';

@Injectable({
  providedIn: 'root'
})
export class EmbeddedURLService {

  apiSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private _shared: EmbeddedURLSharedService,
    public _inputService: TnzInputService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public router: Router,
    private _dialog: MatDialog
    // ,
    // private location: Location

  ) {
  }


  fetchListData() {
    return new Promise((resolve, reject) => {
      this.apiService.get('/' + this._shared.apiBase)
        .subscribe(data => {
          if (data.count > 0) {
            resolve(data.embeddedURL);

          }
          else
            reject();
        }, err => reject(err));
    });
  }

  //Method for form view header

  fetchFormData(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id && this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.id)
          .subscribe(data => {
            if (data.embeddedURLAccess) {
              resolve(new EmbeddedURL(data.embeddedURLAccess));
            }
            else {
              reject();
            }
          }, err => reject(err));
      }
      else {
        resolve({});
      }
    }).catch((err) => {
      console.log('Caught Exception in Fetchformdata!');
    });
  }

  //Method for form view lines--LookupValue

  fetchEmbeddedURLUsers(id?: string) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {

        this.apiService.get('/' + this._shared.apiBase + '/users/' + this._shared.id)
          .subscribe(data => {
            if (data.embeddedURLUsers) {
              resolve(data.embeddedURLUsers);
            }
            else {
              reject();

            }
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }

  fetchLinesData(key, id?) {
    switch (key) {
      case 'embeddedURLUsers':
        return this.fetchEmbeddedURLUsers(id);
      default:
        break;
    }
  }

  loadData(key) {
    this._shared[key + 'Loading'] = true;
    this._shared.setLines(key, []);

    if (this._shared.id == 0) {

      let data = this._shared.setLinesFromCache(key, [])
      this._shared.formData[key] = data;
      this._shared[key + 'Loading'] = false;
      this._shared.refreshLines(key);
    } else {

      this.fetchLinesData(key).then((data: any) => {
        this._shared.setLines(key, data);
        data = this._shared.setLinesFromCache(key, data)
        this._shared.formData[key] = data;
        this._shared.refreshLines(key);
        this._shared[key + 'Loading'] = false;
      }, err => {
        this._shared.refreshLines(key);
        this._shared[key + 'Loading'] = false;
        if (err)
          this.alertUtils.showAlerts(err.message, true)
      });
    }
  }

  save(exit): Promise<any> {
    this._shared.loading = true;
    let isCreate = this._shared.id == 0;
    return new Promise((resolve, reject) => {
      this.saveData(this._shared.id)

        .then(res => {
          this._inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
          this._shared.loading = false;
          this._shared.listData = null; //to refresh list

          this.router.navigateByUrl('/embeddedURL/' + this._shared.id + (exit ? '' : '/edit'));
          this._shared.refreshData.next(true);
          resolve(true);
        }, err => {
          if (err) {
            this.alertUtils.showAlerts('Failed to ' + ((this._shared.id == 0 ? 'save' : 'edit') + ' document. ') + err);
          }
          this._shared.loading = false;
          resolve(false);
        }).catch((err) => {
          console.log('Caught Exception on saving data!');
        })
    });

  }

  saveData(id): Promise<any> {

    return new Promise((resolve, reject) => {
      let inValid;

      //Checking if inputs are valid in header
      let inputs = this._inputService.getInput(this._shared.headerPath);
      if (inputs) {
        inValid = Object.keys(inputs).some(key => {
          if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
            return true;
          }
        });
      }
      // Checking if inputs are valid in lines
      if (!inValid) {
        this._shared.lineKeys.forEach(key => {
          if (!inValid) {
            inputs = this._inputService.getInput(this._shared[key + 'Path']);
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
          }
        });
      }
      if (inValid) {
        reject('Please fill mandatory fields.');
      } else {
        let saveData = this._inputService.getCache(this._shared.appPath);
        // console.log("saveData=", saveData)
        if (saveData) {
          this._shared.lineKeys.forEach(key => {

            if (!saveData[key]) {
              saveData[key] = [];
            }
            //to check
            let removedPath = this._shared[key + 'RemovedKeysPath'];
            let linePrimaryKey = this._shared[key + 'PrimaryKey']

            let cache = this._cache.getCachedValue(removedPath)

            if (cache && cache.length) {
              cache.forEach(removedPrimaryKey => {
                let json = { 'active': 'D' };
                json[linePrimaryKey] = removedPrimaryKey;
                saveData[key].push(json)
              });
            }

          });
          let observable;
          if (id == 0) {
            observable = this.apiService.post('/embeddedURL', saveData)
          } else {
            observable = this.apiService.put('/embeddedURL/' + id, saveData)
          }

          observable
            .catch(err => {
              reject(err);
            })
            .subscribe(res => {
              if (res && res.success) {
                this._shared.id = res.data && res.data.urlId ? res.data.urlId : 0;
                // console.log("res=", res)
                resolve(res)
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

  deleteLines(key) {
    if (this._shared.selectedLines[key] && this._shared.selectedLines[key].length) {
      let primaryKey = this[key + 'PrimaryKey'];
      let dialogRef = this._dialog.open(ConfirmPopupComponent);
      dialogRef.componentInstance.dialogTitle = 'Remove URL Access?';
      dialogRef.componentInstance.confirmText ='REMOVE';
      dialogRef.componentInstance.message = 'Are you sure you want to remove URL Access for the selected ' + this._shared.selectedLines[key].length + ' record(s)?'
      dialogRef.afterClosed().subscribe(flag => {
        if (flag) {
          this._shared.selectedLines[key].forEach(line => {
            let index = this._shared.formData[key].findIndex(data => {
              let model = this._shared.getLineModel(key, data)
              return model.equals(line)
            });
            this._shared.deleteLine(key, index);
          });
          this._shared.setSelectedLines(key, [])
        }
      })
    }
  }


  deleteSingleLine(key, index) {
    let primaryKey = 'embedId';
    let dialogRef = this._dialog.open(ConfirmPopupComponent);
    dialogRef.componentInstance.dialogTitle = 'Remove URL Access?';
    dialogRef.componentInstance.confirmText ='REMOVE';
    dialogRef.componentInstance.message = 'Are you sure you want to remove the URL access?';
    dialogRef.afterClosed().subscribe(flag => {
      if (flag) this._shared.deleteLine(key, index);
    })
  }


    getAlreadyDefaultedURLtitle(userId, taskflowId, location) {
      return new Promise((resolve, reject) => {

        this.apiService.get("/" + this._shared.apiBase + '/users/defaultCheck?userId=' + userId + '&taskflowId=' + taskflowId + '&location=' + location)
          .subscribe(data => {
            if (data.defaultedURLTitle) {
              resolve(data.defaultedURLTitle);
            }
          }), err => reject(err)

      }
      );
    }


}
