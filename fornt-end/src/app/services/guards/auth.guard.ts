import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../other/auth.service";

export const authGuard: CanActivateChildFn = async (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(["login"]);
};
