import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  participants: DS.hasMany('user'),
  messages: DS.hasMany('message')
});
