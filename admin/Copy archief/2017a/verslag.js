Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


gb = {
    'ACTIVA': {
        'Immateriele vaste activa': {
            'Goodwill': { volgnr: 1111 },
            'Overige immateriele vaste activa': { volgnr: 1112 },
        },
        'Materiele vaste activa': {
            'Gebouwen en tereinen': { volgnr: 1121 },
            'Machines en installaties': { volgnr: 1122 },
            'Overige materiele vaste activa': { volgnr: 1123 },
        },
        'Financiele vaste activa': {
            'Deelnemingen': { volgnr: 1131 },
            'Langlopende vorderingen op groepsmaatschappijen': { volgnr: 1132 },
            'Langlopende vorderingen op groepsmaatschappijen': { volgnr: 1133 },
            'Langlopende vorderingen op particiapnten en maatschappijen waarin wordt deelgenomen': { volgnr: 1134 },
            'Overige financiele vaste activa': { volgnr: 1135 },
        },
        'Voorraden': {
            'Voorraden': { volgnr: 1141 },
            'Onderhanden werk': { volgnr: 1142 },
        },
        'Vorderingen': {
            'Vorderingen op handelsdebiteuren': { volgnr: 1151 },
            'Vordering omzetbelasting': { volgnr: 1152 },
            'Kortlopende vorderingen op groepsmaatschapijen': { volgnr: 1153 },
            'Kortlopende vorderingen op participanten en maatschappijen waarin wordt deelgenomen': { volgnr: 1154 },
            'Overige vorderingen': { volgnr: 1155 },
        },
        'Effecten': {
            'Effecten': { volgnr: 1161 },
        },
        'Liquide middelen': {
            'Bank': { volgnr: 1171 },
            'Kas': { volgnr: 1172 },
            'Bank Sparen': { volgnr: 1173 },
            'Kruispost': { volgnr: 1174 },
        },
    },
    'PASSIVA': {
        'Ondernemingsvermogen': {
            'Gestort en opgevraagd kapitaal': { volgnr: 1211 },
            'Informeel kapitaal': { volgnr: 1222 },
            'Agio': { volgnr: 1223 },
            'Winstreserves': { volgnr: 1224 },
            'Egalisatiereserve': { volgnr: 1225 },
            'Herinvesteringsreserve': { volgnr: 1226 },
            'Belaste compartimeteringsreserve': { volgnr: 1227 },
            'Overige fiscale reserves': { volgnr: 1228 },
        },
        'Voorzieningen': {
            'Garantie voorzienigen': { volgnr: 1231 },
            'Stamrecht, lijfrente en pensioenvoorziening': { volgnr: 1232 },
            'Overige voorziening': { volgnr: 1233 },
        },
        'Langlopende schulden': {
            'Converteerbare leningen': { volgnr: 1241 },
            'Obligaties': { volgnr: 1242 },
            'Langlopende schulden aan groepsmaatschapijen': { volgnr: 1243 },
            'Langlopende schulden aan particiapnten en maatschappijen waarin wordt deelgenomen': { volgnr: 1244 },
            'Schulden aan kredietinstellingen': { volgnr: 1245 },
            'Overige langlopende schulden': { volgnr: 1246 },
        },
        'Kortlopende schulden': {
            'Schulden aan leveranciers en handelskredieten': { volgnr: 1251 },
            'Schuld omzetbelasting': { volgnr: 1252 },
            'Schuld loonheffing': { volgnr: 1255 },
            'Kortlopende schulden aan groepsmaatschappijen': { volgnr: 1253 },
            'Kortlopende schulden aan participanten en maatschappijen waarin wordt deelgenomen': { volgnr: 1254 },
            'Overige kortlopende schulden': { volgnr: 1256 },
        },
    },
    'Winst en Verlies': {
        'Resultaat na belastingen': {
            'Resultaat uit gewone bedrijfsuitvoering': {
                'Baten en Lasten': {
                    'Baten': {
                        'Opbrengsten': {
                            'Nettoomzet': { volgnr: 2111 },
                            'Wijziging in voorraden en onderhanden werk': { volgnr: 2112 },
                            'Geactiveerde productie voor het eigen bedrijf': { volgnr: 2122 },
                            'Overige opbrengsten': { volgnr: 2123 },
                        }
                    },
                    'Lasten': {
                        'Inkoopkosten, uitbesteed werk e.d': {
                            'Inkoopprijs van de verkopen en kosten van grond en hulpstoffen': { volgnr: 2211 },
                            'Kosten van uitbesteed werk en andere externe kosten': { volgnr: 2212 },
                        },
                        'Personeelskosten': {
                            'Lonen en salarissen': { volgnr: 2221 },
                            'Sociale lasten': { volgnr: 2222 },
                            'Pensioenlasten': { volgnr: 2223 },
                            'Overige personeelskosten': { volgnr: 2224 },
                            'Ontvangen uitkeringen en subsidies': { volgnr: 2225 },
                        },
                        'Afschrijvingen': {
                            'Goodwill': { volgnr: 2231 },
                            'Overige immateriele vaste activa': { volgnr: 2232 },
                            'Gebouwen en terreinen': { volgnr: 2233 },
                            'Machines en installaties': { volgnr: 2234 },
                            'Overige materiele vaste activa': { volgnr: 2235 },
                        },
                        'Waarde veranderingen': {
                            'Overige waardeveranderingen van immateriele en materiele vaste activa': { volgnr: 2241 },
                            'Bijzondere waardevermindering van vlottende activa': { volgnr: 2242 },
                        },
                        'Overige bedrijfskosten': {
                            'Auto en transportkosten': { volgnr: 2251 },
                            'Huisvestingskosten': { volgnr: 2252 },
                            'Onderhoudskosten van overige materiele vaste activa': { volgnr: 2253 },
                            'Verkoopkosten': { volgnr: 2254 },
                            'Andere kosten': { volgnr: 2255 },
                        },
                    },
                },
                'Financiele baten en lasten': {
                    'Opbrengsten van vorderingen op groepsmaatschapijen': { volgnr: 2261 },
                    'Opbrengsten van vorderingen op participanten en maatschappijen waarin wordt deelgenomen': { volgnr: 2262 },
                    'Opbrengsten van banktegoeden': { volgnr: 2263 },
                    'Opbrengsten van overige vorderingen': { volgnr: 2264 },
                    'Ontvangend dividend (niet van deelnemingen)': { volgnr: 2265 },
                    'Kwijtscheldingswinst': { volgnr: 2266 },
                    'Waardeverandering van vorderingen': { volgnr: 2267 },
                    'Waardeverandering van effecten': { volgnr: 2268 },
                    'Kosten van schulden aan groepsmaatschapijen': { volgnr: 2269 },
                    'Kosten van schulden aan participanten en maatschapijen waarin wordt deelgenomen': { volgnr: 2270 },
                    'Kosten van schulden, rentelasten en soortgelijke kosten': { volgnr: 2271 },
                },
            },
            'Resultaat uit deelnemingen': {
                'Resultaat uit deelnemingen': { volgnr: 2281 },
            },
            'Buitengewone resultaten': {
                'Buitengewone baten': {
                    'Voordelen door ontvoeging dochtermaatschappij of beeindiging fiscale eenheid': { volgnr: 2282 },
                    'Boekwinst op activa': { volgnr: 2283 },
                    'Overige buitengewone baten': { volgnr: 2284 },
                },
                'Buitengewone lasten': {
                    'Afboekingen herinvesteringreserves op gekochte activa': { volgnr: 2291 },
                    'Uitkeringen aan algemeen nut beoogde instellingen (ANBI)': { volgnr: 2292 },
                    'Overige buitengewone lasten': { volgnr: 2293 },
                }
            },
            'Venootschapsbelasting': { volgnr: 3001 },
        },
    },
};


