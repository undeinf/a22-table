
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableClass } from './table.class';
import { ElementRef } from '@angular/core';

@Component({
    selector: 'table-fixed',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableFixedComponent implements OnInit{
    @ViewChild('tableRef') tableRef:ElementRef;
    @ViewChild('tableHead') tableHead:ElementRef;
    @ViewChild('tableBody') tableBody:ElementRef
    t:TableClass

    constructor(){}
    
    ngOnInit(){
        this.t = new TableClass(this.tableRef);
    }
}