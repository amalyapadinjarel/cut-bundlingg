import { Component } from '@angular/core';
import { RoutingSharedService } from './_service/routing-shared.service';
import { RoutingService } from './_service/routing.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, DocumentService } from 'app/shared/services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.scss']
})
export class RoutingComponent {
  title = 'Routing';

  constructor(
    private router: Router,
    public _shared: RoutingSharedService,
    public _service: RoutingService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private docService: DocumentService,
    private location: Location
  ) {
    this._shared.init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  editRouting() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {
        this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docTypeId'))
          .then(data => {
            if(this._shared.getRouterEditable()){
              if(Number(this._shared.formData['header'].cuttingSteps) == 1){
                this.location.go('routing-cut-panels/' + this._shared.id + '/edit')
                this._shared.editMode = true;
                this._shared.initLocalCache()
              }
              else{
                this.alertutils.showAlerts("More than 1 cutting operation exist");
              }
            }
            else{
              this.alertutils.showAlerts("Cutting operation is not added in the routing steps. Hence cannot add cut panels to the routing");
            }
          })
          .catch(err => {
            this.alertutils.showAlerts(err)
          })
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })

  }

  cancelEdit() {
    if (this._shared.id > 0) {
      this.location.go('/routing-cut-panels/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
    }
    else {
      this.router.navigateByUrl('/routing-cut-panels/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

  save(exit = false) {
    this._service.save().then((flag) => {
      if (flag && exit) {
        this.cancelEdit();
      }
    })
  }
}
