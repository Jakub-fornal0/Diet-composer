import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './materialUI/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth-token-interceptor';
import { ProductsModule } from './layouts/products/products.module';
import { ScheduleModule } from './layouts/schedule/schedule.module';
import { RecipesModule } from './layouts/recipes/recipes.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { HomeComponent } from './layouts/home/home.component';
import { AccountSettingsModule } from './layouts/account-settings/account-settings.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavbarComponent,
    HomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ProductsModule,
    ScheduleModule,
    RecipesModule,
    AccountSettingsModule,
    CoreModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
