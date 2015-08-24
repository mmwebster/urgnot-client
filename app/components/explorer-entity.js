import Ember from 'ember';

export default Ember.Component.extend({
  // bindings
  classNames: ['node'],
  classNameBindings: ['type', 'id', 'index', 'layer1:layer-1', 'layer2:layer-2', 'blurParent:parent-blur', 'isRoot:is-root', 'allowContentTransition', 'scaleDown'],
  attributeBindings: ['wrapperStyle:style'],     
  // properties
  layer1: false,
  layer2: false,
  blurParent: false,
  allowContentTransition: false,

  init: function() {
    this._super();
    // set current node if is root
    if (this.get('isRoot')) {
      Window.projectExplorer = {};
      Window.projectExplorer.currentNode = this;
    }
    // set children and siblings arrays local this component instance
    this.set('children', []);
    this.set('siblings', []);
  },

  // sumarize content for layer2 nodes
  name: function() {
    if (this.get('layer2')) {
      return this.get('nodeModel.name').split(" ")[0];
    } else {
      return this.get('nodeModel.name');
    }
  }.property('layer2'),

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
    var output = "";
    // if is not root and node is at layer 2
    if (parent) {
      // degree increments for each sibling
      var rotationIncrements = (360 / parent.children.length);
      var rotation = rotationIncrements * this.get('nodeIndex');
      if (!this.get('layer1') && !this.get('layer2')) {
        rotation = -360;
      }
      // save out for use in content rotation correction
      this.set('rotation', rotation);
      // return styling
      output = "transform: rotate(" + rotation + "deg) !important;";
    }  
    // confirm string is safe, non integer operations will always result in NaN
    return new Ember.Handlebars.SafeString(output);
  }.property('layer2', 'parentModel'),

  willInsertElement: function() {
    // populate node's parent's children
    parent = this.get('parentComponent');
    if (parent) {
      parent.get('children').pushObject(this);
    }
    // set top level w/o animation
    if (this.get('nodeModel.type') === 'star') {
        this.set('layer1', true);
        this.set('scaleDown', true);
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
    // upon full hiearchy insertion (page load) animate in layers 
    _this = this;
    switch(this.get('nodeModel.type')) {
      case 'planet':
        Ember.run.next(function() {
          _this.set('layer2', true);
        });
        break;
      case 'star':
        Ember.run.next(function() {
          _this.set('scaleDown', false);
        });
        break;
    }
    console.log("Inserted component (" + this.get('nodeModel.type') + ").");
  },

  actions: {
    focus: function() {
      Em.debug('Focusing (' + this.get('nodeModel.type') + ') - (' 
            + this.get('nodeModel.name') + ')');

      // reset current node - for use in project explorer interfacing
      Window.projectExplorer.currentNode = this;

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
