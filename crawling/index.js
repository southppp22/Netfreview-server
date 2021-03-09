const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

function findVideo(num) {
  let resultObj;
  const url = `https://m.kinolights.com/title/${num}`;
  request(url, function (error, response, html) {
    const initBannerURLIdx = html.indexOf('https://nujhrcqkiwag1408085.cdn.ntruss.com/static/upload/movie_still_images');
    const finBannerURLIdx = html.indexOf('><meta data-n-head="ssr" data-hid="ogdesc"') - 1;
    const bannerUrl = html.slice(initBannerURLIdx, finBannerURLIdx)
    
    const initPosterURLIdx = html.indexOf('"image": "') + 10;
    const finPosterURLIdx = html.indexOf(' "description"') - 10;
    const posterUrl = html.slice(initPosterURLIdx, finPosterURLIdx)
    
    const initGenresIdx = html.indexOf('"genre":') + 10;
    const finGenresIdx = html.indexOf('"contentRating"') - 11
    const rawGenres = html.slice(initGenresIdx, finGenresIdx);
    const newGenres = rawGenres.split(',');
    const genres = [];
    for (let el of newGenres) genres.push(el.slice(1, el.length - 1));
    
    const $ = cheerio.load(html);
    const description = $('section.movie-content-area article.article-wrap p').text() || 'null';
    const title = $('div.movie-title-wrap h3').text();
    const people = $('div.container-person').children('div.person')
    const director = [];
    const actor = [];
    
    let netflixUrl = null;
    const streaming = $('section.movie-ott-wrap div.article-wrap div ul.movie-price-list').children('li.movie-price-item')
    streaming.each(function(i, el) {
      const flatform = $(this, 'a div.movie-price-wrap').find('span.provider-name').text()
      if (flatform === '넷플릭스') {
        const netflix = $(this).find('a').attr('href');
        netflixUrl = netflix;
      }
    })
    
    people.each(function(i, el) {
      if ($(this).find('div.character').text() === '감독') director.push($(this).find('div.name').text())
      else actor.push($(this).find('div.name').text())
    })
    
    const typeAndYear = $('div.movie-info-container div.movie-header-area div.movie-title-wrap').children('p.metadata').text();
    const dotIdx = typeAndYear.indexOf('·')
    let type = typeAndYear.slice(0, dotIdx - 1);
    const releaseYear = typeAndYear.slice(dotIdx + 1)
    if (type !== '드라마' ) type = '영화';
    else type = 'TV 프로그램'
    
    let ageLimit;
    const initRawContentRatingIdx = html.indexOf('"contentRating"') + 18
    const finRawContentRatingIdx = html.indexOf('"actor"') - 11
    const rawContentRating = html.slice(initRawContentRatingIdx, finRawContentRatingIdx);
    if (rawContentRating === '15세이상관람가' || rawContentRating === '15세이상시청가') ageLimit = 15;
    else if (rawContentRating === '12세이상관람가' || rawContentRating == '12세이상시청가') ageLimit = 12;
    else if (rawContentRating === '미정') ageLimit = 99;
    else if (rawContentRating === '모든연령시청가' || rawContentRating === '전체관람가') ageLimit = 0
    else if (rawContentRating === '19세이상시청가' || rawContentRating === '청소년관람불가') ageLimit = 19;
    else ageLimit = 100;
    
    
    if (bannerUrl && posterUrl && netflixUrl) {
      resultObj = {
        title,
        description,
        actor,
        ageLimit,
        releaseYear,
        posterUrl,
        bannerUrl,
        netflixUrl,
        type,
        director,
        genres,
      }
      console.log('ok');
      let object = JSON.parse(fs.readFileSync('videoData.json', 'utf8'));
      // console.log(object.data, resultObj);
      object.data.push(resultObj);
      // console.log(object)
      fs.writeFileSync('videoData.json',JSON.stringify(object))
    } else {
      console.log('?')
    }
  })
}

let num = 87250
for (let i = num; i < num + 25; i++) {
  findVideo(i);
}