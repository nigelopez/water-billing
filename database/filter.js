module.exports = (knex, table, data) => {
    if(!data.pageSize)
        data.pageSize = 20;
    if(!data.page)
        data.page = 0;
    if(!data.sorted)
        data.sorted = [];
    if(!data.filtered)
        data.filtered = [];

    if(data && data.page < 1)
        data.page = 0;
    let x = knex(table).limit(data.pageSize).offset(data.page * data.pageSize);
    let y = knex(table);
    
    var range1 = null;
    var range2 = null;
    var rangeColumn = null;

    if(data && data.filtered && data.filtered.length > 0){
        data.filtered.map(z=>{
            if(z.range){
                x.whereBetween(z.id,[z.from,z.to]);
                y.whereBetween(z.id,[z.from,z.to]);
            }else if(z.operator){
                x.where(z.id,z.operator,z.value);
                y.where(z.id,z.operator,z.value);
            }else if(z.id == "range1" || z.id == "range2"){
                rangeColumn = z.column;
                if(z.id == "range1") 
                    range1 = z.value;
                else if(z.id == "range2")
                    range2 = z.value;
            }else if(z.id == 'greater_than_search'){
                x.where(z.field,'>',z.value);
                y.where(z.field,'>',z.value);
            }else{
                if(Number.isInteger(z.value)){
                    x.where(z.id,z.value);
                    y.where(z.id,z.value);
                }else if(z.value){
                    // console.log(data.strict);
                    if(data.strict && data.strict.length > 0 && data.strict.indexOf(z.id) > -1){
                        //strict = to let WHERE query use =, not "like"
                        if(typeof z.value === "string"){
                            x.where(z.id,z.value);
                            y.where(z.id,z.value);
                        }
                    }else if(typeof z.value === "object"){
                        //use wherin
                        x.whereIn(z.id,z.value);
                        y.whereIn(z.id,z.value);
                    }else{
                        x.where(z.id,'like',`%${z.value}%`);
                        y.where(z.id,'like',`%${z.value}%`);
                    }
                }else if(z.type === 'whereNotNull'){
                    x.whereNotNull(z.id);
                    y.whereNotNull(z.id);
                }else if(z.type === 'whereNull'){
                    x.whereNull(z.id);
                    y.whereNull(z.id);
                }else if(z.type === 'whereRaw' && z.sql){
                    x.whereRaw(z.sql);
                    x.whereRaw(z.sql);
                }
            }
        })
    }
    // console.log(x.toQuery());
    if(data.orWhere && data.orWhere.length > 0){
        x.orWhere((z)=>{
            data.orWhere.map(o=>{
                z.where(o.id,o.value);
            })
        })
        y.orWhere((z)=>{
            data.orWhere.map(o=>{
                z.where(o.id,o.value);
            })
        })
    }
    // console.log(range1,range2,rangeColumn);
    if(range1 != null && range2 != null && rangeColumn != null){
        x.whereBetween(rangeColumn,[range1,range2]);
        y.whereBetween(rangeColumn,[range1,range2]);
    }
    // console.log(x.toString());
    if(data && data.sorted && data.sorted.length > 0){
        data.sorted.map(z=>{
            x.orderBy(z.id,z.desc ? 'DESC':'');
            y.orderBy(z.id,z.desc ? 'DESC':'');
        })
    }else if(data?.sorted_by_raw){
        x.orderByRaw(data.sorted_by_raw);
    }else
        x.orderBy('id','DESC');
    
    y.count('id as total');
    
    if(data.logQuery){
        console.log(`--------------------------------`);
        console.log(x.toQuery());
        console.log(`--------------------------------`);
        console.log(y.toQuery());
        console.log(`--------------------------------`)
    }
    return x.then(res=>{
        let send = {};
        send.rows = res;
        return y.then(count=>{
            if(count.length < 1)
                send.pages = 0;
            else
                send.pages = Math.ceil(count[0].total / data.pageSize);
            return send;
        })
    });
}