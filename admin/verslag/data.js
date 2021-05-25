comp = {
  'MJVK Beheer BV': {
    Rekening: 'NL39INGB0006299856',
  },
  'Alicon Projects BV': {
    Rekening: 'NL33INGB0006299867',
  },
  'Alicon Systems BV': {
    Rekening: 'NL87INGB0006299865',
  }
};
jaren = {
  ' 2020': {},
  ' 2019': {},
  ' 2018': {},
  ' 2017': {},
  ' 2016': {},
  ' 2015': {},
  ' 2014': {},
  ' 2013': {},
}

rek = {
  NL39INGB0006299856: 'MJVK Beheer BV',
  NL33INGB0006299867: 'Alicon Projects BV',
  NL87INGB0006299865: 'Alicon Systems BV',
}

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
boekNrs = {};
boekTitel = {};
boekTitelNr = {};

strValue = (value) => {
  return value ? Number(value).toLocaleString('nl-NL', {minimumIntegerDigits: 1, maximumFractionDigits: 0}) : '';
}

// addValue = (jaar, boekNr, bedrijf, value) => {
//   value = Number(value);
//   if (!balans[jaar]) return;
//   balans[jaar][bedrijf][String(boekNr)].value += value;
//   // balans[jaar][String(boekNr)].el.innerText = strValue(balans[jaar][String(boekNr)].value += value);
//   // balans[jaar][bedrijf][String(boekNr)].el.innerText = strValue(balans[jaar][bedrijf][String(boekNr)].value += value);
// }

addBoek = (boek, boekregel) => {
  boekregel = boekregel || boek.boek || boek;
  value = Number(boek.Bedrag);
  if (!balans[boek.Jaar]) return;
  balans[boek.Jaar][boek.Bedrijf][String(boek.BoekNr)].value += value;

  // console.log(boek.Jaar, boek.Bedrijf, boek.BoekNr);
  elBoek[boek.Jaar][boek.Bedrijf][boek.BoekNr].elH.style ='';
  var elTR = elBoek[boek.Jaar][boek.Bedrijf][boek.BoekNr].appendTag('TR');
  elTR.appendTag('TD', (boek.Datum || boek.Jaar).substr(0,10));
  var elTD = elTR.appendTag('TD');
  if (boek.name) elTD.appendTag('A', {name:boek.name});
  elTD.appendTag('SPAN', [`<b>${[boekTitel[boek.BoekNr],boekregel.Post,boekregel.PostID].filter(Boolean).join(', ')}</b>`, boek.Opmerking, boekregel.Relatie,boekregel.KasGiro,boekregel.BankDT, boekregel.BTWprocent,boekregel.Omschrijving,boekregel.FaktuurNR].filter(Boolean).join('<br>'));
  elTR.appendTag('TD', Number(boek.Bedrag).toLocaleString('nl-NL', {minimumIntegerDigits: 1, minimumFractionDigits: 2}));
  //
  //
  // var el = elBoek[boek.Jaar][boek.Bedrijf].appendTag('TR',{ children: [
  //   ['TD', (boek.Datum || boek.Jaar).substr(0,10)],
  //   ['TD', [boek.Opmerking, boekregel.Post,boekregel.Relatie,boekregel.KasGiro,boekregel.BTWprocent,boekregel.Omschrijving,boekregel.FaktuurNR].filter(Boolean).join('<br>')],
  //   // ['TD', boek.Relatie],
  //   // ['TD', boek.KasGiro],
  //   // ['TD', boek.BTWprocent],
  //   // ['TD', boek.Omschrijving],
  //   // ['TD', boek.FaktuurNR],
  //   ['TD', boek.Bedrag.toLocaleString('nl-NL', {minimumIntegerDigits: 1, minimumFractionDigits: 2})],
  //   // ['TD', String(boek.ID)],
  // ]});
  return elTD;
}

