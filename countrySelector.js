$(document).ready(function() {
	countriesToInclude = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey"];
	
	
	d3.tsv("/muslim.attitudes.to.USA.China.tsv", function (data) {
		var allCountries = dimple.getUniqueValues(data, "country");
		
		for (i = 0; i < allCountries.length; i++) {
			$('form').append('<input class="box" type="checkbox" name="' + allCountries[i] + '">' + allCountries[i] + '</input><br>');

		}

		//precheck some boxes

		$('input[type=checkbox]').each(function () {
			console.log(this.name);
			if (jQuery.inArray(this.name, countriesToInclude) != -1) {
				$(this).attr("checked", true);
			}
		})

		
		//make the first set of charts based on countriesToInclude
		loadData(data)
		
		//when a box in checked, make a new chart
		d3.selectAll('input').on('change', function () {
			

			d3.selectAll("svg").remove();
			
			//get list of countriresToInclude
			if (this.checked) {
				countriesToInclude.push(this.name);
				//return

			} else {
				var index = jQuery.inArray(this.name, countriesToInclude);
				countriesToInclude.splice(index, 1);

			}

			//alert(countriesToInclude);
			//make the chart

			loadData(data)
			
		})

		
		})
	var loadData = function (data) {
			var mainWidth = 1400
			var mainHeight = 300 + (150 * countriesToInclude.length)

			var svg = dimple.newSvg("#chartContainer", mainWidth, mainHeight);

			

	    //get a unique list of questions
	    		var questions = dimple.getUniqueValues(data, "Question");

	    		
	    //set the bounds for the charts
			    var row = 0,
			    col = 0,
			    top = 25,
			    left = 80,
			    inMarg = 70,
			    width =400,
			    height = 50 * countriesToInclude.length,
			    totalWidth = mainWidth

			    //draw a chart for each of the 6 questions
			    questions.forEach(function (question) {
			    	
			    // if the next sunchart would go off the edge, move up a row
			    if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
			      row += 1;
			      col = 0;
			    }
			    
			    countryData = dimple.filterData(data, "country", countriesToInclude);

		    	//assign question text

			    switch (question) {
			      case "favorable":
			        var questionText = "Do you have a favorable opinion of USA/China?";
			        break;
			      case "threat":
			        var questionText = "Do you consider USA/China a threat to your country?";
			        break;
			      case "partner":
			        var questionText = "Do you consider USA/China more of a partner than an enemy to your country?";
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

			    //extract the data corresponding to the current question
			    var chartData = dimple.filterData(countryData, "Question", question);

			    svg
			        .append("text")
			            .attr("x", left + (col * (width + inMarg)) + (width / 2))
			            .attr("y", top + (row * (height + inMarg)) - 15)
			            .style("font-family", "helvetica")
			            .style("text-anchor", "middle")
			            .style("font-size", "12px")
			            //.style("opacity", 0.2)
			            .text(questionText);

			    var myChart = new dimple.chart(svg, chartData);
			    
			    myChart.setBounds(
			        left + (col * (width + inMarg)),
			        top + (row * (height + inMarg)),
			        width,
			        height);



			    var x = myChart.addMeasureAxis("x", "avg.Score");
			    x.overrideMax = 1;
			    x.showGridlines = false;
			    x.tickFormat = "%";

			    var y = myChart.addCategoryAxis("y", ["country", "USA.or.China"]);
			    y.addOrderRule("country");
			    y.addGroupOrderRule(["China", "USA"]);

			    var s = myChart.addSeries(["avg.Score", "country", "USA.or.China"], dimple.plot.bar);
			    s.addOrderRule(["USA.or.China"])

			    myChart.defaultColors = [
			    new dimple.color("#F15854", "#F15854", 1), // red
			    new dimple.color("#5DA5DA", "#5DA5DA", 1), // blue
			      
			      
			    ];

			    if (col == 0 & row == 0) {
			      myChart.addLegend(300,50,500,50);
			    }

			    s.getTooltipText = function (e) {
			            return [
			                "Country: " + e.aggField[1],
			                
			                "Regarding: " + e.aggField[2],
			                Math.round(e.aggField[0] * 100) + "%" //display % in 2 digits (e.g. 53%)

			            ];
			        };

			    myChart.draw();
			    

			    y.titleShape.remove();
			    x.titleShape.remove();

			    col += 1;
			    } , this)
		}
	
})