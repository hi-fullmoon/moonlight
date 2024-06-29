import React, { useEffect, useRef } from 'react';
import type { Meta } from '@storybook/react';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import 'ol/ol.css';
import * as interaction from 'ol/interaction';
import { PlotType } from '../src/typings';
import { MLPlot } from '../src';
import data from './data';
import '../src/index.css';

const meta = {
  title: 'Example/OLPlot',
} satisfies Meta;

export default meta;

export const Demo = () => {
  const plotRef = useRef<MLPlot>();

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: [12929305.990232274, 4845146.768735993],
        zoom: 5,
      }),
      interactions: interaction.defaults({
        doubleClickZoom: false,
        keyboard: false,
      }),
    });

    plotRef.current = new MLPlot({ map, mode: 'edit' });
    plotRef.current.initData(data);
    map.addLayer(plotRef.current.getLayer()!);
  }, []);

  const handleDrawStart = (type: PlotType) => {
    plotRef.current?.stopDrawing();
    plotRef.current?.startDrawing(type);
  };

  const handleClear = () => {
    plotRef.current?.clear();
  };

  const handleDelete = () => {
    plotRef.current?.startRemoving();
  };

  const getData = () => {
    console.log(JSON.stringify(plotRef.current?.getData()));
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <button onClick={() => handleDrawStart('TEXT')}>文字</button>
        <button onClick={() => handleDrawStart('LINE')}>线</button>
        <button onClick={() => handleDrawStart('CIRCLE')}>圆</button>
        <button onClick={() => handleDrawStart('ELLIPSE')}>椭圆</button>
        <button onClick={() => handleDrawStart('POLYGON')}>多边形</button>
        <button onClick={() => handleDrawStart('ARROW')}>箭头</button>
        <button onClick={() => handleDrawStart('MEASURE_DISTANCE')}>测距离</button>
        <button onClick={() => handleDrawStart('MEASURE_AREA')}>测面积</button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <button onClick={handleClear}>清空</button>
        <button onClick={handleDelete}>删除</button>
        <button onClick={getData}>获取数据</button>
      </div>
      <div id="map" style={{ width: '100%', height: 500 }}></div>
    </>
  );
};
