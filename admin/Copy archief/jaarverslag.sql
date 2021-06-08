USE [aliconadmin]
GO



ALTER VIEW [gb].[boekingPostView]
AS
SELECT
	--BB.bankid,
	BD.bedrijf
	,volgnr,PB.boeknr,boeknroms,isnull(faktor,1) as faktor
	,isnull(B.jaar,DATEPART(year,B.datum)) AS jaar
	,isnull(B.jaar*10+B.periode,DATEPART(year,B.datum)*10+DATEPART(q,B.datum) ) AS kwartaal
	,DATEPART(year,B.datum)*100+DATEPART(month,B.datum) AS maand

	,ISNULL(CONVERT(VARCHAR(50),PB.boeknr)+' ','')+PB.BoeknrOms AS BoekNrEnOms
--	,CASE P.balans WHEN 1 THEN 'Balans' ELSE 'W&V' END AS Grootboek
	,CASE PB.bal
		WHEN 'Schuld' THEN -1
		ELSE 1 
	END * B.excl AS saldo
	,B.excl
	,B.bedrag
	--,CASE WHEN PB.btwcode = 'ja' THEN B.bedrag-B.excl ELSE 0 END AS btw
	,B.bedrag-B.excl AS btw
	,B.btwprocent
	,P.bedrijf_id
	,B.datum 
	,B.omschrijving 
	,B.relatieId 
	,B.boekingId
	,BK1.boekingId AS tegenBoekingId
	,lower(CASE WHEN B.kasgiro in ('k','c') then 'k' else ISNULL(B.kasgiro,'b') end) AS kasgiro
	,B.postId
	,CASE WHEN B.kasgiro='B' THEN CASE WHEN B.bank_dt<'1-1-2015' THEN 'BANK' ELSE 'OPEN' END ELSE 'KAS' END AS betaal
	,B.bank_dt
	,DATEPART(YEAR,B.bank_dt) AS bankjaar
	,R.relatie
	,CASE WHEN B.kasgiro = 'B' AND B.eigenBedrijf <> BD.bedrijf THEN B.eigenBedrijf END AS eigenbedrijf
	,BANK.bankbedrag
FROM
	gb.boeking B
	INNER JOIN dbo.post P ON B.postId = P.postId
	LEFT OUTER JOIN dbo.postBoeknr PB ON PB.boeknr = P.boeknr
	INNER JOIN gb.bedrijf BD ON BD.bedrijf_id = P.bedrijf_id
	LEFT OUTER JOIN gb.boeking BK1 ON BK1.tegenBoekingId = B.boekingID 
	LEFT OUTER JOIN dbo.relatie R ON R.relatieid = B.relatieId
	LEFT OUTER JOIN (SELECT sum(bedrag) as bankbedrag,boekingId FROM gb.boekingBank GROUP BY boekingId) BANK ON Bank.boekingId = B.boekingId
GO

--SELECT * FROM [gb].[boekingPostView] WHERE 


ALTER PROCEDURE [gb].[boekingPostViewJaarBegin]
	@bedrijf VARCHAR(50)
	,@jaar INT
AS
	select 
		PB.VolgNr,BoeknrOms,valtOnderNr,isnull(faktor,1) as faktor,PJ.saldo vorigsaldo,overnemen 
	from 
		postBoekNr PB
		LEFT OUTER JOIN postJaar PJ ON 
			PJ.volgnr = PB.volgnr 
			AND PJ.bedrijf = @bedrijf 
			AND jaar = @jaar-1
    WHERE 
		PB.volgnr<999999999 
	ORDER BY 
		PB.VolgNr 
GO


ALTER PROCEDURE [gb].[boekingPostViewJaar]
	@bedrijf VARCHAR(50)
	,@jaar INT
	,@start INT = 0
	,@eind INT = 900000
AS
	select 
		volgnr
		,boeknr
		,boekingId
		,excl
		,btw
		,bedrag
		,excl as saldo
		,CONVERT(DATE,datum) datum
		,jaar
		,relatie
		,kasgiro
		,bedrijf
		,eigenbedrijf
		,betaal
		,bankbedrag
		,CASE 
			WHEN DATEPART(year,bank_dt)<=@jaar THEN CONVERT(DATE,bank_dt) 
		END AS bank_dt 
		,bankjaar
    from 
		gb.boekingPostView 
    where 
        @bedrijf in (bedrijf,eigenbedrijf) 
        and ( jaar = @jaar or DATEPART(year,bank_dt) = @jaar or (jaar in (@jaar) and kasgiro='b' and bank_dt is null))  
		and boeknr >= @start and boeknr <= @eind
    ORDER BY 
        datum,bedrag
GO
EXEC [gb].[boekingPostViewJaar] 'MJVK Beheer BV',2016,170000,177000
GO

--ALTER PROCEDURE [gb].[boekingPostViewJaar]
--	@bedrijf VARCHAR(50)
--	,@jaar INT
--	,@start INT = 0
--	,@eind INT = 900000

--AS

--	select 
--		volgnr
--		,P.boeknr
--		,boekingId
--		,excl
--		,btw
--		,bedrag
--		,excl as saldo
--		,CONVERT(DATE,datum) datum
--		,jaar
--		,relatie
--		,kasgiro
--		,B.bedrijf
--		,eigenbedrijf
--		,betaal
--		,bankbedrag
--		,CASE 
--			WHEN DATEPART(year,bank_dt)<=@jaar THEN CONVERT(DATE,bank_dt) 
--			ELSE NULL
--		END AS bank_dt 
--		,bankjaar
--    from 
--		gb.bedrijf BD 
--		INNER JOIN dbo.post P ON @bedrijf = BD.bedrijf AND BD.bedrijf_id = P.bedrijf_id AND BD.bedrijf =  @bedrijf
--		LEFT OUTER JOIN gb.boekingPostView B ON 
--			B.postId = P.postId 
--			AND @bedrijf in (B.bedrijf,B.eigenbedrijf) 
--			and ( B.jaar = @jaar or DATEPART(year,B.bank_dt) = @jaar or (B.jaar <= @jaar and B.kasgiro='b' and B.bank_dt is null))  
--			and B.boeknr >= @start and B.boeknr <= @eind
--			--and datum < '1-1-2015'
--    ORDER BY 
--        datum,bedrag

--GO


----EXEC [gb].[boekingPostViewJaarBegin] 'MJVK Beheer BV',2014
--EXEC [gb].[boekingPostViewJaar] 'Alicon Systems BV',2014,0,900000


--delete 
