import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  displayLogin: false,

  createUser: function(data) {
    var newUser = this.store.createRecord('user', {
      id: data.uid,
      email: data.currentUser.email
    });
    newUser.save();
  },

  actions: {
    start: function() {
      this.toggleProperty('displayLogin');
    },
    signIn: function() {
      if (!this.get('session').content.isAuthenticated) {
        var _this = this;

        this.get("session").open("firebase", { 
          provider: 'password',
          email: this.get('email'),
          password: this.get('password')
        }).then(function(data) {
          Ember.debug(data.currentUser);
          var uid = _this.get('controllers.application.currentUser.uid');
          _this.store.find('user', uid).catch(function(error) {
            debugger;
            // no user record found
            var newUser = _this.store.createRecord('user', {
              id: data.uid,
              email: data.currentUser.email
            });
            newUser.save();
          }).then(function(user) {
            // user record found or now created
            _this.transitionToRoute('app');
          });


        }, function(error) {
          console.warn('Incorrect credentials');
        });
      } else {
        console.warn('User is already authenticated');
        // no matter if user loged in already, transition to app
        this.transitionToRoute('app');
      }
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
