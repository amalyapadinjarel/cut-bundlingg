import {Component, OnDestroy, OnInit} from '@angular/core';
import {MfgRoutingSharedService} from '../../services/mfg-routing-shared.service';
import {ActivatedRoute, NavigationEnd, ResolveEnd, Router} from '@angular/router';
import {AlertUtilities, DateUtilities} from '../../../../../../src/app/shared/utils';
import {SubSink} from 'subsink';
import {MfgRoutingService} from '../../services/mfg-routing.service';

@Component({
    selector: 'app-mfg-routing-form',
    templateUrl: './mfg-routing-form.component.html',
    styleUrls: ['./mfg-routing-form.component.scss'],
    host: {'class': 'form-view'}

})
export class MfgRoutingFormComponent implements OnInit, OnDestroy {
    private subs = new SubSink()

    private loading: boolean;

    constructor(public _shared: MfgRoutingSharedService,
                private router: Router,
                private alertUtils: AlertUtilities,
                private route: ActivatedRoute,
                private _service: MfgRoutingService,
                public dateUtils: DateUtilities
    ) {
    }

    ngOnInit(): void {
        this.setMFGRouting();
        this.subs.sink = this.router.events.subscribe(change => {
            this.routerChanged(change);
        })
        this.subs.sink = this._shared.refreshData.subscribe(change => {
            setTimeout(_ => this.loadData(), 0);

        })
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe()
    }

    test() {
        console.log(this._shared.formData)

    }

    routerChanged(change) {
        if (change instanceof ResolveEnd) {
            if (change.url.startsWith('/routing/list')) {
                this.unsetMFGRouting();
            }
        }
        if (change instanceof NavigationEnd) {
            this.setMFGRouting();
        }
    }

    setMFGRouting() {
        if (this.router.url.endsWith('/create')) {
            this._shared.id = 0;
            this._shared.editMode = true;
        } else {
            this._shared.id = Number(this.route.snapshot.params.routingId);
            if (this.router.url.endsWith('/edit')) {
                this._shared.editMode = true;
            } else {
                this._shared.editMode = false;
                this._shared.refreshData.next(true);
            }
        }
        this._shared.setFormData({});
        this._shared.resetAllInput();
    }

    unsetMFGRouting() {
        this._shared.editMode = false;
        this._shared.id = 0;
        this._shared.setFormData({});
    }


    private loadData() {
        this.setLoading(true);
        this._service.fetchFormData(this._shared.id).then((data: any) => {
            this._shared.setFormHeader(data);
            this.setLoading(false);
        }, err => {
            this.setLoading(false);
            if (err) {
                this.alertUtils.showAlerts(err, true)
            }
        });
    }

    setLoading(flag: boolean) {
        this.loading = flag;
        // this._shared.headerLoading = flag;
        this._shared.loading = flag;
    }
}
