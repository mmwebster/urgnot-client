import DS from 'ember-data';

export default DS.Model.extend({
  thread: DS.belongsTo('thread'),
  author: DS.belongsTo('user'),
  date: DS.attr('number'),
  body: DS.attr('string')
});
