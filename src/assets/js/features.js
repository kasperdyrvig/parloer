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