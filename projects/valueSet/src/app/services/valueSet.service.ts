import { Injectable } from '@angular/core';
import { of as observableOf , Observable, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'app/shared/services/api.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

import { AlertUtilities } from 'app/shared/utils';
import { LocalCacheService } from 'app/shared/services';
import { Location } from '@angular/common';
import { ValueSetSharedService } from './valueSet-shared.service';
import { ValueSet } from '../model/valueSet.model';
import { Router } from '@angular/router';
import { ConfirmPopupComponent } from 'app/shared/component';
import { MatDialog } from '@angular/material/dialog';


@Injectable(
 // {
  // providedIn: 'root'
//}
)
export class ValueSetService {
    
  duplicatediCheck() {
    throw new Error("Method not implemented.");
  }
  
  apiSubscription: Subscription;
  constructor( private apiService: ApiService,
    public inputService: TnzInputService,
    private _shared: ValueSetSharedService,
    private alertUtils: AlertUtilities,
    private _cache: LocalCacheService,
    private location: Location,
    public router: Router,
    private _dialog: MatDialog) { }
  
  
  checkAppSecurity(uniqueId): Observable<any> {
    return this.apiService.get('/trendz/user-permission?url=' + uniqueId).pipe(
        catchError(() => {
            return observableOf(null);
        }), map(data => {
            if (data) {
                return data.userPermissions;
            } else {
                return 0;
            }
        }));
}
  checkAppPermission(url, type) {
    return new Promise((resolve, reject) => {
        this.checkAppSecurity(url)
            .subscribe(res => {
                if (res && res[type] == 4) {
                    resolve(true)
                } else {
                    reject("You are not given privilege to " + type + " in this application.")
                }
            })
    });
}
duplicateDivisionCheck() {
//   let tmp = this._shared.formData.header.shortCode;
// console.log('tmp---'+tmp)
//   return new Promise((resolve, reject) => {
//     this.apiService.get(`/${this._shared.apiBase}/duplicateCheck/TESTA`)
//     .subscribe(data => {
//         if (data.division) {
//             resolve(new Division(data.division));
//             console.log('data'+data);
//             console.log('data.division'+data.division);
//         } else {
//             reject();
//         }
//     }, err => reject(err));
//   }
//   )
}

save(id?: number): Promise<any> {
    this._shared.loading = true;
    this._shared.save=true;
    return new Promise((resolve, reject) => {
        this.saveData(id || this._shared.id)
            .then(res => {
                
                this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                this._shared.loading = false;
                // this.router.navigateByUrl('/valueSet/' + this._shared.id+ (exit ? '' : '/edit'));
                // this.router.navigateByUrl('/valueSet/' + id+ '/edit');
                this._shared.refreshData.next(true);
                resolve(true);
            }, err => {
                if (err) {
                    this.alertUtils.showAlerts('Failed to ' + 'edit' + ' document. ' + err);
                }
                this._shared.loading = false;
                resolve(false);
            })
    });


}
saveData(id): Promise<any> {
    return new Promise((resolve, reject) => {
        let inValid;
  
        //Checking if inputs are valid in header
        let inputs = this.inputService.getInput(this._shared.headerPath);


        if (inputs) {
            let invalidInputs = Object.keys(inputs).filter(input => inputs[input] == null);
            if(invalidInputs.length){
                invalidInputs.map(invalidInput => {
                    delete inputs[invalidInput];
                })
            }
            inValid = Object.keys(inputs).some(key => {
                let temp = inputs[key];
                Object.keys(temp).some(keys=>{
                    if (temp[keys] && temp[keys].status != 'ok' && temp[keys].status != 'changed') {
                        return true;
                    }
                })
            });
        }
        //Checking if inputs are valid in lines
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
     
            // Adding the removedkeys as active - N to remove them
            if (saveData) {
                if (saveData.header){

                    if(saveData.header.shortCode){
                        saveData.header.shortCode=saveData.header.shortCode.toUpperCase();
                    }
                if(typeof saveData.header.returnFieldName == 'object'){
                    
                    saveData.header.returnFieldName = saveData.header.returnFieldName.label
                }
            }
           
            // this.duplicateValueSetCheck(saveData.header.shortCode).then(data=>{
            //     if(data){
            //         reject('Duplicate valueset -' + saveData.header.shortCode + ' !');
                    
            //     }else
            {
                this._shared.lineKeys.forEach(key => {

                    
                    if (!saveData[key]) {
                        saveData[key] = [];
                    }

                });
                //     }else{
                       
                let observable;
                if (id == 0) {
                    observable = this.apiService.post('/valueSet', saveData)
                } else {
                    observable = this.apiService.put('/valueSet/' + id, saveData)

                }
                observable
                    .catch(err => {
                        reject(err);
                        // return err;
                    })
                    .subscribe(res => {
                        if(res.data == null)
                        reject(res && 'Duplicate short code found!')
                        if (res && res.success) {
                            this._shared.id = res.data && res.data.setId ? res.data.setId : this._shared.id;
                            resolve(res)
                        } else {
                            reject(res && res.message ? res.message : 'Unknown error');
                        }
                    })
            } 
        // })
    
    }
    else {
                reject('No changes detected');
            }
        }
    });
  }
  
// saveData(id): Promise<any> {
//     return new Promise((resolve, reject) => {
//         let inValid;
       
//         // Checking if inputs are valid in header
//         let inputs = this.inputService.getInput(this._shared.headerPath);
//         if (inputs) {
//             inValid = Object.keys(inputs).some(key => {
//                 if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
                   
//                     return true;
//                 }
//             });
//         }
      
//         if (inValid) {
//             reject('Please fill mandatory fields.');
//         } else {
//             const saveData = this._cache.getCachedValue(this._shared.appPath);
//             //validation
            
//             // Adding the removedkeys as active - N to remove them
//             if (saveData) {
//                 if (saveData.header)
//                 if(saveData.header.shortCode){
//                 saveData.header.shortCode=saveData.header.shortCode.toUpperCase();
//             }
//                 this.duplicateDivisionCheck(saveData.header.shortCode).then(data=>{
//                     if(data){
//                         // this.alertUtils.showAlerts('Duplicate division -' + saveData.header.shortCode + ' !');
//                         //this._shared.loading = false;
//                         reject('Duplicate division -' + saveData.header.shortCode + ' !');
                        
//                     }else{
//                         //this.alertUtils.showAlerts('Duplicate division -' + saveData.header.shortCode + ' !');
//                         let observable;

//                         if (id == 0) {
//                             observable = this.apiService.post('/valueSet', saveData)
//                         } else {
//                             observable = this.apiService.put('/valueSet/' + id, saveData)

//                         }
//                         observable
//                             .catch(err => {

//                                 console.log(err)
//                                 reject(err);
                               
//                             })
//                             .subscribe(res => {
//                                 if (res && res.success) {

//                                     this._shared.id = res.data && res.data.valueSet ? res.data.valueSet : this._shared.id;
                                   
        
//                                     resolve(res)
//                                 } else {
//                                     reject(res && res.message ? res.message : 'Unknown error');
//                                 }
//                             })
//                   //  }
//                 })



//                 // this._shared.lineKeys.forEach(key => {
//                 //     if (!saveData[key]) {
//                 //         saveData[key] = [];
//                 //     }
//                     // const removedPath = this._shared[key + 'RemovedKeysPath'];
//                 //     const linePrimaryKey = this._shared[key + 'PrimaryKey']
//                 //     const cache = this._cache.getCachedValue(removedPath)
//                 //     if (cache && cache.length) {
//                 //         cache.forEach(removedPrimaryKey => {
//                 //             const json = {'active': 'N'};
//                 //             json[linePrimaryKey] = removedPrimaryKey;
//                 //             saveData[key].push(json)
//                 //         });
//                 //     }
//                 // });


//                 // let observable;
                
//                 // console.log('OBSER----ID--AMEENA-1-'+id)
//                 // console.log('saveData-----'+saveData)
//                 // if (id == 0) {
//                 //     observable = this.apiService.post('/division', saveData)
//                 // } else {
//                 //     observable = this.apiService.put('/division/' + id, saveData)
//                 //     console.log('OBSER----ID--AMEENA--2--'+id)
//                 // }
//                 // observable
//                 //     .catch(err => {
//                 //         console.log('Hi ygbgh')
//                 //         console.log(err)
//                 //         reject(err);
                       
//                 //     })
//                 //     .subscribe(res => {
//                 //         if (res && res.success) {
//                 //              console.log(' this._shared.id--'+ this._shared.id);
//                 //             console.log(' res.data.division--'+ res.data.division);
//                 //             this._shared.id = res.data && res.data.division ? res.data.division : this._shared.id;
                           

//                 //             resolve(res)
//                 //         } else {
//                 //             reject(res && res.message ? res.message : 'Unknown error');
//                 //         }
//                 //     })
//             } else {
//                 reject('No changes detected');
//             }
//         }
//     });
// }
fetchFormData(id?: number) {
  
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
           
            this.apiService.get(`/${this._shared.apiBase}/${this._shared.id}`)
                .subscribe(data => {
                    if (data.valueSet) {
                        resolve(new ValueSet(data.valueSet));

                    } else {
                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve({});
        }
    });
  
}
duplicateValueSetCheck(value){
    //let tmp = this._shared.formData.header.division;
      
    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + value)
            .catch(err => {
                reject(err);
                return err;

            })
            .subscribe(data => {
               // if (data.duplicate==true) {
                   if (data.valueSet==true) {
                    // this.alertUtils.showAlerts('Duplicate division -' + value + ' !');
                    resolve(true);

                } else {
                    resolve(false);
                }
            })
    }
    )
}

