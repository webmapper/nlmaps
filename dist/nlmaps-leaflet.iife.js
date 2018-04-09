(function (exports) {
    'use strict';

    function wmsBaseUrl(workSpaceName) {
      return 'https://geodata.nationaalgeoregister.nl/' + workSpaceName + '/wms?';
    }

    function mapWmsProvider(name, options) {
      const wmsParameters = {
        workSpaceName: '',
        layerName: '',
        styleName: '',
        url: '',
        minZoom: 0,
        maxZoom: 24
      };

      switch (name) {
        case 'gebouwen':
          wmsParameters.workSpaceName = 'bag';
          wmsParameters.layerName = 'pand';
          wmsParameters.styleName = '';
          break;
        case 'percelen':
          wmsParameters.workSpaceName = 'kadastralekaartv3';
          wmsParameters.layerName = 'kadastralekaart';
          wmsParameters.styleName = '';
          break;
        case 'drone-no-fly-zones':
          wmsParameters.workSpaceName = 'dronenoflyzones';
          wmsParameters.layerName = 'luchtvaartgebieden,landingsite';
          wmsParameters.styleName = '';
          break;
        case 'hoogte':
          wmsParameters.workSpaceName = 'ahn2';
          wmsParameters.layerName = 'ahn2_05m_int';
          wmsParameters.styleName = 'ahn2:ahn2_05m_detail';
          break;
        case 'gemeenten':
          wmsParameters.workSpaceName = 'bestuurlijkegrenzen';
          wmsParameters.layerName = 'gemeenten';
          wmsParameters.styleName = 'bestuurlijkegrenzen:bestuurlijkegrenzen_gemeentegrenzen';
          break;
        case 'provincies':
          wmsParameters.workSpaceName = 'bestuurlijkegrenzen';
          wmsParameters.layerName = 'provincies';
          wmsParameters.styleName = 'bestuurlijkegrenzen:bestuurlijkegrenzen_provinciegrenzen';
          break;
        default:
          wmsParameters.url = options.url;
          wmsParameters.layerName = options.layerName;
          wmsParameters.styleName = options.styleName;
      }
      if (wmsParameters.url === '') {
        wmsParameters.url = wmsBaseUrl(wmsParameters.workSpaceName);
      }

      return wmsParameters;
    }

    function makeWmsProvider(name, options) {
      const wmsParameters = mapWmsProvider(name, options);
      return {
        url: wmsParameters.url,
        service: 'WMS',
        version: '1.1.1',
        request: 'GetMap',
        layers: wmsParameters.layerName,
        styles: wmsParameters.styleName,
        transparent: true,
        format: 'image/png'
      };
    }

    const WMS_PROVIDERS = {
      "gebouwen": makeWmsProvider('gebouwen'),
      "percelen": makeWmsProvider('percelen'),
      "drone-no-fly-zones": makeWmsProvider('drone-no-fly-zones'),
      "hoogte": makeWmsProvider('hoogte'),
      "gemeenten": makeWmsProvider('gemeenten'),
      "provincies": makeWmsProvider('provincies')
    };

    const lufostring = 'luchtfoto/rgb';
    const brtstring = 'tiles/service';
    const servicecrs = '/EPSG:3857';
    const attr = 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a> | <a href="https://www.verbeterdekaart.nl">Verbeter de kaart</a>';
    function baseUrl(name) {
      return `https://geodata.nationaalgeoregister.nl/${name === 'luchtfoto' ? lufostring : brtstring}/wmts/`;
    }

    function mapLayerName(layername) {
      let name;
      switch (layername) {
        case 'standaard':
          name = 'brtachtergrondkaart';
          break;
        case 'grijs':
          name = 'brtachtergrondkaartgrijs';
          break;
        case 'pastel':
          name = 'brtachtergrondkaartpastel';
          break;
        case 'luchtfoto':
          name = 'Actueel_ortho25';
          break;
        default:
          name = 'brtachtergrondkaart';
      }
      return name;
    }

    function makeProvider(name, format, minZoom, maxZoom) {
      const baseurl = baseUrl(name);
      const urlname = mapLayerName(name);
      return {
        "bare_url": [baseurl, urlname, servicecrs].join(""),
        "url": [baseurl, urlname, servicecrs, "/{z}/{x}/{y}.", format].join(""),
        "format": format,
        "minZoom": minZoom,
        "maxZoom": maxZoom,
        "attribution": attr,
        "name": `${name === 'luchtfoto' ? '' : 'NLMaps '} ${name}`
      };
    }

    const BASEMAP_PROVIDERS = {
      "standaard": makeProvider("standaard", "png", 6, 19),
      "pastel": makeProvider("pastel", "png", 6, 19),
      "grijs": makeProvider("grijs", "png", 6, 19),
      "luchtfoto": makeProvider("luchtfoto", "jpeg", 6, 19)
    };

    /*parts copied from maps.stamen.com: https://github.com/stamen/maps.stamen.com/blob/master/js/tile.stamen.js
     * copyright (c) 2012, Stamen Design
     * under BSD 3-Clause license: https://github.com/stamen/maps.stamen.com/blob/master/LICENSE
     */

    /*
     * Get the named provider, or throw an exception if it doesn't exist.
     **/
    function getProvider(name) {
      if (name in BASEMAP_PROVIDERS) {
        var provider = BASEMAP_PROVIDERS[name];

        // eslint-disable-next-line no-console
        if (provider.deprecated && console && console.warn) {
          // eslint-disable-next-line no-console
          console.warn(name + " is a deprecated style; it will be redirected to its replacement. For performance improvements, please change your reference.");
        }

        return provider;
      } else {
        // eslint-disable-next-line no-console
        console.error('NL Maps error: You asked for a style which does not exist! Available styles: ' + Object.keys(PROVIDERS).join(', '));
      }
    }

    /*
     * Get the named wmsProvider, or throw an exception if it doesn't exist.
     **/
    function getWmsProvider(name, options) {
      let wmsProvider;
      if (name in WMS_PROVIDERS) {
        wmsProvider = WMS_PROVIDERS[name];

        // eslint-disable-next-line no-console
        if (wmsProvider.deprecated && console && console.warn) {
          // eslint-disable-next-line no-console
          console.warn(name + " is a deprecated wms; it will be redirected to its replacement. For performance improvements, please change your reference.");
        }
      } else {
        wmsProvider = makeWmsProvider(name, options);
        // eslint-disable-next-line no-console
        console.log('NL Maps: You asked for a wms which does not exist! Available wmses: ' + Object.keys(WMS_PROVIDERS).join(', ') + '. Provide an options object to make your own WMS.');
      }
      return wmsProvider;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    if (typeof L !== 'undefined' && (typeof L === 'undefined' ? 'undefined' : _typeof(L)) === 'object') {
      L.NlmapsBgLayer = L.TileLayer.extend({
        initialize: function initialize() {
          var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'standaard';
          var options = arguments[1];

          var provider = getProvider(name);
          var opts = L.Util.extend({}, options, {
            'minZoom': provider.minZoom,
            'maxZoom': provider.maxZoom,
            'scheme': 'xyz',
            'attribution': provider.attribution,
            sa_id: name
          });
          L.TileLayer.prototype.initialize.call(this, provider.url, opts);
        }
      });

      /*
       * Factory function for consistency with Leaflet conventions
       **/
      L.nlmapsBgLayer = function (options, source) {
        return new L.NlmapsBgLayer(options, source);
      };

      L.NlmapsOverlayLayer = L.TileLayer.WMS.extend({
        initialize: function initialize() {
          var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var options = arguments[1];

          var wmsProvider = getWmsProvider(name, options);
          var url = wmsProvider.url;
          delete wmsProvider.url;
          var wmsParams = L.Util.extend({}, options, {
            layers: wmsProvider.layers,
            maxZoom: 24,
            minZoom: 1,
            styles: wmsProvider.styles,
            version: wmsProvider.version,
            transparent: wmsProvider.transparent,
            format: wmsProvider.format
          });
          L.TileLayer.WMS.prototype.initialize.call(this, url, wmsParams);
        }
      });

      /*
       * Factory function for consistency with Leaflet conventions
       **/
      L.nlmapsOverlayLayer = function (options, source) {
        return new L.NlmapsOverlayLayer(options, source);
      };

      L.Control.GeoLocatorControl = L.Control.extend({
        options: {
          position: 'topright'
        },
        initialize: function initialize(options) {
          // set default options if nothing is set (merge one step deep)
          for (var i in options) {
            if (_typeof(this.options[i]) === 'object') {
              L.extend(this.options[i], options[i]);
            } else {
              this.options[i] = options[i];
            }
          }
        },

        onAdd: function onAdd(map) {
          var div = L.DomUtil.create('div');
          div.id = 'nlmaps-geolocator-control';
          div.className = 'nlmaps-geolocator-control';
          var img = document.createElement('img');
          div.append(img);
          if (this.options.geolocator.isStarted()) {
            L.DomUtil.addClass(div, 'started');
          }
          function moveMap(position) {
            map.panTo([position.coords.latitude, position.coords.longitude]);
          }
          L.DomEvent.on(div, 'click', function () {
            this.options.geolocator.start();
            L.DomUtil.addClass(div, 'started');
          }, this);
          this.options.geolocator.on('position', function (d) {
            L.DomUtil.removeClass(div, 'started');
            L.DomUtil.addClass(div, 'has-position');
            moveMap(d);
          });
          return div;
        },
        onRemove: function onRemove(map) {
          return map;
        }
      });

      L.geoLocatorControl = function (geolocator) {
        return new L.Control.GeoLocatorControl({ geolocator: geolocator });
      };
    }

    function bgLayer(name) {
      if (typeof L !== 'undefined' && (typeof L === 'undefined' ? 'undefined' : _typeof(L)) === 'object') {
        return L.nlmapsBgLayer(name);
      }
    }

    function geoLocatorControl(geolocator) {
      if (typeof L !== 'undefined' && (typeof L === 'undefined' ? 'undefined' : _typeof(L)) === 'object') {
        return L.geoLocatorControl(geolocator);
      }
    }

    exports.bgLayer = bgLayer;
    exports.geoLocatorControl = geoLocatorControl;

}((this.window = this.window || {})));
//# sourceMappingURL=nlmaps-leaflet.iife.js.map
