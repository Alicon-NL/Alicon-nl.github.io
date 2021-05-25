USE [aliconadmin]
GO
ALTER TRIGGER [gb].[boekingDelete] ON  [gb].[boeking] AFTER DELETE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE gb.regel WHERE boekingid in ( SELECT boekingid FROM deleted)
END
GO

ALTER TRIGGER [gb].[boekingUpdate] ON  [gb].[boeking] AFTER INSERT,UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE gb.regel WHERE boekingid in ( SELECT boekingid FROM inserted)
	
	----VORDERING HANDELSDEBITEIR : CREDITEUR
	--INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END,
	--	CASE WHEN P.BoekNR<2200 THEN B.Bedrag ELSE -B.Bedrag END
	--FROM inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId
	--WHERE P.BoekNR>2000 AND P.BoekNR<3000

	---- SCHULD OMZET ---BELASTING, ALTIJD OP MJVK EENHEID
	--INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	1252,
	--	ROUND(B.Bedrag-B.Excl,2) -- BTW BEDRAG
	--FROM inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId
	--WHERE P.BoekNR>2000 AND P.BoekNR<3000 AND B.Bedrag-B.Excl<>0

	----BOEKEN VAN DE POST ZELF
	--INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	P.BoekNR,
	--	CASE WHEN P.BoekNR<1200 THEN -ROUND(B.Excl,2) ELSE ROUND(B.Excl,2) END 
	--	--ROUND(B.Excl,2) 
	--FROM inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId

	-- ALS KAS
	-- > KAS
	--INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	1172, -- KAS
	--	B.Bedrag
	--FROM inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId
	--WHERE B.KasGiro <> 'B' -- EN ALLEEN BIJ KAS, VOOR ALLES

	---- > VORDERING HANDELSDEBITEIR : CREDITEUR
	--INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END,
	--	CASE WHEN P.BoekNR<2200 THEN -B.Bedrag ELSE B.Bedrag END
	--FROM inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId
	--WHERE B.KasGiro <> 'B' -- ALLEEN BIJ KAS
	--AND P.BoekNR>2000 AND P.BoekNR<3000 -- EN ALLEEN VOOR DEB?CRED


END
GO
ALTER TRIGGER [gb].[boekingBankDelete] ON  [gb].[boekingBank] AFTER DELETE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE gb.regel
	WHERE ID IN (
		SELECT ID FROM gb.regel R
		INNER JOIN deleted I ON R.BoekingID = I.BoekingID AND R.BankID = I.BankID
	)
END
GO


