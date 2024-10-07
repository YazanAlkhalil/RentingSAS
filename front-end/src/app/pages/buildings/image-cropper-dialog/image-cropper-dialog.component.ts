import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  ImageCropperComponent,
  ImageCropperModule,
  OutputFormat,
} from "ngx-image-cropper";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { File } from "parse";

@Component({
  selector: "app-image-cropper-dialog",
  templateUrl: "./image-cropper-dialog.component.html",
  styleUrls: ["./image-cropper-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ImageCropperModule, CommonModule, TranslateModule, ButtonModule],
})
export class ImageCropperDialogComponent implements OnInit {
  imageChangedEvent: any = "";
  croppedImage: any = "";
  @ViewChild(ImageCropperComponent, { static: false })
  imageCropper!: ImageCropperComponent;
  constructor(
    
    public dynamicDialogConfig: DynamicDialogConfig<{
      aspectRatio: number;
      imageBase64: any;
      format: OutputFormat;
      max_image_width: number;
      maintainAspectRatio: boolean;
    }>,

    public dynamicDialogRef: DynamicDialogRef,

    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.imageChangedEvent = this.dynamicDialogConfig.data;
    this.cd.detectChanges();
  }

  imageCropped(event: any) {
    const file = new File(Date.now().toString(),{
      base64: event.base64,
    });
    this.croppedImage = file;
    console.log(this.croppedImage,'cropped');
    
  }
  doneCropping() {
    console.log('any thing!');
    console.log(this.croppedImage,'cropped');
    this.dynamicDialogRef.close(this.croppedImage);
  }
}
