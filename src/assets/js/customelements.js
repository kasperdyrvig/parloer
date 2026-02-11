let counter = 0;

function generateID(prefix) {
    counter += 1;
    return `${prefix}-${counter}`;
}

class exerciseIllustration extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const wrapper = el("div", "exercise-image-container");

        const img = el("img", "exercise-imgage");
        img.setAttribute("src", "/assets/images/" + this.dataset.file);
        if (this.dataset.alt) img.setAttribute("alt", this.dataset.alt);
        wrapper.appendChild(img);
        
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("image-illustration", exerciseIllustration);

class exerciseSingleInput extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const id = generateID("exerciseElement");
        const wrapper = el("div", "form-group textinput");

        const label = el("label", "form-label");
        label.setAttribute("for", id);
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = el("input", "form-input");
        input.type = "text";
        input.id = id;
        input.required = true;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "off");
        wrapper.appendChild(input);

        if (this.dataset.validation != null) {
            const valid = document.createElement("input");
            valid.type = "hidden";
            valid.value = this.dataset.validation.toLowerCase();
            wrapper.appendChild(valid);

            const response = el("div", "response-label");
            wrapper.appendChild(response);
        }
        
        // shadow.appendChild(wrapper);
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("single-input", exerciseSingleInput);

class exerciseNumberInput extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const id = generateID("exerciseElement");
        const wrapper = el("div", "form-group textinput");

        const label = el("label", "form-label");
        label.setAttribute("for", id);
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = el("input", "form-input");
        input.type = "number";
        input.id = id;
        input.required = true;
        input.value = 0;
        input.setAttribute("min", 0);
        input.setAttribute("autocomplete", "off");
        wrapper.appendChild(input);

        if (this.dataset.validation != null) {
            const valid = document.createElement("input");
            valid.type = "hidden";
            valid.value = this.dataset.validation.toLowerCase();
            wrapper.appendChild(valid);

            const response = el("div", "response-label");
            wrapper.appendChild(response);
        }

        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("number-input", exerciseNumberInput);

class exerciseTextareaInput extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const id = generateID("exerciseElement");
        const wrapper = el("div", "form-group textinput");

        const label = el("label", "form-label");
        label.setAttribute("for", id);
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = el("textarea", "form-input");
        input.id = id;
        input.required = true;
        input.setAttribute("rows", 5);
        input.setAttribute("spellcheck", "off");
        input.setAttribute("autocomplete", "off");
        wrapper.appendChild(input);
        
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("textarea-input", exerciseTextareaInput);

class exerciseMultiChoice extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const groupName = generateID("exerciseElement");
        const optionsType = (this.dataset.type.length > 0) ? this.dataset.type.toLowerCase() : "radio";
        
        const wrapper = el("fieldset", "form-group " + optionsType);
        let y = 0;
        
        const legend = document.createElement("legend");
        legend.textContent = this.dataset.label;
        wrapper.appendChild(legend);
        
        const optionsWrapper = el("div", "multiple-choice-container");
        if (this.dataset.random) optionsWrapper.dataset.random = true;
        wrapper.appendChild(optionsWrapper);
        
        for (let index = 0; index < this.dataset.options.split(",").length; index++) {
            const id = generateID("exerciseElement");
            const element = this.dataset.options.split(",")[index];
            y++;
            
            const inputdiv = el("div", "form-check");
            
            const input = el("input", "form-check-input");
            input.type = optionsType;
            if (optionsType == "radio") {
                input.required = true;
            }
            input.value = y;
            input.setAttribute("name", groupName);
            input.setAttribute("id", id);
            inputdiv.appendChild(input)
            
            const label = el("label", "form-check-label");
            label.setAttribute("for", id);
            label.textContent = element.trim();
            inputdiv.appendChild(label);
            
            optionsWrapper.appendChild(inputdiv);
        }

        if (this.dataset.validation != null) {
            const valid = document.createElement("input");
            valid.type = "hidden";
            valid.value = this.dataset.validation.toLowerCase();
            wrapper.appendChild(valid);

            const response = el("div", "response-label");
            wrapper.appendChild(response);
        }

        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("multi-choice", exerciseMultiChoice);

class exerciseMultiInput extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const id = generateID("exerciseElement");
        const wrapper = el("fieldset", "multiinput");
        const radiosid = id;

        if(this.dataset.label != null && this.dataset.label.length > 0) {
            const legend = document.createElement("legend");
            legend.textContent = this.dataset.label;
            wrapper.appendChild(legend);
        }

        const labels = this.dataset.labels.split(",");
        let validations = null;
        if (this.dataset.validation != null) {
            validations = this.dataset.validation.split(",");
        }

        for (let index = 0; index < labels.length; index++) {
            const element = labels[index];
            const id = generateID("exerciseElement");
            const inputWrapper = el("div", "form-group textinput");

            if (this.dataset.radios == "true") {
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.setAttribute("id", generateID("exerciseElement"));
                radio.setAttribute("name", radiosid);
                radio.setAttribute("onChange", "selectSiblingInput(this)");
                radio.setAttribute("value", element.trim());
                inputWrapper.appendChild(radio);
            }
            
            const label = document.createElement("label");
            label.setAttribute("for", id);
            label.textContent = element.trim();
            inputWrapper.appendChild(label);

            const input = el("input", "form-input");
            input.id = id;
            input.type = "text";
            input.setAttribute("autocomplete", "off");
            input.setAttribute("spellcheck", "off");
            if (this.dataset.radios != "true") {
                input.required = true;
            } else {
                input.setAttribute("onfocus", "selectSiblingInput(this)");
            }
            inputWrapper.appendChild(input);
            
            if (validations != null && validations[index] != null) {
                const valid = document.createElement("input");
                valid.type = "hidden";
                valid.value = validations[index].trim().toLowerCase();
                inputWrapper.appendChild(valid);
                
                const response = el("div", "response-label");
                inputWrapper.appendChild(response);
            }

            wrapper.appendChild(inputWrapper);
        }

        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("multi-input", exerciseMultiInput);

