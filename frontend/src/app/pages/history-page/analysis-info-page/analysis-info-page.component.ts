import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {AnalysisInfo, AnalysisService} from "../../../services/analysis.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {catchError, EMPTY} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-analysis-info-page',
  imports: [
    ButtonComponent,
    RouterLink,
    DatePipe
  ],
  templateUrl: './analysis-info-page.component.html',
  styleUrl: './analysis-info-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisInfoPageComponent implements OnInit {
  private analysisService = inject(AnalysisService);
  private route = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private destroy = inject(DestroyRef);

  protected analysisInfo = signal<null | AnalysisInfo>(null);

  ngOnInit() {
    this.spinner.show();
    this.analysisService.getAnalysisInfo(this.route.snapshot.url[1].path)
      .pipe(
        takeUntilDestroyed(this.destroy),
        catchError(err => {
          if (err.status === 403) {
            this.router.navigateByUrl('/');
            this.spinner.hide();
          }
          return EMPTY;
        })
      )
      .subscribe(value => {
        this.analysisInfo.set(value);
        this.spinner.hide();
      })
  }

  protected getPurpose() {
    switch (this.analysisInfo()?.purpose) {
      case 'CAR': return 'Покупка авто';
      case 'BUSINESS': return 'Бизнес';
      case 'DEBTCONSOLIDATION': return 'Погашение кредита';
      case 'HOUSE': return 'Покупка жилья';
      case 'TRIP': return 'Путешествие';
      case 'EDUCATION': return 'Образование';
      case 'HOMEIMPROVEMENT': return 'Ремонт дома';
      case 'MAJORPURCHASE': return 'Крупная покупка';
      case 'MEDICAL': return 'Медицина';
      case 'MOVING': return 'Переезд';
      case 'OTHER': return 'Прочее';
      case 'SMALLBUSINESS': return 'Малый бизнес';
      case 'VACATION': return 'Отпуск';
      case 'WEDDING': return 'Свадьба';
      default: return '';
    }
  }
}
