import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.css']
})
export class CropImageComponent implements OnInit {
  // cropperSettings: any;

  // data: any;
  // imageUploaded = false;
  // // cropperSettings: CropperSettings;

  // @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  // constructor(private dialogRef: MatDialogRef<CropImageComponent>) {
  //   this.cropperSettings = new CropperSettings();
  
  //   this.cropperSettings.croppedWidth = 256;
  //   this.cropperSettings.croppedHeight = 256;
  
  //   this.cropperSettings.dynamicSizing = true;
  //   this.cropperSettings.cropperClass = 'ui-cropper';
  //   this.data = {};
  //   this.cropperSettings.noFileInput = true;
  // }

  ngOnInit() {
  }

  // fileChangeListener($event) {
  //   const image: any = new Image();
  //   const file: File = $event.target.files[0];
  //   if (file) {
  //     const myReader: FileReader = new FileReader();
  //     const that = this;
  //     myReader.onloadend = function (loadEvent: any) {
  //       image.src = loadEvent.target.result;
  //       /that.cropper.setImage(image);
  //     };
  //     myReader.readAsDataURL(file);
  //     this.imageUploaded = true;
  //   }
  // }
  // selectImage() {
  //   if (this.data.image) {
  //     this.dialogRef.close(this.data.image);
  //   }
 // }
}
