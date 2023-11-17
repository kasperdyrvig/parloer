//Navigate back in app
function goBack() {
    window.history.back();
}

var menuEl = document.getElementById("app-menu");
let userSettingPlaySpeed = 1;
let audioContext;
let track;
let audioElement;
let activeItem;

document.getElementById("app-menu").addEventListener("click", function () {
    toggleMenu();
});

function toggleMenu() {
    menuEl.classList.toggle("open");
    if(menuEl.inert) {
        menuEl.inert = false;
        document.querySelector("header").inert = true;
        document.querySelector("main").inert = true;
        document.getElementById("appMenuToggle").focus();
    } else {
        menuEl.inert = true;
        document.querySelector("header").inert = false;
        document.querySelector("main").inert = false;
        
    }
}

document.querySelectorAll(".dropdown-trigger").forEach(dropdown => {
    dropdown.addEventListener("click", () => {
        const dropdownContent = dropdown.nextElementSibling;
        if(dropdownContent.hidden) {
            dropdownContent.hidden = false;
            dropdown.setAttribute("aria-expanded", true);
        } else {
            dropdownContent.hidden = true;
            dropdown.setAttribute("aria-expanded", false);
        }
    });
});

function setPlaybackRate(input) {
    userSettingPlaySpeed = input.value;
}

