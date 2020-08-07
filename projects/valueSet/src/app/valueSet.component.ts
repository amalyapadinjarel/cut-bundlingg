import { Component, ElementRef, ViewChild } from '@angular/core';
import { ValueSetSharedService } from './services/valueSet-shared.service';
import { ValueSetService } from './services/valueSet.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { ImportComponent } from './form/import/import.component';

@Component({
  templateUrl: './valueSet.component.html',
  styleUrls: ['./valueSet.component.scss']
})
export class ValueSetComponent {
  @ViewChild('fileInput') inputEl: ElementRef;
  importLoading: Boolean = false;
  selectedFile;
  constructor( 
   
    public _shared: ValueSetSharedService,
    public _service: ValueSetService,
    private router: Router,
    private location: Location,
    private alertutils: AlertUtilities,
    private dialog: MatDialog
    ){
      this._shared.init();
   }
   newValueSet(){
    // this._service.checkAppPermission(this._shared.taskFlowName, 'create')
    // .then(() => {
      
  
    //   if (this.router.routerState.snapshot.url == '/valueSet/create') {
    //     this.location.go('/valueSet/create');
    //     this._shared.valueSet='--';
    //     this._service.inputService.resetInputCache(this._shared.appPath);
    //     this._shared.initLocalCache();
    //     this._shared.editMode = true;
    //     this._shared.refreshData.next(true);
    //     // this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
        
    //   }
    //   else {
    //     this.router.navigateByUrl('/valueSet/create').then(done => {
    //       this._shared.editMode = true;
    //       this._shared.initLocalCache();
    //       // this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
  
  
    //     }).catch((err) => { console.log('Caught Exception on create!', err) })
    //   }
    // }).catch(err => {
    //   this.alertutils.showAlerts(err);
    // })

    this._service.checkAppPermission(this._shared.taskFlowName, 'create')
  .then(data => {
        this.router.navigateByUrl('/valueSet/create').then(done => {
          this._shared.editMode = true;
         this._shared.initLocalCache();
        });
      }).catch(err => {
        this.alertutils.showAlerts(err)
      })
   }
   editValueSet(){
    this._service.checkAppPermission(this._shared.taskFlowName, 'edit')
        .then(data => {
  
                      this.location.go('valueSet/' + this._shared.id + '/edit')
                      this._shared.editMode = true;
                     // this._shared.initLocalCache()
                    })
                    .catch(err => {
                      this.alertutils.showAlerts(err)
                    })
  
  
   }
   save(exit = false) {
    this._service.save().then((flag) => {
      if (flag && exit) {
       // this._service.cancelEdit();
        this.cancelEdit();
  
      }
    })
  }
   
   cancelEdit() {
   console.log('tests');
   
    if (this._shared.id > 0) {
      this.location.go('/valueSet/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.reviseMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
  } else {
      this.router.navigateByUrl('/valueSet/list').then(done => {
          this._shared.editMode = false;
         this._shared.reviseMode = false;
          this._shared.initLocalCache();
      });
  }
   }
   export(){
    
  
    if(this._shared.id > 0){
     
      let id = [];
      id.push(this._shared.id);
      this._service.exportData(id).then(data=>{
        this._shared.exportDataToFile(false,(data)) ;
        console.log((JSON.stringify(data)));
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
        const fileName = event.target.files[0].name;
        const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
       if (extension == 'tnzdat') {
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
            const window = this.dialog.open(ImportComponent);
            window.componentInstance.newLines = newLinesHeader;
            window.componentInstance.duplicateLines = duplicatesHeader;
            window.afterClosed().subscribe(data=>{
              if(data){
                let finalImportData = this._shared.filterSelectedData(data);             
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
          console.log('err',err);
          this.alertutils.showAlerts("Error while reading the file.")
        }
      }
      fileReader.onerror = (error) => {
        this.importLoading = false;
        this.alertutils.showAlerts("Error while reading the file.")
        console.log(error);
      }
    }
      else {
        this.alertutils.showAlerts('Please upload a tnzdat file!');
        // this.cancelAction();
      }

      
    }
   
  }
}
