$(document).ready(function() {
	//hard code countries to include in starter charts
	var countriesToInclude = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey"];

	//define regional groups for "Add all . . . "
	var euroCountries = ["Germany", "France", "Spain", "Britain", "Italy", "Poland", "Russia", "Greece", "Czech Republic"];
	var asiaCountries = ["Australia", "Indonesia", "Japan", "Malaysia", "Pakistan", "Philippines", "South Korea"];
	//var muslimCountries = ["Pakistan", "Egypt", "Indonesia", "Tunisia", "Turkey", "Jordan", "Palestinian territories"];
	var latinamericanCountries = ["Agentina", "Bolivia", "Brazil", "Chile", "El Salvador", "Mexico", "Venezuela"];
	var africanCountries = ["Ghana", "Kenya", "Nigeria", "Senegal", "South Africa", "Tunisia", "Egypt", "Uganda"];

	//put the regional groups in an associative array together
	var regions = {"euroCountries" : euroCountries, "asiaCountries" : asiaCountries, 
					"latinamericanCountries" : latinamericanCountries, "africanCountries" : africanCountries};

	//make names for button labeling
	var names = {"euroCountries" : "European Countries", "asiaCountries" : "Asian Countries", "muslimCountries" : "Muslim Countries",
					"latinamericanCountries" : "Latin American Countries", "africanCountries" : "African Countries"};


	
	//generate a checkbox for each of the countries in the data file
	d3.tsv("/muslim.attitudes.to.USA.China.tsv", function (data) {

		var allCountries = dimple.getUniqueValues(data, "country");
		for (i = 0; i < allCountries.length; i++) {
			$('div[id="countryCheckBoxes"]').append('<input class="country" type="checkbox" name="' + allCountries[i] + '">' + allCountries[i] + '</input><br>');
		}


	//add buttons for select all and deselect all
		$('div[id="multiSelectors"]').append('<button class="selectAllCountries" type="button" name = "Select All">Select All</button>');
		$('div[id="multiSelectors"]').append('<button class="selectNoCountries" type="button" name = "Select None">Clear All</button><br>	');

		//add buttons to select all members of regional groups
		$('div[id="multiSelectors"]').append('<p>Add all . . .</p>');
		for (var key in regions) {
			$('div[id="multiSelectors"]').append('<button class="multiSelector" type="button" id = ' + key + '>' + names[key] + '</button>');
			$('div[id="multiSelectors"]').append('<div class="divider"/>');
		}
			
		//precheck some boxes
		$('input[type=checkbox]').each(function () {
			//console.log(this.name);
			if (jQuery.inArray(this.name, countriesToInclude) != -1) {
				$(this).prop("checked", true);
			}
		})


		
		

		
		
		//make charts for the first time. countriesToInclude is hard coded above
		loadData(data)

		//var selector = $('#countryChooser').detach();
		
		$('#next1').on('click', function() {

			
			$('#muslimIntro').remove();
			countriesToInclude = africanCountries.slice();

			loadData(data);
			$('#intros').append('<p id="africanIntro">In the African countries we find more goodwill in general, especially towards the United States. The American economic model continues to be preferred, but strong support exists only in a few countries like Kenya and Senegal.Click continue to explore the data on your own<br><button id="continue">Continue</button></p>');

		$('#continue').on('click', function() {
			
			$('#africanIntro').remove();
			selector.appendTo('#countries');
		})
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

			

			
		//every time a box is checked, make the new chart
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
	

	})

	//chart making function
	var loadData = function (data) {
			d3.selectAll("svg").remove();

			//create svg to contain the charts
			var mainWidth = 1400
			var mainHeight = 300 + (200 * countriesToInclude.length)
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
		            .style("font-family", "helvetica")
		            .style("text-anchor", "middle")
		            .style("font-size", "14px")
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
		    new dimple.color("#FF6961", "#FF6961", 1), // red
		    new dimple.color("#779ECB", "#779ECB", 1), // blue
		      
		      
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
		    var test = 150;
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