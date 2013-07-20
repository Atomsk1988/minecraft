 
var Minecraft = function(init){
  var worker = new Worker('scripts/worker.js');

	var stage = init.stage;
  var library = null;
  var floorLevel = init.floorLevel;
  var hotkey = init.hotkey;
  var items = init.items;
  var hotkeys = [0,1,2,3,4,5,1,1,1]
  hotkeys.slot = 0;
  var materials = [];
  var rotate = false;
  var building_collection = [];
  var building_data = new buildingData();
  var desk = null;
  //Building collection array creation
  for(n=0;n<7;n++){
    building_collection[n] = new Array(
      new Array(7),
      new Array(7),
      new Array(7),
      new Array(7),
      new Array(7),
      new Array(7),
      new Array(7)
    )
  }


  
  //Desk
  (desk = function(){
    var svg1 = null;
    $('#desk').svg({onLoad: function(svg){
      svg1 = svg;
      defs = svg.defs(); 
      var addi = [];
      var delet = [];
      var state = null;
      var slots1 = {
        'add':[],
        'del':[],
        'state':null,
        'reset':function(){
          this.add = [];
          this.del = [];
          this.state = null;
        }
      };
      surface = 7;
      var dragtrack = {
        ini:[],
        fin:[]        
      }
      //init graphics for the svg
      var ptn = svg.pattern(defs, 'boxPattern', 0, 0, 36, 36, 0, 0, 36, 36, 
        {patternUnits: 'userSpaceOnUse'});
      var img = svg.image(ptn,0, 0, 36, 36, 'images/deskSlot.png');       
      var hotKey_patt = svg.pattern(defs, 'hotKeyPattern', 0, 5, 36, 36, 0, 0, 36, 36, 
        {patternUnits: 'userSpaceOnUse'});  
      //objectBoundingBox
      var img = svg.image(hotKey_patt,0, 0, 36, 36, 'images/deskSlot.png'); 

      var rect = svg.rect(defs, 0, 0, 36, 36, {
        id: 'box', 
        fill: 'url(#boxPattern)', 
        stroke: 'black', 
        stokeWidth: '1px',
        strokeOpacity: '0',
        pos: null,
        val: false
      }); 
      var hotkeyRect = svg.rect(defs,0, 0, 36, 36, {
        id: 'hotkeyRect', 
        fill: 'url(#hotKeyPattern)', 
        stroke: 'black', 
        stokeWidth: '1px',
        strokeOpacity: '0',
        itemSlot: null
      });

      function setSlot(num, item){
        //Changes the image of a slot given the number
        $('#deskSlot'+num).attr('href', item.image);
      }

      //Bucles for slots and hotkeys creation
      for(m=0;m<surface;m++){
        for(n=0;n<surface;n++){
          svg.change(rect,{x: 36*n, y: 36*m});
          b = svg.add('#box');
          var settings = {id: 'deskSlotImage'+n+'-'+m,class: 'deskSlotImage',pos: [n,0,m]};//x,z,y
          var img = svg.image(36*n, 36*m, 36, 36,'',settings);
          img.setAttributeNS('http://www.w3.org/1999/xlink','href','./images/tranparent_image.png');
        }
      }
      for(n=0;n<9;n++){
          svg.configure(hotkeyRect,{id: 'itemSlot'+n,x: 36*(n), y: 257, itemSlot: n, class: 'itemSlot'});
          b = svg.add(hotkeyRect);

          id = hotkeys[n];
          if(id!=null){img =  items[id].image}else{mat = ''}
          svg.image(36*(n), 257, 36, 36,img,{id: 'itemSlotImage'+n,class: 'slotImage'}); 
      }
      //inventory, rotate and  selected slot images
      svg.image(267, 199, 41, 41,'images/inventory.png',{id: 'inventory_btn'});
      svg.image(267, 155, 41, 41,'images/rotate.png',{id: 'rotate_btn'});
      
      var imageSlot  = svg.image(-6, 252, 48, 45, 'images/hotkeyslot.png',{id: 'hotkeySlot'});

      //svg button rotate event
      $('#rotate_btn').bind('click', function(){
          (rotate)?rotate=false:rotate=true;
          if(rotate){
            svg.change(document.getElementById('rotate_btn'),{'xlink:href':'images/rotate_push.png'});
          }else{
            svg.change(document.getElementById('rotate_btn'),{'xlink:href':'images/rotate.png'});
          }
          //console.log('rotation:'+rotate);
      });
      //svg button inventory event
      $('#inventory_btn').bind('click', function(){
        visible = $('#inventory').css('display');
        //console.log(visible);
        if(visible='none'){
          $('#inventory').modal({overlayClose:true});
        }
      })
      //Slots click events
      $('.slotImage').bind('click',function(e){
        id = e.currentTarget.id;
        id = id.charAt(id.length - 1);

        hotkeys.slot = hotkeys[id];
        x = (id*36)-5;
        svg.change(imageSlot,{x: x});
      });

      $('body').on('mousedown', '.deskSlotImage', mouseDown);
      function mouseDown(e, extra){
        //console.log('event start');
        if($(e.target).attr('href')=='./images/tranparent_image.png'){state = true;}
        else{state = false;}

        if(rotate==true){rotate_push(e);}else{
          add_push(e,extra);}
        return false;
      }
      function rotate_push(e){
        //console.log('rotate push');
        $('body').off('mousedown','.deskSlotImage',mouseDown);
        //pos inicial
        ini = $(e.currentTarget).attr('pos');
        ini = ini.svgplit(',');
        ini[1] = floorLevel;
        dragtrack.ini = ini;
        //console.log(ini);
        $('body').on('mouseup', '.deskSlotImage', rotate_release);
      }
      function rotate_release(ev){
        //console.log('rotate release');
        end = $(ev.currentTarget).attr('pos');
        end = end.split(',');
        end[1] = floorLevel;
        dragtrack.end = end;
        var direction= Array();
        direction[0] = dragtrack.end[0]-dragtrack.ini[0];
        direction[1] = dragtrack.end[1]-dragtrack.ini[1];
        direction[2] = dragtrack.end[2]-dragtrack.ini[2];
        //dir = '';
        dir = {
          vertical:false,
          direction:false
        }
        if(direction[0]+direction[2]!=0){//si no hay diferencia en x e y no hacemos nada
          if(direction[0]<0 && direction[2]==0){
            //dir = 'left';
            dir.vertical = false;
            dir.direction = false;
          }else if(direction[0]>0 && direction[2]==0){
            //dir = 'right';
            dir.vertical = false;
            dir.direction = true;
          }else if(direction[0]==0 && direction[2]<0){
            //dir = 'up';
            dir.vertical = true;
            dir.direction = true;
          }else if(direction[0]==0 && direction[2]>0){
            //dir = 'down';
            dir.vertical = true;
            dir.direction = false;
          }  
        }
        $('body').off('mouseup', '.deskSlotImage',rotate_release);
        $('body').on('mousedown', '.deskSlotImage', mouseDown);
        stage.updateStage({ini:ini, dir:dir}, {rotation:true});
      }
      function updateSlots(target,item_id){
        //console.log('UpdateSlots: ')
        var pos = $(target).attr('pos');
        var target_href = $(target).attr('href');
        var empty = './images/tranparent_image.png';
        
        pos = pos.split(',').reverse();//Chapuza temporal algo en desk hace girar las posiciones x e y
        pos[1] = floorLevel;
        
        if(state == true && target_href==empty){//Origin and target empty
          //Adds a cube to desk & stage
          console.log('baka!');
          svg.change(target,{href:items[item_id].image});
          addi.push({'pos':pos,'id':item_id});
        }else if(state == false && target_href!=empty){//Origin full target full 
          //deletes a cube from desk & stage
          //console.log(target, pos);
          svg.change(target,{href:empty});
          delet.push(pos);
        }/*else if(state == true && target_href!=empty){//Origin empty target full
          //Adds refresh desk delete former cube and add new cube to the stage
          //?????
        }else if(state == false && target_href==empty){//Origin full target empty
          //None
        }
        */
        //console.log('add: '+slots1.add.length)
        
      }
      function add_push(e,itemid){
        //console.log('add_push');
        flag = false;
        if(typeof itemid == 'undefined'){
          itemid = hotkeys[hotkeys.slot];
        }else{
          flag= true;
        }
        updateSlots(e.target,itemid)
        $('body').on('mouseup', '.deskSlotImage', add_release);
        $('body').on('mouseover', '.deskSlotImage', itemid, add_over);
        if(flag)$(e.target).trigger('mouseup');
      }
      function add_over(ev,itemid){
        if(itemid != 'undefined')itemid = hotkeys[hotkeys.slot];
        updateSlots(ev.target,itemid)
      }
      function add_release(e){
          console.log({'add':addi,'del':delet,'state':state});
          stage.updateStage({'add':addi,'del':delet,'state':state});
          
          $('body').off('mouseenter','.deskSlotImage', add_over);
          $('body').off('mouseup', '.deskSlotImage', add_release);
          $('body').off('mouseover', '.deskSlotImage', add_over);
          addi = [];
          delet = [];
          state = null;
          //console.log('event end');
      }  
    }, settings: {width:500}});

    
    this.clean = function(){
      console.log('start cleaning');
      slots = document.getElementsByClassName('deskSlotImage');
      for(k=0;k<=slots.length-1;k++){
        if(slots[k].href!='./images/tranparent_image.png'){
          svg1.change(slots[k],{href:'./images/tranparent_image.png'});
        }
      }
      console.log('end cleaning');
    }
    this.populate = function(floor){
      console.log('start population');
      for(j=0;j<floor.length;j++){
        if(floor[j]!=null){
          for(m=0;m<floor[j].length;m++){
            if(floor[j][m]!=null){
              console.log(j,m);
              $(".deskSlotImage[pos='"+j+",0,"+m+"']").trigger('mousedown',floor[j][m].id);//y,z,x
            }
          }
        }
      }

      console.log('end population');
    }
    desk = this;//esto sobra no?
  	})();


  var lib = function(db, $){
    this.poke = function(){
      console.log('poke');
    }
    this.selected = null;
    var main_ob = this;
    this.build = function(db){
      this.data = [];
      this.setStructure();
      this.getData(db);
    }
    this.setStructure = function(){
        var hide_label = '<div id="hide_button">Hide</div>';
        var load_label = '<div id="library_load">Load</div>';

        $('body').append('<div id="library_wrapper">'+hide_label+load_label+'</div>');


        $('#hide_button').on('click', function(){
          $('#library_wrapper').toggleClass('library_hide');
        });
        $('#library_load').on('click', function(){
          stage.delete('*');
          desk.clean();
          var id = $('.library_selected').attr('id');
          if(id!=null){
            id = id.substr(2);
            $.getJSON('./buildings/building'+id+'.json', function(data) {
              //console.log(data);
              desk.populate(data[0]);
              //add the rest of the cubes directy to stage
              o = {add:[],del:[]};
              for(z=1;z<data.length;z++){
                if(data[z]!=null){
                for(y=0;y<data[z].length;y++){
                  if(data[z][y]!=null){
                  for(x=0;x<data[z][y].length;x++){
                    if(data[z][y][x]!=null){
                      o.add.push({'pos':data[z][y][x].position,'id':data[z][y][x].id});
                    }
                    
                  }
                  }
                }
                }           
              }
              console.log(o);
              stage.updateStage(o,{setZ:true});
            });
          }else{
            console.log('Lib error #1');
          }
        });
    }
    this.create_item = function(building_id){
      tag = '<img src="buildings/building'+building_id+'.png" id="b_'+building_id+'" />'
      $('#library_wrapper').append(tag).on('click', function(e){
        //var id = $(e.target).attr('id').substr(2);
        $('#library_wrapper img').removeClass('library_selected')
        $(e.target).toggleClass('library_selected');
        /*
        console.log(id);
        $.getJSON('./buildings/building'+id+'.json', function(data) {
          desk.populate(data[0]);
        });
        */
      });
    }
    this.getData = function(db){
      var changes = null;
      var rand = Math.random();
      $.get(db, {'rand': rand})
      .done(function(data) {
        //console.log('populating');
        changes = main_ob.compare(data);
        main_ob.update(changes);
        console.log('Load was performed.',changes);
      });
      return changes;
    }
    this.compare = function(newdb){
      var changes ={
        addition:[],
        substraction:[]
      }
      if(this.data.length == 0){
        changes.addition = changes.addition.concat(newdb);
      }else{
        var former_data = this.data;
        for(k in newdb){
          if(this.data.indexOf(newdb[k])==-1){
            changes.addition.push(newdb[k])
          }else{

          }
        }
        for(k in this.data){
          if(newdb.indexOf(this.data[k])==-1){
            changes.substraccion.push(this.data[k])
          }
        }
      }
      return changes;
    }
    this.update = function(ob){
      for(k in ob.addition){
        this.DOMHandler('add', ob.addition[k]);
        this.data.push(ob.addition[k]);
      }

    }
    this.DOMHandler = function(action, id){
      switch(action){
        case 'add': 
          this.create_item(id);
        break;
        case 'del':

        break;
      }
    }
    this.build(db)
    return this;
  };
  library = new lib('library.json', jQuery);
  
  //Inventory plugin
  (function( $ ) {
    $.fn.inventory = function() {
      var inv_slot = 1;

      for(n in items){
        $('#itemsList').append(function(){
          var string='<li id="item'+n+'"><img src="'+items[n].image+'"></li>';
          return string;
        })
      }

      //Events
      $('#itemsList li').bind('click', function(){
        id = $(this).attr('id').substr(4);
        //console.log('lho',id);
        //$('#inv_hotkeyBar li:nth-child('+inv_slot+')').children().attr('src',items[id].image);
        $('#inv_hotkeyBar li:nth-child('+inv_slot+')').css('background-image', 'url('+items[id].image+')');
        $('#itemSlotImage'+(inv_slot-1)).attr('href', items[id].image);
        hotkeys[inv_slot-1] = id
        //hotkeys.slot
        //No se ha de cambiar la imagen sino el bg-image del li
      });

      $('#inv_hotkeyBar li').bind('click', function(){
        $('#inv_hotkeyBar li img').attr('src', '');
        //console.log(this);
        $(this).children().attr('src', 'images/hotkeyslot.png');
        inv_slot = $(this).attr('id').substr(8);
      })

    };
  })( jQuery );

  $('#inventory').inventory();
  //$('body').library();

  //3d stage
  (stage = function(){
    //init vars
    canvas = document.getElementById('canvas1');
    this.gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true})

    var core = CubicVR.init({canvas:canvas});
    //console.log('uhu');
    var floorMesh = new CubicVR.Mesh({
      primitive: {
        type: "plane",
        size: 7,
        transform: {
          rotation: [-90,0,0]
        },
        material: {
          textures: {
            color: "images/dirt.png",
          }
        },
        uv: {
          projectionMode: "cubic",
          scale: [1, 1, 1]
        }
      },
      compile: true
    });


    var scene = new CubicVR.Scene({
      camera: {
        width: 800,
        height: 600,
        fov: 60,
      },
      sceneObject: {
        mesh:floorMesh,
        position:[3,-0.5,3]
      }
    });

    var ml = new CubicVR.MainLoop( function( timer, gl ) {
      scene.render();
    });
    this.render = function() {
      scene.render();
    };

    scene.camera.position = [0, 0, 10];
    scene.camera.target = [0, 0, 0];

    /*var light = new CubicVR.Light({
      type:'area',
      intensity: 1,
      mapRes: 2048,
      areaCeiling: 40,
      areaAxis: [25,5]
    });*/

    CubicVR.setSoftShadows(true);
    //scene.bind(light);
    CubicVR.setGlobalAmbient([0.3,0.3,0.3]);

    CubicVR.addResizeable(scene);
    var mvc = new CubicVR.MouseViewController( canvas, scene.camera );

    //adds objects to the stage given an array of points
    //the object|s that will be added to the stage is 
    //the hotkeys selected item
    this.add = function(o,setZ){

      function createNewMaterial(mat_name){
        if(materials[mat_name]==null){
          materials[mat_name] = new CubicVR.Material({
            textures: { color: ("images/"+mat_name+".png") }
          });
        }
      }
      //for(n in p){
        if(n!='state'){
          //console.log('_______');
          k = o.id;//hotkeys.slot has the slot index and hotkeys[index] the item id
          x=o.pos[0],y=o.pos[2],z=o.pos[1];

          mat = items[k].texture;
          createNewMaterial(mat);//base material prop
          var mesh =mesh_builder(items[k].mesh, materials[mat]);

          //If faces is setted create a material for each face
          if(items[k].faces != null){
            faces = items[k].faces;
            for(n in faces){
              if(faces[n]!=null){// if face material is no set it uses thetexture property
                createNewMaterial(faces[n]);//specific faces materials
                mesh.setFaceMaterial(materials[items[k].faces[n]],n);
              }
            }
          }
          mesh.prepare();
          so = new CubicVR.SceneObject({mesh:mesh, position:o.pos});
          so.itemid = k;
          //console.log(so);
          scene.bindSceneObject(so);
          
          //console.log('-_-'+k,floorLevel,y,x);
          if(setZ==undefined){
            z= floorLevel;
          }
          building_collection[z][y][x] = so;
          building_data.push(so, z,y,x);
        }
        
      //}
    }
    //3d remove function
    this.delete = function(p){
      //for(n in p){
        if($.isArray(p)){
          if(n!='state'){
            x=p[0],y=p[2],z=p[1];
            so = building_collection[floorLevel][y][x];
            //console.log('delete:', so);
            scene.removeSceneObject(so);
            building_collection[floorLevel][y][x] = null;
            building_data.delete(floorLevel,y,x);
          }
        }else if(p == '*'){

          for(z1=0;z1<building_collection.length;z1++){
            for(y1=0;y1<building_collection.length;y1++){
              for(x1=0;x1<building_collection.length;x1++){
                so = building_collection[z1][x1][y1];
                if(so!=null){
                  scene.removeSceneObject(so);
                  building_collection[z1][x1][y1] = null;
                  building_data.delete(z1,x1,y1);
                }
              }
            }
          }
        }
      //}
    }

    //block rotation function
    this.rotate = function(o){
      //console.log('Stage rotation function',o);
      x=o.ini[0],y=o.ini[2],z=o.ini[1];
      so = building_collection[floorLevel][y][x];
      //so.rotation = [0.0,0+90.0,0.0]
      rot = so.rotation;
      //console.log(rot);
      if(o.dir.vertical==true && o.dir.direction==false){//turn down
        rot = [rot[0]-90.0, rot[1],rot[2]]
      }else if(o.dir.vertical==true && o.dir.direction==true){//up
        rot = [rot[0]+90.0, rot[1],rot[2]];
      }else if(o.dir.vertical==false && o.dir.direction==false){//left
        rot = [rot[0], rot[1]+90.0,rot[2]];
      }else if(o.dir.vertical==false && o.dir.direction==true){//right
        rot = [rot[0], rot[1]-90.0,rot[2]];
      }
     // console.log(rot);
      so.rotation = rot;
      building_collection[floorLevel][y][x] = so;
      building_data.push(so, floorLevel,y,x);

     // console.log(so.rotation);
    }
    this.updateStage = function(o, extra){
      if(extra==null)extra={};
      if(extra.rotate==undefined)rotate = false;
      if(extra.setZ==undefined)setZ = false;
      //console.log(o);

      if(rotate==true){
        //console.log('rotate!');
        this.rotate(o);
      }else{
        o.del.map(function(element){
          //console.log(element);
          this.delete(element);
          return element;
        });
        o.add.map(function(element){
          //console.log(element);
          this.add(element, setZ);
          return element;
        });
      }      
    }
    stage = this;
  })();

  //loading items at desk on floorLevel change
  (function(){
    $('#floorLevel').bind('change',function(e){ 
      if(floorLevel != e.currentTarget.value){
        floorLevel = e.currentTarget.value;
        //console.log('Floor level: '+floorLevel);
        $('.deskSlotImage').each(function(ind, elem){
          pos = $(elem).attr('pos');
          pos = pos.split(',');

          item = building_collection[floorLevel][pos[2]][pos[0]];
        
          //console.log(pos,item);
          if(item == null){
            $(elem).attr('href','./images/tranparent_image.png');
          }else{
            $(elem).attr('href',items[item.itemid].image);
          }
        });
      }    
    });
  })();
  
	$('#save').on('click', function (e){
    //console.log(building_collection);
    pic = takePicture();
    var parametros = {
      "data" : pic,
    };
    return false;
  })


  worker.addEventListener('message', function(e) {
      console.log(e.data);
      if(e.data=='true'){
        library.getData('library.json');
      }
    }, false);


  function takePicture(){
    
    
    var canv=document.getElementById("canvas1");
    ctx = canv.getContext('experimental-webgl', {preserveDrawingBuffer: true});
    console.log('-_-'+canvas.width);
    var pixels = new Uint8Array(canvas.width*canvas.height*4); // 800*600 *4-RGBA image
    ctx.readPixels(0, 0, canvas.width, canvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);

    worker.postMessage([pixels,JSON.stringify(building_data)]);
    
    return true;
  }
}