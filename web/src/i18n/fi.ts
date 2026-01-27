const fi = {
  controls: {
    aria: {
      prevWeek: "Näytä edellinen viikko",
      nextWeek: "Näytä seuraava viikko",
      currentWeek: "Näytä kuluva viikko",
    },
    cancel: "Peruuta",
    close: "Sulje",
    confirmDelete: "Vahvista poisto",
    confirmDeleteForDialog: "Vahvista merkinnän poisto",
    addEntry: "Lisää työaikakirjaus",
    addEntryWithDate: "Lisää työaikakirjaus {{date}}",
    deleteEntry: "Poista merkintä",
    editEntry: "Muokkaa merkintää",
    selectWeek: "Viikko",
    openMenu: "Avaa valikko",
    useDarkMode: "Synkkyys",
    selectLanguage: "Valitse kieli",
    settingsMenu: "Asetukset",
    defaultsView: "Oletusarvot",
    jiraConnect: "Yhdistä Jiraan",
    jiraDisconnect: "Katkaise Jira-yhteys",
    showWeekend: "Näytä Viikonloppu",
    hideWeekend: "Piilota Viikonloppu",
    dateRange: "Aikaväli",
  },
  dimensionNames: {
    product: "Tuote",
    activity: "Toiminto",
    issue: "Tiketti",
    client: "Asiakas",
  },
  errors: {
    error: "Virhe",
    missingEmployeeNumber:
      "Palkansaajanumeroasi ei löytynyt HTTP-otsakkeista. Keijoa ei voi käyttää ilman tätä tietoa. Ilmoita ongelmasta esihenkilöllesi.",
    unknownError: "Keijo kohtasi tuntemattoman virheen. Ota yhteyttä Kettu-tiimiin.",
    notFound: "Pyydettyä sivua ei löytynyt. Tarkasta osoite.",
    oldWeekParamFormat:
      "Sivun osoitteessa on vanhan muotoinen viikkoparametri. Mene ensin etusivulle, jonka jälkeen voit jatkaa käyttöä normaalisti.",
    invalidWeekParam: "Annettu viikkoparametri ei ole kelvollinen.",
  },
  entryDialog: {
    title: { create: "Lisää työaikakirjaus", edit: "Muokkaa kirjausta" },
    setDefaultsTitle: "Työaikakirjauksen oletusarvot",
    date: "Päivämäärä",
    description: "Kommentti",
    duration: "Kesto",
    reset: "Palauta",
    submit: "Tallenna",
    product: "Tuote",
    activity: "Toiminto",
    issue: "Tiketti",
    client: "Asiakas",
    noSelection: "Ei valintaa",
    clear: "Tyhjennä",
    delete: "Poista",
    editingNote:
      "Olet muokkaamassa olemassa olevaa kirjausta. Huomaa, että muokattu kirjaus tulee siirtymään listan viimeiseksi. Tämä johtuu siitä, että Netvisor API ei tue kirjauksen muokkaamista, vaan pellin alla vanha poistetaan ja sen tilalle luodaan uusi kirjaus.",
    openStatusNote:
      "Tämä kirjaus on jätetty Netvisorissa avoimeen tilaan. Voit muuttaa sen kuitatuksi Keijossa tallentamalla kirjauksen sellaisenaan tai vaihtoehtoisesti käydä päivittämässä tilan Netvisorin kautta.",
    validation: {
      productRequired: "Tuote on pakollinen tieto.",
      activityRequired: "Toiminto on pakollinen tieto.",
      descriptionRequired: "Kommentti on pakollinen tieto.",
      ticketOrDescriptionRequired: "Lisää kommentti, mikäli työlle ei löydy tikettiä.",
      issueInOptions: "Tiketin pitää olla jokin vaihtoehdoista",
    },
    totalHoursToday: "Päivän työaika ennen tätä kirjausta",
    setRemainingHours: "Aseta jäljellä olevat tunnit automaattisesti",
  },
  entryTable: {
    accepted: "Hyväksytty",
    paid: "Maksettu",
    head: {
      type: "Tyyppi",
      duration: "Kesto (h)",
    },
    loading: "Lataan kirjauksia...",
    tabs: {
      aria: "Valitse selaustapa",
      browseByWeek: "Selaa viikkoja",
      browseByDates: "Hae päivämäärillä",
    },
    noEntries: "Ei merkintöjä",
    open: "Avoin",
    holiday: "Vapaapäivä",
    weekend: "Viikonloppu",
    vacation: "Vuosiloma",
    flexLeave: "Saldovapaa",
    holidayPayLeave: "Lomarahavapaa",
    sickLeave: "Sairauspoissaolo",
    unknownEntry: "Tuntematon kirjauslaji",
    unknownEntryNote: "Käytä Netvisoria tämän kirjauslajin tarkastelemiseen ja muokkamiseen.",
    totalHoursInWeek: "Työaika tällä viikolla",
    totalHoursInRange: "Työaika valitulla jaksolla",
    addZeroEntry: "Lisää nollatuntikirjaus",
    zeroEntryAlert: "Nollatuntikirjaus vaaditaan saldovapaan laskemiseen.",
  },
  notifications: {
    addEntry: {
      success: "Uusi työaikakirjaus lisätty.",
    },
    editEntry: {
      success: "Työaikakirjaus päivitetty.",
    },
    deleteEntry: {
      success: "Työaikakirjaus poistettu.",
    },
  },
  titles: {
    workdayBrowser: "Työaikakirjaukset",
  },
  jira: {
    issueGroups: {
      recent: "Viimeaikaiset",
      keySearchResults: "Hakutulokset (tiketin tunnus)",
      textSearchResults: "Hakutulokset (otsikko)",
      searchResults: "Hakutulokset",
      noSearchResults: "Ei hakutuloksia",
      typeToSearch: "Kirjoita hakeaksesi Jirasta tiketin tunnuksella tai otsikolla",
      loading: "Haetaan...",
    },
    connectNotificationTitle: "Uutta: Jira-integraatio",
    connectNotification1:
      "Keijo voi lukea tikettien tietoja Jirasta kirjausten helpottamiseksi. Voit ottaa Jira-ominaisuudet käyttöön yhdistämällä Keijon Jiraan henkilökohtaisen Atlassian-tilisi kautta.",
    connectNotification2:
      "Voit myös sulkea tämän huomautuksen ja halutessasi yhdistää Jiraan myöhemmin asetusvalikon kautta.",
    infoDialog: {
      title: "Keijo-Jira",
      // Site could also be set dynamically from server or simply by <your-company>.atlassian.net
      content:
        "Sinut ohjataan valtuuttamaan Jira-integraatio käyttäjälläsi. Kirjaudu Atlassianin sivulla ja valitse valikosta Keijolle oikeudet käytettävälle sivulle esim. funidata.atlassian.net.",
    },
  },
};

export default fi;
