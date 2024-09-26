import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { authGuard } from "./services/guards/auth.guard";
import { AuthComponent } from "./components/shared/auth/auth.component";

export const routes: Routes = [
  {
    path: "",
    component: AppComponent,
    children: [
      {
        path: "login",
        component: AuthComponent,
        // loadComponent: () =>
        //   import("./components/shared/auth/auth.component").then(
        //     (m) => m.AuthComponent
        //   ),
      },
      {
        path: "main",
        // canActivate: [authGuard],
        // canActivateChild: [authGuard],
        loadComponent: () =>
          import("./components/layouts/main-layout/main-layout.component").then(
            (m) => m.MainLayoutComponent
          ),
      },
      {
        path: "**",
        redirectTo: "main",
      },
      {
        path: "",
        redirectTo: "main",
        pathMatch: "prefix",
      },
    ],
  },
];
