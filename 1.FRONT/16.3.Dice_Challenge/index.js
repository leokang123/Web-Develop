var p1 = Math.floor(Math.random() * 6) + 1;
var p2 = Math.floor(Math.random() * 6) + 1;
var string1 = "images/dice" + p1 + ".png";
var string2 = "images/dice" + p2 + ".png";
var header = document.querySelector("h1");
document.querySelector(".img1").setAttribute("src",string1);
document.querySelector(".img2").setAttribute("src",string2);

if(p1 > p2) {
    header.innerHTML = "🚩Player 1 wins!";
}
else if(p1 < p2) {
    header.innerHTML = "Player 2 wins!🚩";
}
else {
    header.innerHTML = "Draw !";
}