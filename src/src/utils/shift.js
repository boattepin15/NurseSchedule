function countShift(data) {
    const count = data.morning + data.noon + data.night
    console.log(count);
    return count 
}

module.exports.countShift = countShift