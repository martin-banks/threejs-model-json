import layout from '@/layouts/scroll_test.vue'

export default {
  layout,

  scenes: [
    {
      name: 'Scene name',
      
      camera: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      models: [
        {
          name: 'Moon',
          spin: false,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          layers: [],
          children: [
            {
              name: 'Pin',
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
            }
          ],
        }
      ]
    },
  ],


}
