import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";
@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [ConfirmDialogModule],
  templateUrl: "./confirm-dialog.component.html",
  styleUrl: "./confirm-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {}
