// Moment5 Edvard Schönfeldt 2023
// Hemsida med API från Sveriges radio

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

/* Här under börjar du skriva din JavaScript-kod */

//Initsierar vår kod
window.onload = getData;

//Hämtar data från sveriges radio
function getData(){
    let channelSize = 10; //Önskat antal kanaler
    const url = "https://api.sr.se/api/v2/channels?format=json&size=" //URL till SR's API

    fetch(url + channelSize) // Hämtar API beroende på hur många kanaler vi vill ha
    .then((res) => res.json()) // Konverterar från JSON
    .then((data) => useData(data.channels)) //SKickar önskad data till "useData"
}


// Element från DOM och variabler
let channelListEl = document.getElementById("mainnav");
let channelSchedualListEl = document.getElementById("info");
let currentTime = new Date();

// Eventlistners


//Används som "main". Kallar på funktioner
function useData(channels){

    channels.forEach(channel => {
        addChannel(channel);
    });

}


//Lägger till kanal till listan
function addChannel(channel){
    let newEl = document.createElement("li"); //Skapar nytt element
    let newElName = document.createTextNode(channel.name); //PH innehåll
    
    newEl.appendChild(newElName); //Slå ihop
    newEl.className = "channelElements"; //Lägger till elementet i en klass
    newEl.title = channel.tagline; //Lägger till beskrivning

    newEl.addEventListener("click", function(e){

        getChannelInfo(channel.scheduleurl + "&format=json&size=100");//  Visar kanalens info/tablå

    })

    channelListEl.appendChild(newEl); //Lägger till i DOM

}

//Hämtar URL för vald kanal
function getChannelInfo(channelUrl){
    
    
    fetch(channelUrl) // Hämtar API för kanalens schema
    .then((res) => res.json()) // Konverterar från JSON
    .then((data) => changeInfo(data.schedule)) //SKickar önskad data till "changeInfo"
}

//Skriver ut schema för vald kanal
function changeInfo(schedule){
    let oldElements = document.getElementsByClassName("Scheduel Object")

    //Raderar gammal info
    for(let i = (oldElements.length - 1);i > -1;i--){
        oldElements[i].remove();
    }
    
    schedule.forEach(object => {
        if (parseInt(object.endtimeutc.substr(6)) >= currentTime){ //Checkar att programmet inte redan gått
     let newTitleEl = document.createElement("h2"); //Skapar nytt element i stil h2
     let newTimeEl = document.createElement("h4"); //Skapar nytt element i stil h4
     let newInfoEl = document.createElement("div"); // SKapar nytt element i stil div
     let fillerEl = document.createElement("div"); //Skapar ett element i stil div som vi ska ha för att snygga till sidan lite

     //Placeholders i form av text
     let newTitleElName = document.createTextNode(object.title); 
     let newTimeElName = document.createTextNode(convertDateString(object.starttimeutc) + "-" + convertDateString(object.endtimeutc));
     let newInfoElName = document.createTextNode(object.description);
     let filler = document.createTextNode("______________________________________________");

     //Ger elementen en klass
     newTitleEl.className = "Scheduel Object";
     newTimeEl.className = "Scheduel Object";
     newInfoEl.className = "Scheduel Object";
     fillerEl.className = "Scheduel Object";

     //Slår ihop våra element med textnoderna
     newTitleEl.appendChild(newTitleElName); 
     newTimeEl.appendChild(newTimeElName);
     newInfoEl.appendChild(newInfoElName);
     fillerEl.appendChild(filler);

     //Lägg till i DOM
     channelSchedualListEl.appendChild(newTitleEl);
     channelSchedualListEl.appendChild(newTimeEl);
     channelSchedualListEl.appendChild(newInfoEl);
     channelSchedualListEl.appendChild(fillerEl);

     


    }
}
    )
}
//Konverterar våran datastring från API till läsvänlig tid
function convertDateString(dateString){
    let tempDate = new Date(parseInt(dateString.substr(6))) //Kortar Stringen till endast datum i siffror

    //Returnerar en klocka med timme och minut
    let hour = tempDate.getHours();
    let min = tempDate.getMinutes();
    if (hour < 10){
        hour = "0" + hour;
    }
    if (min < 10){
        min = "0" + min;
    }
    return hour + ":" + min;
}
