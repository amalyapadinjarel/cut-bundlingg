import { OnInit, OnDestroy, Component } from '@angular/core';
import { SubSink } from 'subsink';
import { DefectGroupSharedService } from '../../services/defect-group-shared.service';
import { Router, ActivatedRoute, ResolveEnd, NavigationEnd } from '@angular/router';
import { DefectGroupService } from '../../services/defect-group.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';

@Component(
    {
        selector: 'app-defect-group-form',
        templateUrl: './defect-group-form.component.html',
        host: { 'class': 'form-view' }
    }
)
export class DefectGroupFormComponent implements OnInit, OnDestroy {

    private subs = new SubSink();
    private loading: Boolean;
    constructor(public _shared: DefectGroupSharedService,
        private router: Router,
        private route: ActivatedRoute,
        private _service: DefectGroupService,
        private _input: TnzInputService,
        private alertUtils: AlertUtilities) { }

    ngOnInit() {
        this.setAppDataVal();
        this.subs.sink = this.router.events.subscribe(change => {
            this.routerChanged(change);
        })
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    setAppDataVal() {
        if (this.router.url.endsWith('/create')) {
            this._shared.id = 0;
            this._shared.editMode = true;
        }
        else {
            this._shared.id = Number(this.route.snapshot.params.defGroupId);
            if (this.router.url.endsWith('/edit')) {
                this._shared.editMode = true;
            }
            else {
                this._shared.editMode = false;
                this._shared.refreshdefectGroupHeaderData.next(true);
            }
        }
        this._shared.setFormData({});
    }

    routerChanged(change) {
        if (change instanceof ResolveEnd) {
            if (change.url.startsWith('/defect-group/list')) {
                this.resetLoadData();
            }
        }
        if (change instanceof NavigationEnd) {
            this.setAppDataVal();
        }
    }

    resetLoadData() {
        this._shared.editMode = false;
        this._shared.id = 0;
        this._shared.setFormData({});
        this._input.resetInputService(this._shared.appKey);
    }

}