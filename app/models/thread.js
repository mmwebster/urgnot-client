import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  endUser: DS.belongsTo('user');
  adminUser: DS.belongsTo('user');
  messages: DS.hasMany('message')
});
