import React from 'react';
import './scss/App.scss';
import Graph from './components/Graph';
import GraphZoom from './components/GraphZoom';

function App() {
  return (
    <div className="App">
      <GraphZoom></GraphZoom>
    </div>
  );
}

export default App;