var comp = { 'MJVK Beheer BV': {}, 'Alicon Projects BV': {}, 'Alicon Systems BV': {}, 'Eenheid': {} };



writepost = function (gb, naam, level, f) {
    with (elTr = elTbl.appendTag('tr', { className: 'h' + level })) {
        gb[naam].tot = {};
        var vnr = gb[naam].volgnr;
        var title = naam + ((vnr) ? ' (' + vnr + ') ' : ' ');
        appendTag('td', { className: 'oms', innerText: title });
        var elBkToe = elToe.appendTag('tr', { className: 'h2' });
        elBkToe.appendTag('td', { innerText: title, attr: { colspan: 4 } });
        for (var name in comp) {
            gb[naam].tot[name] = {
                eind: 0, begin: 0,
                elEind: appendTag('td', { className: 'bedrag', }),
                elBegin: appendTag('td', { className: 'bedrag begin', })
            };
        }
        if (!vnr) {
            for (var n in gb[naam]) if (n != 'tot') {
                writepost(gb[naam], n, level + 1, f);
                for (var name in comp) {
                    gb[naam].tot[name].begin += gb[naam][n].tot[name].begin;
                    gb[naam].tot[name].eind += gb[naam][n].tot[name].eind;
                }
            }
        }

        for (var name in comp) {
            var hide = true;
            var href = '';
            if (data[vnr] && data[vnr][name]) {
                //var v = data[vnr][name].begin || 0;
                //gb[naam].tot[name].begin += v;
                //gb[naam].tot.Eenheid.begin += v;
                //var v = (data[vnr][name].begin || 0)+(data[vnr][name].eind || 0);
                //gb[naam].tot[name].eind += v;
                //gb[naam].tot.Eenheid.eind += v;
                hide = false;

                //console.log(vnr, data[vnr][name].regels);
                if (data[vnr][name].regels) {
                    href = title + name;
                    elToe.appendTag('tr', { className: 'h3' }).appendTag('td', { innerHTML: '<a name="' + href + '"></a>' + href, attr: { colspan: 4 } });
                    var boekOms = '';
                    var b = 0;
                    for (var i = 0, row; row = data[vnr][name].regels[i]; i++) {
                        //if (boekOms != row.boekOms) {
                        //    var b = 0;
                        //    boekOms = row.boekOms;
                        //}
                        with (elToe.appendTag('tr')) {
                            appendTag('td', { className: 'datum', innerText: row.datum });
                            appendTag('td', { className: 'bedrag', innerText: (b += row.bedrag).toFixed(2) });
                            appendTag('td', { className: 'bedrag', innerText: row.bedrag.toFixed(2) });
                            appendTag('td', { innerText: row.omschrijving });
                        }
                        gb[naam].tot[name].eind += row.bedrag;
                        gb[naam].tot.Eenheid.eind += row.bedrag;
                    }
                }
            }
            gb[naam].tot[name].elEind.appendTag('a', { href: (href)?'#'+href:'', innerText: gb[naam].tot[name].eind.toFixed(0) });
            gb[naam].tot[name].elBegin.innerText = gb[naam].tot[name].begin.toFixed(0);
        }
        if (hide && !gb[naam].tot.Eenheid.eind && !gb[naam].tot.Eenheid.begin) {
            className += ' none';
            elBkToe.className += ' none';
        }
    }
}


