let itemIndex = 0;
let score = 0;
let maxScore = 0;
let firstCard, secondCard, startTimer, endTimer, pairsTotal;
let hasFlippedCard = false;
let lockBoard = false;
const submitBtn = document.querySelector("button[type=submit]");
const exerciseId = document.querySelector("#exercise > .gamepanel-body").id;

function startExercise() {
    document.getElementById("start").classList.add("hidden");
    document.getElementById("exercise").classList.remove("hidden");
    nextExerciseItem();
}

function endExercise() {
    document.getElementById("exercise").classList.add("hidden");
    document.getElementById("finish").classList.remove("hidden");
    clearLocalStorage();

    //Save as complete
    localStorage.setItem(document.querySelector("#exercise > .gamepanel-body").dataset.parentId, true);
    
    //Prepare email to send
    const output = document.getElementById("resultContainer").value + "\n" + document.querySelector(".gameend-score").innerText;
    const emailLink = document.getElementById("shareResult");
    const pathArray = window.location.pathname.split('/');
    emailLink.setAttribute("href", "mailto:paasiviuk@gmail.com?subject=" + pathArray[pathArray.length - 2] + "&body=" + encodeURIComponent(output));
}

function nextExerciseItem() {
    const output = document.getElementById("resultContainer");
    
    //Reset all responses
    document.querySelectorAll(".response.open").forEach(openResponse => {
        openResponse.classList.remove("open");
    });
    
    //Get all exercise items
    const exerciseItems = document.querySelectorAll(".exercise-item");
    
    if(itemIndex < exerciseItems.length) {
        //Hide previous item (if not the first item)
        if(itemIndex > 0) {
            try {
                const activeExerciseItem = document.querySelector(".exercise-item.active");
                activeExerciseItem.classList.remove("active");
            } catch (error) { /*Ignore*/ }
        }
        
        //Save what is the current step
        localStorage.setItem(exerciseId + "-step", itemIndex);

        //Display next item
        exerciseItems[itemIndex].classList.add("active");
        if(exerciseItems[itemIndex].querySelector("form") !== null) {
            //Set form attribute on submit button
            submitBtn.setAttribute("form", exerciseItems[itemIndex].querySelector("form").id);
            submitBtn.disabled = false;
        }
        
        //If it has pairs
        if(exerciseItems[itemIndex].querySelector(".pairs") !== null) {
            randomizePairs();
            document.querySelectorAll(".pairitem").forEach(item => item.addEventListener('click', matchPairs));
            startTimer = Date.now();
            document.querySelector("button[type=submit]").disabled = true;
            pairsTotal = (document.querySelectorAll(".pairitem").length / 2);
        }
        
        //If randomize options
        if(exerciseItems[itemIndex].querySelector(".multiple-choice-container") !== null) {
            const radioContainer = exerciseItems[itemIndex].querySelector(".multiple-choice-container");
            if(radioContainer.dataset.random == "true") {
                for (var i = radioContainer.children.length; i >= 0; i--) {
                    radioContainer.appendChild(radioContainer.children[Math.random() * i | 0]);
                }
            }
        }
        
        itemIndex++;
        output.value += itemIndex + ": "; //This is to seperate the responses in the mail
        
        //Update progress element
        const progressEl = document.getElementById("gameprogress");
        progressEl.value = itemIndex.toString();
        progressEl.max = exerciseItems.length;
    } else {
        //Display the score
        const finalScore = document.querySelector(".gameend-score");
        finalScore.innerText = finalScore.innerText.toString().replace("X", score);
        finalScore.innerText = finalScore.innerText.toString().replace("Y", maxScore);
        
        const ros = document.querySelector(".gameend-commendation");
        if(score === 0 && maxScore > 0) {
            ros.innerText = "Godt kæmpet!";
        } else if(score == maxScore) {
            ros.innerText = "Sådan!";
        }
        
        //Game over; show results
        endExercise();
    }
}

function randomizePairs() {
    document.querySelectorAll(".pairitem").forEach(item => {
        let randomPos = Math.floor(Math.random() * 10);
        item.style.order = randomPos;
    });
}

function matchPairs() {
    if (lockBoard) return;
    
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        firstCard.classList.add("selected");
        return;
    }
    if(this != firstCard) {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if(firstCard.dataset.pair === secondCard.dataset.pair) {
        disableCards();
        pairsTotal--;
    } else {
        unflipCards();
    }
    if(pairsTotal === 0) {
        endTimer = Date.now();
        document.querySelector("button[type=submit]").disabled = false;
        const finalTime = (endTimer - startTimer) / 1000;
        const finalScore = document.querySelector(".gameend-score");
        finalScore.innerText = "Din tid: " + Math.floor(finalTime) + " sekunder";
    }
}

