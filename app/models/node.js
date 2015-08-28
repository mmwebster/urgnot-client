import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  level: DS.attr('number'),
  displayData: DS.attr('string'), // currently just node type
  parent: DS.belongsTo('node', {inverse: 'children'}), // not to be used for reference
  children: DS.hasMany('node', {inverse: parent}),
  tasks: DS.hasMany('task')
});
