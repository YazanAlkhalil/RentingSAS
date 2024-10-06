import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { PrimeNGConfig } from "primeng/api";
import { SwitchThemeService } from "./services/other/switch-theme.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { StateService } from "./services/other/state.service";
import { ChangeLangService } from "./services/other/change-lang.service";
import { NgClass } from "@angular/common";
import { BackendService } from "./services/other/backend.service";
import { SharedVarsService } from "./services/other/shared-vars.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: SwitchThemeService,
    private primengConfig: PrimeNGConfig,
    public stateService: StateService,
    public cls: ChangeLangService,
    private backend: BackendService,
    private sharedVarsService: SharedVarsService
  ) {}
  ngOnInit(): void {
    document.documentElement.style.fontSize = `${"11"}px`;
    this.primengConfig.ripple = true;
    this.primengConfig.inputStyle = "filled";
    this.setTheme();
    this.setLang();
    this.initServer();
  }
  setTheme() {
    this.themeService.switchTheme(
      localStorage.getItem("theme") ? localStorage.getItem("theme")! : "light"
    );
  }
  setLang(): void {
    this.cls.changeLang(
      localStorage.getItem("langCode")
        ? localStorage.getItem("langCode")!
        : "en"
    );
  }

  initServer() {
    this.backend.init(
      this.sharedVarsService.baseURL,
      this.sharedVarsService.appId,
      this.sharedVarsService.JS_Key,
      this.sharedVarsService.wss
    );
  }
}
