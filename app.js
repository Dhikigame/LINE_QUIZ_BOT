var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require("crypto");
var async = require('async');

var sendMessage = require('./lib/sendMessage.js');
var messageTemplate = require('./lib/messageTemplate.js');
var pgManager = require('./lib/postgresManager.js'); // データベースを使う時に必要

// utilモジュールを使います。
var util = require('util');

app.set('port', (process.env.PORT || 8000));
// JSONの送信を許可
app.use(bodyParser.urlencoded({
  extended: true
}));
// JSONパーサー
app.use(bodyParser.json());

app.get('/', function(req, res) {
  // herokuのルートディレクトリにアクセスした時に表示される
  res.send('<h1>hello world</h1>');
});

// async.waterfall([function(){}], function(){})
app.post('/callback', function(req, res) {
  async.waterfall([
      function(callback) {
        // リクエストがLINE Platformから送られてきたか確認する
        if (!validate_signature(req.headers['x-line-signature'], req.body)) {
          return;
        }
        // テキストか画像が送られてきた場合のみ返事をする
        if (
          (req.body['events'][0]['type'] != 'message') ||
          ((req.body['events'][0]['message']['type'] != 'text') &&
            (req.body['events'][0]['message']['type'] != 'image'))
        ) {
          return;
        }

        // 特定の単語に反応させたい場合
        //if (req.body['events'][0]['message']['text'].indexOf('please input some word') == -1) {
        //    return;
        //}

        // ユーザIDを取得する
        var user_id = req.body['events'][0]['source']['userId'];
        var message_id = req.body['events'][0]['message']['id'];
        // 'text', 'image' ...
        var message_type = req.body['events'][0]['message']['type'];
        var message_text = req.body['events'][0]['message']['text'];
        if (req.body['events'][0]['source']['type'] == 'user') {
          request.get(getProfileOption(user_id), function(error, response, body) {
            if (!error && response.statusCode == 200) {
              callback(req, body['displayName'], message_id, message_type, message_text);
            }
          });
        }
      },
    ],

    // 返事を生成する関数
    function(req, displayName, message_id, message_type, message_text) {

//      var message = "hello, " + displayName + "さん"; // helloと返事する
      //var message = message_text; // おうむ返しする
      //var message = message_text + "[" + message_text.length + "文字]";

//      sendMessage.send(req, [messageTemplate.textMessage(message)]);

      // データベースを使う場合、下記のコードはコメントアウトしてください
//      sendMessage.send(req, [messageTemplate.textMessage(message), messageTemplate.quickMessage("質問に答えてね！")]);

      // // flexメッセージを使う
       var title = "質問";
       var imageUrl = "https://www.musicman-net.com/sites/default/files/2017-10/%E3%81%91%E3%82%82%E3%81%AE%E3%83%95%E3%83%AC%E3%83%B3%E3%82%B9%E3%82%99%E3%83%AD%E3%82%B3%E3%82%99.jpg";
       var choices = ["選択肢1", "選択肢2", "選択肢3", "選択肢4"];
       var answers = ["回答1", "回答2", "回答3", "回答4"];
//     sendMessage.send(req, [messageTemplate.customQuestionMessage(title, imageUrl, choices, answers)]);

      
        // データベースを使って返信する場合、こちらのコメントを解除してください
        databaseSample(req, message_text);
        return;
    }
  );
});

app.listen(app.get('port'), function() {
  console.log('Node app is running');
});

// 実際にデータベースとのやりとりを行う
function databaseSample(req, sendword) {

  // データベースにアクセスする
  pgManager.get_words(function(result) {

    if (result.rowCount === 0) {
      sendMessage.send(req, [messageTemplate.textMessage("データはありません")]);
      return;
    }

    // ランダムに一件データを取得する
    var randomId = getRandomInt(result.rowCount);
    var r = result.rows[randomId];
    // 全角数字を半角数字に変換
    sendword = number_em_en_replace(sendword);
    // 問題の答えを一件取得するためのID取得
    var question_id = Number(sendword.slice(2));
    var r_id = result.rows[question_id - 1];
    
    //「答え<数値>」の形で返信すると、IDと同じ問題の答えが表示される
    if (sendword.indexOf('答え') != -1 && isNaN(question_id) == false) {
        sendMessage.send(req, [messageTemplate.textMessage(r_id.correct)]);
        return;
    }

    // 送信データを生成し、送信する
    sendMessage.send(req, [
        messageTemplate.customQuestionMessage(
            r.id,
            r.question_text,
            r.imageurl,
            [r.choice1, r.choice2, r.choice3, r.choice4],
            [r.answer1, r.answer2, r.answer3, r.answer4]
        )        
    ]);

  });
  return;
}

// 引数に指定した値以下のランダムな数値を取得する
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// LINE Userのプロフィールを取得する
function getProfileOption(user_id) {
  return {
    url: 'https://api.line.me/v2/bot/profile/' + user_id,
    proxy: process.env.FIXIE_URL,
    json: true,
    headers: {
      'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}'
    }
  };
}

// 署名検証
function validate_signature(signature, body) {
  return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
}

// 全角数字を半角数字に変換
function number_em_en_replace(str) {
    return str = str.replace(/１/g, "1")
                    .replace(/２/g, "2")
                    .replace(/３/g, "3")
                    .replace(/４/g, "4")
                    .replace(/５/g, "5")
                    .replace(/６/g, "6")
                    .replace(/７/g, "7")
                    .replace(/８/g, "8")
                    .replace(/９/g, "9")
                    .replace(/０/g, "0");
}
