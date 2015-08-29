import Ember from 'ember';

export default Ember.Controller.extend({
  displayLogin: false,
       
  actions: {
    start: function() {
      this.toggleProperty('displayLogin');
    },
    submit: function() {
      var newUser = this.store.createRecord('user', {
        name: "TS V1",
        email: this.get('email'),
        password: this.get('password'),
        type: "student"
      });
      newUser.save();
    },
  },
});
