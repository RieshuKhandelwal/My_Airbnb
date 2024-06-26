mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    style:'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const nav = new mapboxgl.NavigationControl({});
map.addControl(nav,'top-left');


const marker1 = new mapboxgl.Marker({color: "red",})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h5>${listing.title}</h5><p>Exact Loaction will be provided after booking</p>`))
    .addTo(map);
