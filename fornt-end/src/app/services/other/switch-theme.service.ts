import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SwitchThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string) {
    let themelink = this.document.getElementById(
      "app-theme"
    ) as HTMLLinkElement;
    if (themelink) {
      themelink.href = theme + ".css";
    }
  }
}
