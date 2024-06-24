export default {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [101.80186317361239, 25.42892621285828],
          [102.44602718449477, 25.426960824202617],
          [102.81075798965338, 24.969461126398166],
          [102.35233896470908, 24.472158285003026],
        ],
      },
      properties: {
        // type: 'LINE',
        type: 'MEASURE_DISTANCE',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.24638159073238, 25.44834171808871],
            [103.63948245591764, 24.987450366984927],
            [103.9723569998825, 25.337980384152257],
            [103.68126389629488, 25.580995394062125],
          ],
        ],
      },
      properties: {
        // type: 'POLYGON',
        type: 'MEASURE_AREA',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [102.27921255923155, 24.893875302892052] },
      properties: {
        type: 'POINT',
        icon: 'jijiedian',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [103.68126389629488, 25.580995394062125] },
      properties: {
        type: 'CIRCLE',
        radius: 0.5,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
      properties: {
        type: 'RECTANGLE',
        coordinates: [
          [102.87177757418995, 25.231551168631636],
          [102.66904079414253, 25.732591835927092],
        ],
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [101.221582, 25.119815] },
      properties: {
        type: 'ELLIPSE',
        center: [101.221582, 25.119815],
        majorRadius: 0.7,
        minorRadius: 0.3,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [101.27921255923155, 24.893875302892052] },
      properties: {
        type: 'TEXT',
        text: '你想表达什么呢？',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [101.70186317361239, 25.22892621285828],
          [102.34602718449477, 25.426960824202617],
        ],
      },
      properties: {
        type: 'ARROW',
      },
    },
  ],
};
