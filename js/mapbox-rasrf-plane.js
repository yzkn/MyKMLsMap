// Copyright (c) 2023 YA-androidapp(https://github.com/yzkn) All rights reserved.


mapboxgl.accessToken = 'pk.eyJ1IjoieWFhbmQiLCJhIjoiY2xndzNsYzVhMDg4NzNmbG5nYW5uMXJ4ayJ9.5m5s747Lt_veKrdxoirjGA'; // このサイトのみで使えるキー
const NOWCAST_URL = 'https://www.jma.go.jp/bosai/jmatile/data/rasrf/targetTimes.json';

var map = new mapboxgl.Map({
    container: 'map',
    hash: true,
    style: {
        version: 8,
        sources: {
            slopemap: {
                type: "raster",
                tiles: [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
                attribution:
                    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            },
        },
        layers: [
            {
                id: "slopemap",
                type: "raster",
                source: "slopemap"
            },
        ],
    },
    center: [138.71269226074222, 35.91685961322499],
    zoom: 7,
    maxZoom: 18,
    minZoom: 0,
    localIdeographFontFamily: false
});

map.on('load', () => {
    map.addSource('All', {
        'type': 'vector',
        'tiles': [
            'https://yzkn.github.io/MyKMLsMap/tiles/{z}/{x}/{y}.pbf'
        ],
        'minzoom': 0,
        'maxzoom': 18
    });
    map.addLayer(
        {
            'id': 'All',
            'type': 'line',
            'source': 'All',
            'source-layer': 'All',
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-opacity': 0.8,
                'line-color': 'rgb(255, 0, 0)',
                'line-width': 1
            }
        }
    );

    fetch(NOWCAST_URL)
        .then(function (data) {
            return data.json();
        })
        .then(function (json) {
            // 最小値を取得にはjson[0].validtime
            json.sort(function (a, b) {
                return a.validtime - b.validtime;
            });

            json.forEach(element => {
                const basetime = element.basetime;
                const validtime = element.validtime;
                const sourceId = `Nowcast${basetime}${validtime}`;

                map.addSource(sourceId, {
                    'type': 'raster',
                    'tiles': [
                        `https://www.jma.go.jp/bosai/jmatile/data/rasrf/${element.basetime}/immed/${element.validtime}/surf/rasrf/{z}/{x}/{y}.png`
                    ],
                    'minzoom': 4,
                    'maxzoom': 14
                });
                map.addLayer(
                    {
                        'id': sourceId,
                        'type': 'raster',
                        'source': sourceId,
                        'source-layer': sourceId
                    }
                );
                map.setPaintProperty(sourceId, "raster-opacity", 0.1);
            });
        });
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
map.addControl(new mapboxgl.ScaleControl());
map.addControl(new MapboxExportControl({
    Format: Format.PNG,
    DPI: DPI[400]
}), 'bottom-right');

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }),
    'bottom-right'
);
