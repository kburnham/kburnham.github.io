$(document).ready(function() {
	
	
	d3.tsv("/muslim.attitudes.to.USA.China.tsv", function (data) {
		var allCountries = dimple.getUniqueValues(data, "country");
		
		for (i = 0; i < allCountries.length; i++) {
			$('form').append('<input type="checkbox" name="' + allCountries[i] + '">' + allCountries[i] + '</input><br>');

		}
		$('form').append('<input type="submit" value="Make charts">');
		countriesToInclude = [];
		$(":checkbox").click(function () {
			var index = jQuery.inArray(this.name, countriesToInclude);
			if (index == -1) {
				countriesToInclude.push(this.name);
			} else {
				countriesToInclude.splice(index, 1);
			}
			
			console.log(countriesToInclude);
		})
	});


		

	
	

});