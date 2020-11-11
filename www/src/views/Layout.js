let m = require("mithril");

module.exports = {
    view: function(vnode) {
        return m("main.layout", [
            m("h1.layout-header", "Incidentkartan"),

            m("section.section", vnode.children),

            m("nav.menu", [
                m(m.route.Link, {href: "/map", class: m.route.get() === "/map"
                    ? "menu-link active" : "menu-link"}, "Karta"),

                m(m.route.Link, {href: "/settings", class:  m.route.get() === "/settings"
                    ? "menu-link active" : "menu-link"}, "Inställningar"),

                m(m.route.Link, {href: "/about", class:  m.route.get() === "/about"
                    ? "menu-link active" : "menu-link"}, "Om")
            ])
        ]);
    }
};
