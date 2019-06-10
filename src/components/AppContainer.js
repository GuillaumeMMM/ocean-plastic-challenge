import React, { Component } from 'react';
import Graph from './Graph';
import GraphZoom from './GraphZoom';
import Controller from './Controller';

class AppContainer extends Component {

    state = {
        showZoomedGraph: false,
        clickedFriend: false,
        clickedFnf: false
    }

    render() {
        return (
            <React.Fragment>
                <Controller handleClick={this.handleClick}/>
                <div className='chart-container'>
                    <Graph id={1} showZoomedGraph={this.state.showZoomedGraph}></Graph>
                    <GraphZoom id={2} className="graph-zoom" showZoomedGraph={this.state.showZoomedGraph} clickedFriend={this.state.clickedFriend} clickedFnf={this.state.clickedFnf}></GraphZoom>
                </div>  
            </React.Fragment>
        );
    }

    handleClick = (type) => {
        console.log(type);
        if (!this.state.showZoomedGraph) {
            this.setState({showZoomedGraph: true});
        }
        if (type === 'friend') {
            this.setState({clickedFriend: true});
        }
        if (type === 'fnf') {
            this.setState({clickedFnf: true});
        }
    }
}

export default AppContainer;