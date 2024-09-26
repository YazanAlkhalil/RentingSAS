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
      id: "posts",
      title: this.translateService.instant("posts"),
      icon: "pi pi-credit-card",
      routerLink: "/main/posts",
    },
    {
      id: "sources",
      icon: "pi pi-question-circle",
      title: this.translateService.instant("sources"),
      routerLink: "/main/sources",
    },
    {
      id: "users",
      icon: "pi pi-users",
      title: this.translateService.instant("users"),
      routerLink: "/main/users",
    },
    {
      id: "admins",
      icon: "pi pi-verified",
      title: this.translateService.instant("admins"),
      routerLink: "/main/admins",
    },
    {
      id: "categories",
      icon: "pi pi-box",
      title: this.translateService.instant("categories"),
      // routerLink: "/main/categories",
      subMenu: [
        {
          title: this.translateService.instant("domains"),
          icon: "pi pi-hashtag",
          routerLink: "/main/domains",
        },
        {
          title: this.translateService.instant("topics"),
          icon: "pi pi-globe",
          routerLink: "/main/topics",
        },
        {
          title: this.translateService.instant("post_type"),
          icon: "pi pi-paperclip",
          routerLink: "/main/post_type",
        },
        // {
        //   title: "Tags",
        //   routerLink: "/main/tags",
        // },
      ],
    },
    {
      id: "policy",
      icon: "pi pi-verified",
      title: this.translateService.instant("privacy policy"),
      routerLink: "/main/policy",
    },
    {
      id: "about",
      icon: "pi pi-info-circle",
      title: this.translateService.instant("about us"),
      routerLink: "/main/about",
    },
    {
      id: "config",
      icon: "pi pi-cog",
      title: this.translateService.instant("configs"),
      routerLink: "/main/config",
    },
    {
      id:"statistic",
      icon:'pi pi-chart-line',
      title:this.translateService.instant('statistics'),
      routerLink: "/main/statistics"
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