loadData(key) {

    this._shared[key + 'Loading'] = true;
    this._shared.setLines(key, []);
    if (this._shared.id == 0) {
        const data = this._shared.setLinesFromCache(key, []);
        this._shared.formData[key] = data;
        this._shared[key + 'Loading'] = false;
        this._shared.refreshOpertionTable.next(true);
    } else {
        this.fetchOperations(key).then(
            (data: any) => {
                this._shared.setLines(key, data);
                // data = this._shared.setLinesFromCache(key, data);
                this._shared.formData[key] = data;
                this._shared.refreshOpertionTable.next(true);
                this._shared[key + 'Loading'] = false;
            },
            (err) => {
                this._shared.refreshOpertionTable.next(true);
                this._shared[key + 'Loading'] = false;
                // if (err) this.alertUtils.showAlerts(err.message, true);
            }
        );
    }
}
fetchOperations(id?: number) {
 
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
            this.apiService.get(`/${this._shared.apiBase}/validValue/`+this._shared.id)
            .subscribe(data => {
                if (data.validValue) {
                    resolve(data.validValue);
                    // if (data.sequence) {
                    //     this._shared.markerDetailsSeq = data.maxDisplayOrder
                    // }
                }
                else {
                    reject();

                }
            }, err => reject(err));
                    
               
        } else {
            resolve([]);
        }
    });
}





  //method to delete lines
  deleteDetailsLine(key: string, index: any, model: any) {
    // let attrValId, userRoles, roles, userOrgAccess, roleId;

    // switch (key) {
    //   case 'userRoles': {
        this._shared.deleteLine(key, index); // for deleting from cache
    //     break;
    //   }
    //   case 'rolesOrgAccess':
    //     this._shared.deleteLine(key, index);
    //     break;
    //   case 'rolesAppAccess':
    //     this._shared.deleteLine(key, index);
    //     break;
    //   default:
    //     this._shared.deleteLine(key, index);
    //     break;
    // }
  }


  duplicateValueSetheck(value){
    //let tmp = this._shared.formData.header.division;
      
    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + value)
            .catch(err => {
                reject(err);
                return err;

            })
            .subscribe(data => {
               // if (data.duplicate==true) {
                   if (data.valueSet==true) {
                    // this.alertUtils.showAlerts('Duplicate division -' + value + ' !');
                    resolve(true);

                } else {
                    resolve(false);
                }
            })
    }
    )
}

