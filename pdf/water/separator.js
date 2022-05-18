module.exports = (border = 0.5) => ({
    hLineWidth: function(i, node) {
        return (i === 0) ? border : 0;
    },
    vLineWidth: function(i, node) {
        return 0;
    },
    hLineColor: function (i) {
        return '#696969';
    }
});