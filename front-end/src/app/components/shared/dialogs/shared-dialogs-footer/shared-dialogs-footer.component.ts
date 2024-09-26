import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { ToastService } from "../../../../services/other/toast.service";
import { Object } from "parse";
@Component({
  selector: "app-shared-dialogs-footer",
  standalone: true,
  imports: [ButtonModule],
  templateUrl: "./shared-dialogs-footer.component.html",
  styleUrl: "./shared-dialogs-footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedDialogsFooterComponent {
  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toastService: ToastService
  ) {}
  closeTitle = input("Close");
  saveTitle = input("Save");

  close() {
    this.dialogRef.close("Hi");
  }

  save(): void {
    // if (this.form.invalid) {
    //   return;
    // }
    // this.saving = true;
    // this.cd.detectChanges();
    this.dynamicDialogConfig.data
      .save()
      .finally(() => {
        // this.saving = false;
        // this.cd.detectChanges();
      })
      .then((x: Object) => {
        this.dialogRef.close(x);
        this.toastService.showToast_success();
      })
      .catch((err: Error) => {
        this.toastService.showToast_error(err.message);
      });
  }
}
