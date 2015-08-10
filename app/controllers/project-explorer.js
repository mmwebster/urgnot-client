import Ember from 'ember';

export default Ember.Controller.extend({
  origin1a1EnabledL1: true,
  origin2EnabledL2: true,
  currentLayerTop: 1,
  currentOrderTop: 1,
  currentLevelBottom: 2, 
  pathTree: [{'layer':1, 'order':1}],

  negatePreviousSettings: function() {
    this.set('origin' + this.get('currentLayerTop') + 'a' + this.get('currentOrderTop') + 'EnabledL1', false);
    this.set('origin' + this.get('currentLevelBottom') + 'EnabledL2', false);
  },

  actions: {
    // zoom in on the selected level and order
    focus: function(level, order) {
      // save hierarchy 
      this.get('pathTree').addObject({'level':level, 'order':order});
      // set previous settings to false
      this.negatePreviousSettings();
      // set new settings to true
      this.set('origin' + level + 'a' + order + 'EnabledL1', true);
      this.set('origin' + (level+1) + 'EnabledL2', true);
      // save in the new "current" settings
      this.set('currentLayerTop', level);
      this.set('currentOrderTop', order);
      this.set('currentLevelBottom', level+1);
    },
    blur: function() {
      this.negatePreviousSettings();
      //destroy previous pathTree object 
      this.get('pathTree').removeObject(this.get('pathTree.lastObject'));
      // set new settings to true
      this.set('origin' + this.get('pathTree.lastObject.layer') + 'a' + this.get('pathTree.lastObject.order') + 'EnabledL1', true);
      this.set('origin' + (this.get('pathTree.lastObject.layer')+1) + 'EnabledL2', true);
      // debugger
      // save in the new "current" settings
      // remove object from path hierarchy history
    },
  },
});