onload = function () {
    console.log(data);
    with (document.body) {
        elTbl = appendTag('table');
        elToe = appendTag('table');
        with (elTbl.appendTag('tr')) {
            appendTag('td', {});
            for (var name in comp) {
                appendTag('td', { innerText: name, attr: { colspan: 2 } });
            }
        }
        writepost(gb, 'ACTIVA', 1, 1);
        writepost(gb, 'PASSIVA', 1, 1);
        writepost(gb, 'Winst en Verlies', 1, 1);
        elTbl.appendTag('tr', { className: 'h1' }).appendTag('td', { innerText: 'BTW', attr: { colspan: 10 } });
        forEach(data.btw, function (row, i, periode) {
            elTbl.appendTag('tr', { className: 'h2' }).appendTag('td', { innerText: 'Kwartaal ' + periode, attr: { colspan: 10 } });
            forEach(row, function (row, i, post) {
                with (elTbl.appendTag('tr')) {
                    appendTag('td', { innerText: post });
                    Eenheid = 0;
                    for (var name in comp) {
                        Eenheid += row[name] || 0;
                    }
                    row.Eenheid = Eenheid;
                    for (var name in comp) {
                        appendTag('td', { className: 'bedrag', innerText: (row[name] || 0).toFixed(0) });
                        appendTag('td');
                    }
                }
            });
        });
    }
}

