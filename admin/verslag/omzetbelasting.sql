USE [aliconadmin]
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
	--where boeknr not in (0000)
GO



ALTER PROCEDURE [api].[omzetbelastingoverzicht]
AS
	select 
		SUBSTRING(CONVERT(VARCHAR(5),P.Periode),1,4) Jaar,
		P.Periode,
		ISNULL(CONVERT(INT,omzet),0)AS Omzet,
		ISNULL(convert(int,omzet*0.21),0) as BTW,
		ISNULL(convert(int,-kosten),0) Kosten,
		ISNULL(convert(int,-vb),0) VB,
		ISNULL(leveringdiensten,0)AangOmzet,
		ISNULL(leveringbtw,0)AangBTW,
		ISNULL(voorbelast,0)AangVB
	from 
		periode P
		LEFT OUTER JOIN (
			select jaar*10+q periode,sum(excl)omzet,sum(btw)btw
			from b17.boeking
			where bedrijf_id in(2,3,4) and boekOms='Omzet 21%'
			group by jaar*10+q
		) O ON O.periode=P.periode
		LEFT OUTER JOIN (
			select jaar*10+q periode,sum(excl)kosten,sum(btw)vb
			from b17.boeking
			where bedrijf_id in(2,3,4) and boeknr>2200 and boeknr<3000 and boekOms<>'Omzet 21%'
			group by jaar*10+q
		) V ON V.periode=P.periode
		LEFT OUTER JOIN (
			select periode,sum(leveringdiensten)leveringdiensten,sum(leveringbtw)leveringbtw,sum(voorbelast)voorbelast
			from gb.btw
			where bedrijf_id in(2,3,4) 
			group by periode
		) B ON B.periode=P.periode
	order by P.periode
GO

select * from b17.boeking order by jaar desc,q desc

