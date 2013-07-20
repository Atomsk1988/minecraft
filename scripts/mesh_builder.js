function mesh_builder(mesh_name, material, src){
  src = src || '';
	/*
	mesh_list = {
		'block': new CubicVR.Mesh({ 
      primitive: {
        type: "box",
        size: 1.0,
        material:material,
        uvmapper: {
          projectionMode: "cubic",
          scale: [1, 1, 1]
        }
      }
    }),
    'custom' : new CubicVR.Mesh({
      points:src.root.properties.points,
      material:material,
    })
	};
  */
  var mesh = null
  switch(mesh_name){
    case 'cube':
      mesh = new CubicVR.Mesh({ 
        primitive: {
          type: "box",
          size: 1.0,
          material:material,
          uvmapper: {
            projectionMode: "cubic",
            scale: [1, 1, 1]
          }
        }
      });
      //console.log(mesh)
    break;
    case 'stair':
    console.log('lho');
      mesh = new CubicVR.Mesh('meshes/'+mesh_name+'.json');
      console.log(mesh);
      mesh.prepare();
      /*for(n=0;n<mesh.faces.length;n++){
        mesh.setFaceMaterial(material,n);
      }*/
      //  mesh.clean();
      console.log(mesh.faces.length)
    break; 
  }
  //console.log(mesh_list['box']);
	//mesh = mesh_list[mesh_name];
	return mesh;
}