import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SharedVarsService {
  // Staging
  readonly baseURL = "https://dev.takkeh-app.com/api";
  readonly wss = "wss://dev.takkeh-app.com/api";

  // Prod
  // readonly baseURL = window.location.origin + "/api";
  // readonly wss = "wss://" + window.location.host + "/api";

  readonly appId = "Takkeh";
  readonly JS_Key = "b9zywEW1qSj2X6R0YvsQl5UH8";
  readonly REST_Key = "yiUJbuTh64Fz76ht70mC534ar";

  readonly loaderString =
    "data:image/jpeg;base64,/9j/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////";
}
