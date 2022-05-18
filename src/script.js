import api_key from "../private/private.js";
// const api_key = import("../private/private");

// How to access youtube api :
//  use url:
// ("https://www.googleapis.com/youtube/v3/videos?part=statistics&id={ID}&key={YOUR-API-KEY}");
// 

// this url queries quite a lot
// const url = "https://www.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails,statistics,status";
// this one queries less
const url = "https://www.googleapis.com/youtube/v3/videos?&part=snippet";
let time = "";
// get the form submission
const form = document.querySelector("#urlForm");
form.onsubmit = getVideoData;
const urlField = document.querySelector("#urlField");
const output = document.querySelector("#output");
const outputLocal = document.querySelector("#outputLocal");
const outputPublishTimeDiff = document.querySelector("#outputPublishTimeDiff");

async function NormalizeTimeDifference(hours, minutes, seconds){
    // if seconds are negative:
    // add a minute and invert seconds: 60 + seconds
    if (seconds<0){
        if (minutes + 1 > 60){
            minutes = 0;
        } else {
            minutes = minutes - 1;
        }
        seconds = 60 + seconds;
    }

    // if minutes are negative:
    // add an hour and invert minutes: 60+minutes
    if (minutes<0){
        if (hours + 1 > 60){
            hours = 0;
        } else {
            hours = hours - 1;
        }
        minutes = 60 + minutes;
    }

    // if hours are negative:
    // invert hours : 24 + hours
    if (hours < 0){
        hours = 24 - hours;
    }
    return [hours, minutes, seconds];
}
async function getVideoData(event){
    event.preventDefault();
    // console.log(event.target[0].value);
    // get the video id from the url
    // from
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    let video_url = event.target[0].value;
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = video_url.match(regExp);
    let id = (match&&match[7].length==11)? match[7] : false;


    // query the api
    let data = await fetch(url+"&id="+id+"&key="+api_key)
    .then(response=>response.json())
    .then(content =>content)
    .catch(error=>console.log(error));
    console.log(data.items[0]); 
    output.innerHTML=data.items[0].snippet.publishedAt + " UTC";
    console.log(data.items[0].snippet.publishedAt)
    let matchTime = /\d+:\d+:\d+/;
    // let time = data.items[0].snippet.publishedAt.match(matchTime);
    // console.log(time[0]);
    //  put it into datetime
    let timeObject = new Date(data.items[0].snippet.publishedAt)
    outputLocal.innerHTML = timeObject;
    console.log(timeObject);
    let nowTime = new Date();
    let secDiff = timeObject.getUTCSeconds() - new Date().getUTCSeconds();
    let minDiff = timeObject.getUTCMinutes() - new Date().getUTCMinutes();
    let hourDiff = timeObject.getUTCHours() - new Date().getUTCHours();

    NormalizeTimeDifference(hourDiff, minDiff, secDiff).then(([h,m,s])=> {
        let formattedTime = h + "h " + m + "m " + s + "s";
        console.log(formattedTime);
        outputPublishTimeDiff.innerHTML = formattedTime;}
        );

    console.log(`Difference : ${hourDiff}h ${minDiff}min ${secDiff} sec`)

}
