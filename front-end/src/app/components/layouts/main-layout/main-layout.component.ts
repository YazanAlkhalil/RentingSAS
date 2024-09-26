import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { DialogService } from "../../../services/other/dialog.service";
import { ToastService } from "../../../services/other/toast.service";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { ConfirmDialogComponent } from "../../shared/dialogs/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    SidebarComponent,
    ToastModule,
    ConfirmDialogComponent,
  ],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss",
  providers: [ToastService, DialogService, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  constructor(private toastService: ToastService) {}

  showToast(): void {
    this.toastService.showToast("success", "Success", "this is a test ");
  }
}
