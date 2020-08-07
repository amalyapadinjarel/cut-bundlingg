import { Component, ViewChild, ElementRef } from '@angular/core';
import { ConcurrentProgramSharedService } from './services/concurrent-program-shared.service';
import { Router } from '@angular/router';
import { ConcurrentProgramService } from './services/concurrent-program.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, DocumentService } from 'app/shared/services';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { ConcurrentProgramImportComponent } from './components/concurrent-program-import/concurrent-program-import.component';

@Component({
  selector: 'app-root',
  templateUrl: './concurrent-programs.component.html',
  styleUrls: ['./concurrent-programs.component.scss']
})
export class ConcurrentProgramsComponent {
  reportData: any = {};
  @ViewChild("reportsBtn") reportsBtn: ElementRef;
  @ViewChild('fileInput') inputEl: ElementRef;
  selectedFile
  importLoading: Boolean = false;

  constructor(public _shared: ConcurrentProgramSharedService,
    private router: Router,
    public _service: ConcurrentProgramService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private docService: DocumentService,
    private location: Location,
    private dialog: MatDialog){
      this._shared.init();
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  editConcurrentPrograms() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {
                this.location.go('concurrent-programs/' + this._shared.id + '/edit')
                this._shared.editMode = true;
                this._shared.initLocalCache()
            
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })

  }

  cancelEdit() {
    if (this._shared.id ) {
      this.location.go('concurrent-programs/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
      // this._shared.refreshData.next(true);

    }
    else {
      this.router.navigateByUrl('/concurrent-programs/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

  save(exit = false) {
    this._service.save(exit)
    // .then((flag) => {
    //   if (flag && exit) {
    //     this.cancelEdit();
    //   }
    // })
  }

  showReports() {
    this.reportData = {}
    this.reportData["userId"] = this.userService.getCurrentUser().userId;
    if (this._shared.id) {
      this.reportData["pgmId"] = this._shared.id;
    }
    this.navService.showApplicationReports(
      "CONCURRENTPROGRAMS",
      "CPGM",
      this.reportData,
      this.reportsBtn
    );
  }

  newConcurrentProgram(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {
          this.router.navigateByUrl('/concurrent-programs/create').then(done => {
            this._shared.editMode = true;
            this._shared.initLocalCache();
          });
      }).catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  export(){
    if(this._shared.id > 0){
      let id = [];
      id.push(this._shared.id);
      this._service.exportData(id).then(data=>{
        this._shared.exportDataToFile(false,data);
      })
    }
    else{
      if(this._shared.selectedListLinesId.length > 0){
        this._service.exportData(this._shared.selectedListLinesId).then(data=>{
          this._shared.exportDataToFile(true,data);
        })
      }
    }
  }

  exportAll(){
    this._service.exportAllData().then(data=>{
      this._shared.exportDataToFile(true,data);
    })
  }

  import(){
    const inputEl: HTMLInputElement = this.inputEl.nativeElement;
    inputEl.click();
  }
  
  fileChanged(event): void {
    this._shared.clearImportData();
    if(event.target.files.length > 0){
      this.importLoading = true;
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(this.selectedFile, "UTF-8");
      fileReader.onload = () => {
        try{
          this._shared.importFileDetails = JSON.parse(fileReader.result.toString());
          let shortCodes = this._shared.fetchShortCodeFromImportDetails();
          this._service.checkDuplicateShortCode(shortCodes).then(res=>{
            this._shared.filterData(res);
            let newLinesHeader = this._shared.filterHeaderDetailsFromImportView(this._shared.newimportLines);
            let duplicatesHeader = this._shared.filterHeaderDetailsFromImportView(this._shared.duplicateLines);
            const window = this.dialog.open(ConcurrentProgramImportComponent);
            window.componentInstance.newLines = newLinesHeader;
            window.componentInstance.duplicateLines = duplicatesHeader;
            window.afterClosed().subscribe(data=>{
              if(data){
                const finalImportData = this._shared.filterSelectedData(data);
                this._service.saveImportData(finalImportData).then(res=>{
                  if(res){
                    this.importLoading = false;
                    this._shared.refreshData.next(true);
                  }
                  else{
                    this.importLoading = false;
                  }
                });
              }
              else{
                this.importLoading = false;
              }
            })
          })
        }
        catch(err){
          this.importLoading = false;
          this.alertutils.showAlerts("Error while reading the file.")
        }
      }
      fileReader.onerror = (error) => {
        this.importLoading = false;
        this.alertutils.showAlerts("Error while reading the file.")
        console.log(error);
      }
    }
  }
}