function toast(message) {
  var x = document.getElementById("snackbar");
  x.innerText = message;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

//F2 keyboard shortcut
document.addEventListener("keydown", function(event) {
    if(event.key == "F2") {
    window.location.assign(window.location.href + "?alttemplate=grouptabledata");
    }
});

//Bottomsheet
function toggleBottomsheet(bsId) {
    const bs = document.getElementById(bsId);
    if(bs != null) {
        bs.classList.toggle("open");
    }
    
    bs.addEventListener("click", function () {
        toggleBottomsheet(bsId);
    });
}


//Play phrases
document.querySelectorAll(".word-play").forEach(item => {
    item.addEventListener("click", event => {
        activeItem = item.parentElement.parentElement;
        audioElement = activeItem.querySelector("audio");
        audioElement.playbackRate = userSettingPlaySpeed;
        const playButton = item;
        
        //Initiate audio context (web audio api)
        /*if(!audioContext) {
            initAudio();
        }
        
        //Activate audio context
        if(audioContext.state === "suspended") {
            audioContect.resume();
        }*/
        
        //If not playing, play
        if (playButton.dataset.playing === "false") {
            audioElement.play();
            playButton.dataset.playing = "true";
        }
    });
});

//When audio is done, reset playing state
document.querySelectorAll("audio").forEach(audioItem => {
    audioItem.addEventListener("ended", () => {
        const playButton = document.querySelector("button.play-button[data-playing=true]");
        playButton.dataset.playing = "false";
    });
}, false);

//Initialize Web Audio API
function initAudio() {
    audioContext = new AudioContext();
    track = new MediaElementAudioSourceNode(audioContext, {
        mediaElement: audioElement,
    });
    track.connect(audioContext.destination);
}

//Copy feature
document.querySelectorAll(".word-copy").forEach(item => {
    item.addEventListener("click", event => {
        var phrase = item.parentElement.parentElement;
        var klText = phrase.querySelector(".word-greenlandic");

        navigator.clipboard.writeText(klText.innerText)
            .then(() => {
                console.log("Tekst kopieret.");
                toast("Tekst kopieret");
            })
            .catch(err => {
                alert("Kunne ikke kopiere tekst.");
            });
    });
});

//Favorite feature
document.querySelectorAll(".word-star").forEach(item => {
    item.addEventListener("click", event => {
        var phrase = item.parentElement.parentElement;
        if(phrase.classList.contains("word--is-favorite")) {
            if(removeFromFavroites(phrase.id)) {
                phrase.classList.remove("word--is-favorite");
            }
        } else {
            if(addToFavorites(phrase.id)) {
                phrase.classList.add("word--is-favorite");
            }
        }
    });
});

function resetFavorites() {
    document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    location.reload();
}

function removeFromFavroites(removeValue) {
    const values = getCookie().split(",");
    if(values.includes(removeValue)) {
        values.splice(values.indexOf(removeValue), 1);
        const d = new Date();
        d.setTime(d.getTime() + (100*24*60*60*1000));
        let cExpire = "expires="+ d.toUTCString();
        document.cookie = "favorites=" + values + ";" + cExpire + ";path=/";
        return true;
    } else {
        console.log("Already not a favorite");
        return false;
    }
}

function addToFavorites(newValue) {
    const oldValues = getCookie();
    const values = (oldValues != null ? oldValues.split(",") : []);
    if(values.includes(newValue)) {
        console.log("Already a favorite");
        return false;
    } else {
        values.push(newValue);
        const d = new Date();
        d.setTime(d.getTime() + (100*24*60*60*1000));
        let cExpire = "expires="+ d.toUTCString();
        document.cookie = "favorites=" + values + ";" + cExpire + ";path=/";
        return true;
    }
}

//Check favorite status
function checkFavoriteStatus() {
    const oldValues = getCookie();
    const values = (oldValues != null ? oldValues.split(",") : []);
    document.querySelectorAll(".word-item").forEach(item => {
        if(values.includes(item.id)) {
            item.classList.add("word--is-favorite");
        }
    });
}

function getCookie() {
    let name = "favorites=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

//Video quiz
if(document.querySelector(".videoQuizContainer") !== null) {
    let videoPlayer = document.getElementById("videoPlayer");
    let quizWrap = document.querySelector(".videoQuizContainer");
    let quizAnswers = document.querySelectorAll(".videoQuizAnswersGroup");
    var stopIndex = 0;
    
    //Gather timestaps from markup
    const times = [];
    quizAnswers.forEach(timeItem => {
        times.push(timeItem.getAttribute("data-timecode"));
        for (var x = timeItem.children.length; x >= 0; x--) {
            timeItem.appendChild(timeItem.children[Math.random() * x | 0]);
        }
    });
    
    videoPlayer.ontimeupdate = function() {
        if (Math.floor(videoPlayer.currentTime) == times[stopIndex]) {
            videoPlayer.pause();
            console.log("Paused at " + videoPlayer.currentTime);
            
            if(stopIndex === 0) {
                quizWrap.style.display = null;
            }
            
            var answerBlock = document.getElementById(stopIndex);
            answerBlock.style.display = "block";
            console.log(stopIndex);
            
            answerClicks();
        }
    };
    
    videoPlayer.onended = function () {
        quizWrap.style.display = "none";
    };
    
    function answerClicks() {
        var answerBlock = document.getElementById(stopIndex);
        answerBlock.querySelectorAll(".word-item").forEach(element => {
            element.addEventListener("click", function() {
                if(element.id == (stopIndex + "0")) {
                    element.classList.add("quiz-correct");
                    stopIndex++;
                    setTimeout(function () {
                        element.classList.remove("quiz-correct");
                        answerBlock.style.display = "none";
                        videoPlayer.play();
                        console.log(stopIndex);
                    }, 1000);
                } else {
                    element.classList.add("quiz-wrong");
                    setTimeout(function () {
                        element.classList.remove("quiz-wrong");
                    }, 1000);
                }
            });
        });
    }
}

//Flashcard game
var cardIndex = 0;
var scoreCorrect = 0;

if(document.querySelector(".flashcard-container") !== null) {
    let answerEl = document.querySelector(".flashcard-footer");
    let cards = document.querySelectorAll(".flashcard-card");
    
    cardIndex = 0;
    scoreCorrect = 0;
    
    if (cardIndex === 0) {
        cards[0].classList.add("active");
        answerEl.style.display = null;
    }
}

function showAnswer() {
    let answerEl = document.querySelector(".flashcard-footer");
    let resultBtnEl = document.querySelector(".flashcard-footer-result");
    let cards = document.querySelectorAll(".flashcard-card");
    
    answerEl.style.display = "none";
    resultBtnEl.style.display = null;
    cards[cardIndex].classList.add("show-answer");
}

function correctAnswer() {
    scoreCorrect++;
    nextCard();
}

function wrongAnswer() {
    nextCard();
}

function nextCard() {
    let cards = document.querySelectorAll(".flashcard-card");
    var totalCards = cards.length;
    let answerEl = document.querySelector(".flashcard-footer");
    let resultBtnEl = document.querySelector(".flashcard-footer-result");
    
    cards[cardIndex].classList.remove("active");
    cardIndex++;
    if(cardIndex == totalCards) {
        let finalLinkEl = document.querySelector(".flashcard-footer-final");
        let scoreEl = document.getElementById("score");
        let resultEl = document.querySelector(".flashcard-result");
        
        resultBtnEl.style.display = "none";
        console.log("Final score: " + scoreCorrect + " currect out of " + totalCards);
        scoreEl.innerText = scoreCorrect;
        resultEl.style.display = null;
        finalLinkEl.style.display = null;
    } else {
        answerEl.style.display = null;
        resultBtnEl.style.display = "none";
        if(Math.random(0, 1) >= 0.5) {
            cards[cardIndex].classList.add("flipped");
        }
        cards[cardIndex].classList.add("active");
    }
}

function flashcardPlay() {
    activeItem = document.querySelector(".flashcard-card.active");
    audioElement = activeItem.querySelector("audio");
    audioElement.playbackRate = userSettingPlaySpeed;
    const playButton = activeItem.querySelector("button.play-button");
    
    //Initiate audio context (web audio api)
    /*if(!audioContext) {
        initAudio();
    }
    
    //Activate audio context
    if(audioContext.state === "suspended") {
        audioContect.resume();
    }*/
    
    //If not playing, play
    if (playButton.dataset.playing === "false") {
        audioElement.play();
        playButton.dataset.playing = "true";
    }
}


//Dictation game
function startDictationGame() {
    cardIndex = 0; //Reuse from Flashcard game
    scoreCorrect = 0; //Reuse from Flashcard game
    
    const gamestart = document.querySelector(".gamestart");
    const gamearea = document.querySelector(".gamearea");
    
    gamestart.remove();
    gamearea.classList.remove("hidden");
    
    nextDictationCard();
}

function playDictation() {
    activeItem = document.querySelector(".dictation-card.active");
    audioElement = activeItem.querySelector("audio");
    audioElement.playbackRate = userSettingPlaySpeed;
    const playButton = activeItem.querySelector("button.play-button");
    
    //Initiate audio context (web audio api)
    /*if(!audioContext) {
        initAudio();
    }
    
    //Activate audio context
    if(audioContext.state === "suspended") {
        audioContect.resume();
    }*/
    
    //If not playing, play
    if (playButton.dataset.playing === "false") {
        audioElement.play();
        playButton.dataset.playing = "true";
    }
    
    activeCard.querySelector("textarea").focus();
}

function checkDicationAnswer() {
    const activeCard = document.querySelector(".dictation-card.active");
    const activeButton = activeCard.querySelector(".button");
    const responseRight = document.querySelector(".response#right");
    const responseWrong = document.querySelector(".response#wrong");
    const dictationInput = activeCard.querySelector("textarea").value;
    const validationInput = activeCard.querySelector("input").value;
    const resultTable = document.getElementById("resultlist");
    
    const dictationInputClean = dictationInput.trim().toLowerCase().replace(".", "").replace(",", "").replace("?", "").replace("_", "").replace("-", "");
    const validationInputClean = validationInput.trim().toLowerCase().replace(".", "").replace(",", "").replace("?", "").replace("_", "").replace("-", "");
    
    if(dictationInputClean == validationInputClean) {
        scoreCorrect++;
        responseRight.classList.add("open");
    } else {
        responseWrong.classList.add("open");
        responseWrong.querySelector("strong").innerHTML = validationInput;
        
        // Add wrong answers to table of results
        var row = resultTable.insertRow(resultTable.rows.length);
        var rightCell = row.insertCell(0);
        var wrongCell = row.insertCell(1);
        rightCell.innerHTML = validationInputClean;
        wrongCell.innerHTML = dictationInputClean;
    }
}

function nextDictationCard() {
    const cards = document.querySelectorAll(".dictation-card");
    const responseRight = document.querySelector(".response#right");
    const responseWrong = document.querySelector(".response#wrong");
    const resultTable = document.getElementById("resultlist");
    responseRight.classList.remove("open");
    responseWrong.classList.remove("open");
    
    if(cardIndex < cards.length) {
        //Activate next card
        if(cardIndex > 0) {
            const activeCard = document.querySelector(".dictation-card.active");
            activeCard.classList.remove("active");
        }
        cards[cardIndex].classList.add("active");
        cardIndex++
        
        //Update meter element
        const progressEl = document.getElementById("gameprogress");
        progressEl.value = cardIndex.toString();
        
        playDictation();
        
        //Focus input
        cards[cardIndex].querySelector("textarea").focus();
    } else {
        //Game over; show results
        const gamearea = document.querySelector(".gamearea");
        const gameend = document.querySelector(".gameend");
        
        gamearea.remove();
        gameend.classList.remove("hidden");
        
        const finalScore = gameend.querySelector(".gameend-score");
        finalScore.innerText = finalScore.innerText.toString().replace("X", score);
        
        //If all answers was correct, remove the result table
        if(resultTable.rows.length == 1) {
            resultTable.remove();
        }
    }
}
