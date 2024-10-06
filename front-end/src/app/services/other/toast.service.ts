import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showToast(
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ): void {
    this.messageService.add({ severity, summary, detail });
  }

  showToast_success(): void {
    this.showToast("success", "Success", "Save Successfuly");
  }
  showToast_error(error: string): void {
    this.showToast("error", "Error", error);
  }
}
