export default {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [10955261.212667817, 5651665.056006699] },
      properties: { type: 'TEXT', text: '你想要表达什么？' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [10744529.99874628, 5421265.34066239],
          [11581415.732033618, 5425735.861779577],
          [10961624.8938547, 4917545.174972008],
          [11821741.81068004, 4860386.699832492],
        ],
      },
      properties: { type: 'LINE' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [12201121.772884283, 5429855.6981712915] },
      properties: { type: 'CIRCLE', radius: 403782.25585343334 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [13141367.984759543, 5448656.818472311] },
      properties: {
        type: 'ELLIPSE',
        center: [13141367.984759543, 5448656.818472311],
        majorRadius: 107448.66527261212,
        minorRadius: 354849.34918539505,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14211404.569245175, 5229340.322938281],
            [13852270.566325825, 5563183.970579127],
            [14528266.506865688, 5929222.68552619],
            [15019441.893161977, 5393435.544268397],
            [14681259.996292735, 4891299.804713152],
            [14553905.755376812, 5576551.34377371],
          ],
        ],
      },
      properties: { type: 'POLYGON' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [13816206.620918024, 4779733.094541677],
          [13691260.444975227, 5343718.631847441],
        ],
      },
      properties: { type: 'ARROW' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [11546183.03930842, 4665415.24851622],
          [13297130.524969079, 4758497.9326212015],
        ],
      },
      properties: { type: 'MEASURE_DISTANCE' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9793967.242464062, 5208954.570811],
            [10412017.53784189, 6125164.727858422],
            [10546591.590064915, 4902936.330501048],
            [10231662.201168895, 5398328.356310699],
          ],
        ],
      },
      properties: { type: 'MEASURE_AREA' },
    },
  ],
};
