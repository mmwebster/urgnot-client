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

  action: { // used to send down actions to components
    trigger: false,
    type: null,
    data: {
      identifier: null,
      defaultName: null,
      defaultContent: null
    },
  },

  /**
   * Triggers an action in the action panel according to the received action type and data.
   * Var values are dasherized and options can viewed in the switch.
   */
  triggerAction: function(type, data) {
    var data = JSON.parse(data); // must parse out JSON
    switch(type) {
      case "edit-document":
        this.set("currentPanel", "documentExplorer"); // set active panel
        var action = {
          trigger: true,
          type: "edit-document",
          data: data,
        };
        this.set("action", action);
        break;
    }
    // show feedback
    var _this = this;
    this.set('receivingAction', true);
    Ember.run.later(function() {
      _this.set('receivingAction', false);
    }, 600);
  },

  actions: {
    // TEMP for testing
    trig: function() {
      this.triggerAction("edit-document", {
        identifier: "research-plan",
        defaultName: "Research Plan",
        placeholder: "Get started outlining your research plan!",
        defaultContent: ""
      });
    }
  }

});
