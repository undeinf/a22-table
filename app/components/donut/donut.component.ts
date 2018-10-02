import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as D3 from "d3";
import d3Tip from "d3-tip" // works

import { HARDCODED_DATA } from './../data/static-data';

@Component({
    selector: 'donut-chart',
    template: `<div id="chart-area" #containerPieChart></div>
            <div class="legend">
                <p>Content Name</p>
                <p>Content Two</p>
            </div>`,
    styleUrls: ['./donut.component.css']
})

export class DonutChartComponent implements OnInit, AfterViewInit{
    @Input() showCircle:boolean = false;
    @ViewChild("containerPieChart") element: ElementRef;
    private data  = HARDCODED_DATA.DONUT_DATA;
    private _current:any;
    svg:any;
    pie:any;
    color:any;
    arc:any;
    arcOver:any;
    tip:any;
    tooltip:any;

    constructor(){};

    ngOnInit(){}

    ngAfterViewInit(){
        let that = this;
        let w = this.element.nativeElement.offsetWidth;
        let h = this.element.nativeElement.offsetHeight;
        let margin = { left:5, right:5, top:10, bottom:10 };

        let width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom,
            radius = Math.min(width, height) / 2;

        //D3.scale.category20()
        // this.color = D3.scaleOrdinal(D3.schemeCategory10);
        this.svg = D3.select(this.element.nativeElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${(width / 2) - 30} , ${height / 2})`);

        this.tip = d3Tip()
        this.tip
            .attr('class', 'd3-tip')
            .html(function (d) {
                return "<strong>Frequency:</strong> <span style='color:red'>" + d.revenue + "</span>";
            })

        this.svg.call(this.tip)   

        this.color = D3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

        this.color = D3.scaleOrdinal(D3.schemeCategory10);

        this.pie = D3.pie()
            .value((d:any) => d.count)
            .sort(null);

        let radiusNew = this.showCircle ? 0 : radius/2;
        this.arc = D3.arc()
            .innerRadius(radiusNew) // setting to 0 can make pie chart
            .outerRadius(radius);

        this.arcOver = D3.arc()
            .innerRadius(radiusNew) // setting to 0 can make pie chart
            .outerRadius(radius + 10);

        this.prepareTooltip();

    //d3.json("data.json", type).then(data => {  
        D3.selectAll("input")
            .on("change", this.update);

        this.update(this.data);
    }

    update(val) {
        let that = this;
        // Join new data
        const path = this.svg.selectAll("path")
            .data(this.pie(val));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", this.arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => this.color(i))
            .attr("d", this.arc)
            .attr("stroke", "white")
            .attr("stroke-width", "6px")
            .each(function(d) { this._current = d; })
            .on("mouseover", function(d){ 
                //that.tip.show(d, this);
                D3.select(this).transition()
                    .duration(300)
                    .attr("d", that.arcOver);            

                //tooltip
                that.tooltip.select('.label').html(d.data.region.toUpperCase()).style('color','black');
                that.tooltip.select('.count').html(d.data.count);
    
                that.tooltip.style('display', 'block');
                that.tooltip.style('position', 'absolute')
                that.tooltip.style('opacity',2);
            })
            .on('mousemove', function(d) {
                that.tooltip.style('top', (D3.event.layerY + 10) + 'px')
                that.tooltip.style('position', 'absolute')
                that.tooltip.style('left', (D3.event.layerX - 25) + 'px');
            })
            .on("mouseout", function(d) { 
                //that.tip.hide(d, this)
                D3.select(this).transition()
                    .duration(300)
                    .attr("d", that.arc);    
                    
                that.tooltip.style('display', 'none');
                that.tooltip.style('opacity',0);
            });

    }

    prepareTooltip(){
        this.tooltip = D3.select(this.element.nativeElement)
            .append('div')
            .attr('class', 'tooltip');

        this.tooltip.append('div')
    		.attr('class', 'label');

        this.tooltip.append('div')
	    	.attr('class', 'count');
    }

    arcTween(a) {
        const i = D3.interpolate(this._current, a);
        this._current = i(1);
        return (t) => this.arc(i(t));
    }
}
