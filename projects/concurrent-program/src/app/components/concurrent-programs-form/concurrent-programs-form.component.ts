import { Component, OnInit } from '@angular/core';
import { ConcurrentProgramSharedService } from '../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../services/concurrent-program.service';
import { Subscription } from 'rxjs';
import { ResolveEnd, NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-concurrent-programs-form',
  templateUrl: './concurrent-programs-form.component.html',
  host: { 'class': 'form-view' }
})
export class ConcurrentProgramsFormComponent {

  private routerSubs: Subscription;
  public styleSheetCount = 0;
  
  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService,
    private route: ActivatedRoute,
    private router: Router,
    private _inputService: TnzInputService) {
      this._shared.eventEmitter.subscribe(data=>{
        if(data && data.styleSheetCount != null){
          this.styleSheetCount = Number(data.styleSheetCount);
        }
      })
     }

  ngOnInit() {
    this.setConcurrentProgram();
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
      if (change.url.startsWith('/concurrent-programs/list')) {
        this.unsetConcurrentProgram();
      }
    }
    if (change instanceof NavigationEnd) {
      this.setConcurrentProgram();
    }
  }

  unsetConcurrentProgram() {
    this._shared.editMode = false;
    this._shared.id = 0;
    this._shared.setFormData({});
    this._inputService.resetInputService(this._shared.appKey);
  }

  setConcurrentProgram() {
    if (this.router.url.endsWith('/create')) {
      this._shared.id = 0;
      this._shared.editMode = true;
      this._shared.refreshData.next(true);
    }
    else {
      this._shared.id = Number(this.route.snapshot.params.pgmId);
      if (this.router.url.endsWith('/edit')) {
          this._shared.editMode = true;
      }
      else {
          this._shared.editMode = false;
          this._shared.refreshData.next(true);
      }
    }
    this._shared.setFormData({});
    // this._shared.resetAllInput();
  }

  deleteLine(key) {
    this._service.deleteLines(key);
  }

}
