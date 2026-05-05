import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        style={styles.header}
      >
        <Text style={styles.title}>Instellingen</Text>
        <Text style={styles.breadcrumb}>
          Instellingen / <Text style={styles.green}>Privacybeleid</Text>
        </Text>
        <View style={styles.line} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.card}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerBox}>Privacybeleid</Text>

  <Text style={styles.text}>
  Privacybeleid – ModuleMind
  {"\n\n"}
  Laatst bijgewerkt: 27/03/2026
  {"\n\n"}
  Bij ModuleMind hechten we veel waarde aan de privacy van onze gebruikers. Dit privacybeleid legt uit welke informatie we verzamelen, hoe we deze gebruiken en welke rechten jij hebt.
  {"\n\n"}
  1. Verzamelde informatie
  {"\n"}
  Wanneer je onze app gebruikt, kunnen we de volgende gegevens verzamelen:
  {"\n\n"}
  Persoonlijke gegevens
  {"\n"}• Naam en e-mailadres (optioneel, alleen als je een account aanmaakt)
  {"\n\n"}
  Bestanden die je uploadt
  {"\n"}• PDF’s of andere documenten die je gebruikt om opdrachten te genereren
  {"\n\n"}
  App-gebruik gegevens
  {"\n"}• Welke opdrachten je genereert, je voortgang en interacties met de app
  {"\n\n"}
  Technische informatie
  {"\n"}• IP-adres, apparaattype, besturingssysteem, app-versie
  {"\n\n"}
  2. Hoe we informatie gebruiken
  {"\n"}
  We gebruiken jouw gegevens voor de volgende doeleinden:
  {"\n"}• Om opdrachten te genereren uit de PDF’s die je uploadt
  {"\n"}• Om de app te verbeteren en bugs op te lossen
  {"\n"}• Om analyses uit te voeren om de gebruikerservaring te verbeteren
  {"\n"}• Om veiligheidsproblemen en misbruik te voorkomen
  {"\n\n"}
  Belangrijk: We verkopen jouw gegevens niet aan derden en gebruiken ze uitsluitend voor de werking en verbetering van de app.
  {"\n\n"}
  3. Delen van informatie
  {"\n"}
  We kunnen informatie delen met derden alleen in de volgende gevallen:
  {"\n"}• Met dienstverleners die helpen bij het hosten en onderhouden van de app (bijv. cloudservers)
  {"\n"}• Wanneer dit wettelijk verplicht is, of om onze rechten te beschermen
  {"\n\n"}
  Opmerking: Bestanden die je uploadt worden gebruikt door onze AI binnen de app, maar niet gedeeld met derden voor andere doeleinden.
  {"\n\n"}
  4. Opslag en beveiliging
  {"\n"}• We slaan jouw gegevens op in beveiligde servers
  {"\n"}• We gebruiken standaard beveiligingsmaatregelen (encryptie, toegangsbescherming) om je gegevens te beschermen
  {"\n"}• PDF’s die je uploadt worden alleen tijdelijk verwerkt voor het genereren van opdrachten en kunnen daarna verwijderd worden (afhankelijk van jouw instellingen)
  {"\n\n"}
  5. Rechten van gebruikers
  {"\n"}
  Je hebt het recht om:
  {"\n"}• Inzage te vragen in jouw persoonlijke gegevens
  {"\n"}• Verkeerde of onvolledige gegevens te laten corrigeren
  {"\n"}• Je gegevens te laten verwijderen (bijvoorbeeld je account en geüploade bestanden)
  {"\n"}• Je toestemming voor gegevensverwerking in te trekken
  {"\n\n"}
  Neem contact met ons op via contact@modulemind.be om deze rechten uit te oefenen.
  {"\n\n"}
  6. Minderjarigen
  {"\n"}
  Onze app is bedoeld voor leerlingen in het secundair onderwijs. We vragen expliciete toestemming van een ouder/verzorger voor het verwerken van persoonsgegevens van minderjarigen onder 16 jaar.
  {"\n\n"}
  7. Wijzigingen in dit privacybeleid
  {"\n"}
  We kunnen dit beleid van tijd tot tijd aanpassen. De laatste versie wordt altijd in de app gepubliceerd.
  {"\n\n"}
  8. Contact
  {"\n"}
  Als je vragen hebt over dit privacybeleid of de verwerking van jouw gegevens:
  {"\n"}
  E-mail: contact@modulemind.be
</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },
  header: {
    paddingTop: 28,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#777",
  },
  breadcrumb: {
    textAlign: "center",
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
  green: {
    color: "#5CBC4F",
  },
  line: {
    height: 3,
    backgroundColor: "#6BCB59",
    marginTop: 6,
  },
  card: {
    padding: 16,
    paddingBottom: 120, // ruimte voor navbar
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  headerBox: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },
});