import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from "rxjs";
import {NotificationService} from "../services/notification.service";

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
	const userService = inject(UserService);
	const notificationService = inject(NotificationService);
	const token = userService.token;

	if (!token) return next(req);

	if (isRefreshing$.value) return refreshAndProceed(userService, req, next);

	return next(addToken(req, token))
		.pipe(
			catchError(err => {
				if (err.status === 401) {
					return refreshAndProceed(userService, req, next);
				}

				if (err.status != 403) {
					notificationService.throwError('Что-то пошло не так, повторите попытку позже.')
				} else {
					notificationService.throwError('У вас нет доступа.')
				}

				return throwError(err);
			})
		)
}

const refreshAndProceed = (userService: UserService, req: HttpRequest<any>, next: HttpHandlerFn) => {
	if (!isRefreshing$.value) {
		isRefreshing$.next(true);

		return userService.refreshAuthToken()
			.pipe(
				switchMap((value) => {
					return next(addToken(req, value.access_token))
						.pipe(
							tap(() => isRefreshing$.next(false)),
						)
				}),
				catchError(err => {
					isRefreshing$.next(false);
					return throwError(() => err);
				})
			)
	}

	if (req.url.includes('refresh')) return next(addToken(req, userService.refresh_token!));

	return isRefreshing$.pipe(
		filter(isRefreshing => !isRefreshing),
		switchMap(res => {
			return next(addToken(req, userService.token!));
		})
	)
}

const addToken = (req: HttpRequest<any>, token: string) => {
	return req.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`
		}
	})
}