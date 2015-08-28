import Ember from 'ember';

export default Ember.Controller.extend({
  displayLogin: false,
       
  actions: {
    start: function() {
      this.toggleProperty('displayLogin');
      // debugger;
    },
    submit: function() {
    },
  },
});
