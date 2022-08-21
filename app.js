function finalProject(){
    var filePath="data_with_commas.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}



var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        // console.log(data)
    });
}

var question1=function(filePath){
    
    //reading data
    d3.csv(filePath).then(data=>{
       
        var height = 800
        var width = 800
        padding = 30
        combined = []
        var wins = []
        var goals_for = []
        
        for (let i in data){
            if (i == 'columns'){
                continue
            }
            inner = {}
            wins.push(parseInt(data[i].W))
            goals_for.push(parseInt(data[i].GF))
            inner['team'] = data[i].Squad
            inner['goals'] = parseInt(data[i].GF)
            inner['wins'] = parseInt(data[i].W)
            combined.push(inner)
        }

        var svg = d3.select('#q1_plot')
        .append('svg')
            .attr('height',height)
            .attr('width', width).append('g');
    
        var xScale = d3.scaleLinear()
        .domain([0,d3.max(wins)])
        .range([ padding, width-padding]);
    
        svg.append("g")
            .attr("transform", "translate(0," + (height-padding) + ")")
            .call(d3.axisBottom(xScale));
            
        d3.select('#q1_x_axis_title').text('Wins').style('font-size',20);
    
        var yScale = d3.scaleLinear()
            .domain([d3.min(goals_for)-10, d3.max(goals_for)+10])
            .range([ height-padding, padding]);
    
        svg.append("g")
            .attr("transform", "translate("+(padding)+",0)")
            .call(d3.axisLeft(yScale));

        svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("dy", ".75em")
        .attr('dx',-height/2)
        .attr("transform", "rotate(-90)")
        .attr('font-size',20)
        .text("Attendance");

        var myCircle = svg.selectAll("dot")
        .data(combined)
        .enter()
        .append("circle")
            .attr("cx", function (d) { 
                return xScale(d.wins); } )
            .attr("cy", function (d) { 
                return yScale(d.goals) ; } )
            .attr("r", 10).attr("fill", "green").style("opacity", 0.6);
            
        // Reference: https://d3-graph-gallery.com/graph/interactivity_brush.html#realgraph
        svg
        .call( d3.brush()                 
        .extent( [ [0,0], [width,height] ] ) 
        .on("start brush", updateChart) 
        )

        function updateChart(event) {
            extent = event.selection
            myCircle.classed("selected", function(d){ return isBrushed(extent, xScale(d.wins), yScale(d.goals) ) } )
        }

       
        function isBrushed(brush_coords, cx, cy) {
            var x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    
        }
          
    
    })
}
//
var question2=function(filePath){
    d3.csv(filePath).then(function(data){
        width = 1000
        height = 800
        padding = 70

        england = data.filter(d=>d.Country=='ENG')
        var svg = d3.select("#q2_plot")
            .append('svg')
                .attr('width',width)
                .attr('height',height).append('g')

        var squads = []
        for (i in england){
            squads.push(england[i].Squad)
        }
    
        var xScale = d3.scaleBand()
            .domain(squads)
            .range([ padding, width-padding]).paddingInner(0.05);
    
        svg.append("g")
            .attr("transform", "translate(0," + (height-padding) + ")")
            .call(d3.axisBottom(xScale)).attr('class','xAxis').selectAll('text').style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-30)" );
            
        d3.select('#x_axis_title').text('Teams').style('font-size',20);
    
        var yScale = d3.scaleLinear() 
            .domain([0,d3.max(england,d=>d.Attendance)])
            .range([ height-padding, padding]);
        
        svg.append("g")
            .attr("transform", "translate("+(padding)+",0)")
            .call(d3.axisLeft(yScale));

        var Tooltip = d3.select('#q2_plot').append('div').style('opacity',0).attr('class','tooltip')

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("dy", ".75em")
            .attr('dx',-height/2)
            .attr("transform", "rotate(-90)")
            .attr('font-size',20)
            .text("Attendance");

        svg.selectAll("rect")
            .data(england)
            .enter()
            .append("rect")
            .attr("x", function(d,i){return xScale(d.Squad)})
            .attr("y", function(d){
                return yScale(d.Attendance)})
            .attr("width", function(d){return xScale.bandwidth()})
            .attr("height", function(d){return height-padding-yScale(d.Attendance)}).attr('fill','pink')
            .on('mouseover',function(e,d){
                Tooltip.transition().duration(50).style('opacity',0.9);
                // used to only return name
                length = d['Top Team Scorer'].length - 4
                Tooltip.html(d['Top Team Scorer'].slice(0,length));
                d3.select(this).attr("fill", "red")
            })
            .on('mousemove',function(e,d){
                Tooltip.style('top',(e.pageY-35)+'px').style('left',(e.pageX-10)+'px')
            })
            .on('mouseout',function(e,d){
                Tooltip.transition().duration(50).style('opacity',0)
                d3.select(this).transition().duration(200).attr("fill", "pink")
            })
    
    ;
            


    });
    
}
var question3=function(filePath){
    d3.csv(filePath).then(function(data){
        width = 1100
        height = 900
        padding = 60

        var svg = d3.select("#q3_plot")
            .append('svg')
                .attr('width',width)
                .attr('height',height).append('g')

        var grouped = d3.group(data, d=>d.Country)
        combined = []
        for(let country of grouped){
            inner = {}
            inner['Country'] = country[0]
            for( let team of country[1]){
                league_rank = parseInt(team.LgRk)
                if(league_rank <=10){
                    inner[league_rank] = parseInt(team.GF)
                }

            }
            combined.push(inner)
        }
        keys= [1,2,3,4,5,6,7,8,9,10]
        var stack = d3.stack().keys(keys)
        var series = stack(combined)
  

        var xScale = d3.scaleBand()
            .domain([0,1,2,3,4])
            .range([padding, width-padding])
            .paddingInner(0.05);

        countries_names = ['ENG','GER',"ESP",'FRA',"ITA"]

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(combined, function(d){
                return d[1] + d[2] + d[3] + d[4] + d[5]+ d[6]+ d[7]+ d[8]+d[9]+d[10];})])
            .range([height-padding, padding]);

        var xAxis = d3.axisBottom().scale(xScale).tickFormat(function(d){
            return countries_names[d]})
        svg.append('g').attr("transform", "translate(0," + (height-padding) + ")").call(xAxis);
        d3.select('#q3_x_axis_title').text('Country').style('font-size',20);

        var yAxis = d3.axisLeft().scale(yScale)
        svg.append('g').attr("transform", "translate(" +padding+",0)").call(yAxis);

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr('dx',-height/2 + 40)
            .attr('font-size',20)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Goals Scored");
    
        colors = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)

        var groups = svg.append('g').selectAll('g').data(series).enter().append('g').attr('fill',function(d,i){
            return colors(d.key)});

        var rects = groups.selectAll('rect')
        .data(function(d){ return d;})
        .enter()
        .append("rect")
        .attr('x',function(d,i){
            return xScale(i)})
        .attr('y',function(d){return yScale(d[1]) })
        .attr('height', function(d,i){
            return yScale(d[0]) - yScale(d[1]) })
        .attr('width',function(d){return xScale.bandwidth()});

        var legend = svg.selectAll('legend')
        .attr('class','legend')
        .data(colors.domain().reverse())
        .enter()
        .append('rect')
        .attr("x", width - 50)
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("width", 10)
        .attr("height", 30)
        .style("fill", colors);


        svg.append("text").attr("x", width-160).attr("y", 15).text("League Rank").style("font-size", "20px").attr("alignment-baseline","middle")
       
        svg.append("text").attr("x", width-35).attr("y", 200).text("1st").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 175).text("2nd").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 155).text("3rd").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 135).text("4th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 115).text("5th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 95).text("6th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 75).text("7th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 55).text("8th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 35).text("9th").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-35).attr("y", 15).text("10th").style("font-size", "15px").attr("alignment-baseline","middle")





    });
   
}

