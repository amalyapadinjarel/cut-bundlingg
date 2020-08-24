import { Injectable } from '@angular/core';
import { of as observableOf , Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'app/shared/services/api.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { LocalCacheService } from 'app/shared/services';
import { Location } from '@angular/common';
import { UomSharedService } from './uom-shared.service';
import { Uom } from '../model/uom.model';

@Injectable(
 // {
  // providedIn: 'root'
//}
)
export class UomService {

  public apiSubscription: Subscription;
  constructor( private apiService: ApiService,
    public inputService: TnzInputService,
    private _shared: UomSharedService,
    private alertUtils: AlertUtilities,
    private _cache: LocalCacheService,
    private location: Location,
    ) { }
  
  
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
            const saveData = this._cache.getCachedValue(this._shared.appPath);

         if(this._shared.id==0){
            if(!saveData.header.categoryName){
                inValid = true;
            }
        }
            if (saveData) {
                if (saveData.header) {
                    let tmp;      
                    tmp=saveData.header.categoryName;
                    if (tmp && tmp.length > 60) {
        
                      reject('Length exceeded 60 characters!');
                   } 
                } 
                if (inValid) {
                    reject('Please fill mandatory fields.');
                } else {

                    // Adding the removedkeys as active - N to remove them
                    this._shared.lineKeys.forEach(key => {                       
                        if (!saveData[key]) {
                            saveData[key] = [];
                        }
                        // const removedPath = this._shared[key + 'RemovedKeysPath'];
                        // const linePrimaryKey = this._shared[key + 'PrimaryKey']
                        // const cache = this._cache.getCachedValue(removedPath)
                        // if (cache && cache.length) {
                        //     cache.forEach(removedPrimaryKey => {
                        //         const json = { 'active': 'N' };
                        //         json[linePrimaryKey] = removedPrimaryKey;
                        //         saveData[key].push(json)
                        //     });
                        // }
                    });
                    let observable;
                    if (id == 0) {
                        observable = this.apiService.post('/uom', saveData)
                    } else {
                        observable = this.apiService.put('/uom/' + id, saveData)
                    }
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        // .subscribe(res => {
                        //     if(res.data == null)
                        // reject(res && 'Duplicate catrgory code found!')
                        //     if (res && res.success) {
                        //         this._shared.id = res.data && res.data.categoryId ? res.data.categoryId : this._shared.id;
                        //         resolve(res)
                        //     } else {
                        //         reject(res && res.message ? res.message : 'Unknown error');
                        //     }
                        // })



                        .subscribe(res => {
                            if (res && res.data[0] != "") {
                            if (res.data[0] === 'duplicateHeader')
                            reject(res && 'Duplicate category code ' + res.data[1] + ' found. Please check.');
                            if (res.data[0] === 'duplicateUom')
                            reject(res && 'Duplicate combination of uom code & name ' + res.data[1] + ' found. Please check.');
                            if (res.data[0] === 'duplicateSequence')
                            reject(res && 'Duplicate defect sequence ' + res.data[1] + ' found. Please check.');
                            if (res.data[0] === 'duplicateFromToUom')
                            reject(res && 'Duplicate From UOM && Base UOM ' + res.data[1] + ' found. Please check.');
                            }
                            
                            if (res && res.success) {
                            this._shared.id = res.data && res.data[2] ? Number(res.data[2]) : this._shared.id;
                            // this._shared.id = res.data && res.data.categoryId ? res.data.categoryId : this._shared.id;
                            
                            resolve(res)
                            } else {
                            reject(res && res.message ? res.message : 'Unknown error');
                            }
                            })
               }

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
                    if (data.uom) {
                       resolve(new Uom(data.uom));

                    } else {
                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve({});
        }
    });
  
}

duplicateCategoryCodeCheck(upperValue) {

    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateUom/' + upperValue)
            .catch(err => {
                reject(err);
                return err;
            })
            .subscribe(data => {
                if (data.duplicate == true) {
                    this.alertUtils.showAlerts('Duplicate catrgory code -' + upperValue + ' !');
                    resolve(true);
                } else { resolve(false); }
            })
    })
}

loadData(key) {
    this._shared[key + 'Loading'] = true;
    this._shared.setLines(key, []);
    if (this._shared.id == 0) {
        let data = this._shared.setLinesFromCache(key, []);

        this._shared.formData[key] = data;
        this._shared[key + 'Loading'] = false;
        this._shared.refreshLines(key);
    } else {
        this.fetchLinesData(key).then(
            (data: any) => {

                this._shared.setLines(key, data);
                data = this._shared.setLinesFromCache(key, data);
                this._shared.formData[key] = data;
                this._shared.refreshLines(key);
                this._shared[key + 'Loading'] = false;
            },
            (err) => {
                this._shared.refreshLines(key);
                this._shared[key + 'Loading'] = false;

            }
        );
    }
}
fetchLinesData(key, id?) {

    switch (key) {
        case 'Uomdetail':
            return this.fetchUomDetail(id);
        case 'Conversiondetail':
            return this.fetchCoversiondetail(id);
        default:
            break;
    }

}

fetchUomDetail(id?: number) {
    this._shared.filterUomLines=[];
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {

            this.apiService.get('/' + this._shared.apiBase + '/uom-details?uomId=' + this._shared.id)
                .subscribe(data => {
                    if (data.data) {
                        let uomLines = data.data;
                        if(uomLines.length){
                            this._shared.filterUomLines = uomLines.filter(uomLine => uomLine.active=='Y' && uomLine.baseUomFlag=='Y');
       
                        }
         

                        resolve(data.data);


                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve([]);
        }
    });
}

fetchCoversiondetail(id?: number) {
    this._shared.convlines=false;
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {

            this.apiService.get('/' + this._shared.apiBase + '/conversion-details?conversionId=' + this._shared.id +'&limit=1000')
                .subscribe(data => {
                    if (data.data) {
                        let convLines = data.data;
                        if(convLines.length){
                            this._shared.convlines=true;
                        }
                        resolve(data.data);


                        reject();
                    }
                }, err => reject(err));
        } else {
            resolve([]);
        }
    });
}




}