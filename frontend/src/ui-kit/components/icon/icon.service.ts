import {inject, Injectable, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import {catchError, of, tap, zip} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

export interface IconsConfig {
  assetsPath: string;
  icons: readonly string[]
}

export const provideIcons = (config: IconsConfig) => {
  return makeEnvironmentProviders([
    provideAppInitializer(() => inject(IconService).initIcons(config))
  ])
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private httpClient = inject(HttpClient);
  private domSanitizer = inject(DomSanitizer);

  private iconsConfig!: IconsConfig;
  private record: Record<string, SafeHtml> = {};

  private registerAll(icons: readonly string[]) {
    return icons.map((icon: string) => this.registerFromAssets(icon))
  }

  private registerFromAssets(icon: string) {
    return this.httpClient.get(`${this.iconsConfig.assetsPath}${icon}.svg`, {responseType: 'text'}).pipe(
      tap(svg => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');

        const elements = doc.querySelectorAll('*');
        elements.forEach(element => {
          element.removeAttribute('fill');
          element.removeAttribute('stroke');
          element.removeAttribute('width');
          element.removeAttribute('height');
        })

        const serializer = new XMLSerializer();
        const modifiedSvg = serializer.serializeToString(doc.documentElement);

        this.record[icon] = this.domSanitizer.bypassSecurityTrustHtml(modifiedSvg);
      }),
      catchError((err) => {
        console.log(`Error loading ${icon}.svg:`, err);
        return of(undefined);
      })
    )
  }

  initIcons(config: IconsConfig) {
    this.iconsConfig = config;
    return zip(...this.registerAll(config.icons))
      .pipe(
        tap(() => {
          console.log('Icons initialized.')
        })
      )
  }

  get(icon: string) {
    return this.record[icon];
  }
}
