# Administratie

# Jaarverslag

# Voorbereiding
- Christel
  - Saldo op 31/12 van boekjaar noteren per BV rekening
- Max
  - ING Bank export opslaan in `dbo.bank`
- Opgave venootschapsbelasting
  - https://alicon.aliconnect.nl/sites/alicon/admin/verslag/ ([CTRL] + KLIK)


# Opbouw Balans software versie 20.5.1

## DMS

1. Bij boekstuk wijziging
  1. Boeken vordering/schuld debiteur/crediteur (indien W&V post)
  1. Boeken OMZET indien van toepassing. Letop is Excl bedrag. Er wordt niet gekeken naar BTW percentage.
  1. Aanmaken regel m.b.t. boekstuk gebaseerd op POST, daaruit volgt BoekNR gekoppeld aan bedrijf
  1. Indien KAS
    1. Afboeken KAS
    1. Indien 2000 < BoekNr < 3000 dan Afboeken debiteur/crediteur
1. Bij bank koppeling
  1. Afboeken Bank bedrag. Dit is het bedrag dat is gekoppeld en kan een deel zijn van het gehele bank bedrag.
  1. Indien DEB/CRED afboeken
  1. Indien 1252,1256 BTW/VB Dan Afboeken
  1. Indien bedrijf BANK BETALING <> Boekstuk bedrijf
    1. KAS contra aan bank bedrag bij BANK bedrijf
    1. KAS idem bank bedrag bij BOEKSTUK bedrijf
1. Voorbewerking BALANS
  1. BoekNR < 2000 (balans posten) overnemen begin balans van voorgaand jaar
  1. Jaar post winst reserve 80% van W&V
  1. Jaar post VB 20% van W&V
    1. 3001, VB
    1. 1256, Overige kortlopende schulden
  1. Omzet schuld van BV's Naar MJVK BV (Eenheid)
    1. SOM 1252 BTW voor BV's
      1. + MJVK 1252, Schulkd Omzetbelasting
      1. + MJVK 1172, Kas
      1. - BV 1172, Kas
      1. - BV 1252, Schulkd Omzetbelasting
  1. Alle DGA Bankkosten verrekenen met KAS voor BV's
    1. SOM 1254 DGA voor BV's
      1. + MJVK 1254, DGA
      1. + MJVK 1172, Kas
      1. - BV 1172, Kas
      1. - BV 1254, DGA
  1. 0 < KAS < 1000 BV's Verrekenen met MJVK
    1. BoekNR = 1172 AND BedrijfID IN (2,3) <> 0
      1. BV 1172
      1. MJVK 1172 -
      1. MJVK 1253 Groepsmaatschappijen -
      1. BV 1253 Groepsmaatschappijen
  1. KAS MJVK < 0 OF > 1000 VERREKENEN MET DGA
    1. BoekNR = 1172 AND BedrijfID IN (4)
      1. BedrijfID, Datum, 1172, Bedrag
      1. BedrijfID, Datum, 1254, Bedrag
