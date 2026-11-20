// Copyright (c) 2024 YA-androidapp(https://github.com/yzkn) All rights reserved.




class ShareControl {
    onAdd(map) {
        this.map = map;

        const shareButton = document.createElement('button');
        shareButton.title = 'Share current location';
        shareButton.type = 'button';
        shareButton.innerHTML = '🔗';
        shareButton.addEventListener('click', async (e) => {
            const currentLocation = map.getCenter();
            const locationName = await reverseGeocoding(currentLocation.lat, currentLocation.lng);
            console.log({locationName})
            shareMessage(locationName, currentLocation.lat, currentLocation.lng)
        });

        this.container = document.createElement('div');
        this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this.container.appendChild(shareButton);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}


function shareMessage(locationName, latitude, longitude) {
    const date = new Date();
    const dateString = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds();

    const gMapURL = encodeURI(`https://www.google.com/maps/search/?query=${latitude},${longitude}`);
    // const webIntentURL = `https://twitter.com/intent/tweet?url=${gMapURL}&text=${locationName}`;
    // window.open(webIntentURL, 'x');
    if (navigator.canShare) {
        navigator.share({
            // title: locationName, // + " ( " + dateString + " )",
            text: locationName + " " + gMapURL,
        }).then(() => {
            console.log('共有に成功しました。')
        }).catch((error) => {
            console.log('共有に失敗しました。', error)
        })
    } else {
        console.log('共有に失敗しました。')
    }
}


var map = new maplibregl.Map({
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
});

map.addControl(new maplibregl.FullscreenControl(), 'bottom-right');
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
map.addControl(new maplibregl.ScaleControl());
map.addControl(new MaplibreExportControl.MaplibreExportControl({
    Format: MaplibreExportControl.Format.PNG,
    DPI: MaplibreExportControl.DPI[400]
}), 'bottom-right');

map.addControl(
    new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    }),
    'bottom-right'
);

map.addControl(new ShareControl(), 'bottom-right');
