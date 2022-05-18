const x = {};

x.percentage = (val) => {
    val = Number(val);
    if(val < 0 || val > 100)
        throw new Error(`Invalid percentage! It must be from 0% to 100% only`);
    return val;
}

x.number = (val) => {
    val = Number(val);
    if(isNaN(val))
        throw new Error(`Invalid Number!`);
    return val;
}

x.range = (val) => {
    val = val.split("-");
    if(val.length !== 2 || isNaN(Number(val[0])) || isNaN(Number(val[1])))
        throw new Error(`Invalid range! It must be separated by "-". Example: 10-20`);
    val[0] = Number(val[0]);
    val[1] = Number(val[1]);
    if(val[0] > val[1])
        throw new Error(`First value must be less than the second value`);
    return `${val[0]}-${val[1]}`;
}

x.text = (val) => {
    return val.toString();
}

module.exports = x;