import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { authGuard } from "./services/guards/auth.guard";
import { AuthComponent } from "./components/shared/auth/auth.component";
import { AdminLayoutComponent } from "./components/layouts/admin-layout/admin-layout.component";
import { adminGuard } from "./services/guards/admin.guard";

export const routes: Routes = [
  {
    path: "",
    component: AppComponent,
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("./components/shared/auth/auth.component").then(
            (m) => m.AuthComponent
          ),
      },
      {
        path: "admin",
        loadComponent: () =>
          import("./components/layouts/admin-layout/admin-layout.component").then(
            (m) => m.AdminLayoutComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: "main",
        // canActivate: [authGuard],
        // canActivateChild: [authGuard],
        loadComponent: () =>
          import("./components/layouts/main-layout/main-layout.component").then(
            (m) => m.MainLayoutComponent
          ),
          children:[
            {
              path:"buildings",
              loadComponent: () => 
                import('./pages/buildings/buildings.component').then(
                  (m) => m.BuildingsComponent
                )
            },
            {
              path:'users',
              loadComponent: () => 
                import('./pages/users/users.component')
              .then( (m) => m.UsersComponent )
            }
          ]
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
