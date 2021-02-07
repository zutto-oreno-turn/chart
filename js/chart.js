let svg, xScale, yScale, line;

const timeparser = d3.timeParse("%Y-%m-%d");
const initialize = (data) => {
    svg = d3.select('main')
        .append('svg')
        .attr('width', 1600)
        .attr('height', 750)
        .append('g')
        .attr('transform', 'translate(100, 10)');

    xScale = d3.scaleTime()
        .domain([
            d3.min(data, (d) => timeparser(d.date)),
            d3.max(data, (d) => timeparser(d.date))])
        .range([0, 1200]);

    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, (d) => parseInt(d.value, 10))])
        .range([700, 0]);

    svg.append('g')
        .attr('transform', 'translate(0, 700)')
        .call(
            d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat('%Y%m%d'))
        );

    svg.append('g')
        .call(
            d3.axisLeft(yScale)
        );

    line = d3.line()
        .x((d, i) => xScale(new Date(d.date)))
        .y((d, i) => yScale(d.value));
};

const draw = (key, data) => {
    const color = d3.rgb(
        Math.floor(Math.random() * 192),
        Math.floor(Math.random() * 192),
        Math.floor(Math.random() * 192));

    svg.append('path')
        .datum(data)
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none');

    svg.selectAll(key)
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', 3)
        .attr('fill', color)
        .on('mouseenter', (d) => {
            d3.select('.tip')
                .style('top', `${(event.pageY - 30)}px`)
                .style('left', `${event.pageX}px`)
                .style('display', 'inline-block')
                .text(`${key} ${d.date} ${d.value}`);
        })
        .on('mouseout', (d) => {
            d3.select('.tip')
                .style('display', 'none');
        });
};

const render = (name) => {
    d3.tsv(`./data/${name}`, (tsv) => {
        initialize(tsv);
        const remap = {};
        tsv.forEach((item) => {
            if (remap[item.key] === undefined) {
                remap[item.key] = [];
            }
            remap[item.key].push({
                date: item.date,
                value: item.value
            });
        });
        for (let key in remap) {
            data = remap[key];
            data.sort((a, b) => {
                if (a.date > b.date) {
                    return 1;
                } else {
                    return -1;
                }
            });
            draw(key, data);
        }
    });
};
