/*
A macro for the Foundry virtual tabletop.

Implements all the functionality for Dragonbane timekeeping using Global Progress Clocks
When you add this macro to Foundry, you must call it "gpc-dbtime" for the other 
macros to find it.

Dependencies: 
  - Global Progress Clocks >= 0.4.5

Foundry v12
Version 1.14
*/

/**
 * Customisable bits and pieces go here
 */
// 24 is the Dragonbane standard. You can set this smaller if you want less fine-grained tracking
// FIXME: revert to 24 before release. 4 is a test value
// TODO: when I implement #8, I will be calculating the sequence stretch->hour->shift->day all the time
const STRETCHES_PER_SHIFT = 4
const STRETCHES_PER_HOUR = 4
const STRETCH_CLOCK_NAME = 'Stretch'

const HOURS_PER_SHIFT = 6
const HOURS_CLOCK_NAME = 'Hours'

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
function validate_clock (clock, name, segments, optional = false) {
  if (!optional && !clock)
    throw new Error(`DBTime: Global Progress Clock '${name}' missing`)

  if (clock && clock.max != segments)
    throw new Error(
      `DBTime: Global Progress Clock '${name}' has ${clock.max} segments, it requires ${segments}`
    )
}

/**
 * Gets a validated timekeeping progress clock by name.
 * @param {String} name
 * @param {Number} segments
 * @param {Boolean} optional An optional clock will return null if it is missing, while a required clock will raise an exception if missing.
 * @returns The validated Global Progress Clocks clock object, or null if a valid clock could not be found.
 */
function getValidClock (name, segments, optional = false) {
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
    validate_clock(clock, name, segments, optional)
  } catch (error) {
    ui.notifications.error(error)
    return null
  }

  return clock
}

function setClock (clock, value = 1) {
  window.clockDatabase.update({ id: clock.id, value: value })
}

/**
 *
 * @param {Number} stretchCount the number of stretches to increment
 * @param {Object} stretch the stretch clock
 * @param {Object} shift the shift clock
 * @param {Object} day the day clock
 */
function increment (increment, stretch, shift, day) {
  /*
There's a mismatch between GPC clocks and how I want to use them. A GPC clock with N segments has N+1
display states, corresponding to 0 filled segments through to N filled segments. With this system, I'm
using an N segment clock to represent N units of time, not N+1. That's why a clock is never shown with 
zero filled segments. To simplify the math in this function, I use a small trick of performing the 
calculations with 0-based numbers in the range [0..N) representing the N states that I use for a clock.
When it comes time to set that time into the GPC clock, I add 1 since the display is 1-based. 
An example might help. There are 4 Dragonbane shifts in a day. The 0-based range I use to calculate this is 
[0, 1, 2, 3] or [0..4). Since we never display an empty segment, the first shift to display has value 1, 
and the last has value 4, which is the range [1..4].

Why bother mixing 0 and 1 based indexing? Using 0-based makes all the integer arithmetic much simpler.
I just need to subtract 1 when getting the current value out of a clock, and to add 1 when setting it back.
*/
  // FIXME: should be > 0 once I finish testing
  if (increment >= 0) {
    console.log(`Incrementing time by ${increment} stretches`)

    // get the current time in stretches, noting the conversion from 1-based to 0-based
    const STRETCHES_PER_DAY = SHIFTS_PER_DAY * STRETCHES_PER_SHIFT
    const currentTime = {
      stretch: stretch.value - 1,
      shift: shift.value - 1,
      day: day ? day.value - 1 : 0 // day is an optional clock. If it's missing, then it's always the first day
    }
    currentTime.totalStretches =
      currentTime.stretch +
      currentTime.shift * STRETCHES_PER_SHIFT +
      currentTime.day * STRETCHES_PER_DAY
    console.log(
      `Current time: ${currentTime.stretch}.${currentTime.shift}.${currentTime.day} (${currentTime.totalStretches})`
    )

    // Add the increment then factor back into days, shifts, & stretches to get the new time
    // in the same format
    const newTime = {
      stretch: 0,
      shift: 0,
      day: 0,
      totalStretches: increment + currentTime.totalStretches
    }
    var remainingStretches = newTime.totalStretches
    newTime.day = Math.floor(remainingStretches / STRETCHES_PER_DAY)
    remainingStretches = remainingStretches % STRETCHES_PER_DAY
    newTime.shift = Math.floor(remainingStretches / SHIFTS_PER_DAY)
    remainingStretches = remainingStretches % SHIFTS_PER_DAY
    newTime.stretch = remainingStretches
    console.log(
      `New time: ${newTime.stretch}.${newTime.shift}.${newTime.day} (${newTime.totalStretches})`
    )

    // set the new time, noting that we convert back to 1-based from our 0-based calculations
    setClock(stretch, newTime.stretch + 1)
    setClock(shift, newTime.shift + 1)
    if (day) setClock(day, newTime.day + 1)
  }
}

// Get the clocks
const stretch = getValidClock(STRETCH_CLOCK_NAME, STRETCHES_PER_SHIFT)
const shift = getValidClock(SHIFT_CLOCK_NAME, SHIFTS_PER_DAY)
const hours = getValidClock(HOURS_CLOCK_NAME, HOURS_PER_SHIFT, true)
const day = getValidClock(DAY_CLOCK_NAME, DAY_CLOCK_SEGMENTS, true)

console.log(hours)

// get the macro arguments
const mode = scope.mode
const count = scope.count

// if we have valid clocks, then dispatch to the correct handler
if (stretch && shift) {
  // It's a switch because I used to have more options, but they've been deprecated by the new increment
  // code that handles arbitrary leaps in time.
  // Keeping the switch since I might want more options in future.
  // Code smells be damned!
  switch (mode) {
    case 'increment':
      increment(count, stretch, shift, day)
  }
}
