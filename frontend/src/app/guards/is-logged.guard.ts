import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {UserService} from "../auth/user.service";

export const isLoggedGuard: CanActivateFn = (route, state) => {
	if (inject(UserService).isUserLoggedIn.value) return true;
	return inject(Router).navigateByUrl('/auth/login');
}