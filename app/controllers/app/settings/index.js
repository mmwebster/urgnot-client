import Ember from 'ember';

export default Ember.Controller.extend({
  showAdvanced: false,

  socketedName: function() {
    return this.get('model.name');
  }.property('model.name'),

  socketedEmail: function() {
    return this.get('model.email');
  }.property('model.email'),

  socketedType: function() {
    return this.get('model.type');
  }.property('model.type'),
       
  actions: {
    showAdvancedS: function() {
      this.toggleProperty('showAdvanced');
    }
  }  
});
