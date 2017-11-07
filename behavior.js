function setUser(){
  window.visitor = prompt("Please enter your username: ")
  if (streams.users.hasOwnProperty(visitor)){
  	window.visitor = prompt("Sorry, that username is already taken. Please provide an alternative: ")
  }
  $('#username').html(`<a href="#" onclick="showUserTweets('${visitor}')">${visitor}</a>`)
}

function cleanTweetFeed(){
  $tweetfeed.children().remove();
  $tweetfeed.html('');
}

function restoreFeed(){  
  $currentView.html('Tweets by all users.') 
  cleanTweetFeed();
  showUptoIndex(feedLength);
  $('#restoreButton').css('visibility', 'hidden');
  update = setInterval(getTweets, 3000);
}

function getTweets(){
  $tweetfeed.children().remove()
  showUptoIndex(feedLength);
}

function updateVisitedUsers(user){
  if (!visitedUsers.includes(user) && user != visitor){
    visitedUsers.push(user);
    $('.usersVisited').children().remove();
    visitedUsers.forEach(user => $('.usersVisited').append(`<a href="#" onclick="showUserTweets('${user}')"> @${user} </a><br>`));
  }
}

function getTweetsByTag(tag){
  var taggedTweets = [];
  streams.home.forEach(function(tweet){
    if (tweet.tag === tag){
      taggedTweets.push(tweet);
    }
  })
  return taggedTweets
}

function updateVisitedTags(tag){
  if (!visitedKeywords.includes(tag)){
    visitedKeywords.push(tag);
    $('.keywordsVisited').children().remove();
    visitedKeywords.forEach(function(tag){
      $('.keywordsVisited').append(`<a href="#" onclick="showTweetsByTag('${tag}')"> ${tag} </a><br>`);
    })
  }
} 
function showTweetsByTag(tag){
  $currentView.html(`All tweets with ${tag} tag.`)
  updateVisitedTags(tag);
  clearInterval(update); 
  cleanTweetFeed();
  var taggedTweetsFound = getTweetsByTag(tag);
  taggedTweetsFound.forEach(function(tweet, index){
    var tweetElement = createTweetElement(tweet, index);
    tweetElement.appendTo($tweetfeed);
  });
  $('#restoreButton').css('visibility', 'visible')
}
 
function showUserTweets(user){ 
  $currentView.html(`All tweets by @${user}`);
  updateVisitedUsers(user);
  clearInterval(update); 
  cleanTweetFeed();
  if (getUserTweets(user) === undefined){
    $tweetfeed.html(`@${user} doesn't currently have any tweets to display.`)
    $('#restoreButton').css('visibility', 'visible');
  } else {
    var userTweets = getUserTweets(user);
    userTweets.forEach(function(tweet, index){
      var tweetElement = createTweetElement(tweet, index);
      tweetElement.appendTo($tweetfeed);
    });
    $('#restoreButton').css('visibility', 'visible');
  }
}

function getUserTweets(user){
  return streams.users[user];
}

 function postTweet(tweet){
  var tweetElement = createTweetElement(tweet);
  $tweetfeed.prepend(tweetElement);
}


function showUptoIndex(index){
  $tweetfeed.children().remove();
  streams.home.forEach(function(tweet, idx){
    tweet.index = idx
    if (tweet.index  > streams.home.length - 11){
      postTweet(tweet)
    }
  });
}

function createTweetElement(tweet, idx){
  var parity = idx || tweet.index
  if (parity % 2 === 0){
    if (tweet.tag){
      var tag = tweet.message.split(" ")[tweet.message.split(" ").length - 1];
      var tweetElement = $(`<div class="even"><p><strong><a href="#" onclick="showUserTweets('${tweet.user}')">@${tweet.user}</strong></a> : <a href="#" onclick = "showTweetsByTag('${tag}')"> ${tweet.message}</a> <br> Created ${getTime(tweet.created_at)} ago.</p></div>`);   
    } else {
      var tweetElement = $(`<div class="even"><p><strong><a href="#" onclick="showUserTweets('${tweet.user}')">@${tweet.user}</strong></a> : ${tweet.message} <br> Created ${getTime(tweet.created_at)} ago.</p></div>`);
    }
  } else {
    if (tweet.tag){
      var tag = tweet.message.split(" ")[tweet.message.split(" ").length - 1];
      var tweetElement = $(`<div class="odd"><p><strong><a href="#" onclick="showUserTweets('${tweet.user}')">@${tweet.user}</strong></a> : <a href="#" onclick = "showTweetsByTag('${tag}')"> ${tweet.message}</a> <br> Created ${getTime(tweet.created_at)} ago.</p></div>`);   
    } else {
    var tweetElement = $(`<div class="odd"><p><strong><a href="#" onclick="showUserTweets('${tweet.user}')">@${tweet.user}</strong></a> : ${tweet.message} <br> Created ${getTime(tweet.created_at)} ago.</p></div>`);
    }
  }
  return tweetElement
}

function getTime(creationTime){
  var currentTime = Date.now();
  var elapsed = currentTime - creationTime;
  return formatTime(parseInt(elapsed / 1000))
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
      
      