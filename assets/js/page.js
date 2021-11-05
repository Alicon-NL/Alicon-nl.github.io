$().on('load', async e => {
  console.log(aim.config);
  if (aim.config.whitelist.includes(aim.config.client.ip)) {
    function list(selector, options){
      const args = Array.from(arguments);
      const url = args.shift();
      document.location.hash = `#?l=${aim.urlToId($().url('https://aliconnect.nl/api/'+selector).query(options).toString())}`;
    }
    aim.om.treeview({
      CRM: {
        Contactpersoon: e => list('Contactpersoon'),
        Organisatie: e => list('Organisatie'),
        Functie: e => list('Functie'),
        Medewerker: e => list('Medewerker'),
      },
      Taken: {
        Project: e => list('Project'),
        Agenda: e => list('Agenda'),
        Activiteit: e => list('Activiteit'),
        Campagne: e => list('Campagne'),
        Fase: e => list('Fase'),
        Leveringen: e => list('Leveringen'),
        Notities: e => list('Notities'),
        Document: e => list('Document'),
        UrenRegistratie: e => list('UrenRegistratie'),
      },
    });
  }
})
