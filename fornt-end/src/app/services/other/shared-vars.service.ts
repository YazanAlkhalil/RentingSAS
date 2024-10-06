import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SharedVarsService {
  // Staging
  readonly baseURL = "http://localhost:1337/api";

  readonly wss = "wss://dev.takkeh-app.com/api";

  // Prod
  // readonly baseURL = window.location.origin + "/api";
  // readonly wss = "wss://" + window.location.host + "/api";

  readonly appId = "Renting";
  readonly JS_Key = "bd0288506e720b0dd9d12012aff36de2";
  readonly REST_Key = "44e7a303f56c5ddab40d8523b9a99199";

  readonly loaderString =
    "data:image/jpeg;base64,/9j/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////";
}
