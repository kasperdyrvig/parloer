# Copyright

&copy; Kasper Dyrvig.

All rights reserved. Do not mass distribute links to this app, like in large groups on social media. Thank you.

Alle rettigheder forbeholdt. Denne app er lavet på et privat og frivilligt initiativ. Link til denne app må ikke massedistribueres, f.eks. i store grupper på sociale medier.


# Vedligeholdelse

## Input i øvelser

- Billede
    ```
    <image-illustration data-file="nature/niisa.jpg" data-alt="Tegning af et marsvin"></image-illustration>
    ```
    (Billedet finder selv images-mappen)

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
    <multi-input data-label="Bøj ordet 'bil'" data-radios="true" data-labels="Ental, Flertal" data-validation="bil, biler" data-radios-validation="1"></multi-input>
    ```

- Match par
    ```
    <match-pairs data-first="bil, bibel, bus" data-second="biili, biibili, busi"></match-pairs>
    ```

- Feedback
    ```
    <feedback-message data-content="Godt klaret!"></feedback-message>
    ```

- Hjælpetekst
    ```
    {% helpContent "Gloser" %}

    Her er der hjælp at hente

    {% endhelpContent %}
    ```

Eksempel:
```
{% exerciseItem %}
Indsæt tekst, billeder og inputs her
{% endexerciseItem %}
```