## Input til øvelser

- Knap med lyd
    ```
    <audio-player data-file="numbers/Numbers_01.mp3"></audio-player>
    ```
    (Afspilleren finder selv audio-mappen)

- Tekstinput med valgfri validering
    ```
    <single-input data-label="Hvad hørte du?" data-validation="ingenting"></single-input>
    ```

- Nummerinput med valgfri validering
    ```
    <number-input data-label="Hvad mange ser du?" data-validation="2"></number-input>
    ```

- Tekstboks
    ```
    <textarea-input data-label="Skriv en historie"></textarea-input>
    ```

- Multiple choice med radio og valfri validering
    ```
    <multi-choice data-label="Hvad vil du svare?" data-type="radio" data-options="Aap, Naamik" data-validation="1"></multi-choice>
    ```

- Multiple choice med checkbokse
    ```
    <multi-choice data-label="Hvad mener du?" data-type="checkbox" data-options="Aap, Naamik, Immaqa"></multi-choice>
    ```

- Multiple tekstinput, med eller unden radio og valgfri validering
    ```
    <multi-input data-label="Bøj ordet 'bil'" data-radios="true" data-labels="Ental, Flertal" data-validation="bil, biler" data-radios-validation="1"></multi-choice>
    ```

- Match par
    ```
    <match-pairs data-first="bil, bibel, bus" data-second="biili, biibili, busi"></match-pairs>
    ```

- Feedback
    ```
    <feedback-message data-content="Godt klaret!"></feedback-message>
    ```

Eksempel:
```
{% exerciseItem %}
Indsæt tekst, billeder og inputs her
{% endexerciseItem %}
```