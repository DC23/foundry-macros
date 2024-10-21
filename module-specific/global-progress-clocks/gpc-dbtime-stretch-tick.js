/*
A macro for the Foundry virtual tabletop.

Ticks the Dragonbane Timekeeping clocks forward by 1 stretch.

Dependencies: 
  - Global Progress Clocks >= 0.4.5

Foundry v12
Version 1.0
*/

/**
 * Validates a Global Progress Clock clock.
 * Since so much of these scripts depend on these clocks being configured correctly, but
 * that configuration is outside the control of the scripts, the least I can do is check
 * that it's right.
 * @param {Object} clock The clock to check.
 * @param {String} name The clock name.
 * @param {Number} segments The expected number of segments.
 */
function validate_clock (clock, name, segments) {
  if (!clock) throw new Error(`DBTime: Global Progress Clock '${name}' missing`)

  if (clock.max != segments)
    throw new Error(
      `DBTime: Global Progress Clock '${name}' has ${clock.max} segments, it requires ${segments}`
    )
}

/**
 * Gets a validated timekeeping progress clock by name.
 * @param {String} name 
 * @param {Number} segments 
 * @returns The validated Global Progress Clocks clock object, or null if a valid clock could not be found.
 */
function getValidClock (name, segments) {
  try {
    const clock = window.clockDatabase.getName(name)

    try {
      validate_clock(clock, name, segments)
    } catch (error) {
      ui.notifications.error(error)
      return null
    } finally {
      return clock
    }
  } catch (error) {
    ui.notifications.error(
      'The Global Progress Clocks module is probably not loaded'
    )
    return null
  }
}

const stretch = getValidClock('Stretch', 24)
const shift = getValidClock('Shift', 4)
const day = getValidClock('Day', 7)

// tick within current stretch
// tick will end the stretch and advance the shift
// advancing the shift will advance the day

// The clock update code
//window.clockDatabase.update({ id: clock.id, value: clock.value + 1 });
