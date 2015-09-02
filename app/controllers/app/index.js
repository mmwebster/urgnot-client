import Ember from 'ember';

export default Ember.Controller.extend({
  hideExplorer: false,
  didChange: function() {
    console.log('hideExplorer: ' + this.get('hideExplorer'));
  }
});
