
let map = nlmaps.createMap({target: 'mapdiv', center: {latitude: 5, longitude: 52}})
nlmaps.clickprovider(map).subscribe(function(e){
  console.log(e)
});
