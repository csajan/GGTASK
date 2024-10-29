# National Trust A/B Testing

## Overview

The National Trust would like to display the weather on the information page of a property. They believe that having this additional information will increase the likelyhood of a user visiting the property.

This script adds the weather to the existing page and carrys out a form of A/B testing by only showing the weather to 50% of users and tracking what is viewed/clicked. Once the user clicks to get location / buy membership the data can then be stored and analysed.

## Get Started

This is a guide for Chrome

- In order to get started copy the script.js file.
- Right click and inspect the page.
- On the dev tools find the 'Sources' tab
- In the 'Sources' tab find 'Snippets'
- Create new snippet and give it a name
- Paste code onto snippet and save
- Run snippet with the 'play' button at bottom of the page

See [Chrome Snippets](https://developer.chrome.com/docs/devtools/sources#snippets) if still unsure

## Conclusion

This script has been refactored and has been decoupled allowing a separation of concerns (each function has it's own specific task). This improves readability, reusability and scalabilty.

The endpoint given returns weather data of 3 hour intervals at said location. This data need to be sorted and mapped before it can be shown. (Timestamp must be converted to date, average tempreature calculated, icon id saved to be later shown from openweathermap link)

If weather is not fetched dataToSend.weatherShown is set to false. Each bit of data that gets toggled can be seen in first half of the code.

The dataToSend is shown on alert as this gives time to read and prevents redirection. This data can be stored in DB/ used to identify patterns and likelyhood of whether the user will vist the property.
