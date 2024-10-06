import { Injectable } from "@angular/core";
import parse, { CoreManager, Object } from "parse";


@Injectable({
  providedIn: "root",
})
export class BackendService {
  constructor() {}
  init(
    url: string,
    appID: string,
    javascriptKey: string,
    liveQueryURL: string
  ): void {
    /*Initialize Parse*/
    parse.initialize(appID, javascriptKey);
    parse.serverURL = url;
    parse.liveQueryServerURL = liveQueryURL;

    parse.enableEncryptedUser();
    parse.secret = javascriptKey;

    CoreManager.set("REQUEST_HEADERS", {
      "Content-Type": "application/json",
    });
    CoreManager.set("REQUEST_ATTEMPT_LIMIT", 1);
    CoreManager.set("certificatePin", false);
    CoreManager.set("certificatePinning", false);

  }
}
