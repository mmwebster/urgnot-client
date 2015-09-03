import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  date: DS.attr('string'),
  authorUid: DS.attr('string'), // currently the uid of the student
  endUser: DS.hasMany('user'),
  organization: DS.belongsTo('organization'),
  messages: DS.hasMany('message')
});
