/*
A macro for the Foundry virtual tabletop.

Part of the Dragonbane Time collection.

Implements all the functionality for Dragonbane timekeeping using Global Progress Clocks
When you add this macro to Foundry, you must call it "gpc-dbtime" for the other 
macros to find it.

Dependencies: 
  - Global Progress Clocks >= 0.4.5

Foundry v12
Version 1.36
*/

// 4 stretches per hour and 6 hours per shift is the same as 24 fifteen minute stretches per shift.
// Since the hour clock is optional, just leave it out and when using this script you'll never notice that
// hours are even calculated.
const STRETCHES_PER_HOUR = 4
const STRETCH_CLOCK_NAME = 'Stretch'

const HOURS_PER_SHIFT = 6
const HOUR_CLOCK_NAME = 'Hour'

const SHIFTS_PER_DAY = 4
const SHIFT_CLOCK_NAME = 'Shift'

// This does the same thing as the SHIFTS_PER_DAY and STRETCHES_PER_DAY, but since I don't have a larger clock
// it's not days per anything.
const DAY_CLOCK_SEGMENTS = 128
const DAY_CLOCK_NAME = 'Day'

const STRETCHES_PER_SHIFT = STRETCHES_PER_HOUR * HOURS_PER_SHIFT
const STRETCHES_PER_DAY = STRETCHES_PER_HOUR * HOURS_PER_SHIFT * SHIFTS_PER_DAY
const MINUTES_PER_DAY = 1440
const MINUTES_PER_STRETCH = MINUTES_PER_DAY / STRETCHES_PER_DAY

// Define the association between clock names and the clock update macro names
const CLOCK_UPDATE_MACRO_NAMES = {}
CLOCK_UPDATE_MACRO_NAMES[STRETCH_CLOCK_NAME] = 'dbtime-stretch-change'
CLOCK_UPDATE_MACRO_NAMES[HOUR_CLOCK_NAME] = 'dbtime-hour-change'
CLOCK_UPDATE_MACRO_NAMES[SHIFT_CLOCK_NAME] = 'dbtime-shift-change'
CLOCK_UPDATE_MACRO_NAMES[DAY_CLOCK_NAME] = 'dbtime-day-change'

// the macro called when the overall time has changed, independently of any specific clock
CLOCK_UPDATE_MACRO_NAMES['time'] = 'dbtime-time-change'

/**
 * Validates a Global Progress Clock clock.
 * Since so much of these scripts depend on these clocks being configured correctly, but
 * that configuration is outside the control of the scripts, the least I can do is check
 * that it's right.
 * @param {Object} clock The clock to check.
 * @param {string} name The clock name.
 * @param {number} segments The expected number of segments.
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
 * @param {string} name
 * @param {number} segments The expected number of clock segments
 * @param {boolean} optional An optional clock will return null if it is missing, while a required clock will raise an exception if missing.
 * @returns {Object} The validated Global Progress Clocks clock object, or null if a valid clock could not be found.
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

/**
 * Calls the change macro corresponding to a named clock.
 * @param {string} name the clock or change name. Must be a key in CLOCK_UPDATE_MACRO_NAMES
 * @param {Object} oldTime The previous time data object
 * @param {Object} newTime The new time data object
 */
async function callChangeMacro (name, oldTime, newTime) {
    const changeMacro = game.macros.getName(CLOCK_UPDATE_MACRO_NAMES[name])
    if (changeMacro)
        await changeMacro.execute({
            oldTime: oldTime,
            time: newTime,
            minutesPerStretch: MINUTES_PER_STRETCH,
        })
}

/**
 * Set a value into a clock.
 *
 * If the value being set is different to the current clock value, then
 * 1. the new value will be set
 * 2. the corresponding time update macro will be called
 *
 * @param {Object} clock The GPC clock to set
 * @param {number} value The value to set
 * @param {Object} oldTime The previous time data object
 * @param {Object} newTime The new time data object
 * @returns {number} 1 if the clock was changed, or 0 if it was unchanged.
 */
