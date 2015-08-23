import Ember from 'ember';

export default Ember.Component.extend({
  // bindings
  classNames: ['node'],
  classNameBindings: ['type', 'id', 'index', 'layer1:layer-1', 'layer2:layer-2', 'blurParent:parent-blur', 'isRoot:is-root'],
  attributeBindings: ['wrapperStyle:style'],     
  // properties
  layer1: false,
  layer2: false,
  blurParent: false,
  blurSibling: false,

  init: function() {
    this._super();
    this.set('children', []);
    this.set('siblings', []);
  },

  id: function() {
    return "id-" + this.get('nodeModel.id');
  }.property(),

  index: function() {
    return "index-" + this.get('nodeIndex');
  }.property(),

  type: function() {
    return "type-" + this.get('nodeModel.type');
  }.property(),

  // rotation computation
  wrapperStyle: function() {
    var parent = this.get('parentModel');
    if (parent) {
      // degree increments for each sibling
      var rotationIncrements = (360 / parent.children.length);
      var rotation = rotationIncrements * this.get('nodeIndex');
      // save out for use in content rotation correction
      this.set('rotation', rotation);
      // return styling
      return "transform: rotate(" + rotation + "deg) !important;";
    } else {
      return "";
    }
  }.property('level2'),

  willInsertElement: function() {
    // populate node's parent's children
    parent = this.get('parentComponent');
    if (parent) {
      parent.get('children').pushObject(this);
    }
    // insert all component properties into the js object's properties hash
    switch(this.get('nodeModel.type')) {
      case 'star': 
        this.set('layer1', true);
        break;
      case 'planet':
        this.set('layer2', true);
        break;
    }
  },

  didInsertElement: function() {
    // populate node's siblings, removing this
    var _this = this;
    parent = this.get('parentComponent');
    if (parent) {
      parent.get('children').forEach(function(node) {
        if (_this.toString() !== node.toString()) {
          _this.get('siblings').pushObject(node);
        }
      });
    }
    console.log("Inserted component (" + this.get('nodeModel.type') + ").");
  },

  actions: {
    focus: function() {
      Em.debug('Focusing (' + this.get('nodeModel.type') + ') - (' 
            + this.get('nodeModel.name') + ')');
      // promote this node
      this.set('layer2', false);
      this.set('layer1', true);
      // focus child nodes
      this.get('children').forEach(function(node) {
        node.set('layer2', true);
      });
      // blur parent node
      this.set('parentComponent.layer1', false);
      this.set('parentComponent.blurParent', true);
      // blur siblings
      this.get('siblings').forEach(function(node) {
         node.set('layer2', false); 
      });
    }
  },
});
