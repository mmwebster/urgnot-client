import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  node: DS.belongsTo('node'),
  // assignedTo: DS.belongsTo('user'),
  // assignedOnto: DS.belongsTo('node'),
  actionType: DS.attr('string'),
  actionData: DS.attr('string')
});
