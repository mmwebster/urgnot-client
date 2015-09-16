import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  type: DS.attr('string'),
  typeIsStudent: DS.attr('boolean'),
  typeIsAdmin: DS.attr('boolean'),
  endOrganizations: DS.hasMany('organization', {inverse: 'endUsers', async: true}),
  adminOrganizations: DS.hasMany('organization', {inverse: 'adminUsers', async: true}),
  projects: DS.hasMany('project', {inverse: 'author'}),
  collaborations: DS.hasMany('project', {inverse: 'collaborators'}),
  activeOrganizationId: DS.attr('string'),
  activeProjectId: DS.attr('string'),
  documents: DS.hasMany('document', {async: true}),

  // COMPUTED
  fullName: Ember.computed('firstName', 'lastName', function() {
    if (this.get('firstName') && this.get('lastName')) {
      return this.get('firstName') + " " + this.get('lastName');
    } else {
      return false;
    }
  })

});