function disableCards() {
    lockBoard = true;
    firstCard.removeEventListener('click', matchPairs);
    secondCard.removeEventListener('click', matchPairs);
    
    firstCard.classList.remove('selected');
    firstCard.classList.add('right');
    secondCard.classList.add('right');
    setTimeout(() => {
        firstCard.classList.remove('right');
        secondCard.classList.remove('right');
        firstCard.classList.add('disabled');
        secondCard.classList.add('disabled');
        [hasFlippedCard, firstCard, secondCard] = [false, null, null];
        lockBoard = false;
  }, 500);
}

function unflipCards() {
    lockBoard = true;
    firstCard.classList.remove('selected');
    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');
    setTimeout(() => {
        firstCard.classList.remove('wrong');
        secondCard.classList.remove('wrong');
        [hasFlippedCard, firstCard, secondCard] = [false, null, null];
        lockBoard = false;
  }, 500);
}

function startCheck(event) {
    event.preventDefault();
    //saveAllFormsToLocalStorage();
    checkAnswers();
    submitBtn.disabled = true;
}

function checkAnswers() {
    const exerciseActiveItem = document.querySelector(".exercise-item.active");
    exerciseActiveItem.inert = true;
    const output = document.getElementById("resultContainer");
    let numberOfInputs = 0;
    let correctAnswers = 0;
    
    //Evaluate each form group in the current item
    exerciseActiveItem.querySelectorAll(".form-group").forEach(formGroup => {
        
        if(formGroup.classList.contains("radio")) {
            const radios = document.getElementsByName(formGroup.querySelector("input[type=radio]").getAttribute("name"));
            let passed = false;
            if(formGroup.querySelector("input[type='hidden']")) {
                numberOfInputs++;
                const validInput = formGroup.querySelector("input[type='hidden']").value;
                const errorMsg = formGroup.querySelector(".response-label");
                for (var i = 0; i < radios.length; i++) {
                    if(radios[i].checked) {
                        //Log the answer
                        output.value += radios[i].parentElement.innerText;
                        if (radios[i].value == validInput) {
                            passed = true;
                            correctAnswers++;
                            score++;
                        } else {
                            output.value += " (forkert) ";
                        }
                    }
                }
                if(errorMsg != null) {
                    errorMsg.hidden = false;
                    if(passed) {
                        errorMsg.classList.add("right");
                        errorMsg.innerText = "Korrekt";
                    } else {
                        errorMsg.classList.add("wrong");
                        errorMsg.innerText = "Det rigtige svar er: ";
                        for (var i = 0; i < radios.length; i++) {
                            if (radios[i].value == validInput) {
                                errorMsg.innerText += radios[i].parentElement.innerText;
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < radios.length; i++) {
                    if(radios[i].checked) {
                        //Log the answer
                        output.value += radios[i].parentElement.innerText;
                    }
                }
            }
            output.value += "\n";
            
        } else if(formGroup.classList.contains("checkbox")) {
            const cb = document.getElementsByName(formGroup.querySelector("input[type=checkbox]").getAttribute("name"));
            if(formGroup.querySelector("input[type='hidden']")) {
                numberOfInputs++;
                let passed = false;
                const inputArray = [];
                const validArray = formGroup.querySelector("input[type='hidden']").value.replaceAll(" ", "").split(",");
                const errorMsg = formGroup.querySelector(".response-label");
                for (var i = 0; i < cb.length; i++) {
                    if(cb[i].checked) {
                        inputArray.push(cb[i].value);
                    }
                }
                inputArray.sort();
                if(inputArray.toString() == validArray.toString()) {
                    passed = true;
                    correctAnswers++;
                    score++;
                } else {
                    output.value += " (forkert) ";
                }
                if(errorMsg != null) {
                    errorMsg.hidden = false;
                    if(passed) {
                        errorMsg.classList.add("right");
                        errorMsg.innerText = "Korrekt";
                    } else {
                        errorMsg.classList.add("wrong");
                        errorMsg.innerText = "De(t) rigtige svar er: ";
                        for (var i = 0; i < cb.length; i++) {
                            if(validArray.indexOf(cb[i].value) > -1) {
                                errorMsg.innerText += (cb[i].parentElement.innerText) + ", ";
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < cb.length; i++) {
                    if(cb[i].checked) {
                        //Log the answer
                        output.value += cb[i].parentElement.innerText + " , ";
                    }
                }
            }
            output.value += "\n";
        } else if(formGroup.classList.contains("textinput")) {
            let selectedRadioValue = "";
            if(formGroup.querySelector("input[type=radio]") != null) {
                const radio = formGroup.querySelector("input[type=radio]");
                if(radio.checked) {
                    selectedRadioValue = formGroup.querySelector("input[type=radio]").value.toLowerCase();
                    selectedRadioValue += ", ";
                }
            }
            const userInput = stripString(formGroup.querySelector(".form-input").value);
            const errorMsg = formGroup.querySelector(".response-label");
            let passed = false;
            output.value += selectedRadioValue + userInput;
            if(formGroup.querySelector("input[type='hidden']")) {
                numberOfInputs++;
                //The input should be validated
                const validInput = stripString(formGroup.querySelector("input[type='hidden']").value);
                if(userInput === validInput) {
                    //Right
                    passed = true;
                    correctAnswers++;
                    score++;
                } else {
                    //Wrong
                    formGroup.classList.add("has-error");
                    output.value += " (" + validInput + ") ";
                }
                if(errorMsg != null) {
                    errorMsg.hidden = false;
                    if(passed) {
                        errorMsg.classList.add("right");
                        errorMsg.innerText = "Korrekt";
                    } else {
                        errorMsg.classList.add("wrong");
                        errorMsg.innerText = "Det rigtige svar er: \"" + validInput + "\"";
                    }
                }
            }
            output.value += "\n";
        }
        
    });
    
    //Calculate if all is correct...
    if(numberOfInputs == exerciseActiveItem.querySelectorAll(".form-group").length && correctAnswers == numberOfInputs) {
        showResponse("right");
    } else if(numberOfInputs == exerciseActiveItem.querySelectorAll(".form-group").length && correctAnswers == 0) {
        showResponse("wrong");
    } else {
        showResponse("almost");
    }
    
    //Fingure out what the maximum score possible.
    maxScore = maxScore + numberOfInputs;
}

function stripString(str) {
    //return str.replace(/[.,\/#!$%\^&\*;:?{}=\-_`~()]/g,"", '').trim().toLowerCase();
    return str.trim().toLowerCase();
}

function showResponse(type) {
    const exerciseActiveItem = document.querySelector(".exercise-item.active");
    let responseEl;
    
    //Accepts right, wrong or almost
    if(type == "right") {
        responseEl = document.querySelector(".response#right");
        responseEl.classList.add("open");
    } else if(type == "wrong") {
        responseEl = document.querySelector(".response#wrong");
        responseEl.classList.add("open");
    } else {
        //Only registering the answers
        responseEl = document.querySelector(".response#almost");
        responseEl.classList.add("open");
    }
    
    responseEl.querySelector("button").focus();
    
    if(exerciseActiveItem.querySelector("input.feedback")) {
        responseEl.querySelector(".response-text").innerText = exerciseActiveItem.querySelector("input.feedback").value;
    } else {
        responseEl.querySelector(".response-text").innerText = "";
    }
}

function selectSiblingInput(element) {
    const parent = element.parentElement;
    const radio = parent.querySelector("input[type=radio]");
    radio.checked = true;
    const input = parent.querySelector("input[type=text]");
    input.focus = true;
}

// Function to save all form data to local storage
function saveAllFormsToLocalStorage() {
    const formData = {};
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        Array.from(form.elements).forEach(element => {
            if (element.type === "text" || element.type === "number" || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select') {
                formData[element.id] = element.value;
            } else if (element.type === "checkbox" || element.type === "radio") {
                formData[element.id] = element.checked;
            }
        });
    });
    localStorage.setItem(exerciseId, JSON.stringify(formData));
    localStorage.setItem(exerciseId + "-output", document.getElementById("resultContainer").value);
}

// Function to load form data from local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem(exerciseId);
    if (savedData) {
        const formData = JSON.parse(savedData);
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            Array.from(form.elements).forEach(element => {
                if (formData[element.id] !== undefined) {
                    if (element.type === "text" || element.type === "number" || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select') {
                        element.value = formData[element.id];
                    } else if (element.type === 'checkbox' || element.type === 'radio') {
                        element.checked = formData[element.id];
                    }
                }
            });
        });
    }
    
    const savedOutput = localStorage.getItem(exerciseId + "-output");
    if (savedOutput) {
        document.getElementById("resultContainer").value = savedOutput;
    }

    const savedStep = localStorage.getItem(exerciseId + "-step");
    if (savedStep) {
        itemIndex = savedStep;
    }
}

// Function to clear form data from local storage
function clearLocalStorage() {
    localStorage.removeItem(exerciseId + "-step");
    localStorage.removeItem(exerciseId);
    localStorage.removeItem(exerciseId + "-output");
}


// Load saved data when the page loads
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem(exerciseId)) {
        loadFromLocalStorage();
        startExercise();
        console.log("Continue");
    } else {
        console.log("Start over");
    }

    document.querySelectorAll("input, textarea, select").forEach(formInput => formInput.addEventListener('input', saveAllFormsToLocalStorage));
});
