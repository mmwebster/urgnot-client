import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  type: DS.attr('string'),
  typeIsStudent: DS.attr('boolean'),
  typeIsAdmin: DS.attr('boolean'),
  endOrganizations: DS.hasMany('organization', {inverse: 'endUsers', async: true}),
  adminOrganizations: DS.hasMany('organization', {inverse: 'adminUsers', async: true}),
  tags: DS.belongsTo('tag'),
  projects: DS.hasMany('project', {inverse: 'author'}),
  collaborations: DS.hasMany('project', {inverse: 'collaborators'}),
  threads: DS.hasMany('thread', {inverse: 'endUser'}),
  activeOrganizationId: DS.attr('string'),
  documents: DS.hasMany('document', {async: true})
});
