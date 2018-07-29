## Things we can add

### Models
- Native, simple geometry (cube, sphere, cylinder etc)
- Custom models inported as obj files
- Models can be aded globally to the scene or as children to other models

### Materials
- Materials/textures loaded as base64 jpg
- bump (texture), alpha (transparenc) and displayment (terrain) maps

### Lighting
- Abient: lights everything evenly
- Directional: points in single direction
- Point: radiates from single point (sun/lightbulb)

### Text
- Images mapped to simple plane geometry
- No native support at this stage



## Things we can change

### Models and Lighting
- color
- position
- rotation
- scale
- dynamic loading/removal

### Material changes
No support for material changes at this stage



## Interactivity

### Click / mouseover model elemnts/children
Basic ability to track interacvity elements mouse is inline with from reference of camera. This will identify all elements (even if behind another) which can be filtered for approriate targets and call desired function. Functions are not limited to the 3d scene; could be used to change DOM content/values

### Scroll
- Use scroll position to change values in model
- Use scroll events (entering content section) to trigger model changes

### Mouse controls to control model's position, rotation, scale
WARNING can be disorientating to user
No integrated support with article pages at this stage.
  


