import { Injectable } from '@angular/core';
import { of as observableOf , Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'app/shared/services/api.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DivisionSharedService } from './division-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { LocalCacheService } from 'app/shared/services';
import { Location } from '@angular/common';
import { Division, Address } from '../models/division.model';

@Injectable(
 // {
  // providedIn: 'root'
//}
)
export class DivisionService {
  duplicatediCheck() {
    throw new Error("Method not implemented.");
  }
 
  apiSubscription: Subscription;
  constructor( private apiService: ApiService,
    public inputService: TnzInputService,
    private _shared: DivisionSharedService,
    private alertUtils: AlertUtilities,
    private _cache: LocalCacheService,
    private location: Location) { }
  
  
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
// duplicateDivisionCheck() {
// //   let tmp = this._shared.formData.header.shortCode;
// // console.log('tmp---'+tmp)
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
// }

save(id?: number): Promise<any> {
    this._shared.loading = true;
    return new Promise((resolve, reject) => {
        this.saveData(id || this._shared.id)
            .then(res => {
                this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                this._shared.loading = false;
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
       
        // Checking if inputs are valid in header
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
            const saveData = this._cache.getCachedValue(this._shared.appPath);
            //validation
            
            // Adding the removedkeys as active - N to remove them
            if (saveData) {
                if (saveData.header)
                if(saveData.header.shortCode){

                saveData.header.shortCode=saveData.header.shortCode.toUpperCase();
                let temp=saveData.header.shortCode;
                if (temp.length > 30) {
    
                    reject('Length exceeded 30 characters!');
                }

            }
            if(saveData.header.divisionName){
                let tmp;      
                tmp=saveData.header.divisionName;
                if (tmp.length > 60) {
    
                  reject('Length exceeded 60 characters!');
               }
          }     
    
                this.duplicateDivisionCheck(saveData.header.shortCode).then(data=>{
                    if(data){
                        // this.alertUtils.showAlerts('Duplicate division -' + saveData.header.shortCode + ' !');
                        //this._shared.loading = false;
                        reject('Duplicate division -' + saveData.header.shortCode + ' !');
                        
                    }else{
                        //this.alertUtils.showAlerts('Duplicate division -' + saveData.header.shortCode + ' !');
                        let observable;

                        if (id == 0) {
                            observable = this.apiService.post('/division', saveData)
                        } else {
                            observable = this.apiService.put('/division/' + id, saveData)

                        }
                        observable
                            .catch(err => {

                                console.log(err)
                                reject(err);
                               
                            })
                            .subscribe(res => {
                                if (res && res.success) {

                                    this._shared.id = res.data && res.data.divisionId ? res.data.divisionId : this._shared.id;
                                   
        
                                    resolve(res)
                                } else {
                                    reject(res && res.message ? res.message : 'Unknown error');
                                }
                            })
                    }
                })



                // this._shared.lineKeys.forEach(key => {
                //     if (!saveData[key]) {
                //         saveData[key] = [];
                //     }
                    // const removedPath = this._shared[key + 'RemovedKeysPath'];
                //     const linePrimaryKey = this._shared[key + 'PrimaryKey']
                //     const cache = this._cache.getCachedValue(removedPath)
                //     if (cache && cache.length) {
                //         cache.forEach(removedPrimaryKey => {
                //             const json = {'active': 'N'};
                //             json[linePrimaryKey] = removedPrimaryKey;
                //             saveData[key].push(json)
                //         });
                //     }
                // });


                // let observable;
                
                // console.log('OBSER----ID--AMEENA-1-'+id)
                // console.log('saveData-----'+saveData)
                // if (id == 0) {
                //     observable = this.apiService.post('/division', saveData)
                // } else {
                //     observable = this.apiService.put('/division/' + id, saveData)
                //     console.log('OBSER----ID--AMEENA--2--'+id)
                // }
                // observable
                //     .catch(err => {
                //         console.log('Hi ygbgh')
                //         console.log(err)
                //         reject(err);
                       
                //     })
                //     .subscribe(res => {
                //         if (res && res.success) {
                //              console.log(' this._shared.id--'+ this._shared.id);
                //             console.log(' res.data.division--'+ res.data.division);
                //             this._shared.id = res.data && res.data.division ? res.data.division : this._shared.id;
                           

                //             resolve(res)
                //         } else {
                //             reject(res && res.message ? res.message : 'Unknown error');
                //         }
                //     })
            } else {
                reject('No changes detected');
            }
        }
    });
}
fetchFormData(id?: number) {
  
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
           
            this.apiService.get(`/${this._shared.apiBase}/${this._shared.id}`)
                .subscribe(data => {
                    if (data.division) {
                        resolve(new Division(data.division));

                    } else {
                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve({});
        }
    });
  
}

fetchAddress(id: number ) : Promise<Address | any>{
    return new Promise((resolve, reject) => {
        // if (this._shared.id > 0) {
           
            this.apiService.get(`/${this._shared.apiBase}/Addr/`+id)
           
                .subscribe(data => {
                    if (data.division) {
                        resolve(new Address(data.division));
                    } else {
                        reject();
                    }
                }, err => reject(err));
       // } else {
       //     resolve({});
      //  }
    });
   
}
duplicateDivisionCheck(value){
    //let tmp = this._shared.formData.header.division;
      
    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + value)
            .catch(err => {
                reject(err);
                return err;

            })
            .subscribe(data => {
               // if (data.duplicate==true) {
                   if (data.division==true) {
                    // this.alertUtils.showAlerts('Duplicate division -' + value + ' !');
                    resolve(true);

                } else {
                    resolve(false);
                }
            })
    }
    )
}
}