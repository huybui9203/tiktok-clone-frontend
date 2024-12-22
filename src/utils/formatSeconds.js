const formatSeconds = (seconds) => {
    if (!seconds && seconds !== 0) {
        return;
    }
    return {
        toMinutesAndSeconds() {
            seconds = Math.round(seconds);
            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        },

        toMinutes() {
            if (seconds < 60) {
                return `${Math.round(seconds)} ${Math.round(seconds) === 1 ? 'second' : 'seconds'}`;
            } else {
                const minutes = Math.round(seconds / 60);
                return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
            }
        },
    };
};

export default formatSeconds;
