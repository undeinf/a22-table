import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as D3 from "d3";
import d3Tip from "d3-tip" // works

import { HARDCODED_DATA } from './../data/static-data';
import { Margin } from '../charts/charts-base';

@Component({
    selector: 'bar-chart',
    template: `<div class="chart-area" #containerPieChart></div>`,
    styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit, AfterViewInit{
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
        yCall:null
    }
    tip:any;
    color:any;

    constructor(){};

    ngOnInit(){}

    ngAfterViewInit(){
        let w = this.element.nativeElement.offsetWidth;
        let h = this.element.nativeElement.offsetHeight;
        this.margin = { left:50, right:20, top:20, bottom:30 };

        this.dimension.width = w - this.margin.left - this.margin.right,
        this.dimension.height = h - this.margin.top - this.margin.bottom;

        this.svg=D3.select(this.element.nativeElement)
            .append("svg") 
            .attr("width", this.dimension.width + this.margin.left + this.margin.right)
            .attr("height", this.dimension.height + this.margin.top + this.margin.bottom)
            
        
            // console.log(data);
            let data:any = this.data;
            // Clean data
            data.forEach(function(d) {
                d.revenue = +d.revenue;
            });
        
            // X Scale
            this.axis.x = D3.scaleBand()
                .domain(data.map((d)=>  d.month ))
                .range([0, this.dimension.width])
                .padding(0.2);
        
            // Y Scale
            let domainVal:any = [0, D3.max(data, function(d:any) { return d.revenue })]; 
            this.axis.y = D3.scaleLinear()
                .domain(domainVal)
                .range([this.dimension.height, 0]);
        
            // X Axis
            this.axis.xCall = D3.axisBottom(this.axis.x);
        
            // Y Axis
            this.axis.yCall = D3.axisLeft(this.axis.y)
                .tickFormat( (d:any)=>  "$" + d);

                //(D3 as any).tip = d3Tip;
            this.tip = d3Tip()
            this.tip
                .attr('class', 'd3-tip')
                .html(function (d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.revenue + "</span>";
                })
    
            this.svg.call(this.tip)   
            this.color = D3.scaleOrdinal(D3.schemeCategory10);

            this.updateChart(data);
    }

    updateChart(data){
        let that = this;
        var g = this.svg
            .append("g")
            .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");

        g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.dimension.height +")")
        .call(this.axis.xCall);

        // X Label
        g.append("text")
            .attr("y", this.dimension.height + 50)
            .attr("x", this.dimension.width / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Month");
        
        // Y Label
        g.append("text")
            .attr("y", -60)
            .attr("x", -(this.dimension.height / 2))
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Revenue");

        g.append("g")
            .attr("class", "y axis")
            .call(this.axis.yCall);

        // Bars
        var rects = g.selectAll("rect")
        .data(data)


        rects.enter()
            .append("rect")
            .attr("y",  (d:any) =>  this.axis.y(d.revenue) )
            .attr("x", (d:any) =>  this.axis.x(d.month) )
            .attr("height",  (d:any) =>  this.dimension.height - this.axis.y(d.revenue))
            .attr("width", this.axis.x.bandwidth)
            .attr("fill",  this.color)
            //  .attr("fill", function(d,i) { return colores_google(i); } );
            .on("mouseover", function(d){ that.tip.show(d, this)})
            .on("mouseout", function(d) { that.tip.hide(d, this)})
}
}


/*
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as D3 from "d3";
import { HARDCODED_DATA } from './../data/static-data';

@Component({
    selector: 'donut-chart',
    template: `<div id="chart-area" #containerPieChart>Donut Chart will display here</div>`,
    styleUrls: ['./donut.component.css']
})

export class BarChartComponent implements OnInit, AfterViewInit{
    @ViewChild("containerPieChart") element: ElementRef;
    private data = HARDCODED_DATA.BAR_DATA;

    constructor(){};

    ngOnInit(){}

    ngAfterViewInit(){
        let w = this.element.nativeElement.offsetWidth;
        let h = this.element.nativeElement.offsetHeight;
        let margin = { left:80, right:20, top:50, bottom:100 };

        let width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
            
        var g = D3.select(this.element.nativeElement)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        
        // X Label
        g.append("text")
            .attr("y", height + 50)
            .attr("x", width / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Month");
        
        // Y Label
        g.append("text")
            .attr("y", -60)
            .attr("x", -(height / 2))
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Revenue");
        
        //D3.json("data/revenues.json").then(function(data){
            // console.log(data);
            let data:any = this.data;
            // Clean data
            data.forEach(function(d) {
                d.revenue = +d.revenue;
            });
        
            // X Scale
            var x = D3.scaleBand()
                .domain(data.map((d)=>  d.month ))
                .range([0, width])
                .padding(0.2);
        
            // Y Scale
            let domainVal:any = [0, D3.max(data, function(d:any) { return d.revenue })]; 
            var y = D3.scaleLinear()
                .domain(domainVal)
                .range([height, 0]);
        
            // X Axis
            var xAxisCall = D3.axisBottom(x);
            g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height +")")
                .call(xAxisCall);
        
            // Y Axis
            var yAxisCall = D3.axisLeft(y)
                .tickFormat( (d:any)=>  "$" + d);

            g.append("g")
                .attr("class", "y axis")
                .call(yAxisCall);
        
            // Bars
            var rects = g.selectAll("rect")
                .data(data)
                
            rects.enter()
                .append("rect")
                    .attr("y",  (d:any) =>  y(d.revenue) )
                    .attr("x", (d:any) =>  x(d.month) )
                    .attr("height",  (d:any) =>  height - y(d.revenue))
                    .attr("width", x.bandwidth)
                    .attr("fill", "grey");
            //})        
    }
}
*/