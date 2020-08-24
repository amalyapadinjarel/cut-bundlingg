import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { UserSharedService } from './user-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { HttpParams } from '@angular/common/http';


@Injectable(
  // {  providedIn: 'root'}
)
export class UserAppService {


  public apiSubscription: Subscription;
  public subs: SubSink;

  constructor(
    private apiService: ApiService,
    private _shared: UserSharedService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    public router: Router 

  ) { }

  //method to fetch user list from backend
  fetchListData() {
    return new Promise((resolve, reject) => {
      this.apiService.get("/" + this._shared.apiBase)
        .subscribe(data => {
          if (data.count > 0) {
            resolve(data.users);
          }
          else reject();
        }
          , err => reject(err))
    }).catch((err) => {
      console.log("Exception caught on fetching List Data");
    });
  }

  //method to fetch form data
  fetchFormData(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.id)
          .subscribe(data => {
            if (data.user) {
              resolve(new User(data.user));

            }
            else
              reject();
          }, err => reject(err));
      }
      else {
        resolve({});
      }
    });
  }

  //method to save the form data in cache and load the data
  //save(id?: number): Promise<any> {
  save(exit): Promise<any> {
    this._shared.loading = true;
    let isCreate = this._shared.id == 0;
    return new Promise((resolve, reject) => {
      this.saveData(this._shared.id)
        .then(res => {
          this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
          this._shared.loading = false;
          this._shared.listData = null; //to refresh list

          if (isCreate) {
            this.router.navigateByUrl('/user/' + this._shared.id + (exit ? '' : '/edit'))

          }
          else {
            if (exit)
              this.router.navigateByUrl('/user/' + this._shared.id);
            this._shared.refreshData.next(true);
          }
          resolve(true);
        }, err => {
          console.log(err)
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

      //Checking if inputs are valid in header
      let inputs = this.inputService.getInput(this._shared.headerPath);
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
            inputs = this.inputService.getInput(this._shared[key + 'Path']);
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
        let saveData = this._cache.getCachedValue(this._shared.appPath);
        if (saveData) {

          // console.log("savedata=", saveData)

          this._shared.lineKeys.forEach(key => {
            if (!saveData[key]) {
              saveData[key] = [];
            }


          });
          let observable;
          if (id == 0) {
            observable = this.apiService.post('/user-app', saveData)
          } else {
            observable = this.apiService.put('/user-app/' + id, saveData)
          }
          observable
            .catch(err => {
              reject(err);
              // return err;
            })
            .subscribe(res => {
              if (res && res.success) {
                this._shared.id = res.data && res.data.userId ? res.data.userId : this._shared.id;
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

  //method to fetchLinesData
  fetchLinesData(key, id?) {
    switch (key) {
      case 'userRoles':
        return this.fetchUserRoles(id);
      case 'userOrgAccess':
        return this.fetchUserOrgAccess(id);
      case 'rolesOrgAccess':
        return this.fetchRolesOrgAccess(id);
      case 'effectiveOrgAccess':
        return this.fetchEffectiveOrgAccess(id);
      default:
        break;
    }
  }


  loadData(key):Promise<any> {
    return new Promise((resolve, reject) => {
    this._shared[key + 'Loading'] = true;
    this._shared.setLines(key, []);

    if (this._shared.id == 0) {
      let data = this._shared.setLinesFromCache(key, []);
      this._shared.formData[key] = data;
      this._shared[key + 'Loading'] = false;
      this._shared.refreshLines(key);

      resolve(true);

    } else {
      this.fetchLinesData(key).then((data: any) => {
        this._shared.setLines(key, data);
        data = this._shared.setLinesFromCache(key, data);
        this._shared.formData[key] = data;
        this._shared.refreshLines(key);
        this._shared[key + 'Loading'] = false;

        resolve(true);

      }, err => {
        this._shared.refreshLines(key);
        this._shared[key + 'Loading'] = false;
        if (err)
          this.alertUtils.showAlerts(err.message, true);

          reject(err);
      });
    }
  }).catch(err => {
    console.log("Error on load data", err);

  });
  }

  //method to fetch user Roles
  fetchUserRoles(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/roles/' + this._shared.id)
          .subscribe(data => {
            if (data.userRoles) {
              resolve(data.userRoles);
            }
            else
              reject();
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }


  //method to fetch user org access
  fetchUserOrgAccess(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/orgAccess/' + this._shared.id)
          .subscribe(data => {
            if (data.userOrgAccess) {
              resolve(data.userOrgAccess);
            }
            else reject();
            //  resolve([]);
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }


  //method to fetch  org access from roles
  fetchRolesOrgAccess(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/orgAccessFromRoles/' + this._shared.id)
          .subscribe(data => {
            if (data.orgAccessInheritedFromRoles) {
              resolve(data.orgAccessInheritedFromRoles);
            }
            else reject();
            //  resolve([]);
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }

  //method to fetch  effective org acccess
  fetchEffectiveOrgAccess(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/effectiveOrgAccess/' + this._shared.id)
          .subscribe(data => {
            if (data.effectiveOrgAccess) {
              resolve(data.effectiveOrgAccess);
            }
            else reject();
            //  resolve([]);
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    });
  }

  //method to delete lines
  deleteDetailsLine(key: string, index: any, model: any) {
    let attrValId, userRoles, roles, userOrgAccess, roleId;

    switch (key) {
      case 'userRoles': {
        this._shared.deleteLine(key, index); // for deleting from cache
        break;
      }
      case 'userOrgAccess':
        this._shared.deleteLine(key, index);
        break;
      default:
        this._shared.deleteLine(key, index);
        break;
    }
  }




  //Method to check for duplicate user name
  duplicateUserNameCheck(tmp) {
    return new Promise((resolve, reject) => {
      this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + tmp)
        .catch(err => {
          reject(err);
          return err;

        })
        .subscribe(data => {
          if (data.duplicate == true) {
            this.alertUtils.showAlerts('Duplicate user name -' + tmp + ' !');
            resolve(true);
          } else resolve(false);
        })
    })
  }

  //method to check for duplicate personnel Num
  duplicatePersonnelCheck(val) {
    let personId = val.personId;

    return new Promise((resolve, reject) => {
      this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicatePersonCheck/' + personId)
        .catch(err => {
          reject(err);
          return err;

        })
        .subscribe(data => {
          if (data.duplicatePerson == true) {
            this.alertUtils.showAlerts('Personnel num -' + val.personnelNum + ' already exists!');
            resolve(true);
          }
          else resolve(false);
        })
    })
  }

  unlock(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.put('/' + this._shared.apiBase + '/unlockPassword/' + this._shared.id)
        .catch(err => {
          reject(err);
          return err;

        })
        .subscribe(data => {
          if (data) {
            this._shared.refreshHeaderData.next(true);
            this._shared.listData = null;
            this._shared.params = null;
            resolve(true);
          }
          else {
            resolve(false);
          }
        })
    })
  }

  //Method to copy User
  copyUser() {
    let defaultMsg = "Unknown Error. Failed to copy role.";
    let params: HttpParams = new HttpParams();
    params = params.set('userName', this._shared.getHeaderAttributeValue('userName')) //???

    return new Promise((resolve, reject) => {
      this.apiService.get('/' + this._shared.apiBase + '/copyUser/' + this._shared.id, params)
        .subscribe(data => {
          if (data) {
            resolve(data);
          }
          reject(defaultMsg);
        }, err => reject(defaultMsg));
    });
  }

}
