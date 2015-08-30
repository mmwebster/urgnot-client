// app/controllers/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Controller.extend({
  currentUser: null,
});
