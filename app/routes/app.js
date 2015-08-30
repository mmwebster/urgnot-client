import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get("session").fetch().catch(function() {});
  },
  model: function() {
    return this.get('routeModel');
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    var uid = this.controllerFor('application').get('currentUser.uid');
    this.store.find('user', uid).then(function(userModel) {
      controller.set('user', userModel);
    });
  },
  afterModel: function() {
    var user = this.controllerFor('application').get('currentUser');
    // debugger;
    Em.debug('UID: ' + user.uid);
    this.store.find('user', user.uid).then(function(user) {
      Em.debug('UID (model): ' + user.id);
    });
  },

  routeModel: {
    // top level entity is project level
    entity: {
      id: 1,
      name: 'Star',
      type: 'star',
      children: [ 
        {
          id: 2,
          name: 'Planet 0',
          type: 'planet',
          children: [
            {
              id: 3,
              name: 'moon 0',
              type: 'moon',
              children: [
                {
                  id: 4,
                  name: 'crater 1',
                  type: 'crater'
                },
                {
                  id: 5,
                  name: 'crater 2',
                  type: 'crater'
                }
              ]
            },
            {
              id: 5,
              name: 'moon 2',
              type: 'moon',
              children: [
                {
                  name: 'crater 1',
                  _content: 'This is a lovely crater, much fun!',
                  type: 'crater'
                },
                {
                  name: 'crater 2',
                  _content: 'Wow, here\'s another great one!',
                  type: 'crater'
                },
                {
                  name: 'crater 3',
                  _content: 'Woah there, now things are just getting out of hand.',
                  type: 'crater'
                }
              ]
            },
            {
              id: 5,
              name: 'moon 2',
              type: 'moon'
            },
            {
              id: 5,
              name: 'moon 2',
              type: 'moon'
            },
            {
              id: 5,
              name: 'moon 2',
              type: 'moon'
            },
            {
              id: 5,
              name: 'moon 2',
              type: 'moon'
            }




          ]
        },
        {
          id: 6,
          name: 'Planet 1',
          type: 'planet'
        },
        {
          id: 7,
          name: 'Planet 2',
          type: 'planet'
        },
        {
          id: 8,
          name: 'Planet 3',
          type: 'planet'
        },
        {
          id: 9,
          name: 'Planet 4',
          type: 'planet',
          children: [
            {
              id: 5,
              name: 'moon 2',
              type: 'moon',
              children: [
                {
                  name: 'crater 1',
                  _content: 'This is a lovely crater, much fun!',
                  type: 'crater',
                  children: [
                  {name: 'another', type: 'crater', children: [{name: 'another final', type: 'star', isCurrent: true}]} 
                    ]
                },
                {
                  name: 'crater 2',
                  _content: 'Wow, here\'s another great one!',
                  type: 'crater'
                },
                {
                  name: 'crater 3',
                  _content: 'Woah there, now things are just getting out of hand.',
                  type: 'crater'
                }
              ]
            }, {
              name: 'moon-2',
              type: 'moon'
            }
          ]
            
        },
        
        {
          id: 8,
          name: 'Planet 3',
          type: 'planet'
        },
        {
          id: 9,
          name: 'Planet 4',
          type: 'planet'
        },
        {
          id: 9,
          name: 'Planet 4',
          type: 'planet'
        }
      ]
    }
  },
});
