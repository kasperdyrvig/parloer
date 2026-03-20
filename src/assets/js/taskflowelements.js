/* == FLOW == */
class taskFlow extends HTMLElement {
    static get observedAttributes() {
        return ["id", "parentId", "randomize" , "loop"];
    }

    constructor() {
        super();
        this._introPanel;
        this._outroPanel;
        this._steps;
        this._feedbackPanel;
        this._id = this.getAttribute("id");
        this._parentId = this.getAttribute("parentId");
        this._stage; //intro | steps | outro
        this._gateMode = this.getAttribute("mode") || "correct"; //correct | filled
        this._loop = this.hasAttribute("loop");
        this._randomize = this.hasAttribute("randomize");
        this._stepsOrder = [];
        this._stepIndex = 0;
    }

    connectedCallback() {
        this._introPanel = this.querySelector(".task-intro");
        this._outroPanel = this.querySelector(".task-outro");
        this._infoBtn = this.querySelector("#task-info");
        this._nextBtn = this.querySelector("#task-next");
        this._nextBtn.disabled = true;
        this._steps = this.querySelectorAll("task-step");
        this._progressbar = this.querySelector(".progress");
        if (this._loop) this._progressbar.classList.add("hidden");

        // Check if this task was previously started
        if (localStorage.getItem(this._id + "-step") && localStorage.getItem(this._id + "-order")) {
            // Resume
            console.log("Resuming task flow: " + this._id);
            this._stepsOrder = localStorage.getItem(this._id + "-order").split(",").map(Number);
            this._stepIndex = localStorage.getItem(this._id + "-step");
            this.setStage("steps");
            this.goToNextStep();
        } else {
            // Start over
            console.log("Starting task flow: " + this._id);
            const numberOfItems = this._steps.length;
            const indexes = Array.from({ length: numberOfItems }, (_, index) => index);

            // Check if order is already determined
            if (!localStorage.getItem(this._id + "-order")) {
                
                // Check wheater to randomize the order
                if (this._randomize) {
                    const randomIndexes = this._shuffleArray(indexes);
                    localStorage.setItem(this._id + "-order", randomIndexes);
                } else {
                    localStorage.setItem(this._id + "-order", indexes);
                }
            }
            this._stepsOrder = localStorage.getItem(this._id + "-order").split(",").map(Number);
            this.setStage("intro");
        }

        // Events
        this._introPanel.querySelector("button").addEventListener("click", () => {
            this.setStage("steps");
            this.goToNextStep();
        });

        this._infoBtn.addEventListener("click", () => {
            const step = this._getActiveStep();
            const info = step.querySelector("task-info");
            if (info) info.setAttribute("open", "");
        });

        this._nextBtn.addEventListener("click", () => {
            this.goToNextStep();
        });

        this.addEventListener("field-status-changed", (event) => {
            this._updateNextEnabled();
        });
    }

    // API
    setStage(stage) {
        this._stage = stage;
        this.setAttribute("stage", stage); // CSS is taking care of displaying the right content based on stage attribute
    }

    restartLoopFlow() {
        console.log("Restarting loop flow");
        const numberOfItems = this._steps.length;
        const indexes = Array.from({ length: numberOfItems }, (_, index) => index);
        if (this._randomize) {
            const randomIndexes = this._shuffleArray(indexes);
            localStorage.setItem(this._id + "-order", randomIndexes);
        } else {
            localStorage.setItem(this._id + "-order", indexes);
        }
        this._stepsOrder = localStorage.getItem(this._id + "-order").split(",").map(Number);
        this._stepIndex = 0;
        this.goToNextStep();
    }

