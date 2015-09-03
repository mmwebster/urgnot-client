import DS from 'ember-data';

export default DS.Model.extend({
  thread: DS.belongsTo('thread'),
  author: DS.belongsTo('author'),
  date: DS.attr('string'),
  body: DS.attr('string')
});
