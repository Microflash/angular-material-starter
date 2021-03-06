import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  NgModule,
  OnInit,
  OnDestroy
} from "@angular/core";
import { StyleManager } from "./style-manager/style-manager";
import { ThemeStorage, SiteTheme } from "./theme-storage/theme-storage";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";

@Component({
  selector: "theme-picker",
  templateUrl: "theme-picker.html",
  styleUrls: ["theme-picker.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { "aria-hidden": "true" }
})
export class ThemePicker implements OnInit, OnDestroy {
  private _queryParamSubscription = Subscription.EMPTY;
  currentTheme: SiteTheme;

  themes: SiteTheme[] = [
    {
      primary: "#FAFAFA",
      accent: "#FAFAFA",
      name: "light",
      isDark: false,
      isDefault: true
    },
    {
      primary: "#303030",
      accent: "#303030",
      name: "dark",
      isDark: true
    }
  ];

  constructor(
    public styleManager: StyleManager,
    private _themeStorage: ThemeStorage,
    private _activatedRoute: ActivatedRoute
  ) {
    this.installTheme(this._themeStorage.getStoredThemeName());
  }

  ngOnInit() {
    this._queryParamSubscription = this._activatedRoute.queryParamMap
      .pipe(
        map(params => params.get("theme")),
        filter(Boolean)
      )
      .subscribe(themeName => this.installTheme(themeName));
  }

  ngOnDestroy() {
    this._queryParamSubscription.unsubscribe();
  }

  installTheme(themeName: string) {
    const theme = this.themes.find(
      currentTheme => currentTheme.name === themeName
    );

    if (!theme) {
      return;
    }

    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManager.removeStyle("theme");
    } else {
      this.styleManager.setStyle("theme", `assets/${theme.name}.css`);
    }

    if (this.currentTheme) {
      this._themeStorage.storeTheme(this.currentTheme);
    }
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule,
    CommonModule
  ],
  exports: [ThemePicker],
  declarations: [ThemePicker],
  providers: [StyleManager, ThemeStorage]
})
export class ThemePickerModule {}
