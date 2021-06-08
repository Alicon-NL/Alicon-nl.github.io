USE [aliconadmin]
GO
SET DATEFORMAT DMY
GO
ALTER VIEW [b17].[boeking]
AS
	SELECT --top 1
		convert(varchar(20),boekingId) id
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
	where 
	boeknr not in (
	0000
	--,1256 -- vennoot

	--,1131,1151,1152,1153,1155,1171,1172
	
	--,1211,1251
	----,1252
	----,1253
	--,1254
	--,2111
	--,2112,2221,2222
	--,2224
	--,2355
	--,2312,2354,2324,2351,2311--,1173,1174,2352,2223,4001,2211
	--,2212 -- <<<<<
	--,2251
	--,2252
	--,2254
	--,2255
	)
	--and	bd.bedrijf IN ('Alicon Systems BV')
	--and (boeknr <> 2212 or datum='31-03-2014'  )
	--and not (boeknr = 2212 AND bd.bedrijf IN ('Alicon Systems BV') AND datum<'31-03-2014'  )
	--and (boeknr <> 2212 or datum='12-03-2014'  )
GO
	--SELECT * FROM b17.boeking 

	GO
ALTER VIEW [b17].[aim_boeking]
AS
    SELECT I.keyID,CONVERT(DATE,ISNULL(I.startDt,GETDATE()))startDt,p.* 
    FROM (SELECT * FROM aim.api.fieldspivot(2347321,1180)) X PIVOT(max(value) 
    FOR name in (Company,Bedrag,BTW,Kas,BoekNr,Omschrijving,Relatie)) P 
    INNER JOIN aim.api.items I ON I.id=P.id;
GO
--SELECT * FROM b17.boeking