    goToNextStep() {
        // Hide current step
        const previousStep = this._getActiveStep();
        if (previousStep) {
            previousStep.removeAttribute("active");
        }

        // End here, if the no more steps
        if (this._stepIndex == this._stepsOrder.length) {
            console.log("The task flow is complete");
            if (this._loop) {
                this.restartLoopFlow();
            } else {
                this.endFlow();
            }
            return
        }

        // Save progress
        localStorage.setItem(this._id + "-step", this._stepIndex);
        
        // Display next item
        console.log("Activating step " + this._stepIndex);
        const index = this._stepsOrder[this._stepIndex];
        this._steps[index].setAttribute("active", "");
        
        // Update step value
        this._stepIndex++;

        // Update progress bar
        if (!this._loop) this.updateProgressBar();

        // Disable "next" button
        this._nextBtn.disabled = true;
        this._updateInfoEnabled();
    }

    endFlow() {
        this.setStage("outro");

        // Register the task flow as completed
        localStorage.setItem(this._parentId, true);

        // Remove other local storage
        this._clearLocalStorage();
    }

    updateProgressBar() {
        this._progressbar.ariaValueMax = this._steps.length;
        this._progressbar.ariaValueNow = this._stepIndex;
        const percentage = Math.round((this._stepIndex / this._steps.length) * 100);
        this._progressbar.querySelector(".progress-bar").style.width = `${percentage}%`;
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }

    _getActiveStep() {
        return this.querySelector("task-step[active]");
    }

    _updateInfoEnabled() {
        const step = this._getActiveStep();
        if(step.querySelector("task-info")) {
            this._infoBtn.disabled = false;
            return
        } else {
            this._infoBtn.disabled = true;
        }
    }

    _updateNextEnabled() {
        const step = this._getActiveStep();
        if (!step) {
            this._nextBtn.disabled = true;
            return
        }

        // Gather all fields of active step
        const fields = (typeof step.getFields() === "function") ? step.getFields() : Array.from(step.querySelectorAll("[data-field]"));
        let canGo = true;

        // Check if each field is complete and/or valid
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const mode = this._gateMode;
            const hasIsComplete = typeof field.isComplete === "function";
            const hasIsValid = typeof field.isValid === "function";
            if (mode === "filled") {
                if (hasIsComplete) {
                    if(!field.isComplete()) canGo = false;
                }
            } else {
                // mode === "correct"
                if (hasIsComplete && !field.isComplete()) canGo = false;
                if (hasIsValid && !field.isValid()) canGo = false;
            }
            if (!canGo) break;
        }

        // Enable/disable the "next" button
        this._nextBtn.disabled = !canGo;
    }

    _clearLocalStorage() {
        localStorage.removeItem(this._id + "-step");
        localStorage.removeItem(this._id + "-order");
    }

    _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

customElements.define("task-flow", taskFlow);

class taskStep extends HTMLElement {
    static get observedAttributes() {
        return ["active"];
    }

    connectedCallback() {
        this.updateVisibility();
    }

    // API
    attributeChangedCallback(name, oldValue, newValue) {
        this.updateVisibility();
    }

    updateVisibility() {
        const isActive = this.hasAttribute("active");
        this.hidden = !isActive;
        this.inert = !isActive;
    }

    getFields() {
        // Collect all inputs with attribute "data-field"
        const fields = Array.from(this.querySelectorAll("[data-field]"));
        return fields;
    }

    getValues() {
        const data = {};
        const fields = this.getFields();
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (typeof field.getValue === "function") {
                const key = field.getAttribute("name") || field.getAttribute("id");
                data[key] = field.getValue();
            }
        }
        return data;
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }
}

customElements.define("task-step", taskStep);

/* == HELPERS == */
let counter = 0;
function generateID(prefix) {
    counter += 1;
    return `${prefix}-${counter}`;
}

/* == ELEMENTS == */
class taskInstruction extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `<div part="instruction"><span part="number">${this.dataset.number}</span> <slot /></div>`;
    }
}

customElements.define("task-instruction", taskInstruction);

class taskPrompt extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `<div part="container"><slot /></div>`;
    }
}

customElements.define("task-prompt", taskPrompt);

class taskInfo extends HTMLElement {
    static get observedAttributes() {
        return ["open"];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `<div part="info"><button type="button" title="Luk info">❌</button><p><slot /></p></div>`;
    }

