<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height">
        <v-expansion-panels multiple class="mb-8" v-model="expandedPanelsImprint">
          <v-expansion-panel>
            <v-expansion-panel-header class="font-weight-bold text-uppercase">
              Verantwortliche
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <h2>
                Angaben gemäß § 5 TMG und Verantwortliche für den Inhalt nach § 55 Abs. 2
                RStV
              </h2>
              <ul>
                <li>Lena Schimmel</li>
                <li>Chemnitzstr. 7</li>
                <li>38118 Braunschweig</li>
                <li>
                  E-Mail:
                  <a href="mailto:mail@schnelltestrechner.de"
                    >mail@schnelltestrechner.de</a
                  >
                </li>
              </ul>
              <p>
                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
                Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
                angeforderter Werbung und Informationsmaterialien wird hiermit
                ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich
                ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von
                Werbeinformationen, etwa durch Spam-Mails, vor.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="font-weight-bold text-uppercase">
              Datenschutz
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                Bei der Nutzung dieser Webseite werden keine personenbezogenen Daten,
                insbesondere keine Gesundheitsdaten erhoben, da alle Eingaben lokal im
                Browser verarbeitet werden. Es werden keine Cookies o.Ä. verwendet, und
                keine Anfragen an andere Anbieter und Domains gemacht.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="font-weight-bold text-uppercase">
              Haftung für Inhalte
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                Die Inhalte meiner Seiten wurden mit größter Sorgfalt erstellt. Für die
                Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch
                keine Gewähr übernehmen. Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG
                für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch
                nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
                überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
                von entsprechenden Rechtsverletzungen werde ich diese Inhalte umgehend
                entfernen.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="font-weight-bold text-uppercase">
              Haftung für Links
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                Mein Angebot enthält Links zu externen Webseiten Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
                Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
                verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
                auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
                Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
                Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte
                einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                Rechtsverletzungen werde ich derartige Links umgehend entfernen.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Imprint",
  props: {
  },
  data: () => ({
    expandedPanelsImprint: [0, 1, 2, 3],
  }),
};
</script>
<style scoped></style>