class exerciseMatchPairs extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const wrapper = el("div", "pairs");
        const one = el("div", "colOne");
        const two = el("div", "colTwo");
        
        const colOne = this.dataset.first.split(",");
        const colTwo = this.dataset.second.split(",");
        
        for (let index = 0; index < colOne.length; index++) {
            const element = colOne[index];
            const div = el("div", "pairitem");
            div.setAttribute("data-pair", index);
            div.textContent = element.trim();
            one.appendChild(div);
        }

        for (let index = 0; index < colTwo.length; index++) {
            const element = colTwo[index];
            const div = el("div", "pairitem");
            div.setAttribute("data-pair", index);
            div.textContent = element.trim();
            two.appendChild(div);
        }
        
        wrapper.appendChild(one);
        wrapper.appendChild(two);
        wrapper.style.display = "grid";
        wrapper.style.gridTemplateColumns = "1fr 1fr";
        wrapper.style.gap = "1rem";
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("match-pairs", exerciseMatchPairs);

class exerciseFeedbackMessage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const input = el("input", "feedback");
        input.type = "hidden";
        input.value = this.dataset.content;

        this.appendChild(input);
        this.style.display = "contents";
    }
}

customElements.define("feedback-message", exerciseFeedbackMessage);

class customAudioPlayer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const enableSlow = this.dataset.enableSlow == "true";
        const wrapper = el("div", "audio");

        const audioEl = document.createElement("audio");
        audioEl.setAttribute("src", "/assets/audio/" + this.dataset.file);
        wrapper.appendChild(audioEl);
        
        const playButton = el("button", "btn play-button");
        playButton.setAttribute("data-playing", false);
        playButton.setAttribute("title", "Sig højt");
        playButton.setAttribute("type", "button");
        playButton.textContent = "🔊";
        wrapper.appendChild(playButton);

        if (enableSlow) {
            const playSlowButton = el("button", "btn play-button play-slow");
            playSlowButton.setAttribute("data-playing", false);
            playSlowButton.setAttribute("title", "Sig langsomt højt");
            playSlowButton.setAttribute("type", "button");
            playSlowButton.textContent = "🐢";
            wrapper.appendChild(playSlowButton);
        }

        if (this.dataset.label != null && this.dataset.label.length > 0) {
            const audioLabel = el("div", "play-label");
            audioLabel.textContent = this.dataset.label;
            wrapper.appendChild(audioLabel);
        }

        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("audio-player", customAudioPlayer);

class exerciseWordDissector extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const wrapper = el("div", "word-dissector");
        const prompt = this.dataset.prompt;
        const validation = this.dataset.validation.trim();

        // Word prompt
        const wordContainer = el("div", "word");
        wordContainer.textContent = prompt;
        wrapper.appendChild(wordContainer);

        // Build area and pool
        const dissectorContainer = el("div", "dissector-board");
        wrapper.appendChild(dissectorContainer);

        const partsContainer = el("div", "dissected-parts");
        wrapper.appendChild(partsContainer);

        // Split validation into parts and shuffle
        const validationArray = validation.split(" ");
        shuffleArray(validationArray);

        // Create parts
        validationArray.forEach(function(part) {
            const partElement = el("span", "wordpart");
            partElement.textContent = part;
            partElement.tabIndex = 0;
            partsContainer.appendChild(partElement);
        });

        // Hidden input to store the correct validation string
        const valid = document.createElement("input");
        valid.type = "hidden";
        valid.value = validation;
        wrapper.appendChild(valid);

        // Add the wrapper to this element
        this.appendChild(wrapper);
        this.style.display = "contents";
        
        // === Add click handler (scoped to this instance) ===
        // Use event delegation: listen once, act if a .wordpart was clicked.
        wrapper.addEventListener("click", (event) => {
            const part = event.target.closest(".wordpart");
            if (!part || !wrapper.contains(part)) return;

            // Toggle the part between the two containers belonging to THIS instance
            const isInPool = part.parentElement === partsContainer;
            if (isInPool) {
                dissectorContainer.appendChild(part);
            } else {
                partsContainer.appendChild(part);
            }
        });
    }
}

customElements.define("word-dissector", exerciseWordDissector);

function el (type, classes) {
    const newEl = document.createElement(type);
    newEl.setAttribute("class", classes);
    return newEl;
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}