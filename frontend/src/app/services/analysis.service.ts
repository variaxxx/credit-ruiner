import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {environments} from "../../environments/environments";
import {FormGroup} from "@angular/forms";

export type YearsInJobT = '<1' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '>10'
export type HomeOwnershipT = 'MORTGAGE' | 'OWN' | 'RENT';
export type TermT = 'SHORT' | 'LONG';
export type PurposeT =
	'BUSINESS' |
	'CAR' |
	'HOUSE' |
	'DEBTCONSOLIDATION' |
	'EDUCATION' |
	'HOMEIMPROVEMENT' |
	'MAJORPURCHASE' |
	'MEDICAL' |
	'MOVING' |
	'TRIP' |
	'VACATION' |
	'WEDDING' |
	'SMALLBUSINESS' |
	'OTHER';

export interface AnalysisInfo {
	id: number,
	name: string,
	date: string,
	current_loan_amount: number,
	term: TermT,
	years_in_job: YearsInJobT,
	home_ownership: HomeOwnershipT,
	annual_income: number,
	purpose: PurposeT,
	monthly_debt: number,
	years_of_credit_history: number,
	months_since_delinquent: number,
	number_of_accounts: number,
	number_of_problems: number,
	current_credit_balance: number,
	bankruptcies: number,
	tax_liens: number,
	loan_status: number,
	success_percentage: number
}

export interface AnalysisRequest {
	name: string,
	current_loan_amount: number,
	term: TermT,
	years_in_job: YearsInJobT,
	home_ownership: HomeOwnershipT,
	annual_income: number,
	purpose: PurposeT,
	monthly_debt: number,
	years_of_credit_history: number,
	months_since_delinquent: number,
	number_of_accounts: number,
	number_of_problems: number,
	current_credit_balance: number,
	bankruptcies: number,
	tax_liens: number
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

	public doAnalysis(payload: AnalysisRequest) {
		const fd = new FormData();
		for (const key in payload) {
			fd.append(key, payload[key as keyof AnalysisRequest].toString());
		}
		return this.http.post<AnalysisShortInfo>(`${environments.apiBaseUrl}/analysis/`, fd)
			.pipe(
				catchError(err => {
					throw err;
				})
			)
	}
}
