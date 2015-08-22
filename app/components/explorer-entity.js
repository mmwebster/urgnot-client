import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isTop:explorer'],
  layer1: false,
  layer2: false,
  willInsertElement: function() {
    var type = this.get('model.type');
    if(typeof type == 'undefined') {
      // debugger;
    }
    if (type == 'star') {
      this.set('layer1', true);
    } else if (type == 'planet') {
      this.set('layer2', true);
    }
    console.log("Inserted component of (" + type + ")");
  },
  actions: {

    focus: function() {
      if (this.get('model.type') == 'star') {
        this.toggleProperty('layer1');
      } else if (this.get('model.type') == 'planet') {
        this.toggleProperty('layer2');
      } else {
        console.log('un-typed');
      }
    },

  },
});
