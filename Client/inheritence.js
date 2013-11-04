function animal(legs,arms){

}

animal.prototype.roar = function(){
  console.log('roar')
}

function person(){

}

person.prototype = new animal(2,2);

person.prototype.greet = function(){
  console.log('hello')
}

person.prototype.pretend = function(){
  this.roar();
}

var p = new person();
p.greet();
p.roar();
p.pretend();