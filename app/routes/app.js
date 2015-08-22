import Ember from 'ember';

export default Ember.Route.extend({
  routeModel: {
    // top level entity is project level
    entity: {
      name: 'Star',
      type: 'star',
      children: [ 
        {
          name: 'Planet 1',
          type: 'planet',
          children: [
            {
              name: 'moon 1',
              type: 'moon',
              children: [
                {
                  name: 'crater 1',
                  type: 'crater'
                },
                {
                  name: 'crater 2',
                  type: 'crater'
                }
              ]
            },
            {
              name: 'moon 2',
              type: 'moon'
            }
          ]
        },
        {
          name: 'Planet 2',
          type: 'planet'
        },
        {
          name: 'Planet 3',
          type: 'planet'
        }
      ]
    }
  }, 
  model: function() {
    return this.get('routeModel');
  },
});
