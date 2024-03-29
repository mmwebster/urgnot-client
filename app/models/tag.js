import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  users: DS.hasMany('user'),
  displayData: DS.attr('string')
});
