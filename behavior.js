
      function restoreFeed(){ 
        setInterval(getTweets, 1000)
        $tweetfeed.html('');
        for (var idx in tweetList){
          if (tweetList[idx].seen){
            var tweet = tweetList[idx];
            var tweetElement = createTweetElement(tweet);
            tweetElement.appendTo($tweetfeed);
            $('.tweet-feed').height(`${idx * 20}`);
          }
        }
      }

      function getTweets(){
        streams.home.forEach(function(tweet, idx){
          if (!tweet.hasOwnProperty("seen")){
            tweet.seen = false;
            tweet.index = idx;
            tweetList[idx] = tweet;
            postTweet(tweet)
          }
        })
      }

      function updateVisitedUsers(user){
        $('.visited').html('');
        visitedUsers.forEach(user => $('.visited').append(`<a href="#" onclick="showUserTweets('${user}')"> ${user} </a>`));
      }

      function showUserTweets(user){ // this is a nightmare, clean it up.
        visitedUsers.push(user);
        updateVisitedUsers(user);
        clearInterval(getTweets); 
        $tweetfeed.html('');
        var userTweets = getUserTweets(user);
        $tweetfeed.height(`${userTweets.length * 70}`)
        console.log(userTweets.length)
        userTweets.forEach(function(tweet){
          var tweetElement = createTweetElement(tweet);
          tweetElement.appendTo($tweetfeed);
        });
      }

      function getUserTweets(user){
        return streams.users[user];
      }

      function postTweet(tweet){
        tweet.seen = true;
        var tweetElement = createTweetElement(tweet);
        $('.tweet-feed').height(`${streams.home.length * 63}`);
        $tweetfeed.prepend(tweetElement); // use before here?
      }

      function getTime(creationTime){
        var currentTime = Date.now();
        var elapsed = currentTime - creationTime;
        return formatTime(elapsed)
      }

      function createTweetElement(tweet){
        var tweetElement = $(`<div><p><strong><a href="#" onclick="showUserTweets('${tweet.user}')">@${tweet.user}</strong></a> : ${tweet.message} : ${tweet.index} <br> Created ${getTime(tweet.created_at)} ago.</p></div>`);
        return tweetElement
      }

      function formatTime(seconds){
        if (seconds < 60) return `${seconds} seconds`
        var hr;
        var min;
        var str = [];
        while (seconds >= 3600){
          hr = parseInt(seconds / 3600);
          seconds = seconds % 3600;
        }
        while (seconds >= 60){
          min = parseInt(seconds / 60);
          seconds = seconds % 60;
        }
  
        [hr, min, seconds].forEach(function(timeElement, place){
          switch (place){
            case 0:
              if (timeElement == 1){
                str.push(`${timeElement} hour`)
              } else if (timeElement > 1) {
                str.push(`${timeElement} hours`)
              }
              break;
            case 1:
              if (timeElement == 1){
              str.push(`${timeElement} minute`)
              } else if (timeElement > 1){
                str.push(`${timeElement} minutes`)
              }
              break;
            case 2:
              if (timeElement == 1){
                str.push(`${timeElement} second`)
              } else if (timeElement > 1){
                str.push(`${timeElement} seconds`)
              }
              break;
          } 
        });
        return str.join(" ")
      }
      
      