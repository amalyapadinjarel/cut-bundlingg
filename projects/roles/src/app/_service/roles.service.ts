import { Injectable, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { RolesSharedService } from './roles-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from '../models/roles';
import { HttpParams } from '@angular/common/http';
import { findIndex } from 'rxjs/operators';

@Injectable(
  // {  providedIn: 'root'}
)
export class RolesService {
  public apiSubscription: Subscription;


  constructor(
    private apiService: ApiService,
    private _shared: RolesSharedService,
    private _cache: LocalCacheService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    public router: Router,
    //private location: Location

  ) { }

  //method to fetch user list from backend
  fetchListData() {
    return new Promise((resolve, reject) => {
      this.apiService.get("/" + this._shared.apiBase)
        .subscribe(data => {
          if (data.count > 0) {
            resolve(data.roles);
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
            if (data.role) {
              resolve(new Roles(data.role));

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
  save(exit): Promise<any> {
    this._shared.loading = true;
    let isCreate = this._shared.id == 0;
    return new Promise((resolve, reject) => {
      this.saveData(this._shared.id)
        .then(res => {
          this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
          this._shared.loading = false;
          if (isCreate) {
            this.router.navigateByUrl('/roles/' + this._shared.id + (exit ? '' : '/edit'))
          }
          else {
            if (exit)
              this.router.navigateByUrl('/roles/' + this._shared.id);
            this._shared.refreshData.next(true);
          }
          this._shared.onNewDocumentCreated(); //to refresh list and params
          resolve(true);
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
                    if (key == "rolesTaskFlowAccess") {
                      grp[key].forEach(element => {
                        if (element.status != 'ok' && element.status != 'changed')
                          return true;
                      });
                    }
                    else if (grp[key] && grp[key].status != 'ok' && grp[key].status != 'changed') {
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


        // let saveData = this._cache.getCachedValue(this._shared.appPath);
        let saveData = this.inputService.getCache(this._shared.appPath);

        // console.log("1--saveData:",saveData)
        // Adding the removedkeys as active - N to remove them
        if (saveData) {
          this._shared.lineKeys.forEach(key => {

            if (!saveData[key]) {
              saveData[key] = [];
            }


          });

          //converting Y ,N to 4 and 0 (isRead,isCreate...)

          saveData['rolesTaskFlowAccess'] = [];

          let flag = false;
          let index;
          if (saveData['rolesAppAccess']) {

            saveData['rolesAppAccess'].forEach((app, i) => {
              if (app != null) {
                if (app.rolesTaskFlowAccess != null) {
                  app.rolesTaskFlowAccess.forEach(element => {
                    if (element) {
                      if (element.isRead == 'Y') element.isRead = 4;
                      else if (element.isRead == 'N') element.isRead = 0;

                      if (element.isCreate == 'Y') element.isCreate = 4;
                      else if (element.isCreate == 'N') element.isCreate = 0;

                      if (element.isEdit == 'Y') element.isEdit = 4;
                      else if (element.isEdit == 'N') element.isEdit = 0;

                      if (element.isDelete == 'Y') element.isDelete = 4;
                      else if (element.isDelete == 'N') element.isDelete = 0;
                      saveData['rolesTaskFlowAccess'].push(element);
                    }
                  });


                }


                if (app.roleAppAssignmentId >= 0) {
                  flag = true;
                  index = i;
                  app.rolesTaskFlowAccess = null;

                } else app = null;
              }
            });
            if (flag == false) saveData['rolesAppAccess'] = [];
          }
          // console.log("2--saveData just before post/put:",saveData)

          let observable;
          if (id == 0) {
            observable = this.apiService.post('/roles', saveData)
          } else {
            observable = this.apiService.put('/roles/' + id, saveData)
          }
          observable
            .catch(err => {
              reject(err);
              // return err;
            })
            .subscribe(res => {
              if (res && res.success) {

                this._shared.id = res.data && res.data.roleId ? res.data.roleId : this._shared.id;
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
      case 'roleUsers':
        return this.fetchRoleUsers(id);
      case 'rolesOrgAccess':
        return this.fetchRolesOrgAccess(id);
      case 'rolesAppAccess':
        return this.fetchRolesAppAccess(id);
      case 'rolesTaskFlowAccess':
        return this.fetchRolesTaskFlowAccess(id);
      default:
        break;
    }
  }


  //method to loadData
  loadData(key): Promise<any> {
    return new Promise((resolve, reject) => {

      this._shared[key + 'Loading'] = true;
      this._shared.setLines(key, []);

      if (this._shared.id == 0 && key != 'rolesAppAccess') {
        if (key != 'rolesTaskFlowAccess')
          this._shared.formData[key] = this._shared.setLinesFromCache(key, []);
        else if (key == 'rolesTaskFlowAccess') {
          this._shared.formData[key] = this._shared.setLinesFromCache('rolesRootTaskFlowAccess', []);
        }
        this._shared[key + 'Loading'] = false;
        this._shared.refreshLines(key);
        resolve(true);

      } else {

        this.fetchLinesData(key).then((data: any) => {
          this._shared.setLines(key, data);
          if (key != 'rolesTaskFlowAccess' && key != 'rolesAppAccess')
            this._shared.formData[key] = this._shared.setLinesFromCache(key, data);
          else if (key == 'rolesTaskFlowAccess'){
            this._shared.formData[key] = this._shared.setLinesFromCache('rolesRootTaskFlowAccess', data);
          }
          this._shared.refreshLines(key);
          this._shared[key + 'Loading'] = false;
          resolve(true);
        }, err => {
          this._shared.refreshLines(key);
          this._shared[key + 'Loading'] = false;
          if (err)
            this.alertUtils.showAlerts(err.message, true);

          reject(err);
        }).catch((err) => {
          console.log("Exception caught on fetching line Data by key on loadData(key)");

          reject(err);
        });
      }
      // }

    }).catch(err => {
      console.log("Error on load data", err)
    });

  }

  //method to fetch user Roles
  fetchRoleUsers(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/users/' + this._shared.id)
          .subscribe(data => {
            if (data.roleUsers) {
              resolve(data.roleUsers);
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


  //method to fetch roles org access
  fetchRolesOrgAccess(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id != 0) {
        this.apiService.get('/' + this._shared.apiBase + '/orgAccess/' + this._shared.id)
          .subscribe(data => {
            if (data.roleOrgAccess) {
              resolve(data.roleOrgAccess);
            }
            else reject();
            //  resolve([]);
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    }).catch((err) => {
      console.log("Exception caught on fetching Roles Org Access", err);
    })
      ;
  }

  //method to fetch roles app access
  fetchRolesAppAccess(id?: number) {
    return new Promise((resolve, reject) => {
      // if (this._shared.id != 0) {
      this.apiService.get('/' + this._shared.apiBase + '/applicationAccess/' + (this._shared.id ? this._shared.id : 0))
        .subscribe(data => {
          if (data.applicationAccess) {
            resolve(data.applicationAccess);
          }
          else
            //reject();
            resolve([]);
        }, err => reject(err));
      //}
      // else {
      //   resolve([]);
      // }
    }).catch((err) => {
      console.log("Exception caught on fetching Roles App Access", err);
    })

  }


  // //method to fetch roles task flow access
  // fetchRolesTaskFlowAccess(id?: number) {
  //   return new Promise((resolve, reject) => {
  //     let params: HttpParams = new HttpParams();
  //     let applicationCode = this._shared.selectedApplicationCode;
  //     params = params.set("applicationCode", applicationCode);

  //     if (this._shared.id != 0) {

  //       this.apiService.get('/' + this._shared.apiBase + '/taskFlowAccess/' + this._shared.id, params)
  //         .subscribe(data => {
  //           if (data.taskFlowAccess) {
  //             resolve(data.taskFlowAccess);
  //           }
  //           else reject();
  //           //  resolve([]);
  //         }, err => reject(err));
  //     }
  //     else {
  //       resolve([]);
  //     }
  //   }).catch((err) => {
  //     console.log("Exception caught on fetching Roles App Access", err);
  //   })

  // }

  //method to fetch all taskflows by role id
  fetchRolesTaskFlowAccess(id?: number) {
    return new Promise((resolve, reject) => {
      // let params: HttpParams = new HttpParams();
      // let applicationCode = this._shared.selectedApplicationCode;
      // params = params.set("applicationCode", applicationCode);

      if (this._shared.id != 0) {

        // this.apiService.get('/' + this._shared.apiBase + '/taskFlowAccess/' + this._shared.id, params)
        this.apiService.get('/' + this._shared.apiBase + '/taskflows/' + this._shared.id)

          .subscribe(data => {
            // console.log(data)
            if (data.taskFlowAccess) {
              resolve(data.taskFlowAccess);
            }
            else reject();
            //  resolve([]);
          }, err => reject(err));
      }
      else {
        resolve([]);
      }
    }).catch((err) => {
      console.log("Exception caught on fetching Roles App Access", err);
    })

  }

  //method to delete lines
  deleteDetailsLine(key: string, index: any, model: any) {
    this._shared.deleteLine(key, index);
  }

  //Method to check for duplicate role code
  duplicateRoleCodeCheck(tmp) {
    return new Promise((resolve, reject) => {
      this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + tmp)
        .catch(err => {
          reject(err);
          return err;

        })
        .subscribe(data => {
          if (data.duplicateRole == true) {
            this.alertUtils.showAlerts('Duplicate role code -' + tmp + ' !');
            resolve(true);
          } else resolve(false);
        })
    }).catch(err => {
      console.log("Caught exception on duplicate role code check!")
    })
  }


  //Method to get all taskflows
  getAllTaskFlow() {
    let defaultMsg = "Unknown Error. Failed to fetch taskflows.";
    return new Promise((resolve, reject) => {
      this.apiService.get('/' + this._shared.apiBase + '/taskflows/' + this._shared.id)
        .subscribe(data => {
          if (data) {
            resolve(data);
          }
          reject(defaultMsg);
        }, err => reject(defaultMsg));
    });
  }

  //----document type reference--------------
  fetchOrgAccessDetail(id?: number) {
    return new Promise((resolve, reject) => {
      if (this._shared.id > 0) {
        this.apiService.get('/' + this._shared.apiBase + '/orgAccessExpansion?roleId=' + this._shared.id)
          .subscribe(data => {
            if (data.data) {
              resolve(data.data);
              reject();
            }
          }, err => reject(err));
      } else {
        resolve([]);
      }
    });
  }



  setDivisionData() {
    console.log("inside set org access data")
    this._shared.orgAccessList = []
    // this.fetchOrgAccessDetail()
    this.fetchRolesOrgAccess(this._shared.id)
      .then((data: any) => {
        data.forEach(row => {
          row.userId = "0";
         if (row.facilityId == 0) {
            row.facilityId = 0;
            row.facility = '';
            this._shared.orgAccessList.push(row);
          }
        })
        this._shared.orgAccessList.forEach(divisionRow => {
          divisionRow['facility'] = []
          data.forEach(row => {
            if (row.division && row.divisionId && row.facilityId != 0) {
              divisionRow['facility'].push(row);

            }
          })
        })
      })
  }


  getStatusData() {
    let flag = false
    this._shared.saveOrgAccessData = [];

    if (this._shared.orgAccessList) {
      if (this._shared.saveIndex) {
        this._shared.saveIndex.forEach(index => {
          this._shared.saveOrgAccessData.push(this._shared.orgAccessList[index])
          if (this._shared.saveFacilityIndex && this._shared.saveFacilityIndex.length) {
            this._shared.saveFacilityIndex.forEach(roleInd => {
              if (roleInd.StatusIndex == index) {
                this._shared.saveOrgAccessData.push(this._shared.orgAccessList[index].facility[roleInd.facilityIndex])
              }
            });
          }
        });
      }

      if (this._shared.saveOrgAccessData) {
        this._shared.saveOrgAccessData.forEach(element => {
          console.log("element:", element)
          // element.active = element.active == true ? 'Y' : 'N'
          // element.isEditAllowed = element.isEditAllowed == true ? 'Y' : 'N'
          // element.isRevisionAllowed = element.isRevisionAllowed == true ? 'Y' : 'N'
        });
      }
    }
  }


}