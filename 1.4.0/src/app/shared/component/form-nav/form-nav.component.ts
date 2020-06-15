
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ApiService } from 'app/shared/services';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'form-nav',
    templateUrl: './form-nav.component.html',
    styleUrls: ['./form-nav.component.scss']
})
export class FormNavComponent implements OnChanges, OnDestroy {

    @Input() apiUrl;
    @Input() navUrl;
    @Input() params = new HttpParams();
    
    nextId;
    prevId;
    loading = false;
    constructor(
        public apiService: ApiService,
        public router: Router,
    ) {
    }

    ngOnChanges() {
        this.loading = true;
        this.apiService.get(this.apiUrl,this.params)
        .subscribe( data => {
            if(data && data.nav){
                this.nextId = data.nav.nextId;
                this.prevId = data.nav.prevId;
            } else {
                this.nextId = null;
                this.prevId = null;
            }
            this.loading = false;
        })
    }

    ngOnDestroy() {
    }

    navigateRecord(next = false) {
        let id;
        if (next) {
            id = this.nextId;
        } else {
            id = this.prevId;
        }
        console.log(this.navUrl)
        this.router.navigateByUrl(this.navUrl + '/' + id);
    }
}