
import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { HARDCODED_DATA } from './../data/static-data';
import { Margin } from './../charts/charts-base';
import * as D3 from "d3";
import d3Tip from "d3-tip" // works
import { ElementRef } from '@angular/core';
import { element } from 'protractor';


@Component({
    selector: 'scattered-chart',
    template: `<div class="chart-area" #containerPieChart></div>`,
    styleUrls: ['./scattered-chart.component.css']
})

export class ScatteredChartComponent implements OnInit, AfterViewInit{
    @ViewChild("containerPieChart") element: ElementRef;
    private data = HARDCODED_DATA.BAR_DATA;
    private svg:any;
    private margin:Margin;
    private dimension = {
        width: 0,
        height: 0
    }
    private axis = {
        x: null,
        y: null,
        xCall:null,
        yCall:null,
        xAxis:null,
        yAxis:null
    }
    private area:any;
    private stack:any;
    tip:any;
    color:any;
    parseDate = D3.timeParse('%Y');
    formatSi = D3.format(".3s");
    formatNumber = D3.format(".1f");

    constructor(){}

    ngOnInit(){}

    ngAfterViewInit(){
        let that = this;
        let w = this.element.nativeElement.offsetWidth;
        let h = this.element.nativeElement.offsetHeight;
        this.margin = { left:80, right:50, top:20, bottom:50 };

        this.dimension.width = w - this.margin.left - this.margin.right,
        this.dimension.height = h - this.margin.top - this.margin.bottom;

        this.axis.x = D3.scaleTime()
        .range([0, this.dimension.width]);

        this.axis.y = D3.scaleLinear()
            .range([this.dimension.height, 0]);

        this.color = D3.scaleOrdinal(D3.schemeCategory10);

        this.axis.xAxis = D3.axisBottom(this.axis.x)

        this.axis.yAxis = D3.axisLeft(this.axis.y)
            .tickFormat(this.formatBillion);

        this.area = D3.area()
            .x((d:any) => this.axis.x(d.data.date))
            .y0((d:any) => this.axis.y(d[0]))
            .y1((d:any) => this.axis.y(d[1]));
    
        this.stack = D3.stack()
    
        this.svg = D3.select(this.element.nativeElement).append('svg')
            .attr('width', this.dimension.width + this.margin.left + this.margin.right)
            .attr('height', this.dimension.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // D3.csv('./assets/data/stacked_area2.csv')
        //     .then( (data)=>{
                let d = HARDCODED_DATA.STACKED_CHART;
                d['columns'] = that.getColumns(d[0]);
                that.updateChart(d);
            // })
    }

    updateChart(data){
        let that = this;
        this.color.domain(D3.keys(data[0]).filter(function(key) {
            return key !== 'date'; 
        }));
        
        var keys = data.columns.filter(function(key) { return key !== 'date'; })
        
        data.forEach(function(d) {
            d.date = that.parseDate(d.date); 
        });
        
        //let tsvData = (function(){ return data; })();

        var maxDateVal = D3.max(data, function(d){
            var vals = D3.keys(d).map(function(key){ 
                return key !== 'date' ? d[key] : 0 
            });
            return D3.sum(vals);
        });

        // Set domains for axes
        this.axis.x.domain(D3.extent(data, function(d:any) { return d.date; }));
        this.axis.y.domain([0, maxDateVal])

        this.stack.keys(keys);

        this.stack.order(D3.stackOrderNone);
        this.stack.offset(D3.stackOffsetNone);

        var browser = this.svg.selectAll('.browser')
            .data(this.stack(data))
            .enter().append('g')
            .attr('class', function(d){ return 'browser ' + d.key; })
            .attr('fill-opacity', 0.5);

        browser.append('path')
            .attr('class', 'area')
            .attr('d', this.area)
            .style('fill', function(d) { return that.color(d.key); });

        browser.append('text')
            .datum(function(d) { return d; })
            .attr('transform', function(d) {
                return 'translate(' + that.axis.x(data[13].date) + ',' + that.axis.y(d[13][1]) + ')'; 
            })
            .attr('x', -6) 
            .attr('dy', '.35em')
            .style("text-anchor", "start")
            .text(function(d) { return d.key; })
                .attr('fill-opacity', 1);

        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.dimension.height + ')')
            .call(this.axis.xAxis);

        this.svg.append('g')
            .attr('class', 'y axis')
            .call(this.axis.yAxis);

        this.svg.append ("text")
            .attr("x", 0-this.margin.left)
            .text("Billions of liters")
    }

    formatBillion(x){
        let formatNumber = D3.format(".1f");
        return formatNumber(x / 1e9);
    }

    getColumns(record){
        let col = [];
        for(let item in record) col.push(item);
        return col;
    }    
}