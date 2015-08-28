import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  type: DS.attr('string'),
  endAffiliations: DS.hasMany('organization', {inverse: 'endUsers'}),
  adminAffiliations: DS.hasMany('organization', {inverse: 'adminUsers'}),
  tags: DS.belongsTo('tag'),
  projects: DS.hasMany('project', {inverse: 'author'}),
  collaborations: DS.hasMany('project', {inverse: 'collaborators'})
});
