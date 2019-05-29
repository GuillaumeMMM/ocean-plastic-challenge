import React, { Component } from 'react';
import * as d3 from 'd3';

class GraphZoom extends Component {

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
                <button onClick={this.zoomIn}>Zoom in</button>
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

        const zoom = () => {
            let k = d3.event.transform.k;
            d3.select('.forecast-path').attr("transform", d3.event.transform).style('stroke-width', (0.3 / k) + 'px');
            d3.select('.now-path').attr("transform", d3.event.transform).style('stroke-width', (0.3 / k) + 'px');

            const new_xScale = d3.event.transform.rescaleX(this.state.x);
            const new_yScale = d3.event.transform.rescaleY(this.state.y);

            // update axes
            d3.select('.graph-axis-x').call(d3.axisBottom(new_xScale).tickSize(0).scale(new_xScale));
            d3.select('.graph-axis-y').call(d3.axisLeft(new_yScale).tickSize(0).scale(new_yScale));
        }

        const svg = d3.select('#basic-chart')
            .append('svg').attr('id', 'main-svg')
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
            .range([this.relativeWidth(margin.left), this.relativeWidth(100 - margin.right)]);

        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-x')
            .attr("transform", 'translate(0,' + this.relativeHeight(100 - margin.bottom) + ')')
            .call(d3.axisBottom(x).tickSize(0).ticks(forecastData.length, d3.timeFormat("%Y")));

        //  y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(forecastData, function (d) { return d.value; }) + 100])
            .range([this.relativeHeight(100 - margin.bottom), margin.top]);


        mainGroup.append("g")
            .attr('class', 'graph-axis graph-axis-y')
            .attr("transform", 'translate(' + this.relativeWidth(margin.left) + ',0)')
            .call(d3.axisLeft(y).tickSize(0));

