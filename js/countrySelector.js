$(document).ready(function() {
	//hard code countries to include in starter charts
	var muslimCountries = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey"];

	//define regional groups for "Add all . . . "
	var euroCountries = ["Germany", "France", "Spain", "Britain", "Italy", "Poland", "Russia", "Greece", "Czech Republic"];
	var asiaCountries = ["Indonesia", "Japan", "Malaysia", "Pakistan", "Philippines", "South Korea", "Turkey"];
	//var muslimCountries = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey", "Jordan", "Palestinian territories"];
	var latinamericanCountries = ["Argentina", "Bolivia", "Brazil", "Chile", "El Salvador", "Mexico", "Venezuela"];
	var africanCountries = ["Ghana", "Kenya", "Nigeria", "Senegal", "South Africa", "Tunisia", "Egypt", "Uganda"];

	//put the regional groups in an associative array together
	var regions = {"euroCountries" : euroCountries, "asiaCountries" : asiaCountries, 
					"latinamericanCountries" : latinamericanCountries, "africanCountries" : africanCountries};

	//make names for button labeling
	var names = {"euroCountries" : "European Countries", "asiaCountries" : "Asian Countries", "muslimCountries" : "Muslim Countries",
					"latinamericanCountries" : "Latin American Countries", "africanCountries" : "African Countries"};


	var nextCount = 0;
	//generate a checkbox for each of the countries in the data file
	d3.tsv("/muslim.attitudes.to.USA.China.tsv", function (data) {

		//makeSelector(data);

		

		
		//make charts for the first time. countriesToInclude is hard coded above
		makeCharts(data, muslimCountries);

		//when next is clicked, show the Latin American countries
		d3.select("#next1").on('click', function () {
			if (nextCount == 0) {
			d3.select("#muslimIntro").remove();
			d3.select("#intros")
				.append("p")
					.attr("id", "laIntro")

					.text("In the Latin American countries we find that support for the American economic model is much stronger than for the Chinese one. \
					In all of these countries but Argentina we find a majority expressing a favorable opinion of the United States with Chile and El Salvador \
					particularly strong. ");
			
			makeCharts(data, latinamericanCountries);
			nextCount += 1;
		} else {
			//get rid of intro and next button, add the countryChooser
			d3.select("#laIntro").remove();
			d3.select("#next1").remove();
			makeSelector(data);
			eventHandlers(data);

		}
	}
)		//after next again clear the Latin America text and make the selector
		// d3.select("#intros").on('click', '#next2', function () {
		// 	d3.select("#laIntro").remove();
		// })

		
		//I need to select the 'next2' button but don't seem to be able to since it is dynamically created
		
		
				
			
		//function to handle "select all"
				
		
		})
	
	
	var eventHandlers = function (data) {
		d3.select('#selectAll').on('click', function () {
			d3.selectAll(".country")
				.property('checked', true);
		})

		//function to handle "select none"

		d3.select('#selectNone').on('click', function () {
			d3.selectAll(".country")
				.property('checked', false);
		})

	
		

		

		//function for selecting groups of countries
		d3.selectAll('.multiSelector').on('click', function () {
			
			currentArray = regions[this.id];

			d3.selectAll('.country')
				.property("checked", function () {
					
					if (currentArray.indexOf(this.name) != -1) {
						return true
					} 
				})
		})
					
		
		//submit and make charts
		d3.select('#submit').on('click', function () {
			makeCharts(data)

		})
	}
	
	var makeSelector = function (data) {
		var allCountries = dimple.getUniqueValues(data, "country");
		for (i = 0; i < allCountries.length; i++) {
			d3.select('#countryCheckBoxes')
				.append('label')
					.text(allCountries[i])

				.append("input")
					.attr("class", "country")
					.attr("name", allCountries[i])
					.attr("type", "checkbox");
			d3.select('#countryCheckBoxes')
				.append("br");

		}

		d3.select('#submitButton')
				.append('button')
					.attr("type", "button")
					.attr("id", "submit")
					.text("Submit")
				;


	//add buttons for select all and deselect all
		d3.select("#multiSelectors")
			
			.append('button')
				.attr("id", "selectAll")
				.attr("type", "button")
				.text("Select All")
				;
		

		d3.select("#multiSelectors")
			.append('button')
				.attr("id", "selectNone")
				.attr("type", "button")
				.text("Clear All")
				;
		

		//add buttons to select all members of regional groups
		d3.select("#multiSelectors")
			.append('p')
				.text("Add all . . .")
				
			.append('br')
			;

		for (var region in regions) {
			d3.select("#multiSelectors")
				.append('button')
					.attr("class", "multiSelector")
					.attr("id", region)
					.attr("type", "button")
					.text(names[region])
					;
		}
		
	 }

	//chart making function
	var makeCharts = function (data, countriesToInclude) {
			
			//if function has been passed an array of countries to use, use it, otherwise build the array from the checked boxes
			if (typeof countriesToInclude === 'undefined') {countriesToInclude = [];}

			if (countriesToInclude.length == 0) {

				d3.selectAll('.country').each(function () {
					if (this.checked == true) {
					countriesToInclude.push(this.name);
					}
				})
			}	
			
			d3.selectAll("svg").remove();

			
			//check the boxes and build the countriesToInclude variable

			
			
			
			//create svg to contain the charts
			var mainWidth = 1400
			var mainHeight = 350 + (210 * countriesToInclude.length)
			var svg = dimple.newSvg("#chartContainer", mainWidth, mainHeight);

			

			//get a unique list of questions
			var questions = dimple.getUniqueValues(data, "Question");

			
			//set the bounds for the subcharts
		    var row = 0,
		    col = 0,
		    top = 25,
		    left = 80,
		    inMarg = 70,
		    width =400,
		    height = 75	 * countriesToInclude.length,
		    totalWidth = mainWidth

		    //draw a chart for each of the 6 questions
		    questions.forEach(function (question) {
		    	
		    // if the next sunchart would go off the edge, move up a row
		    if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
		      row += 1;
		      col = 0;
		    }
		    
		    //filter data according to which boxes are checked
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

		    //extract the data corresponding to the current question
		    var chartData = dimple.filterData(countryData, "Question", question);

		    svg
		        .append("text")
		            .attr("x", left + (col * (width + inMarg)) + (width / 2))
		            .attr("y", top + (row * (height + inMarg)) - 10)
		            //.style("font-family", "Arial")
		            .style("text-anchor", "middle")
		            .style("font-size", "15px")
		            .text(questionText);

	    	//create the subchart
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
		    s.barGap = .3;

		    myChart.defaultColors = [
		    new dimple.color("#FF6961", "#FF6961", 1), // China
		    new dimple.color("#779ECB", "#779ECB", 1), // USA
		      
		      
		    ];

	    	//add legend to first chart only
		    if (col == 0) {
		      myLegend = myChart.addLegend(365,50 + ((height + 70) * row),500,50);
		    }
		    myLegend.fontSize = 14;
		    myLegend.fontFamily = "helvetica";
		    

		    //alter the tooltip text
		    s.getTooltipText = function (e) {
		            return [
		                "Country: " + e.aggField[1],
		                
		                "Regarding: " + e.aggField[2],
		                Math.round(e.aggField[0] * 100) + "%", //display % in 2 digits (e.g. 53%)
	                	questionText
		            ];
		        };

		    myChart.draw(1000);

		    //make the legend squares a little bigger
		    d3.selectAll('.dimple-legend-key')
		    	.attr("height", 18)
		    	.attr("width", 15);
		    	//.attr("x", this.x + 20);
		    // d3.selectAll('.dimple-bar')
		    //  	.attr("height", 20);

		    									;
		    

		    y.titleShape.remove();
		    x.titleShape.remove();

		    col += 1;
		    } , this)
		}
	
})