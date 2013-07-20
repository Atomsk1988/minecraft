var Minecraft = function(){
	var scene = null;
  var floorLevel = 0;
  //var building_o = {width,height,z:1}
  var building_collection = [
    [
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ],[
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,],
      [null,null,null,null,null,null,null,]
    ]
  ];

	(function(){
		function Scene( canvas, contextName ) {
          var core = CubicVR.init({
            canvas: canvas,
            context: contextName
          });
          var boxMesh = new core.Mesh({ 
            primitive: {
              type: "box",
              size: 1.0,
              material: {
                textures: {
                  color: "images/dirt.png"
                }
              },
              uv: {
                projectionMode: "cubic",
                scale: [1, 1, 1]
              },
              transform: {
                position: [0,0,0]
              }
            },
            compile: true
          });

          var boxObj = new core.SceneObject(boxMesh);
          var scene = new core.Scene( canvas.width, canvas.height, 60 );

          var ml = new core.MainLoop( function( timer, gl ) {
            scene.render();
          });
          this.render = function() {
            scene.render();
          };
          
          scene.bind(boxObj);
          scene.camera.position = [10, 0, 0];
          scene.camera.target = [0, 0, 0];
          core.addResizeable(scene);
          var mvc = new core.MouseViewController( canvas, scene.camera );
          
          this.add = function(p){
            console.log('Add');
            p.z = floorLevel;
            so = new core.SceneObject({mesh:boxMesh, position:p});
            building_collection[p.z][p.y][p.x] = so;
            scene.bindSceneObject(new core.SceneObject({mesh:boxMesh, position:p}));
          }
          this.delete = function(p){
            console.log('Del: '+p);
            /*so = building_collection[p.z][p.y][p.x]
            scene.removeSceneObject(so);*/
          }
        } //Scene
        
        var scene1 = new Scene( document.getElementById( "canvas1" ), "test1" );
        scene = scene1;
		})();

	(function(){
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
              svg.change(rect,{x: 36*n, y: 36*m,pos: [m,0,n*-1],val: false});
              b = svg.add('#box');
            }
          }

          $('rect').bind('click',function(e){
          	t = e.currentTarget;
            val = $(t).attr('val');
            pos = $(t).attr('pos');
            pos = pos.split(',');
            pos = {x:pos[2], y:pos[0], z:pos[1]};
            console.log(val);
            if(val==true){
              $(t).attr('val','false');
              scene.delete(pos);
            }else{
              $(t).attr('val','true');
              scene.add(pos);
            }
          });
        }});
	})();

  (function(){
    $('#floorLevel').bind('click',function(e){     
        floorLevel = e.currentTarget.value;
        console.log(floorLevel); 
    });
  })();
	
}