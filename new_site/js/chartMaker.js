window.onload = function() {
	var next_count = 0;
	//I want to start by making one chart from one question
	d3.csv("../new_site/Pew_Data_2.csv", function (data) {

		//text for the pages
		var sectText = "Given current events in Pakistan, Syria, Yemen and the frosty relationship between Sunni Saudi Arabia and Shi'a Iran, \
		we might expect to find differences in how individuals from Islam's two major sects view the US and China. However, the data show very \
		few differences. There does not appear to be a difference, at least in these data, between how Sunnis and Shi'a answer these questions.";
		var devoutText = "If patterns in the data are shaped explicitly by religious ideology, we might expect to find that devout Muslims (defined \
			as those that pray 5 times a day) would be more likely to express anitpathy towards the US and/or China. However, we again find this is \
			not the case. Devout and non-devout Muslims pattern similarly in their responses.";
		var countryText = "Viewing the data by country, we begin to find differences in the pattern of results. Nearly all of the countries appear \
		more favorably inclined to China; however, in Pakistan that inclination is particularly pronounced. Indonesians on the other hand, appear \
		to view both countries rather favorably. Based on these data then, we may tenatively conclude that Muslim views of the two economic superpowers \
		are based more on local and regional factors than on explicitly religious ones.";
		var loadText = "Please wait while the data are loaded . . .";

		//make the first set of charts based on religion
		makeCharts(data, 'religion');

		//make the button handler
		d3.select('#next1').on('click', function () {
			if (next_count == 0) {
				//change text to sectText
				d3.select('#religionIntro').remove();
				d3.select('#intros').append('p')
					.attr('id', 'sectIntro')
					.text(sectText);
				//make charts by sect
				makeCharts(data, 'Sect');
				next_count += 1;
			} else if (next_count == 1) {
				//change text to devoutText
				d3.select('#sectIntro').remove();
				d3.select('#intros').append('p')
					.attr('id', 'devoutIntro')
					.text(devoutText);

				//make charts by is_devout
				makeCharts(data, 'Devout');
				next_count += 1;
			} else {
				//change text to countryText
				d3.select('#devoutIntro').remove();
				d3.select('#intros').append('p')
					.attr('id', 'countryIntro')
					.text(countryText);
				//remove the button
				d3.select('#nextButton').remove();

				//make charts based on Muslim countries
				makeCharts(data, 'country', ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey"]);
			}	

		})
	})

	var makeCharts = function (data, category, valuesToInclude) {
			d3.selectAll('svg').remove();
			
			//if function has been passed an array of countries to use, use it, otherwise build the array from the checked boxes
			if (typeof valuesToInclude === 'undefined') {valuesToInclude = [];}

			//if specific values have been passed, filter the data based on those values
			if (valuesToInclude.length != 0) {
				data = dimple.filterData(data, category, valuesToInclude);

			}

			//create svg to contain the charts
			var mainWidth = 1600
			var mainHeight = 450 + (220 * 4)
			var svg = dimple.newSvg("#chartContainer", mainWidth, mainHeight);

			//create a second svg for the pie chart
			var pieWidth = 250;
			var pieHeight = 150;
			var svg2 = dimple.newSvg("#pieContainer", pieWidth, pieHeight);

			//get a unique list of questions
			var questions = dimple.getUniqueValues(data, "Question");
			
			//set the bounds for the subcharts
		    var row = 0,
		    col = 0,
		    top = 25,
		    left = 80,
		    inMarg = 70,
		    width =400,
		    height = 75	 * 4,
		    totalWidth = mainWidth

			 //draw a chart for each of the 6 questions
		    questions.forEach(function (question) {
		    	
		    // if the next subchart would go off the edge, move up a row
		    if (left + ((col + 1) * (width + inMarg)) > 1200) {
		      row += 1;
		      col = 0;
		    }
		    
		    //filter the question
		    var subchartData = dimple.filterData(data, "Question", question);

		    //nest the data  - category -> USA.or.China and take the mean Score
		    var groupedData = d3.nest()
		      .key(function(d) {return d[category];})
		      .key(function(d) {return d.USAorChina;})
		      .rollup(function(v) { return d3.mean(v, function(d) { return d.Score; }); })
		      .map(subchartData)

		    //convert the data to a flat JSON table so that dimple.js can use it
		    var newChartData = []
		    for (x in groupedData) {
		    	if (x === "") {continue;}
		    	for (y in groupedData[x]) {
		    		new_row = {};
		    		new_row[category] = x;
		    		new_row['USAorChina'] = y;
		    		new_row['avg.Score'] = groupedData[x][y];
		    		newChartData.push(new_row);
		    	}
		    }

		    //make dataset for the pie charts, we want counts of each value in category
		    var counts = d3.nest()
		    //.key(function(d) {return d.psraid;})
		    .key(function(d) {return d[category];})
			.rollup(function(v) { return v.length / 2; })
		    .entries(subchartData)

		    //eliminate the NAs
	    	countData = [];
	    	for (x in counts) {
	    		if (counts[x].key == "") {continue;}
	    	countData.push(counts[x]);
	    	}
		    
		    //assign question text
            switch (question) {
		      case "favorable":
		        var questionText = "Do you have a favorable opinion of USA/China?";
		        break;
		      case "threat":
		        var questionText = "Do you consider USA/China a threat to your country?";
		        break;
		      case "partner":
		        var questionText = "Do you consider USA/China a partner to your country?";
		        break;
		      case "interest":
		        var questionText = "Do you think USA/China considers the interests of countries like yours?";
		        break;
		      case "respect" :
		        var questionText = "Do you think USA/China respects the personal freedoms of its own people?";
		        break;
		      case "best":
		        var questionText = "Should your country follow the economic model of USA/China?";
		        break;

		    }

		    //add the question text
		    svg
		        .append("text")
		            .attr("x", left + (col * (width + inMarg)) + (width / 2))
		            .attr("y", top + (row * (height + inMarg)) - 10)
		            //.style("font-family", "Arial")
		            .style("text-anchor", "middle")
		            .style("font-size", "15px")
		            .text(questionText);

	    	//create the subchart
		    var myChart = new dimple.chart(svg, newChartData);
		    
		    myChart.setBounds(
		        left + (col * (width + inMarg)),
		        top + (row * (height + inMarg)),
		        width,
		        height);

		    //make the piechart on the first pass only
		    var x = myChart.addMeasureAxis("x", "avg.Score");
		    x.overrideMax = 1;
		    x.showGridlines = false;
		    x.tickFormat = "%";

		    var y = myChart.addCategoryAxis("y", [category, "USAorChina"]);
		    y.addOrderRule(category, true);
		    y.addGroupOrderRule(["China", "USA"]);

		    var s = myChart.addSeries(["avg.Score", category, "USAorChina"], dimple.plot.bar);
		    s.addOrderRule(["USAorChina"])
		    s.barGap = .3;

		    myChart.defaultColors = [
		    new dimple.color("#FF6961", "#FF6961", 1), // China
		    new dimple.color("#779ECB", "#779ECB", 1), // USA
		    ];

	    	//add legend to first column only
		    if (col == 0) {
		      myLegend = myChart.addLegend(365,50 + ((height + 70) * row),500,50);
		    }
		    myLegend.fontSize = 14;
		    myLegend.fontFamily = "helvetica";
		    
		    //alter the tooltip text
		    s.getTooltipText = function (e) {
		            return [
		                category + ": " + e.aggField[1],
		                
		                "Regarding: " + e.aggField[2],
		                Math.round(e.aggField[0] * 100) + "%", //display % in 2 digits (e.g. 53%)
	                	questionText
		            ];
		    };

		    if (row ==0 & col == 0){
		    	//remove the loading text
		    	d3.selectAll('#loading').remove();
		    }
		    myChart.draw(1000);

		    y.titleShape.remove();
		    x.titleShape.remove();

		    //make the pie chart, but not for the countries
		    if (category != 'country') {
		        if (row ==0 & col ==0){
		    	
		    	    var pieChart = new dimple.chart(svg, countData);
		    	    pieChart.setBounds(850, 20, pieWidth, pieHeight);
		    	    pieChart.addMeasureAxis("p", "values");
			    	pieChart.addSeries("key", dimple.plot.pie);
			    	pieChart.addLegend(1080, 30, 50, 200, "left");
			    	pieChart.draw()
		    	}
		    }

		    col += 1;
		    } , this)
	}
}
