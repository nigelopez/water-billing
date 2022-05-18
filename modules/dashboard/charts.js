const { db, string } = require('../../helpers/init');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const { forEach } = require('async-foreach');
const filters = {
    '7_days': 'Last 7 Days',
    '30_days': 'Last 30 Days',
    'this_month': 'This Month',
    'last_month': 'Last Month',
}

module.exports = async (data) => {
    let { filter } = data;
    if(!filter)
        filter = '7_days';
    let days = [];
    if(filter === '7_days'){
        days = Array.from(moment.range(moment().add(-6,'days'), moment()).by('day'));
    }else if(filter === '30_days'){
        days = Array.from(moment.range(moment().add(-29,'days'), moment()).by('day'));
    }else if(filter === 'this_month'){
        days = Array.from(moment.range(moment().startOf('month'), moment().endOf('month')).by('day'));
    }else if(filter === 'last_month'){
        days = Array.from(moment.range(moment().add(-1,'month').startOf('month'), moment().add(-1,'month').endOf('month')).by('day'));
    }else
        throw new Error(`Invalid filter!`);
    let labels = [];
    let values = [];
    let total = 0;
    await db.transaction(async trx=>{
        await new Promise((resolve,reject)=>{
            let rejected = false;
            forEach(days, async function(day){
                if(rejected) return;
                const done = this.async();
                try{
                    const sum = (await trx('water_payments').whereBetween('receipt_date',[day.format("YYYY-MM-DD 00:00:00"),day.format("YYYY-MM-DD 23:59:59")]).sum('amount as total').whereNull('voided_on').first())?.total || 0;
                    labels.push(day.format("MMM DD, YYYY"));
                    values.push(sum);
                    total += sum;
                }catch(e){
                    reject(e);
                    rejected = false;
                }
                done();
            },resolve)
        });
    });
    return {
        title: filters[filter] + " Collections",
        labels,
        values,
        selected: filters[filter],
        options: Object.keys(filters).map(k=>{ return { label: filters[k], filter: k }}),
        info: [
            { title: 'Total Collected', text: string.currencyFormat(total) },
        ]
    }
}