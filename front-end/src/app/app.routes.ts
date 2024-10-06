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
        canActivateChild: [adminGuard],
        children:[
            {
              path:"",
              loadComponent: () => 
                import('./components/table/table.component').then(
                  (m) => m.TableComponent
                )
            },
          ]
      },
      {
        path: "main",
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        loadComponent: () =>
          import("./components/layouts/main-layout/main-layout.component").then(
            (m) => m.MainLayoutComponent
          ),
          children:[
            {
              path:"",
              redirectTo: "buildings",
              pathMatch: "full"
            },
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
            },
            {
              path:'apartments',
              loadComponent: () => 
                import('./pages/apartments/apartments.component')
              .then( (m) => m.ApartmentsComponent )
            },
            // {
            //   path:'reports',
            //   loadComponent: () => 
            //     import('./pages/reports/reports.component')
            //   .then( (m) => m.ReportsComponent )
            // },
            {
              path:'clients',
              loadComponent: () => 
                import('./pages/clients/clients.component')
              .then( (m) => m.ClientsComponent )
            },
            {
              path:'contracts',
              loadComponent: () => 
                import('./pages/contracts/contracts.component')
              .then( (m) => m.ContractsComponent )
            },
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
