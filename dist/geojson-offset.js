'use strict';

/**
 * add offset to GeoJSON coordinates.
 * @param {object}  geojson GeoJSON to change
 * @param {integer} xOffset x-coordinate offset
 * @param {integer} yOffset y-coordinate offset
 */
exports.offset = offset;

/**
 * add offset to GeoJSON coordinates.
 * @param {object}  geojson GeoJSON to change
 * @param {integer} xRange  x-coordinate offset range
 * @param {integer} yRange  y-coordinate offset range
 */
exports.randomOffset = randomOffset;

function offset(geojson, xOffset, yOffset) {
  if (geojson.type === 'Point') {
    pointOffset(geojson.coordinates, xOffset, yOffset);
  } else if (geojson.type === 'MultiPoint' || geojson.type === 'LineSTring') {
    lineStringOffset(geojson.coordinates, xOffset, yOffset);
  } else if (geojson.type === 'MultiLineString' || geojson.type === 'Polygon') {
    polygonOffset(geojson.coordinates, xOffset, yOffset);
  } else if (geojson.type === 'MultiPolygon') {
    geojson.coordinates.forEach((function (polygon) {
      return polygonOffset(polygon);
    }));
  } else if (geojson.type === 'Feature') {
    offset(geojson.geometry);
  } else if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((function (feature) {
      return offset(feature);
    }));
  }

  return geojson;
}

function randomOffset(geojson, xRange, yRange) {
  var xOffset = xRange[0] + (xRange[1] - xRange[0]) * Math.random();
  var yOffset = yRange[0] + (yRange[1] - yRange[0]) * Math.random();

  return offset(geojson, xOffset, yOffset);
}

function pointOffset(coordinates, x, y) {
  coordinates[0] += x;
  coordinates[1] += y;
}

function lineStringOffset(coordinates, x, y) {
  coordinates.forEach((function (point) {
    return pointOffset(point);
  }));
}

function polygonOffset(coordinates, x, y) {
  coordinates.forEach((function (line) {
    return lineStringOffset(line);
  }));
}
