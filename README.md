# LINE_QUIZ_BOT

LINEのチャットに文字を入力すると、4沢形式のクイズが出題されるBOT

※X-HACK東京(https://x-hack.jp/) 主催の勉強会「LINE × DB クイズアプリを作ろう！」で制作したものです。

When you enter characters in LINE chat, you will be asked a quiz in 4 swamp format BOT

※It was produced at the study session "Let's make a LINE x DB quiz app!" Sponsored by X-HACK Tokyo(https://x-hack.jp/) .

# DEMO

![https___qiita-image-store s3 amazonaws com_0_120727_723b45e4-8e95-01a8-1722-c3568d8e3451](https://user-images.githubusercontent.com/12876144/114262374-908e3c80-9a1a-11eb-9f69-c7d5a653590f.gif)


# Release
![https___qiita-image-store s3 amazonaws com_0_120727_15dd0813-486f-f19e-8b2c-e2b48de3287d (1)](https://user-images.githubusercontent.com/12876144/114262825-18754600-9a1d-11eb-98d1-8225493856d4.png)


# Features

* LINEのチャットに何か適当に文字を入力してメッセージを送るとDBに登録してあるクイズからランダムに問題が出題されます。
* クイズは四択式になっていますので、正解だと思う答えにタップして回答します。
* 回答すると、メッセージを送った判定になるのでまたランダムに問題が出題されます。
<br>

* If you enter some characters in the LINE chat and send a message, questions will be randomly asked from the quiz registered in the DB.
* The quiz is a four-choice system, so tap the answer you think is correct to answer.
* If you answer, it will be judged that you sent the message, so questions will be asked at random again.


# Requirement
* heroku
* LINE Messaging API
* PostgresSQL
* Node.js


### Modification

* 新しい問題をDBに増やした
* 問題文を[<問題のID番号><.> + <問題文>]の形にして問題ごとのID番号がわかるようにしている
* DBに正解の答えであるcorrectカラムの追加
* ボタンをタップしたらサンプルでは「答え1〜4」と返信されますが、私は選択肢の答えそのままを返信することにより「何を答えたか」をわかりやすくした
* [「答え」 + <問題のID番号>]と入力することでその問題の答えを見れるようにした(以下の通り)
<br>

* Added new issues to DB
* The question text is in the form of [ "question ID number" "." + "Question text" ] so that the ID number for each question can be known.
* Add correct column to DB which is the correct answer
* If you tap the button, the sample will reply "Answer 1 to 4", but I made it easier to understand "what you answered" by replying the answer of the choice as it is
* You can see the answer to the question by typing [ "answer" + "question ID number" ] (as follows)

![https___qiita-image-store s3 amazonaws com_0_120727_58a482e5-c303-1967-160b-593d7e31cd72](https://user-images.githubusercontent.com/12876144/114262747-98e77700-9a1c-11eb-8001-634d555e6956.gif)


# article
https://qiita.com/dhiki1234/items/a4123220e2c3d157cb13


# Author
* Dhiki(Infrastructure engineer & Video contributor)
* https://twitter.com/DHIKI_pico


# License
ご自由に使用いただいて構いません。

Feel free to use it.
