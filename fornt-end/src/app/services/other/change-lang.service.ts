import { Injectable, computed, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class ChangeLangService {
  position = signal("left");
  currentLang = signal(
    localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
  );
  currentDirection = computed(() => {
    if (this.currentLang() === "en") {
      this.translateSerivce.use(this.currentLang()!);
      return "ltr";
    } else if (this.currentLang() === "ar") {
      this.translateSerivce.use(this.currentLang()!);
      return "rtl";
    } else return "";
  });

  constructor(private translateSerivce: TranslateService) {}

  changeLang(langCode: string): void {
    localStorage.setItem("langCode", langCode.toString());
    if (langCode === "ar") {
      this.currentLang.set("ar");
      this.position.set("right");
    }
    if (langCode === "en") {
      this.currentLang.set("en");
      this.position.set("left");
    }
  }
}
