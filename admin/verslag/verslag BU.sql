USE [aliconadmin]
GO
ALTER VIEW [b17].[boeking]
AS
	SELECT 
		convert(varchar(10),boekingId) id
		,BD.bedrijf
		,P.bedrijf_id
		,CONVERT(date,datum) as datum
		,CASE WHEN DATEPART(year,datum) = 2013 THEN '1-1-2014' ELSE datum END AS boekdatum
		,CASE WHEN DATEPART(year,datum) = 2013 THEN 2014 ELSE DATEPART(year,datum) END AS jaar
		,CASE WHEN DATEPART(year,datum) = 2013 THEN 1 ELSE DATEPART(Q,datum) END AS q
		,bedrag
		,excl
		,bedrag-excl as btw
		,P.postId
		,P.boekNr
		,P.Omschrijving boekOms
		,ISNULL(kasgiro,'') kas 
		,btwprocent
		,B.omschrijving AS oms
	,CONVERT(VARCHAR(10),P.Boeknr)+'; '+P.Omschrijving+'; '+ISNULL(R.relatie+'; ','')+ISNULL(B.omschrijving,'')+ISNULL(', faktuur: '+B.faktuurnr,'') omschrijving
	,R.relatie
	FROM gb.boeking B
	INNER JOIN dbo.post P ON B.postId = P.postId
	LEFT OUTER JOIN dbo.relatie R ON R.relatieid = B.relatieId
	INNER join gb.bedrijf BD ON BD.bedrijf_id = P.bedrijf_id AND BD.bedrijf IN ('MJVK Beheer BV','Alicon Projects BV','Alicon Systems BV')
	--where boeknr not in (1301,1302)
	
	--where boeknr not in (
	--1131,1151,1152,1153,1155,1171,1172,1211,1251,1252,1253,1254,1256,2111,2112,2221,2222
	----,2224
	----,2355
	--,2312,2354,2324,2351,2311,1173,1174,2352,2223,4001,2211,2212,2251
	--,2252
	--,2254
	--,2255
	--)
	--and P.omschrijving not in ('Managementvergoeding')
	--where boeknr not in (
	----1224,3001
	--2111
	--,2112
	--,2221
	--,2222
	--,2224
	----,2355
	--,2312
	--,2354
	--,2324
	--,2351
	--,2311
	----,2352
	----,2223
	--)
	--where boeknr not in (1251,1252,1253,1254,1256,2111,2112,2221,2222,2224,3001)
	--where boeknr not in (3001)
	--where boeknr in (1224,3001,1152,1252) or B.boekingid in (99,2390)
	--where boeknr<2000 or boeknr in (3001) --or (datum<'1-1-2015')
GO
--SELECT * FROM b17.boeking where boeknr in (1224)


