window.onload = function(){
  $('#desk').svg({onLoad: function(svg){
    
    defs = svg.defs(); 
    var ptn = svg.pattern(defs, 'boxPattern', 0, 0, 36, 36, 0, 0, 36, 36, 
      {patternUnits: 'userSpaceOnUse'}); 
    var img = svg.image(ptn,0, 0, 36, 36, 'images/deskSlot.png'); 

    var rect = svg.rect(defs, 0, 0, 36, 36, {
      id: 'box', 
      fill: 'url(#boxPattern)', 
      stroke: 'black', 
      stokeWidth: '1px',
      strokeOpacity: '0'
    }); 

    surface = 7;
    for(m=0;m<surface;m++){
      for(n=0;n<surface;n++){
        svg.change(rect,{x: 36*n, y: 36*m,pos: [m,n,1]});
        b = svg.add('#box');
      }
    }
    $('rect').bind('click',function(e){
      console.log(e);
      scene1.hi(e.currentTarget.pos);
    });
  }});


}