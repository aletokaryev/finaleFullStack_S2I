import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [HttpClientModule, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