    connectedCallback() {
        const closeButton = this.shadowRoot.querySelector("button");
        if (closeButton) closeButton.addEventListener("click", () => { this.removeAttribute("open"); });
    }
}

customElements.define("task-info", taskInfo);

class taskAudio extends HTMLElement {
    static get observedAttributes() {
        return ["playing"];
    }

    constructor() {
        super();
        this._file = this.dataset.file;
        this._slow = this.hasAttribute("enable-slow");
    }

    connectedCallback() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("audio");

        const audioEl = document.createElement("audio");
        audioEl.setAttribute("src", "/assets/audio/" + this._file);
        wrapper.appendChild(audioEl);

        const playButton = document.createElement("button");
        playButton.classList.add("btn", "play-button");
        playButton.setAttribute("data-playing", false);
        playButton.setAttribute("title", "Afspil");
        playButton.setAttribute("type", "button");
        playButton.textContent = "🔊";
        wrapper.appendChild(playButton);

        const playSlowButton = document.createElement("button");
        playSlowButton.classList.add("btn", "play-button", "play-slow");
        playSlowButton.setAttribute("data-playing", false);
        playSlowButton.setAttribute("title", "Sig langsomt højt");
        playSlowButton.setAttribute("type", "button");
        playSlowButton.textContent = "🐌";
        if (this._slow) wrapper.appendChild(playSlowButton);

        if (this.dataset.label != null && this.dataset.label.length > 0) {
            const audioLabel = document.createElement("div");
            audioLabel.classList.add("play-label");
            audioLabel.textContent = this.dataset.label;
            wrapper.appendChild(audioLabel);
        }

        this.appendChild(wrapper);

        // Events
        playButton.addEventListener("click", () => {
            audioEl.playbackRate = 1;
            if (audioEl.paused) {
                audioEl.play();
                playButton.dataset.playing = "true";
            }
        });

        playSlowButton.addEventListener("click", () => {
            audioEl.playbackRate = .5;
            if (audioEl.paused) {
                audioEl.play();
                playSlowButton.dataset.playing = "true";
            }
        });

        audioEl.addEventListener("ended", () => {
            playButton.dataset.playing = "false";
            if (playSlowButton) playSlowButton.dataset.playing = "false";
        });
    }
}

customElements.define("task-audio", taskAudio);

/* == INPUTS == */
class textInput extends HTMLElement {
    constructor() {
        super();
        this._input = null;
        this._required = true;
        this._validation = null;
        this._response = null;
    }

    connectedCallback() {
        this._id = generateID("taskElement");
        this.setAttribute("data-field", ""); // This indicates data can be processed
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-group");

        const validation = this.dataset.validation;
        if (validation) {
            this._validation = validation.trim();
        }

        if (this.dataset.label) {
            const label = document.createElement("label");
            label.setAttribute("for", this._id);
            label.classList.add("form-label")
            label.textContent = this.dataset.label;
            wrapper.appendChild(label);
        }

        const input = document.createElement("input");
        input.id = this._id;
        input.type = "text";
        input.classList.add("form-input");
        input.required = this._required;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("writingsuggestions", "false");
        input.setAttribute("spellcheck", "off");
        wrapper.appendChild(input);
        this._input = input;

        const checkDiv = document.createElement("div");
        checkDiv.classList.add("form-group-response");

        const validationButton = document.createElement("button");
        validationButton.type = "button";
        validationButton.classList.add("btn", "btn-gray", "btn-small");
        validationButton.textContent = "Tjek";
        checkDiv.appendChild(validationButton);

        const response = document.createElement("div");
        response.classList.add("response-label");
        response.setAttribute("aria-live", "polite");
        checkDiv.appendChild(response);
        this._response = response;

        wrapper.appendChild(checkDiv);

        // Events
        input.addEventListener("input", () => {
            //this._emitStatus();
        });

        validationButton.addEventListener("click", () => {
            const valid = this.isValid();
            this._emitStatus();
            if (valid) {
                if (this._validation) {
                    this._setValid(true);
                    this._setMessage("Korrekt 👏");
                    input.readOnly = true;
                    validationButton.disabled = true;
                } else {
                    this._setMessage("✔️");
                }
                this._setInvalid(false);
                return;
            }
            if (!this.isComplete()) {
                this._setMessage("Du mangler dette felt 👋");
                this._setInvalid(true);
                return;
            }
            if (!valid) {
                this._setMessage("Feltet er ikke udfyldt korrekt 🫤");
                this._setInvalid(true);
                return;
            }
        });

        // Add to host
        this.appendChild(wrapper);
    }

