import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  author: DS.belongsTo('user', {inverse: 'projects'}),
  collaborators: DS.hasMany('user', {inverse: 'collaborations'}),
  affiliation: DS.belongsTo('organization'),
  rootNode: DS.belongsTo('node')
});
