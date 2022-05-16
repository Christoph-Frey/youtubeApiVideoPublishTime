import api_key from "../private/private"
// How to access youtube api :
//  use url:
// ("https://www.googleapis.com/youtube/v3/videos?part=statistics&id={ID}&key={YOUR-API-KEY}");
// 

// this url queries quite a lot
// const url = "https://www.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails,statistics,status";
// this one queries less
const url = "https://www.googleapis.com/youtube/v3/videos?&part=snippet";

// get the form submission
const form = document.querySelector("#urlForm");
form.onsubmit = getVideoData;
const urlField = document.querySelector("#urlField");
const output = document.querySelector("#output");

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
    output.innerHTML=data.items[0].snippet.publishedAt; 
}
