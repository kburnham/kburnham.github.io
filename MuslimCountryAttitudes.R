


#install.packages("foreign")
library(foreign)
library(memisc)
library(ggplot2)
library(dplyr)
library(tidyr)


setwd("/Users/kb/Documents/MOOCs/datascience/DataVis/DataVis_Final_Project")
#data <- read.spss("Pew Research Global Attitudes Project Spring 2013 Dataset for web.sav", to.data.frame = True)


data <- as.data.set(spss.system.file("Pew Research Global Attitudes Project Spring 2013 Dataset for web.sav"))
data <- as.data.frame(data)

#list of large, predominantly Muslim countries in the Pew data. 
#we exlude Lebanon (small and large non-Muslim population), Palestinian territories(very small)
#and Mayalsia (large non-Muslim population)

#muslim.countries <- c("Egypt", "Jordan", "Indonesia", "Turkey", "Pakistan", 
                     "Tunisia")

#create list of European and Latin American countries to create 
# 
# euro.countries <- c("Britain", "Czech Republic", "France", "Germany", "Greece", "Italy", "Poland",
#                     "Russia", "Spain")
# la.countries <- c("Argentina", "Bolivia", "Brazil", "Chile", "El Salvador", "Mexico", "Venezuela")

##now create a variable for "Muslim", "Euro", "LA", "other"

# data$region <- "other"
# data$region[data$country %in% muslim.countries] <- "Muslim"
# data$region[data$country %in% euro.countries] <- "Euro"
# data$region[data$country %in% la.countries] <- "LA"
# data$region <- as.factor(data$region)
# summary(data$region)

##remove all 'other'
#data <- subset(data, region != "other")

##actually I think I want the country to be "Euro" or "LA"

#add new levels to country
#data$country <- factor(data$country, levels = c(levels(data$country), "Europe", "Latin America"))

#non-Muslim countries are treated as regional groups 
#data$country[data$country %in% euro.countries] <- "Europe"
#data$country[data$country %in% la.countries] <- "Latin America"



#subset to the questions we are interested in - those that deal with USA and China

questions = c("psraid", "country", "phonetype", "q9a", "q9c", "q11a", "q11b", "q25", "q29", "q30", "q47", "q59", "q119", "q120", "q127b", "q127c", "q174", "q175", "q178")
data <- data[questions]

new.colnames <- c("psraid", "country", "phonetype", "USA.favorable.9a", "China.favorable.9c", "China.threat.11a", 
                  "USA.threat.11b", "best.econ.model.25", "lead.econ.power.29", "China.replace.30", "US.take.interest.47",
                  "Chine.take.interest.59", "China.partner.119", "USA.partner.120", "China.respect.freedom.127b", 
                  "USA.respect.freedom.127c", "Sunni.Shia.174", "pray.frequency.175", "religion.important.178")


colnames(data) <- new.colnames

#create a column "is.devout" which is True for anyone for whom pray.frequency.175 = "Every day
#five times"

# data$is.devout <- FALSE
# data$is.devout[data$pray.frequency.175 == "Every day five times"] <- TRUE

#summary(data$is.devout[data$country %in% muslim.countries])


#### now create the new variables. I want to create a horizontal bar chart with China on one side and USA
#on the other. So I want to take the variables that I have to create new variables whose values
#are either 1 (China) or 0 (USA) or 2 (tied, or other)

#convert 9a and 9c
#so check which country has a more favorable rating comparing 9a and 9c and create a more.favorable column

#first I need to convert 9a and 9c to numerical values

#first 9a


##QUESTION #1 - Respondents with favorable opinion of USA/China
#set all to 0
data$USA.favorable <- 0
data$USA.favorable[data$USA.favorable.9a == "Very favorable"] <- 1
data$USA.favorable[data$USA.favorable.9a == "Somewhat favorable"] <- 1
data$USA.favorable[data$USA.favorable.9a == "Somewhat unfavorable"] <- 0
data$USA.favorable[data$USA.favorable.9a == "Very unfavorable"] <- 0
summary(data$USA.favorable)

#now 9c

data$China.favorable <- 0
data$China.favorable[data$China.favorable.9c == "Very favorable"] <- 1
data$China.favorable[data$China.favorable.9c == "Somewhat favorable"] <- 1
data$China.favorable[data$China.favorable.9c == "Somewhat unfavorable"] <- 0
data$China.favorable[data$China.favorable.9c == "Very unfavorable"] <- 0

