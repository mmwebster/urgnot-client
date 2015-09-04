import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  displayLogin: false,

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
          Ember.debug(data.currentUser);
          var uid = _this.get('controllers.application.currentUser.uid');
          _this.store.find('user', uid).catch(function(error) {
            // no user record found create one
            var newUser = _this.store.createRecord('user', {
              id: data.uid,
              email: data.currentUser.email
            });

            // auto map this new user with an organization based on their email domain
            _this.store.find('organization', {
              orderBy: 'email',
              equalTo: 'ucsc.edu'
            }).then(function(records) {
              var emailDomain = data.currentUser.email.split('@')[1];
              records.forEach(function(org) {
                if(org.get('email') == emailDomain) {
                  // found mapped organization, now add it to the user and save
                  newUser.get('endOrganizations').addObject(org);
                  org.save().then(function() {
                    return newUser.save();
                    Em.debug('Created new user.');
                  });
                }
              });
            });

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
