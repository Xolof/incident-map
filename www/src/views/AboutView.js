"use strict";

let m = require("mithril");

const mapView = {
    onbeforeremove: function(vnode) {
        vnode.dom.classList.add("slide-out");
        return new Promise(function(resolve) {
            setTimeout(function() {
                vnode.dom.classList.remove("slide-out");
                resolve();
            }, 250);
        });
    },

    view: function() {
        return [
            m("div.slide-in.settings-info", [
                m("h1.header", "Om"),
                m("p", "De röda cirklarna och ikonerna representerar händelser.",
                    [
                        m("br"),
                        m("img", { src: "marker-icon-red.png", style: {"margin-top": "0.4em"} }),
                        m(".leaflet-marker-icon div-icon div-icon-red",
                            {
                                style: {
                                    "display": "inline-block",
                                    "position": "relative",
                                    "margin-top": "0.4em",
                                    "margin-left": "1em",
                                    "width": "42px",
                                    "height": "42px"
                                }
                            },
                            m("b", "10")
                        )
                    ]
                ),

                m("p", "De gröna cirklarna och ikonerna representerar kommuner.",
                    [
                        m("br"),
                        m("img", { src: "marker-icon-green.png", style: {"margin-top": "0.4em"} }),
                        m(".leaflet-marker-icon div-icon div-icon-green",
                            {
                                style: {
                                    "display": "inline-block",
                                    "position": "relative",
                                    "margin-top": "0.4em",
                                    "margin-left": "1em",
                                    "width": "42px",
                                    "height": "42px"
                                }
                            },
                            m("b", "20")
                        )
                    ]
                ),

                m("p", [
                    "Data om händelser hämtas från ",
                    m(
                        "a",
                        { href: "https://brottsplatskartan.se/sida/api" },
                        "Brottsplatskartans API."
                    ),
                ]),
                m("p", [
                    "Data om kommuner hämtas från ",
                    m("a",
                        { href: "https://github.com/Hypergene/kolada" },
                        "Kolada API."
                    ),
                ])
            ])
        ];
    }
};

module.exports = mapView;
