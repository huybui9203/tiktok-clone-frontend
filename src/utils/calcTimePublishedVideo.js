const calcTimePublishedVideo = (date) => {
    if(!date) {
        return
    }
    const dateNow = new Date();
    const [ymd, hms] = date.split(' ');
    const [year, month, day] = ymd.split('-');

    const dateString = `${ymd}T${hms}`;
    const start = new Date(dateString);
    const curr = Date.now()
    let totalSeconds = Math.round((curr - start) / 1000);
    if(totalSeconds === 0) {
        totalSeconds = 1
    }

    const s = totalSeconds % 60; //second
    const totalMinutes = Math.floor(totalSeconds / 60);
    const m = totalMinutes % 60; //minute
    const totalHours = Math.floor(totalMinutes / 60);
    const h = totalHours % 24; //hour
    const totalDay = Math.floor(totalHours / 24);
    const d = totalDay % 7; //day
    const w = Math.floor(totalDay / 7); //week

    // console.log(w, d, h, m, s);

    let renderTimePosted = '';
    if (Number(year) < dateNow.getFullYear()) {
        renderTimePosted = ymd;
    } else {
        if (w > 4) {
            renderTimePosted = `${month}-${day}`;
        } else if (w > 0) {
            renderTimePosted = `${w + Math.round(d / 7)}w ago`;
        } else if (d > 0) {
            renderTimePosted = `${d + Math.round(h / 24)}d ago`;
        } else if (h > 0) {
            renderTimePosted = `${h + Math.round(m / 64)}h ago`;
        } else if (m > 0) {
            renderTimePosted = `${m + Math.round(s / 64)}m ago`;
        } else if (s > 0) {
            renderTimePosted = s + 's ago';
        }
    }
    return renderTimePosted;
};

export default calcTimePublishedVideo