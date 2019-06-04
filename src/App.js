import React from 'react';
import './scss/App.scss';
import Graph from './components/Graph';
import GraphZoom from './components/GraphZoom';

function App() {
  return (
    <div className="App">
      <Graph id={1}></Graph>
      <GraphZoom id={2}></GraphZoom>
    </div>
  );
}

export default App;
