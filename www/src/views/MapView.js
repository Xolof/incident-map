"use strict";

let m = require("mithril");

require("leaflet/dist/leaflet.css");
require("leaflet/dist/images/marker-icon-2x.png");
require("leaflet/dist/images/marker-icon.png");
require("leaflet/dist/images/marker-shadow.png");

require("leaflet.markercluster/dist/MarkerCluster.css");
require("leaflet.markercluster/dist/MarkerCluster.Default.css");

const Position = require("../models/Position");
const Map = require("../models/MapModel");
const Settings = require("../models/Settings");
const Events = require("../models/Events");
const Places = require("../models/Places");
const File = require("../models/FileModel");
const kommuns = require("../models/kommuns");

const mapView = {
    oninit: function() {
        Places.loaded = null;
        Events.loaded = null;
        document.addEventListener("deviceready", mapView.onDeviceReady, false);
        Position.getPosition();
        m.redraw();
    },

    onDeviceReady: async function() {
        await File.createFile();

        await Promise.all(
            [
                Events.loadList(),
                Places.loadList()
            ]
        ).then(() => {
            File.writeToCache([kommuns.kommuns, Events.list]);
            mapView.showingCache = false;
            Map.flyTo(Settings.county.bounds);
        }).catch(async function (error) {
            console.error(error);
            await File.createFile();
            await File.readFromFile(File.file);
            Places.renderResults(File.result[0]);
            Events.renderResults(File.result[1]);
            mapView.showingCache = true;
        });

        m.redraw();
    },

    oncreate: function() {
        Map.showMap([
            [55.0373350025326, 10.5106830162058],
            [69.0601519998757, 24.1771669847554]
        ]);
    },

    onbeforeremove: function(vnode) {
        vnode.dom.classList.add("slide-out");
        return new Promise(function(resolve) {
            setTimeout(function() {
                vnode.dom.classList.remove("slide-out");
                resolve();
            }, 250);
        });
    },

    showingCache: false,

    view: function() {
        return [
            m("div.slide-in", [
                mapView.showingCache ? m(
                    "p.cacheInfo",
                    "Kunde inte hämta data från fjärr-tjänsterna, visar cachad data."
                ) : null,
                m("div#map.map", ""),
                Events.loaded && Places.loaded ? null : m(".spinner")
            ])
        ];
    }
};

module.exports = mapView;
