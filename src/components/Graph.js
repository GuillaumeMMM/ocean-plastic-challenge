import React, { Component } from 'react';
import * as d3 from 'd3';

class Graph extends Component {

    state = {
        width: 0,
        height: 0,
        data: [
            { date: '2006-01-01', value: 60 },
            { date: '2007-01-01', value: 70 },
            { date: '2008-01-01', value: 80 },
            { date: '2009-01-01', value: 90 },
            { date: '2010-01-01', value: 100 },
            { date: '2011-01-01', value: 200 },
            { date: '2012-01-01', value: 300 },
            { date: '2013-01-01', value: 400 },
            { date: '2014-01-01', value: 600 },
            { date: '2015-01-01', value: 800 },
            { date: '2016-01-01', value: 900 },
            { date: '2017-01-01', value: 1000 },
            { date: '2018-01-01', value: 1140 },
            { date: '2019-01-01', value: 1200 },
        ],
        forecast: { date: '2025-01-01', value: 2500 }
    }

    render() {
        return (
            <React.Fragment>
                <div className="graph-container" id="basic-chart" style={{ width: '80vw', height: '60vh' }}>

                </div>
                <button onClick={this.updateForecats}>Update Forecast</button>
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
            .append('svg')
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

        //  Dataset until now with valid dates
        const untilNowData = JSON.parse(JSON.stringify(this.state.data));
        untilNowData.forEach((year, i) => untilNowData[i].date = d3.timeParse("%Y-%m-%d")(year.date));

        //  Dataset until the forecast with valid dates
        const forecastData = JSON.parse(JSON.stringify(this.state.data));
        forecastData.push(this.state.forecast);
        forecastData.forEach((year, i) => forecastData[i].date = d3.timeParse("%Y-%m-%d")(year.date));

        //  Time scale
        const x = d3.scaleTime()
            .domain(d3.extent(forecastData, function (d) { return d.date; }))
            .range([0, this.relativeWidth(100 - margin.right - margin.left)]);

        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-x')
            .attr("transform", 'translate(' + this.relativeWidth(margin.left) + ',' + this.relativeHeight(100 - margin.bottom) + ')')
            .call(d3.axisBottom(x).tickSize(0).ticks(forecastData.length, d3.timeFormat("%Y")));

        //  y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(forecastData, function (d) { return d.value; }) + 500])
            .range([this.relativeHeight(100 - margin.bottom), margin.top]);


        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-y')
            .attr("transform", 'translate(' + this.relativeWidth(margin.left) + ',0)')
            .call(d3.axisLeft(y).tickSize(0));

        //  Clip path so that the dash curve is not visible on the initial curve
        mainGroup.append("clipPath").attr('id', 'clip-path')
            .append('rect')
            .attr('id', 'clip-path-rect')
            .attr('x', x(d3.timeParse("%Y-%m-%d")('2019-01-01')) + this.relativeWidth(margin.left))
            .attr('y', this.relativeHeight(margin.top))
            .attr('height', this.relativeHeight(100 - margin.top - margin.bottom))
            .attr('width', x(d3.timeParse("%Y-%m-%d")('2025-01-01')) - x(d3.timeParse("%Y-%m-%d")('2019-01-01')))
            .style('fill', 'none');

        //  Clip path to hide the beginning of the full curve
        mainGroup.append("clipPath").attr('id', 'clip-path-2')
            .append('rect')
            .attr('id', 'clip-path-rect2')
            .attr('x', x((untilNowData[0].date)) + 0.5 + this.relativeWidth(margin.left))
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('height', this.relativeHeight(100 - margin.top - margin.bottom))
            .attr('width', x(d3.timeParse("%Y-%m-%d")('2025-01-01')) - x(untilNowData[0].date))
            .style('fill', 'none');

        //  dash line forecast
        mainGroup.append("path").datum(forecastData)
            .attr("fill", "none")
            .attr('class', 'forecast-path')
            .attr("stroke", "black")
            .attr("stroke-width", '0.3px')
            .attr("stroke-dasharray", '1, 1')
            .attr("d", d3.line().curve(d3.curveMonotoneY)
                .x( d => x(d.date) + this.relativeWidth(margin.left))
                .y(function (d) { return y(d.value) })
            )

        //  line until now
        mainGroup.append("path").datum(untilNowData)
            .attr("fill", "none")
            .attr('class', 'now-path')
            .attr("stroke", "black")
            .attr("stroke-width", '0.3px')
            .attr("d", d3.line().curve(d3.curveMonotoneY)
                .x( d => x(d.date) + this.relativeWidth(margin.left))
                .y(function (d) { return y(d.value) })
            )

        this.setState({ mainGroup: mainGroup, margin: margin, y: y, x: x });
    }

    //  Takes a % ang returns the right height
    relativeHeight = (height) => {
        return this.state.width < this.state.height ? height * this.state.height / this.state.width : height;
    }

    //  Takes a % ang returns the right width
    relativeWidth = (width) => {
        return this.state.width < this.state.height ? width : width * this.state.width / this.state.height;
    }

    updateForecats = () => {
        const newForecast = { date: '2025-01-01', value: 2499 };
        this.setState({newForecast: newForecast}, this.updateGraph)
    }

    updateGraph = () => {
        console.log('start update graph');
        const newData = [JSON.parse(JSON.stringify(this.state.newForecast))];
        newData[0].date = d3.timeParse("%Y-%m-%d")(newData[0].date)
        let daysBefore = 1;
        const xShift = this.state.x(d3.timeParse("%Y-%m-%d")(this.state.newForecast.date)) - this.state.x(d3.timeDay.offset(d3.timeParse("%Y-%m-%d")(this.state.newForecast.date), -daysBefore));
        const deltaY = this.state.data[this.state.data.length - 1].value - this.state.newForecast.value;
        const deltaX = this.state.x(d3.timeParse("%Y-%m-%d")(this.state.newForecast.date)) - this.state.x(d3.timeParse("%Y-%m-%d")(this.state.data[this.state.data.length - 1].date));

        const yShift = xShift * deltaY / deltaX;

        newData.unshift({date: d3.timeDay.offset(d3.timeParse("%Y-%m-%d")(this.state.newForecast.date), -daysBefore), value: this.state.newForecast.value + yShift})

        console.log(JSON.parse(JSON.stringify(newData)))

        const newStartX = newData[0].date;
        const newEndX = newData[1].date;

        const newX = d3.scaleTime()
            .domain([newStartX, newEndX])
            .range([this.relativeWidth(this.state.margin.left), this.relativeWidth(100 - this.state.margin.right)]);

        this.state.mainGroup.select('.graph-axis-x')
            .transition().duration(500)
            .attr("transform", 'translate(0,' + this.relativeHeight(100 - this.state.margin.bottom) + ')')
            .call(d3.axisBottom(newX).tickSize(0).ticks(5, d3.timeFormat("%Y")));

        const newY = d3.scaleLinear()
            .domain([newData[0].value, newData[1].value])
            .range([this.relativeHeight(100 - this.state.margin.bottom), this.state.margin.top]);

        this.state.mainGroup.select('.graph-axis-y')
            .transition().duration(500)
            .call(d3.axisLeft(newY).tickSize(0));

        // this.state.mainGroup.select('#clip-path-rect').remove();
        // this.state.mainGroup.select('#clip-path-rect2').remove();
            // .attr('x', newX(d3.timeParse("%Y-%m-%d")('2019-01-01')))
            // .attr('y', this.relativeHeight(this.state.margin.top))
            // .attr('height', this.relativeHeight(100 - this.state.margin.top - this.state.margin.bottom))
            // .attr('width', newX(d3.timeParse("%Y-%m-%d")('2025-01-01')) - newX(d3.timeParse("%Y-%m-%d")('2019-01-01')));

        this.state.mainGroup.select('.forecast-path').datum(newData)
            // .attr("clip-path", "url(#clip-path)")
            // .attr("clip-path", "url(#clip-path-2)")
            .transition().duration(500)
            .attr("d", d3.line().curve(d3.curveMonotoneY)
            .x(function (d) { return newX(d.date) })
            .y(function (d) { return newY(d.value) }));


        this.state.mainGroup.select('.now-path')
            .attr("d", d3.line().curve(d3.curveMonotoneY)
            .x(function (d) { return newX(d.date) })
            .y(function (d) { return newY(d.value) }));

        this.splitLines(newX, newY, newData);
    }

    splitLines = (x, y, newData) => {
        console.log('start split lines')
        const forecastData = JSON.parse(JSON.stringify(this.state.data));
        forecastData.push(this.state.newForecast);
        forecastData.forEach((year, i) => forecastData[i].date = d3.timeParse("%Y-%m-%d")(year.date));

        const newForecastLine = d3.select('.forecast-path').clone();
        newForecastLine.datum(forecastData)
        .style('stroke', 'red')
        .attr("d", d3.line().curve(d3.curveMonotoneY)
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value) }));

        var area = d3.area().curve(d3.curveMonotoneY)
            .x( d => x(d.date) )
            .y0(  d => y(d.value2) )
            .y1(  d => y(d.value) );

        forecastData.forEach((val, i) => i === forecastData.length - 1 ? val.value2 = this.state.forecast.value : val.value2 = val.value);

        console.log(forecastData)

        this.state.mainGroup.append('path')
            .datum(forecastData)
            .style('fill', 'black')
            .style('fill-opacity', 0.1)
            .style('stroke', 'none')
            .attr('class', 'area')
            .attr("clip-path", "url(#clip-path-2)")
            .attr('d', area);

    }

}

export default Graph;