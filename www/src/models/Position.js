"use strict";

let m = require("mithril");

let L = require("leaflet");

const Map = require("../models/MapModel");

let locationMarker = L.icon({
    iconUrl: 'location.png',
    iconSize:     [24, 24],
    iconAnchor:   [12, 12],
    popupAnchor:  [0, 0]
});

L.Icon.Default.prototype.options.shadowSize = [0, 0];

const position = {
    currentPosition: {},

    getPosition: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position.geoSuccess,
                position.geoError
            );
        }
    },

    geoSuccess: function(pos) {
        position.currentPosition = pos.coords;

        position.showPosition();

        m.redraw();
    },

    geoError: function(error) {
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    showPosition: function() {
        if (position.currentPosition.latitude && position.currentPosition.longitude) {
            L.marker(
                [position.currentPosition.latitude, position.currentPosition.longitude],
                {icon: locationMarker}
            ).addTo(Map.myMap).bindPopup("Din plats");

            m.redraw();
        }
    }
};

module.exports = position;
