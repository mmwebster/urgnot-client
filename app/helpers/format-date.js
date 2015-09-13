import Ember from 'ember';

export function formatDate(params/*, hash*/) {
  var d = new Date(params[0]);
  var formattedDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
  return formattedDate;
}

export default Ember.Helper.helper(formatDate);
