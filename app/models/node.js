import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  organizationId: DS.attr('string'), // only for isRoot:true nodes
  isRoot: DS.attr('boolean'),
  level: DS.attr('number'),
  displayData: DS.attr('string'), // optional type of cellestial entity
  parent: DS.belongsTo('node', {inverse: 'children'}), // not to be used for reference
  children: DS.hasMany('node', {inverse: 'parent'}),
  tasks: DS.hasMany('task', {async: true}),
  color: DS.attr('string'), // optional color of entity

  // Computed
  typeClass: Ember.computed('displayData', function() {
    var type = "type-"; // start of classname
    if (this.get("displayData")) {
      type += this.get("displayData");
    } else {
      switch(this.get("level")) {
        case 1:
          type += "star";
          break;
        case 2:
          type += "planet";
          break;
        case 3:
          type += "moon";
          break;
        case 4:
          type += "crater";
          break;
      }
    }
    return type;
  }),
  colorStyle: Ember.computed('color', function() {
    var color = "rgba(0,0,0,0)"; // default
    if (this.get('color')) {
      // set custom color
      color = this.get('color');
    } else {
      // set type specific default colors
      switch(this.get('level')) {
        case 2: // planet
          color = "#930";
          break;
      }
    }
    return color;
  })
});
