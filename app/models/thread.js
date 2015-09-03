import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'), // currently the uid of the author
  endUser: DS.hasMany('user'),
  organization: DS.belongsTo('organization'),
  messages: DS.hasMany('message')
});
