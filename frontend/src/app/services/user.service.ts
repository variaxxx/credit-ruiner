import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, switchMap, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environments} from "../../environments/environments";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

export interface UserModel {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface EditProfileData {
  name?: string,
  email?: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  public token: string | null = null;
  public refresh_token: string | null = null;
  private user = new BehaviorSubject<UserData | null>(null);
  public $user = this.user.asObservable();

  /**
   * Выполняет авторизацию пользователя.
   * @param {LoginForm} payload Данные для авторизации: email и пароль.
   * @returns {Observable<TokenResponse>} Observable с токенами доступа.
   */
  public login(payload: LoginForm): Observable<TokenResponse> {
    const fd = new FormData();
    fd.append('email', payload.email);
    fd.append('password', payload.password);

    return this.http.post<TokenResponse>(`${environments.apiBaseUrl}/auth/login`, fd)
      .pipe(
        tap(value => {this.saveTokens(value)}),
        catchError(err => {
          throw err;
        })
      )
  }

  /**
   * Регистрирует нового пользователя.
   * @param {UserModel} info Данные для регистрации: имя, email и пароль.
   * @returns {Observable<any>} Observable с результатом запроса.
   */
  public registration(info: UserModel): Observable<any> {
    const fd = new FormData();
    fd.append('name', info.name);
    fd.append('email', info.email);
    fd.append('password', info.password);

    return this.http.post<TokenResponse>(`${environments.apiBaseUrl}/auth/register`, fd)
      .pipe(
        tap(value => {
          this.saveTokens(value);
        }),
        catchError(err => {
          throw err;
        })
      )
  }

  /**
   * Завершает текущую сессию пользователя.
   * Удаляет токены и перенаправляет на страницу входа.
   */
  public logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refresh_token = null;
    this.user.next(null);
    this.router.navigateByUrl('/welcome');
  }

  /**
   * Сохраняет токены доступа в cookies.
   * @param {TokenResponse} value Токены доступа (access_token и refresh_token).
   */
  private saveTokens(value: TokenResponse) {
    this.token = value.access_token;
    this.refresh_token = value.refresh_token;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 30);

    this.cookieService.set('token', this.token, expiresDate, '/');
    this.cookieService.set('refresh_token', this.refresh_token, expiresDate, '/');
  }

  /**
   * Обновляет токены с помощью refresh_token.
   * Если обновление не удалось, выполняет выход из системы.
   * @returns {Observable<TokenRefreshResponse>} Observable с новыми токенами.
   */
  public refreshAuthToken(): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(
      `${environments.apiBaseUrl}/auth/refresh`,
      null,
      { headers: {
          Authorization: `Bearer ${this.refresh_token}`
        }}
      )
      .pipe(
        tap(value => {
          this.token = value.access_token;
          this.cookieService.set('token', this.token);
        }),
        catchError(err => {
          this.logout();
          return throwError(() => err);
        })
      )
  }

  /**
   * Проверяет, авторизован ли пользователь.
   * @returns {boolean} `true`, если пользователь авторизован; иначе `false`.
   */
  get isUserLoggedIn(): boolean {
    if (!this.token) {
      this.getTokensFromCookies();
    }

    return !!this.token;
  }

  /**
   * Записывает в переменные token и refresh_token значения соответствующих токенов, полученные из cookie.
   * @private
   */
  private getTokensFromCookies() {
    this.token = this.cookieService.get('token');
    this.refresh_token = this.cookieService.get('refresh_token');
  }

  /**
   * Получает информацию о текущем пользователе с сервера.
   * @returns {Observable<UserData>} Observable с данными пользователя.
   */
  public getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${environments.apiBaseUrl}/account/me`)
      .pipe(
        tap(value => {
          this.user.next(value);
          console.log('Successfully fetched user info.')
        }),
        catchError(err => {
          throw new Error('Error fetching user info');
        })
      )
  }

  /**
   * Изменяет информацию о пользователе. Принимает в себя объект с полями name и email.
   * @returns {Observable<UserData>} Observable с данными пользователя.
   */
  public editProfile(data: EditProfileData) {
    const fd = new FormData();
    if (data.name) {
      fd.append('name', data.name);
    }
    if (data.email) {
      fd.append('email', data.email);
    }

    return this.http.patch<UserData>(`${environments.apiBaseUrl}/account/me/edit`, fd)
      .pipe(
        tap(value => {
          this.user.next(value);
          console.log('Successfully edited user info.')
        }),
        catchError(err => {
          throw new Error('Error while trying to edit profile info');
        })
      )
  }
}
