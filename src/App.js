import React from 'react';
import './scss/App.scss';
import Graph from './components/Graph';
import GraphZoom from './components/GraphZoom';
import Controller from './components/Controller';

function App() {
  return (
    <div className="App">
      <Controller/>
      <div className='chart-container'>
        <Graph id={1}></Graph>
        <GraphZoom id={2}></GraphZoom>
      </div>
    </div>
  );
}

export default App;
