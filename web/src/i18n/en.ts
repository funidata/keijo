const en = {
  controls: {
    aria: {
      prevWeek: "Go to previous week",
      nextWeek: "Go to next week",
    },
    cancel: "Cancel",
    close: "Close",
    confirmDelete: "Confirm delete",
    confirmDeleteForDialog: "Really delete this entry?",
    deleteEntry: "Delete entry",
    editEntry: "Edit entry",
    endDate: "To",
    selectWeek: "Week",
    startDate: "From",
    openMenu: "Open menu",
    useDarkMode: "Dark Mode",
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
  entryDialog: {
    title: "Add New Entry",
    date: "Date",
    description: "Comment",
    duration: "Duration",
    reset: "Reset",
    submit: "Save",
    product: "Product",
    activity: "Function",
    issue: "Issue",
    client: "Client",
    noSelection: "No selection",
    clear: "Clear",
    delete: "Delete",
    editingNote:
      "You are editing an existing entry. Note that this entry will move to the end of the list. This is due to Netvisor API not supporting actually editing entries, rather the old entry will be deleted and a new one created in its place.",
    openStatusNote:
      "This entry has been left with an open acceptance status in Netvisor. You can either save the entry as is with Keijo or switch to Netvisor and update the status there.",
    validation: {
      productRequired: "Product is required",
      activityRequired: "Function is required",
      descriptionRequired: "Description is required.",
      ticketOrDescriptionRequired: "Description is required if there is no relevant issue.",
    },
  },
  entryTable: {
    accepted: "Accepted",
    paid: "Paid",
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
    noEntries: "No entries",
    open: "Open",
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
