import { Injectable } from '@angular/core';

@Injectable()
export class ExportImportService {

  constructor() { }

  writeToFile(data,baseFileName,fileName,extention,type = 'text/plain'){
    const blob = new Blob([JSON.stringify(data)], { type: type });
    let anchor = document.createElement('a');
    let file = baseFileName + "-" + fileName + "." + extention;
    if (file) {
    anchor.download = file;
    anchor.href = ((window as any).webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = [type, anchor.download, anchor.href].join(':');
    anchor.click();
    }
  }
}
