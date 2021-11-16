$().on('load', async e => {
  console.log(aim.config);
  if (!aim.config.whitelist.includes(aim.config.client.ip)) return;
  aim.om.treeview({
    CRM: {
      Contactpersoon: e => aim.list('Contactpersoon'),
      Organisatie: e => aim.list('Organisatie'),
      Functie: e => aim.list('Functie'),
      Medewerker: e => aim.list('Medewerker'),
    },
    Taken: {
      Project: e => aim.list('Project'),
      Agenda: e => aim.list('Agenda'),
      Activiteit: e => aim.list('Activiteit'),
      Campagne: e => aim.list('Campagne'),
      Fase: e => aim.list('Fase'),
      Leveringen: e => aim.list('Leveringen'),
      Notities: e => aim.list('Notities'),
      Document: e => aim.list('Document'),
      UrenRegistratie: e => aim.list('UrenRegistratie'),
    },
  });
})