    // API
    getValue() {
        if (this._input.value === null) return "";
        return this._input.value.trim();
    }

    setValue(newValue) {
        this._input.value = newValue;
        this._emitStatus();
    }

    isComplete() {
        if (!this._required) return true; // Always true, if not required
        return !!this.getValue(); // True if has input value
    }

    isValid() {
        const value = this.getValue();
        const validation = this._validation;
        if (this._validation) {
            return (value.toLowerCase() == validation.toLowerCase()); // Input value and validation match
        } else if (value.length > 0) {
            return true; // No validation, only input value
        } else {
            return false; // No input value
        }
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }

    _emitStatus() {
        const field = this.getAttribute("name") || this._id || "";
        this.dispatchEvent(new CustomEvent("field-status-changed", {
            bubbles: true,
            detail: {
                name: field,
                complete: this.isComplete(),
                valid: this.isValid()
            }
        }));
    }

    _setInvalid(isInvalid) {
        if (!this._input) return;
        this._input.setAttribute("aria-invalid", String(isInvalid));
        if (isInvalid) {
            this._input.classList.add("is-invalid");
        } else {
            this._input.classList.remove("is-invalid");
        }
    }

    _setValid(isValid) {
        if (!this._input) return;
        this._input.setAttribute("aria-valid", String(isValid));
        if (isValid) {
            this._input.classList.add("is-valid");
        } else {
            this._input.classList.remove("is-valid");
        }
    }

    _setMessage(msg) {
        if (!this._response) return;
        this._response.textContent = msg || "";
        this._response.hidden = !msg;
    }

    _clearMessage() {
        this._setMessage("");
        this._setInvalid(false);
    }
}

customElements.define("text-input", textInput);

class numberInput extends HTMLElement {
    constructor() {
        super();
        this._input = null;
        this._required = true;
        this._validation = null;
        this._response = null;
    }

    connectedCallback() {
        this._id = generateID("taskElement");
        this.setAttribute("data-field", ""); // This indicates data can be processed
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-group");

        const validation = this.dataset.validation;
        if (validation) {
            this._validation = validation.trim();
        }

        if (this.dataset.label) {
            const label = document.createElement("label");
            label.setAttribute("for", this._id);
            label.classList.add("form-label")
            label.textContent = this.dataset.label;
            wrapper.appendChild(label);
        }

        const input = document.createElement("input");
        input.id = this._id;
        input.type = "number";
        input.min = 0;
        input.classList.add("form-input");
        input.required = this._required;
        input.setAttribute("autocomplete", "off");
        wrapper.appendChild(input);
        this._input = input;

        const checkDiv = document.createElement("div");
        checkDiv.classList.add("form-group-response");

        const validationButton = document.createElement("button");
        validationButton.type = "button";
        validationButton.classList.add("btn", "btn-gray", "btn-small");
        validationButton.textContent = "Tjek";
        checkDiv.appendChild(validationButton);

        const response = document.createElement("div");
        response.classList.add("response-label");
        response.setAttribute("aria-live", "polite");
        checkDiv.appendChild(response);
        this._response = response;

        wrapper.appendChild(checkDiv);

        // Events
        input.addEventListener("input", () => {
            //this._emitStatus();
        });

        validationButton.addEventListener("click", () => {
            const valid = this.isValid();
            this._emitStatus();
            if (valid) {
                if (this._validation) {
                    this._setMessage("Korrekt 👏");
                    this._setValid(true);
                    input.readOnly = true;
                    validationButton.disabled = true;
                } else {
                    this._setMessage("✔️");
                }
                this._setInvalid(false);
                return;
            }
            if (!this.isComplete()) {
                this._setMessage("Du mangler dette felt 👋");
                this._setInvalid(true);
                return;
            }
            if (!valid) {
                this._setMessage("Feltet er ikke udfyldt korrekt 🫤");
                this._setInvalid(true);
                return;
            }
        });

        // Add to host
        this.appendChild(wrapper);
    }