function setClock (clock, value, oldTime, newTime) {
    value = Math.max(1, Math.min(clock.max, value))
    if (clock.value != value) {
        //console.debug('%s: %d -> %d', clock.name, clock.value, value)
        window.clockDatabase.update({ id: clock.id, value })
        callChangeMacro(clock.name, oldTime, newTime)
        return 1
    }

    return 0
}

/**
 * Gets the current time as a 0-based data object
 *
 * @param {Object} stretch the stretch clock
 * @param {Object} hour the optional hour clock
 * @param {Object} shift the shift clock
 * @param {Object} day the optional day clock
 */
function getCurrentTime (stretch, hour, shift, day) {
    const currentTime = {
        stretch: Math.max(stretch.value, 1) - 1,
        shift: Math.max(shift.value, 1) - 1,
        day: day ? Math.max(day.value, 1) - 1 : 0, // day is an optional clock. If it's missing, then it's always the first day
    }

    currentTime.totalStretches =
        currentTime.stretch +
        currentTime.shift * STRETCHES_PER_SHIFT +
        currentTime.day * STRETCHES_PER_DAY

    // If we have an hour clock then that must be taken into account
    if (hour) {
        currentTime.hour = Math.max(hour.value, 1) - 1
        currentTime.totalStretches += currentTime.hour * STRETCHES_PER_HOUR
    }

    return currentTime
}

function calculateTimeOfDay (time) {
    // Each day starts at 6am with shift 0.
    let minutesSinceSixAM =
        time.stretch * MINUTES_PER_STRETCH +
        time.shift * MINUTES_PER_STRETCH * STRETCHES_PER_SHIFT
    // handle optional hours
    if (time.hour) minutesSinceSixAM += time.hour * 60

    // factor into hours and minutes
    let hours = Math.floor(minutesSinceSixAM / 60) + 6
    const minutes = minutesSinceSixAM % 60

    // AM and PM, and after midnight wrapping
    const amPm = hours < 12 || hours >= 24 ? 'AM' : 'PM'
    if (hours > 24) hours -= 24
    if (hours >= 13) hours -= 12

    time.time = `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`
}

/**
 * Increment the clocks by an arbitrary number of stretches
 *
 * @param {number} stretchCount the number of stretches to increment
 * @param {Object} stretch the stretch clock
 * @param {Object} hour the optional hour clock
 * @param {Object} shift the shift clock
 * @param {Object} day the optional day clock
 */
function increment (increment, stretch, hour, shift, day) {
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
    console.group('increment')
    if (increment > 0) {
        const currentTime = getCurrentTime(stretch, hour, shift, day)
        calculateTimeOfDay(currentTime)

        // Add the increment then factor back into days, shifts, hours, & stretches
        // to get the new time
        const newTime = {
            stretch: 0,
            shift: 0,
            day: 0,
            totalStretches: increment + currentTime.totalStretches,
        }
        var remainingStretches = newTime.totalStretches
        // how many days?
        newTime.day = Math.floor(remainingStretches / STRETCHES_PER_DAY)
        remainingStretches = remainingStretches % STRETCHES_PER_DAY
        // how many shifts?
        newTime.shift = Math.floor(remainingStretches / STRETCHES_PER_SHIFT)
        remainingStretches = remainingStretches % STRETCHES_PER_SHIFT
        // if we are using hours, then calculate how many whole hours we have
        if (hour) {
            newTime.hour = Math.floor(remainingStretches / STRETCHES_PER_HOUR)
            remainingStretches = remainingStretches % STRETCHES_PER_HOUR
        }
        // This is the final remainder of stretches regardless of whether the optional hours are in use or not
        newTime.stretch = remainingStretches

        // Wrap the day counter when it hits the limit
        // See issue #33
        if (day && newTime.day >= day.max) {
            ui.notifications.warn(
                `DB Time: The day counter has hit the maximum of ${day.max}. Wrapping to day 1`
            )
            newTime.day = 0
        }

        calculateTimeOfDay(newTime)

        console.log(
            'Time Increment: %d %s units',
            increment,
            STRETCH_CLOCK_NAME
        )
        console.debug('Current time: %o', currentTime)
        console.debug('New time: %o', newTime)

        // set the new time, noting that we convert back to 1-based from our 0-based calculations
        setClock(stretch, newTime.stretch + 1, currentTime, newTime)
        setClock(shift, newTime.shift + 1, currentTime, newTime)
        if (hour) setClock(hour, newTime.hour + 1, currentTime, newTime)
        if (day) setClock(day, newTime.day + 1, currentTime, newTime)
        callChangeMacro('time', currentTime, newTime)
    }
    console.groupEnd()
}

