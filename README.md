# Copyright

&copy; Kasper Dyrvig.

All rights reserved. Do not mass distribute links to this app, like in large groups on social media. Thank you.

Alle rettigheder forbeholdt. Denne app er lavet på et privat og frivilligt initiativ. Link til denne app må ikke massedistribueres, f.eks. i store grupper på sociale medier.


# Vedligeholdelse

## Input i øvelser

Billede (Billedet finder selv images-mappen)
```
<image-illustration data-file="nature/niisa.jpg" data-alt="Tegning af et marsvin"></image-illustration>
```

Knap med lyd

- Standard (Afspilleren finder selv audio-mappen)
    ```
    <audio-player data-file="numbers/Numbers_01.mp3"></audio-player>
    ```

- Vis tekst ved siden af knappen
    ```
    <audio-player data-file="numbers/Numbers_01.mp3" data-label="Aluu"></audio-player>
    ```

- Ekstra knap til langsom afspilning
    ```
    <audio-player data-file="numbers/Numbers_01.mp3" data-enable-slow="true"></audio-player>
    ```

Tekstinput med valgfri validering
```
<single-input data-label="Hvad hørte du?" data-validation="ingenting"></single-input>
```

Nummerinput med valgfri validering
```
<number-input data-label="Hvad mange ser du?" data-validation="2"></number-input>
```

Tekstboks
```
<textarea-input data-label="Skriv en historie"></textarea-input>
```

Multiple choice med valgfri validation og valgfri randomizer

- Radio
    ```
    <multi-choice data-label="Hvad vil du svare?" data-type="radio" data-options="Aap, Naamik" data-validation="1" data-random="true"></multi-choice>
    ```

- Radio men med knaper
    ```
    <multi-choice data-label="Hvad vil du svare?" data-type="button" data-options="Aap, Naamik" data-validation="1" data-random="true"></multi-choice>
    ```

- Tjekbokse
    ```
    <multi-choice data-label="Hvad mener du?" data-type="checkbox" data-options="Aap, Naamik, Immaqa" data-random="true"></multi-choice>
    ```

Multiple tekstinput, med eller unden radio og valgfri validering
```
<multi-input data-label="Bøj ordet 'bil'" data-radios="true" data-labels="Ental, Flertal" data-validation="bil, biler" data-radios-validation="1"></multi-input>
```

Match par
```
<match-pairs data-first="bil, bibel, bus" data-second="biili, biibili, busi"></match-pairs>
```

Dissekere ord
```
<word-dissector data-prompt="Ajunngilatit?" data-validation="Har du det godt"></word-dissector>
```
_Note:_ Understøtter ikke at svar gemmes.

Feedback
```
<feedback-message data-content="Godt klaret!"></feedback-message>
```

Hjælpetekst
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

## Indstillinger på øvelser

- `tags` er altid `homework`
- `layout` er altid `exercise` (kan udelades hvis `externalLink` er brugt)
- `partOfLesson` skal have nummeret på lektionen
- `sortNumber` angiver hvor i rækkefølgen denne øvelse skal være
- `previewText` er en tekst på oversigten af øvelser i lektionen
- `onPageTitle` er titlen på øvelsen
- `onPageDescription` er en tekst som vises i starten af øvelsen
- `linkText` er tekten på knappen til at åbne øvelsen
- `showScore` skjuler optællingen af rigtige svar, hvis den er sat til `false`
- `disableSubmit` skjuler muligheden for at sende svaret til læreren, hvis sat til `true`
- `externalLink` åbner en ekstern side i stedet for en intern øvelse