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
                <span></span>
                <div className='footer'>
                  @2019 Made by <span className='author'>Guillaume</span> and <span onClick={()=> window.open("https://www.linkedin.com/in/zachchang/", "_blank")} className='author'>Zach</span>
                  <div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/prosymbols" title="Prosymbols">Prosymbols</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
