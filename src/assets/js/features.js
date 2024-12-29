let userSettingPlaySpeed = 1;

function setPlaybackRate(input) {
    userSettingPlaySpeed = input.value;
}

//Listen for clicks on play buttons
document.querySelectorAll(".audio > button.play-button").forEach(playButton => {
    playButton.addEventListener("click", event => {
        const audioElement = playButton.closest("div").querySelector("audio");
        audioElement.playbackRate = userSettingPlaySpeed;
        if (audioElement.paused) {
            audioElement.play();
            playButton.dataset.playing = "true";
        }
    });
});

//Listen for playback request in phrases
document.querySelectorAll(".phrase-body:has(.play-button)").forEach(phraseBody => {
    phraseBody.addEventListener("click", event => {
        const playButton = phraseBody.closest(".phrase-item").querySelector(".play-button");
        const audioElement = phraseBody.closest(".phrase-item").querySelector("audio");
        audioElement.playbackRate = userSettingPlaySpeed;
        if (audioElement.paused) {
            audioElement.play();
            playButton.dataset.playing = "true";
        }
    });
});

//When audio is done, reset playing state
document.querySelectorAll("audio").forEach(audioElement => {
    audioElement.addEventListener("ended", () => {
        const playButton = audioElement.closest("div").querySelector("button.play-button");
        playButton.dataset.playing = "false";
    });
}, false);

//Copy phrase
document.querySelectorAll("button.copy-button").forEach(copyButton => {
    copyButton.addEventListener("click", event => {
        const phrase = copyButton.closest(".phrase-item").querySelector(".phrase-greenlandic").innerText;
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

// Reset stored excercise
function resetExercise(exerciseId) {
    exerciseId = exerciseId.replace("homework-", "").replace("oral-", "")
    localStorage.removeItem(exerciseId + "-step");
    localStorage.removeItem(exerciseId);
    localStorage.removeItem(exerciseId + "-output");
    return true;
}

// Remove all localstorage
function clearData() {
    if (confirm("Er du sikker på at du vil slette alle dine data fra Parlør-appen?")) {
        localStorage.clear();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (!window.localStorage) {
        return;
    }

    // Storing and showing lessons completed
    const lessonDateObject = JSON.parse(localStorage.getItem("lessons")) || {};

    // Show lessons completed in list
    document.querySelectorAll(".lessonList > a").forEach(lessonLink => {
        const lessonNo = lessonLink.dataset.lessonnumber;

        // Check if the lesson number exists in the stored lessons
        if (lessonDateObject.hasOwnProperty(lessonNo)) {
            lessonLink.classList.add("lessonCompleted");
        }
    });

    // Store lesson completed
    const completedDateElement = document.querySelector("#completedDate");
    const lessonElement = document.querySelector("#lesson");

    // Check if elements exist before adding event listeners
    if (completedDateElement && lessonElement) {
        const lessonNo = lessonElement.value;

        completedDateElement.addEventListener("change", function() {
            const lessonDate = this.value;

            // Add or update the lesson
            lessonDateObject[lessonNo] = lessonDate;

            // Save updated lessons
            localStorage.setItem("lessons", JSON.stringify(lessonDateObject));
        });

        // Show date if lesson is already completed
        if (lessonDateObject.hasOwnProperty(lessonNo)) {
            completedDateElement.value = lessonDateObject[lessonNo];
        }
    }

    // Store homework marked as done
    const homeworkCheckboxes = document.querySelectorAll(".homework-check");
    const progressBar = document.getElementById("homework-progress");

    // Update progress bar
    function updateProgress() {
        const total = homeworkCheckboxes.length;
        const completed = Array.from(homeworkCheckboxes).filter(checkbox => checkbox.checked).length;
        const percentage = Math.round((completed / total) * 100);
        progressBar.ariaValueNow = completed;
        progressBar.querySelector(".progress-bar").style.width = `${percentage}%`;
    }

    // Load saved progress from local storage
    homeworkCheckboxes.forEach((checkbox) => {
        const isChecked = localStorage.getItem(checkbox.id) === "true";
        checkbox.checked = isChecked;
    });

    // Initial update of progress bar
    if (progressBar) updateProgress();

    // Save progress to local storage when checkbox state changes
    homeworkCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            localStorage.setItem(event.target.id, event.target.checked);
            updateProgress();
        });
    });

    // Check if already started
    const homeworkItems = document.querySelectorAll(".homework-item");
    homeworkItems.forEach(item => {
        const homeworkId = item.querySelector(".homework-check").id;
        if (localStorage.getItem(homeworkId.replace("homework-", "") + "-step") !== null) {
            const buttons = item.querySelectorAll(".btn");
            buttons.forEach(button => {
                button.classList.contains("hidden") ? button.classList.remove("hidden") : button.classList.add("hidden");
            });
        }
    });
});
