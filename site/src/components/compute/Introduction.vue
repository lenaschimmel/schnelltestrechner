<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="font-weight-bold text-uppercase"
      color="blue lighten-3"
    >
      Einleitung
    </v-expansion-panel-header>
    <v-expansion-panel-content color="blue lighten-5" class="pt-4">
      <p>
        Wie zuverlässig eigentlich ein Schnell- oder Selbst-Test auf Sars-CoV-2 ist,
        <b>lässt sich unmöglich allgemein beantworten.</b> Neben den Eigenschaften des
        eigentlichen Tests (<Info
          text="Sensitivität"
          content="Wahrscheinlichkeit, dass eine infizierte Person ein positives Ergebnis bekommt"
        />
        und
        <Info
          text="Spezifität"
          content="Wahrscheinlichkeit, dass eine gesunde Person ein negatives Ergebnis bekommt"
        />) spielt auch die sogenannte
        <Info
          text="Vortestwahrscheinlichkeit"
          content="Wahrscheinlichkeit, dass die Person infiziert ist, unabhänging vom Test"
        />
        eine enorm große Rolle. Und die hängt grundsätzlich von der
        <i>Inzidenz</i>, sowie dem privaten und beruflichen <i>Risiko-Profil</i> ab. Wer
        außerdem <i>Symptome</i> hat, hat eine zusätzlich stark erhöhte
        Vortestwahrscheinlichkeit.
      </p>

      <p>Um in einem konkreten Fall das Ergebnis zu bewerten, müsste man also:</p>
      <ul class="mb-4">
        <li>
          Die mathematischen Grundprinzipien verstehen, insbesondere das scheinbare
          paradoxe Phänomen des
          <a href="https://de.wikipedia.org/wiki/Pr%C3%A4valenzfehler" target="_blank"
            >Prävalenzfehlers</a
          >
        </li>
        <li>Alle oben genannten Werte recherchieren bzw. abschätzen</li>
        <li>Diese Werte in Formeln einsetzen und Ergebnisse ausrechnen</li>
      </ul>

      <p>
        <b>
          Diese Seite möchte bei all diesen Schritten helfen. Der Fokus liegt auf einem
          Test für eine bestimmte Person zu einem bestimmten Zeitpunkt, also nicht auf
          Abschätzungen für die Gesamtbevölkerung.
        </b>
      </p>
      <p>
        Details zur Funktionsweise finden sich im Tab "Weitere Infos" sowie an den
        entsprechenden Stellen dieser Seite hinter den
        <Info type="Dialog">Dieser Info-Button ist nur ein Beispiel</Info>-Buttons.
      </p>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import Info from "../Info.vue";
export default {
  components: {
    Info,
  },
  name: "Introduction",
};
</script>