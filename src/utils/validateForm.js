const validator = {
    isEmpty(value) {
        return value.trim().length === 0;
    },

    isEmail(value, regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/) {
        return regex.test(value);
    },

    isLimitLength(value, [min, max] = [0, Infinity], options = { ignoreWhitespace: false, trim: false }) {
        if (min > max) {
            throw new Error('"min" must be less than "max"');
        }
        
        if (options.ignoreWhitespace) {
            value = value.replace(/\s/g, '');
        }

        if (options.trim) {
            value = value.trim();
        }

        return value.length >= min && value.length <= max;
    },

    isPassword(value, regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/) {
        return regex.test(value);
    },

    match(value, regex) {
        return regex.test(value);
    },

    isValidDate({ year, month, day }) {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    },
};

export default validator;
