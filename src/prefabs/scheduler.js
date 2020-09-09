(() => ({
  name: 'Scheduler',
  icon: 'SelectIcon',
  category: 'Scheduler',
  structure: [
    {
      name: 'Scheduler',
      options: [
        {
          value: '',
          label: 'Model',
          key: 'model',
          type: 'MODEL',
        },
        {
          value: {},
          label: 'Filter',
          key: 'filter',
          type: 'FILTER',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: true,
          label: 'Toolbar Visibility',
          key: 'toolbarVisibility',
          type: 'TOGGLE',
        },
        {
          value: true,
          label: 'Day View',
          key: 'dayView',
          type: 'TOGGLE',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'toolbarVisibility',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: true,
          label: 'Week View',
          key: 'weekView',
          type: 'TOGGLE',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'toolbarVisibility',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: true,
          label: 'Month View',
          key: 'monthView',
          type: 'TOGGLE',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'toolbarVisibility',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: ['https://planning-app.bettywebblocks.com/event-handling'],
          label: 'POST Endpoint',
          key: 'apiUrl',
          type: 'VARIABLE',
        },
        {
          value: [''],
          label: 'Project ID',
          key: 'projectId',
          type: 'VARIABLE',
        },
      ],
      descendants: [],
    },
  ],
}))();