summary(data$China.favorable)



##Question #2 - China's/USA's power and influence is a threat to your country?

#convert questions 11a and 11b to numeric

data$USA.threat <- 0
data$USA.threat[data$USA.threat.11b == "Major threat"] <- 1
data$USA.threat[data$USA.threat.11b == "Minor threat"] <- 1

summary(data$USA.threat)

data$China.threat <- 0
data$China.threat[data$China.threat.11a == "Major threat"] <- 1
data$China.threat[data$China.threat.11a == "Minor threat"] <- 1

summary(data$China.threat)




##QUESTION #3 - Which country has a more appealing economic model?

summary(data$best.econ.model.25)

#So now I wnat q25 to be two new columns - China.best and USA.best where there is a 1 if they said China and 
# a zero if they said anything else

data$China.best <- 0
data$China.best[data$best.econ.model.25 == "State capitalism"] <- 1

data$USA.best <- 0
data$USA.best[data$best.econ.model.25 == "Free market capitalism"] <- 1

summary(data$USA.best)
summary(data$China.best)


##QUESTION #4 - Do you think that China/USA takes into account the interests of countries around the world?

#first convert 47 to number

summary(data$US.take.interest.47)

data$USA.interest <- 0
data$USA.interest[data$US.take.interest.47 == "Great deal"] <- 1
data$USA.interest[data$US.take.interest.47 == "Fair amount"] <- 1
data$USA.interest[data$US.take.interest.47 == "Not too much"] <- 0
data$USA.interest[data$US.take.interest.47 == "Not at all"] <- 0

summary(data$USA.interest)

#same for China q59

data$China.interest <- 0
data$China.interest[data$Chine.take.interest.59 == "Great deal"] <- 1
data$China.interest[data$Chine.take.interest.59 == "Fair amount"] <- 1
data$China.interest[data$Chine.take.interest.59 == "Not too much"] <- 0
data$China.interest[data$Chine.take.interest.59 == "Not at all"] <- 0

summary(data$China.interest)

#Question #5 - Do you consider USA/China a partner to your country?

data$China.partner <- 0
data$China.partner[data$China.partner.119 == "More of a partner"] <- 1

summary(data$China.partner)

data$USA.partner <- 0
data$USA.partner[data$USA.partner.120 == "More of a partner"] <- 1

summary(data$USA.partner)

##QUESTION #6 - Does China/USA respect the freedoms of its people?
summary(data$USA.respect.freedom)
data$USA.respect <- 0
data$USA.respect[data$USA.respect.freedom.127c == "Yes - respects personal freedoms"] <- 1
summary(data$USA.respect)
by(data$country, data$USA.respect, summary)
data$China.respect <- 0
data$China.respect[data$China.respect.freedom.127b == "Yes - respects personal freedoms"] <- 1
summary(data$China.respect)

##Melt the data so that 'USA' and 'China' become category labels. So each of the 6 questions, which
#now span 2 columns each, will instead each take one.

long.data <- data %>%
  gather(Question, Score, c(USA.favorable:China.favorable, USA.threat:China.threat, China.best:USA.best,
                            USA.interest:China.interest, China.partner:USA.partner, 
                            USA.respect:China.respect)) %>%
  separate(Question, into = c("USA.or.China", "Question"), sep = "\\.")

long.data$Question <- as.factor(long.data$Question)
long.data$USA.or.China <- as.factor(long.data$USA.or.China)


#group the data so that each country has a single row

final.data <- long.data %>%
  group_by(country, USA.or.China, Question) %>%
  summarise(avg.Score = mean(Score))


#multiple the avg.Scores by 100 so they represent percentages


  


####
##generate a basic plot of what the final product will look like

ggplot(aes(x = country, y = Score, fill = USA.or.China), data = long.data) +
  stat_summary(fun.y="mean", geom="bar", position = "dodge") +
  coord_flip() +
  facet_wrap(~Question)

##now export long.data to a tsv file so that I can import it with dimple.js




write.table(final.data, "muslim.attitudes.to.USA.China.tsv", sep = "\t", col.names = NA)

