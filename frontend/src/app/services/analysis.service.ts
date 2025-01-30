import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {environments} from "../../environments/environments";

export interface AnalysisInfo {
  id: number,
  name: string,
  date: string,
  person_age: number,
  person_income: number,
  person_home_ownership: string,
  person_emp_length: number,
  loan_intent: string,
  loan_grade: string,
  loan_amnt: number,
  loan_int_rate: number,
  loan_percent_income: number,
  cb_person_default_on_file: string,
  cb_person_cred_hist_length: number,
  loan_status: number,
  success_percentage: number
}

export interface AnalysisRequest {
  name: string,
  person_age: number,
  person_income: number,
  person_home_ownership: string,
  person_emp_length: number,
  loan_intent: string,
  loan_grade: string,
  loan_amnt: number,
  loan_int_rate: number,
  cb_person_default_on_file: string,
  cb_person_cred_hist_length: number
}

export interface AnalysisShortInfo {
  id: number,
  name: string,
  date: string,
  loan_status: number,
  success_percentage: number
}

export interface AnalysisHistoryResponse {
  count: number,
  page: number,
  pages: number,
  items: AnalysisShortInfo[]
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private http = inject(HttpClient);

  public getHistory(currentPage: number, pageSize: number): Observable<AnalysisHistoryResponse> {
    return this.http.get<AnalysisHistoryResponse>(`${environments.apiBaseUrl}/analysis/history?count=${pageSize}&page=${currentPage}`)
      .pipe(
        catchError((err) => {
          throw err;
        }),
        tap(value => console.log('Successfully fetched analysis history.'))
      )
  }

  public getAnalysisInfo(id: string) {
    return this.http.get<AnalysisInfo>(`${environments.apiBaseUrl}/analysis/history/${id}`)
      .pipe(
        catchError(err => {
          throw err;
        })
      )
  }

  public deleteAnalysisFromHistory(id: number) {
    return this.http.delete(`${environments.apiBaseUrl}/analysis/history/${id}`)
      .pipe(
        catchError(err => {
          throw err;
        })
      )
  }
}
