import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {UserService} from "../auth/user.service";
import {catchError, switchMap, throwError} from "rxjs";

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
	const userService = inject(UserService);
	const token = userService.token;

	if (!token) return next(req);

	if (isRefreshing) return refreshAndProceed(userService, req, next);

	return next(addToken(req, token))
		.pipe(
			catchError(err => {
				if (err.status === 401) {
					return refreshAndProceed(userService, req, next);
				}

				return throwError(err);
			})
		)
}

const refreshAndProceed = (userService: UserService, req: HttpRequest<any>, next: HttpHandlerFn) => {
	if (!isRefreshing) {
		isRefreshing = true;

		return userService.refreshAuthToken()
			.pipe(
				switchMap((value) => {
					isRefreshing = false;
					return next(addToken(req, value.access_token));
				}),
				catchError(err => {
					isRefreshing = false;
					return throwError(() => err);
				})
			)
	}

	return next(addToken(req, userService.refresh_token!));
}

const addToken = (req: HttpRequest<any>, token: string) => {
	return req.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`
		}
	})
}