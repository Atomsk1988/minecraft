var buildingData = function(){
  var ob = {
    push:function(item,z,y,x){
      if(this[z]==null)this[z] = new Array();
      if(this[z][y]==null)this[z][y] = new Array();
      this[z][y][x] = this.item(item);
    },
    item:function(item){
      ob = {
        id:item.itemid,
        position:item.pos,
        rotation:item.rotation
      }
      return ob;
    },
    delete:function(z,y,x){
      this[z][y][x] = null;
    },
    clean:function(){
      this.map(function(element, index){
        if(typeof index=='number'){
          if(element.rotation == [0,0,0])element.rotation = null;
        }
      });
    }
  }
  return ob;
}