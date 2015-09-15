import Ember from 'ember';

export default Ember.Controller.extend({
  // used to communicate between components in the app
  commLink: {
    active: false,
    data: {}
  },
  commLinkActivated: Ember.observer('commLink', function() {
    if (this.get('commLink.active')) {
      Ember.debug('Comm Link Active - in app/index controller');
    } else {
      Ember.debug('Comm Link Inactive');
    }
  })

});
