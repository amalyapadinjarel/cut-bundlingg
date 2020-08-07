import { Injectable } from '@angular/core';
import { FacilitySharedService } from './facility-shared.service';
import { of as observableOf , Observable, Subscription } from 'rxjs';
import { ApiService } from 'app/shared/services/api.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { LocalCacheService } from 'app/shared/services';
import { catchError, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Facility, Address } from '../models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
    duplicatediCheck() {
        throw new Error("Method not implemented.");
      }
    apiSubscription: Subscription;

  constructor( private apiService: ApiService,
    public inputService: TnzInputService,
    private _shared: FacilitySharedService,
    private alertUtils: AlertUtilities,
    private _cache: LocalCacheService,
    private location: Location) {}

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
fetchFormData(id?: number) {
  
    return new Promise((resolve, reject) => {
        if (this._shared.id > 0) {
           
            this.apiService.get(`/${this._shared.apiBase}/${this._shared.id}`)
                .subscribe(data => {
                    if (data.facility) {
                        resolve(new Facility(data.facility));

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
           
            this.apiService.get(`/${this._shared.apiBase}/Addr/`+id)
           
                .subscribe(data => {
                    if (data.facility) {
                        resolve(new Address(data.facility));
                    } else {
                        reject();
                    }
                }, err => reject(err));
    
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
                    //this.alertUtils.showAlerts('Failed to ' + 'save' + ' document. ' + err);
                    this.alertUtils.showAlerts('Failed to ' + ((this._shared.facility == '--' ? 'save' : 'edit') + ' document. ') + err);
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
                this.duplicateFacilityCheck(saveData.header.shortCode).then(data=>{
                    if(data){
                        reject('Duplicate facility -' + saveData.header.shortCode + ' !');
                        
                    }else{
                        if (saveData.header.shortCode) {
                            saveData.header.shortCode = saveData.header.shortCode.toUpperCase();}

                        let observable;

                        if (id == 0) {
                            observable = this.apiService.post('/facility', saveData)
                        } else {
                            observable = this.apiService.put('/facility/' + id, saveData)

                        }
                        observable
                            .catch(err => {

                                console.log(err)
                                reject(err);
                               
                            })
                            .subscribe(res => {
                                if (res && res.success) {

                                    this._shared.id = res.data && res.data.facilityId ? res.data.facilityId : this._shared.id;
                                   
        
                                    resolve(res)
                                } else {
                                    reject(res && res.message ? res.message : 'Unknown error');
                                }
                            })
                    }
                })

                
            } else {
                reject('No changes detected');
            }
        }
    });
}
duplicateFacilityCheck(value){ 
    return new Promise((resolve, reject) => {
        this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + value)
            .catch(err => {
                reject(err);
                return err;
            })
            .subscribe(data => {
                   if (data.facility==true) {
                    resolve(true);

                } else {
                    resolve(false);
                }
            })
    }
    )
}
}
