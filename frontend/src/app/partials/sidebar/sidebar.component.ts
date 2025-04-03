import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, DestroyRef, ElementRef,
    HostListener,
    inject,
    OnInit, signal
} from '@angular/core';
import {IconComponent} from "../../../ui-kit/components/icon/icon.component";
import {Router, RouterLink} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import {UserService} from "../../services/user.service";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
    selector: 'app-sidebar',
    imports: [
      IconComponent,
      RouterLink,
      NgxSpinnerModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
    private router = inject(Router);
    private navigationService = inject(NavigationService);
    private userService = inject(UserService);
    private cdr = inject(ChangeDetectorRef);
    private el = inject(ElementRef);
    private spinner = inject(NgxSpinnerService);
    private destroyRef = inject(DestroyRef);

    public menuTranslate = this.navigationService.hideSidebar.value ? '-80px' : '0'
    protected username = signal<string | undefined>(undefined);
    protected email = signal<string | undefined>(undefined);
    protected menuItems = this.navigationService.menuItems;

    @HostListener('window:resize', ['$event']) onResize() {
        this.navigationService.hideSidebar.next(window.innerWidth <= 540);
        this.updateMenuTranslate();
    }

    @HostListener('document:click', ['$event']) onClick(event: Event) {
        if (window.innerWidth <= 540 && !this.navigationService.hideSidebar.value) {
            const clickedOnSidebar = this.el.nativeElement.contains(event.target);
            if (!clickedOnSidebar) {
                this.triggerSidebar();
            }
        }
    }

    ngOnInit() {
        this.spinner.show();

        this.navigationService.hideSidebar$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(value => {
            this.updateMenuTranslate();
            this.cdr.markForCheck();
        })

        if (!this.router.url.startsWith('/profile')) {
            this.userService.getUser()
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(value => {
                  this.spinner.hide();
              });
        }

        this.userService.$user
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(value => {
              this.username.set(value?.name);
              this.email.set(value?.email);
          })
    }

    private updateMenuTranslate() {
        this.menuTranslate = this.navigationService.hideSidebar.value ? '-80px' : '0';
    }

    public activeRoute() {
        return this.router.url;
    }

    public logout() {
        this.triggerSidebar();
        this.userService.logout();
    }

    public triggerSidebar() {
        this.navigationService.triggerSidebar();
    }

    public getShadowOpacity() {
        return this.navigationService.hideSidebar.value ? '0' : '1';
    }
}
