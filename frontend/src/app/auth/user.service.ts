import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
