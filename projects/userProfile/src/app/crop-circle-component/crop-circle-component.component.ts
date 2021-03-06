import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { lyl, WithStyles, StyleRenderer, ThemeVariables } from '@alyle/ui';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent
} from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';
import { AlertUtilities } from 'app/shared/utils';
import { ApiService } from 'app/shared/services';
import { UserProfileSharedService } from '../_service/user-profile-shared.service';
import { MatDialogRef } from '@angular/material/dialog';

const STYLES = (_theme: ThemeVariables) => {

  return {
    cropper: lyl`{
      max-width: 400px
      height: 300px
    }`,
    sliderContainer: lyl`{
      text-align: center
      max-width: 400px
      margin: 14px
    }`,
    cropResult: lyl`{
      border-radius: 50%
    }`
  };
};
@Component({
  selector: 'app-crop-circle-component',
  templateUrl: './crop-circle-component.component.html',
  styleUrls: ['./crop-circle-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropCircleComponent implements WithStyles, AfterViewInit {
  classes = this.sRenderer.renderSheet(STYLES);
  croppedImage?: string;
  scale: number;
  ready: boolean;
  minScale: number;

  uploadUrl: string;//url
  displayUrl: string;//url

  @ViewChild(LyImageCropper, { static: true }) readonly cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997', // Default transparent if type = png else #000
    type: 'image/png', // Or you can also use `image/jpeg`
    //round: false

    // resizableArea: true,
    // keepAspectRatio: true
  };

  ngOnInit(): void {
  }

  constructor(
    readonly sRenderer: StyleRenderer,
    private _platform: Platform,
    private alertUtils: AlertUtilities,
    private apiService: ApiService,
    private _shared: UserProfileSharedService,
    private dialogRef: MatDialogRef<CropCircleComponent>
  ) { }

  ngAfterViewInit() {

    // demo: Load image from URL and update position, scale, rotate
    // this is supported only for browsers
    if (this._platform.isBrowser) {
      const config = {
        scale: 0.745864772531767,
        position: {
          x: 642.380608078103,
          y: 236.26357452128866
        }
      };
      if (this.displayUrl)
        this.cropper.setImageUrl(
          // 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c',
          this.displayUrl,
          () => {
            this.cropper.setScale(config.scale, true);
            this.cropper.updatePosition(config.position.x, config.position.y);
            // You can also rotate the image
            // this.cropper.rotate(90);
          }
        );
    }

  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    // console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    // console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    this.alertUtils.showAlerts(`'${e.name}' is not a valid image`)

  }

  uploadImage(croppedImage) {
    let observable;

    //observable = this.apiService.postMultipart("/userProfile/image/"+this._shared.id,croppedImage);
    observable = this.apiService.postMultipart(this.uploadUrl, croppedImage);

    observable
      .catch(err => {
        // reject(err);
        console.log("Error,", err);
      })
      .subscribe(res => {
        if (res.success) {
          this.alertUtils.showAlerts(res.message);
          res.data = croppedImage;
          this.dialogRef.close(res);
        } else {
          console.log("unknown error")
        }
      })


  }
}



