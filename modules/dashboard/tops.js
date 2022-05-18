const { forEach } = require('async-foreach');
const _ = require('lodash');
const { db, string } = require('../../helpers/init');
const filters = {
    'topReceivables': 'Top Receivables by Consumer',
    'topConsumption': 'Top Consumption by Consumer',
}
const receivableColumns = [
    { Header: '#', accessor: 'id', width: 30 },
    { Header: 'Unit Code', accessor: 'unit_code', width: 80 },
    { Header: 'Consumer Name', accessor: 'name' },
    { 
        Header: 'Balance', accessor: 'current_balance', width: 120,
        button: true,
        props:{
            buttonProps: {color: 'link', className: 'default'},
            aProps: { href: 'hello_world/{id}', target: '_blank' }
        }
    }
];
const consumptionColumns = [
    { Header: '#', accessor: 'id', width: 30 },
    { Header: 'Unit Code', accessor: 'unit_code', width: 80 },
    { Header: 'Consumer Name', accessor: 'name' },
    { 
        Header: 'Cu. M.', accessor: 'total', width: 120,
        button: true,
        props:{
            buttonProps: {color: 'link', className: 'default'},
        }
    }
];
module.exports = async (data) => {
    let { filter } = data;
    if(!filter)
        filter = 'topReceivables';
    let rows = [];
    let columns = [];
    let info = [];
    if(filter == 'topReceivables'){
        rows = await db("water_consumers").orderBy("current_balance","desc").select('unit_code','name', 'current_balance').where('current_balance','>',0).limit(20);
        rows.map((r,i)=>{
            r.id = i + 1;
            r.current_balance = string.currencyFormat(r.current_balance);
        });
        columns = receivableColumns;
        info.push({ title: `List of top ${rows.length} consumers with balance` })
    }else if(filter == 'topConsumption'){
        await db.transaction(async trx=>{
            let consumers = await trx("water_consumers").select('id','name','unit_code');
            await new Promise((resolve, reject) =>{
                let rejected = false;
                forEach(consumers, async function(consumer,i){
                    if(rejected) return;
                    const done = this.async();
                    try{
                        consumer.total = (await trx("water_statements").where("consumer_id",consumer.id).sum("billed_cbm as total").whereNull("voided_on").first())?.total || 0
                    }catch(e){
                        reject(e);
                        rejected = true;
                    }
                    done();
                },resolve);
            });
            rows = _.chunk(_.orderBy(consumers,['total'],['desc']),20)[0];
            rows.map((r,i)=>{
                r.id = i + 1;
                r.total = `${r.total} cbm`;
            });
            columns = consumptionColumns;
            info.push({ title: `List of top ${rows.length} consumers by consumption` })
        })
    }
    return {
        rows,
        columns,
        title: filters[filter],
        selected: filters[filter],
        options: Object.keys(filters).map(k=>{ return { label: filters[k], filter: k }}),
        info
    }
}