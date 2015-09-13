import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  createdAt: DS.attr('date'),
  author: DS.belongsTo('user'),
  content: DS.attr('string'),
  identifier: DS.attr('string') // system name for "special" documents designated by admin
});
