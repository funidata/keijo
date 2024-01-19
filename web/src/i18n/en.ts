const en = {
  controls: {
    aria: {
      prevWeek: "Go to previous week",
      nextWeek: "Go to next week",
    },
    confirm: "Confirm",
    deleteEntry: "Delete entry",
    editEntry: "Edit entry",
    endDate: "To",
    selectWeek: "Week",
    startDate: "From",
  },
  dimensionNames: {
    product: "Product",
    activity: "Activity",
    issue: "Issue",
    client: "Client",
  },
  errors: {
    error: "Error",
    missingEmployeeNumber:
      "Your employee number was not found in HTTP headers. Keijo cannot be used without this information. Please report this problem to your superior.",
  },
  entryTable: {
    head: {
      type: "Type",
      duration: "Duration (h)",
    },
    loading: "Loading workday data...",
    tabs: {
      aria: "Choose how to browse",
      browseByWeek: "Browse by week",
      browseByDates: "Browse by dates",
    },
  },
  notifications: {
    addEntry: {
      success: "Workday entry created.",
    },
    editEntry: {
      success: "Workday entry updated.",
    },
    deleteEntry: {
      success: "Workday entry deleted.",
    },
  },
  titles: {
    workdayBrowser: "Entries",
  },
};

export default en;