GO
ALTER TRIGGER [gb].[boekingBankUpdate] ON  [gb].[boekingBank] AFTER INSERT,UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DELETE gb.regel
	WHERE ID IN (
		SELECT ID FROM gb.regel R
		INNER JOIN Inserted I ON R.BoekingID = I.BoekingID AND R.BankID = I.BankID
	)

	--	-- AFBOEKEN VAN BANK BANK REGEL
	--INSERT gb.regel (BoekingID,BankID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT
	--	I.BoekingID,
	--	I.BankID,
	--	BD.bedrijf_id,
	--	B.Datum,
	--	1171,
	--	ROUND(I.Bedrag,2)
	--FROM inserted I
	--INNER JOIN dbo.bank B ON B.BankID = I.BankID
	--INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
	--INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
	--INNER JOIN dbo.post P ON BK.postId = P.postId 
	--WHERE I.Bedrag <> 0
	
	-- ALS BANK <> BANK DAN VIA KAS
		-- Bij BANK BEDRIJF NEGATIEF KAS
		INSERT gb.regel (BoekingID,BankID,BedrijfID,Datum,BoekNR,Bedrag) 
		SELECT
			I.BoekingID,
			I.BankID,
			BD.bedrijf_id,
			B.Datum,
			1172,
			- ROUND(I.Bedrag,2)
		FROM inserted I
		INNER JOIN dbo.bank B ON B.BankID = I.BankID
		INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
		INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
		INNER JOIN dbo.post P ON BK.postId = P.postId AND P.bedrijf_id <> BD.bedrijf_id
		WHERE I.Bedrag <> 0

		-- Bij POST BEDRIJF KAS IDEM BANK
		INSERT gb.regel (BoekingID,BankID,BedrijfID,Datum,BoekNR,Bedrag) 
		SELECT
			I.BoekingID,
			I.BankID,
			P.bedrijf_id,
			B.Datum,
			1172,
			ROUND(I.Bedrag,2)
		FROM inserted I
		INNER JOIN dbo.bank B ON B.BankID = I.BankID
		INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
		INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
		INNER JOIN dbo.post P ON BK.postId = P.postId AND P.bedrijf_id <> BD.bedrijf_id
		WHERE I.Bedrag <> 0

	-- > VORDERING HANDELSDEBITEIR : CREDITEUR
	INSERT gb.regel (BoekingID,BankID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT
		I.BoekingID,
		I.BankID,
		P.bedrijf_id,
		B.Datum,
		CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END,
		CASE WHEN P.BoekNR<2200 THEN -I.Bedrag ELSE I.Bedrag END
	FROM inserted I
	INNER JOIN dbo.bank B ON B.BankID = I.BankID
	INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
	INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
	INNER JOIN dbo.post P ON BK.postId = P.postId 
	AND P.BoekNR>2000 AND P.BoekNR<3000 -- EN ALLEEN VOOR DEB?CRED
	WHERE I.Bedrag <> 0

	---- > VORDERING HANDELSDEBITEIR : CREDITEUR
	--INSERT gb.regel (BoekingID,BankID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT
	--	I.BoekingID,
	--	I.BankID,
	--	P.bedrijf_id,
	--	B.Datum,
	--	P.BoekNR,
	--	I.Bedrag
	--FROM inserted I
	--INNER JOIN dbo.bank B ON B.BankID = I.BankID
	--INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
	--INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
	--INNER JOIN dbo.post P ON BK.postId = P.postId 
	--AND P.BoekNR IN (1252,1256)
	--WHERE I.Bedrag <> 0


END
GO
ALTER PROCEDURE [gb].[beginbalans_aanmaken](@jaar CHAR(4))
AS
	SET NOCOUNT ON
	SET DATEFORMAT DMY
	DELETE gb.regel WHERE BoekingID=0 AND DATEPART(YEAR, Datum) = @jaar

	-- BEGIN BALANS
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag, Omschrijving)
	SELECT 0, BedrijfID, '01-01-'+@jaar Datum, BoekNR, SUM(RT.Bedrag) Bedrag, 'Beginbalans ' + @jaar
	FROM gb.regel RT 
	WHERE DATEPART(YEAR,RT.Datum)=@Jaar-1 AND BoekNR < 2000 -- AND RT.BoekNR = RJ.BoekNR AND RT.BedrijfID = RJ.BedrijfID
	GROUP BY BedrijfID, BoekNR
	ORDER BY BedrijfID, BoekNR


	--VORDERING HANDELSDEBITEIR : CREDITEUR
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT 
			0,
			P.bedrijf_id,
			'31-12-'+@jaar,
			CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END,
			SUM(CASE WHEN P.BoekNR<2200 THEN B.Bedrag ELSE -B.Bedrag END)
		FROM gb.boeking B
		INNER JOIN dbo.post P ON B.postId = P.postId
		WHERE P.BoekNR>2000 AND P.BoekNR<3000
		AND DATEPART(YEAR,B.Datum)=@Jaar
		GROUP BY P.bedrijf_id, CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, BoekNR, Bedrag FROM regels

	--VORDERING HANDELSDEBITEIR : CREDITEUR BOEKING BANK
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT 
			0,
			P.bedrijf_id,
			'31-12-'+@jaar,
			P.BoekNR,
			SUM(I.Bedrag)
		FROM 
			gb.boekingBank I
			INNER JOIN dbo.bank B ON B.BankID = I.BankID
			INNER JOIN gb.bedrijf BD ON BD.rek_nr = B.Rekening
			INNER JOIN gb.boeking BK ON BK.boekingID = I.BoekingID
			INNER JOIN dbo.post P ON BK.postId = P.postId 
		AND P.BoekNR IN (1252,1256)
		WHERE DATEPART(YEAR,B.Datum)=@Jaar
		AND I.Bedrag <> 0
		GROUP BY P.bedrijf_id, P.BoekNR
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, BoekNR, Bedrag FROM regels

	--BOEKEN VAN DE POST ZELF
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT 
			0,
			P.bedrijf_id,
			'31-12-'+@jaar,
			P.BoekNR,
			SUM(CASE WHEN P.BoekNR<1200 THEN -ROUND(B.Excl,2) ELSE ROUND(B.Excl,2) END)
		FROM gb.boeking B
		INNER JOIN dbo.post P ON B.postId = P.postId
		WHERE DATEPART(YEAR,B.Datum)=@Jaar
		GROUP BY P.bedrijf_id, P.BoekNR
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, BoekNR, Bedrag FROM regels

	-- BOEKEN KAS
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT 
			0,
			P.bedrijf_id,
			'31-12-'+@jaar,
			1172, -- KAS
			SUM(B.Bedrag)
		FROM gb.boeking B		
		INNER JOIN dbo.post P ON B.postId = P.postId
		WHERE DATEPART(YEAR,B.Datum)=@Jaar
		AND B.KasGiro <> 'B' -- EN ALLEEN BIJ KAS, VOOR ALLES
		GROUP BY P.bedrijf_id
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, BoekNR, Bedrag FROM regels


	-- > VORDERING HANDELSDEBITEIR : CREDITEUR
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT 
			0,
			P.bedrijf_id,
			'31-12-'+@jaar,
			CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END,
			SUM(CASE WHEN P.BoekNR<2200 THEN -B.Bedrag ELSE B.Bedrag END)
		FROM gb.boeking B
		INNER JOIN dbo.post P ON B.postId = P.postId
		WHERE DATEPART(YEAR,B.Datum)=@Jaar
		AND B.KasGiro <> 'B' -- ALLEEN BIJ KAS
		AND P.BoekNR>2000 AND P.BoekNR<3000 -- EN ALLEEN VOOR DEB?CRED
		GROUP BY P.bedrijf_id, CASE WHEN P.BoekNR<2200 THEN 1151 ELSE 1251 END
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, BoekNR, Bedrag FROM regels


	---- WINST RESERVE 100%
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, '31-12-'+@jaar Datum, 1224, SUM(RT.Bedrag) Bedrag
	FROM gb.regel RT 
	WHERE DATEPART(YEAR,RT.Datum)=@Jaar AND RT.BoekNR > 2000 AND RT.BoekNR < 3000
	GROUP BY RT.BedrijfID--, RT.BoekNR
	--ORDER BY RT.BedrijfID--, RT.BoekNR
		
	-- BOEKEN VENOOTSCHAPS BELASTING (20%)
	;WITH regels (Datum, BedrijfID, Bedrag)	AS (
		SELECT '31-12-'+@jaar, RT.BedrijfID, SUM(RT.Bedrag) * 0.2 Bedrag
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@Jaar AND RT.BoekNR > 2000 AND RT.BoekNR < 3000
		GROUP BY RT.BedrijfID--, RT.BoekNR
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, Datum, 1256, Bedrag FROM regels
	UNION ALL
	SELECT 0, BedrijfID, Datum, 1224, - Bedrag FROM regels

	---- BOEKEN VENOOTSCHAPS BELASTING (20%)
	;WITH regels (Datum, BedrijfID, Bedrag)	AS (
		SELECT '31-12-'+@jaar, RT.BedrijfID, SUM(RT.Bedrag) * 0.2 Bedrag
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@Jaar AND RT.BoekNR > 2000 AND RT.BoekNR < 3000
		GROUP BY RT.BedrijfID, RT.BoekNR
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, Datum, 3001, - Bedrag FROM regels


	-- SCHULD OMZET ---BELASTING, ALTIJD OP MJVK EENHEID
	;WITH regels (BoekingID,BedrijfID,Datum,BoekNR,Bedrag)	AS (
		SELECT  0, P.bedrijf_id, '31-12-'+@jaar, 1252, SUM(ROUND(B.Bedrag - B.Excl,2)) -- BTW BEDRAG
		FROM gb.boeking B
		INNER JOIN dbo.post P ON B.postId = P.postId
		WHERE P.BoekNR>2000 AND P.BoekNR<3000 AND B.Bedrag-B.Excl<>0
		AND DATEPART(YEAR,B.Datum)=@Jaar
		GROUP BY P.bedrijf_id
	)
	INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	SELECT 0, BedrijfID, Datum, 1252, Bedrag FROM regels

	-- OMZET BELASTING NAAR EENHEID MJVK
	;WITH regels (Datum, BedrijfID, Bedrag)	AS (
		SELECT '31-12-'+@jaar, RT.BedrijfID, SUM(RT.Bedrag) Bedrag
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@Jaar AND RT.BoekNR = 1252 AND BedrijfID IN (2,3)
		GROUP BY RT.BedrijfID
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	-- OMZET BELASTING TOEVOEGEN AAN MJK
	SELECT 0, 4, Datum, 1252, Bedrag FROM regels
	-- OMZET BELASTING NAAR EENHEID MJVK, KAS ONTVANGST VAN BV's
	UNION ALL	SELECT 0, 4, Datum, 1172, Bedrag FROM regels
	-- OMZET BELASTING NAAR EENHEID MJVK, KAS BETALING AAN MJVK
	UNION ALL	SELECT 0, BedrijfID, Datum, 1172, - Bedrag FROM regels
	-- OMZET BELASTING NAAR EENHEID MJVK, AFBOEKEN OMZET SCHULD
	UNION ALL	SELECT 0, BedrijfID, Datum, 1252, - Bedrag FROM regels

	-- DGA VERREKENEN MET KAS
	;WITH regels (BedrijfID, Datum, Bedrag) AS (
		SELECT BedrijfID, '31-12-'+@jaar, SUM(RT.Bedrag)
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@jaar AND RT.BoekNR = 1254 AND BedrijfID IN (2,3)
		GROUP BY RT.BedrijfID
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, Datum, 1172, - Bedrag FROM regels
	UNION ALL 
	SELECT 0, 4, Datum, 1172, Bedrag FROM regels
	UNION ALL 
	SELECT 0, 4, Datum, 1254, Bedrag FROM regels
	UNION ALL 
	SELECT 0, BedrijfID, Datum, 1254, - Bedrag FROM regels

	-- KAS <0 OF > 1000 VERREKENEN MET MJVK BEHEER
	;WITH regels (BedrijfID, Datum, Bedrag) AS (
		SELECT BedrijfID, '01-01-'+@jaar, - FLOOR(SUM(RT.Bedrag)/1000)*1000 Bedrag
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@jaar AND RT.BoekNR = 1172 AND BedrijfID IN (2,3)
		GROUP BY RT.BedrijfID
		HAVING SUM(RT.Bedrag) <> 0
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, Datum, 1172, Bedrag FROM regels
	UNION ALL 
	SELECT 0, 4, Datum, 1172, - Bedrag FROM regels
	UNION ALL 
	SELECT 0, 4, Datum, 1253, - Bedrag FROM regels
	UNION ALL 
	SELECT 0, BedrijfID, Datum, 1253, Bedrag FROM regels

	-- KAS MJVK < 0 OF > 1000 VERREKENEN MET DGA
	;WITH regels (BedrijfID, Datum, Bedrag) AS (
		SELECT BedrijfID, '01-01-'+@jaar, - FLOOR(SUM(RT.Bedrag)/1000)*1000 Bedrag
		FROM gb.regel RT 
		WHERE DATEPART(YEAR,RT.Datum)=@jaar AND RT.BoekNR = 1172 AND BedrijfID IN (4)
		GROUP BY RT.BedrijfID
		HAVING SUM(RT.Bedrag) <> 0
	)
	INSERT gb.regel(BoekingID, BedrijfID, Datum, BoekNR, Bedrag)
	SELECT 0, BedrijfID, Datum, 1172, Bedrag FROM regels
	UNION ALL 
	SELECT 0, BedrijfID, Datum, 1254, Bedrag FROM regels

GO

--SELECT * FROM gb.regel 
--WHERE BoekNR<2000

DELETE gb.regel

UPDATE gb.boeking set postID = postID --WHERE datum<'1-1-2014'
UPDATE gb.boekingBank SET Bedrag = Bedrag

EXEC gb.beginbalans_aanmaken 2013
EXEC gb.beginbalans_aanmaken 2014
EXEC gb.beginbalans_aanmaken 2015
EXEC gb.beginbalans_aanmaken 2016
EXEC gb.beginbalans_aanmaken 2017
EXEC gb.beginbalans_aanmaken 2018
EXEC gb.beginbalans_aanmaken 2019
EXEC gb.beginbalans_aanmaken 2020



--SELECT R.ID,R.BedrijfID,R.Datum,R.BoekingID,R.BoekNR,R.Bedrag FROM aliconadmin.gb.regel R WHERE BedrijfID IN (2,3,4) AND Datum <= '01-01-2014'  ORDER BY Datum DESC

--SELECT * FROM gb.boeking WHERE PostID=800299

	----INSERT gb.regel (BoekingID,BedrijfID,Datum,BoekNR,Bedrag) 
	--SELECT 
	--	B.BoekingID,
	--	P.bedrijf_id,
	--	B.RelatieID, -- 27 > 4 = MJVK, 25 > 2 systems, 26 > 3 projects, RelatieID - 23 = BedrijfID
	--	B.Datum,
	--	1,
	--	B.Bedrag
	--FROM gb.boeking B --inserted B
	--INNER JOIN dbo.post P ON B.postId = P.postId
	--AND P.BoekNR IN (1254)



--
--SELECT * FROM gb.regel WHERE BoekNR IN (2154,1253,1153)

