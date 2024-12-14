class exerciseSingleInput extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = uuidv4();

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
        const id = uuidv4();

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
        const id = uuidv4();

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
        const groupName = uuidv4();
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
            const id = uuidv4();
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
        const wrapper = el("fieldset", "multiinput");
        const radiosid = uuidv4();

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
            const id = uuidv4();
            const inputWrapper = el("div", "form-group textinput");

            if (this.dataset.radios == "true") {
                const radio = document.createElement("input");
                radio.type = "radio";
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
        const wrapper = el("div", "audio");
        
        const playButton = el("button", "play-button btn btn-white btn-circle");
        playButton.setAttribute("data-playing", false);
        playButton.setAttribute("title", "Sig højt");
        playButton.setAttribute("type", "button");
        playButton.textContent = "🔊";

        const audioEl = document.createElement("audio");
        audioEl.setAttribute("src", "/assets/audio/" + this.dataset.file);

        wrapper.appendChild(audioEl);
        wrapper.appendChild(playButton);
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("audio-player", customAudioPlayer);

function el (type, classes) {
    const newEl = document.createElement(type);
    newEl.setAttribute("class", classes);
    return newEl;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }