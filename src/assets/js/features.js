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
            let alreadyAdded = false;
            if(localStorage.getItem("favorites") == null) {
                localStorage.setItem("favorites", JSON.stringify(favoriteArray));
            }
            favoriteArray = JSON.parse(localStorage.getItem("favorites"));

            //Check if the selected item already exists in the favorites
            for (let index = 0; index < favoriteArray.length; index++) {
                if(favoriteArray[index].id == phraseId) {
                    alreadyAdded = true;
                    break;
                }
            }
            
            //Add the new item
            if(!alreadyAdded) {
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
                localStorage.setItem("favorites", JSON.stringify(favoriteArray));
            }
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