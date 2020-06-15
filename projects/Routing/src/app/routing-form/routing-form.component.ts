import { Component, OnInit } from '@angular/core';
import { RoutingSharedService } from '../_service/routing-shared.service';
import { RoutingService } from '../_service/routing.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ActivatedRoute, Router, ResolveEnd, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-routing-form',
  templateUrl: './routing-form.component.html',
  host: { 'class': 'form-view' }
})
export class RoutingFormComponent implements OnInit {
  private routerSubs: Subscription;
  hasNextRecord: boolean = false;
	hasPreviousRecord: boolean = false;

  constructor(public _shared: RoutingSharedService,
		private _service: RoutingService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private alertUtils: AlertUtilities) { }

    ngOnInit() {
      this.setRouting();
      this.routerSubs = this.router.events.subscribe(change => {
        this.routerChanged(change);
      });
    }
  
    ngOnDestroy(): void {
      if (this.routerSubs)
        this.routerSubs.unsubscribe();
    }
  
    routerChanged(change) {
      if (change instanceof ResolveEnd) {
        if (change.url.startsWith('/routing-cut-panels/list')) {
          this.unsetRouting();
        }
      }
      if (change instanceof NavigationEnd) {
        this.setRouting();
      }
    }
  
    unsetRouting() {
      this._shared.editMode = false;
      this._shared.id = 0;
      this._shared.setFormData({});
    }

    setRouting() {
      if (this.router.url.endsWith('/edit')) {
        this._shared.editMode = true;
      }
      else {
        this._shared.editMode = false;
        this._shared.refreshData.next(true);
      }
      this._shared.id = Number(this.route.snapshot.params.routingId);
      this._shared.setFormData({});
    }

  deleteLine(key) {
    this._service.deleteLines(key);
  }
}
