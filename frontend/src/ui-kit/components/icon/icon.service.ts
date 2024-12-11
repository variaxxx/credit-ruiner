import {inject, Injectable, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';

export interface IconsConfig {
  assetsPath: string;
  icons: readonly string[]
}

export const provideIcons = (config: IconsConfig) => {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {inject(IconService).initIcons(config)})
  ])
}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  initIcons(config: IconsConfig) {
    console.log('initialized icons...');
  }
}
