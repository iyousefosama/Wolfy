exports.tConvert = function (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
};

exports.t24Convert = function (time) {
  let hours = parseInt(time.substr(0, 2));
  let minutes = parseInt(time.substr(3, 2));

  if (time.indexOf('am') !== -1 && hours === 12) {
    hours = 0;
  }
  if (time.indexOf('pm') !== -1 && hours !== 12) {
    hours += 12;
  }

  return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
};