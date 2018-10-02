import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { HARDCODED_DATA } from "../data/static-data";
import { Margin } from './../charts/charts-base';
import * as D3 from "d3";
import d3Tip from "d3-tip" // works


@Component({
    selector: 'timeline-chart',
    template: `<div class="chart-area" #containerPieChart>Donut Chart will display here</div>`,
    styleUrls: ['./timeline-chart.component.css']
})

export class TimelineChartComponent implements AfterViewInit{
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
        xAxis: null,
        xCall:null,
        yCall:null
    }
    private formatTime = D3.timeFormat("%d/%m/%Y");
    private parseTime = D3.timeParse("%d/%m/%Y");
    private calls:any;
    private allCalls:any;
    private 
    tip:any;;
    color:any;
    t:any;
    areaPath:any;
    dataFiltered:any;

    constructor(){}

    ngAfterViewInit(){
        let that = this
        D3.json("./assets/data/calls.json").then(function(data:any[]){    
            if(data && data.length > 0){
                data.forEach(function(d) {
                    d.date = that.parseTime(d.date);
                  });
                that.allCalls = data.filter(item => {
                    if(item.date) return true;
                });
                that.calls = that.allCalls;
                that.init();
            }
        });
    }

    init(){

        let w = this.element.nativeElement.offsetWidth;
        let h = this.element.nativeElement.offsetHeight;
        this.margin = { left:80, right:20, top:50, bottom:100 };

        this.dimension.width = w - this.margin.left - this.margin.right,
        this.dimension.height = h - this.margin.top - this.margin.bottom;

        this.svg = D3.select(this.element.nativeElement).append("svg")
        .attr("width", this.dimension.width + this.margin.left + this.margin.right)
        .attr("height", this.dimension.height + this.margin.top + this.margin.bottom)

        this.t = () => { return D3.transition().duration(1000); }

        let g = this.svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.axis.x = D3.scaleTime()
            .range([0, this.dimension.width]);

        this.axis.y = D3.scaleLinear()
            .range([this.dimension.height, 0]);

        this.axis.xCall = D3.axisBottom(this.axis.x)
            .ticks(4);

        this.axis.xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.dimension.height +")");

        this.areaPath = g.append("path")
            .attr("fill", "#ccc");

        // Initialize brush component
        let brush = D3.brushX()
            .handleSize(10)
            .extent([[0, 0], [this.dimension.width, this.dimension.height]])
            .on("brush end", ()=> {
                this.brushed();
            })

        // Append brush component
        let brushComponent = g.append("g")
            .attr("class", "brush")
            .call(brush);

        this.wrangleData();
    }

    wrangleData(){
        let that = this;
        let variable = "call_revenue"

        let dayNest = D3.nest()
            .key(function(d:any){ 
                return that.formatTime(d.date); 
            })
            .entries(this.calls)
    
        this.dataFiltered = dayNest
            .map(function(day){
                return {
                    date: day.key,
                    sum: day.values.reduce(function(accumulator, current){
                        return accumulator + current[variable]
                    }, 0)               
                }
    
            })
    
        this.updateVis();
    }

    updateVis(){
        let that = this;
        this.axis.x.domain(D3.extent(this.dataFiltered, (d:any) => { return that.parseTime(d.date); }));
        this.axis.y.domain([0, D3.max(this.dataFiltered, (d:any) => d.sum) ])
    
        this.axis.xCall.scale(this.axis.x)
    
        this.axis.xAxis.transition(this.t()).call(this.axis.xCall)
    
        let area0 = D3.area()
            .x((d:any) => { return that.axis.x(that.parseTime(d.date)); })
            .y0(this.dimension.height)
            .y1(this.dimension.height);
    
        let area = D3.area()
            .x((d:any) => { return that.axis.x(that.parseTime(d.date)); })
            .y0(this.dimension.height)
            .y1((d:any) => { return that.axis.y(d.sum); })
    
        this.areaPath
            .data([this.dataFiltered])
            .attr("d", area);
    
    }

    brushed(){
        let that = this;
        var selection = D3.event.selection || this.axis.x.range();
        var newValues = selection.map(that.axis.x.invert)
        this.changeDates(newValues)
    }

    changeDates(values){
        this.calls = this.allCalls.filter(function(d){
            return ((d.date > values[0]) && (d.date < values[1]))
        })
        
        let nestedCalls = D3.nest()
            .key(function(d:any){
                return d.category;
            })
            .entries(this.calls)
    
    }

}