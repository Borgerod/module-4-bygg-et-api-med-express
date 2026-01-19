/*
    It will for the most part contain:*
        - [ ] dictionaries / string-variable-translation used by selects (sort and filter)
        - [ ] definition of forms, it's props and items
        
    *be observant that it could end up containing more that just described after a while 
*/

export const SORT_ORDERS = {
  createdat_asc: "newest",
  createdat_desc: "oldest",
  duedate_asc: "earliest due",
  duedate_desc: "latest due",
  az: "a-z",
  za: "z-a",
};

export const FILTER = {
  period: {
    all: "All",
    today: "Today",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    nextWeek: "Next week",
    thisMonth: "This month",
    nextMonth: "Next month",
  },
  done: {
    all: "Show All", // - done & !done (DEFAULT)
    active: "Active", // -  !done
    completed: "Completed", // -   done
  },
  tags: {
    label: "Tags",
  },
};