GO
ALTER PROCEDURE [b17].[balansget] @jaar CHAR(4)
AS
	SET NOCOUNT ON
	SET DATEFORMAT DMY
	DECLARE @q TABLE (q CHAR(1),dat DATE, jaarq VARCHAR(5))
	INSERT @q VALUES (1,'31-03-'+@jaar,@jaar+'1'),(2,'30-06-'+@jaar,@jaar+'2'),(3,'30-09-'+@jaar,@jaar+'3'),(4,'31-12-'+@jaar,@jaar+'4')

	DECLARE @bd TABLE (bedrijf VARCHAR(150))
	INSERT @bd VALUES ('MJVK Beheer BV'),('Alicon Projects BV'),('Alicon Systems BV')

	DELETE gb.boekingbank where boekingid not in (select boekingid from gb.boeking)

	DECLARE @B TABLE (boekNr int,id INT,bedrijf VARCHAR(100),datum DATE,boekdatum DATE,jaar INT,q CHAR(1),bedrag FLOAT,oms VARCHAR(250),boekOms VARCHAR(250),omschrijving VARCHAR(250))


	-- MAAK BTW BOEKINGEN
	INSERT gb.boeking (datum,postid,omschrijving) 
	SELECT L.* 
	FROM (
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,12,'01-01-'+@jaar))) datum,176000 postid,'Schuld omzetbelasting '+@jaar+' Eenheid' Omschrijving 
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),800327 postid,'BTW '+@jaar+Q.q+' MJVK Beheer BV' Omschrijving FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),800328,'Voorbelast '+@jaar+Q.q+' MJVK Beheer BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800340,'BTW '+@jaar+Q.q+' Alicon Projects BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800341,'Voorbelast '+@jaar+Q.q+' Alicon Projects BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800342,'BTW '+@jaar+Q.q+' Alicon Systems BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800343,'Voorbelast '+@jaar+Q.q+' Alicon Systems BV' FROM @Q Q

	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800327,'Ontvangst BTW '+@jaar+Q.q+' MJVK Beheer BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800328,'Ontvangst Voorbelast '+@jaar+Q.q+' MJVK Beheer BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800327,'Ontvangst BTW '+@jaar+Q.q+' Alicon Projects BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800328,'Ontvangst Voorbelast '+@jaar+Q.q+' Alicon Projects BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800327,'Ontvangst BTW '+@jaar+Q.q+' Alicon Systems BV' FROM @Q Q
	UNION
	SELECT CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))) ,800328,'Ontvangst Voorbelast '+@jaar+Q.q+' Alicon Systems BV' FROM @Q Q

	) L
	LEFT OUTER JOIN gb.boeking B ON B.postid=L.postID AND B.omschrijving=L.Omschrijving
	WHERE B.boekingID IS NULL

	UPDATE gb.boeking SET excl=0,bedrag=0,btwprocent=0,kasgiro=L.kasgiro
	FROM (
	SELECT B.boekingID,'B'kasgiro FROM gb.boeking B WHERE postid=176000 AND omschrijving='Schuld omzetbelasting '+@jaar+' Eenheid'

	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800327 AND omschrijving='BTW '+@jaar+Q.q+' MJVK Beheer BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800328 AND omschrijving='Voorbelast '+@jaar+Q.q+' MJVK Beheer BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800340 AND omschrijving='BTW '+@jaar+Q.q+' Alicon Projects BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800341 AND omschrijving='Voorbelast '+@jaar+Q.q+' Alicon Projects BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800342 AND omschrijving='BTW '+@jaar+Q.q+' Alicon Systems BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800343 AND omschrijving='Voorbelast '+@jaar+Q.q+' Alicon Systems BV'

	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800327 AND omschrijving='Ontvangst BTW '+@jaar+Q.q+' MJVK Beheer BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800328 AND omschrijving='Ontvangst Voorbelast '+@jaar+Q.q+' MJVK Beheer BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800327 AND omschrijving='Ontvangst BTW '+@jaar+Q.q+' Alicon Projects BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800328 AND omschrijving='Ontvangst Voorbelast '+@jaar+Q.q+' Alicon Projects BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800327 AND omschrijving='Ontvangst BTW '+@jaar+Q.q+' Alicon Systems BV'
	UNION
	SELECT B.boekingID,'K'kasgiro FROM @Q Q INNER JOIN gb.boeking B ON postid=800328 AND omschrijving='Ontvangst Voorbelast '+@jaar+Q.q+' Alicon Systems BV'

	) L
	WHERE gb.boeking.boekingID=L.boekingID
	

	--SELECT * FROM b17.boeking  WHERE datum<'1-1-2014'

	UPDATE gb.boeking SET excl=-B.btw,bedrag=-B.btw,btwprocent=0
	--SELECT *
	FROM (
	SELECT S.*,B.boekingID 
	FROM (
	SELECT bedrijf,jaar*10+q q,SUM(btw) btw 
	FROM  b17.boeking  WHERE btw<>0 AND Boeknr IN (2111,2112)
	GROUP BY bedrijf,jaar*10+q 
	) S
	INNER JOIN gb.boeking B ON B.omschrijving IN ('BTW '+CONVERT(VARCHAR(10),S.q)+' '+S.bedrijf)
	) B
	WHERE gb.boeking.boekingid=B.boekingid

	UPDATE gb.boeking SET excl=B.btw,bedrag=B.btw,btwprocent=0
	--SELECT *
	FROM (
	SELECT S.*,B.boekingID 
	FROM (
	SELECT bedrijf,jaar*10+q q,SUM(btw) btw 
	FROM  b17.boeking  WHERE btw<>0 AND Boeknr IN (2111,2112)
	GROUP BY bedrijf,jaar*10+q 
	) S
	INNER JOIN gb.boeking B ON B.omschrijving IN ('Ontvangst BTW '+CONVERT(VARCHAR(10),S.q)+' '+S.bedrijf)
	) B
	WHERE gb.boeking.boekingid=B.boekingid

	UPDATE gb.boeking SET excl=-B.btw,bedrag=-B.btw,btwprocent=0
	FROM (
	SELECT S.*,B.boekingID 
	FROM (
	SELECT bedrijf,jaar*10+q  q,SUM(btw) btw 
	FROM  b17.boeking WHERE btw<>0 AND Boeknr NOT IN (2111,2112)
	GROUP BY bedrijf,jaar*10+q 
	) S
	INNER JOIN gb.boeking B ON B.omschrijving IN ('Voorbelast '+CONVERT(VARCHAR(10),S.q)+' '+S.bedrijf)
	) B
	WHERE gb.boeking.boekingid=B.boekingid

	UPDATE gb.boeking SET excl=B.btw,bedrag=B.btw,btwprocent=0
	FROM (
	SELECT S.*,B.boekingID 
	FROM (
	SELECT bedrijf,jaar*10+q  q,SUM(btw) btw 
	FROM  b17.boeking WHERE btw<>0 AND Boeknr NOT IN (2111,2112)
	GROUP BY bedrijf,jaar*10+q 
	) S
	INNER JOIN gb.boeking B ON B.omschrijving IN ('Ontvangst Voorbelast '+CONVERT(VARCHAR(10),S.q)+' '+S.bedrijf)
	) B
	WHERE gb.boeking.boekingid=B.boekingid

	UPDATE gb.boeking SET excl=-B.btw,bedrag=-B.btw,btwprocent=0
	--SELECT *
	FROM (
	SELECT S.*,B.boekingID 
	FROM (
	SELECT jaar q,SUM(btw) btw 
	FROM  b17.boeking  WHERE btw<>0 --AND Boeknr NOT IN (2111,2112)
	GROUP BY jaar 
	) S
	INNER JOIN gb.boeking B ON B.omschrijving IN ('Schuld omzetbelasting '+CONVERT(VARCHAR(10),S.q)+' Eenheid')
	) B
	WHERE gb.boeking.boekingid=B.boekingid

	--RETURN

	-- BEREKENING RESULTAAT BEDRIJFSVOERING
	INSERT gb.boeking (datum,postid,omschrijving) 
	SELECT '31-12-'+@jaar,P.postId,@jaar
	FROM b17.post P 
	LEFT OUTER JOIN b17.boeking B ON B.postid = P.postid AND B.oms = @jaar 
	WHERE P.boeknr IN (3001,1224) AND B.id IS NULL

	-- BEREKENING WINSTRESERVE
	UPDATE gb.boeking SET excl = ISNULL(T.excl,0) , bedrag = ISNULL(T.excl,0)
	FROM b17.boeking B 
	LEFT OUTER JOIN (
		SELECT @jaar AS jaar,B.bedrijf,round(sum(excl)*0.8,0)  as excl
		FROM b17.boeking B 
		where jaar=@jaar AND B.boeknr>2000 AND B.boeknr<3000
		group by B.bedrijf
	) AS T ON B.jaar = T.jaar AND B.bedrijf = T.bedrijf 
	WHERE B.boeknr = 1224 AND boekingid = B.id AND B.oms = @jaar

	-- BEREKENING VENNOOTSCHAPSBELASTING
	UPDATE gb.boeking SET excl = ISNULL(T.excl,0) , bedrag = ISNULL(T.excl,0),kasgiro='K'
	FROM b17.boeking B 
	LEFT OUTER JOIN (
		SELECT @jaar AS jaar,B.bedrijf,round(-sum(excl)*0.2,0) as excl
		FROM b17.boeking B 
		where jaar=@jaar AND B.boeknr>2000 AND B.boeknr<3000
		group by B.bedrijf
	) AS T ON B.jaar = T.jaar AND B.bedrijf = T.bedrijf 
	WHERE B.boeknr = 3001 AND boekingid = B.id AND B.oms = @jaar

	INSERT @B

	-- BOEKINGEN
	SELECT  boeknr,id,bedrijf,datum,boekdatum,jaar,q
		,CASE 
			WHEN boeknr < 1200 OR boeknr = 1252 THEN -excl 
			ELSE excl END
		,oms
		,boekOms 
		,omschrijving
	FROM  b17.boeking 
	where  jaar<=@jaar 

	-- KAS BETALINGEN
	UNION ALL
	SELECT 1172,id,bedrijf,datum,boekdatum,jaar,q,bedrag,oms,boekOms,omschrijving 
	FROM  b17.boeking 
	where  jaar<=@jaar AND kas IN ('k','c') --AND boeknr NOT in (1301,1302) 

	---- BTW
	--UNION ALL
	--SELECT 1252,id,bedrijf,datum,boekdatum,jaar,q,-bedrag,oms,boekOms,omschrijving 
	--FROM  b17.boeking 
	--where  jaar<=@jaar AND boeknr in (1301,1302) AND kas NOT IN ('k','c')  




	--UNION ALL
	--SELECT 
	--	CASE WHEN B.btw+ISNULL(BET.bedrag,0)<0 THEN 1152 ELSE 1252 END
	--	,null,B.bedrijf,'31-12-'+@jaar,'31-12-'+@jaar,@jaar,4 as q
	--	,ABS(B.btw+ISNULL(BET.bedrag,0))
	--	,'BTW SCHULD','','Berekende BTW'
	--FROM (
	--	SELECT bedrijf,SUM(btw) btw
	--	FROM  b17.boeking 
	--	where  jaar<=@jaar 
	--	GROUP BY bedrijf
	--) B
	--LEFT OUTER JOIN (SELECT bedrijf, SUM(bedrag) AS bedrag FROM b17.boeking WHERE boeknr=4001 AND jaar<=@jaar GROUP BY bedrijf) BET ON B.bedrijf = BET.bedrijf


	-- BANK BETALING ALLES GEBOEKT BEDRIJF = BEDRIJF, DUS ALLEEN BANK GELIJK AAN BEDRIJF
	UNION ALL 
	SELECT 1171,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar <= @jaar AND B.bedrijf = BB.bedrijf

	-- Afboeken BTW, is als kas betaald
	UNION ALL 
	SELECT B.BoekNr,B.id,B.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar <= @jaar AND boeknr IN (1252)
	
	-- Vennootschap, is als kas betaald aan MJVK, dus post nu verwerken
	UNION ALL 
	SELECT B.BoekNr,B.id,B.bedrijf,B.datum,B.datum,B.jaar,null,-B.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B WHERE boeknr IN (3001)

	-- Vennootschap, is als kas betaald dus overboeken naar MJVK
	UNION ALL 
	SELECT 1172,B.id,'MJVK Beheer BV',B.datum,B.datum,B.jaar,null,-B.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B WHERE boeknr IN (3001)

	-- Venootschap naar MJVK
	UNION ALL 
	SELECT B.BoekNr,B.id,'MJVK Beheer BV',B.datum,B.datum,B.jaar,null,B.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B WHERE boeknr IN (3001)
	
	-- Venootschap naar Overige Kortlopend Schulden
	UNION ALL 
	SELECT 1256,B.id,'MJVK Beheer BV',B.datum,B.datum,B.jaar,null,-B.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B WHERE boeknr IN (3001)


	-- ALS EEN BOEKING BANK VAN/OP VERKEERDE REKENING 
	-- ADMIN BOEKBEDRIJF
	-- A) ZIJN AL VERWERKT ALS BETALING OP DE DEB/CRED BIJ HET BOEKBEDRIJF, MAAR HEBBEN GEEN BANK VERWERKING OP ACTIVA
	-- B) OP ACTIVA WORDT DIT EEN KAS BETALING MET VERWIJZING NAAR BANK VAN ANDER BEDRIJF
	UNION ALL SELECT 1172,B.id,B.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar <= @jaar AND B.bedrijf <> BB.bedrijf

	-- ADMIN BANKBEDRIJF
	-- BANK BIJSCHRIJVING IS GELIJK EEN KAS NAAR BOEKBEDRIJF, EN AF VISA VERSA
	-- A) DE BANK BETALING WORDT GEBOEKT OP ACTIVA, MET VERWIJZING NAAR BOEK BEDRIJF
	UNION ALL SELECT  1171,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar <= @jaar AND B.bedrijf <> BB.bedrijf
	-- B) NEGATIEVE BOEKING ACTIVA KAS, MET VERWIJZING NAAR BOEK BEDRIJF
	UNION ALL SELECT  1172,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,-BB.bedrag,oms,boekOms,omschrijving+' BANK ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar <= @jaar AND B.bedrijf <> BB.bedrijf

	-- == CREDITEUREN
	-- BOEKINGEN HANDELS CREDITEUR
	UNION ALL
	SELECT 
		CASE B.boeknr 
			WHEN 2222 THEN 1255 
			WHEN 3001 THEN 1256
			ELSE 1251
		END	
	,B.id,B.bedrijf,datum,boekdatum,jaar,q,-B.bedrag+ISNULL(BB.bedrag,0),oms,boekOms,omschrijving 
	FROM  b17.boeking B
	LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE jaar<=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	where jaar<=@jaar AND B.bedrag<0 AND boeknr>2000 AND kas NOT IN ('k','c') AND -B.bedrag+ISNULL(BB.bedrag,0)<>0

	-- == DEBITEUREN
	-- BOEKINGEN HANDELS DEBITEUR
	UNION ALL
	SELECT 		CASE B.boeknr 
			WHEN 3001 THEN 1155
			ELSE 1151
		END	
		,B.id,B.bedrijf,datum,boekdatum,jaar,q,B.bedrag-ISNULL(BB.bedrag,0),oms,boekOms,omschrijving 
	FROM  b17.boeking B
	LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE jaar<=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	where jaar<=@jaar AND B.bedrag>0 AND boeknr>2000 AND kas NOT IN ('k','c') AND -B.bedrag+ISNULL(BB.bedrag,0)<>0


	DELETE b17.beginbalans WHERE JAAR = @jaar

	INSERT b17.beginbalans (jaar,boeknr,bedrijf,bedrag)
	SELECT @jaar,boeknr,bedrijf,round(sum(bedrag),0)
	FROM @B 
	GROUP BY boeknr,bedrijf

	SELECT boekNr,bedrijf,bedrag FROM b17.beginbalans WHERE JAAR = @jaar-1


	---- BEGIN BALANS
	---- VOOR BALANS HET TOTAAL VAN HET TOTALE VERLEDEN (ALLE JAREN VOOR DIT JAAR)
	--SELECT boekNr,bedrijf,sum(bedrag) as bedrag FROM @B where jaar<@jaar AND boeknr<2000
	--group by bedrijf,boeknr
	---- VOOR W&V HET TOTAAL VAN HET AFGELOPEN JAAR (DIT JAAT -1)
	--UNION ALL
	--SELECT boekNr,bedrijf,sum(bedrag) as bedrag FROM @B where jaar=@jaar-1 AND boeknr>2000
	--group by bedrijf,boeknr

	-- BOEKREGELS
	-- ALLE REGELS TOT EN MET DIT JAAR
	SELECT boekNr,bedrijf,id,datum,bedrag,omschrijving,boekOms FROM @B where jaar<=@jaar AND bedrag <>0 AND boeknr<2000
	UNION ALL
	SELECT boekNr,bedrijf,id,datum,bedrag,omschrijving,boekOms FROM @B where jaar=@jaar AND bedrag <>0 AND boeknr>2000 --AND boeknr<3000 
	order by datum
	--UNION ALL
	--SELECT boekNr,bedrijf,0,'1-1-'+CONVERT(CHAR(4),@jaar) as datum
	--	,SUM(bedrag) bedrag
	--	,'Begin balans',NULL
	--FROM @B where jaar<@jaar AND boekNr<2000
	--GROUP BY bedrijf,boekNr
	--order by datum

GO
EXEC [b17].[balansget] 2014
--EXEC [b17].[balansget] 2015
--EXEC [b17].[balansget] 2016
--EXEC [b17].[balansget] 2017
--EXEC [b17].[balansget] 2018
