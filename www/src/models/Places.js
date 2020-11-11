let m = require("mithril");

let L = require("leaflet");

const Map = require("../models/MapModel");

const kommuns = require("../models/kommuns");

let Places = {
    loaded: false,

    icon: L.icon({
        iconUrl: 'marker-icon-green.png',
        iconSize:     [26, 42],
        iconAnchor:   [13, 42],
        popupAnchor:  [0, -36]
    }),

    // Use current year -2 to get data.
    // api.kolada.se doesn't seem to have any data more recent than from approximately 2 years ago.
    year: new Date().getFullYear() -2,

    loadList: function () {
        return m.request({
            method: "GET",
            url: `
https://api.kolada.se/v2/data
/kpi/N07403,N02905,N07402,U07417,U07452,U07418
/municipality/1440,1489,0764,0604,1984,2506,2505,
1784,1882,2084,1460,2326,2403,1260,2582,1443,2183,
0885,2081,1490,0127,0560,1272,2305,1231,1278,
1438,0162,1862,2425,1730,0125,0686,0862,0381,
0484,1285,1445,1982,1382,1499,2080,1782,0562,
0482,1763,1439,2026,0662,0461,0617,0980,1764,
1444,1447,2523,2180,1480,1471,0643,1783,1861,
1961,1380,1761,0136,2583,0331,2083,1283,1466,
1497,2104,0126,2184,0860,1315,1863,2361,2280,
1401,1293,0305,1284,0821,1266,1267,2510,0123,
0680,2514,0880,1446,1082,1883,1080,1780,0483,
1715,0513,2584,1276,0330,2282,1290,1781,2309,
1881,1384,1960,1482,1261,1983,1381,1282,1860,
1814,2029,1441,0761,0186,1494,1462,1885,0580,
0781,2161,1864,1262,2085,2580,1281,2481,1484,
1280,2023,2418,1493,1463,0767,1461,0586,2062,
0583,0642,1430,1762,1481,0861,0840,0182,1884,
1962,2132,2401,0581,0188,2417,0881,0140,0480,
0192,0682,2101,1060,2034,1421,1273,0882,2121,
0481,2521,1402,1275,2581,2303,2409,1081,2031,
1981,0128,2181,0191,1291,1265,1495,2482,1904,
1264,1496,2061,2283,0163,0184,2422,1427,1230,
1415,0180,1760,2421,0486,1486,2313,0183,2281,
1766,1907,1214,1263,1465,1785,2082,0684,2182,
0582,0181,1083,1435,1472,1498,0360,2262,0763,
1419,1270,1737,0834,1452,0687,1287,1488,0488,
0138,0160,1473,1485,1491,2480,0114,0139,0380,
0760,0584,0665,0563,0115,2021,1470,1383,0187,
1233,0685,2462,0884,2404,0428,1487,2460,0120,
0683,0883,1980,0780,1442,0512,1286,0765,2039,
0319,2560,1292,1492,2260,2321,1765,2463,1277,
0561,1407,0509,1880,1257,2284,2380,0117,0382,
1256,2513,2518/year/
            ` + Places.year,
        }).then(async function (result) {
            Places.renderResults(result);
        });
    },

    renderResults: function (result) {
        // Loop through the results.
        for (let i = 0; i < result.values.length; i++) {
            // Get the corresponding municipality from kommuns.kommuns.
            let place = kommuns.kommuns.filter((kommun) => {
                return kommun.id === result.values[i].municipality;
            })[0];

            let data;

            // Extract the data and round to two digits.
            if (result.values[i].values.length < 3) {
                data = (result.values[i].values[0].value != null)
                    ? parseFloat(result.values[i].values[0].value).toFixed(2) : "Data saknas";
            } else {
                data = (result.values[i].values[2].value != null)
                    ? parseFloat(result.values[i].values[2].value).toFixed(2) : "Data saknas";
            }

            // Assign the kpi code as key and data as value to the municipality in kommuns.kommuns.
            place[result.values[i].kpi] = data;
        }

        let markers = L.markerClusterGroup({
            iconCreateFunction: function(cluster) {
                return L.divIcon({
                    html: '<b>' + cluster.getChildCount() + '</b>',
                    className: "div-icon div-icon-green",
                    iconSize: 42
                });
            }
        });

        // Loop through the places and set markers using the locations
        for (let place of kommuns.kommuns) {
            markers.addLayer(
                L.marker(
                    [place.pos[0], place.pos[1]],
                    {icon: Places.icon}
                ).bindPopup(`
                <h3>${place.title}</h3>
                <h4>Statistik 2018</h4>
                <table class="table">
                    <tr>
                        <th>Anmälda våldsbrott, antal/100 000 inv:</th>
                        <td>${place["N07403"]}</td>
                    </tr>
                    <tr>
                        <th>Anmälda våldsbrott (treårsmedelvärde), antal/1000 inv:</th>
                        <td>${place["U07418"]}</td>
                    </tr>
                    <tr>
                        <th>Anmälda brott om grov kvinnofridskränkning i kommunen,
                            antal/100 000 inv:
                        </th>
                        <td>${place["N07402"]}</td>
                    </tr>
                    <tr>
                        <th>Anmälda stöld- och tillgreppsbrott, antal/1000 inv:</th>
                        <td>${place["U07417"]}</td>
                    </tr>
                    <tr>
                        <th>Anmälda brott om skadegörelse per 1 000 inv:</th>
                        <td>${place["U07452"]}</td>
                    </tr>
                    <tr>
                        <th>Invånare 15-17 år lagförda för brott, antal/1000 inv:</th>
                        <td>${place["N02905"]}</td>
                    </tr>
                </table>
                `)
            );
        }
        Map.myMap.addLayer(markers);

        Places.loaded = true;
        m.redraw();
    }
};

module.exports = Places;
