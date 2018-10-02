import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DonutChartComponent } from './components/donut/donut.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { TimelineChartComponent } from './components/timeline-chart/timeline-chart.component';
import { ScatteredChartComponent } from './components/scattered-chart/scattered-chart.component';
import { TableNewFixedComponent } from './components/table-fix/table-new-fix.component';
//import { TableFixedComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    DonutChartComponent,
    TimelineChartComponent,
    ScatteredChartComponent,
    TableNewFixedComponent
  ],
  imports: [
BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
