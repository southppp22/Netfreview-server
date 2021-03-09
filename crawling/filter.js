const fs = require('fs');


let object = JSON.parse(fs.readFileSync('videoData.json', 'utf8'));
let videoList = [];
for (const video of object.data) {
  let count = 0
  for (const listVideo of videoList) {
    if (video.title === listVideo.title) count++
  }
  if (video.netflixUrl || count === 0) videoList.push(video);
}

object.data = videoList;
// console.log(object)
fs.writeFileSync('videoData.json',JSON.stringify(object))