DenierEDU
=========

##What is this?

This is my first project while in General Assembly's Web Development Immersive program. To set the scene, I watched John Stewart's ["Burn Noticed"](https://www.youtube.com/watch?v=lPgZfhnCAdI) segment  5 days before starting the program. I am not especially politically charged, but this segment brought to light for me just how terrifying some of the beliefs touted by members of congress are on the subject of climate change. <br>
<br>Thus, I decided to focus my first project around identifying climate change deniers in Congress (did you know there are 140?!), finding the top industries funding their campaigns, and allowing visitors to tweet scientific literature (IPCC-5th Report) at a Representative / Senator.

##How was it built?
The site is built using a NodeJS backend with a Postgres database and is currently hosted on Heroku. The front-end of the site was built with a combination of ejs templating, bootstrap, and javascript/jQuery.

###How'd it go?
A core focus of mine during the project was exploring the use of API's for information gathering and creating a database schema that would allow for the information to be easily accessible. As I progressed, it became clear that garnering the information necessary would be my biggest challenge. In the end, the information was combined from three separate sources using two methods -

1. First, the names // quotes for each congressman were scraped from another website.
2. Next, the Sunlight foundation's API was used to gather contact information as well as a unique identifier for the next API used.
3. Finally, the OpenGov API was used to get campaign funding information for 2014 on each congressman.
These three steps were modularized and packaged into a single refresh function that is accessible from an admin page of the site.

###What's next?
1. I now have a tremendous amount of data surrounding the funding of congressmen that deny climate change, only a fraction of which is displayed in the current site. I would like to use this data to build visualizations that would inform visitors on both the amount of money spent on campaigns as well as the specific industries funding climate change denial overall.
2. Improvements to the UI and design of the site.
3. Last, but not least, I'd like to make a special section for the most outlandish of the denial quotes =).
