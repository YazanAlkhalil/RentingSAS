import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ChangeLangService } from "../../../services/other/change-lang.service";
import { StateService } from "../../../services/other/state.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/other/auth.service";
import { User } from "parse";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "../../../services/other/toast.service";
import { ToastModule } from "primeng/toast";
@Component({
  selector: "app-auth",
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    TranslateModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  loading = false;
  title = "Farah";
  dir = localStorage.getItem("direction");
  langCode = localStorage.getItem("langCode");
  username = "";
  password = "";
  constructor(
    public changelangService: ChangeLangService,
    public ss: StateService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.authService.logOut();
  }

  changeLang(lang: string): void {
    this.changelangService.changeLang(lang);
  }

  login(): void {
    this.loading = true;
    this.cd.detectChanges();
    this.authService
      .logIn(this.username.trim(), this.password.trim())
      .then(async (user: User) => {
        console.log(user, 'user');
        if(await this.authService.isAdmin()){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/main']);
        }
        this.loading = false;
        this.cd.detectChanges();
      })
      .catch((err: Error) => {
        this.loading = false;
        this.cd.detectChanges();
        this.toastService.showToast(
          "error",
          this.translateService.instant("Error"),
          err.message
        );
      });
  }
}
