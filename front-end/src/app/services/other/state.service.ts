import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private _sidebarVisible = signal(false);

  curentComponentTitle = signal("");

  constructor() {}

  public get sidebarVisible(): boolean {
    return this._sidebarVisible();
  }
  public set sidebarVisible(v: boolean) {
    this._sidebarVisible.set(v);
  }
}
