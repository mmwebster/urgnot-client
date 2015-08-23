import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['entity'],
  classNameBindings: ['type', 'order', 'layer1:layer-1', 'layer2:layer-2'],
  layer1: false,
  layer2: false,

  type: function() {
    return ("type-" + this.get('entity.type'));
  }.property('entity.type'),

  order: function() {
    // debugger;
    return ("order-" + this.get('entityOrder'));
  }.property('entityOrder'),
       
  willInsertElement: function() {
    var type = this.get('entity.type');
    if (type === 'star') {
      this.set('layer1', true);
    } else if (type === 'planet') {
      this.set('layer2', true);
    }
    console.log("Inserted component of (" + type + ")");
  },

  actions: {

    // focus if entity is at layer 2
    focus: function() {
      if (this.get('layer2')) {
        var type = this.get('entity.type');
        console.log('clicked ' + type + ':' + this.get('entityOrder'));
      }
      // if (type === 'star') {
      //   this.toggleProperty('layer1');
      // } else if (type === 'planet') {
      //   this.toggleProperty('layer2');
      // } else {
      //   console.log('un-typed');
      // }
    },

  },
});
