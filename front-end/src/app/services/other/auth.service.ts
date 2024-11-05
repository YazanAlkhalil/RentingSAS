import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Session, User,Query,Role , } from "parse";

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


  
  // sessionToken: string = localStorage.getItem('sessionToken') || '';
  // user!: any;
  // async logIn(username: string, password: string): Promise<any> {
  //   try {
  //     const user: any = await firstValueFrom(this.http.post('http://localhost:1337/parse/login', {
  //       username,
  //       password
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     }));
  //     if (user?.sessionToken) {
  //       this.sessionToken = user.sessionToken;
  //       localStorage.setItem('sessionToken', this.sessionToken);
  //       console.log(this.sessionToken, 'sessionToken');
  //       this.user = user;
  //     }
  //     return user;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // async logOut() {
  //   this.http.post('http://localhost:1337/parse/logout', {}, {
  //   })
  //   this.sessionToken = '';
  // }

  // async isLoggedIn(): Promise<boolean> {
  //   if (this.sessionToken) {
  //     return true;
  //   }

  //   this.router.navigate(["/login"]);
  //   return false;
  // }

  // getCurrentUser(): User | undefined {
  //   return this.user;
  // }

  // getUsername(): string | undefined {
  //   return this.user ? this.user.username : "";
  // }


  // async isAdmin(): Promise<boolean> {
  //   try {
  //     const response = await firstValueFrom(
  //       this.http.post<{ result: boolean }>('http://localhost:1337/parse/functions/isAdmin', {
  //         user: this.user
  //       },
  //       {
  //         headers: {
  //           'X-Parse-Session-Token': this.sessionToken
  //         }
  //       }
  //     )
  //     );
  //     return response.result;
  //   } catch (error) {
  //     console.error('Error checking user role:', error);
  //     return false;
  //   }
  // }
}