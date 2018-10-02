import {Component, OnInit, OnDestroy, OnChanges, SimpleChange, ElementRef} from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';

import * as D3 from 'd3';
import { Observable, Subscription, fromEvent } from 'rxjs';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export abstract class D3Base implements OnInit, OnDestroy, OnChanges {

  margin: Margin = {top: 0, right: 0, bottom: 0, left: 0};
  svg: any;//D3.Selection<any>;
  chart: any;//D3.Selection<any>;

  containerWidth: number = 0;
  containerHeight: number = 0;
  chartWidth: number = 0;
  chartHeight: number = 0;

  resize$: Observable<Window>;
  resize$Subscription: Subscription;

  constructor(private element: ElementRef) {}

  ngOnInit() {

    // Create base d3 dom nodes
    this.svg = D3.select(this.element.nativeElement).append('svg');
    this.chart = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Attach to window resize
    this.resize$ = fromEvent<Window>(window, 'resize')
        .pipe(
            debounceTime(100)
        )

        

    // When window resizes calculate sizes and re-render
    this.resize$Subscription = this.resize$.subscribe(() => {
      this.resize();
      this.render();
    });

    // On first run
    this.resize(); // to get size of container
    this.init(); // setup axis and more
    this.render(); // render the chart
  }

  ngOnDestroy() {
    this.resize$Subscription.unsubscribe();
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    // if changes are pushed we need to re-render
    if (this.chart) {
      this.render();
    }
  }

  /**
   * Calculate the size of the container so that the chart fits
   */
  protected resize(): void {
    this.containerWidth = Math.abs(this.element.nativeElement.offsetWidth);
    this.containerHeight = Math.abs(this.element.nativeElement.offsetHeight);
    this.chartWidth = this.containerWidth - this.margin.left - this.margin.right;
    this.chartHeight = this.containerHeight - this.margin.top - this.margin.bottom;
  }

  /**
   * Initialize the D3 chart components
   * In this method we should do the one time setup stuff
   */
  abstract init(): void;

  /**
   * Render the chart using enter(), transition(), exit()
   */
  abstract render(): void;

}
