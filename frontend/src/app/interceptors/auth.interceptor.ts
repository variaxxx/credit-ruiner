import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from "rxjs";
import {NotificationService} from "../services/notification.service";

let isRefreshing$ = new BehaviorSubject<boolean>(false); // Создаем BehaviorSubject для контроля состояния обновления токена

// Интерсептор для авторизации
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService); // Внедряем сервис хранящий токены
  const notificationService = inject(NotificationService); // Внедряем сервис для отправки уведомлений клиенту
  const token = userService.token; // Достаем токен из сервиса

  if (!token) return next(req); // Если токена нет, то отправляем запрос без авторизации

  if (isRefreshing$.value) return refreshAndProceed(userService, req, next); // Если обновляемся, то отправляем запросы в копилку

  return next(addToken(req, token))
    .pipe(
      catchError(err => {
        if (err.status === 401) { // Ловим ошибку с "протухшим" токеном
          return refreshAndProceed(userService, req, next); // Отправляемся на обновление токена
        }

        // Ловим различные ошибки для вывода сообщений клиенту
        if (err.status === 0) {
          notificationService.throwError('В данный момент сервер недоступен.')
        } else if (err.status === 403) {
          notificationService.throwError('У вас нет доступа.')
        } else {
          notificationService.throwError('Что-то пошло не так, повторите попытку позже.')
        }
        return throwError(err);
      })
    )
}

// Функция для обновления токена
const refreshAndProceed = (userService: UserService, req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!isRefreshing$.value) { // Если в данный момент не обновляемся, то необходимо отправить запрос на обновление
    isRefreshing$.next(true);

    return userService.refreshAuthToken() // Отправляем запрос на /refresh
      .pipe(
        switchMap((value) => {
          return next(addToken(req, value.access_token)) // Когда пришел ответ переотправляем запрос с новым токеном
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

  if (req.url.includes('refresh')) return next(addToken(req, userService.refresh_token!)); // Если это запрос на обновление токена, то отправляем его

  return isRefreshing$.pipe( // Иначе копим запросы и отправляем их только когда isRefreshing станет false
    filter(isRefreshing => !isRefreshing),
    switchMap(() => {
      return next(addToken(req, userService.token!));
    })
  )
}

// Функция добавляющая header Authorization
const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
