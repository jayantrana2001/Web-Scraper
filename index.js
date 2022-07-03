const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');

//const writeStream = fs.createWriteStream('post.csv');

//writeStream.write(`Title , Link \n`);

const url = 'https://www.youtube.com/c/trahan/videos';
const string = 'Days';
const sendMail = require("./MailSender");


async function fetchFromYouTube(resp) {
    const browser = await puppeteer.launch();
     const page = await browser.newPage();
      await page.goto(url)
    
      resp(await page.content());
      browser.close()
     
}
function getLatestTitle(data) {
    const $ = cheerio.load(data);
      let VideoTitles = [];
      $('div #details').children('div #meta').children('h3').children('a').each(function(i,el){ 
        const title = $(el).text();
        const link = $(el).attr('href');
        VideoTitles.push({title : $(el).text() ,link : $(el).children('a').attr('href') });
        //writeStream.write(`${title} , ${link} \n`);
        });
        
    return VideoTitles[0];
}

function compare() {
    let previousTitle,latestTitle;
    fetchFromYouTube((data)=>{
    previousTitle=  getLatestTitle(data);
}).then(()=> {
    fetchFromYouTube((data)=>{
    latestTitle = getLatestTitle(data);
    if(latestTitle.title !== previousTitle.title) {
        console.log('New Video Found');
        console.log(previousTitle);
        console.log(latestTitle);
        if(latestTitle.title.includes('Days')) {
            console.log('Includes the Keyword!');
            sendMail("New Video is Released",latestTitle.title,latestTitle.link,"https://www.youtube.com");
        }
    }
  })
}).then(()=>{
  compare();
})
}
compare();