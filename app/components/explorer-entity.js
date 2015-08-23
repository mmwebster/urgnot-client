import Ember from 'ember';

export default Ember.Component.extend({
  // bindings
  classNames: ['entity'],
  classNameBindings: ['type', 'id', 'index', 'layer1:layer-1', 'layer2:layer-2', 'blurParent:parent-blur', 'isRoot:is-root'],
  attributeBindings: ['wrapperStyle:style'],     
  // properties
  layer1: false,
  layer2: false,
  blurredParent: false,
  blurredSibling: false,

  id: function() {
    return "id-" + this.get('node.id');
  }.property('node.id'),

  index: function() {
    return "index-" + this.get('nodeIndex');
  }.property('nodeIndex'),

  type: function() {
    return "type-" + this.get('node.type');
  }.property('node.type'),

  // siblings: function() {
  //   var parent = this.get('parent');
  //   if (parent) {
  //     return parent.children;
  //   } else {
  //     return this.get('node');
  //   }
  // }.property('parent'),

  wrapperStyle: function() {
    // degree increments for each sibling
    var rotationIncrements = (360 / this.get('siblings.length'));
    var rotation = rotationIncrements * this.get('index');
    // save out for use in content rotation correction
    this.set('rotation', rotation);
    // return styling
    return "transform: rotate(" + rotation + "deg) !important;";
  }.property('siblings.length', 'index'),

  willInsertElement: function() {
    debugger;
    // insert all component properties into the js object's properties hash
    var type = this.get('node.type');
    if (type === 'star') {
      this.set('layer1', true);
    } else if (type === 'planet') {
      this.set('layer2', true);
    }
    console.log("Inserted component of (" + type + ").");
  },

  actions: {

    focus: function() {
      // focus if entity is at layer 2
      if (this.get('layer2')) {
        debugger;
        console.log('clicked ' + this.get('entity.type') + ':' + this.get('entityOrder'));
        var entity = this.get('entity');
        // focus node
        this.set('layer2', false);
        this.set('layer1', true);
        // var target = ".id-" + entity.id;
        // $(target).removeClass('layer-2');
        // $(target).addClass('layer-1');
        // focus chidren
        var children = entity.children || {};
        for (var i = 0; i < children.length; i++) {
          target = ".id-" + children[i].id;
          $(target).addClass('layer-2');
        }
        // blur parent node
        var target = ".id-" + this.get('parent.id');
        $(target).addClass('parent-blur');
        $(target).removeClass('layer-1');
        // blur sibling nodes
        var target;
        var siblings = this.get('siblings') || {};
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i].id !== entity.id) {
            target = ".id-" + siblings[i].id;
            $(target).addClass('parent-blur');
            $(target).removeClass('layer-2');
          }
        }
      }
    },
  },
});
