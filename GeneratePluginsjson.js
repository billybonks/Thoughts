var fs = require('fs')
var dir = 'Client/Plugins'
var plugins = fs.readdirSync('Client/Plugins')
var retProd = {
  plugins: [],
  barsStart: '{{',
  barsEnd: '}}'
}

var retDev = {
  plugins: [],
  barsStart: '{{',
  barsEnd: '}}'
}


for (var i = 0; i < plugins.length; i++) {
  var pac =JSON.parse(fs.readFileSync(dir+'/'+plugins[i]+'/'+'package.json',{encoding:'utf8'}));
  console.log(pac.state)
  if(pac.state=='development' ){
    retDev.plugins.push({
      name: plugins[i],
      nameLower: plugins[i].toLowerCase()
    })
  }else if(pac.state=='production'){
    retProd.plugins.push({
      name: plugins[i],
      nameLower: plugins[i].toLowerCase()
    })
    retDev.plugins.push({
      name: plugins[i],
      nameLower: plugins[i].toLowerCase()
    })
  }
}
var result = fs.writeFileSync('pluginsDev.json', JSON.stringify(retDev))
fs.writeFileSync('pluginsProd.json', JSON.stringify(retProd))
