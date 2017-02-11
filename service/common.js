//分页查询
exports.pagerFind = function (req, res, model, sortArg, conditionArg) {
    var size = req.query.size ? parseInt(req.query.size) : 1,
        page = req.query.page ? parseInt(req.query.page) : 1,
        condition = conditionArg,
        skip = (page - 1) * size,
        sort = sortArg;

    model.find(condition, function (err, dataAll) {
        if (err) console.log(err.message);
        var elements = dataAll.length;
        model.find(condition).skip(skip).limit(size).sort(sort).exec(function (err, data) {
            if (err) console.log(err.message);
            res.json({
                element: data,
                pager: {
                    totalpage: elements < size ? 1 : Math.ceil(elements / size),
                    totalelement: elements,
                    pagecurrent: page,
                    pagesize: size
                }
            });
        })
    });
};