/**
 * Sets all clocks to the given values
 * @param {Object} scope The scope object containing the named number values to set into the clocks.
 * @param {Object} stretch The stretch clock
 * @param {Object} hour The optional hour clock. If null, this clock will be ignored.
 * @param {Object} shift The shift clock
 * @param {Object} day The optional day clock. If null, this clock will be ignored.
 */
async function setAllClocks (scope, stretch, hour, shift, day) {
    console.group('setAllClocks')

    const oldTime = getCurrentTime(stretch, hour, shift, day)
    calculateTimeOfDay(oldTime)

    const newTime = {
        stretch: scope.stretch - 1,
        shift: scope.shift - 1,
        day: scope.day ? scope.day - 1 : 0,
        totalStretches: 0,
    }
    newTime.totalStretches =
        newTime.stretch +
        newTime.shift * STRETCHES_PER_SHIFT +
        newTime.day * STRETCHES_PER_DAY
    if (hour) {
        newTime.hour = scope.hour - 1
        newTime.totalStretches += newTime.hour * STRETCHES_PER_HOUR
    }
    calculateTimeOfDay(newTime)

    let changes = 0 // count the number of actual clock changes
    if (scope.stretch)
        changes += setClock(stretch, scope.stretch, oldTime, newTime)
    if (scope.shift) changes += setClock(shift, scope.shift, oldTime, newTime)
    if (hour && scope.hour)
        changes += setClock(hour, scope.hour, oldTime, newTime)
    if (day && scope.day) changes += setClock(day, scope.day, oldTime, newTime)

    // and only call the time changed macro if anything changed
    if (changes) await callChangeMacro('time', oldTime, newTime)
    console.groupEnd()
}

async function tellTime (stretch, hour, shift, day, includeDay) {
    const time = getCurrentTime(stretch, hour, shift, day)
    calculateTimeOfDay(time)
    let content = `It's ${time.time}`
    if (includeDay) content += ` on day ${time.day + 1}` // display in 1-based days
    console.log(content)
    ChatMessage.create({
        speaker: { actor: game.user.id },
        content: content,
    })
}

/**
 * This is where the script first starts to do some work
 */
// Get the optional hour clock first, so we can use its absence or presence to
// validate the stretch clock
console.group('DBTime')
const hour = getValidClock(HOUR_CLOCK_NAME, HOURS_PER_SHIFT, true)

// The number of segments in the stretch clock varies based on whether the optional
// hour clock sits in between the stretch and shift clocks.
const stretch = getValidClock(
    STRETCH_CLOCK_NAME,
    hour ? STRETCHES_PER_HOUR : STRETCHES_PER_SHIFT
)

const shift = getValidClock(SHIFT_CLOCK_NAME, SHIFTS_PER_DAY)
const day = getValidClock(DAY_CLOCK_NAME, DAY_CLOCK_SEGMENTS, true)

// get the macro arguments
const mode = scope.mode
const count = scope.count

// if we have the essential clocks, then dispatch to the correct handler
if (stretch && shift) {
    switch (mode) {
        case 'increment':
            increment(count, stretch, hour, shift, day)
            break
        case 'set':
            await setAllClocks(scope, stretch, hour, shift, day)
            break
        case 'tell':
            await tellTime(stretch, hour, shift, day, scope.includeDay && day)
            break
    }
}
console.groupEnd()
