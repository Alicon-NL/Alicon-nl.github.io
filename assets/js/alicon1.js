aim.libraries.edit = async function (e) {
  // const cols = {
  //   name: {
  //     name: 'name',
  //   }
  // }
  // const rows = [
  //   {
  //     name: 'Max',
  //   }
  // ]
  // $('form').parent(document.body).append(
  //   $('div').prop(rows[0], cols['name']),
  //   $('div').prop(rows[0], cols['name'], true),
  // )
  //


  // // return;
  // const aimClientId = aim.config.client_id;
  // const aimConfig = {
  //   client_id: aimClientId,
  //   scope: 'openid profile name email',
  // };
  // const aimClient = aim.client = new aim.PublicClientApplication(aimConfig);
  // const authProvider = {
  //   getAccessToken: async () => {
  //     return aimClient.storage.getItem('accessToken');
  //   }
  // };
  // const dmsConfig = {
  //   client_id: aimClientId,
  //   servers: [ { url: 'https://aliconnect.nl' } ],
  // };
  // const dmsClient = aim.Client.initWithMiddleware({authProvider}, dmsConfig);
  aim.config.url = 'http://localhost/api';
  this.page();
  var response = await aim.dataClient.api('/abis/data').get()
  console.log(response)

  return;

  var response = await aim.client.api('/abis/data', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json",
    },
    body: 'foo=bar&lorem=ipsum'
  })



  return;
  const self = this;
  const dmsOrigin = 'https://dms1.aliconnect.nl';

  Object.assign(aim, {
    fetch: (url, options) => new Request(url, options),
  })
  function Client () {
    var baseUrl = 'https://dms1.aliconnect.nl/api';
    var baseUrl = 'http://localhost/api';
    const url = new URL(baseUrl);
    this.origin = url.origin;
    this.basePath = url.pathname;
    this.options = Object.assign(...arguments);
  }
  Client.prototype = {
    api(path, options = {}) {
      aim.fetch(this.origin + this.basePath + path, options)
      this.url = new URL(this.basePath + path, this.origin);
      this.options = options;
      return this;
    },
  }
  // const aimClient = new aim.Client({});

  // console.log(new Error('ja'))

  var response = await aim.fetch('/abis/data', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json",
    },
    body: 'foo=bar&lorem=ipsum'
  })
  console.log(response);
  return;

  var response = await aimClient.api('/abis/data', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json",
    },
    body: 'foo=bar&lorem=ipsum'
  })
  // // Set the Prefer=outlook.timezone header so date/times are in
  // // user's preferred time zone
  // .header("Prefer", `outlook.timezone="${user.mailboxSettings.timeZone}"`)
  // // Add the startDateTime and endDateTime query parameters
  // .query({ startDateTime: startOfWeek.format(), endDateTime: endOfWeek.format() })
  // // Select just the fields we are interested in
  // .select('subject,organizer,start,end')
  // // Sort the results by start, earliest first
  // .orderby('start/dateTime')
  // // Maximum 50 events in response
  // .top(50)
  .get()
  .catch(console.warn)
  //
  // updatePage(Views.calendar, response.value);
  console.log(response);
  return;



  fetch('users.json')
  .then(status)
  .then(json)
  .then(function(data) {
    console.log('Request succeeded with JSON response', data);
  }).catch(function(error) {
    console.log('Request failed', error);
  });


  return;
  aim.Elem.prototype.printpdf = function() {
    // console.log(this.elem.innerText);
    elem = $('div').append(
      $('link').href(document.location.origin + '/assets/css/brief.css').rel('stylesheet'),
      $('body').append(
        $('header').append(
          $('span').text('Brief van Max')
        ),
        $('footer').append(
          $('span').class('pagenum')
        ),
        $('div').class('letter-from').html([
          '<b>Alicon Projects BV</b>',
          'Bezoekadres',
          'Klingelbeekseweg 67',
          'Oosterbeek',
          'Postadres',
          'Geelkerkenkamp 14A',
          '6862ER Oosterbeek',
        ].join('<br>')),
        $('div').class('letter-to').append(
          $('div').text('Frits')
        ),
        $('table').append(
          $('tr').append(
            $('th').text('Datum'),
            $('th').text('Ref'),
          ),
          $('tr').append(
            $('td').text(new Date().toLocaleDateString()),
            $('td').text(56477546),
          ),
        ),
        $('main')
        .html(aim.markdown().render(this.elem.innerText))
        .append(
          $('p').text('Met vriendelijke groet,'),
          $('p').text('Max van Kampen,'),
          $('div').text('Op al onze leveringen zijn de algemene ICT levervoorwaarden ...')
        ),
      ),
    )
    console.log(elem.elem.innerHTML);
    fetch("pdf.php", {
      method: 'post',
      body: elem.elem.innerHTML,
      // headers: new Headers({
      //   "Authorization": "Bearer " + token
      // })
    })
    .then(response => response.blob())
    .then(blob => {
      var data_url = URL.createObjectURL(blob);
      const iframe = document.querySelector('iframe') || $('iframe').style('display:none;').parent(document.body).elem;
      iframe.src = URL.createObjectURL(blob);
      iframe.onload = e => iframe.contentWindow.print();
      // setTimeout(e => iframe.remove(),5000);
    });
    elem.remove();
  }

  const searchPramas = new URLSearchParams(document.location.search);
  if (searchPramas.has('edit-src')) {
    const editSrc = searchPramas.get('edit-src');
    let to;
    fetch(editSrc + '.html', {
      headers: new Headers({
        'cache-control': 'no-cache',
      })
    })
    .then(response => response.text())
    .then(body => {
      console.log(body);
      $(document.body).append(
        $('button').text('print').on('click', e => editElem.printpdf()),
        $('button').text('send').on('click', e => {
          $().url('https://aliconnect.nl/api/abis/data').query({
            request_type: 'send',
          }).input({
            to: 'max.van.kampen@alicon.nl',
            chapters: [
              {
                title: `Groet max`,
                content: aim.markdown().render(editElem.elem.innerText),
              },
            ],
            attachements: [
              {
                content: 'Uw factuur',
                name: `aliconnect-factuur.pdf`.toLowerCase(),
              }
            ]
          }).post().then(e => {
            console.log(e.body);
          })
        })
      )
      // document.execCommand('defaultParagraphSeparator', false, 'p');
      const editElem = $('pre').html(body).parent(document.body).editor().style('padding:20px;border:solid 1px red;').on('keyup', e => {
        clearTimeout(to);
        to = setTimeout(e => {
          $().url('edit.php').input(editElem.elem.innerHTML).post().then(e => {
            console.log(e.body)
          })
        }, 1000)
      });
      console.log('edit', editSrc);
    })
  }
}