    // API
    getValue() {
        if (this._input.value === null) return "";
        return this._input.value.trim();
    }

    setValue(newValue) {
        this._input.value = newValue;
        this._emitStatus();
    }

    isComplete() {
        if (!this._required) return true; // Always true, if not required
        return !!this.getValue(); // True if has input value
    }

    isValid() {
        const value = this.getValue();
        const validation = this._validation;
        if (this._validation) {
            return (value.toLowerCase() == validation.toLowerCase()); // Input value and validation match
        } else if (value.length > 0) {
            return true; // No validation, only input value
        } else {
            return false; // No input value
        }
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }

    _emitStatus() {
        const field = this.getAttribute("name") || this._id || "";
        this.dispatchEvent(new CustomEvent("field-status-changed", {
            bubbles: true,
            detail: {
                name: field,
                complete: this.isComplete(),
                valid: this.isValid()
            }
        }));
    }

    _setInvalid(isInvalid) {
        if (!this._input) return;
        this._input.setAttribute("aria-invalid", String(isInvalid));
        if (isInvalid) {
            this._input.classList.add("is-invalid");
        } else {
            this._input.classList.remove("is-invalid");
        }
    }

    _setValid(isValid) {
        if (!this._input) return;
        this._input.setAttribute("aria-valid", String(isValid));
        if (isValid) {
            this._input.classList.add("is-valid");
        } else {
            this._input.classList.remove("is-valid");
        }
    }

    _setMessage(msg) {
        if (!this._response) return;
        this._response.textContent = msg || "";
        this._response.hidden = !msg;
    }

    _clearMessage() {
        this._setMessage("");
        this._setInvalid(false);
        this._setValid(false);
    }
}

customElements.define("number-input", numberInput);

class textareaInput extends HTMLElement {
    constructor() {
        super();
        this._input = null;
        this._required = true;
        this._validation = null;
        this._response = null;
    }

    connectedCallback() {
        this._id = generateID("taskElement");
        this.setAttribute("data-field", ""); // This indicates data can be processed
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-group");

        const validation = this.dataset.validation;
        if (validation) {
            this._validation = validation.trim();
        }

        if (this.dataset.label) {
            const label = document.createElement("label");
            label.setAttribute("for", this._id);
            label.classList.add("form-label")
            label.textContent = this.dataset.label;
            wrapper.appendChild(label);
        }

        const input = document.createElement("textarea");
        input.id = this._id;
        input.classList.add("form-input");
        input.required = this._required;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("writingsuggestions", "false");
        input.setAttribute("spellcheck", "off");
        wrapper.appendChild(input);
        this._input = input;

        const checkDiv = document.createElement("div");
        checkDiv.classList.add("form-group-response");

        const validationButton = document.createElement("button");
        validationButton.type = "button";
        validationButton.classList.add("btn", "btn-gray", "btn-small");
        validationButton.textContent = "Tjek";
        checkDiv.appendChild(validationButton);

        const response = document.createElement("div");
        response.classList.add("response-label");
        response.setAttribute("aria-live", "polite");
        checkDiv.appendChild(response);
        this._response = response;

        wrapper.appendChild(checkDiv);

        // Events
        input.addEventListener("input", () => {
            //this._emitStatus();
        });

        validationButton.addEventListener("click", () => {
            const valid = this.isValid();
            this._emitStatus();
            if (valid) {
                if (this._validation) {
                    this._setMessage("Korrekt 👏");
                    this._setValid(true);
                    input.readOnly = true;
                    validationButton.disabled = true;
                } else {
                    this._setMessage("✔️");
                }
                this._setInvalid(false);
                return;
            }
            if (!this.isComplete()) {
                this._setMessage("Du mangler dette felt 👋");
                this._setInvalid(true);
                return;
            }
            if (!valid) {
                this._setMessage("Feltet er ikke udfyldt korrekt 🫤");
                this._setInvalid(true);
                return;
            }
        });

        // Add to host
        this.appendChild(wrapper);
    }

