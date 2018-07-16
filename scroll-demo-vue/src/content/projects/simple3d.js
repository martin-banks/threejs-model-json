import layout from '@/layouts/basic-tree.vue'

export default {
  layout,
  header: {
    title: 'Lorem ipsum dolores sit amet',
    intro:
      'Enim sint minim et minim sunt aliquip cillum commodo tempor ex enim culpa. Deserunt ut id nisi non magna aliqua sint non. Anim exercitation cillum ipsum aliqua aliqua deserunt qui.',
  },

  parts: [...new Array(5)].map(p => 'Ea cillum nostrud officia nulla nulla fugiat id elit dolore. Qui enim exercitation ad duis in. Pariatur elit laboris labore sit est do irure id velit. Sint aute anim Lorem dolore est eiusmod.'),

  model: {
    path: './static/tree/',
    obj: 'model.obj',
    mtl: 'material.mtl',
  },

  scenes: [
    {
      camera: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
    },
    {
      camera: {
        position: {
          x: 12.4,
          y: 465,
          z: 9.8,
        },
        rotation: {
          x: -1.55,
          y: -0.03,
          z: -0.9,
        },
      },
    },
    {
      camera: {
        position: {
          x: 28,
          y: 106,
          z: 285,
        },
        rotation: {
          x: -0.3,
          y: 0.1,
          z: 0,
        },
      },
    },
    {
      camera: {
        position: {
          x: 135,
          y: 55,
          z: 180,
        },
        rotation: {
          x: -0.2,
          y: 0.5,
          z: 0.1,
        },
      },
    },
    {
      camera: {
        position: {
          x: 92,
          y: 22,
          z: 50,
        },
        rotation: {
          x: -0.7,
          y: 1.2,
          z: 0.7,
        },
      },
    },
    {
      camera: {
        position: {
          x: 235,
          y: 65,
          z: 40,
        },
        rotation: {
          x: -1,
          y: 1.2,
          z: 1,
        },
      },
    },
  ],

}
