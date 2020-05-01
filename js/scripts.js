mapboxgl.accessToken = 'pk.eyJ1IjoibmlraTEyc3RlcCIsImEiOiJjanZlNGFneWswMm0zNDRxcGYwZXYwcjl2In0.fWV3JfWN5hg9UFqDimwIZw';

// adding mapbox map container
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/niki12step/cjy06zjb90m111cplccxmln9m', // my style url
  zoom: 13.5,
  minZoom: 12,
  center: [-73.915355,40.771302],
})

// draw plugin
var Draw = new MapboxDraw();
map.addControl(Draw, 'top-left');

// geojson data
var busUrl = 'https://raw.githubusercontent.com/nikikokkinos/Data/master/CD22BusRoutes.geojson'
var truckUrl = 'https://raw.githubusercontent.com/nikikokkinos/Data/master/CD22TruckRoutes.geojson'
var hospitalUrl = 'https://raw.githubusercontent.com/nikikokkinos/Data/master/CD22Hospital.geojson'

// empty vars for hover
var hoveredBusId = null
var hoveredTruckId = null

map.on('load', function() {

  map.addSource('bus', {
    'type': 'geojson',
    'data': busUrl,
    'generateId': true
  })

  map.addSource('truck', {
    'type': 'geojson',
    'data': truckUrl,
    'generateId': true
  })

  map.loadImage('https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_the_Red_Cross_cropped_as_a_square.png',

    function(error, image) { if (error) throw error;

    map.addImage('cross', image)

    map.addSource('hospital', {
      'type': 'geojson',
      'data': hospitalUrl,
      'generateId': true
    })

    map.addLayer({
      'id': 'busCD22',
      'type': 'line',
      'source': 'bus',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'visible',
        },
      'paint': {
          'line-color': 'blue',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            7,
            3
          ],
        },
    })

    map.addLayer({
      'id': 'truckCD22',
      'type': 'line',
      'source': 'truck',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'visible',
        },
      'paint': {
          'line-color': 'black',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            7,
            3
          ],
        },
    })

    map.addLayer({
      'id': 'hospitalCD22',
      'type': 'symbol',
      'source': 'hospital',
      'layout': {
        'icon-image': 'cross',
        'icon-size': 0.05
        }
      })

    })

    // bus hover effect
  map.on('mousemove', 'busCD22', function(e) {
    map.getCanvas().style.cursor = 'pointer'
      if (e.features.length > 0) {
        if (hoveredBusId) {
        map.setFeatureState(
          { source: 'bus', id: hoveredBusId },
          { hover: false }
        )
        }
      hoveredBusId = e.features[0].id
      map.setFeatureState(
          { source: 'bus', id: hoveredBusId },
          { hover: true }
        )
      }
    })

  map.on('mouseleave', 'busCD22', function() {
    if (hoveredBusId) {
      map.setFeatureState(
      { source: 'bus', id: hoveredBusId },
      { hover: false }
      )
      }
      hoveredBusId = null
  })

  map.on('mousemove', 'truckCD22', function(e) {
    map.getCanvas().style.cursor = 'pointer'
      if (e.features.length > 0) {
        if (hoveredTruckId) {
        map.setFeatureState(
          { source: 'truck', id: hoveredTruckId },
          { hover: false }
        )
        }
      hoveredTruckId = e.features[0].id
      map.setFeatureState(
          { source: 'truck', id: hoveredTruckId },
          { hover: true }
        )
      }
    })

  map.on('mouseleave', 'truckCD22', function() {
    if (hoveredTruckId) {
      map.setFeatureState(
      { source: 'truck', id: hoveredTruckId },
      { hover: false }
      )
      }
      hoveredTruckId = null
  })


  var radioButton = $('#layerToggle')

    radioButton.on("click", function () {
      if (document.getElementById('MountSinaiQueens').checked) {
          map.setLayoutProperty('hospitalCD22', 'visibility', 'visible')
      } else { map.setLayoutProperty('hospitalCD22', 'visibility', 'none')
    } if (document.getElementById('BusRoutes').checked) {
          map.setLayoutProperty('busCD22', 'visibility', 'visible')
      } else { map.setLayoutProperty('busCD22', 'visibility', 'none')
    } if (document.getElementById('TruckRoutes').checked) {
          map.setLayoutProperty('truckCD22', 'visibility', 'visible')
      } else { map.setLayoutProperty('truckCD22', 'visibility', 'none')}
    })
})
