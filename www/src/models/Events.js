let m = require("mithril");

const Map = require("../models/MapModel");
const Settings = require("../models/Settings");
let L = require("leaflet");

let Events = {

    list: [],

    icon: L.icon({
        iconUrl: 'marker-icon-red.png',
        iconSize:     [26, 42],
        iconAnchor:   [13, 42],
        popupAnchor:  [0, -36]
    }),

    loaded: false,

    loadList: function() {
        return m.request({
            method: "GET",
            url: `
                https://brottsplatskartan.se/api/events/?limit=
                ${Settings.numEvents}${Settings.county.query}&app=krimsokpina
                `,
        })
            .then(async function (result) {
                Events.list = result.data;
                Events.renderResults(result.data);
            });
    },

    renderResults(result) {
        let markers = L.markerClusterGroup({
            iconCreateFunction: function(cluster) {
                return L.divIcon({
                    html: '<b>' + cluster.getChildCount() + '</b>',
                    className: "div-icon div-icon-red",
                    iconSize: 42
                });
            }
        });

        // Loop through the events and set markers using the locations.
        for (let event of result) {
            markers.addLayer(
                L.marker(
                    [event.lat, event.lng],
                    {icon: Events.icon}
                ).bindPopup(
                    L.popup({ maxHeight: 550 })
                        .setContent(`
                            <h3>${event.description}</h3>
                            <p>${event.date_human}</p>
                            ${event.content_formatted}                    
                        `)
                )
            );
        }
        Map.myMap.addLayer(markers);

        Events.loaded = true;
        m.redraw();
    }
};

module.exports = Events;
