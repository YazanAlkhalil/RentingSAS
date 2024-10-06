import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { Image } from "../../../../models/Image";
import { SharedVarsService } from "../../../../services/other/shared-vars.service";

@Component({
  selector: "app-blur-image",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./blur-image.component.html",
  styleUrls: ["./blur-image.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlurImageComponent implements OnInit {
  imageNotLoaded = true;
  @Input() image!: Image;
  @Input() width!: number;
  @Input() height!: number;
  @Input() defImage = "def1";

  @Input() imgResultAfterCompress!: string;
  defImagePath = "";
  constructor(public sharedService: SharedVarsService) {}
  ngOnInit(): void {
    this.defImagePath = `../../../../assets/images/${this.defImage}.png`;
  }
}
