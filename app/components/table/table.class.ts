import { ElementRef } from '@angular/core';


export class TableClass{
    thead:any;
    tbody:any;
    element:any
    constructor(private container:ElementRef,){
        this.element = this.container.nativeElement;
        this.fixTable(container);
    }

    fixTable(container:ElementRef) {
        // Store references to table elements
        this.thead = container.nativeElement.querySelector('thead');
        this.tbody = container.nativeElement.querySelector('tbody');
      
        // Style container
        container.nativeElement.style.overflow = 'auto';
        container.nativeElement.style.position = 'relative';

        console.log(this.thead, this.tbody, this.container.nativeElement);
        this.relayout();
        this.container.nativeElement.addEventListener('scroll', this.headerScroll.bind(this));
    }

    headerScroll(e){
      // Fix thead and first column on scroll
      console.log('this', this);
      console.log('eee', e);
        this.thead.style.transform = 'translate3d(0,' + e.target.scrollTop + 'px,0)';
        var hTransform = 'translate3d(' + e.target.scrollLeft + 'px,0,0)';
        this.thead.querySelector('th').style.transform = hTransform;
        [].slice.call(this.tbody.querySelectorAll('tr > td:first-child'))
        .forEach(function(td, i) {
            td.style.transform = hTransform;
        });
    };


    relayout() {
        var ths = [].slice.call(this.thead.querySelectorAll('th'));
        var tbodyTrs = [].slice.call(this.tbody.querySelectorAll('tr'));
    
        /**
         * Remove inline styles so we resort to the default table layout algorithm
         * For thead, th, and td elements, don't remove the 'transform' styles applied
         * by the scroll event listener
         */
        this.tbody.setAttribute('style', '');
        this.thead.style.width = '';
        this.thead.style.position = '';
        this.thead.style.top = '';
        this.thead.style.left = '';
        this.thead.style.zIndex = '';
        ths.forEach(function(th) {
          th.style.display = '';
          th.style.width = '';
          th.style.position = '';
          th.style.top = '';
          th.style.left = '';
        });
        tbodyTrs.forEach(function(tr) {
          tr.setAttribute('style', '');
        });
        [].slice.call(this.tbody.querySelectorAll('td'))
          .forEach(function(td) {
            td.style.width = '';
            td.style.position = '';
            td.style.left = '';
          });
    
        /**
         * Store width and height of each th
         * getBoundingClientRect()'s dimensions include paddings and borders
         */
        var thStyles = ths.map(function(th) {
          var rect = th.getBoundingClientRect();
          var style = document.defaultView.getComputedStyle(th, '');
          return {
            boundingWidth: rect.width,
            boundingHeight: rect.height,
            width: parseInt(style.width, 10),
            paddingLeft: parseInt(style.paddingLeft, 10)
          };
        });
    
        // Set widths of thead and tbody
        var totalWidth = thStyles.reduce(function(sum, cur) {
          return sum + cur.boundingWidth;
        }, 0);
        this.tbody.style.display = 'block';
        this.tbody.style.width = totalWidth + 'px';
        this.thead.style.width = totalWidth - thStyles[0].boundingWidth + 'px';
    
        // Position thead
        this.thead.style.position = 'absolute';
        this.thead.style.top = '0';
        this.thead.style.left = thStyles[0].boundingWidth + 'px';
        this.thead.style.zIndex = 10;
    
        // Set widths of the th elements in thead. For the fixed th, set its position
        ths.forEach(function(th, i) {
          th.style.width = thStyles[i].width + 'px';
          if (i === 0) {
            th.style.position = 'absolute';
            th.style.top = '0';
            th.style.left = -thStyles[0].boundingWidth + 'px';
          }
        });
    
        // Set margin-top for tbody - the fixed header is displayed in this margin
        this.tbody.style.marginTop = thStyles[0].boundingHeight + 'px';
    
        // Set widths of the td elements in tbody. For the fixed td, set its position
        tbodyTrs.forEach(function(tr, i) {
          tr.style.display = 'block';
          tr.style.paddingLeft = thStyles[0].boundingWidth + 'px';
          [].slice.call(tr.querySelectorAll('td'))
            .forEach(function(td, j) {
              td.style.width = thStyles[j].width + 'px';
              if (j === 0) {
                td.style.position = 'absolute';
                td.style.left = '0';
              }
            });
        });
      }
    
}