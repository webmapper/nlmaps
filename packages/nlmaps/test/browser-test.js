
let map = nlmaps.createMap({target: 'mapdiv'})
nlmaps.clickprovider(map).subscribe(function(e){
  console.log('the map has been clicked')
  console.log(e)
});
