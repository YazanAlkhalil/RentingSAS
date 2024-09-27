import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Session, User,Query,Role } from "parse";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private router: Router) {}

  async logIn(username: string, password: string): Promise<User> {
    return await User.logIn(username, password);
  }

  async logOut(): Promise<User> {
    return await User.logOut();
  }

  async isLoggedIn(): Promise<boolean> {
    if (User.current()) {
      try {
        await Session.current();
      } catch (error) {
        return false;
      }
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }

  getCurrentUser(): User | undefined {
    return User.current();
  }

  getUsername(): string | undefined {
    return User.current() ? User.current()!.getUsername() : "";
  }


  async isAdmin(): Promise<boolean> {
    try {
        const user = this.getCurrentUser();
        const query = new Query(Role);
        query.equalTo("users", user);
        const roles = await query.find();
        return roles.some(role => role.getName() === "admin");
    } catch (error) {
        console.error('Error checking user role:', error);
        return false;
    }
  }
}