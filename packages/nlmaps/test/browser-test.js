import distance from '@turf/distance';
let map = nlmaps.createMap({target: 'mapdiv'})


nlmaps.clickprovider(map).subscribe(singleClick);

nlmaps.clickprovider(map).subscribe(e => console.log(e))

//this is a first draft of marker setting which will go in another package

