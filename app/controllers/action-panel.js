import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['app/index'],
  actionPanelIsFullscreen: false,
  
  actions: {
    actionPanelFullscreen: function() {
      this.get('controllers.app/index').toggleProperty('hideExplorer');
      // this.toggleProperty('actionPanelIsFullscreen');
      console.log('full screen status: ' + this.get('controllers.app/index.hideExplorer'));
    }
  }
});
