"use strict";

let m = require("mithril");

const Settings = require("../models/Settings");
const counties = require("../models/counties");

const settingsView = {
    onbeforeremove: function (vnode) {
        vnode.dom.classList.add("slide-out");
        return new Promise(function (resolve) {
            setTimeout(function () {
                vnode.dom.classList.remove("slide-out");
                resolve();
            }, 250);
        });
    },

    view: function () {
        return [
            m("div.slide-in.settings-info", [
                m("h1.header", "Inställningar"),

                m("h3", "Visa händelser från"),

                m("select", {
                    onchange: (e) => {
                        if (e.target.value === "Alla") {
                            Settings.county.query = "";
                        } else {
                            Settings.county.query = `&area=${e.target.value} län`;
                        }

                        Settings.county.bounds = counties.filter((county) => {
                            return county.name === e.target.value;
                        })[0].bounds;

                        Settings.county.name = e.target.value;
                    }
                },

                [
                    counties.map((county) => {
                        return m("option", {
                            value: county.name,
                            selected: Settings.county.name === county.name ? "selected" : null
                        }, `${county.name} län`);
                    })
                ]
                ),

                m(
                    "input",
                    {
                        type: "range",
                        id: "numEvents",
                        min: 10,
                        max: 500,
                        value: Settings.numEvents,
                        onchange: (e) => {
                            Settings.numEvents = e.target.value;
                        }
                    }
                ),

                m(
                    "label",
                    {
                        for: "numEvents"
                    },
                    "Antal händelser: " + Settings.numEvents)
            ])
        ];
    }
};

module.exports = settingsView;
