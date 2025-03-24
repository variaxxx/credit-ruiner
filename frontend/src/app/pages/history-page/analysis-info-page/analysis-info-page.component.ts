import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {AnalysisInfo, AnalysisService} from "../../../services/analysis.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ButtonComponent} from "../../../../ui-kit/components/button/button.component";
import {catchError, EMPTY} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NotificationService} from "../../../services/notification.service";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-analysis-info-page',
	imports: [
		ButtonComponent,
		RouterLink,
		JsonPipe
	],
  templateUrl: './analysis-info-page.component.html',
  styleUrl: './analysis-info-page.component.scss'
})
export class AnalysisInfoPageComponent implements OnInit {
  private analysisService = inject(AnalysisService);
  private route = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private destroy = inject(DestroyRef);
  private notificationService = inject(NotificationService);

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
}
