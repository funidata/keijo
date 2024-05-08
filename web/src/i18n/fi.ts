const fi = {
  controls: {
    aria: {
      prevWeek: "Mene edelliseen viikkoon",
      nextWeek: "Mene seuraavaan viikkoon",
      currentWeek: "Mene nykyiseen viikkoon",
    },
    cancel: "Peruuta",
    close: "Sulje",
    confirmDelete: "Vahvista poisto",
    confirmDeleteForDialog: "Vahvista merkinnän poisto",
    deleteEntry: "Poista merkintä",
    editEntry: "Muokkaa merkintää",
    endDate: "Loppu",
    selectWeek: "Viikko",
    startDate: "Alku",
    openMenu: "Avaa valikko",
    useDarkMode: "Synkkyys",
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
  },
  entryDialog: {
    title: "Lisää työaikakirjaus",
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
    },
    totalHoursToday: "Päivän työaika ennen tätä kirjausta",
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
    sickLeave: "Sairauspoissaolo",
    unknownEntry: "Tuntematon kirjauslaji",
    unknownEntryNote: "Käytä Netvisoria tämän kirjauslajin tarkastelemiseen ja muokkamiseen.",
    totalHoursInWeek: "Työaika tällä viikolla",
    totalHoursInRange: "Työaika valitulla jaksolla",
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
};

export default fi;
