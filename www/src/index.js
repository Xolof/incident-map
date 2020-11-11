let m = require("mithril");

let Layout = require("./views/Layout");
let mapView = require("./views/MapView.js");
let aboutView = require("./views/AboutView.js");
let settingsView = require("./views/SettingsView.js");

m.route(document.body, "/map", {

    "/map": {
        render: function() {
            return m(Layout, m(mapView));
        }
    },
    "/about": {
        render: function() {
            return m(Layout, m(aboutView));
        }
    },
    "/settings": {
        render: function() {
            return m(Layout, m(settingsView));
        }
    },
});
