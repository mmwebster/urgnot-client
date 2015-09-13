import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller('application'),
  user: Ember.computed('application.currentUser', function() {
    return this.get('application.currentUser');
  }),

  init: function() {
    this._super();
    this.computeCurrentPanel(); // must compute on init
  },

  currentPanel: "documentExplorer", // set default
  panels: ["documentExplorer"],
  computeCurrentPanel: Ember.observer("currentPanel", function() {
    var _this = this;
    this.get("panels").forEach(function(panel) {
      if (panel === _this.get("currentPanel")) {
        _this.set(panel, true);
      } else {
        _this.set(panel, false);
      }
    });
  }),

  actionData: { // used to send down actions to components
    trigger: false, 
    type: null,
    data: null,
  }, 

  /**
   * Triggers an action in the action panel according to the received action type and data.
   * Var values are dasherized and options can viewed in the switch.
   */
  triggerAction: function(type, data) {
    switch(type) {
      case "edit-document":
        this.set("currentPanel", "documentExplorer"); // set active panel
        var actionData = {
          trigger: true,
          type: "edit-document",
          data: data,
        };
        this.set("actionData", actionData);
        break;
    }
  }
});
