var gamePattern = [];
var userClickPattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];
var level = 0;
var start = 0;

$(document).on("keypress", function() {
    if(!start) {
        start = 1;
        nextSequence();
    }
});

$(".btn").on("click", function() {
    var userChosenColor = $(this).attr("id");
    animatePress(userChosenColor);
    userClickPattern.push(userChosenColor);
    playSound(userChosenColor);
    checkAnswer(userClickPattern.length - 1);
});

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function nextSequence() {
    userClickPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    $("#" + randomChosenColor).fadeOut(100).fadeIn(100);  
    playSound(randomChosenColor);
}

function startOver() {
    start = 0;
    level = 0;
    gamePattern = [];

}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] == userClickPattern[currentLevel]) {
        console.log("success");
        if (userClickPattern.length == gamePattern.length) {
            setTimeout(function() {
                nextSequence()
            }, 1000);
        }
    }
    else {
        console.log("wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}
