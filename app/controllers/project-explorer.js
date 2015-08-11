import Ember from 'ember';

export default Ember.Controller.extend({
  origin1a1EnabledL1: true,
  origin2EnabledL2: true,
  currentLayerTop: 1,
  currentOrderTop: 1,
  currentLevelBottom: 2, 
  pathTree: [{'layer':1, 'order':1}],

  negatePreviousSettings: function() {
    // console.log('FIRST' + 'origin' + this.get('pathTree.lastObject.layer') + 'a' + this.get('pathTree.lastObject.order') + 'EnabledL1');
    // console.log('SECOND' + 'origin' + (this.get('pathTree.lastObject.layer')+1) + 'EnabledL2');
    // debugger
    this.set('origin' + this.get('pathTree.lastObject.layer') + 'a' + this.get('pathTree.lastObject.order') + 'EnabledL1', false);
    this.set('origin' + (this.get('pathTree.lastObject.layer')+1) + 'EnabledL2', false);
  },

  actions: {
    // zoom in on the selected layer and order
    focus: function(layer, order) {
      // set previous settings to false
      this.negatePreviousSettings();
      // save hierarchy 
      this.get('pathTree').addObject({'layer':layer, 'order':order});
      // set new settings to true
      this.set('origin' + layer + 'a' + order + 'EnabledL1', true);
      this.set('origin' + (layer+1) + 'EnabledL2', true);
      // save in the new "current" settings
      this.set('currentLayerTop', layer);
      this.set('currentOrderTop', order);
      this.set('currentLevelBottom', layer+1);
    },
    blur: function() {
      if (this.get('pathTree.lastObject') != this.get('pathTree.firstObject')) {
        // set previous settings to false
        this.negatePreviousSettings();
        //destroy previous pathTree object 
        this.get('pathTree').removeObject(this.get('pathTree.lastObject'));
        // set new settings to true
        this.set('origin' + this.get('pathTree.lastObject.layer') + 'a' + this.get('pathTree.lastObject.order') + 'EnabledL1', true);
        this.set('origin' + (this.get('pathTree.lastObject.layer')+1) + 'EnabledL2', true);
        // debugger
        // save in the new "current" settings
        // remove object from path hierarchy history
      } else {
        console.warn('Cannot blur, at top of hierarchy.');
      }
    },
  },
});
