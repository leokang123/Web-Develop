
$("h1").on("click",function() {
    $("h1").css("color", "purple");
});

$("button").on("click",function(event) {
    $("h1").slideUp().slideDown().animate({opacity: 0.5, margin: "20%"});
})