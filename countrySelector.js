$(document).ready(function() {
	//hard code countries to include in starter charts
	var countriesToInclude = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey"];

	//define regional groups
	//I want to make a dictionary 


	var euroCountries = ["Germany", "France", "Spain", "Britain", "Italy", "Poland", "Russia", "Greece", "Czech Republic"];
	var asiaCountries = ["Australia", "Indonesia", "Japan", "Malaysia", "Pakistan", "Philippines", "South Korea"];
	var muslimCountries = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey", "Jordan", "Palestinian territories"];
	var latinamericanCountries = ["Agentina", "Bolivia", "Brazil", "Chile", "El Salvador", "Mexico", "Venezuela"];
	var africanCountries = ["Ghana", "Kenya", "Nigeria", "Senegal", "South Africa", "Tunisia", "Egypt", "Uganda"];

	var regions = {"euroCountries" : euroCountries, "asiaCountries" : asiaCountries, "muslimCountries" : muslimCountries,
					"latinamericanCountries" : latinamericanCountries, "africanCountries" : africanCountries};
	var names = {"euroCountries" : "European Countries", "asiaCountries" : "Asian Countries", "muslimCountries" : "Muslim Countries",
					"latinamericanCountries" : "Latin American Countries", "africanCountries" : "African Countries"};

	
	
	d3.tsv("/muslim.attitudes.to.USA.China.tsv", function (data) {
		var allCountries = dimple.getUniqueValues(data, "country");
		for (i = 0; i < allCountries.length; i++) {
			$('form[id="countryChooser"]').append('<input class="country" type="checkbox" name="' + allCountries[i] + '">' + allCountries[i] + '</input><br>');
		}


		//add buttons for select all and deselect all
		$('form[id="multiSelectors"]').append('<button class="selectAllCountries" type="button" name = "Select All">Select All</button>');
		$('form[id="multiSelectors"]').append('<button class="selectNoCountries" type="button" name = "Select None">Clear All</button><br>	');
		$('form[id="multiSelectors"]').append('<p>Add all . . .</p>');

		//add buttons to select all members of regional groups
		for (var key in regions) {
			$('form[id="multiSelectors"]').append('<button class="multiSelector" type="button" id = ' + key + '>' + names[key] + '</button>');

			
		}
		


		

		


		//precheck some boxes
		$('input[type=checkbox]').each(function () {
			//console.log(this.name);
			if (jQuery.inArray(this.name, countriesToInclude) != -1) {
				$(this).prop("checked", true);
			}
		})
		
		//make the first set of charts based on countriesToInclude
		loadData(data)


		//function to handle "select all"
		d3.select('.selectAllCountries').on('click', function () {
			
			$('input[type=checkbox]').each(function () {
				$(this).prop("checked", true);

			})
			countriesToInclude = allCountries;
			loadData(data)

		})

		//function to handle "select none"

		d3.select('.selectNoCountries').on('click', function () {
			$('input[type=checkbox]').each(function () {
				$(this).prop("checked", false);
		})
		countriesToInclude = []
		loadData(data)
	})

		//function to handle "Select European Countries"
		//I want to generalize this to handle all the regional buttons

		d3.select('.selectEuroCountries').on('click', function () {

			$('input[type=checkbox]').each(function () {
				if (jQuery.inArray(this.name, euroCountries) != -1) {
					$(this).prop("checked", true);
					} 
			})
			countriesToInclude = countriesToInclude.concat(euroCountries);
			loadData(data);
		})

		//function for selecting groups of countries

		d3.selectAll('.multiSelector').on('click', function () {
			currentArray = regions[this.id];
			
			$('input[type=checkbox]').each(function () {
				if (jQuery.inArray(this.name, currentArray) != -1) {
					$(this).prop("checked", true);
					} 
			})
			countriesToInclude = countriesToInclude.concat(currentArray);
			loadData(data);
		})

		

		
		//when a box in checked, make a new chart
		d3.selectAll('input[class="country"').on('click', function () {
			

			d3.selectAll("svg").remove();
			
			//get list of countriresToInclude
			if (this.checked) {
				countriesToInclude.push(this.name);
				

			} else {
				var index = jQuery.inArray(this.name, countriesToInclude);
				countriesToInclude.splice(index, 1);
			}

			//make charts again based on most recent click
			loadData(data)
			
		})

		
		})

	//this function is called every time the charts are made
	var loadData = function (data) {
			d3.selectAll("svg").remove();
			console.log(countriesToInclude)
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
			                Math.round(e.aggField[0] * 100) + "%", //display % in 2 digits (e.g. 53%)
		                	questionText
			            ];
			        };

			    myChart.draw();
			    

			    y.titleShape.remove();
			    x.titleShape.remove();

			    col += 1;
			    } , this)
		}
	
})