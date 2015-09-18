import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('app', function() {
    this.route('settings', function() {
      this.route('projects');
      this.route('organizations');
    });  
  });
  this.route('login');
  this.route('logout');
});

export default Router;
