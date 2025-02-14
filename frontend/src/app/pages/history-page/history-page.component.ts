import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {RouterLink} from "@angular/router";
import {
  AnalysisHistoryResponse,
  AnalysisService,
} from "../../services/analysis.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DatePipe} from "@angular/common";
import {BehaviorSubject, delay, switchMap, throttleTime} from "rxjs";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";

@Component({
  selector: 'app-history-page',
  imports: [
    ButtonComponent,
    RouterLink,
    DatePipe,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss'
})
export class HistoryPageComponent implements OnInit {
  private analysisService = inject(AnalysisService);
  private destroy = inject(DestroyRef);

  protected currentPage = new BehaviorSubject<number>(1);
  protected pageSize = 12;
  protected history = signal<AnalysisHistoryResponse | undefined>(undefined);
  protected isFetching = signal<boolean>(true);

  ngOnInit() {
    this.currentPage
      .pipe(
        throttleTime(500),
        delay(1000), // TODO remove delay
        takeUntilDestroyed(this.destroy),
        switchMap(value => this.getHistory())
      )
      .subscribe({
        next: value => {
          this.history.set(value);
          this.isFetching.set(false);
        },
        error: err => {
          this.prevPage();
          this.isFetching.set(false);
        }
      })
  }

  protected prevPage() {
    if (!this.isFirstPage()) {
      this.currentPage.next(this.currentPage.value - 1);
    }
  }

  protected nextPage() {
    if (!this.isLastPage()) {
      this.currentPage.next(this.currentPage.value + 1);
    }
  }

  protected isFirstPage() {
    return this.currentPage.value == 1;
  }

  protected isLastPage() {
    const pages = this.history()?.pages;
    const page = this.history()?.page;
    return page && pages && page == pages;
  }

  private getHistory() {
    this.isFetching.set(true);
    return this.analysisService.getHistory(this.currentPage.value, this.pageSize);
  }
}
