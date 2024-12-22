const formatTime = (seconds) => {
    //hh:mm:ss
    const ts = Math.round(seconds);
    const s = ts % 60;
    const tm = Math.floor(ts / 60);
    const m = tm % 60;
    const h = Math.floor(tm / 60);

    const timeArray = [m.toString().padStart(2, '0'), s.toString().padStart(2, '0')];
    if (h > 0) timeArray.unshift(h);
    const timeString = timeArray.join(':');

    return timeString;
};

export default formatTime;
