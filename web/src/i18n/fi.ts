const fi = {
  controls: {
    aria: {
      prevWeek: "Mene edelliseen viikkoon",
      nextWeek: "Mene seuraavaan viikkoon",
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
    validation: {
      productRequired: "Tuote on pakollinen tieto",
      activityRequired: "Toiminto on pakollinen tieto",
    },
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
