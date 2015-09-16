import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  date: DS.attr('number'),
  author: DS.belongsTo('user', {async: true}),
  authorUid: DS.attr('string'), // currently the uid of the student
  endUser: DS.hasMany('user'),
  organizationId: DS.attr('string'),
  projectId: DS.attr('string'),
  messages: DS.hasMany('message', {async: 'true'})
});
