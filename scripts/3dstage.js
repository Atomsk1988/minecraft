document.addEventListener( "DOMContentLoaded", function( e ) {
        
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
                  color: "images/6583-diffuse.jpg"
                }
              },
              uv: {
                projectionMode: "cubic",
                scale: [1, 1, 1]
              },
              transform: {
                position: [0,1,0]
              }
            },
            compile: true
          });
          var boxObj = new core.SceneObject( boxMesh );
          var scene = new core.Scene( canvas.width, canvas.height, 60 );

          var ml = new core.MainLoop( function( timer, gl ) {
            scene.render();
          });
          this.render = function() {
            scene.render();
          };
          
          scene.bind(boxObj);
          scene.camera.position = [10, 10, 10];
          scene.camera.target = [0, 0, 0];
          core.addResizeable(scene);
          var mvc = new core.MouseViewController( canvas, scene.camera );
          
          this.hi = function(position){
            console.log(position);
            scene.bindSceneObject(new core.SceneObject({mesh:boxMesh, position:position}));
          }
        } //Scene
        
        var scene1 = new Scene( document.getElementById( "canvas1" ), "test1" );

        //
        // Desk
        //
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
            scene1.hi(e.currentTarget.pos);
          });
        }});



        //
        // Web side
        //
        /*button.onclick = function(){
        button = document.getElementById('addBox');
        console.log(Scene);
          x = document.getElementById('x').value;
          y = document.getElementById('y').value;
          z = document.getElementById('z').value;
          //console.log([x,y,z]);
          scene1.hi();
      }*/

      }, false );