//var fixedTable1 = fixTable(document.getElementById('tbl1'));
function fixTable(container) {
  
					var leftHeaders = [].concat.apply([], container.querySelectorAll('tbody td.fixed-cell'));
                    var topHeaders = [].concat.apply([], container.querySelectorAll('thead th'));
                    var crossHeaders = [].concat.apply([], container.querySelectorAll('thead th.cross'));
                    console.log(crossHeaders)

                    console.log('line before setting up event handler');
                    
                    container.addEventListener('scroll', function () {
                        console.log('scroll event handler hit');
                        var x = container.scrollLeft;
                        var y = container.scrollTop;

                        //Update the left header positions when the container is scrolled
                        leftHeaders.forEach(function (leftHeader) {
                            leftHeader.style.transform = translate(x, 0);
                        });

                        //Update the top header positions when the container is scrolled
                        topHeaders.forEach(function (topHeader) {
                          topHeader.style.transform = translate(0, y);
                        });

                        //Update headers that are part of the header and the left column
                        crossHeaders.forEach(function (crossHeader) {
                            crossHeader.style.transform = translate(x, y);
                        });

                    });

                    function translate(x, y) {
                        return 'translate(' + x + 'px, ' + y + 'px)';
                    }	
  // Fix thead and first column on scroll
  container.addEventListener('scroll', function() {
    console.log('scroll');
  });
  return {
  };
  
}
