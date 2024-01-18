const fi = {
  controls: {
    aria: {
      prevWeek: "Mene edelliseen viikkoon",
      nextWeek: "Mene seuraavaan viikkoon",
    },
    confirm: "Vahvista",
    deleteEntry: "Poista merkintä",
    editEntry: "Muokkaa merkintää",
    selectWeek: "Viikko",
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
  entryTable: {
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
};

export default fi;
