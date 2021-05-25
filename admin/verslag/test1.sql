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
	where boeknr not in (
	1131--,1151,1152,1153,1155,1171--,1172,1211,1251,1252,1253,1254,1256
	--,2111
	,2112,2221,2222
	,2224
	--,2355
	,2312,2354,2324,2351,2311,1173,1174,2352,2223,4001,2211--,2212--,2251
	,2252
	,2254
	,2255
	)

GO
--SELECT * FROM b17.boeking where boeknr in (1224)



GO
ALTER PROCEDURE [b17].[balansget] @jaar CHAR(4)
AS
	SET NOCOUNT ON
	SET DATEFORMAT DMY
	DECLARE @lastdateofyear DATE
	SET @lastdateofyear=CONVERT(DATE,DATEADD(day,-1,DATEADD(year,1,'01-01-'+@jaar)))
	DECLARE @q TABLE (q CHAR(1),datum DATE, jaarq VARCHAR(5))
	INSERT @q VALUES (1,'31-03-'+@jaar,@jaar+'1'),(2,'30-06-'+@jaar,@jaar+'2'),(3,'30-09-'+@jaar,@jaar+'3'),(4,'31-12-'+@jaar,@jaar+'4')

	DECLARE @bd TABLE (bedrijf VARCHAR(150))
	INSERT @bd VALUES ('MJVK Beheer BV'),('Alicon Projects BV'),('Alicon Systems BV')

	DELETE gb.boekingbank where boekingid not in (select boekingid from gb.boeking)

	DECLARE @B TABLE (boekNr int,id INT,bedrijf VARCHAR(100),datum DATE,boekdatum DATE,jaar INT,q CHAR(1),bedrag FLOAT,oms VARCHAR(250),boekOms VARCHAR(250),omschrijving VARCHAR(250))

	DECLARE @O TABLE (BoekNr INT,Oms VARCHAR(100),datum DATE,jaarq VARCHAR(5),bedrijf VARCHAR(100),btw FLOAT)
	INSERT @O 
	SELECT 1301,'Omzet BTW '+bedrijf+' '+q.jaarq,q.datum,q.jaarq,bedrijf,SUM(btw) btw 
	FROM  b17.boeking  B
	INNER JOIN @q Q ON Q.jaarq=jaar*10+b.q AND btw<>0 AND jaar=@jaar AND Boeknr IN (2111,2112) 
	GROUP BY bedrijf,q.jaarq,q.datum 
	INSERT @O 
	SELECT 1302,'Voorbelast '+bedrijf+' '+q.jaarq,q.datum,q.jaarq,bedrijf,SUM(btw) btw 
	FROM  b17.boeking  B
	INNER JOIN @q Q ON Q.jaarq=jaar*10+b.q AND btw<>0 AND jaar=@jaar AND Boeknr NOT IN (2111,2112) 
	GROUP BY bedrijf,q.jaarq,q.datum 

	DECLARE @GB TABLE (datum DATE,BoekNr INT,bedrijf VARCHAR(100),omschrijving VARCHAR(250),postid INT,kas CHAR(1))
	INSERT @GB (kas,datum,boeknr,bedrijf,omschrijving)
	SELECT 'B',@lastdateofyear,1252,'MJVK Beheer BV',@jaar+' Schuld omzetbelasting Eenheid'
	UNION ALL SELECT 'B',@lastdateofyear,1256,'MJVK Beheer BV',@jaar+' VB Schuld Eenheid'
	--UNION ALL SELECT 'K',@lastdateofyear,3001,bedrijf,@jaar+' VB '+bedrijf FROM @bd

	UNION ALL SELECT 'K',@lastdateofyear,1256,bedrijf,@jaar+' VB schuld '+bedrijf FROM @bd WHERE bedrijf NOT IN ('MJVK Beheer BV')
	--UNION ALL SELECT 'K',CONVERT(DATE,DATEADD(day,-1,'01-12-'+@jaar)),1256,'MJVK Beheer BV',@jaar+' VB schuld van '+bedrijf FROM @bd
	UNION ALL SELECT 'K',@lastdateofyear,1256,'MJVK Beheer BV',@jaar+' VB ontvangst '+bedrijf FROM @bd WHERE bedrijf NOT IN ('MJVK Beheer BV')
	UNION ALL SELECT 'K',CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),1301,bedrijf,Q.jaarq+' BTW '+bedrijf FROM @bd BD CROSS JOIN @Q Q
	UNION ALL SELECT 'K',CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),1302,bedrijf,Q.jaarq+' Voorbelast '+bedrijf FROM @bd BD CROSS JOIN @Q Q
	UNION ALL SELECT 'K',CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),1301,'MJVK Beheer BV',Q.jaarq+' BTW ontvangst '+bedrijf FROM @bd BD CROSS JOIN @Q Q
	UNION ALL SELECT 'K',CONVERT(DATE,DATEADD(day,-1,DATEADD(month,Q.q*3,'01-01-'+@jaar))),1302,'MJVK Beheer BV',Q.jaarq+' Voorbelast ontvangst '+bedrijf FROM @bd BD CROSS JOIN @Q Q

	UPDATE @GB SET postID=P.postID FROM (SELECT bedrijf B,boeknr BN,postID FROM b17.post) P WHERE bedrijf=b AND boeknr=bn

	--SELECT * FROM @GB
	INSERT gb.boeking (datum,postid,omschrijving) 
	SELECT datum,postId,omschrijving
	FROM @GB 
	WHERE omschrijving NOT IN (SELECT omschrijving FROM gb.boeking WHERE omschrijving IS NOT NULL)

	UPDATE gb.boeking SET excl=0,bedrag=0,btwprocent=0,kasgiro=GB.kas,datum=GB.datum
	FROM @GB GB
	WHERE gb.boeking.omschrijving = GB.omschrijving
	
	UPDATE gb.boeking SET excl=O.bedrag,bedrag=O.bedrag,btwprocent=0 FROM (
		SELECT -O.btw bedrag,CONVERT(VARCHAR(10),O.jaarq)+' BTW '+O.bedrijf omschrijving FROM @O O WHERE boeknr=1301
		UNION ALL SELECT O.btw bedrag,CONVERT(VARCHAR(10),O.jaarq)+' BTW Ontvangst '+O.bedrijf omschrijving FROM @O O WHERE boeknr=1301
		UNION ALL SELECT -O.btw bedrag,CONVERT(VARCHAR(10),O.jaarq)+' Voorbelast '+O.bedrijf omschrijving FROM @O O WHERE boeknr=1302
		UNION ALL SELECT O.btw bedrag,CONVERT(VARCHAR(10),O.jaarq)+' Voorbelast Ontvangst '+O.bedrijf omschrijving FROM @O O WHERE boeknr=1302
	) O WHERE gb.boeking.omschrijving=O.omschrijving

	UPDATE gb.boeking SET excl=-O.btw,bedrag=-O.btw,btwprocent=0 FROM (
		SELECT B.boekingId,O.* 
		FROM (SELECT SUM(btw)btw FROM @O O) O
		INNER JOIN gb.boeking B ON B.omschrijving IN (@jaar+' Schuld omzetbelasting Eenheid')
	) O WHERE gb.boeking.boekingid=O.boekingid

	--INSERT @B SELECT BoekNr,null,bedrijf,datum,datum,@jaar,null,-btw,jaarq,jaarq,O.oms FROM @O O --WHERE BoekNr=1302
	--INSERT @B SELECT BoekNr,null,bedrijf,datum,datum,@jaar,null,btw,jaarq,jaarq,O.oms+' aan MJVK' FROM @O O --WHERE BoekNr=1302
	--INSERT @B SELECT 1172,null,bedrijf,datum,datum,@jaar,null,-btw,jaarq,jaarq,O.oms+' aan MJVK' FROM @O O --WHERE BoekNr=1302
	--INSERT @B SELECT 1172,null,'MJVK Beheer BV',datum,datum,@jaar,null,btw,jaarq,jaarq,O.oms FROM @O O --WHERE BoekNr=1302
	--INSERT @B SELECT BoekNr,null,'MJVK Beheer BV',datum,datum,@jaar,null,-btw,jaarq,jaarq,O.oms FROM @O O --WHERE BoekNr=1302

	-- BEREKENING RESULTAAT BEDRIJFSVOERING
	INSERT gb.boeking (datum,postid,omschrijving) 
	SELECT '31-12-'+@jaar,P.postId,@jaar
	FROM b17.post P 
	LEFT OUTER JOIN b17.boeking B ON B.postid = P.postid AND B.oms = @jaar 
	WHERE P.boeknr IN (1224) AND B.id IS NULL

	-- BEREKENING VENNOOTSCHAPSBELASTING
	DECLARE @V TABLE (jaar INT,bedrijf VARCHAR(100),bedrag INT)

	INSERT @V
	SELECT @jaar AS jaar,B.bedrijf,round(-sum(excl)*0.2,0) as excl
	FROM b17.boeking B 
	where jaar=@jaar AND B.boeknr>2000 --AND B.boeknr<3000
	group by B.bedrijf

	--SELECT * FROM @V


	-- BEREKENING WINSTRESERVE
	UPDATE gb.boeking SET excl = ISNULL(T.excl,0) , bedrag = ISNULL(T.excl,0)
	FROM b17.boeking B 
	LEFT OUTER JOIN (
		SELECT @jaar AS jaar,B.bedrijf,round(sum(excl)*0.8,0)  as excl
		FROM b17.boeking B 
		where jaar=@jaar AND B.boeknr>2000 --AND B.boeknr<3000
		group by B.bedrijf
	) AS T ON B.jaar = T.jaar AND B.bedrijf = T.bedrijf 
	WHERE B.boeknr = 1224 AND boekingid = B.id AND B.oms = @jaar


	UPDATE gb.boeking SET excl=O.bedrag,bedrag=O.bedrag,btwprocent=0 FROM (
		SELECT bedrag,@jaar+' VB schuld '+bedrijf AS omschrijving FROM @V
		--UNION ALL SELECT bedrag,@jaar+' VB schuld van '+bedrijf AS omschrijving FROM @V
		UNION ALL SELECT -bedrag,@jaar+' VB Ontvangst '+bedrijf AS omschrijving FROM @V
		UNION ALL SELECT SUM(bedrag),@jaar+' VB Schuld Eenheid' AS omschrijving FROM @V
	) O WHERE gb.boeking.omschrijving=O.omschrijving


	INSERT @B 
	SELECT boekNr,null,bedrijf,'01-01-'+@jaar,'01-01-'+@jaar,@jaar,null,bedrag,null,null,'Beginbalans' FROM b17.beginbalans where JAAR=@jaar-1 AND boeknr<2000


	INSERT @B SELECT 3001,null,bedrijf,@lastdateofyear,@lastdateofyear,@jaar,null,bedrag,null,null,@jaar+' VB '+bedrijf FROM @V V

	INSERT @B SELECT 1256,null,bedrijf,@lastdateofyear,@lastdateofyear,@jaar,null,-bedrag,null,null,@jaar+' VB schuld '+bedrijf FROM @V V --WHERE bedrijf NOT IN ('MJVK Beheer BV')


	--INSERT @B SELECT 1256,null,bedrijf,@lastdateofyear,@lastdateofyear,@jaar,null,-bedrag,null,null,@jaar+' VB schuld '+bedrijf FROM @V V WHERE bedrijf NOT IN ('MJVK Beheer BV')
	
	INSERT @B SELECT 1256,null,'MJVK Beheer BV',@lastdateofyear,@lastdateofyear,@jaar,null,-bedrag,null,null,@jaar+' VB schuld van '+bedrijf FROM @V V 
	--WHERE bedrijf NOT IN ('MJVK Beheer BV')



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
	where  jaar=@jaar 

	-- Afboeken BTW / Vennootschap, is als bank betaald
	INSERT @B 
	SELECT B.BoekNr,B.id,B.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar = @jaar AND boeknr IN (1252,1256)
	
	-- Afboeken Vennootschap, is als kas betaald
	--UNION ALL 
	--SELECT B.BoekNr,B.id,B.bedrijf,B.datum,B.datum,B.jaar,null,-B.bedrag,oms,boekOms,omschrijving+' XXX ('+convert(varchar(10),B.bedrag)+')' omschrijving
	--	FROM b17.boeking B WHERE B.jaar = @jaar AND boeknr IN (1256) AND kas='K'
	
	-- KAS BETALINGEN
	INSERT @B
	SELECT 1172,id,bedrijf,datum,boekdatum,jaar,q,bedrag,oms,boekOms,omschrijving 
	FROM  b17.boeking 
	where  jaar=@jaar AND kas IN ('k','c')-- AND boeknr < 3000--NOT in (1301,1302) 

	-- BANK BETALING ALLES GEBOEKT BEDRIJF = BEDRIJF, DUS ALLEEN BANK GELIJK AAN BEDRIJF
	INSERT @B 
	SELECT 1171,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+CONVERT(VARCHAR(10),B.datum)+' '+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf=BB.bedrijf

	-- ALS EEN BOEKING BANK VAN/OP VERKEERDE REKENING 
	-- ADMIN BOEKBEDRIJF
	-- A) ZIJN AL VERWERKT ALS BETALING OP DE DEB/CRED BIJ HET BOEKBEDRIJF, MAAR HEBBEN GEEN BANK VERWERKING OP ACTIVA
	-- B) OP ACTIVA WORDT DIT EEN KAS BETALING MET VERWIJZING NAAR BANK VAN ANDER BEDRIJF
	INSERT @B 
	SELECT 1172,B.id,B.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+CONVERT(VARCHAR(10),B.datum)+' '+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar = @jaar AND B.bedrijf <> BB.bedrijf

	-- ADMIN BANKBEDRIJF
	-- BANK BIJSCHRIJVING IS GELIJK EEN KAS NAAR BOEKBEDRIJF, EN AF VISA VERSA
	-- A) DE BANK BETALING WORDT GEBOEKT OP ACTIVA, MET VERWIJZING NAAR BOEK BEDRIJF
	INSERT @B 
	SELECT  1171,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,BB.bedrag,oms,boekOms,omschrijving+' BANK ('+CONVERT(VARCHAR(10),B.datum)+' '+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar = @jaar AND B.bedrijf <> BB.bedrijf
	-- B) NEGATIEVE BOEKING ACTIVA KAS, MET VERWIJZING NAAR BOEK BEDRIJF
	INSERT @B 
	SELECT  1172,B.id,BB.bedrijf,BB.datum,BB.datum,BB.jaar,null,-BB.bedrag,oms,boekOms,omschrijving+' BANK ('+CONVERT(VARCHAR(10),B.datum)+' '+convert(varchar(10),B.bedrag)+')' omschrijving
		FROM b17.boeking B
		INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar = @jaar AND B.bedrijf <> BB.bedrijf

	-- == CREDITEUREN
	-- BOEKINGEN HANDELS CREDITEUR
	--INSERT @B
	--SELECT CASE B.boeknr WHEN 2222 THEN 1255 ELSE 1251 END	
	--,B.id,B.bedrijf,BB.datum,B.boekdatum,BB.jaar,q,BB.bedrag,oms,boekOms,CONVERT(VARCHAR(10),B.datum)+' - '+omschrijving omschrijving 
	--FROM  b17.boeking B
	--INNER JOIN b17.boekingbank BB ON BB.jaar=@jaar AND BB.id=B.id AND B.boeknr>2000  AND kas NOT IN ('k','c') AND B.bedrag<0

	--INSERT @B
	--SELECT CASE B.boeknr WHEN 2222 THEN 1255 ELSE 1251 END	
	--,B.id,B.bedrijf,BB.datum,B.boekdatum,BB.jaar,q,BB.bedrag,oms,boekOms,CONVERT(VARCHAR(10),B.datum)+' - '+omschrijving omschrijving 
	--FROM  b17.boeking B
	--INNER JOIN b17.boekingbank BB ON BB.jaar=@jaar AND BB.id=B.id AND B.boeknr>2000  AND kas NOT IN ('k','c') AND B.bedrag<0


	--INSERT @B
	SELECT CASE B.boeknr WHEN 2222 THEN 1255 ELSE 1251 END
	,B.id,B.bedrijf,datum,boekdatum,jaar,q,-B.bedrag-ISNULL(BB1.bedrag,0)-ISNULL(BB.bedrag,0),oms,boekOms,omschrijving,B.bedrag,BB.bedrag,BB1.bedrag
	FROM  b17.boeking B
	LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE bedrag IS NOT NULL AND jaar=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE bedrag IS NOT NULL AND jaar<@jaar GROUP BY id,bedrijf) BB1 ON BB1.id = B.id 
	WHERE 
		B.jaar<=@jaar 
		AND B.bedrag<0 
		AND boeknr>2000 
		AND kas NOT IN ('k','c') 
		AND (B.bedrag-ISNULL(BB1.bedrag,0)-ISNULL(BB.bedrag,0)<>0 OR -B.bedrag+ISNULL(BB1.bedrag,0)<>0)

	--INSERT @B
	--SELECT CASE B.boeknr WHEN 2222 THEN 1255 ELSE 1251 END	
	--,B.id,B.bedrijf,datum,boekdatum,jaar,q,-BB.bedrag,oms,boekOms,omschrijving 
	--FROM  b17.boeking B
	--LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE jaar=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	--WHERE jaar<=@jaar AND B.bedrag<0 AND boeknr>2000 AND kas NOT IN ('k','c') AND -B.bedrag+ISNULL(BB.bedrag,0)<>0

	--INSERT @B
	--SELECT CASE B.boeknr WHEN 2222 THEN 1255 ELSE 1251 END	
	--,B.id,B.bedrijf,datum,boekdatum,jaar,q,-BB.bedrag,oms,boekOms,omschrijving 
	--FROM  b17.boeking B
	--LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE jaar=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	--WHERE jaar<=@jaar AND B.bedrag<0 AND boeknr>2000 AND kas NOT IN ('k','c') AND -B.bedrag+ISNULL(BB.bedrag,0)<>0

	--SELECT * FROM b17.boekingbank


	-- == DEBITEUREN
	-- BOEKINGEN HANDELS DEBITEUR
	--INSERT @B
	--SELECT 1151	
	--,B.id,B.bedrijf,BB.datum,B.boekdatum,BB.jaar,q,BB.bedrag,oms,boekOms,CONVERT(VARCHAR(10),B.datum)+' - '+omschrijving omschrijving 
	--FROM  b17.boeking B
	--INNER JOIN b17.boekingbank BB ON BB.jaar=@jaar AND BB.id=B.id AND B.boeknr>2000  AND kas NOT IN ('k','c') AND B.bedrag>0
	
	INSERT @B
	--SELECT 1151,B.id,B.bedrijf,datum,boekdatum,jaar,null,B.bedrag-ISNULL(BB.bedrag,0),oms,boekOms,omschrijving 
	SELECT 1151,B.id,B.bedrijf,datum,boekdatum,jaar,null,-BB.bedrag,oms,boekOms,omschrijving 
	FROM  b17.boeking B
	LEFT OUTER JOIN (SELECT bedrijf,id,SUM(bedrag) AS bedrag FROM b17.boekingbank WHERE jaar=@jaar GROUP BY id,bedrijf) BB ON BB.id = B.id 
	where jaar<=@jaar AND B.bedrag>0 AND boeknr>2000 AND kas NOT IN ('k','c') AND -B.bedrag+ISNULL(BB.bedrag,0)<>0




	DELETE b17.beginbalans WHERE JAAR = @jaar

	INSERT b17.beginbalans (jaar,boeknr,bedrijf,bedrag)
	SELECT @jaar,boeknr,bedrijf,round(sum(bedrag),0)
	FROM @B 
	GROUP BY boeknr,bedrijf

	SELECT boekNr,bedrijf,bedrag FROM b17.beginbalans WHERE JAAR = @jaar-1 AND boeknr<2000

	-- BOEKREGELS
	-- ALLE REGELS TOT EN MET DIT JAAR

	SELECT boekNr,bedrijf,id,datum,bedrag,omschrijving,boekOms FROM @B --where bedrag <>0 AND (jaar=@jaar)-- OR (jaar<@jaar AND boeknr<2000))
	--WHERE boeknr=1251
	--UNION ALL
	--SELECT boekNr,bedrijf,null,'01-01-'+@jaar,bedrag,'Beginbalans','Beginbalans' FROM b17.beginbalans where JAAR=@jaar-1 AND boeknr<2000
	
	--UNION ALL
	--SELECT boekNr,bedrijf,id,datum,bedrag,omschrijving,boekOms FROM @B where jaar=@jaar AND bedrag <>0 AND boeknr>2000 --AND boeknr<3000 
	order by datum

GO
--EXEC [b17].[balansget] 2014
EXEC [b17].[balansget] 2015






