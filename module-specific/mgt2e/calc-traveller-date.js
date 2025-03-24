/*
Calculate a Traveller time and date from an Easy Timekeeping `timeAugmented` data object

This macro is written to be called from other macros. By itself it outputs nothing.

Foundry v12
Version 1.2
*/

console.assert(typeof(time) != 'undefined', 'time macro argument expected')

const YEAR_ZERO = 1105       // In-game year corresponding to Easy Timekeeping year zero
const DAYS_PER_YEAR = 365    // Days per Traveller year. Easy Timekeeping has no internal notion of years. It just tracks days since day 0.

// factor the years, weeks and days in 0-based calculations since 
// they are less error prone and match what Easy Timekeeping does.
const year = Math.floor(time.days / DAYS_PER_YEAR) + YEAR_ZERO
let day = time.days % DAYS_PER_YEAR
let week = Math.floor(day / 7)

// once the calculations are done, we can convert from 0-based 
// to 1-based values for display
week += 1
day  += 1

return {'year': year, 'week': week, 'day': day, 'apitime': time}