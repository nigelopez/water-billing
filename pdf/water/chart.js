module.exports = (info) => {
    if(!info?.image)
        return {};
    return {
        table: {
            widths: [ '*' ],
            body: [
                [ { text: "MONTHLY CONSUMPTION CHART", style: "filledHeader" } ],
                [
                    {
                        layout: 'noBorders',
                        table: {
                            widths: [ '*'],
                            body: [
                                [
                                    [ { image: info.image, width: 270 } ],
                                ]
                            ]
                        },
                    }
                ],
            ]
        },
        layout: 'noBorders'
    }
}