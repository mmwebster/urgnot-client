import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  isAuthenticated: function() {
    return this.get('session.content.isAuthenticated');
  }.property('session.content.isAuthenticated'),

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
          console.log(data.currentUser);

          // create user if doesn't exist
          _this.createUser(data);

          // populate global user
          _this.set('controllers.application.currentUser', {
            'uid': data.uid,
            'email': data.currentUser.email
          });

          // var newOrg = _this.store.createRecord('organization', {
          //   name: "test"
          // }).then(function() {
          //   newOrg.save();
          //   debugger;
          // });
          // newOrg.save();


          _this.transitionToRoute('app');
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
