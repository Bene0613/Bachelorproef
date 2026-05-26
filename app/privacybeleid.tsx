import { ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function PrivacyScreen() {
  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Privacybeleid"
      />

      <SectionHeader title="Privacybeleid" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
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
            {"\n"}• Met dienstverleners die helpen bij het hosten en onderhouden van de app
            {"\n"}• Wanneer dit wettelijk verplicht is, of om onze rechten te beschermen
            {"\n\n"}
            4. Opslag en beveiliging
            {"\n"}• We slaan jouw gegevens op in beveiligde servers
            {"\n"}• We gebruiken encryptie en toegangsbeveiliging
            {"\n"}• PDF’s kunnen tijdelijk verwerkt worden
            {"\n\n"}
            5. Rechten van gebruikers
            {"\n"}• Inzage vragen
            {"\n"}• Gegevens corrigeren
            {"\n"}• Gegevens verwijderen
            {"\n"}• Toestemming intrekken
            {"\n\n"}
            Contact: contact@modulemind.be
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
  },

  text: {
    fontSize: 12,
    color: "#555",
    lineHeight: 20,
  },
});