import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['entity'],
  classNameBindings: ['type', 'order', 'layer1:layer-1', 'layer2:layer-2'],
  attributeBindings: ['wrapperStyle:style'],     
  layer1: false,
  layer2: false,
  entityRotation: null,

  type: function() {
    return "type-" + this.get('entity.type');
  }.property('entity.type'),

  order: function() {
    return "order-" + this.get('entityOrder');
  }.property('entityOrder'),

  wrapperStyle: function() {
    // degree increments for each sibling
    var rotationIncrements = (360 / this.get('numSiblings'));
    var rotation = rotationIncrements * this.get('entityOrder');
    // save out for use in content rotation correction
    this.set('entityRotation', rotation);
    // return styling
    return "transform: rotate(" + rotation + "deg) !important;";
  }.property(),
       
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
    },

  },
});
