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
  },
  entryTable: {
    accepted: "Hyväksytty",
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
