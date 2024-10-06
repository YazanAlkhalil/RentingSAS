import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { SplitButtonModule } from "primeng/splitbutton";
import { ToolbarModule } from "primeng/toolbar";
import { SidebarModule } from "primeng/sidebar";
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { CommonModule } from "@angular/common";
import { SwitchThemeService } from "../../../services/other/switch-theme.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ChangeLangService } from "../../../services/other/change-lang.service";
import { StateService } from "../../../services/other/state.service";
import { sidebaranimation } from "../../../../animations";
import { DividerModule } from "primeng/divider";
import { PanelMenuModule } from "primeng/panelmenu";
import { StyleClassModule } from "primeng/styleclass";
import { RippleModule } from "primeng/ripple";
import { CustomMenuItem } from "../../../models/Interfaces/CustomMenuItem";
import { AnimateOnScrollModule } from "primeng/animateonscroll";
import { AuthService } from "../../../services/other/auth.service";
import { ToastService } from "../../../services/other/toast.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    ToolbarModule,
    SplitButtonModule,
    DividerModule,
    SidebarModule,
    AvatarModule,
    MenuModule,
    CommonModule,
    TranslateModule,
    PanelMenuModule,
    StyleClassModule,
    RippleModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sidebaranimation],
})
export class SidebarComponent implements OnInit {
  loading = false;
  menuItems: CustomMenuItem[] = [
    {
      id:'contracts',
      title:this.translateService.instant('contracts'),
      icon:'pi pi-file-pdf',
      routerLink:'/main/contracts',
    },
    {
      id: "apartments",
      icon: "pi pi-home",
      title: this.translateService.instant("apartments"),
      routerLink: "/main/apartments",
    },
    {
      id: "buildings",
      title: this.translateService.instant("buildings"),
      icon: "pi pi-building",
      routerLink: "/main/buildings",
    },
    {
      id: "users",
      icon: "pi pi-users",
      title: this.translateService.instant("users"),
      routerLink: "/main/users",
    },
    {
      id:"clients",
      icon:'pi pi-address-book',
      title:this.translateService.instant('clients'),
      routerLink: "/main/clients"
    },
    {
      id:"reports",
      icon:'pi pi-chart-line',
      title:this.translateService.instant('reports'),
      routerLink: "/main/reports"
    }
  ];

  dir = localStorage.getItem("direction");
  langCode = localStorage.getItem("langCode");
  currentTheme = localStorage.getItem("theme");

  sidebarVisible = false;
  closeCallback(event: any): void {
    console.log(event);
  }

  isSubMenuOpen: any = {};

  toggleSubMenu(id: string) {
    this.isSubMenuOpen[id]
      ? delete this.isSubMenuOpen[id]
      : (this.isSubMenuOpen[id] = true);
  }
  constructor(
    public themeService: SwitchThemeService,
    public changelangService: ChangeLangService,
    public stateService: StateService,
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private translateService: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.currentTheme = localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "light";
  }

  changeLang(lang: string): void {
    this.changelangService.changeLang(lang);
  }

  swwitchTheme(theme: string): void {
    localStorage.setItem("theme", theme);
    this.themeService.switchTheme(theme);
    this.currentTheme = theme;
  }

  logout(): void {
    this.router.navigate(["login"]);
  }
}
