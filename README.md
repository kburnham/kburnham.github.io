# kburnham.github.io

<h3>Summary</h3>

This vizualization displays the results of a recent Pew Research survey that asked people around the world for their opinions about both the United States and China. It allows the user to compare the answers given by people in different countries to questions about how they view the two largets economies in the world. Large discrepancies between the red and blue bars in the charts indicate countries that have very different views about the United States and China (see Japan and Pakistan). Buttons below the check boxes allow users to see all countries in a given region at once.

<h3>Design</h3>

My initial plan was to use the Pew data to see how different countries in the Muslim world view both the United States and China. From my own experiences I know that views of the United States in at least some Muslim countries tend to be negative, I knew less about Muslim countries outside the Middle East, and I know little about how they view China. So I filtered the Pew data to find questions that allowed direct comparisons between the US and China. I simplified the data by collapsing the answers to some questions. I did this hoping to create simple small multiples based on the different comparisons that could be made. 

I felt that a bar chart would be appropriate for these comparisons since they compared measures between two categories and they would be well known to most users and because length is a prominent visual encoding. 

The primary change after the halfway point of the design was to make the charts interactive by allowing the user to choose which countries appear in them. Originally the charts showed only the results of Muslim majority countries. Now users can add and subtract countries to the charts as they wish and can even add groups of countries from a given region at the click of the button.

Other changes include:
- adding the '%' symbol to the x-axis so that it was clear what is being measured
- including the y-axis labels on all charts, not just the left side ones. This makes it easier to see which countries are being looked at.
- changed the tooltips so that they are more informative in that they provide more, less cryptic information
- added a link to a description of methodolgy so that users can get more information about how the data were generated.
- increased the spacing between bar groups for a neater look.
- include the legend on all the left side charts so that it is always in view.
- choose slightly less aggresive colors for the bars
- removing the regional averages since they seemed to be confusing. They were intended originally for comparison to the Muslim countries, but since the charts have expanded since they, they made less sense.

The halfway point for the project is at commit 3728d912196c6db7f77aa30bfddf691dd6a5db6d 'halfway point'.


<h3>Feedback</h3>

From my dad:

In no particular order:

I would like to know exactly what questions were asked and how the sampling was done, fraction of responders...
The data must be in in percents?  Why not label that way.  0    10%    20% etc.
Are the data fractions of Muslims or fractions of the entire country?  It's hard to know what to think without knowing that answer.
My main takeaway  is that everyone (except Tunisia) likes the US economic model more than China's and Europe doesn't seem to like either economic model.  That might reflect the rising inequality in the US.
Everyone (except Europe) sees the US as a greater threat.  The only super power?
Only Pakistan believes strongly that China is interested in them.  Maybe, but I doubt it.  That might reflect very negative feeling about the US in Pakistan.  The rest are pretty balanced.
"Do you think that China/USA respects the interests of its own people" is very ambiguous.  Is it about individuals or the country as a whole.  Democracy or nationalism?  Hard to know how to interpret it.  The European and Latin American perspectives are quite different from the rest.
When you drag your cursor over a bar, a dialog box pops up which seems to indicate an either/or question ("US or China").  But see Indonesia favorable opinion.  The numbers add to well over 100. The questions must be absolute and not relative.

From my wife (my notes):

 - inlcude all axis marks

 - increase spacing between bars

 - choose less aggressive colors 

 - it would be great if you could see all the countries

 - the legend needs to appear more than once since it goes off the screen when a large # of countries are selected
 
Nikolay (Udacity TA)
Thanks for sharing your visualization! Is the data aggregated per country or per region? Because I see some countries, but I also see Europe, Latin America.

It is a bit confusing given the title of the visualization. You may consider visually separating the two parts (Muslim countries and non-Muslim regions) somehow.

Also, how do you compute average ratings from these regions?

<h3>Resources</h3>

- http://www.codecademy.com/en/tracks/jquery
- http://bl.ocks.org/mbostock/3885705
- http://stackoverflow.com/questions/25334677/override-d3-dimple-tooltips-with-chart-data
- http://annapawlicka.com/pretty-charts-with-dimple-js/
- http://www.dyn-web.com/tutorials/forms/checkbox/group.php
- https://api.jquery.com/submit/
- https://github.com/PMSI-AlignAlytics/dimple/wiki/dimple.chart#addLegend
- https://discussions.udacity.com/t/controlling-bars-in-a-dimple-bar-chart/22782/2
- https://discussions.udacity.com/t/facet-wrap-in-dimple-js/22487
- http://stackoverflow.com/questions/15044385/d3-map-with-checkbox-filtering
- http://www.alexrothenberg.com/2014/01/06/learning-d3-by-building-a-chart.js.html
