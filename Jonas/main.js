// Resources
var food = 0; // Food resource
var foodClickIncrement = 10; // Increment of food per click
var foodIncrement = 0;

var wood = 0; // Wood resource
var woodClickIncrement = 10; // Increment of wood per click
var woodIncrement = 0;
var woodAvailable = 0; // 1 if wood is available as a button, 2 if wood is available but the page was reloaded

// Buildings
var hutAmount = 0; // Amount of huts

// Achievements
// Wood achievements
var woodAchievements = [
[100,0,"Starter wood","Earned 100 wood."],
[1000,0,"Morning wood","Earned 1000 wood."],
[10000,0,"Advanced wood","Earned 10000 wood."]
];

// Array containing all other values
var allValues = [];

// When page is loaded check for cookies
checkCookie();
// Initiate the game
initiateGame();

// Main increment loop, updates everything each second
window.setInterval(function(){
    
    updateAll();
    showUpdates();
    setAllValuesCookie();
    
}, 1000);

// Update all the game variables
function updateAll() {
    updateResources();
    updateAchievements();
}

function initiateGame(){
    updateResourcesVariables();
    showUpdates();
    updateResources();
    updateAchievements();
}

// Update all the resources
function updateResources(){
    updateResourcesVariables();
    updateResourcesHTML();
}

// Update the resource variables
function updateResourcesVariables(){
    food += foodIncrement;
    wood += woodIncrement;
}

// Update the resource html visualization
function updateResourcesHTML(){
    document.getElementById("food").innerHTML = food;

    if(woodAvailable == 1 || woodAvailable == 2){
        document.getElementById("wood").innerHTML = wood;
    }
}

// Show updates based on progression
function showUpdates(){
    var button = document.getElementById("buttons").innerHTML;
    var resourceInfo = document.getElementById("resourceInfo").innerHTML;

    if (food >= 50 && (woodAvailable == 0 || woodAvailable == 2)) {

        if(woodAvailable == 0) {
            notification("Congratulations", "You have unlocked the ability to chop wood!");
        }

        button += "<div class='col-md-2 col-sm-2 col-md-offset-1 '>";
        button += "<div class='box1'>";
        button += "<button id='woodClick' onclick='woodClick()' class='btn btn-default btn-lg'>Wood</button>";
        button += "</div>";
        button += "</div>";

        resourceInfo += "<div class='col-md-2 col-sm-2 col-md-offset-1 '>";
        resourceInfo += "<div class='box1'>";
        resourceInfo += "<span class='li_heart'></span>";
        resourceInfo += "<h3 id='wood'>0</h3>";
        resourceInfo += "</div>";
        resourceInfo += "</div>";

        document.getElementById("buttons").innerHTML = button;
        document.getElementById("resourceInfo").innerHTML = resourceInfo;
        hutOption();
        woodAvailable = 1;
    }

}

// Updates the players achievements
function updateAchievements(){ 
    var achievements = document.getElementById("achievements").innerHTML;

    for (var achievement in woodAchievements){
        var woodAmount = woodAchievements[achievement][0];
        var unlocked = woodAchievements[achievement][1];
        var title = woodAchievements[achievement][2];
        var description = woodAchievements[achievement][3];

        if(wood >= woodAmount && (unlocked == 0 || unlocked == 2)){

            notification("Earned achievement!", "You earned the achievement "+title);

            achievements += "<div class='desc'>";
            achievements += "<div class='thumb'>";
            achievements += "<span class='badge bg-theme'><i class='fa fa-clock-o'></i></span>";
            achievements += "</div>";
            achievements += "<div class='details'>";
            achievements += "<p>";
            achievements += "<b> "+title+"</b><br/>";
            achievements += ""+description+"<br/>";
            achievements += "</p>";
            achievements += "</div>";
            achievements += "</div>";

            woodAchievements[achievement][1] = 1;
        }
    }

    document.getElementById("achievements").innerHTML = achievements;
}

// Food click option
function foodClick(){
    food += foodClickIncrement;
    document.getElementById("food").innerHTML = food;
}