    // API
    getValue() {
        if (this._input.value === null) return "";
        return this._input.value.trim();
    }

    setValue(newValue) {
        this._input.value = newValue;
        this._emitStatus();
    }

    isComplete() {
        if (!this._required) return true; // Always true, if not required
        return !!this.getValue(); // True if has input value
    }

    isValid() {
        const value = this.getValue();
        const validation = this._validation;
        if (this._validation) {
            return (value.toLowerCase() == validation.toLowerCase()); // Input value and validation match
        } else if (value.length > 0) {
            return true; // No validation, only input value
        } else {
            return false; // No input value
        }
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }

    _emitStatus() {
        const field = this.getAttribute("name") || this._id || "";
        this.dispatchEvent(new CustomEvent("field-status-changed", {
            bubbles: true,
            detail: {
                name: field,
                complete: this.isComplete(),
                valid: this.isValid()
            }
        }));
    }

    _setInvalid(isInvalid) {
        if (!this._input) return;
        this._input.setAttribute("aria-invalid", String(isInvalid));
        if (isInvalid) {
            this._input.classList.add("is-invalid");
        } else {
            this._input.classList.remove("is-invalid");
        }
    }

    _setValid(isValid) {
        if (!this._input) return;
        this._input.setAttribute("aria-valid", String(isValid));
        if (isValid) {
            this._input.classList.add("is-valid");
        } else {
            this._input.classList.remove("is-valid");
        }
    }

    _setMessage(msg) {
        if (!this._response) return;
        this._response.textContent = msg || "";
        this._response.hidden = !msg;
    }

    _clearMessage() {
        this._setMessage("");
        this._setInvalid(false);
        this._setValid(false);
    }
}

customElements.define("textarea-input", textareaInput);

class spellcheckInput extends HTMLElement {
    constructor() {
        super();
        this._input = null;
        this._required = true;
        this._validation = null;
        this._response = null;
        this._editable = true;
    }

    connectedCallback() {
        this._id = generateID("taskElement");
        this.setAttribute("data-field", ""); // This indicates data can be processed
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-group");

        if (this.dataset.label) {
            const label = document.createElement("label");
            label.setAttribute("for", this._id);
            label.classList.add("form-label");
            label.textContent = this.dataset.label;
            wrapper.appendChild(label);
        }

        const input = document.createElement("div");
        input.id = this._id;
        input.classList.add("form-input");
        input.setAttribute("contenteditable", (this._editable) ? "plaintext-only" : "false");
        input.setAttribute("autocorrect", "off");
        input.setAttribute("writingsuggestions", "false");
        input.setAttribute("spellcheck", "false");
        wrapper.appendChild(input);
        this._input = input;

        const checkDiv = document.createElement("div");
        checkDiv.classList.add("form-group-response");

        const validationButton = document.createElement("button");
        validationButton.type = "button";
        validationButton.classList.add("btn", "btn-gray", "btn-small");
        validationButton.textContent = "Tjek";
        checkDiv.appendChild(validationButton);

        const response = document.createElement("div");
        response.classList.add("response-label");
        response.setAttribute("aria-live", "polite");
        checkDiv.appendChild(response);
        this._response = response;

        wrapper.appendChild(checkDiv);
        this.appendChild(wrapper);

        const validation = this.dataset.validation;
        if (validation) {
            this._validation = validation.trim();
        }

        // Events
        validationButton.addEventListener("click", () => {
            this.doSpellcheck();
            const valid = this.isValid();
            this._emitStatus();
            if (valid) {
                if (this._validation) {
                    this._setValid(true);
                    this._setMessage("Korrekt 👏");
                    input.contentEditable = false;
                    validationButton.disabled = true;
                } else {
                    this._setMessage("✔️");
                }
                this._setInvalid(false);
                return;
            }
            if (!this.isComplete()) {
                this._setMessage("Du mangler dette felt 👋");
                this._setInvalid(true);
                return;
            }
            if (!valid) {
                this._setMessage("Feltet er ikke udfyldt korrekt 🫤");
                this._setInvalid(true);
                return;
            }
        });
    }

