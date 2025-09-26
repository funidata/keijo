const en = {
  controls: {
    aria: {
      prevWeek: "Go to previous week",
      nextWeek: "Go to next week",
      currentWeek: "Go to current week",
    },
    cancel: "Cancel",
    close: "Close",
    confirmDelete: "Confirm delete",
    confirmDeleteForDialog: "Really delete this entry?",
    addEntry: "Add New Entry",
    addEntryWithDate: "Add New Entry on {{date}}",
    deleteEntry: "Delete entry",
    editEntry: "Edit entry",
    selectWeek: "Week",
    openMenu: "Open menu",
    useDarkMode: "Dark Mode",
    selectLanguage: "Select language",
    settingsMenu: "Settings",
    defaultsView: "Default Values",
    jiraConnect: "Connect to Jira",
    jiraDisconnect: "Disconnect from Jira",
    showWeekend: "Show Weekend",
    hideWeekend: "Hide Weekend",
    dateRange: "Date Range",
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
    unknownError: "Unknown error occured. Please get in touch with Team Fox.",
    notFound: "Page was not found. Please check the address.",
    oldWeekParamFormat:
      "The address contains a week number parameter in the old format. Please go to the frontpage, after which you can continue using Keijo as usual.",
    invalidWeekParam: "Given week parameter is not valid.",
  },
  entryDialog: {
    title: { create: "Add New Entry", edit: "Edit Entry" },
    setDefaultsTitle: "Workday Entry Default Values",
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
    totalHoursToday: "Time on selected day before this entry",
    setRemainingHours: "Set remaining hours automatically",
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
    holiday: "Holiday",
    weekend: "Weekend",
    vacation: "Vacation",
    flexLeave: "Flex Leave",
    holidayPayLeave: "Holiday Pay Leave",
    sickLeave: "Sick Leave",
    unknownEntry: "Unknown entry type",
    unknownEntryNote: "Use Netvisor for this type of entry.",
    totalHoursInWeek: "Total hours this week",
    totalHoursInRange: "Total hours in range",
    addZeroEntry: "Add Zero Entry",
    zeroEntryAlert: "Entry with zero hours is required for flex leave.",
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
  jira: {
    issueGroups: {
      recent: "Recent",
      keySearchResults: "Search Results (Issue Key)",
      textSearchResults: "Search Results (Title)",
      searchResults: "Search Results",
      noSearchResults: "No results",
      typeToSearch: "Start typing to search Jira by issue key and title",
    },
    connectNotificationTitle: "New: Jira Integration",
    connectNotification1:
      "Keijo now supports reading issue data from Jira to make issue selection easier. You have to connect Keijo to Jira using your own Atlassian account to enable these features.",
    connectNotification2:
      "If you hide this notification, you can always connect later via the settings menu.",
    infoDialog: {
      title: "Keijo-Jira",
      // Site could also be set dynamically from server or simply by <your-company>.atlassian.net
      content:
        "You will be redirected to authorize Keijo to use Jira. Login on Atlassian site and choose to authorize appropriate site e.g., funidata.atlassian.net from the dropdown.",
    },
  },
};

export default en;
