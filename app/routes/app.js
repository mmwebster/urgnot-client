import Ember from 'ember';

export default Ember.Route.extend({
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
          type: 'planet'
        }
      ]
    }
  }, 
  model: function() {
    return this.get('routeModel');
  },
});
