// Copyright (c) 2023 YA-androidapp(https://github.com/yzkn) All rights reserved.


var map;

const initMap = () => {
    map = L.map('map');

    var slopemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", minZoom: 3, maxZoom: 15
    }).addTo(map);

    var pale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", minZoom: 2, maxZoom: 18
    });

    var baseMaps = {
        "傾斜量図": slopemap,
        "淡色地図": pale
    };
    L.control.layers(baseMaps).addTo(map);


    L.vectorGrid.protobuf("./tiles/{z}/{x}/{y}.pbf", {
        attribution: "Copyright (c) 2023 <a href='https://github.com/yzkn' target='_blank'>yzkn</a> All rights reserved.",
        maxNativeZoom: 18,
        minNativeZoom: 1,
        maxZoom: 18,
        rendererFactory: L.canvas.tile,
        vectorTileLayerStyles: {
            "All": {
                color: "red",
                weight: 1
            }
        }
    }).addTo(map);

    map.setView([35.91685961322499, 138.71269226074222], 7);
}

window.addEventListener('DOMContentLoaded', (event) => {
    initMap();
});
