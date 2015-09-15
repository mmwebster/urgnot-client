import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['action-panel'],
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

  commLinkActive: Ember.observer('commLink.active', function() {
    if (this.get('commLink.active')) {
      Ember.debug('Comm Link Active - in actionPanel component');

      // actions to be taken at the action-panel level
      switch(this.get('commLink.type')) {
        case "edit-document":
          this.set("currentPanel", "documentExplorer"); // set active panel
          break;
      }
      // show feedback
      var _this = this;
      this.set('receivingAction', true);
      Ember.run.later(function() {
        _this.set('receivingAction', false);
      }, 600);
    } else {
      Ember.debug('Comm Link Inactive');
    }
  }),

  actionData: Ember.computed('actionDataBuffer.trigger', function() {
    return this.get('actionDataBuffer');
  }),

  actionDataBuffer: { // used to send down actions to children
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
  },

  actions: {
    // TEMP for testing
    trig: function() {
      this.set('someProp', 'hey');
      this.triggerAction("edit-document", {
        identifier: "research-plan",
        defaultName: "Research Plan",
        placeholder: "Get started outlining your research plan!",
        defaultContent: ""
      });
      return false;
    }
  }

});
