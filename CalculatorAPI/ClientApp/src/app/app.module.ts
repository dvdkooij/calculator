import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu.component';
import { CalculatorComponent } from './components/calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CalculatorComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: CalculatorComponent, pathMatch: 'full' },    
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
