import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

//init select
const select = document.querySelectorAll("select");
M.FormSelect.init(select, { closeOnClick: true });

//Init autocomplete
const autocomplete = document.querySelectorAll(".autocomplete");
M.Autocomplete.init(autocomplete, {
  data: {
    Apple: null,
    Microsoft: null,
    Google: "https://placehold.it/250x250",
  },
});

//Init datepickers
const datepicker = document.querySelectorAll(".datepicker");
// debugger;
M.Datepicker.init(datepicker, { showClearBtn: true, format: "yyyy-mm" });

const dropdown = document.querySelectorAll(".dropdown-trigger");
M.Dropdown.init(dropdown, { closeOnClick: false });

export function getSelectInstance(elem) {
  return M.FormSelect.getInstance(elem);
}

export function getAutocompleteInstance(elem) {
  return M.Autocomplete.getInstance(elem);
}

export function getDatepickerInstance(elem) {
  return M.Datepicker.getInstance(elem);
}
