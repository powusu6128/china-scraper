
//Dependencies
const express = require('express'),
      cheerio = require('cheerio'),
      rp = require('request-promise'),
      router = express.Router(),
      db = require('../models');

//route to scrape new articles
router.get("/newArticles", function(req, res) {
  //configuring options object for request-promist
  const options = {
    uri: 'https://www.nytimes.com/section/us',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  //calling the database to return all saved articles
  db.Article
    .find({})
    .then((savedArticles) => {
      //creating an array of saved article headlines
      let savedHeadlines = savedArticles.map(article => article.headline);

        //calling request promist with options object
        rp(options)
        .then(function ($) {
          let newArticleArr = [];
          //iterating over returned articles, and creating a newArticle object from the data
          $('section div li').each((i, element) => {
            let newArticle ={
              storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              headline: $(element).find('h2.headline').text().trim(),
              summary : $(element).find('p.summary').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('p.byline').text().trim()
            };

            console.log()
            //checking to make sure newArticle contains a storyUrl
            if (newArticle.storyUrl) {
              //checking if new article matches any saved article, if not add it to array
              //of new articles
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });//end of each function

          //adding all new articles to database
          db.Article
            .create(newArticleArr)
            .then(result => res.json({count: newArticleArr.length}))//returning count of new articles to front end
            .catch(err => {});
        })
        .catch(err => console.log(err)); //end of rp method
    })
    .catch(err => console.log(err)); //end of db.Article.find()
});// end of get request to /scrape

module.exports = router;


// var express = require("express");
// var bodyParser = require("body-parser");
// // var logger = require("morgan");
// // var mongoose = require("mongoose");

// // Our scraping tools
// // Axios is a promised-based http library, similar to jQuery's Ajax method
// // It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Require all models
// var db = require("../models");

// // Initialize Express Router
// var router = express.Router();

// router.get("/newArticles", function (req, res) {

//   axios.get("https://www.nytimes.com/section/us").then(function (response) {

//     var $ = cheerio.load(response.data);



//     $("section div li").each(function (i, element) {

//       var article = {
//         storyUrl: $(element).find('.media photo a').attr('href'),
//         headline: $(element).find('h2.headline').text().trim(),
//         summary: $(element).find('p.summary').text().trim(),
//         imgUrl: $(element).find('img').attr('src'),
//         byLine: $(element).find('span.author').text().trim()
//       }
//       var newArticleArr = [];
//       if (!article.headline === "" && !article.storyUrl === "" && !article.summary === "" &&
//         !article.imgUrl === "" && !article.byLine === "")

//         return;

//       console.log(article);

//       let newArticle = new db.Article(article);

//       //checking to make sure newArticle contains a storyUrl

//       db.Article.create(article).then(function (dbArticle) {
//         console.log(dbArticle);
//         newArticleArr.push(res.json(dbArticle))
//       }).catch(function (err) {
//         return res.json(err);
//       });

//     }); //end of each function
//   });



//   // grap every div with section tag and do the following

// });


// module.exports = router;