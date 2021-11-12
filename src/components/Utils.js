export const ConvertTimeStamptoString = (timestamp, getDate = true, getTime = true, forInputTag = false) => {
    let msg = "";
    if (!timestamp || timestamp.length === 0) return "";
    let _d = new Date(timestamp);

    if (forInputTag) {
        if (getDate) {
            msg += _d.getFullYear();
            msg += "-"
            msg += ((_d.getMonth() + 1) < 10) ? "0" + (_d.getMonth() + 1) : (_d.getMonth() + 1);
            msg += "-"
            msg += (_d.getDate() < 10) ? "0" + _d.getDate() : _d.getDate();
        }
    } else {
        if (getDate) {
            msg += _MONTH[_d.getMonth()];
            msg += " ";
            msg += (_d.getDate() < 10) ? "0" + _d.getDate() : _d.getDate();
            msg += ", ";
            msg += _d.getFullYear();
            msg += " ";
        }

        if (getTime) {
            msg += (_d.getHours() < 10) ? "0" + _d.getHours() : _d.getHours();
            msg += ":";
            msg += (_d.getMinutes() < 10) ? "0" + _d.getMinutes() : _d.getMinutes();
            msg += ":";
            msg += (_d.getSeconds() < 10) ? "0" + _d.getSeconds() : _d.getSeconds();
        }
    }
    return msg;
}

export const _MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Sep"];

export const ReplaceCharacters = (msg) => {
    if (typeof(msg) !== 'string') return msg;
    return msg.replace(/["']/g, "");
}