AIM.extend({
  on:{
    init:()=>{
      balans = {};

      (goTable = function(obj) {
        for (let [name, child] of Object.entries(obj)) {
          if (child.volgnr) {
            boekNrs[child.volgnr] = child;
            boekTitel[child.volgnr] = name;
            boekTitelNr[name] = child.volgnr;
          } else {
            goTable(child);
          }
        }
      })(gb);


      content.appendTag('H1','BALANS');
      elBALANS = content.appendTag('TABLE',{className: 'balans'});



      content.appendTag('H1','BOEKING');
      elBoek = {};
      for (let [jaar, jaarObj] of Object.entries(jaren)) {
        jaar = jaar.trim();
        elBoek[jaar] = {};
        content.appendTag('H2', jaar);
        for (let [company, companyObj] of Object.entries(comp)) {
          content.appendTag('H3', company);
          elBoek[jaar][company] = content.appendTag('TABLE');
          for (let [boekTitel, boekNr] of Object.entries(boekTitelNr)) {
            // console.log(boekTitelNr);
            content.appendTag('A',{name: [jaar,company,boekNr].join()});
            var elH = content.appendTag('H4', [jaar,company,boekNr,boekTitel].join(), {style:'display:none;'});
            elBoek[jaar][company][boekNr] = content.appendTag('TABLE', {className:'boekNr'});
            elBoek[jaar][company][boekNr].elH = elH;

          }
        }
      }
      console.log('elBoek', elBoek);

      content.appendTag('H1','BANK');
      elBank = {};
      for (let [jaar, jaarObj] of Object.entries(jaren)) {
        jaar = jaar.trim();
        elBank[jaar] = {};
        content.appendTag('H2','JAAR');
        for (let [company, companyObj] of Object.entries(comp)) {
          content.appendTag('H3','company');
          elBank[jaar][company] = content.appendTag('TABLE');
        }
      }

      elROW = elBALANS.appendTag('TR');
      elROW.appendTag('TH', 'post');
      elROW.appendTag('TH', 'volgnr');
      for (let [jaar, jaarObj] of Object.entries(jaren)) {
        elROW.appendTag('TH', jaar);
        for (let [company, companyObj] of Object.entries(comp)) {
          elROW.appendTag('TH', company);
        }
      };

      (goTable = function(obj, level) {
        for (let [name, child] of Object.entries(obj)) {
          var BoekNr = child.volgnr;
          // console.log(child.volgnr);
          var elROW = elBALANS.appendTag('TR', {className:'h' + level});
          elROW.appendTag('TD', name, {className:'oms'});
          elROW.appendTag('TD', String(BoekNr || ''));
          for (let [jaar, jaarObj] of Object.entries(jaren)) {
            jaar = jaar.trim();
            balans[jaar] = balans[jaar] || {};
            var el = elROW.appendTag('TD', {volgnr:String(child.volgnr)});
            elROW[jaar] = {el: el};
            if (BoekNr) {
              balans[jaar][String(BoekNr)] = {el : el, value: 0};
            }
            for (let [company, companyObj] of Object.entries(comp)) {
              balans[jaar][company] = balans[jaar][company] || {};
              var el = elROW.appendTag('TD').appendTag('A');
              elROW[jaar][company] = el;
              // console.log(BoekNr);
              if (BoekNr) {
                el.href = '#' + [jaar,company,BoekNr].join();
                balans[jaar][company][BoekNr] = {el : el, value: 0};
              }
            };
          };
          if (!BoekNr) {
            elROW.className += ' sum';
            goTable(child,level+1);
          }
          // child.parent = obj;
          child.el = elROW;
        }
      })(gb, 1);

      AIM.http.request('data.php',(event)=>{
        data = JSON.parse(event.target.responseText);
        for (var name in data) {
          window[name] = {};
          data[name].forEach((row)=>{
            window[name][row.ID] = row;
          });
        }
        // console.log(data,relatie);
        data.boek.forEach((row)=>{
          row.Relatie = row.RelatieID && relatie[row.RelatieID] ? relatie[row.RelatieID].Relatie : row.RelatieID;
          if (!row.PostID || !post[row.PostID]) return;
          row.post = post[row.PostID];
          row.Post = row.post.Omschrijving;
          row.bedrijf = bedrijf[row.post.BedrijfID];
          row.Bedrijf = row.bedrijf.Bedrijf;
        });
        data.boekbank.forEach((row)=>{
          if (row.boek = boek[row.ID]) {
            row.boek.boekbank = row.boek.boekbank || [];
            row.boek.boekbank.push(row);
            row.bank = bank[row.BankID];
            row.bank.boekbank = row.bank.boekbank || [];
            row.bank.boekbank.push(row);
          };
        });
        // var elTB = elBOEK.appendTag('TABLE');
        // console.log(balans);
        // data.boek.sort((a,b)=>{  return String(a.Post).localeCompare(b.Post) || String(a.Relatie).localeCompare(b.Relatie);});
        actiefjaar = '';

        // ALLE BANK BETALINGEN
        for (let [company, companyObj] of Object.entries(comp)) {
          bankTotaal = 0;
          // elBANK.appendTag('H2', company + ' ' + companyObj.Rekening);
          // var elBANKREK = elBank elBANK.appendTag('TABLE',{className: 'bank'});

          actiefjaar = '';

          data.bank.forEach((row)=>{
            row.jaar = row.Datum.substr(0,4);
            if (!elBank[row.jaar]) return;
            row.Bedrijf = rek[row.Rekening];
            if (row.Bedrijf !== company) return;
            row.Bedrag = row.AfBij == 'Bij' ? Number(row.AfBijBedrag) : - Number(row.AfBijBedrag);
            // console.log(rek, row);
            elBANKREK = elBank[row.jaar][row.Bedrijf];
            if (actiefjaar != row.jaar) {
              addBoek({
                Jaar: row.jaar,
                Bedrijf: row.Bedrijf,
                BoekNr: 1171, // BANK
                Bedrag: bankTotaal,
                Omschrijving: 'Begin balans',
              });
              // addValue(row.jaar, 1171, row.Bedrijf, bankTotaal);
              actiefjaar = row.jaar;
              // elBANKREK.appendTag('TR',{ children: [
              //   ['TD', ],
              //   ['TD', 'BEGIN'],
              //   ['TD', { align: 'right', innerText: bankTotaal}],
              // ]});
            }
            bankTotaal += row.Bedrag;

            var elTD = addBoek({
              Jaar: row.jaar,
              Bedrijf: row.Bedrijf,
              BoekNr: 1171, // BANK
              Bedrag: row.Bedrag,
              Datum: row.Datum,
              Omschrijving: row.Mededelingen,
            });

            // addValue(row.jaar, 1171, row.Bedrijf, row.Bedrag);

            // var elROW = elBANKREK.appendTag('TR');
            // elROW.appendTag('TD', row.Datum.substr(0,10));
            // var elOPM = elROW.appendTag('TD', row.Mededelingen);
            // elROW.appendTag('TD', strValue(row.Bedrag), { align: 'right' });

            var Rest = Number(row.Bedrag);
            if (row.boekbank) {
              // elRowTable = elTD.appendTag('TABLE');
              row.boekbank.forEach((row)=>{
                Rest -= Number(row.Bedrag);
                elTD.appendTag('DIV', [row.boek.Datum.substr(0,10), row.boek.Post, row.boek.Omschrijving, Number(row.Bedrag).toLocaleString('nl-NL', {minimumIntegerDigits: 1, minimumFractionDigits: 2}), Rest.toLocaleString('nl-NL', {minimumIntegerDigits: 1, minimumFractionDigits: 2})].join(', '));
              });
            }
            Rest=Math.round(Rest * 100) / 100;
            if (Rest) {
              elTD.appendTag('DIV','Bank niet geboekt ' + strValue(Rest), {style: 'color:red;'} );
            }
          });
        };

        // ALLE NOEKINGEN BETALINGEN


        actiefjaar ='';
        data.boek.forEach((boek)=>{
          if (!boek.Datum) return console.error(boek);
          if (!['MJVK Beheer BV', 'Alicon Projects BV', 'Alicon Systems BV'].includes(boek.Bedrijf)) return;
          var jaar = boek.Datum.substr(0,4);
          var elTB = elBoek[jaar][boek.Bedrijf];
          // BEGIN BALANS
          if (actiefjaar != jaar) {
            console.log(jaar,actiefjaar);
            if (balans[actiefjaar]) {
              for (let [boekNr, boekObj] of Object.entries(boekNrs)) {
                if (balans[actiefjaar][boekNr].value) {
                  balans[jaar][boekNr].value = balans[actiefjaar][boekNr].value;
                }
                for (let [company, companyObj] of Object.entries(comp)) {
                  if (boekNr < 2000) {
                    if (balans[actiefjaar][company][boekNr].value) {
                      addBoek({
                        Jaar: jaar,
                        Bedrijf: company,
                        BoekNr: boekNr,
                        Bedrag: balans[actiefjaar][company][boekNr].value,
                        Omschrijving: 'BEGIN BALANS',
                      });
                    }
                  }
                }
              }
            }
            actiefjaar = jaar;
          }

          // START BOEKREGEL
          var BTWprocent = Number(boek.BTWprocent || 0);
          var Bedrag = Number(boek.Bedrag || 0);
          var Excl = Math.round(Bedrag * 10000 / (100 + BTWprocent) ) / 100;
          var Btw = Math.round(Excl * BTWprocent) / 100;
          // BOEK EXCL
          var elRowBoek = addBoek({
            Jaar: jaar,
            Bedrijf: boek.Bedrijf,
            BoekNr: boek.post.BoekNR,
            Bedrag: Excl,
            Datum: boek.Datum,
          }, boek);
          // BOEK BTW SCHULD
          if (Btw) addBoek({
            Jaar: jaar,
            Bedrijf: boek.Bedrijf,
            BoekNr: 1252, // BTW SCHULD
            Bedrag: Btw,
            Datum: boek.Datum,
            Opmerking: boek.Mededelingen,
          }, boek);

          var boeknr = Number(boek.post.BoekNR);
          if (boeknr > 2000 && boeknr < 3000) {
            addBoek({
              Jaar: jaar,
              Bedrijf: boek.Bedrijf,
              BoekNr: boeknr < 2200 ? 1151 : 1251, // VORDERING HANDELSDEBITEIR : CREDITEUR
              Bedrag: Bedrag * (boeknr < 2200 ? 1 : -1),
              Datum: boek.Datum,
            }, boek);
            addBoek({
              Jaar: jaar,
              Bedrijf: boek.Bedrijf,
              BoekNr: 1224, // WINST RESERVE
              Bedrag: Excl,
              Datum: boek.Datum,
            }, boek);
          }

          var Rest = Bedrag;
          if (String(boek.KasGiro).toUpperCase() !== 'B') {
            elTB.appendTag('TR', {children: [
              ['TD'],
              ['TD', ['SMALL', 'Kasbetaling'], {colspan:8}],
              ['TD', strValue(Bedrag), {align:'right'}],
            ]});
            Rest -= Bedrag;
            addBoek({
              Jaar: jaar,
              Bedrijf: boek.Bedrijf,
              BoekNr: 1172, // KAS
              Bedrag: Bedrag,
              Datum: boek.Datum,
            }, boek);
            if (boeknr > 2000 && boeknr < 3000) {
              addBoek({
                Jaar: jaar,
                Bedrijf: boek.Bedrijf,
                BoekNr: boeknr < 2200 ? 1151 : 1251, // VORDERING HANDELSDEBITEIR : CREDITEUR
                Bedrag: - Bedrag * (boeknr < 2200 ? 1 : -1),
                Datum: boek.Datum,
              }, boek);
            }
          } else {
            // DUS BANK BOEKING
            // console.log(boek.boekbank);
            if (boek.boekbank) {
              boek.boekbank.forEach((row)=>{
                Rest -= row.Bedrag;
                var linkid = [row.ID,row.BankID].join();

                // KRUIS POST BOEKEN ALS BANK ONGELIJK BEDRIJF
                if (boeknr > 2000 && boeknr < 3000) {
                  addBoek({
                    Jaar: jaar,
                    Bedrijf: boek.Bedrijf,
                    BoekNr: boeknr < 2200 ? 1151 : 1251, // VORDERING HANDELSDEBITEIR : CREDITEUR
                    Bedrag: - row.Bedrag * (boeknr < 2200 ? 1 : -1),
                    Datum: row.bank.Datum,
                  }, boek);
                } else {
                  addBoek({
                    Jaar: jaar,
                    Bedrijf: boek.Bedrijf,
                    BoekNr: boeknr,
                    Bedrag: row.Bedrag,
                    Datum: row.bank.Datum,
                  }, boek);
                }

                if (row.boek.Bedrijf == row.bank.Bedrijf) {
                  elBoek[jaar][row.boek.Bedrijf].appendTag('TR', { children: [
                    ['TD'],
                    ['TD', ['SMALL', ['Betaald via BANK ' + row.bank.Bedrijf, row.bank.Mededelingen].join() ], {colspan:8}],
                    ['TD', strValue(row.Bedrag), {align:'right'}],
                  ]});
                } else {
                  var opm = `Betaald <b>${row.Bedrag.toLocaleString('nl-NL', {minimumIntegerDigits: 1, minimumFractionDigits: 2})}</b> VIA Bank door <b>${row.bank.Bedrijf}</b> zie ${row.bank.Mededelingen}, vergoed per KAS `;
                  elRowBoek.appendTag('DIV').appendTag('A', 'Vergoeding per KAS', {href: '#' + linkid + '_kas_vergoeding'});
                  elRowBoek.appendTag('DIV').appendTag('A', 'Betaling per kas', {href: '#' + linkid + '_kas_betaling'});
                  // elRowBoek.appendTag('DIV', `Er volgt een overboeking KAS`);
                  // elBoek[jaar][row.boek.Bedrijf].appendTag('TR', { children: [
                  //   ['TD'],
                  //   ['TD', ['SMALL', `Betaald VIA Bank door ${row.bank.Bedrijf} zie ${row.bank.Mededelingen}, vergoed per KAS `], {colspan:8} ],
                  //   ['TD', strValue(row.Bedrag), {align:'right'}],
                  // ]});
                  addBoek({
                    Jaar: jaar,
                    Bedrijf: row.boek.Bedrijf,
                    BoekNr: 1172, // KAS
                    Bedrag: row.Bedrag,
                    Datum: row.bank.Datum,
                    name: linkid + '_kas_betaling',
                    // Omschrijving: row.Mededelingen,
                  }, boek).appendTag('DIV', opm);
                  addBoek({
                    Jaar: jaar,
                    Bedrijf: row.bank.Bedrijf,
                    BoekNr: 1172, // KAS
                    Bedrag: - row.Bedrag,
                    Datum: row.bank.Datum,
                    name: linkid + '_kas_vergoeding',
                    // Omschrijving: row.Mededelingen,
                  }, boek).appendTag('DIV', opm);
                }
              });
            }
            // Venootschaps belasting
            if (Number(boek.post.BoekNR) > 2000 && Number(boek.post.BoekNR) < 3000) {
              addBoek({
                Jaar: jaar,
                Bedrijf: boek.Bedrijf,
                BoekNr: 3001, // Vennootschap
                Bedrag: Excl * 0.20,
                Datum: boek.Datum,
              }, boek);
            }

          }
          Rest=Math.round(Rest * 100) / 100;
          if (Rest) {
            elTB.appendTag('TR',{ children: [
              ['TD'],
              ['TD', 'Nog niet betaald', {colspan:8}],
              ['TD', strValue(Rest), {align:'right'}],
            ]});
            // if (boek.post.BoekNR > 2200) {
            //   addValue(jaar, 1151, boek.Bedrijf, Rest);
            // // } else if (boek.post.BoekNR > 2200) {
            // //
            // } else {
            //   addValue(jaar, 1251, boek.Bedrijf, Rest);
            // }
          }
        })

        console.log ('GB', balans);
        (goTable1 = function(obj, level) {
          obj.jaar = {};
          for (let [name, child] of Object.entries(obj)) {
            if (['el','jaar'].includes(name)) return;
            let boekNr = child.volgnr;
            if (!boekNr) {
              goTable1(child, level + 1);
            }
            // console.log(name,boekNr,child.totJaar);
            for (let [jaar, jaarObj] of Object.entries(jaren)) {
              jaar = jaar.trim();
              obj.jaar[jaar] = obj.jaar[jaar] || {};
              var totJaar = 0;
              for (let [company, companyObj] of Object.entries(comp)) {
                var value = boekNr
                ? balans[jaar][company][String(boekNr)].value * (boekNr < 1150 || [1173,1174,1153].includes(boekNr) ? -1 : 1) // ALLES KLEINER DAN 1150 OP BALANS INVERTEREN
                : child.jaar[jaar][company];
                obj.jaar[jaar][company] = obj.jaar[jaar][company] || 0;
                obj.jaar[jaar][company] += value;
                totJaar += value;
                child.el[jaar][company].innerText = strValue(value);
              };
              child.el[jaar].el.innerText = strValue(totJaar);
            };
          }
        })(gb, 1);
      });



    }
  }
})