// Wood click option
function woodClick(){
    wood += woodClickIncrement;
    document.getElementById("wood").innerHTML = wood;
}

// Adds hut option to screen 
function hutOption(){
    var buildings = document.getElementById("buildings").innerHTML;

    buildings += "<div class='col-md-2 col-sm-2 col-md-offset-1 '>";
    buildings += "<div class='box1'>";
    buildings += "<button id='buyHut' onclick='buyHut()' class='btn btn-default btn-lg'>Buy Hut</button>";
    buildings += "</div>";
    buildings += "<p id='hutCost'>Cost : 50/20</p>";
    buildings += "<p id='hut'>Huts : 0</p>";
    buildings += "</div>";

    document.getElementById("buildings").innerHTML = buildings;
}

// Add one hut to the game
function buyHut(){
    var hutCost = Math.floor(10 * Math.pow(1.1,hutAmount));
    var foodCost = 50; // temporarily hardcoded
    var woodCost = 20; // temporarily hardcoded

    if (food >= foodCost && wood >= woodCost) {
        hutAmount += 1;
        food = food - hutCost;
        document.getElementById("hut").innerHTML = "Huts : "+hutAmount;
        document.getElementById("food").innerHTML = Math.round(food - foodCost);
        document.getElementById("wood").innerHTML = Math.round(food - woodCost);
        document.getElementById('hutCost').innerHTML = "Cost : 50/20s";

        foodIncrement += 5; // temporarily hardcoded
        woodIncrement += 1; // temporarily hardcoded

    }else{
        notification("Not sufficient resources", "Try clicking some more!");
    }

}

// Set a cookie with specified name,value and days till expiration
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";"+expires +";";
}

// Returns the specified cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// Check if the cookies are available and if so restore variables
function checkCookie() {
    var user = getCookie("userinfo");
    var allValueCookie = getCookie("allValues");
    var jsonValue = JSON.stringify(allValues);

    if (user != "") {
        notification("Welcome again " + user, "Your last login was...");
        setAllVariables(allValueCookie);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("userinfo", user, 365);
            setCookie("allValues", jsonValue, 365);
            setPlayerName(user);
        }
    }
}

// Sets the player name
function setPlayerName(player){
    document.getElementById("player").innerHTML = player;
}

// Set the main allValuess cookie
function setAllValuesCookie(){
    var achievements = setAchievementsAvailability();
    allValues = [
        ["food", food],
        ["foodClickIncrement", foodClickIncrement],
        ["foodIncrement",foodIncrement],
        ["wood",wood],
        ["woodClickIncrement",woodClickIncrement],
        ["woodIncrement",woodIncrement],
        ["woodAvailable", 2],
        ["hutAmount", hutAmount],
        ["woodAchievements", achievements]
    ];
    var jsonValue = JSON.stringify(allValues);
    setCookie("allValues", jsonValue, 365);
}

// Set all resource/building/achievement etc. variables
function setAllVariables(variableArray){
    var tempArray = JSON.parse(variableArray);
    for (var variable in tempArray){
        window[tempArray[variable][0]] = tempArray[variable][1];
    }
}

// Set achievements to availablity 2
function setAchievementsAvailability(){
    var tempAchievements = deepCopy(woodAchievements);

    for (var tempAchievement in tempAchievements){
        if(tempAchievements[tempAchievement][1] == 1){
            tempAchievements[tempAchievement][1] = 2;
        }
    }
    return tempAchievements;
}

// Returns a copy of the specified object
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

// General notification
function notification(title, text){
    $(document).ready(function () {
        var unique_id = $.gritter.add({
            // (string | mandatory) the heading of the notification
            title: title,
            // (string | mandatory) the text inside the notification
            text: text,
            // (string | optional) the image to display on the left
            image: 'assets/img/ui-sam.jpg',
            // (bool | optional) if you want it to fade out on its own or just sit there
            sticky: false,
            // (int | optional) the time you want it to be alive for before fading out
            time: '',
            // (string | optional) the class name you want to apply to that specific message
            class_name: 'my-sticky-class'
        });

        return false;
    });
}