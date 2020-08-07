
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { DocumentService } from 'app/shared/services';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'doc-status',
    templateUrl: './doc-status.component.html',
    styleUrls: ['./doc-status.component.scss']
})
export class DocStatusComponent implements OnChanges, OnDestroy {

    @Input() status;
    @Input() insideTable = false;
    
    color = 'black';
    label;
    loading = false;

    constructor(
        public docService: DocumentService,
    ) {
    }

    ngOnChanges() {
        this.loading = true;
        this.docService.getAllStatusData()
        .then( (data:any) => {
            if(this.status){
                let statusData = data.find( line => {
                if(line.value == this.status)
                    return true
                })
                this.color = statusData.color;
                this.label = statusData.label;        
            } else {
                this.label = 'Draft'
            }
            this.loading = false;
        })
    }

    ngOnDestroy() {
    }
}