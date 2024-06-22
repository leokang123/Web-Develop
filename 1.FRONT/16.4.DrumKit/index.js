// var numberOfButtons = document.querySelectorAll(".drum").length; 이거로 갯수를 저장할수 있음(for문에 활용)
document.querySelectorAll(".drum").forEach((header)=> {
    header.addEventListener("click", function () {
        // this는 해당 이벤트를 발생시킨 태그를 불러온다 
    var buttonInnerHtml = this.innerHTML;
    makeSound(buttonInnerHtml);
    buttonAnimation(buttonInnerHtml);
})});

// 따로 이벤트 리스너를 특정 객체에만 거는게 아니고 document전체에 이벤트를 대기하게끔 할수 있다 
// 이런경우 function(event) 와 같은 함수를 콜백함수라 부른다( keypress로 callback 되는 함수) 
document.addEventListener("keypress", function(event) {
    makeSound(event.key);
    buttonAnimation(event.key)
})

function makeSound(key) {
    var audio;
    switch(key) {
        case "w":
            audio = new Audio("sounds/crash.mp3");
            break;
        case "a":
            audio = new Audio("sounds/kick-bass.mp3");
            break;
        case "s":
            audio = new Audio("sounds/snare.mp3");
            break;
        case "d":
            audio = new Audio("sounds/tom-1.mp3");
            break;
        case "j":
            audio = new Audio("sounds/tom-2.mp3");
            break;
        case "k":
            audio = new Audio("sounds/tom-3.mp3");
            break;
        case "l":
            audio = new Audio("sounds/tom-4.mp3");
            break;
        default: 
            console.log(key);
    }
    audio.play();
}

function buttonAnimation(currentKey) {
    var activeButton = document.querySelector("." + currentKey);
    activeButton.classList.add("pressed");

    setTimeout(function () {
        activeButton.classList.remove("pressed")
    }, 100);
}