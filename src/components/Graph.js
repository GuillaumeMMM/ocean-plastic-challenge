import React, { Component } from 'react';
import * as d3 from 'd3';
import { data } from '../assets/data.js';

class Graph extends Component {

    state = {
        width: 0,
        height: 0,
    }

    render() {

        return (
            <React.Fragment>
                <div className="graph-container" id="basic-chart" style={{ width: '80vw', height: '60vh' }}>

                </div>
                {/* <button onClick={this.drawHistoryPoints}>Zoom in</button> */}
            </React.Fragment>
        );
    }

    componentDidMount() {
        const width = document.getElementById('basic-chart').clientWidth;
        const height = document.getElementById('basic-chart').clientHeight;
        this.setState({ width: width, height: height }, this.initGraph)
    }

    componentWillReceiveProps(nextProps) {
    }

    initGraph = () => {
        const { width, height } = this.state;

        const svg = d3.select('#basic-chart')
            .append('svg').attr('id', 'main-svg-' + this.props.id)
            //  The viewbox will try to fill all the space given but preserving the ratio.
            //  h = div height, w = div width
            //  if h > w viewbox = 0 0 100 100*h/w
            //  if w > h viewbox = 0 0 100*w/h 100
            .attr('viewBox', () => {
                return width < height ? '0 0 100 ' + (100 * height / width) : '0 0 ' + (100 * width / height) + ' 100';
            })
            .attr('class', 'svg-content');

        const margin = { top: 5, right: 5, bottom: 10, left: 10 };

        const mainGroup = svg.append('g')
            .attr('class', 'main-group')
            .attr('transform', 'translate(' + this.relativeWidth(0) + ', ' + this.relativeHeight(0) + ')');

        let totalData = JSON.parse(JSON.stringify(data));
        totalData.map(year => {
            year.date = year.year + '-01-01';
            year.value = year.waste_mismanadged;
            return year;
        });

        //  Dataset until now with valid dates
        const untilNowData = JSON.parse(JSON.stringify(totalData));
        untilNowData.pop();
        untilNowData.forEach((year, i) => untilNowData[i].date = d3.timeParse("%Y-%m-%d")(year.date));

        //  Dataset until the forecast with valid dates
        const forecastData = JSON.parse(JSON.stringify(totalData));
        forecastData.forEach((year, i) => forecastData[i].date = d3.timeParse("%Y-%m-%d")(year.date));


        //  Time scale
        const x = d3.scaleTime()
            .domain(d3.extent(forecastData, function (d, i) { return i === 0 ? d3.timeYear.offset(d.date, -1) : i === forecastData.length - 1 ? d3.timeYear.offset(d.date, 1) : d.date; }))
            .range([this.relativeWidth(margin.left), this.relativeWidth(100 - margin.right)]);

        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-x')
            .attr("transform", 'translate(0,' + this.relativeHeight(100 - margin.bottom) + ')')
            .call(d3.axisBottom(x).tickSize(0).ticks(10, d3.timeFormat("%Y")));

        let yTicks = [];
        for (let i = 0; i < 6 ; i++) {
            yTicks.push(i * 50000000);
        }

        console.log(yTicks)
        //  y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(forecastData, function (d) { return d.value; }) + 10000000])
            .range([this.relativeHeight(100 - margin.bottom), this.relativeHeight(margin.top)]);


        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-y')
            .attr("transform", 'translate(' + this.relativeWidth(margin.left) + ',0)')
            .call(d3.axisLeft(y).tickSize(0).tickValues(yTicks));

        //  clip path graph
        mainGroup.append('clipPath')
            .attr('id', 'main-clip-path')
            .append('rect')
            .attr('x', this.relativeWidth(margin.left) + 0.5)
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('width', 0)
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top)).transition().duration(10000).ease(d3.easeLinear)
            .attr('width', this.relativeWidth(100) - this.relativeWidth(margin.left) - this.relativeWidth(margin.right));

        //  grid clip path graph
            mainGroup.append('clipPath')
            .attr('id', 'grid-clip-path')
            .append('rect')
            .attr('x', this.relativeWidth(margin.left) + 0.5)
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top))
            .attr('width', this.relativeWidth(100) - this.relativeWidth(margin.left) - this.relativeWidth(margin.right));

        //  clip path forecast
        mainGroup.append('clipPath')
            .attr('id', 'forecast-clip-path')
            .append('rect')
            .attr('x', 0.5 + x(d3.timeParse("%Y-%m-%d")(untilNowData[untilNowData.length - 1].date)))
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('width', 0.5 + x(forecastData[forecastData.length - 1].date) - x(d3.timeParse("%Y-%m-%d")(untilNowData[untilNowData.length - 1].date)))
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top));

        const linesGroup = mainGroup.append('g')
            .attr('clip-path', 'url(#main-clip-path)');

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
            .tickValues(yTicks)
        }

        gridXGroup.attr('transform', 'translate(0, ' + height + ')').call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

        gridYGroup.call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

        //  dash line forecast
        const forecastPath = linesGroup.append("path").datum(forecastData)
            .attr("fill", "none")
            .attr('class', 'forecast-path')
            .attr("stroke", "white")
            .attr("stroke-width", '0.4px')
            .attr('clip-path', 'url(#forecast-clip-path)')
            .attr("stroke-dasharray", '1, 1')
            .attr("d", d3.line().curve(d3.curveCardinal)
                .x(d => x(d.date))
                .y(function (d) { return y(d.value) })
            );

        //  line until now
        linesGroup.append("path").datum(untilNowData)
            .attr("fill", "none")
            .attr('class', 'now-path')
            .attr("stroke", "white")
            .attr("stroke-width", '0.4px')
            .attr("d", d3.line().curve(d3.curveCardinal)
                .x(d => x(d.date))
                .y(function (d) { return y(d.value) })
            );


        this.setState({ data: totalData, mainGroup: mainGroup, linesGroup: linesGroup, margin: margin, y: y, x: x, svg: svg }, this.drawHistoryPoints);
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
        const firstPointGroup = pointsGroup.append('g').attr('transform', 'translate(' + this.state.x(d3.timeParse("%Y-%m-%d")(this.state.data[0].date)) + ', ' + this.state.y(this.state.data[0].value) + ')');

        firstPointGroup.append('circle').attr('class','point-circle').attr('cx', 0).attr('cy', 0).attr('fill', 'black').attr('r', 0).transition().duration(500).delay(1000).attr('r', 1);
        firstPointGroup.append('rect').attr('x', -0.2).attr('y', -2).attr('width', 0.4).attr('height', 0).attr('fill', 'white').transition().duration(500).delay(1500).attr('height', 18).attr('y', -20);
        firstPointGroup.append('text').attr('x', 0).attr('y', -18).text('1980').style('font-size', '2.7px').attr('opacity', 0).transition().duration(500).delay(2000).attr('opacity', 1).attr('x', 1);
        firstPointGroup.append('text').attr('x', 0).attr('y', -15).text('Plastic starts').style('font-size', '2.3px').attr('opacity', 0).transition().duration(500).delay(2500).attr('opacity', 1).attr('x', 1);
        firstPointGroup.append('text').attr('x', 0).attr('y', -12.5).text('being recycled').style('font-size', '2.3px').attr('opacity', 0).transition().duration(500).delay(2500).attr('opacity', 1).attr('x', 1);


        const crisisPointGroup = pointsGroup.append('g').attr('transform', 'translate(' + this.state.x(d3.timeParse("%Y-%m-%d")('2008-01-01')) + ', ' + this.state.y(182088000) + ')');

        crisisPointGroup.append('circle').attr('class','point-circle').attr('cx', 0).attr('cy', 0).attr('fill', 'black').attr('r', 0).transition().duration(500).delay(7000).attr('r', 1);
        crisisPointGroup.append('rect').attr('x', -0.2).attr('y', 2).attr('width', 0.4).attr('height', 0).attr('fill', 'white').transition().duration(500).delay(7500).attr('height', 18)
        crisisPointGroup.append('text').attr('x', 0).attr('y', 19.5).text('2008').style('font-size', '2.7px').attr('opacity', 0).transition().duration(500).delay(8000).attr('opacity', 1).attr('x', 1);
        crisisPointGroup.append('text').attr('x', 0).attr('y', 16).text('Economic crisis').style('font-size', '2.3px').attr('opacity', 0).transition().duration(500).delay(8500).attr('opacity', 1).attr('x', 1);


        const forecastPointGroup = pointsGroup.append('g').attr('transform', 'translate(' + this.state.x(d3.timeParse("%Y-%m-%d")('2025-01-01')) + ', ' + this.state.y(235170000) + ')');

        forecastPointGroup.append('circle').attr('class','point-circle').attr('cx', 0).attr('cy', 0).attr('fill', 'black').attr('r', 0).transition().duration(500).delay(10000).attr('r', 1);
        forecastPointGroup.append('rect').attr('x', -0.2).attr('y', 2).attr('width', 0.4).attr('height', 0).attr('fill', 'white').transition().duration(500).delay(10500).attr('height', 18)
        forecastPointGroup.append('text').attr('x', 0).attr('y', 19.5).text('2025').attr('text-anchor', 'end').style('font-size', '2.7px').attr('opacity', 0).transition().duration(500).delay(11000).attr('opacity', 1).attr('x', -1);
        forecastPointGroup.append('text').attr('x', 0).attr('y', 16).text('Forecast').attr('text-anchor', 'end').style('font-size', '2.3px').attr('opacity', 0).transition().duration(500).delay(11500).attr('opacity', 1).attr('x', -1);
    }

    zoomIn = (date) => {

        let zoomToPointX = this.state.x(d3.timeParse("%Y-%m-%d")('2025-01-01'));
        let zoomToPointY = this.state.y(this.state.data[this.state.data.length - 1].value);

        console.log(data[data.length - 1])

        let domainXStart = d3.timeParse("%Y-%m-%d")(date);
        let domainXEnd = d3.timeParse("%Y-%m-%d")('2025-01-01');
        let domainXInitialStart = d3.timeParse("%Y-%m-%d")('2006-01-01');

        let domainYStart = this.state.data[this.state.data.length - 1].value - 100;
        let domainYEnd = this.state.data[this.state.data.length - 1].value;
        let domainYInitialStart = 0;

        let ratioX = (this.state.x(domainXEnd) - this.state.x(domainXInitialStart)) / (this.state.x(domainXEnd) - this.state.x(domainXStart));
        let ratioY = (this.state.y(domainYEnd) - this.state.y(domainYInitialStart)) / (this.state.y(domainYEnd) - this.state.y(domainYStart));

        // New Time scale
        const newX = d3.scaleTime()
            .domain([domainXStart, domainXEnd])
            .range([this.relativeWidth(this.state.margin.left), this.relativeWidth(100 - this.state.margin.right)]);

        // New Y scale
        const newY = d3.scaleLinear()
            .domain([domainYStart, domainYEnd + ((domainYEnd - domainYStart) / 10)])
            .range([this.relativeHeight(100 - this.state.margin.bottom), this.relativeHeight(this.state.margin.top)]);

        this.state.mainGroup.select('.graph-axis-x').transition().duration(10000).call(d3.axisBottom(newX).tickSize(0));
        this.state.mainGroup.select('.graph-axis-y').transition().duration(10000).call(d3.axisLeft(newY).tickSize(0));

        let translate = "translate(" + (zoomToPointX) + ", " + (zoomToPointY) + ")";
        let translateInverse = "translate(" + (-zoomToPointX) + ", " + (-zoomToPointY) + ")";
        let scale = "scale(" + ratioX + ", " + ratioY + ")";

        this.state.mainGroup.select('.forecast-path').transition().duration(10000).style('stroke-width', (1 / ratioX) + 'px').attr("stroke-dasharray", 'none').attr("transform", translate + scale + translateInverse)
        // .on('end', this.splitLines.bind(this, this.state.x, this.state.y, newX, newY));

        this.state.mainGroup.select('.now-path').transition().duration(10000).attr("transform", translate + scale + translateInverse).style('stroke-width', (1 / ratioX) + 'px');
    }

    splitLines = (x, y, newX, newY, date) => {
        const forecastPathClone = this.state.mainGroup.select('.forecast-path').clone();
        let currentBindedData = forecastPathClone.datum();
        let newForecast = { date: d3.timeParse("%Y-%m-%d")('2025-01-01'), value: 2499.5 };
        currentBindedData.forEach((val, i) => i !== currentBindedData.length - 1 ? val.value2 = val.value : val.value2 = newForecast.value);

        console.log(currentBindedData)
        forecastPathClone.datum(currentBindedData).transition().duration(1000)
            .attr('d', d3.line().curve(d3.curveMonotoneY)
                .x(d => x(d.date))
                .y(d => y(d.value2))
            );

        this.state.mainGroup.select('.forecast-path').transition().duration(1000)
            .style('stroke', 'lightgrey')

        var area = d3.area().curve(d3.curveMonotoneY)
            .x(d => newX(d.date))
            .y0(d => newY(d.value))
            .y1(d => newY(d.value2));

        this.state.linesGroup.append('path')
            .datum(currentBindedData)
            .style('fill', 'green')
            .style('fill-opacity', 0)
            .style('stroke', 'none')
            .attr('class', 'area')
            .attr('d', area)
            .transition().duration(1000).delay(1000)
            .style('fill-opacity', 0.05);
    }


}

export default Graph;
