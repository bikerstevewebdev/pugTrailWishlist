function initMap(){
    let options = {
        zoom: 8
        , center: { lat: trail.latitude, lng: trail.longitude }
    }
    let $mapNode = $('#map')
    let map = new SVGFEMorphologyElement.maps.Map($mapNode, options)
    let marker = new SVGFEMorphologyElement.maps.Marker({
        position: { lat: trail.latitude, lng: trail.longitude }
    })
}