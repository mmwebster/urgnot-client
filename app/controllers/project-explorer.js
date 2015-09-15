import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  app: Ember.inject.controller("app/index"),
  transitionLength: null,
  showRootEditing: false,
  noValidRootNode: false,
  user: Ember.computed(function() {
    return this.get('controllers.application.currentUser.data');
  }),
  activeTask: null,
  
  projectExplorerRoot: Ember.computed('user.activeOrganizationId', function() {
    // var _this = this;
    var id = this.get('user.activeOrganizationId');
    if (id) {
      var root = this.store.find('node', {
        orderBy: 'organizationId',
        equalTo: id
      });
      return root;
    }
  }),

  fixtureRoot: {
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
  },

  back: function(autoback) {
    var currentNode = window.projectExplorer.currentNode;
    
    // blur project explorer if not at root
    if (!currentNode.get('isRoot')) {

      // set transition length form element style if not null
      if (this.get('transitionLength') === null) {
        var transitionStyle = Ember.$('.project-explorer').css('transition-duration');
        var transitionInMilliseconds = parseFloat(transitionStyle.split("s")[0]) * 1000; // convert seconds->miliseconds
        this.set('transitionLength', transitionInMilliseconds);
      }
      // temporarily add full array of transition to current node
      currentNode.set('allowContentTransition', true);
      Ember.run.later(function() {
        currentNode.set('allowContentTransition', false);
      }, this.get('transitionLength'));

      Ember.debug('Blurring (' + currentNode.get('nodeModel.type') + ') - (' + currentNode.get('nodeModel.name') + ')');

      // demote this node
      currentNode.set('layer2', true);
      currentNode.set('layer1', false);
      // blur child nodes
      currentNode.get('children').forEach(function(node) {
        node.set('layer2', false);
      });
      // focus parent node
      currentNode.set('parentComponent.layer1', true);
      currentNode.set('parentComponent.blurParent', false);
      // focus siblings
      currentNode.get('siblings').forEach(function(node) {
         node.set('layer2', true); 
      });

      // reset current node - for use in project explorer interfacing
      window.projectExplorer.currentNode = currentNode.get('parentComponent');

      // continue back if autoback is true
      if (autoback) {
        var _this = this;
        Ember.run.next(function() {
          _this.back(true);
        });
      }
    } else {
      console.warn('Cannot go back. At top of hierarchy.');
    }
  },

  actions: {
    home: function() {
      this.back(true);
    },
    current: function() {

    },
    back: function() {
      this.back(false);
    },
    toggleActual: function() {
      this.toggleProperty('showActual');
    },
    showRootEditing: function() {
      this.toggleProperty('showRootEditing');
    },
    createRootNode: function() {
      var name = this.get('newRootName');
      if (name != "") {
        var _this = this;
        this.get('user').then(function(user) {
          // create record
          var newRoot = _this.store.createRecord('node', {
            name: name,
            organizationId: user.get('activeOrganizationId'),
            isRoot: true,
            level: 1,
            displayData: 'star'
          });
          // save record
          newRoot.save();
        });
      } else {
        alert("Name cannot be empty");
      }
    },
    triggerTask: function(task) {
      // show feedback in project explorer
      // disable currently active task
      var activeTask = this.get('activeTask');
      if (activeTask) {
        activeTask.set('active', false);
      }
      // set new to active
      task.set('active', true);
      // save this task as activeTask
      this.set('activeTask', task);
      // send action to the action panel
      var controller = this.get('app');
      var type = task.get('actionType');
      var data = JSON.parse(task.get('actionData'));
      controller.set("commLink", {active: true, type: type, data: data});
    }
  },
});
