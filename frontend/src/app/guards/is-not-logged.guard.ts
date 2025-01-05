import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {UserService} from "../auth/user.service";

export const isNotLoggedGuard: CanActivateFn = (route, state) => {
	if (!inject(UserService).isUserLoggedIn) return true;
	return inject(Router).navigateByUrl('/');
}