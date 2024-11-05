import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ConfirmationService, MenuItem, ConfirmEventType } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from "primeng/menu";
import { SidebarModule } from "primeng/sidebar";
import { SplitButtonModule } from "primeng/splitbutton";
import { ToolbarModule } from "primeng/toolbar";
import { ChangeLangService } from "../../../services/other/change-lang.service";
import { StateService } from "../../../services/other/state.service";
import { SwitchThemeService } from "../../../services/other/switch-theme.service";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { AuthService } from "../../../services/other/auth.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { BlurImageComponent } from "../dialogs/blur-image/blur-image.component";
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { codes } from "./codes";
import Parse from "parse";


@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    ToolbarModule,
    SplitButtonModule,
    SidebarModule,
    AvatarModule,
    MenuModule,
    CommonModule,
    TranslateModule,
    SidebarComponent,
    ConfirmDialogModule,
    BlurImageComponent,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
  ],
  providers: [ConfirmationService],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  dir = localStorage.getItem("direction");
  langCode = localStorage.getItem("langCode");

  currentTheme = localStorage.getItem("theme");

  isLanguageEnglish = true; // Flag to track the current language

  closeCallback(event: any): void {
    console.log(event);
  }

  items?: MenuItem[] = [
    { label: "Users", icon: "pi pi-home", routerLink: "/users" },
    { label: "Admins", icon: "pi pi-info", routerLink: "/login" },
    { label: "Categories", icon: "pi pi-envelope", routerLink: "/users" },
    { label: "Posts", icon: "pi pi-envelope", routerLink: "/contact" },
  ];

  showCurrencyDialog = false;
  currencies: string[] = codes;
  selectedCurrency: string = '';
  overDueDays: number = 0;

  constructor(
    public themeService: SwitchThemeService,
    public changelangService: ChangeLangService,
    public ss: StateService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    public authService: AuthService,
    // private langService: GetLanguageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.isLanguageEnglish = this.changelangService.currentLang() === "en";
    this.selectedCurrency = this.authService.getCurrentUser()?.get('company')?.get('currency') || '';
    this.overDueDays = this.authService.getCurrentUser()?.get('company')?.get('overDueDays') || 0;
  }

  toggleLang() {
    this.confirmationService.confirm({
      header: this.translateService.instant("Confirmation"),
      message: this.translateService.instant("lang_confirmation"),
      accept: () => {
        const lang = this.isLanguageEnglish ? "ar" : "en";
        this.changeLang(lang);
        // this.langService.changeLanguage(lang);
        this.isLanguageEnglish = !this.isLanguageEnglish;
      },
    });
  }

  changeLang(lang: string): void {
    this.changelangService.changeLang(lang);
  }

  swwitchTheme(theme: string): void {
    localStorage.setItem("theme", theme);
    this.themeService.switchTheme(theme);
    this.currentTheme = theme;
  }

  async saveCompanySettings() {
    try {
      const company = this.authService.getCurrentUser()?.get('company');
      if (company) {
        await Parse.Cloud.run('updateCompany', {
          companyId: company.id,
          name: company.get('name'),
          address: company.get('address'),
          contactInfo: company.get('contactInfo'),
          img: company.get('img'),
          currency: this.selectedCurrency,
          overDueDays: this.overDueDays
        });
        this.showCurrencyDialog = false;
      }
    } catch (error) {
      console.error('Error updating company settings:', error);
    }
  }
}
