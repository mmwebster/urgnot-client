import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  adminUsers: DS.hasMany('user', {async: true}),
  endUsers: DS.hasMany('user', {async: true}),
});
