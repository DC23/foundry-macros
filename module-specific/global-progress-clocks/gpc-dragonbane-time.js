/*
A macro for the Foundry virtual tabletop.

Implements all the functionality for Dragonbane timekeeping using Global Progress Clocks
When you add this macro to Foundry, you must call it "gpc-dragonbane-time" for the other 
macros to find it.

Dependencies: 
  - Global Progress Clocks >= 0.4.5

Foundry v12
Version 1.0
*/

/**
 * Customisable bits and pieces go here
 */
// 24 is the Dragonbane standard. You can set this smaller if you want less fine-grained tracking
// FIXME: revert to 24 before release. 4 is a test value
const STRETCHES_PER_SHIFT = 4
const STRETCH_CLOCK_NAME = 'Stretch'

const SHIFTS_PER_DAY = 4
const SHIFT_CLOCK_NAME = 'Shift'

// This does the same thing as the SHIFTS_PER_DAY and STRETCHES_PER_DAY, but since I don't have a larger clock
// it's not days per anything.
// FIXME: revert to 30 before release. 7 is a test value
const DAY_CLOCK_SEGMENTS = 7
const DAY_CLOCK_NAME = 'Day'

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
  var clock = null
  try {
    clock = window.clockDatabase.getName(name)
  } catch (error) {
    ui.notifications.error(
      'The Global Progress Clocks module is probably not loaded'
    )
    return null
  }

  try {
    validate_clock(clock, name, segments)
  } catch (error) {
    ui.notifications.error(error)
    return null
  }

  return clock
}

function tick (clock) {
  window.clockDatabase.update({ id: clock.id, value: clock.value + 1 })
}

function reset (clock, value = 1) {
  window.clockDatabase.update({ id: clock.id, value: value })
}

function incrementStretch (stretch, shift, day) {
  if (stretch.value < stretch.max) {
    // tick within current stretch
    console.log('stretch tick')
    tick(stretch)
  } else {
    if (shift.value < shift.max) {
      // tick will end the stretch and advance the shift
      console.log('new shift')
      reset(stretch)
      tick(shift)

      // Chat message - It's a new shift
    } else {
      // it's a new day!
      console.log('new day')
      reset(stretch)
      reset(shift)

      if (day.value < day.max) {
        //reset stretch and shift, tick the day
        tick(day)
      } else {
        reset(day)
      }

      // Chat message - It's a new day
    }
  }
}

// TODO: Code replication here and above looks bad, but it will change once this function
// implements larger increment amounts. I'll make sure to pull the chat messages out to 
// common functions at least, and refactor when I see tractable replication.
function incrementShift (shift, day, count) {
  if (shift.value < shift.max) {
    // tick will end the stretch and advance the shift
    console.log('new shift')
    tick(shift)

    // Chat message - It's a new shift
  } else {
    // it's a new day!
    console.log('new day')
    reset(shift)

    if (day.value < day.max) {
      //reset shift, tick the day
      tick(day)
    } else {
      reset(day)
    }

    // Chat message - It's a new day
  }
}

const stretch = getValidClock(STRETCH_CLOCK_NAME, STRETCHES_PER_SHIFT)
const shift = getValidClock(SHIFT_CLOCK_NAME, SHIFTS_PER_DAY)
const day = getValidClock(DAY_CLOCK_NAME, DAY_CLOCK_SEGMENTS)

const mode = scope.mode
const count = scope.count
console.log(count)

if (stretch && shift && day) {
  if (mode === 'stretch') incrementStretch(stretch, shift, day)
  else if (mode === 'shift') incrementShift(shift, day, count)
}
