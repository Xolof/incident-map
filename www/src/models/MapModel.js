"use strict";

let L = require("leaflet");

require("leaflet.markercluster");

const Map = {

    myMap: null,

    showMap: function(bounds) {
        // Create map and set the view.
        Map.myMap = L.map('map').fitBounds(bounds);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',    {
            attribution: `&copy;
            <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap</a> contributors`
        }).addTo(Map.myMap);

        Map.myMap.zoomControl.setPosition("bottomright");
    },

    flyTo: function(bounds) {
        Map.myMap.flyToBounds(bounds);
    }
};

module.exports = Map;
