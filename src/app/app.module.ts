import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TcVirtualScrollComponent } from './tc-virtual-scroll/tc-virtual-scroll.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TcItemComponent } from './tc-item/tc-item.component';

@NgModule({
  declarations: [
    AppComponent,
    TcVirtualScrollComponent,
    TcItemComponent
  ],
  imports: [
    BrowserModule,
    PerfectScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
