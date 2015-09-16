import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  needs: ['application'],

  displayLogin: false,

  version: Ember.computed(function() {
    return config.version;
  }),

  actions: {
    start: function() {
      this.toggleProperty('displayLogin');
    },
    signIn: function() {
      if (!this.get('session').content.isAuthenticated) {

        var _this = this;

        // auth user, or create and configure if doesn't exist
        this.get("session").open("firebase", { 
          provider: 'password',
          email: this.get('email'),
          password: this.get('password')
        }).then(function(data) {
          Ember.debug("Firebase user is '" + data.currentUser.email + "' w/ uid: '" + data.uid + "'.");
          _this.store.find('user', data.uid).then(function(user) {
            // user record found
            Ember.debug("User record found for '" + user.get('email') + "'");
            // Transitioning to app index
            Ember.debug("Transitioning to app index.");
            _this.transitionToRoute('app');
          }, function(reason) {
            // user record not found (not catching any other errors at the moment)
            Ember.debug('No user record found; creating user record.');
            var newUser = _this.store.createRecord('user', {
              id: data.uid,
              email: data.currentUser.email
            });

            // auto map this new user with an organization based on their email domain
            _this.store.find('organization', {
              orderBy: 'email',
              equalTo: 'ucsc.edu'
            }).then(function(orgs) {
              // Retrieved records under the given email domain
              var emailDomain = data.currentUser.email.split('@')[1];
              Ember.debug("Retrieved records under the domain '" + emailDomain + "'.");
              // search for mappable org
              orgs.forEach(function(org) {
                if(org.get('email') === emailDomain) {
                  // found mapped organization, now add it to the user and save
                  Ember.debug("Mapped organization with domain '" + emailDomain + "'.");
                  newUser.get('endOrganizations').addObject(org);
                  newUser.set('activeOrganizationId', org.get('id'));
                  var saved = org.save().then(function() {
                    // New user saving with inverse relationship
                    Ember.debug("Created new user '" + newUser.get('email') + "'.");
                    return newUser.save();
                  });
                  saved.then(function() {
                    // Transitioning to app index
                    Ember.debug("Transitioning to app index.");
                    _this.transitionToRoute('app');
                  });
                }
              });
            }, function(reason) {
              // Could not find an organization to map with.
              Ember.debug('Could not find an organization to map with.');
              alert("Could not find an organization to map with: " + reason.message);
            });
          });

        }, function() {
          console.warn('Incorrect credentials');
          alert("You entered an incorrect username or password.");
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
