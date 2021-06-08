Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

onload = function () {
    console.log(data);
    with (document.body.appendTag('table')) {
        for (var postname in data.posten) {
            var tot = 0;
            with (appendTag('tr', {className:'hdr'})) {
                appendTag('td');
                appendTag('td', { innerHTML: postname });
                elTot=appendTag('td');
            }
            for (var i = 0, row; row = data.posten[postname].rows[i]; i++) {
                var cum = 0;
                with (tr = appendTag('tr', { className: 'boek' })) {
                    appendTag('td').appendTag('a', { name: row.id, innerHTML: row.datum });
                    appendTag('td', { innerHTML: row.omschrijving });
                    appendTag('td', { innerHTML: Number(row.bedrag).format(2, 3) });
                    appendTag('td', { innerHTML: (cum = Math.round((cum + Number(row.bedrag)) * 100) / 100).format(2, 3) });
                    appendTag('td', { innerHTML: row.id });
                    tot += Number(row.bedrag);
                }
                if (row.rel) for (var i1 = 0, row1; row1 = row.rel[i1]; i1++) {
                    with (appendTag('tr', { className: '' })) {
                        appendTag('td', { innerHTML: row1.datum });
                        appendTag('td').appendTag('a', { innerHTML: row1.omschrijving, href: '#' + row1.relId });
                        appendTag('td', { innerHTML: Number(row1.bedrag).format(2, 3) });
                        appendTag('td', { innerHTML: (cum = Math.round((cum + Number(row1.bedrag)) * 100) / 100).format(2, 3) });
                        appendTag('td', { innerHTML: row1.relId });
                    }
                }
                if (cum) {
                    console.log(cum, tr);
                    tr.className += ' red';
                    //openposten.push(row);
                }
            }
            elTot.innerHTML = tot.format(2, 3);
        }
    }
}


onload1 = function () {
    console.log(data);
    openposten = [];
    with (document.body.appendTag('table')) {
        for (var postname in data) {
            appendTag('tr').appendTag('td', { attr: { colspan: 10 }}).appendTag('h2', { innerHTML: postname });
            data[postname].cum = 0;
            for (var i = 0, row; row = data[postname].rows[i]; i++) {
                with (tr=appendTag('tr', {className:'boek'})) {
                    appendTag('td', { attr: { colspan: 10 } }).appendTag('a', { name: row.id, innerHTML: row.id });
                }
                cum = 0;
                for (var i1 = 0, row1; row1 = row.credet[i1]; i1++) {
                    cum = Math.round((cum + Number(row1.bedrag)) * 100) / 100;
                    data[postname].cum += cum;
                    with (appendTag('tr')) {
                        appendTag('td', { innerHTML: row1.link });
                        appendTag('td', { innerHTML: row1.datum });
                        appendTag('td').appendTag('a', { innerHTML: row1.omschrijving, href: row1.link });
                        appendTag('td');
                        appendTag('td', { innerHTML: Number(row1.bedrag).format(2, 3) });
                        appendTag('td', { innerHTML: cum.format(2, 3) });
                        appendTag('td', { innerHTML: data[postname].cum.format(2, 3) });
                    }
                }
                for (var i1 = 0, row1; row1 = row.debet[i1]; i1++) {
                    cum = Math.round((cum + Number(row1.bedrag))*100)/100;
                    with (appendTag('tr')) {
                        appendTag('td', { innerHTML: row1.link });
                        appendTag('td', { innerHTML: row1.datum });
                        appendTag('td').appendTag('a', { innerHTML: row1.omschrijving, href: row1.link });
                        appendTag('td');
                        appendTag('td', { innerHTML: Number(row1.bedrag).format(2, 3) });
                        appendTag('td', { innerHTML: cum.format(2, 3) });
                    }
                }
                if (cum) {
                    tr.className += ' red';
                    openposten.push(row);
                }
            }
            with (appendTag('tr')) {
                appendTag('td', { attr: { colspan: 3 } }).appendTag('b', { innerHTML: postname });
                appendTag('td', { innerHTML: data[postname].cum });
            }
        }
        console.log(openposten);
        appendTag('tr').appendTag('td', { attr: { colspan: 10 } }).appendTag('h1', { innerHTML: 'OPEN POSTEN'});

        for (var i = 0, row; row = openposten[i]; i++) {
            with (tr = appendTag('tr', { className: 'boek' })) {
                appendTag('td', { attr: { colspan: 10 } }).appendTag('a', { name: row.id, innerHTML: row.id });
            }
            cum = 0;
            for (var i1 = 0, row1; row1 = row.credet[i1]; i1++) {
                cum = Math.round((cum + Number(row1.bedrag)) * 100) / 100;
                data[postname].cum += cum;
                with (appendTag('tr')) {
                    appendTag('td', { innerHTML: row1.link });
                    appendTag('td', { innerHTML: row1.datum });
                    appendTag('td').appendTag('a', { innerHTML: row1.omschrijving, href: row1.link });
                    appendTag('td');
                    appendTag('td', { innerHTML: (row1.bedrag > 0) ? Number(row1.bedrag).format(2, 3) : '' });
                    appendTag('td', { innerHTML: (row1.bedrag < 0) ? Number(row1.bedrag).format(2, 3) : '' });
                    appendTag('td', { innerHTML: cum.format(2, 3) });
                    appendTag('td', { innerHTML: data[postname].cum.format(2, 3) });
                }
            }
            for (var i1 = 0, row1; row1 = row.debet[i1]; i1++) {
                cum = Math.round((cum + Number(row1.bedrag)) * 100) / 100;
                with (appendTag('tr')) {
                    appendTag('td', { innerHTML: row1.link });
                    appendTag('td', { innerHTML: row1.datum });
                    appendTag('td').appendTag('a', { innerHTML: row1.omschrijving, href: row1.link });
                    appendTag('td');
                    appendTag('td', { innerHTML: (row1.bedrag > 0) ? Number(row1.bedrag).format(2, 3) : '' });
                    appendTag('td', { innerHTML: (row1.bedrag < 0) ? Number(row1.bedrag).format(2, 3) : '' });
                    appendTag('td', { innerHTML: cum.format(2, 3) });
                }
            }
        }
    }
}