    // API
    getValue() {
        return this._input.innerText.trim();
    }

    setValue(newValue) {
        this._input.innerText = newValue;
        this._emitStatus();
    }

    doSpellcheck() {
        const value = this.getValue().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove all punctuation
        const valueArray = value.split(" "); // Split input value by space
        const validation = this._validation.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove all punctuation from validation
        const validationArray = validation.split(" "); // Split validation by space
        this._editable = false; // Disable editing while checking

        if (this.isValid()) {
            this._input.innerHTML = this.getValue();
        }

        this._input.innerText = ""; // Clear the input
        // Check if each word is in the validation string
        valueArray.forEach(item => {
            const word = item.toLowerCase();
            if (validationArray.includes(word)) {
                // Spelling is correct
                let passedMarker = document.createElement("span");
                if (validationArray.indexOf(word) != valueArray.indexOf(item)) {
                    // Wrong position
                    passedMarker.classList.add("wrong-position");
                }
                passedMarker.innerText = item + " ";
                this._input.appendChild(passedMarker);
            } else {
                // Spelling is incorrect
                let failedMarker = document.createElement("u");
                failedMarker.innerText = item + " ";
                this._input.appendChild(failedMarker);
            }
        });

        this._editable = true; // Re-enable editing
    }

    isComplete() {
        if (!this._required) return true; // Always true, if not required
        return !!this.getValue(); // True if has input value
    }

    isValid() {
        const value = this.getValue().replace(/[^a-zA-Z0-9\s]/g, "");
        const validation = this._validation.replace(/[^a-zA-Z0-9\s]/g, "");
        if (this._validation) {
            return (value.toLowerCase() == validation.toLowerCase()); // Input value and validation match
        } else if (value.length > 0) {
            return true; // No validation, only input value
        } else {
            return false; // No input value
        }
    }

    // Helpers
    _emit(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {detail, bubbles: true}));
    }

    _emitStatus() {
        const field = this.getAttribute("name") || this._id || "";
        this.dispatchEvent(new CustomEvent("field-status-changed", {
            bubbles: true,
            detail: {
                name: field,
                complete: this.isComplete(),
                valid: this.isValid()
            }
        }));
    }

    _setInvalid(isInvalid) {
        if (!this._input) return;
        this._input.setAttribute("aria-invalid", String(isInvalid));
        if (isInvalid) {
            this._input.classList.add("is-invalid");
        } else {
            this._input.classList.remove("is-invalid");
        }
    }

    _setValid(isValid) {
        if (!this._input) return;
        this._input.setAttribute("aria-valid", String(isValid));
        if (isValid) {
            this._input.classList.add("is-valid");
        } else {
            this._input.classList.remove("is-valid");
        }
    }

    _setMessage(msg) {
        if (!this._response) return;
        this._response.textContent = msg || "";
        this._response.hidden = !msg;
    }

    _clearMessage() {
        this._setMessage("");
        this._setInvalid(false);
    }
}

customElements.define("spellcheck-input", spellcheckInput)