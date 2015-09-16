import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  author: DS.belongsTo('user', {inverse: 'projects', async: true}),
  collaborators: DS.hasMany('user', {inverse: 'collaborations'}),
  organization: DS.belongsTo('organization'),
  rootNode: DS.belongsTo('node'),
  tags: DS.belongsTo('tag'),
  threads: DS.hasMany('thread', {asyn: true}),
  documents: DS.hasMany('document', {async: true})
});
