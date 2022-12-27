import dayjs from "dayjs";

export const uiDateFormat = (date, time = false, second = false) => {
    let format = 'DD/MM/YYYY';
    if (time) {
        format += ' HH:mm';
    }
    if (second) {
        format += ':ss';
    }
    return dayjs(date).format(format);
};