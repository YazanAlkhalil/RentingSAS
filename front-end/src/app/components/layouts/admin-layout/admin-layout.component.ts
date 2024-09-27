import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../services/other/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogComponent,
    AdminNavbarComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  providers:[ToastService, DialogService, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  constructor(private toastService: ToastService) {}

  showToast(): void {
    this.toastService.showToast("success", "Success", "this is a test ");
  }
}
