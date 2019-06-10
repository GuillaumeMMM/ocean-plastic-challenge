import React, { Component } from 'react';
import * as d3 from 'd3';
import { data, dataZoomed } from '../assets/data.js';

class GraphZoom extends Component {

    state = {
        width: 0,
        height: 0,
    }

    render() {

        return (
            <React.Fragment>
                <div className="graph-container" id="zoomed-chart" style={{ width: '60vw', height: '48vh' }}>
                    <div className="graph-title-zoomed">The impact you may have in 2025 on the mismanaged plastic waste (in tons)</div>
                </div>
                {/* <button onClick={this.splitLines.bind(this, 0.001)}>Split Lines</button>
                <button onClick={this.subtractMore.bind(this, 0.01)}>Subtract More</button> */}
            </React.Fragment>
        );
    }

    componentDidMount() {
        const width = document.getElementById('zoomed-chart').clientWidth;
        const height = document.getElementById('zoomed-chart').clientHeight;
        this.setState({ width: width, height: height }, this.initGraph)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showZoomedGraph && !nextProps.clickedFriend) {
            console.log(nextProps)
            // document.getElementsByClassName('zoomed-graph').display = 'block';
            // document.getElementsById('zoomed-graph').display = 'block';
            document.getElementById('zoomed-chart').style.position = 'relative';
            document.getElementById('zoomed-chart').style.marginTop = '0px';
            document.getElementById('zoomed-chart').style.opacity = '1';

            d3.select('#main-clip-path-small-rect').transition().duration(1000).ease(d3.easeLinear).delay(1000)
            .attr('width', this.relativeWidth(100) - this.relativeWidth(this.state.margin.left) - this.relativeWidth(this.state.margin.right));

            this.drawHistoryPoints();
        }

        if (nextProps.clickedFriend && !nextProps.clickedFnf) {
            this.subtractMore(0.115, 1);
        }

