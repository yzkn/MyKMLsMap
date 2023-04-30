// Copyright (c) 2023 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.


mapboxgl.accessToken = 'pk.eyJ1IjoieWFhbmQiLCJhIjoiY2xndzNsYzVhMDg4NzNmbG5nYW5uMXJ4ayJ9.5m5s747Lt_veKrdxoirjGA'; // このサイトのみで使えるキー


// var slopemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png'


var map = new mapboxgl.Map({
    container: 'map',
    hash: true,
    style: 'js/pale.json',
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
            'https://ya-androidapp.github.io/MyKMLsMap/tiles/{z}/{x}/{y}.pbf'
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
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
map.addControl(new mapboxgl.ScaleControl());
map.addControl(new MapboxExportControl({
    Format: Format.PNG,
    DPI: DPI[400]
}), 'bottom-right');