        //  clip path graph
        mainGroup.append('clipPath')
            .attr('id', 'main-clip-path')
            .append('rect')
            .attr('x', this.relativeWidth(margin.left) + 0.5)
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('width', this.relativeWidth(100) - this.relativeWidth(margin.left) - this.relativeWidth(margin.right))
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top));

        //  clip path forecast
        mainGroup.append('clipPath')
            .attr('id', 'forecast-clip-path')
            .append('rect')
            .attr('x', 0.5 + x(d3.timeParse("%Y-%m-%d")(this.state.data[this.state.data.length - 1].date)))
            .attr('y', this.relativeHeight(margin.top) + 0.5)
            .attr('width', 0.5 + x(forecastData[forecastData.length - 1].date) - x(d3.timeParse("%Y-%m-%d")(this.state.data[this.state.data.length - 1].date)))
            .attr('height', this.relativeHeight(100) - this.relativeHeight(margin.bottom) - this.relativeHeight(margin.top));

        const linesGroup = mainGroup.append('g')
            .attr('clip-path', 'url(#main-clip-path)');

        //  dash line forecast
        linesGroup.append("path").datum(forecastData)
            .attr("fill", "none")
            .attr('class', 'forecast-path')
            .attr("stroke", "black")
            .attr("stroke-width", '0.3px')
            .attr('clip-path', 'url(#forecast-clip-path)')
            .attr("stroke-dasharray", '1, 1')
            .attr("d", d3.line().curve(d3.curveMonotoneY)
                .x(d => x(d.date))
                .y(function (d) { return y(d.value) })
            );

        //  line until now
        linesGroup.append("path").datum(untilNowData)
            .attr("fill", "none")
            .attr('class', 'now-path')
            .attr("stroke", "black")
            .attr("stroke-width", '0.3px')
            .attr("d", d3.line().curve(d3.curveMonotoneY)
                .x(d => x(d.date))
                .y(function (d) { return y(d.value) })
            )

        this.setState({ mainGroup: mainGroup, margin: margin, y: y, x: x, zoom: zoom, svg: svg });
    }

    //  Takes a % ang returns the right height
    relativeHeight = (height) => {
        return this.state.width < this.state.height ? height * this.state.height / this.state.width : height;
    }

    //  Takes a % ang returns the right width
    relativeWidth = (width) => {
        return this.state.width < this.state.height ? width : width * this.state.width / this.state.height;
    }

    zoomIn = () => {
        // let k = 1;
        // let translateX = - this.state.x(d3.timeParse("%Y-%m-%d")('2024-01-01')) + this.state.x(d3.timeParse("%Y-%m-%d")('2006-01-01'));
        // let totalWidth = this.state.x(d3.timeParse("%Y-%m-%d")('2025-01-01')) - this.state.x(d3.timeParse("%Y-%m-%d")('2006-01-01'));
        // let ratio = totalWidth / (this.state.x(d3.timeParse("%Y-%m-%d")('2025-01-01')) - this.state.x(d3.timeParse("%Y-%m-%d")('2024-01-01')));
        // console.log(ratio)
        let ratio = 10;


        // let centerPointXT = this.relativeWidth(this.state.margin.left) + this.relativeWidth(100 - this.state.margin.left - this.state.margin.right) / 2;
        // let centerPointYT = this.relativeHeight(this.state.margin.top) + this.relativeHeight(100 - this.state.margin.top - this.state.margin.bottom) / 2;

        // let centerPointX = this.relativeWidth(50);
        // let centerPointY = this.relativeHeight(50);

        let zoomToPointX = this.state.x(d3.timeParse("%Y-%m-%d")('2025-01-01'));
        let zoomToPointY = this.state.y(2500);

        let domainXStart = d3.timeParse("%Y-%m-%d")('2024-12-01');
        let domainXEnd = d3.timeParse("%Y-%m-%d")('2025-01-01');
        let domainXInitialStart = d3.timeParse("%Y-%m-%d")('2006-01-01');

        let domainYStart = 2400;
        let domainYEnd = 2500;
        let domainYInitialStart = 0;

        let ratioX = (this.state.x(domainXEnd) - this.state.x(domainXInitialStart)) / (this.state.x(domainXEnd) - this.state.x(domainXStart));
        let ratioY = (this.state.y(domainYEnd) - this.state.y(domainYInitialStart)) / (this.state.y(domainYEnd) - this.state.y(domainYStart));

        // this.state.svg.append('circle').attr('cx', centerPointX).attr('cy', centerPointY).attr('r', 1).attr('fill', 'red')
        // this.state.svg.append('circle').attr('cx', centerPointXT).attr('cy', centerPointYT).attr('r', 1).attr('fill', 'orange')
        // this.state.svg.append('circle').attr('cx', zoomToPointX).attr('cy', zoomToPointY).attr('r', 1).attr('fill', 'green')

        let newYDomainStart = 2500 - (500 / 6);
        let newYDomainEnd = 2500 - (100 / 6);

        // New Time scale
        const newX = d3.scaleTime()
            .domain([domainXStart, domainXEnd])
            .range([this.relativeWidth(this.state.margin.left), this.relativeWidth(100 - this.state.margin.right)]);

        // New Y scale
        const newY = d3.scaleLinear()
            .domain([newYDomainStart, newYDomainEnd])
            .range([this.relativeHeight(100 - this.state.margin.bottom), this.state.margin.top]);

        d3.select('.graph-axis-x').transition().call(d3.axisBottom(newX).tickSize(0));
        d3.select('.graph-axis-y').transition().call(d3.axisLeft(newY).tickSize(0));
        // d3.select('.graph-axis-y').call(d3.axisLeft(new_yScale).tickSize(0).scale(new_yScale));
        // mainGroup.append("g")
        //     .attr('class', 'graph-axis graph-axis-x')
        //     .attr("transform", 'translate(0,' + this.relativeHeight(100 - margin.bottom) + ')')
        //     .call(d3.axisBottom(x).tickSize(0).ticks(forecastData.length, d3.timeFormat("%Y")));

        let translate = "translate(" + (zoomToPointX) + ", " + (zoomToPointY) + ")";
        let translateInverse = "translate(" + (-zoomToPointX) + ", " + (-zoomToPointY) + ")";
        let scale = "scale(" + ratioX + ", " + ratioY + ")";
        d3.select('.forecast-path').transition().duration(1000).attr("transform", translate + scale + translateInverse).style('stroke-width', (1 / ratioX) + 'px').attr("stroke-dasharray", '0.01, 0.01');
        d3.select('.now-path').transition().duration(1000).attr("transform", translate + scale + translateInverse).style('stroke-width', (1 / ratioX) + 'px');
    }


}

export default GraphZoom;