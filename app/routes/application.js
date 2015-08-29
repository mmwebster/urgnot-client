// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get("session").fetch().catch(function() {});
  },
  actions: {
    signIn: function() {
      this.get("session").open("firebase", { 
        provider: 'password',
        email: 'milo.webster@gmail.com',
        password: 'urgnotisrad'
      }).then(function(data) {
        console.log(data.currentUser);
        debugger;
      });

    },

    signOut: function() {

      this.get("session").close();

    }
  }
});
