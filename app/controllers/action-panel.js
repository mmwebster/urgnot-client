import Ember from 'ember';

export default Ember.Controller.extend({
  actionPanelIsFullscreen: false,
  
  actions: {
    actionPanelFullscreen: function() {
      this.toggleProperty('actionPanelIsFullscreen');
      console.log('full screen status: ' + this.get('actionPanelIsFullscreen'));
    }
  }
});