        if (nextProps.clickedFnf) {
            this.subtractMore(1.15, 2)
        }
    }

    initGraph = () => {
        const { width, height } = this.state;

        const svg = d3.select('#zoomed-chart')
            .append('svg').attr('id', 'main-svg-' + this.props.id)
            //  The viewbox will try to fill all the space given but preserving the ratio.
            //  h = div height, w = div width
            //  if h > w viewbox = 0 0 100 100*h/w
            //  if w > h viewbox = 0 0 100*w/h 100
            .attr('viewBox', () => {
                return width < height ? '0 0 100 ' + (100 * height / width) : '0 0 ' + (100 * width / height) + ' 100';
            })
            .attr('class', 'svg-content');

        const margin = { top: 5, right: 5, bottom: 10, left: 15 };

        const mainGroup = svg.append('g')
            .attr('class', 'main-group')
            .attr('transform', 'translate(' + this.relativeWidth(0) + ', ' + this.relativeHeight(0) + ')');

        let totalData = JSON.parse(JSON.stringify(dataZoomed));
        totalData.map(date => {
            date.value = date.waste_mismanadged;
            return date;
        });
        console.log(totalData)
        //  Dataset until now with valid dates
        const newData = JSON.parse(JSON.stringify(totalData));
        newData.forEach((year, i) => newData[i].date = d3.timeParse("%Y-%m-%d")(year.date));
        console.log(newData)

        //  Time scale
        const x = d3.scaleTime()
            .domain(d3.extent(newData, function (d, i) { return i === newData.length - 1 ? d3.timeHour.offset(d.date, 6) : d.date; }))
            .range([this.relativeWidth(margin.left), this.relativeWidth(100 - margin.right)]);

        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-x')
            .attr("transform", 'translate(0,' + this.relativeHeight(100 - margin.bottom) + ')')
            .call(d3.axisBottom(x).tickSize(0).ticks(1, d3.timeFormat("%Y-%m-%d")));

        //  y scale
        const y = d3.scaleLinear()
            .domain([235169999.90, 235170000.1])
            .range([this.relativeHeight(100 - margin.bottom), this.relativeHeight(margin.top)]);


        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-y')
            .attr("transform", 'translate(' + this.relativeWidth(margin.left) + ',0)')
            .call(d3.axisLeft(y).tickSize(0).ticks(3));

        //  clip path graph
        mainGroup.append('clipPath')
            .attr('id', 'main-clip-path-small')
            .append('rect').attr('id', 'main-clip-path-small-rect')
            .attr('x', this.relativeWidth(margin.left) + 0.5)
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('width', 0)
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top));

        //  grid clip path graph
            mainGroup.append('clipPath')
            .attr('id', 'grid-clip-path')
            .append('rect')
            .attr('x', this.relativeWidth(margin.left) + 0.5)
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top))
            .attr('width', this.relativeWidth(100) - this.relativeWidth(margin.left) - this.relativeWidth(margin.right));

        const linesGroup = mainGroup.append('g')
            .attr('clip-path', 'url(#main-clip-path-small)');

        const gridGroup = mainGroup.append('g').attr('class', 'grid-lines').attr('clip-path', 'url(#grid-clip-path');
        const gridXGroup = gridGroup.append('g').attr('class', 'grid-x-lines');
        const gridYGroup = gridGroup.append('g').attr('class', 'grid-y-lines');
        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(10)
        }
        function make_y_gridlines() {
            return d3.axisLeft(y)
        }

        gridXGroup.attr('transform', 'translate(0, ' + height + ')').call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

        gridYGroup.attr('transform', 'translate(' + this.relativeWidth(margin.left) + ', 0)').call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

        console.log(newData)
        //  line until now
        linesGroup.append("path").datum(newData)
            .attr("fill", "none")
            .attr('class', 'now-path')
            .attr("stroke", "white")
            .attr("stroke-width", '0.4px')
            .attr("d", d3.line().curve(d3.curveCardinal)
                .x(d => x(d.date))
                .y(function (d) { return y(d.value) })
            );


        this.setState({ data: totalData, mainGroup: mainGroup, linesGroup: linesGroup, margin: margin, y: y, x: x, svg: svg, gridYGroup: gridYGroup });
    }

    //  Takes a % ang returns the right height
    relativeHeight = (height) => {
        return this.state.width < this.state.height ? height * this.state.height / this.state.width : height;
    }

    //  Takes a % ang returns the right width
    relativeWidth = (width) => {
        return this.state.width < this.state.height ? width : width * this.state.width / this.state.height;
    }

    drawHistoryPoints = () => {
        const pointsGroup = this.state.mainGroup.append('g').attr('class', 'points-group');
        const firstPointGroup = pointsGroup.append('g').attr('class', 'first-points-group').attr('transform', 'translate(' + this.state.x(d3.timeParse("%Y-%m-%d")(this.state.data[this.state.data.length - 1].date)) + ', ' + this.state.y(this.state.data[this.state.data.length - 1].value) + ')');

        firstPointGroup.append('circle').attr('class','point-circle').attr('cx', 0).attr('cy', 0).attr('fill', 'black').attr('r', 0).transition().duration(500).delay(2000).attr('r', 1);
        firstPointGroup.append('rect').attr('x', -0.2).attr('y', -2).attr('width', 0.4).attr('height', 0).attr('fill', 'white').transition().duration(500).delay(2500).attr('height', 18).attr('y', -20);
        firstPointGroup.append('text').attr('fill', 'white').attr('x', 0).attr('y', -18).text('2025').style('font-size', '3px').attr('opacity', 0).transition().duration(500).delay(3000).attr('opacity', 1).attr('x', 1);
        firstPointGroup.append('text').attr('fill', 'white').attr('x', 0).attr('y', -14).text('Mismanaged plastic').style('font-size', '3px').attr('opacity', 0).transition().duration(500).delay(3500).attr('opacity', 1).attr('x', 1);
        firstPointGroup.append('text').attr('fill', 'white').attr('x', 0).attr('y', -10.5).text('in the ocean forecast').style('font-size', '3px').attr('opacity', 0).transition().duration(500).delay(3500).attr('opacity', 1).attr('x', 1).on('end', this.splitLines.bind(this, 0.0115));

        // this.splitLines(0.001);
    }

    splitLines = (val) => {

        const x = this.state.x;
        const y = this.state.y;

        let subtractedValue = val;

        const pathClone = this.state.mainGroup.select('.now-path').clone();
        let currentBindedData = pathClone.datum();
        currentBindedData[0].value2 = currentBindedData[0].value - subtractedValue;
        currentBindedData[1].value2 = currentBindedData[1].value - subtractedValue;

        console.log(currentBindedData)
        pathClone.datum(currentBindedData).attr('class', 'path-clone').transition().duration(1000)
            .attr('d', d3.line().curve(d3.curveMonotoneY)
                .x(d => x(d.date))
                .y(d => y(d.value2))
            );

        this.state.mainGroup.select('.now-path').transition().duration(1000)
            .style('stroke', 'lightgrey')

        var area = d3.area().curve(d3.curveMonotoneY)
            .x(d => x(d.date))
            .y0(d => y(d.value))
            .y1(d => y(d.value2));

        this.state.linesGroup.append('path')
            .datum(currentBindedData)
            .style('fill', 'white')
            .style('fill-opacity', 0)
            .style('stroke', 'none')
            .attr('class', 'area')
            .attr('d', area)
            .transition().duration(1000).delay(1000)
            .style('fill-opacity', 0.3);

        const pointsGroup = this.state.mainGroup.select('.points-group');
        this.state.mainGroup.select('.second-points-group').remove();
        const secondPointGroup = pointsGroup.append('g').attr('class', 'second-points-group').attr('transform', 'translate(' + this.relativeWidth(50) + ', ' + this.relativeHeight(50) + ')');

        secondPointGroup.append('circle').attr('class','point-circle').attr('cx', 0).attr('cy', 0).attr('fill', 'black').attr('r', 0).transition().duration(500).delay(1000).attr('r', 1);
        secondPointGroup.append('rect').attr('class', 'wasted-rect').attr('x', -0.2).attr('y', -2).attr('width', 0.4).attr('height', 0).attr('fill', 'white').transition().duration(500).delay(1500).attr('height', 18).attr('y', -20);
        secondPointGroup.append('text').attr('class', 'wasted-impact-text').attr('fill', 'white').attr('x', 0).attr('y', -18).text('Your Impact').style('font-size', '3px').attr('opacity', 0).transition().duration(500).delay(2000).attr('opacity', 1).attr('x', 1);
        secondPointGroup.append('text').attr('class', 'wasted-text').attr('fill', 'white').attr('x', 0).attr('y', -14).text((val * 1000) + 'kg not wasted').style('font-size', '3px').attr('opacity', 0).transition().duration(500).delay(2000).attr('opacity', 1).attr('x', 1);
    }

    subtractMore = (val, index) => {
        const x = this.state.x;
        const y = this.state.y;
        

        console.log(y.domain);
        console.log(val)

        let currentBindedData = this.state.mainGroup.select('.path-clone').datum();
        currentBindedData[0].value2 = currentBindedData[0].value2 - val;
        currentBindedData[1].value2 = currentBindedData[1].value2 - val;
        console.log(currentBindedData)

        y.domain([currentBindedData[1].value2 - (val * 3), currentBindedData[1].value + (4 * val)])

        if (index === 2) {
            y.domain([currentBindedData[1].value2 - (val), currentBindedData[1].value + (2 * val)])
        }
        this.state.mainGroup.select('.graph-axis-y').transition().duration(1000)
            .call(d3.axisLeft(y).tickSize(0).ticks(3));

        this.state.gridYGroup.transition().duration(1000).call(d3.axisLeft(y)
        .tickSize(-this.state.width)
        .tickFormat("")
        )

        this.state.mainGroup.select('.now-path').transition().duration(1000).attr("d", d3.line().curve(d3.curveCardinal)
        .x(d => x(d.date))
        .y(function (d) { return y(d.value) })
        );

        this.state.mainGroup.select('.first-points-group').transition().duration(1000).attr('transform', 'translate(' + x(d3.timeParse("%Y-%m-%d")(this.state.data[this.state.data.length - 1].date)) + ', ' + y(this.state.data[this.state.data.length - 1].value) + ')');

            this.state.mainGroup.select('.wasted-text').text((val * 1000) + 'kg not wasted');

        this.state.mainGroup.select('.path-clone').transition().duration(1000)
        .attr('d', d3.line().curve(d3.curveMonotoneY)
        .x(d => x(d.date))
        .y(d => y(d.value2)));

        var area = d3.area().curve(d3.curveMonotoneY)
        .x(d => x(d.date))
        .y0(d => y(d.value))
        .y1(d => y(d.value2));

        this.state.mainGroup.select('.area')
        .transition().duration(1000)
        .attr('d', area)
        .transition().duration(1000).delay(1000)
        .style('fill-opacity', 0.3);
    }


}

export default GraphZoom;