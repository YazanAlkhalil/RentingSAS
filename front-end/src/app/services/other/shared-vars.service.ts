import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SharedVarsService {
  // Staging
  // readonly baseURL = "https://renting.90-soft.com/api";

  // readonly wss = "wss://dev.takkeh-app.com/parse";

  // // Prod
  // // readonly baseURL = window.location.origin + "/api";
  // // readonly wss = "wss://" + window.location.host + "/api";

  // readonly appId = "bM9f39TlvXy3S52z56kDIlzMO";
  // readonly JS_Key = "OxmP73vb9H3St83gzr4guLQzm";
  // readonly REST_Key = "VI0JOEklaPZ3QlzMZ637WT03U";




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