var question4=function(filePath){
    d3.csv(filePath).then(function(data){
        svgheight = 900
        svgwidth = 900

        abbrev_countries = {'United Kingdom':'ENG','Spain':'ESP','Germany':'GER','Italy':'ITA','France':"FRA"}

        target_col = 'Pts'
        countries = d3.rollup(data,v=>d3.sum(v,d=>d[target_col]),d=>d.Country)
        pts = []
        for(let i of countries){
            pts.push(i[1])
        }

        const europe_map = d3.json("europe_features.json");

        europe_map.then(function (map){

            var colorScale = d3.scaleLog()
            .domain([d3.min(pts),d3.quantile(pts,.25),d3.quantile(pts,.5),d3.quantile(pts,.75),d3.max(pts)])
            .range(d3.schemeBlues[5]);

            //---------------------------Europe---------------------
            var svg = d3.select("#q4_plot").append("svg").attr("width", svgwidth)
            .attr("height", svgheight).append('g');    

            var title = d3.select('#q4_title').append('text').text('Points scored by Country (2021-2022)');
            // Reference: https://makeshiftinsights.com/blog/basic-maps-with-d3/
            var projection = d3.geoMercator()
            .center([ 13, 52 ])
            .scale([ svgwidth / 1.5 ])
            .translate([ svgwidth / 2, svgheight / 2 ]);
            
            var path = d3.geoPath(projection);

            

            svg.selectAll('path')
            .data(map.features)
            .enter()
            .append('path')
            .attr('d',path)
            .attr('fill',function(d){
                if(d['properties']['name'] in abbrev_countries){
                    return colorScale(countries.get(abbrev_countries[d['properties']['name']]))
                }else{
                    return 'black'
                }
            })  
            .attr('stroke','grey');
    
            
            var radio = d3.select('#radio_q4').attr('name','columns').on('change',function(d){
                target_col = d.target.value;

                countries = d3.rollup(data,v=>d3.sum(v,d=>d[target_col]),d=>d.Country)
                pts = []
                for(let i of countries){
                    pts.push(i[1])
                }
                if(target_col == 'Pts'){
                    new_title = 'Points Scored by Country (2021-2022)'
                } else {
                    new_title = 'Attendance by Country (2021-2022)'
                }
                

                var colorScale = d3.scaleLog()
                .domain([d3.min(pts),d3.quantile(pts,.25),d3.quantile(pts,.5),d3.quantile(pts,.75),d3.max(pts)])
                .range(d3.schemeBlues[5]);

                svg.selectAll('path')
                .attr('fill',function(d){
                    if(d['properties']['name'] in abbrev_countries){
                        return colorScale(countries.get(abbrev_countries[d['properties']['name']]))
                    }else{
                        return 'black'
                    }
                })  
                .attr('stroke','grey');

                title.text(new_title);
            })
        })
            
    





    });


   
}
var question5=function(filePath){
    d3.csv(filePath).then(function(data){
        // Reference: https://d3-graph-gallery.com/graph/boxplot_basic.html

        spanish = data.filter(d=>d.Country == 'ESP')
        width = 500
        height = 500
        padding = 50

        var svg = d3.select("#q5_plot")
            .append('svg')
                .attr('width',width)
                .attr('height',height).append('g')

        var goals_against = []
        for (let i of spanish){
            goals_against.push(parseInt(i.GD))
        }
        var sorted_goals = goals_against.sort(d3.ascending)
        var q1 = d3.quantile(sorted_goals, .25)
        var median = d3.quantile(sorted_goals, .5)
        var q3 = d3.quantile(sorted_goals, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange


        var y = d3.scaleLinear()
        .domain([d3.min(sorted_goals)-50,d3.max(sorted_goals)])
        .range([height-padding, 0]);
        var yAxis = d3.axisLeft().scale(y)
        svg.append('g').attr("transform", "translate(" +padding+",0)").call(yAxis)


        var center = 250
        var width = 100
        
        svg
        .append("line")
          .attr("x1", center)
          .attr("x2", center)
          .attr("y1", y(min) )
          .attr("y2", y(max) )
          .attr("stroke", "black")

        svg
          .append("rect")
            .attr("x", center - width/2)
            .attr("y", y(q3) )
            .attr("height", (y(q1)-y(q3)) )
            .attr("width", width )
            .attr("stroke", "black")
            .style("fill", "red")

        svg
        .selectAll("toto")
        .data([min, median, max])
        .enter()
        .append("line")
            .attr("x1", center-width/2)
            .attr("x2", center+width/2)
            .attr("y1", function(d){ return(y(d))} )
            .attr("y2", function(d){ return(y(d))} )
            .attr("stroke", "black")
        
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 0)
            .attr("dy", ".75em")
            .attr('dx',-150)
            .attr("transform", "rotate(-90)")
            .attr('font-size',20)
            .text("Goal Difference");

    });
}