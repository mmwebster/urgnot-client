import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  assignedTo: DS.belongsTo('user'),
  assignedOnto: DS.belongsTo('node'),
  completed: DS.attr('boolean'),
  actionType: DS.attr('number'),
  actionData: DS.attr('string')
});
