class exerciseSingleInput extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // const shadow = this.attachShadow({mode: "open"});

        const id = uuidv4();

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "form-group mb-3 textinput");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("form-label");
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("form-control");
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

            const response = document.createElement("label");
            response.setAttribute("for", id);
            response.hidden = true;
            response.classList.add("response-label");
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

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "form-group mb-3 textinput");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("form-label");
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("form-control");
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

            const response = document.createElement("label");
            response.setAttribute("for", id);
            response.classList.add("response-label");
            response.hidden = true;
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

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "form-group mb-3 textinput");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("form-label");
        label.textContent = this.dataset.label;
        wrapper.appendChild(label);
        
        const input = document.createElement("textarea");
        input.classList.add("form-control");
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
        const id = uuidv4();
        const optionsType = (this.dataset.type.length > 0) ? this.dataset.type.toLowerCase() : "radio";

        const wrapper = el("fieldset", "form-group mb-3 " + optionsType);
        let y = 0;

        const legend = document.createElement("legend");
        legend.textContent = this.dataset.label;
        wrapper.appendChild(legend);

        const optionsWrapper = el("div", "multiple-choice-container");
        wrapper.appendChild(optionsWrapper);

        for (let index = 0; index < this.dataset.options.split(",").length; index++) {
            const element = this.dataset.options.split(",")[index];
            y++;
            const optionWrapper = document.createElement("label");
            
            const input = document.createElement("input");
            input.type = optionsType;
            if (optionsType == "radio") {
                input.required = true;
            }
            input.value = y;
            input.setAttribute("name", id);
            optionWrapper.appendChild(input);
            
            const label = document.createElement("span");
            label.textContent = element.trim();
            optionWrapper.appendChild(label);
            
            optionsWrapper.appendChild(optionWrapper);
        }

        if (this.dataset.validation != null) {
            const valid = document.createElement("input");
            valid.type = "hidden";
            valid.value = this.dataset.validation.toLowerCase();
            wrapper.appendChild(valid);

            const response = document.createElement("label");
            response.setAttribute("for", id);
            response.classList.add("response-label");
            response.hidden = true;
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

        const legend = document.createElement("legend");
        legend.textContent = this.dataset.label;
        wrapper.appendChild(legend);
        const radiosid = uuidv4();

        const labels = this.dataset.labels.split(",");
        let validations = null;
        if (this.dataset.validation != null) {
            validations = this.dataset.validation.split(",");
        }

        for (let index = 0; index < labels.length; index++) {
            const element = labels[index];
            const id = uuidv4();
            const inputWrapper = el("div", "form-group mb-3 textinput");

            if (this.dataset.radios == "true") {
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.setAttribute("name", radiosid);
                inputWrapper.appendChild(radio);
            }
            
            const label = document.createElement("label");
            label.setAttribute("for", id);
            label.textContent = element.trim();
            inputWrapper.appendChild(label);

            const input = el("input", "form-control");
            input.id = id;
            input.type = "text";
            input.required = true;
            input.setAttribute("autocomplete", "off");
            input.setAttribute("spellcheck", "off");
            inputWrapper.appendChild(input);
            
            if (validations != null && validations[index] != null) {
                const valid = document.createElement("input");
                valid.type = "hidden";
                valid.value = validations[index].trim().toLowerCase();
                inputWrapper.appendChild(valid);
                
                const response = document.createElement("label");
                response.setAttribute("for", id);
                response.classList.add("response-label");
                response.hidden = true;
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
        this.appendChild(wrapper);
        this.style.display = "contents";
    }
}

customElements.define("match-pairs", exerciseMatchPairs);

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