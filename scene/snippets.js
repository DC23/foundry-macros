/*
A macro for the Foundry virtual tabletop.

This file is a collection of little bits and pieces that I might find useful one day :)

Foundry v12
Version 1.0
*/

/** 
 * change the current scene lighting to 0.6 with animation time of 3000ms
 * darkness level: full bright = 0, full dark = 1
*/
await canvas.scene.update(
    { 'environment.darknessLevel': 0.6 },
    { animateDarkness: 3000 }
)

/**
 * Update all lights at once on a scene based on a tagger tag.  
 * This is a nice workaround for the lack of multiselect and edit on lights.
 * Can be used to edit any properties. I needed to change animation intensity on a swamp map,
 * so that's what I've saved here :)
 * 
 * Note the first test is for the presence of flags.tagger.tags, which is absent if a light has no
 * tags applied at all.
 */
const lights = canvas.scene.lights.filter(
    l => l.flags.tagger.tags && l.flags.tagger.tags.includes('swamp-fog')
)
const updates = lights.map(l => ({
    _id: l.id,
    'config.animation.intensity': 5,
}))
if (updates) {
    await canvas.scene.lights.update(updates)
}
