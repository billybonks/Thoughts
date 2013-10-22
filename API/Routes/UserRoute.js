exports.GetUser=function (req, res){
  var id = req.params.id;
  res.json({user:users[id-1]})
}

var users = [
 {
     id: 1,
     name: 'Sebastien',
     email: 'sebastienstettler@gmail.com'

 },
 {
     id: 2,
     name: 'Billybonks',
     email: 'billybonks@gmail.com'

 }
];