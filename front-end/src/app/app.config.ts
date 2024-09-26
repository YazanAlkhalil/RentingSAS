import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from "@angular/router";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ConfirmationService, MessageService } from "primeng/api";
import { routes } from "./app.routes";
import { ToastService } from "./services/other/toast.service";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation(), withViewTransitions()),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    MessageService,
    ToastService,
    // DynamicDialogConfig,
    ConfirmationService,
  ],
};