exportData(ids) {
    return new Promise((resolve, reject) => {
        this.apiService.post('/' + this._shared.apiBase + '/export-data',ids)
            .subscribe(data => {
                if (data) {
                    if (data.exportData) {
                        resolve(data.exportData);
                    }
                }
                else
                    reject();
            }, err => reject(err));
        
    });
}


exportAllData() {
    return new Promise((resolve, reject) => {
        this.apiService.get('/' + this._shared.apiBase + '/export-all-data')
            .subscribe(data => {
                if (data) {
                    if (data.exportData) {
                        resolve(data.exportData);
                    }
                }
                else
                    reject();
            }, err => reject(err));
        
    });
}

checkDuplicateShortCode(shortCode){
    return new Promise((resolve, reject) => {
        if(shortCode){
            this.apiService.post('/' + this._shared.apiBase + '/import-shorCode-validation',shortCode)
            .subscribe(data => {
                if (data) {
                    resolve(data); 
                }
                else
                    reject();
            }, err => reject(err));
        }
        else{
            reject();
        }
        
    });
      
  }

  saveImportData(data){
    return new Promise(async (resolve, reject) => {
        const saveData = await this._shared.updateFinalImportData(data);
        if(saveData){

            this.apiService.post('/' + this._shared.apiBase + '/save-import-data',saveData)
            .subscribe(data => {
                if (data.status == 'S') {
                    if(data.error.length > 0){
                        const window = this._dialog.open(ConfirmPopupComponent);
                        window.componentInstance.dialogTitle = "Warning";
                        let msg = "Some programs are not inserted. Could not find executable for following programs.\n ";
                        data.error.forEach(shortCode=>{
                            if(shortCode)
                                msg = msg + "\n" + shortCode
                        });
                        window.componentInstance.message = msg;
                        window.componentInstance.confirmText = 'OK';
                        window.afterClosed().subscribe(res=>{
                            this.alertUtils.showAlerts(data.message);
                            resolve(true);
                        })
                    }else{
                        this.alertUtils.showAlerts(data.message);
                        resolve(true); 
                    }
                }
                else{
                    this.alertUtils.showAlerts(data.message);
                    resolve(false); 
                }
            }, err =>{ reject(err)
            console.log(err);}
            );
        }
        else{
            reject();
        }
    });
  }


}