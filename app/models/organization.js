import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  adminUsers: DS.hasMany('user'),
  endUsers: DS.hasMany('user'),
});
