/* global mapboxgl */

import lights from "./lights.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FyZGVybmUiLCJhIjoiY2puMXN5cnBtNG53NDN2bnhlZ3h4b3RqcCJ9.eNjrtezXwvM7Ho1VSxo06w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [-1.15, 51.3],
  zoom: 7.5,
  minZoom: 3,
  maxZoom: 16,
  maxBounds: [-15, 42, 9, 67],
  projection: "globe",
});
map.addControl(new mapboxgl.NavigationControl());

map.on("style.load", () => {
  map.setFog({});
});

map.on("load", () => {
  map.addSource("lights", {
    type: "geojson",
    data: lights,
  });

  const green = "#7cbd4e";
  const amber = "#e9df41";
  const red = "#e25330";
  const cols = [green, amber, red];
  let i1 = 0;
  let i2 = 1;
  let i3 = 2;

  const getColor = (i1, i2, i3) => [
    "case",
    ["==", ["get", "gr"], 1],
    cols[i1],
    ["==", ["get", "gr"], 2],
    cols[i2],
    cols[i3],
  ];

  const getSize = (i1, i2, i3) => {
    const greenNow = [i1, i2, i3].indexOf(0) + 1;
    return [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      ["case", ["==", ["get", "gr"], greenNow], 1, 0.7],
      16,
      ["case", ["==", ["get", "gr"], greenNow], 9, 6],
    ];
  };

  map.addLayer({
    id: "lights",
    type: "circle",
    source: "lights",
    layout: {},
    paint: {
      "circle-radius": getSize(i1, i2, i3),
      "circle-color": getColor(i1, i2, i3),
      "circle-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.1, 16, 1],
    },
  });

  const changeColors = () => {
    i1 = (i1 + 1) % 3;
    i2 = (i2 + 1) % 3;
    i3 = (i3 + 1) % 3;
    map.setPaintProperty("lights", "circle-color", getColor(i1, i2, i3));
    map.setPaintProperty("lights", "circle-radius", getSize(i1, i2, i3));
  };

  setInterval(changeColors, 3000);

  const fly = () => {
    const target = {
      center: [-0.158, 51.513],
      zoom: 16,
      bearing: 80,
      pitch: 65,
    };
    map.flyTo({
      ...target,
      duration: 32000,
      essential: true,
    });
  };

  document.getElementById("fly").addEventListener("click", fly);
});
