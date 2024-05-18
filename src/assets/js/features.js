let userSettingPlaySpeed = 1;

function setPlaybackRate(input) {
    userSettingPlaySpeed = input.value;
}

//Listen for clicks on play buttons
document.querySelectorAll("button.play-button").forEach(playButton => {
    playButton.addEventListener("click", event => {
        const audioElement = playButton.parentElement.parentElement.querySelector("audio");
        audioElement.playbackRate = userSettingPlaySpeed;
        if (playButton.dataset.playing === "false") {
            audioElement.play();
            playButton.dataset.playing = "true";
        }
    });
});

//When audio is done, reset playing state
document.querySelectorAll("audio").forEach(audioElement => {
    audioElement.addEventListener("ended", () => {
        const playButton = audioElement.parentElement.querySelector("button.play-button");
        playButton.dataset.playing = "false";
    });
}, false);

//Copy phrase
document.querySelectorAll("button.copy-button").forEach(copyButton => {
    copyButton.addEventListener("click", event => {
        const phrase = copyButton.parentElement.parentElement.querySelector(".phrase-greenlandic").innerText;
        if (phrase.length > 0) {
            navigator.clipboard.writeText(phrase).then(() => {
                console.log("Copied text");
            }).catch(err => {
                console.log("Could not copy text");
            });
        }
    });
});

//Listen for tabs
document.querySelectorAll("button[data-toggle=tab]").forEach(tabButton => {
    tabButton.addEventListener("click", event => {
        const previousPane = document.querySelector(".tab-content .tab-pane.active");
        previousPane.classList.remove("active");
        
        const previousTab = tabButton.parentElement.parentElement.querySelector(".active");
        previousTab.ariaSelected = "false";
        previousTab.classList.remove("active");
        
        tabButton.ariaSelected = "true";
        tabButton.classList.add("active");

        const targetPane = document.getElementById(tabButton.dataset.target);
        targetPane.classList.add("active");
    });
});

//Add to favorites
document.querySelectorAll("button.favorite-button").forEach(favoriteButton => {
    favoriteButton.addEventListener("click", event => {
        //Get phrase item from DOM and store in variables
        const phraseItem = favoriteButton.parentElement.parentElement;
        let phraseId, phraseGreenlandic, phraseDanish, phraseNote, phraseImage, phraseEmoji, phraseAudio;
        if(phraseItem.hasAttribute("id")) {
            phraseId = phraseItem.id;
        }
        if(phraseItem.querySelector(".phrase-danish") != null) {
            phraseDanish = phraseItem.querySelector(".phrase-danish").innerText;
        }
        if(phraseItem.querySelector(".phrase-note") != null) {
            phraseNote = phraseItem.querySelector(".phrase-note").innerText;
        }
        if(phraseItem.querySelector(".phrase-greenlandic") != null) {
            phraseGreenlandic = phraseItem.querySelector(".phrase-greenlandic").innerText;
        }
        if(phraseItem.querySelector("audio") != null) {
            phraseAudio = phraseItem.querySelector("audio").src;
        }
        if(phraseItem.querySelector(".phrase-image") != null) {
            phraseImage = phraseItem.querySelector(".phrase-image > img").src;
        }
        if(phraseItem.querySelector(".phrase-emoji") != null) {
            phraseEmoji = phraseItem.querySelector(".phrase-emoji").innerText;
        }

        if(window.localStorage){
            //Get existing favorites (or create a new set)
            let favoriteArray = [];
            let alreadyAdded = -1;
            if(localStorage.getItem("favorites") == null) {
                localStorage.setItem("favorites", JSON.stringify(favoriteArray));
            }
            favoriteArray = JSON.parse(localStorage.getItem("favorites"));

            //Check if the selected item already exists in the favorites
            for (let index = 0; index < favoriteArray.length; index++) {
                if(favoriteArray[index].id == phraseId) {
                    alreadyAdded = index;
                    break;
                }
            }

            //Add the new item
            if(alreadyAdded == -1) {
                const newItem = {
                    id: phraseId, 
                    greenlandic: phraseGreenlandic, 
                    danish: phraseDanish, 
                    note: phraseNote,
                    audio: phraseAudio,
                    image: phraseImage,
                    emoji: phraseEmoji
                };
                favoriteArray.push(newItem);
                phraseItem.classList.add("is-favorite");
            } else {
                //Or, remove the existing item
                favoriteArray.splice(alreadyAdded, 1);
                phraseItem.classList.remove("is-favorite");
            }

            //Save favorites
            localStorage.setItem("favorites", JSON.stringify(favoriteArray));
        }
    });
});

//Clear favorites
function clearFavorites() {
    if(window.confirm("Er du sikker på at du vil fjerne alle dine favoritter?")) {
        localStorage.removeItem("favorites");
        if(document.getElementById("favorites-list") != null) {
            document.getElementById("favorites-list").remove();
        }
    }
}


//Show lessons completed in list
document.querySelectorAll(".lessonList > a").forEach(lessonLink => {
    const lessonNo = lessonLink.dataset.lessonnumber;
    console.log(lessonLink.dataset.lessonnumber);
    let currentLesson = -1;
    if(window.localStorage){
        //Get existing lesson dates
        let lessonDateArray = [];
        lessonDateArray = JSON.parse(localStorage.getItem("lessons"));

        //Find current lesson
        for (let index = 0; index < lessonDateArray.length; index++) {
            if(lessonDateArray[index].number == lessonNo) {
                currentLesson = index;
                break;
            }
        }

        if (currentLesson > -1) {
            lessonLink.classList.add("lessonCompleted");
        }
    }
});


//Show lesson completed date
document.querySelectorAll("#completedDate").forEach(lessonDateViewer => {
    const lessonNo = document.querySelector("#lesson").value;
    let currentLesson = -1;
    if(window.localStorage){
        //Get existing lesson dates
        let lessonDateArray = [];
        lessonDateArray = JSON.parse(localStorage.getItem("lessons"));

        //Find current lesson
        for (let index = 0; index < lessonDateArray.length; index++) {
            if(lessonDateArray[index].number == lessonNo) {
                currentLesson = index;
                break;
            }
        }

        if (currentLesson > -1) {
            lessonDateViewer.value = lessonDateArray[currentLesson].date;
        }
    }
});

//Store lesson completed
document.querySelector("#completedDate").addEventListener("change", function() {
    const lessonDate = this.value;
    const lessonNo = document.querySelector("#lesson").value;
    console.log(lessonNo, lessonDate);

    if(window.localStorage){
        //Get existing favorites (or create a new set)
        let lessonDateArray = [];
        let alreadyAdded = -1;
        if(localStorage.getItem("lessons") == null) {
            localStorage.setItem("lessons", JSON.stringify(lessonDateArray));
        }
        lessonDateArray = JSON.parse(localStorage.getItem("lessons"));

        //Check if the selected item already exists in the lessonDateArray
        for (let index = 0; index < lessonDateArray.length; index++) {
            if(lessonDateArray[index].number == lessonNo) {
                alreadyAdded = index;
                break;
            }
        }
        
        //Remove if added earlier
        if(alreadyAdded != -1) {
            lessonDateArray.splice(alreadyAdded, 1);
        }

        //Add the new item
        const newItem = {
            number: lessonNo, 
            date: lessonDate
        };
        lessonDateArray.push(newItem);

        //Save favorites
        localStorage.setItem("lessons", JSON.stringify(lessonDateArray));
    }

});