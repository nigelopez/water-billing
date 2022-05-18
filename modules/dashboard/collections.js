const { db, string } = require('../../helpers/init');
const moment = require('moment');
const colProps = { xxs: 12, sm: 2, lg: 3 };
module.exports = async (data) => {
    // const stats = await db("dashboard_stats").first() || {};
    let stats = {};
    await db.transaction(async trx=>{
        let today = (await trx('water_payments')
            .whereNull('voided_on')
            .sum('amount as total')
            .where('receipt_date',moment().format("YYYY-MM-DD"))
            .first()
        )?.total || 0;
        let this_month = (await trx('water_payments')
            .whereNull('voided_on')
            .sum('amount as total')
            .whereBetween('receipt_date',[moment().startOf('month').format("YYYY-MM-DD"),moment().endOf('month').format("YYYY-MM-DD")])
            .first()
        )?.total || 0;
        let total_collections = (await trx('water_payments')
            .whereNull('voided_on')
            .sum('amount as total')
            .first()
        )?.total || 0;

        let total_receivables = (await trx('water_consumers')
            .where("current_balance",">",0)
            .sum('current_balance as total')
            .first()
        )?.total || 0;
        stats = { total_receivables, total_collections, today, this_month };
    });
    
    return [
        {
            title: 'Collection Today', colProps,
            value: string.currencyFormat(stats?.today || 0),
            icon: 'https://hoaws.s3.ap-southeast-1.amazonaws.com/ajoya_mactan/tpz_utility-bill_0052362b-a679-4a2e-a609-1deae1ea1172.png'
        },
        {
            title: 'Collection This Month', colProps,
            value: string.currencyFormat(stats?.this_month || 0),
            icon: 'https://hoaws.s3.ap-southeast-1.amazonaws.com/ajoya_mactan/tpz_utility-bill_b50d0ae4-e936-405c-b4ad-fa6b2d7710b6.png',
        },
        {
            title: 'Total Collections', colProps,
            value: string.currencyFormat(stats?.total_collections || 0),
            icon: 'https://hoaws.s3.ap-southeast-1.amazonaws.com/ajoya_mactan/tpz_utility-bill_f69820aa-d0be-4d65-b3b2-7cd9efba2ec6.png'
        },
        {
            title: 'Total Receivables', colProps,
            value: string.currencyFormat(stats?.total_receivables || 0),
            icon: 'https://hoaws.s3.amazonaws.com/ajoya_mactan/tpz_utility-bill_8b9d65c8-b575-4324-a284-e5a096db88fd.png'
        }
    ];
}