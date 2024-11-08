import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../other/auth.service";

export const adminGuard: CanActivateChildFn = async (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);   
  if (await authService.isAdmin()) {
    return true;
  }
  console.log("admin guard");
  
  return router.createUrlTree(["login"]);
};