ALTER VIEW [b17].[boekingbank]
AS
	SELECT 
		B.bankId,BB.boekingId AS id,BB.bedrag,B.datum,DATEPART(year,B.datum) jaar,BD.bedrijf,Mededelingen
	FROM
		gb.boekingbank BB 
		INNER JOIN dbo.bank B ON BB.bankId=B.bankid
		INNER JOIN gb.bedrijf BD ON BD.rek_nr=B.rekening
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
	DELETE gb.boekingbank where bankid not in (select bankid from dbo.bank)

	--SELECT * FROM b17.post P 
	--SELECT * FROM b17.boeking 

	DECLARE @TB TABLE (keyid INT,datum DATE,id INT,Bedrijf VARCHAR(100),Bedrag FLOAT,BoekNaam VARCHAR(100),Omschrijving VARCHAR(500),Relatie VARCHAR(100),boekNr INT)
	
	INSERT @TB SELECT id,datum,NULL,bedrijf,Excl,boekOms,Omschrijving,Relatie,boekNr FROM b17.boeking R WHERE jaar = @jaar AND boeknr>2000

	INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(Excl)*0.8,'WINST','WINST','',1224 FROM b17.boeking R WHERE jaar = @jaar AND boeknr>2000 GROUP BY bedrijf
	INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,-SUM(Excl)*0.2,'VB','VB','',3001 FROM b17.boeking R WHERE jaar = @jaar AND boeknr>2000 GROUP BY bedrijf

	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,-SUM(Excl)*0.2,'VB','VB','',1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf
	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,-SUM(BTW),'BTW','BTW','',1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf

	INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(Excl)*0.2,'VB','VB','',1256 FROM b17.boeking R WHERE jaar = @jaar AND boeknr>2000 GROUP BY bedrijf
	INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(BTW),'BTW','BTW','',1252 FROM b17.boeking R WHERE jaar = @jaar AND boeknr>2000 GROUP BY bedrijf




	--boekregel
	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(Excl)*0.2,'VB','VB','',CASE WHEN SUM(Excl)*0.2>0 THEN 1256 ELSE 1155 END FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf




	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,-SUM(BTW),'BTW','BTW','',1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf



	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(BTW),'BTW','BTW','',CASE WHEN SUM(BTW)>0 THEN 1252 ELSE 1152 END FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf
	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(Bedrag),'KAS','KAS','',1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND kas IN ('k','c') GROUP BY bedrijf

	INSERT @TB SELECT id,datum,NULL,bedrijf,Bedrag,boekOms,'KAS '+Omschrijving,Relatie,1172 FROM b17.boeking R WHERE jaar = @jaar AND kas IN ('k','c') --AND boeknr>2000 


	-- BANK BOEKINGEN BEDRIJF=BEDRIJF
	INSERT @TB 
	SELECT B.id,BB.datum,NULL,BB.bedrijf,BB.bedrag,'Bank',omschrijving,'',1171
	FROM b17.boeking B
	INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf=BB.bedrijf

	INSERT @TB 
	SELECT B.id,BB.datum,NULL,B.bedrijf,BB.bedrag,'Bank','BANK'+omschrijving,'',boeknr
	FROM b17.boeking B
	INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar WHERE boeknr<2000

	INSERT @TB SELECT id,datum,NULL,bedrijf,Excl,boekOms,'KAS '+Omschrijving,Relatie,boekNr FROM b17.boeking R WHERE jaar = @jaar AND kas IN ('k','c') AND boeknr<2000 



	-- BANK BOEKINGEN BEDRIJF<>BEDRIJF, omboeken via kas
	INSERT @TB 
	SELECT B.id,BB.datum,NULL,B.bedrijf,BB.bedrag,'Kas',' '+BB.bedrijf+' '+omschrijving,'',1172
	FROM b17.boeking B
	INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf<>BB.bedrijf

	INSERT @TB 
	SELECT B.id,BB.datum,NULL,BB.bedrijf,-BB.bedrag,'Kas','Van '+B.bedrijf+' '+omschrijving,'',1172
	FROM b17.boeking B
	INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf<>BB.bedrijf

	INSERT @TB 
	SELECT B.id,BB.datum,NULL,BB.bedrijf,BB.bedrag,'Bank','Betaald voor '+B.bedrijf+' '+omschrijving,'',1171
	FROM b17.boeking B
	INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf<>BB.bedrijf




	--INSERT @TB SELECT null,'31-12-'+@jaar,NULL,bedrijf,SUM(kas),'KAS','KAS','',1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 GROUP BY bedrijf

	--DEBITEUREN 
	INSERT @TB 
	SELECT NULL,'31-12-'+@jaar,NULL,B.bedrijf,SUM(B.bedrag-ISNULL(BB.bedrag,0)),'DEBITEUREN','DEBITEUREN','DEBITEUREN',1151
	FROM b17.boeking B
	LEFT OUTER JOIN (SELECT id,SUM(bedrag)bedrag FROM b17.boekingbank WHERE jaar<=@jaar GROUP BY id)BB ON BB.id=B.id 
	WHERE B.bedrag>0 AND B.bedrag-ISNULL(BB.bedrag,0)<>0 AND B.jaar<=@jaar AND boeknr>=2000 AND B.kas NOT IN ('k','c')
	GROUP BY bedrijf

	--CREDITEUREN
	INSERT @TB 
	SELECT NULL,'31-12-'+@jaar,NULL,B.bedrijf,-SUM(B.bedrag-ISNULL(BB.bedrag,0)),'CREDITEUREN','CREDITEUREN','CREDITEUREN',1251
	FROM b17.boeking B
	LEFT OUTER JOIN (SELECT id,SUM(bedrag)bedrag FROM b17.boekingbank WHERE jaar<=@jaar GROUP BY id)BB ON BB.id=B.id 
	WHERE B.bedrag<0 AND B.bedrag-ISNULL(BB.bedrag,0)<>0 AND B.jaar<=@jaar AND boeknr>=2000 AND B.kas NOT IN ('k','c')
	GROUP BY bedrijf

	UPDATE @TB SET bedrag=-bedrag where boeknr=1131



	--INSERT @TB SELECT id,datum,NULL,bedrijf,Excl,boekOms,Omschrijving,Relatie,1224 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000

	--INSERT @TB SELECT id,datum,NULL,bedrijf,BTW,boekOms,'BTW Omzet van '+Omschrijving,Relatie,1252 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND BTW>0
	--INSERT @TB SELECT id,datum,NULL,bedrijf,BTW,boekOms,'BTW Voorbelast van '+Omschrijving,Relatie,1152 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND BTW<0

	--INSERT @TB SELECT id,datum,NULL,bedrijf,Bedrag,boekOms,Omschrijving,Relatie,1151 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag>0
	--INSERT @TB SELECT id,datum,NULL,bedrijf,-Bedrag,boekOms,Omschrijving,Relatie,1151 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag>0 AND kas IN ('k','c')

	---- BANK BOEKINGEN BEDRIJF=BEDRIJF
	--INSERT @TB SELECT B.id,BB.datum,NULL,BB.bedrijf,BB.bedrag,'Bank',omschrijving,'',1171 
	--FROM b17.boeking B INNER JOIN b17.boekingbank BB ON BB.id = B.id AND BB.jaar=@jaar AND B.bedrijf=BB.bedrijf





	--INSERT @TB SELECT id,datum,NULL,bedrijf,Bedrag,boekOms,Omschrijving,Relatie,1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag>0 AND kas IN ('k','c')

	--INSERT @TB SELECT id,datum,NULL,bedrijf,Bedrag,boekOms,Omschrijving,Relatie,1251 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag<0
	--INSERT @TB SELECT id,datum,NULL,bedrijf,-Bedrag,boekOms,Omschrijving,Relatie,1251 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag<0 AND kas IN ('k','c')
	--INSERT @TB SELECT id,datum,NULL,bedrijf,Bedrag,boekOms,Omschrijving,Relatie,1172 FROM b17.boeking R WHERE jaar <= @jaar AND boeknr>2000 AND Bedrag<0 AND kas IN ('k','c')





	SELECT keyID,datum,bedrijf,bedrag,boekNaam boekOms,boekNaam+ISNULL(': '+Relatie,'')+ISNULL(': '+omschrijving,'')omschrijving,Relatie,boekNr
	FROM @TB 
	ORDER BY Bedrijf,datum,Bedrag DESC




GO
--EXEC [b17].[balansget] 2014
--EXEC [b17].[balansget] 2014






