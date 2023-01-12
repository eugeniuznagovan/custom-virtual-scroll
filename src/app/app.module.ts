import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TcVirtualScrollComponent } from './tc-virtual-scroll/tc-virtual-scroll.component';

@NgModule({
  declarations: [
    AppComponent,
    TcVirtualScrollComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
