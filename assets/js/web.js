(function (){

  eol = '\n';
  const tagnames = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'frameset', 'frame', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', ];

  var config = {};
  const libraries = {
    start() {
      // console.log('START');
      return;
      if ($.user) $().dashboard();
      else $().home();
    },
    sw() {
      // return;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', e => {
          console.log('MESSAGE', e);
          if (e.data && e.data.url) {
            const url = new URL(e.data.url);
            document.location.href = '#' + url.pathname + url.search;
          }
          // alert('sadfasdfa');
          // window.focus();
        });
        navigator.serviceWorker.register('sw.js', { scope: '/' }).then(function(registration) {
          // console.log('Registration successful, scope is:', registration.scope, navigator.serviceWorker);
          $().sw = registration;
          return;
          // registration.showNotification('sfasdfa');
          registration.pushManager
          .subscribe({ userVisibleOnly: true })
          .then(function(sub) {
            // From your client pages:
            const channel = new BroadcastChannel('sw-messages');
            channel.addEventListener('message', e => {
              console.log('Received', e.data);
            });
            console.log('SW', sub);
            // $().sw = registration.active;
            $().sw.active.postMessage(
              JSON.stringify({
                hostname: document.location.hostname,
                // device_id: $.his.cookie.device_id,
                // access_token: $.his.cookie.access_token,
                // id_token: $.his.cookie.id_token,
                // refresh_token:$.his.cookie.refresh_token,
              }),
            );
            // //console.log("Posted message");
          });
        })
        .catch(function(error) {
          // //console.log('Service worker registration failed, error:', error);
        });
      }
    },
    loadclient() {
      // console.log('AA');
      $().on({
        load() {
          if ($().script && $().script.src) {
            const el = document.createElement('script');
            el.src = $().script.src;
            document.head.appendChild(el);
          }
          // $('list').append(
          //   $('iframe').style('border:none;width:100%;height:100%;').src('/index'),
          // )
          // $('list').load('/index');
        }
      });
    },
    getstarted() {
      $().on({
        async ready() {
          libraries.start();
        }
      });
    },
    oas(){
      $().on('load', e => {
        let config = {
          client_id: $.config.client_id || sessionStorage.getItem('client_id') || '',
          client_secret: $.config.client_secret || sessionStorage.getItem('client_secret') || '',
          domain: '',
          // last_modified: '',
          // info: {
          //   contact: {
          //     email: '',
          //   }
          // }
        }
        // sessionStorage.clear();
        function load(){
          $().url('https://aliconnect.nl/api/aim/oas')
          .accept('application/json')
          .query('response_type', 'config')
          .query('client_id', config.client_id)
          .query('client_secret', config.client_secret)
          .post(JSON.stringify(config)).then(e => start(config = e.body))
          return false;
        }
        function start(){
          $(document.body).text('').class('aim-config');
          // const config = e.body;
          sessionStorage.setItem('client_id', config.client_id || '');
          sessionStorage.setItem('client_secret', config.client_secret || '');
          // config.client_secret = $.config.client_secret;
          console.log('CONFIG', sessionStorage);
          const formElem = $('form').autocomplete("off").parent(document.body).on('submit', load);
          var contentElem = $('details').parent(formElem).append(
            $('summary').text('Config')
          );
          (function build(obj, path){
            Object.entries(obj).forEach(([key,val]) => {
              // return;
              if (val && typeof val === 'object') {
                const parent = contentElem;
                contentElem = $('details').parent(contentElem).append(
                  $('summary').text(isNaN(key) ? key : Number(key)+1)
                );
                build(val, path.concat(key));
                contentElem = parent;
              } else {
                // val = String(val);
                // console.log(typeof val)
                contentElem.append(
                  $('div').append(
                    $('label').text(key),
                    $('input').name(path.join('-')+key).required(val === null ? '' : null).value(val || '').placeholder(' ').on('change', e => {
                      obj[key] = e.target.value;
                      console.log(obj, config)
                    }),
                  )
                )
                if (val === null) {
                  for (var p = contentElem; p; p = p.parentElement) p.open(1);
                }

              }
            })
          })(config, []);
          formElem.append(
            $('button').text('SUBMIT')
          )
          // console.log(e);
        }
        if (config.client_secret) {
          load();
        } else {
          start();
        }
      })
    },
    oas(){
      let elements = document.querySelectorAll('data');
      Array.from(elements[0].attributes).forEach(a => this[a.name]=JSON.parse(a.value));
      console.log(this.config);
      const config = this.config;
      const formElem = $('form').parent(document.body).on('submit', e => {
        console.log(config);
        return false;
      });
      var contentElem = $('details').parent(formElem).append(
        $('summary').text('Config')
      );
      (function build(obj){
        Object.entries(obj).forEach(([key,val]) => {
          // return;
          if (val && typeof val === 'object') {
            const parent = contentElem;
            contentElem = $('details').parent(contentElem).append(
              $('summary').text(isNaN(key) ? key : Number(key)+1)
            );
            build(val);
            contentElem = parent;
          } else {
            if (val === null) {
              val === '';
              for (var p = contentElem; p; p = p.parentElement) p.open(1);
            }
            // val = String(val);
            console.log(typeof val)
            contentElem.append(
              $('div').append(
                $('label').text(key),
                $('input').value(val||'').placeholder(' ').on('change', e => {
                  obj[key] = e.target.value;
                  console.log(obj, config)
                }),
              )
            )
          }
        })
      })(config);
      formElem.append(
        $('button').text('SUBMIT')
      )

      // let config = elements[0].getAttribute('config');
      // console.log(elements[0]);

    },
    async forms(){
      aim.readOnly = false;
      $(document.body).append(
        $('nav').append($('div').append()),
        $('main').append(
          $('div').class('col pv'),
        ),
      );
      // console.log('FORMS', 'https://aliconnect.nl/api/aliconnect/config?path='+document.location.href);
      // const formDefinitions = await fetch(aim.url('/aliconnect/config',{query:{path:document.location.href}}).then(res => res.json());
      const formDefinitions = await aim.api('/aliconnect/config').query('path', document.location.href).get().then(res => res.json());
      // console.log(1111, formDefinitions);
      let data = {
        info: {
          title: '',
          contact: {
            email: '',
            // phone_number: '',
          },
          // description: 'sdfas',
        },
        client: {
          name: '',
          client_id: sessionStorage.getItem('client_id') || '',
          client_secret: sessionStorage.getItem('client_secret') || '',
        }
      };
      // sessionStorage.clear();
      let activeField;
      const formElem = $('form').autocomplete("off").parent('.pv').on('submit', postForm);
      function postForm(e){
        activeField = document.activeElement.name;
        const submit = e && e.submitter ? e.submitter.value : 'post';
        const docBasePath = 'https://aliconnect.nl/aliconnect/aliconnect.sdk/wiki/';
        function replaceFields(body,data){
          (function replaceFields(data,path = []){
            for (let [name,value] of Object.entries(data)) {
              if (value && typeof value === 'object') replaceFields(value, path.concat(name));
              else body = body.replace(new RegExp('{'+path.concat(name).join('-')+'}','g'), value);
            }
          })(data)
          return body;
        }
        function signDocument(name) {
          return new Promise((success, fail) => {
            fetch(docBasePath + name + '.md').then(res => res.text().then(body => {
              body = replaceFields(body,data);
              formElem.text('').html(aim.markdown().render(body)).append(
                $('div').append(
                  // $('button').value('save').text('Opslaan').default(true),
                  $('button').type('button').value('prev').text('Terug').on('click', e => start(data)),
                  $('button').type('button').value('next').text('Verder').on('click', e => {
                    const elem = formElem.elem;//document.querySelector(".pv");
                    const canvas = document.querySelector("canvas");
                    var image = new Image();
                    image.src = canvas.toDataURL();
                    canvas.parentElement.insertBefore(image, canvas);
                    canvas.remove();
                    // console.log(elem.innerHTML);
                    // document.getElementById('image_for_crop').appendChild(image);
                    aim.api('/aliconnect/config').query('path', document.location.href).post({
                      client: { client_id: data.client.client_id, },
                      savepdf: name,
                      html: elem.innerHTML,
                    })
                    .then(success);
                    // return console.log(res);
                  }),
                )
              ).query('canvas', elem => elem.paint())
            }));
          })
        }
        // console.log(data);
        // return false;
        aim.api('/aliconnect/config')
        .query('path', document.location.href)
        .query('response_type', 'config')
        .query('client_id', data.client.client_id)
        .query('client_secret', data.client.client_secret)
        .query('submitter', submit)
        .post(data).then(e => e.json().then(body => {
          data = body;
          if (submit === 'next') {
            signDocument('Explore-Legal-Verwerkers-overeenkomst').then(e => {
              signDocument('Explore-Legal-Protocol-meldplicht-datalekken').then(e => {
                signDocument('Explore-Legal-Verwerkingsregister').then(e => {
                  start(data);
                })
              })
            })
            return;
          }
          start(data);
        }))
        return false;
      }
      function __start(){
        $(document.body).text('').class('aim-config doc-content');
        // var focusElement;
        // const config = e.body;
        sessionStorage.setItem('client_id', data.client.client_id || '');
        sessionStorage.setItem('client_secret', data.client.client_secret || '');
        // config.client_secret = $.config.client_secret;
        console.log('START', data, sessionStorage);
        const formElem = $('form').autocomplete("off").parent(document.body).on('submit', postForm);
        var contentElem = formElem;
        // $('details').open(1).parent(formElem).append(
        //   $('summary').text('Config')
        // );
        let inputId=0;
        function build(key, cfg, path){
          const metaData = cfg.metaData || { title: isNaN(key) ? key : Number(key)+1 };
          var dataObj = data;
          for (let p of path.concat(key)) {
            if (!(p in dataObj)) {
              dataObj = ''; break;
              return;
            }
            dataObj = dataObj[p];
          }
          // console.log(path,key,cfg,dataObj);
          const types = {
            boolean: 'checkbox',
            number: 'number',
            string: 'text',
            object: 'object',
          }

          // var inputElem;') Object.keys(cfg).length === 1) {
          if (cfg.metaData && Object.keys(cfg).length === 1 && (cfg.metaData.type = cfg.metaData.type || types[dataObj ? typeof dataObj : 'string']) && ['text','number','string','boolean'].includes(cfg.metaData.type || 'text')) {
            const name = path.concat(key).join('-');
            // console.log(name, typeof dataObj);
            var placeholder = metaData.placeholder || (metaData.required || dataObj === null ? metaData.title || key : ' ');
            if (typeof dataObj === 'string' && dataObj.match(/^  .*  $/)) {
              placeholder = dataObj.trim();
              dataObj = null;
            }
            if (metaData.format === 'cam') {
              let userMedia;
              const video = $('video').style('background:white;flex-base: 50px;').autoplay().elem;
              const pausePlayElem = $('button').type('button').class('pause').text('Pause/Play').on('click', e => video.paused ? video.play() : video.pause());
              function toggleCam() {
                const rect = video.getBoundingClientRect();
                video.width = rect.width;
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                    pausePlayElem.disabled(true);
                    video.srcObject = null;
                  } else {
                    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                      try {
                        video.srcObject = stream;
                      } catch (error) {
                        video.src = window.URL.createObjectURL(stream);
                      }
                      video.play();
                      pausePlayElem.disabled(false);
                    });
                  }
                }
              }
              contentElem.append(
                $('div').class('input').append(
                  $('span').class('info').title(metaData.description),
                  $('label').class('title').text(metaData.title || key),
                  $('div').class('aco col').append(
                    $('div').class('row').append(
                      $('button').type('button').class('clear').text('Clear'),
                      $('button').type('button').class('on').text('On/Off').on('click', toggleCam),
                      pausePlayElem.disabled(true),
                      $('button').type('button').class('share').text('Share'),
                      $('button').type('button').class('save').text('Save'),
                      $('button').type('button').class('paint').text('Paint'),
                    ),
                    video,
                  )
                ),
              );
            } else if (metaData.format === 'draw') {
              const canvasElem = $('canvas').style('background:white;height:150px;').paint();
              contentElem.append(
                $('div').class('input').append(
                  $('span').class('info').title(metaData.description),
                  $('label').class('title').text(metaData.title || key),
                  $('div').class('aco col').append(
                    $('div').class('row').append(
                      $('button').type('button').class('clear').text('Clear').on('click', e => canvasElem.paint.clear()),
                    ),
                    canvasElem,
                    // $('canvas').class('aco').style('background:white;height:150px;').paint(),
                  )
                ),
              );
            } else {
              contentElem.append(
                $('div').class('input').append(
                  $('span').class('info').title(metaData.description),
                  $('label').class('title').text(metaData.title || key),
                  $('input').id('input'+inputId)
                  .name(name)
                  .value(dataObj === null ? metaData.defaultValue || '' : dataObj)
                  .type(types[typeof dataObj])
                  // .autofocus(name === activeField ? '' : null)
                  .required(metaData.required || dataObj === null ? '' : null)
                  .placeholder(placeholder)
                  .pattern(metaData.pattern)
                  .on('change', e => {
                    let obj = data;
                    path.forEach(key => obj = obj[key] = obj[key] || {});
                    obj[key] = e.target.value;
                  }),
                  // $('label').class('caption').for('input'+inputId),
                  $('label').class('ico').for('input'+inputId),
                )
              )
            }
            inputId++;
            // console.log(inputElem, focusElement);
            // focusElement = focusElement || inputElem;
            // if (name === activeField || metaData.required || dataObj === null || !dataObj) {
            //   focusElement = inputElem;
            // }

            // if (cfg === null) {
            //   for (var p = contentElem; p; p = p.parentElement) p.open(1);
            // }
          } else {
            const parent = contentElem;
            contentElem = $('details').open(1).parent(contentElem).append(
              $('summary').text(metaData.title)
            );
            if (metaData.description) {
              contentElem.append($('div').html(metaData.description))
            }
            Object.entries(cfg).filter(([key,cfg])=>key !== 'metaData').forEach(entry => {
              build(...entry, path.concat(key));
            });
            contentElem = parent;
          }
        }
        Object.entries(formDefinitions).filter(([key,cfg])=>key !== 'metaData').forEach(entry => build(...entry, []));
        // console.log(1, focusElement)
        formElem.append(
          $('button').value('save').text('Opslaan').default(true),
          $('button').value('next').text('Verder'),
        )
        const elems = Array.from(formElem.elem.elements);
        const activeElement = elems.find(el => el.required) || elems.find(el => el.name === activeField) || elems.find(el => !el.value) || elems[0];
        // console.log(elems, activeElement)
        document.querySelectorAll('details').forEach(el => el.open = false);
        Array.from(formElem.elem.elements).forEach(el => {
          if (el.required || el.value) {
            for (var p = el; p; p = p.parentElement) {
              if ('open' in p) {
                p.open = true;
              }
            }
          }
        })
        // console.log(formElem.elem.elements);
        activeElement.focus();

        // focusElement.elem.focus();
      }
      function start(){
        sessionStorage.setItem('client_id', data.client.client_id || '');
        sessionStorage.setItem('client_secret', data.client.client_secret || '');
        var contentElem = formElem;
        inputId=0;
        formElem.text('').buildForm(data,formDefinitions).append(
          $('button').value('save').text('Opslaan').default(true),
          $('button').value('next').text('Verder'),
        )
        const elems = Array.from(formElem.elem.elements);
        const activeElement = elems.find(el => el.required) || elems.find(el => el.name === activeField) || elems.find(el => !el.value) || elems[0];
        document.querySelectorAll('details').forEach(el => el.open = false);
        Array.from(formElem.elem.elements).forEach(el => {
          if (el.required || el.value) {
            for (var p = el; p; p = p.parentElement) {
              if ('open' in p) {
                p.open = true;
              }
            }
          }
        })
        activeElement.focus();
      }
      if (data.client.client_secret) {
        postForm();
      } else {
        start();
      }
    },
    async import(){

      // const configYaml = await fetch('../config/import.yaml').then(res => res.text());
      const config = await fetch('https://aliconnect.nl/yaml.php', {
        method: 'POST',
        body: await fetch('import.yaml').then(res => res.text()),
      }).then(res => res.json());
      console.log(1, config);
      // return;

      window.addEventListener('dragover', e => {
        e.preventDefault();
      })
      window.addEventListener('drop', e => {
        e.preventDefault();
        const data = e.dataTransfer || e.clipboardData;
        if (data.types.includes('Files')) {
          e.preventDefault();
          e.stopPropagation();
          Array.from(data.files).forEach(file => {
            config.import.filter(fileConfig => fileConfig.filename === file.name).forEach(fileConfig => {
              const reader = new FileReader();
              reader.readAsBinaryString(file);
              reader.onload = async e => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                for (let tab of fileConfig.tabs) {
                  tab.colRow = tab.colRow || 1;
                  const sheet = workbook.Sheets[tab.tabname];
                  var [s,colEnd,rowEnd] = sheet['!ref'].match(/:([A-Z]+)(\d+)/);
                  colEnd = XLSX.utils.decode_col(colEnd);
                  console.log(sheet, rowStart,colEnd,rowEnd, sheet['!ref']);
                  for (var c=0; c<=colEnd; c++) {
                    var cell = sheet[XLSX.utils.encode_cell({c:c,r:tab.colRow-1})];
                    if (cell && cell.v) {
                      // console.log(String(cell.v))
                      tab.cols.filter(col => col.title === String(cell.v)).forEach(col => col.colIndex = c);
                    }
                  }
                  const rows = tab.rows = [];
                  // console.log(tab.cols);
                  const cols = tab.cols;//.filter(col => 'colIndex' in col).filter(col => col.name)
                  var rowStart=tab.colRow;
                  const progressElem = $('progress.import').max(rowEnd).value(tab.colRow);
                  const infoElem = $('span.info');
                  // return;
                  const tbody = $('tbody').parent($('.table').append(
                    $('thead').append(
                      $('tr').append(
                        cols.map(col => $('th').text(col.name))
                      )
                    )
                  ));

                  for (var r = tab.colRow; r<=rowEnd; r++) {
                    progressElem.value(r);
                    let row = Object.fromEntries(cols.map(col => [col.name, col.value || null]));
                    cols.forEach(col => {
                      var cell = sheet[XLSX.utils.encode_cell({c:col.colIndex,r:r})];
                      // if (col.name === 'catalogPrice') console.log(col.name, cell)
                      if (cell) {
                        row = row || {};
                        row[col.name] = String(cell.v).trim();
                      }
                    })

                    row.orderCode = row.orderCode || [row.manufacturer,row.artNr].join('.');

                    if (row && row.orderCode) {
                      infoElem.text(`${r} van ${rowEnd}, ${row.supplier}, ${row.orderCode}, ${row.description}`);
                      // console.log(r);
                      tbody.append($('tr').append(
                        tab.cols.map(col => $('td').text(row[col.name]))
                      ));
                      if (1) {
                        tab.cols.filter(col => col.value).forEach(col => row[col.name] = col.value);
                        // infoElem.text(row.host, row.schema, row.keyname);
                        var res = await fetch('import.php', {
                          method: 'POST',
                          body: JSON.stringify(row),
                        }).then(res => res.text());
                      }
                      // return;
                    } else {
                      infoElem.text('');
                    }
                  };
                }
                // console.log(fileConfig);
                // for (let row of rows)
                // const res = await fetch('https://aliconnect.nl/import.php', {
                //   method: 'POST',
                //   body: JSON.stringify({
                //     filename: file.name,
                //     sheets: fileConfig
                //   }),
                // }).then(res => res.text());
                // console.log(res);
                // return importGeneriek(workbook.Sheets.Generiek, file.name);
              }
            })
          })
        }
      });
    },
    async import0(){
      // const configYaml = await fetch('../config/import.yaml').then(res => res.text());
      const config = await fetch('https://aliconnect.nl/yaml.php', {
        method: 'POST',
        body: await fetch('import.yaml').then(res => res.text()),
      }).then(res => res.json());
      console.log(1, config);
      // return;
      window.addEventListener('dragover', e => {
        e.preventDefault();
      })
      window.addEventListener('drop', async e => {
        $('.table').text('');
        e.preventDefault();
        const data = e.dataTransfer || e.clipboardData;
        if (data.types.includes('Files')) {
          e.preventDefault();
          e.stopPropagation();
          const files = data.files;
          const product = await fetch('../product.json').then( response => response.json() );
          console.log(files, product);
          Array.from(files).forEach(file => {
            config.import.filter(fileConfig => fileConfig.filename === file.name).forEach(fileConfig => {
              const reader = new FileReader();
              reader.readAsBinaryString(file);
              reader.onload = async e => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                console.log(fileConfig.tabs);
                for (let tab of fileConfig.tabs) {
                  const prefixArtcode = tab.artcode || '';
                  tab.colRow = tab.colRow || 1;
                  const sheet = workbook.Sheets[tab.tabname];
                  const toprow = [];
                  var [s,colEnd,rowEnd] = sheet['!ref'].match(/:([A-Z]+)(\d+)/);
                  colEnd = XLSX.utils.decode_col(colEnd);
                  function rowvalue(r,c){
                    var cell = sheet[XLSX.utils.encode_cell({c:c,r:r-1})];
                    if (cell) return cell.v;
                  }
                  for (var c=0; c<=colEnd; c++) {
                    toprow[c] = rowvalue(tab.colRow,c);
                  }
                  const cols = [];
                  for (var name in tab.cols) {
                    cols[toprow.indexOf(tab.cols[name])] = name;
                  }
                  const progressElem = $('progress.import').max(rowEnd).value(tab.colRow);
                  const infoElem = $('span.info');
                  const rowStart = tab.colRow;
                  const tbody = $('tbody').parent($('.table').append(
                    $('thead').append(
                      $('tr').append(
                        cols.map(col => $('th').text(col))
                      )
                    )
                  ));
                  for (var r = tab.colRow+1; r<=rowEnd; r++) {
                    progressElem.value(r);
                    let row;
                    cols.forEach((name,c) => {
                      const value = rowvalue(r, c);
                      if (value !== undefined) {
                        row = row || tab.data || {};
                        row[name] = value;
                      }
                    });
                    if (row && row.ordercode && row.artcode) {
                      // console.log(row.artcode, row);
                      row.artcode = prefixArtcode + row.artcode;
                      // console.log(r,row);
                      infoElem.text(rowEnd, r, row.artcode, row.supplier, row.ordercode);
                      var prod = product.find(prod => prod.artcode === row.artcode);
                      if (!prod) product.push(prod = {});
                      Object.assign(prod, row, prod);
                      prod.schemaName = 'supplierproduct';
                      // var data = await fetch('import.php', {method: 'POST', body: JSON.stringify(row)}).then(res => res.json());
                      // var update = Object.fromEntries(cols.filter(Boolean).map(col => [col, data[col] != row[col] ? row[col] : null]));
                      // // console.log(cols.map(col => data[col] != row[col]))
                      // if (!Array.isArray(data) && cols.some(col => data[col] != row[col])) {
                      //   var elem = $('tr').parent(tbody).append(
                      //     cols.map((col,i) => $('td').class(update[col] ? 'update' : '').text(row[col])),
                      //   );
                      //   elem.elem.scrollIntoView();
                      // }
                    }


                    //
                    //
                    // let row = Object.fromEntries(cols.map(col => [col.name, col.value || null]));
                    // cols.forEach(col => {
                    //   var cell = sheet[XLSX.utils.encode_cell({c:col.colIndex,r:r})];
                    //   // if (col.name === 'catalogPrice') console.log(col.name, cell)
                    //   if (cell) {
                    //     row = row || {};
                    //     row[col.name] = String(cell.v).trim();
                    //   }
                    // })
                    //
                    // row.orderCode = row.orderCode || [row.manufacturer,row.artNr].join('.');
                    //
                    // if (row && row.orderCode) {
                    //   infoElem.text(`${r} van ${rowEnd}, ${row.supplier}, ${row.orderCode}, ${row.description}`);
                    //   // console.log(r);
                    //   tbody.append($('tr').append(
                    //     tab.cols.map(col => $('td').text(row[col.name]))
                    //   ));
                    //   if (1) {
                    //     tab.cols.filter(col => col.value).forEach(col => row[col.name] = col.value);
                    //     // infoElem.text(row.host, row.schema, row.keyname);
                    //     var res = await fetch('import.php', {
                    //       method: 'POST',
                    //       body: JSON.stringify(row),
                    //     }).then(res => res.text());
                    //   }
                    //   // return;
                    // } else {
                    //   infoElem.text('');
                    // }
                  };
                }
                console.log(product);
                await fetch("/import.php?data=product", {
                  method: 'POST', // *GET, POST, PUT, DELETE, etc.
                  mode: 'cors', // no-cors, *cors, same-origin
                  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                  credentials: 'same-origin', // include, *same-origin, omit
                  redirect: 'follow', // manual, *follow, error
                  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                  body: JSON.stringify(product, null, 2) // body data type must match "Content-Type" header
                })
                // console.log(fileConfig);
                // for (let row of rows)
                // const res = await fetch('https://aliconnect.nl/import.php', {
                //   method: 'POST',
                //   body: JSON.stringify({
                //     filename: file.name,
                //     sheets: fileConfig
                //   }),
                // }).then(res => res.text());
                // console.log(res);
                // return importGeneriek(workbook.Sheets.Generiek, file.name);
              }
            })
          })
        }
      });
    },
    async page(){
      const searchParams = new URLSearchParams(document.location.search);
      const client_id = aim.config.client_id;
      const aimConfig = {
        client_id: client_id,
        scope: 'openid profile name email',
      };
      const aimClient = new aim.PublicClientApplication(aimConfig);
      // aimClient.storage.clear();
      const aimRequest = {
        scopes: aimConfig.scope.split(' '),
      };
      if (aim.config.accessToken) {
        aimClient.storage.setItem('accessToken', aim.config.accessToken);
      }
      // const storage = localStorage.getItem('storage') ? localStorage : sessionStorage;
      const aimAccount = aimClient.storage.getItem('aimAccount') ? JSON.parse(aimClient.storage.getItem('aimAccount')) : null;
      const authProvider = {
        getAccessToken: async () => {
          return aimClient.storage.getItem('accessToken');
          let account = aimClient.storage.getItem('aimAccount');
          if (!account){
            throw new Error(
              'User account missing from session. Please sign out and sign in again.'
            );
          }
          try {
            // First, attempt to get the token silently
            const silentRequest = {
              scopes: aimRequest.scopes,
              account: aimClient.getAccountByUsername(account)
            };
            const silentResult = await aimClient.acquireTokenSilent(silentRequest);
            return silentResult.accessToken;
          } catch (silentError) {
            // If silent requests fails with InteractionRequiredAuthError,
            // attempt to get the token interactively
            if (silentError instanceof aim.InteractionRequiredAuthError) {
              const interactiveResult = await aimClient.acquireTokenPopup(aimRequest);
              return interactiveResult.accessToken;
            } else {
              throw silentError;
            }
          }
        }
      };
      let dmsConfig = {
        client_id: client_id,
        servers: [{url: aim.config.url || 'https://dms1.aliconnect.nl/api'}],
      };
      const dmsClient = aim.dataClient = aim.Client.initWithMiddleware({authProvider}, dmsConfig);
      dmsConfig = await dmsClient.loadConfig();
      function signOut() {
        aimClient.storage.removeItem('aimAccount');
        aimClient.logout().catch(console.error).then(e => document.location.reload());
      }
      function signIn() {
        aimClient.loginPopup(aimRequest).then(authResult => {
          aimClient.storage.setItem('aimAccount', authResult.account.username);
          document.location.reload();
        })
      }
      function getItem(name, value) {
        if (value !== undefined) {
          localStorage.setItem(name, value);
        }
        return localStorage.getItem(name);
      }
      $(document.documentElement).class(getItem('isApp') || 'page') ;
      $(document.documentElement).attr('dark', localStorage.getItem('dark'));
      if (sessionStorage.getItem('clientId')) {
        await aim.api('/abis/data').query({request_type: 'clientproduct', $filter: 'clientId EQ ' + sessionStorage.getItem('clientId')}).get().then(response => response.json().then(data => aim.clientproduct = data.rows))
        console.log(aim.clientproduct.map(r => r.artId).join(','))
      }
      $(document.body).append(
        $('nav').append($('article').append(
          $('button').class('abtn menu').on('click', e => $(document.documentElement).class(getItem('isApp', getItem('isApp') !== 'app' ? 'app' : 'page' ))),
          $('form').class('search row aco')
          .on('submit', e => {
            document.location.hash = '?$search='+e.target.search.value;
            return false;
            e.preventDefault();
            const url = new URL(document.location);
            const listRef = url.searchParams.get('l');
            if (!listRef) return;
            console.log(aim.idToUrl(listRef));
            const listUrl = new URL(aim.idToUrl(listRef), document.location);
            listUrl.searchParams.set('$search', e.target.search.value);
            // console.log(listRef,listUrl.toString());
            document.location.hash = '#?l='+aim.urlToId(listUrl.toString());
            return false;
            const value = $.searchValue = e.target.search.value;
            var result = value
            ? [...$.props.values()]
            .filter(item => item instanceof Item)
            .unique()
            .filter(item => item.header0 && value.split(' ').every(value => [item.header0,item.name].join(' ').match(new RegExp(`\\b${value}\\b`, 'i'))))
            : [];
            $().list(result);
            return false;
          })
          .append(
            $('input').name('search').autocomplete('off').placeholder('zoeken'),
            $('button').class('abtn icn search fr').title('Zoeken'),
          ),

          $('span').class('pagemenu'),
          $('button').class('abtn dark').on('click', e => $(document.documentElement).attr('dark', getItem('dark', getItem('dark')^1))),
          $('button').class('abtn shop'),
          $('button').class('abtn account').text(aimAccount ? aimAccount.sub : '').append(
            $('div').append(
              aimAccount
              ? [
                $('button').text('afmelden').on('click', signOut),
              ]
              : [
                $('button').text('aanmelden').on('click', signIn),
              ]
            )
          ),
          // $('button').class('abtn account').text(sessionStorage.getItem('clientId') || 'Account').append(
          //   $('div').append(
          //     sessionStorage.getItem('clientId')
          //     ? [
          //       $('button').text('Overzicht').on('click', e => {
          //         aim.api('/abis/data').query({request_type: 'client_overview', clientId: sessionStorage.getItem('clientId')}).get().then(response => response.json().then(data => {
          //           $('.doc-content').text('').append(
          //             $('form').append(
          //               $('details').open(1).append(
          //                 $('summary').text('Algemeen'),
          //                 $('div').append(
          //                   $('label').text('businessAddressStreet'),
          //                   $('input').value(data.client.businessAddressStreet),
          //                 ),
          //                 $('div').append(
          //                   $('label').text('businessAddressPostalCode'),
          //                   $('input').value(data.client.businessAddressPostalCode),
          //                 ),
          //
          //               ),
          //             )
          //           )
          //         }))
          //       }),
          //       $('button').text('Boodschappenlijst').on('click', e => {
          //         aim.api('/abis/data').query({request_type: 'article',$filter: `artId IN (${aim.clientproduct.map(r => r.artId).join(',')})`}).get().then(response => response.json().then(data => listview(data.rows)))
          //       }),
          //       $('button').text('Uitloggen'),
          //     ]
          //     : $('button').text('aanmelden').on('click', e => {
          //       $('.pv').text('').append(
          //         $('form').append(
          //           $('div').append(
          //             $('label').text('Gebruikersnaam'),
          //             $('input').name('accountname'),
          //           ),
          //           $('div').append(
          //             $('label').text('Wachtwoord'),
          //             $('input').type('password').name('password'),
          //           ),
          //
          //         )
          //       )
          //     })
          //   )
          // ),
        )),
        $('header').append($('article')),
        $('main').append($('article').append(
          $('div').class('col tv left noselect np')
          .css('min-width', $().storage('tree.width') || '200px')
          .on('click', e => {
            // this.asideLeft.elem.style.left = null;
          })
          .append(
            $('nav').class('btnbar np').append(
              $('button').class('abtn r popout').on('click', e => {
                var url = document.location.origin;
                // var url = 'about:blank';
                const rect = this.elem.getBoundingClientRect();
                console.log(this.win);
                if (this.win) {
                  console.log(this.win);
                  return this.win.focus();
                }
                const win = this.win = window.open(url, null, `top=${window.screenTop},left=${window.screenLeft+document.body.clientWidth-rect.width},width=${rect.width},height=${rect.height}`);
                window.addEventListener('beforeunload', e => win.close());
                const doc = this.win.document;
                doc.open();
                doc.write(pageHtml);
                doc.close();
                const aim = $;
                win.onload = function (e) {
                  const $ = this.$;
                  const document = win.document;
                  $(document.documentElement).class('app');
                  $(document.body).class('col aim om bg').id('body').append(
                    // $('section').class('row aco main').id('section_main').append(
                    $('section').tree().class('aco').style('max-width:auto;'),
                    // ),
                    $('footer').statusbar(),
                  );
                  (async function () {
                    await $().translate();
                    await $().getApi(document.location.origin+'/api/');
                    await $().login();
                    if (aim().menuChildren) {
                      $().tree(...aim().menuChildren);
                    }
                    // await $(`/Contact(${aimClient.sub})`).details().then(item => $().tree($.user = item));
                    // console.log(aim.user.data);
                    $().tree(aim.user.data);
                  })()
                }
              }),
              $('button').class('abtn pin').on('click', e => {
                $(document.body).attr('tv', $(document.body).attr('tv') ? null : 0);
              }),
              // $('button', 'abtn icn close'),
            ),
            $('div').class('oa list'),
          ),
          // .contextmenu(this.menu)
          $('div').seperator(),


          $('aside').class('left'),
          $('section').class('pv doc-content').css('max-width', $().storage('view.width') || '700px')


          // .append(
          //   $('nav').class('doc-nav'),
          //   $('header').class('doc-header'),
          //   $('article'),
          // )
          ,
          $('div').class('lv'),
          $('div').class('dv'),
          $('aside').class('right'),
          $('div').class('prompt'),
        )),
        $('footer').append(
          $('article'),
        ),
        $('footer').append(
          $('span').class('ws'),
          $('span').class('aliconnector'),
          $('span').class('http'),
          $('span').class('is_checked'),
          $('span').class('clipboard'),
          $('span').class('pos'),
          $('span').class('source'),
          $('span').class('target'),
          $('span').class('main aco'),
          $('progress'),
        ),
      ).on('scroll', e => sessionStorage.setItem('scrollY', window.scrollY));
      [
        // ['/page/menu.md', 'button.menu'],
        // ['/page/top.md', '.pagemenu'],
        // ['/page/footer.md', 'body>footer>article'],
        ['/nav-left.md', 'button.menu'],
        ['/nav-top.md', '.pagemenu'],
        ['/footer.md', 'body>footer>article'],
      ].forEach(([filename, selector]) => {
        aim.fetch(filename, {}).then(res => res.status !== 200 ? null : res.text().then(body => {
          $(selector).html(aim.markdown().render(body));
        }));
      })
      aim.om = new Om();
      aim.om.treeview(aim.config.navleft);
      if (searchParams.get('search')) {
        search(searchParams.get('search'));
      } else if (!searchParams.get('id')) {
        const data = document.querySelector('data') ? JSON.parse(atob(document.querySelector('data').getAttribute('md'))) : {
          md: await fetch(document.location.pathname === '/' ? '/Home.md' : document.location.pathname+'.md').then(res => {
            // console.log(res)
            return res.text()
          }),
        };
        let body = data.md;
        // console.log(data, body)
        $('.pv').text('')
        // .attr('contenteditable','')
        .html(aim.markdown().render(body));
        $('aside.right').index('.pv');
        window.scroll(0,sessionStorage.getItem('scrollY'));
      }
    },
    page404(){
      console.log(404);
    },
  };
  aim.orderChangeCell = function(col, row, isInput){
    if (isInput) {
      return $('input').text(col.title || col.name).on('change', e=>{
        aim.api('/abis/data').input({
          request_type: 'order',
          id: row.id,
          name: col.name,
          value: e.target.value,
        }).post().then(async res => {
          console.log(await res.text());
        });
      })
    }
    return $('button').text(col.title || col.name).on('click', e=>{
      aim.api('/abis/data').input({
        request_type: 'order',
        id: row.id,
        name: col.name,
        value: new Date.toISOString(),
      }).post().then(async res => {
        console.log(await res.text());
      });
    })
  };
  function toLink(s){
    return s.replace(/\(|\)|\[|\]|,|\.|\=|\{|\}/g,'').replace(/ /g,'-').toLowerCase();
  }
  function nameToTitle(key){
    return isNaN(key) ? key.replace(/^\w/, s => s.toUpperCase()).replace(/-|_/g, ' ').replace(/([a-z])([A-Z])/g, (s,p1,p2) => `${p1} ${p2.toLowerCase()}`) : String(Number(key)+1)
  }
  function listShow(body) {
    // console.log(222, body.rows);
    $('.lv').text('');
    if (body.rows && body.rows.length) {
      const rows = body.rows;
      const context = new URL(body['@context']);
      const requestType = context.searchParams.get('request_type');
      const schema = config.components.schemas[requestType];
      const docUrl = new URL(document.location);
      const listUrl = new URL(aim.idToUrl(docUrl.searchParams.get('l')), document.location);
      const $select = listUrl.searchParams.get('$select') || '';
      const select = $select ? $select.split(',') : Object.keys(rows[0]);
      // console.log(select);
      const cols = select.map(name => Object.assign({name: name}, schema && schema.properties && schema.properties[name] ? schema.properties[name] : {title: name}));

      aim.om.listview(rows);
    }
  }
  function listview(rows, type, filter){
    // console.log(rows);
    // cols = this.cols = cols || this.cols;
    // $('.pv').text('');
    rows = aim.listRows = this.rows = rows || this.rows;
    rows = rows.map(row => row.data ? Object.assign(row,JSON.parse(row.data)) : row);
    filter = {}
    // console.log(rows);
    const types = {
      cols: () => {
        return $('div').class('cards',type).append(
          rowsVisible.map(row => {
            const div = $('div').on('click', e => {
              if (row.id) {
                console.log('click', row)
                const url = new URL(document.location);
                const ref = row['@id'];//`${row.schemaName}(${row.id})`;
                console.log(ref);

                document.location.hash = `#?id=${btoa(ref)}`;
                // url.searchParams.set('id', btoa(ref));
                // window.history.pushState('page', '',  url.href);
                // page(ref);
              }
            });

            // .attr(row||{})
            return div.append(
              row.images ? $('img').src(row.images[0]) : null,
              [1,2,3].map(i => $('div').append(
                config.components.schemas[row.schemaName].cols
                .filter(col => col.header === i)
                .map(col => aim.cols && aim.cols[col.name] ? aim.cols[col.name](row, div) : valueTag(col,row).class(col.name))
              )),
              // {
              //   if (col.type) {
              //     return $('input').type(col.type).min(0).class(col.name).value(row[col.name] || '')
              //   }
              //   if (row[col.name]) {
              //     return $('div').append(labelTag(col,row),valueTag(col,row))
              //   }
              // }),
            );
          }),
          ['','','','','','','','','','','','','','',].map(i => $('span').class('ghost')),
        )
      },
      rows: () => {
        return $('div').class('cards',type).append(
          rowsVisible.map(row => $('div').append(
            $('div').text(cols.filter(col => col.header === 1 && row[col.name]).map(col => row[col.name]).join(' ')),
            $('div').text(cols.filter(col => col.header === 2 && row[col.name]).map(col => row[col.name]).join(' ')),
            $('div').text(cols.filter(col => col.header === 3 && row[col.name]).map(col => row[col.name]).join(' ')),
          ))
        )
      },
      table: () => {
        return $('table').class('products').append(
          $('thead').append(
            $('tr').append(
              cols.map(col => $('th').append(
                $('div').text(col.title || col.name).class(this.sortName === col.name ? 'sort' : '', this.sortDir ? 'asc' : '').on('click', e => {
                  this.sortDir = this.sortName === col.name ? this.sortDir ^ 1 : 0;
                  const sortFactor = 1-2*this.sortDir;
                  // console.log(this.sortName, col.name, sortFactor, this.sortDir);
                  this.sortName = col.name;
                  rowsVisible.sort((a,b) => sortFactor * String(a[col.name]).localeCompare(String(b[col.name]), undefined, {numeric: true}));
                  aim.om.listview(rows, type, filter, rowsVisible);
                })
              ))
            )
          ),
          $('tbody').append(
            rowsVisible.map(row => $('tr').append(
              cols.map(col => $('td').class(col.name).style(isNaN(row[col.name]) ? '' : 'text-align:right;').append(valueTag(col,row))),
            ))
          )
        )
      },
    };
    rows.forEach(row => {
      const cols = config.components.schemas[row.schemaName].cols.filter(col => col.filter);
      cols.forEach(col => {
        if (col.name in row) {
          const value = row[col.name];
          const filtercol = filter[col.name] = filter[col.name] || { name: col.name, title: col.title || col.name.replace(/^\w/, s => s.toUpperCase()), values: {} };
          const valuerow = filtercol.values[value] = filtercol.values[value] || { value: value, rows: []};
          valuerow.rows.push(row);
        }
      })
    })
    let rowsVisible = rows || [];
    if (rows.some(row => row.geolocatie)) {
      types.map = () => {
        const mapelem = $('div').class('googlemap').css('width:100%;height:100%;');
        aim.maps().then(maps => {
          console.log(config);
          const mapOptions = {
            zoom: 10,
            center: { lat: 51, lng: 6 },//new maps.LatLng(51,6),
            mapTypeId: maps.MapTypeId.ROADMAP,
            // mapId: 'cb830478947dbf25',
            // styles: [
            //   {
            //     "featureType": "all",
            //     "stylers": [
            //       { "color": "#C0C0C0" }
            //     ]
            //   },
            //   {
            //     "featureType": "road.arterial",
            //     "elementType": "geometry",
            //     "stylers": [
            //       { "color": "#CCFFFF" }
            //     ]
            //   },
            //   {
            //     "featureType": "landscape",
            //     "elementType": "labels",
            //     "stylers": [
            //       { "visibility": "off" }
            //     ]
            //   }
            // ],
            // https://mapstyle.withgoogle.com/
            // styles: [
            //   {
            //     "featureType": "poi",
            //     "stylers": [
            //       {
            //         "visibility": "off"
            //       }
            //     ]
            //   }
            // ],
            styles: config.maps.styles,
          };
          console.log(mapOptions.styles);
          const map = new maps.Map(mapelem.elem, mapOptions);
          var bounds = new maps.LatLngBounds();
          // const dataItems = rowsVisible.filter(row => row.geolocatie);
          // if (dataItems.length) {
          //   dataItems.forEach(item => item.value = Object.values(item.data.data).reduce((a,b) => a+b));
          //   const maxValue = dataItems.map(item => item.value).reduce((a,b) => Math.max(a,b));
          //   console.log(maxValue);
          //   dataItems.forEach(item => item.scale = 1 + 2 / maxValue * item.value);
          // }
          // this.itemsVisible.filter(item => item.data.colorid && item.schema.colorid).forEach(item => item.color = item.schema.colorid[item.data.colorid] || item.schema.colorid.default);
          rowsVisible.filter(row => row.geolocatie).forEach(row => {
            const loc = row.geolocatie.split(',');
            const marker = new maps.Marker({
              position: {
                lat: Number(loc[0]),
                lng: Number(loc[1]),
              },
              map: map,
              // item: item,
              zIndex: Number(1),
              title: [row.header0,row.header1,row.header2].join('\n'),
              // icon: getCircle((row.state && row.state.value && row.fields.state.options && row.fields.state.options[row.fields.state.value]) ? row.fields.state.options[row.fields.state.value].color : 'red')
              icon: {
                //url: document.location.protocol+'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                //// This marker is 20 pixels wide by 32 pixels high.
                //size: new google.maps.Size(20, 32),
                //// The origin for this image is (0, 0).
                //origin: new google.maps.Point(0, 0),
                //// The anchor for this image is the base of the flagpole at (0, 32).
                //anchor: new google.maps.Point(0, 32)
                path: maps.SymbolPath.CIRCLE,
                fillColor: 'red',
                fillOpacity: .6,
                fillOpacity: 1,
                scale: 10, //Math.pow(2, magnitude) / 2,
                strokeColor: 'white',
                strokeWeight: .5
              },
              icon: {
                // path: "M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z",
                // path: "M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z",
                // path: "M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z",
                // path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
                scale: (row.scale || 100)/200,
                fillColor: [
                  'black',
                  'green',
                  'green',
                  'green',
                  'yellow',
                  'yellow',
                  'yellow',
                  'orange',
                  'orange',
                  'orange',
                  'red',
                  'red',
                  'red',
                ][row.color],
                fillOpacity: 0.6,
                strokeWeight: 1,
                // strokeColor: 'white',
                strokeColor: 'black',
                rotation: 0,
                anchor: new maps.Point(15, 30),
              },
              //icon: (row.state) ? 'icon/' + row.state.value + '.png' : null,
            });
            // console.log(marker);
            marker.addListener('click', e => $('view').show(item));
            bounds.extend(marker.getPosition());
          });
          // if (bounds) {
          map.fitBounds(bounds);
          // //console.log(google.maps);
          if (maps.e) {
            maps.e.addListenerOnce(map, 'bounds_changed', function () {
              this.setZoom(Math.min(15, this.getZoom()));
            });
          }
        });
        return mapelem;
      }
    }
    filter = Object.values(filter);
    filter.forEach(attribute => attribute.values = Object.values(attribute.values).sort((a,b) => String(a.value||'').localeCompare(String(b.value||''), undefined, {numeric: true})));
    filter = filter.filter(attribute => attribute.values.length>1 && attribute.values.some(value => value.rows.length>1))

    sessionStorage.setItem('listType', type = this.type = type || this.type || sessionStorage.getItem('listType') || 'cols');
    function valueTag(col,row){
      if (col.schema) {
        return $('a').text(row[col.name]).href(`#${col.schema}(${row[col.name]})`)
      }
      if (col.cell) {
        if (typeof col.cell !== 'function') {
          col.cell = new Function('col', 'row', col.cell);
        }
        return col.cell(col,row);
      }
      return $('span').text(row[col.name])
      // let inpElem;
      // const elem = $('td').class(col.name).align(isNaN(row[col.name]) ? 'left' : 'right').append(
      //   (function(){
      //     function span(){
      //       return $('span').text(col.name in row ? row[col.name] : '')
      //     }
      //     return span();//col.cell ? col.cell(row) : span();
      //   })()
      // ).on('click', e => {
      //   if (!col.readOnly) {
      //     // e.preventDefault();
      //     // e.stopPropagation();
      //     if (!elem.querySelector('input')) {
      //       $('input').parent(elem).value(row[col.name] || '')
      //       .on('change', e => {
      //         console.log(row);
      //         const value = row[col.name] = elem.querySelector('span').innerText = elem.querySelector('input').value;
      //         fetch('https://aliconnect.nl/abis/data', {
      //           method: 'POST',
      //           body: JSON.stringify({
      //             request_type: requestType,
      //             id: row.id,
      //             name: col.name,
      //             value: value,
      //           }),
      //         }).then(async res => {
      //           console.log(await res.text());
      //         });
      //       })
      //       .on('blur', e => {
      //         elem.querySelector('input').remove();
      //       }).select();
      //     }
      //   }
      // });
      // return elem;
    }
    function labelTag(col,row){
      return $('label').text(col.title || col.name)
    }

    (function buildlist() {
      const checkedFilters = filter.filter(col => col.checked);
      // console.log(filter,checkedFilters);
      $('.lv').attr('hidefilter', aim.showfilter).text('').append(
        $('nav').append(
          $('button').class('abtn filter').on('click', e => $('.lv').attr('hidefilter', aim.showfilter ^= 1)),
          $('button').class('abtn view').append(
            $('div').append(
              Object.keys(types).map(key => $('button').text(key).on('click', e => buildlist(type = key)))
            ),
          ),
        ),
        $('div').append(
          $('aside').class('oa filter').append(
            filter.filter(col => col.checked).map(col => $('div').append(
              $('span').text(col.title + ': '),
              $('b').text(col.values.filter(val => val.checked).map(val => val.value).join(', ')),
            )),
            filter
            .filter(col => col.checked || col.values.some(val => val.rows.some(row => rowsVisible.includes(row))))
            .map(col => {
              const colRowsVisible = rows.filter(row => !filter.some(c => c !== col && c.checked && c.values.some(val => !val.checked && val.rows.find(r => r === row))))
              // console.log(col.name, colRowsVisible)
              const values = col.values;//.filter(val => val.rows.some(row => rowsVisible.includes(row)));
              if(values.some(val => val.checked) || values.length>1) {
                return $('div')
                // .open(values.some(val => val.checked))
                .open(1)
                .attr('more', col.more)
                .append(
                  $('legend').text(col.title),
                  // $('div').class('more').text('more'),
                  values
                  .filter(val => val.value !== null)
                  .filter(val => val.rows.filter(row => colRowsVisible.includes(row)).length).map(
                    (val,i) => [
                      i == 5 ? $('div').class('more').on('click', e => e.target.parentElement.setAttribute('more', col.more ^= 1)) : null,
                      $('div').text(val.value)
                      .checked(val.checked)
                      .attr('cnt', val.rows.filter(row => colRowsVisible.includes(row)).length)
                      .on('click', e => {
                        val.checked ^= 1;
                        col.checked = col.values.some(val => val.checked);
                        rowsVisible = rows.filter(
                          row => !filter.some(col => col.checked && (!(col.name in row) || col.values.filter(val => !val.checked).some( val => val.rows.includes(row) )) )
                        );
                        buildlist();
                      })
                    ]
                  )
                );
              }
            })
          ),
          $('div').class('oa', type).append(
            types[type] ? types[type]() : types.cols(),
          ),
        ),
      )
    })()
  }
  function search(search){
    // console.log('SEARCH', search)
    aim.api('/abis/data').query({request_type: 'article',$search: search}).get().then(response => response.json().then(data => {
      // console.log(1,data);
      data.rows.forEach(row => {
        if (aim.clientproduct) Object.assign(row, aim.clientproduct.find(p => p.artId === row.artId));
        const title = [
          row.brand,
          row.artSupplier,
          row.partTitle || row.artTitle,
          (row.partContent || '') + (row.partContentUnit || ''),
          // row.partContentUnit,
          row.packUnit,
          row.packQuantity ? row.packQuantity + 'st': null,
          row.partCode || row.artOrderCode,
        ].filter(Boolean).join(', ');
        Object.assign(row, {
          catalogPrice: row.packListPrice || row.artListPrice,
          title: title,
          afmeting: (( title.match(/((([\d|\.|,]+?)\s*?(mm|cm|m)\s*?x\s*|)?(([\d|\.|,]+?)\s*?(mm|cm|m)\s*?x\s*|)?([\d|\.|,]+?)\s*?(mm|cm|m))/) || [] )[1] || '').replace(/\s/g,'').toLowerCase(),
          gaten: (( title.match(/(\d+)\s*?(?=gaten|gaat)/i) || [] )[1] || ''),
          korrel: (( title.match(/\b(P\d+)\b/i) || [] )[1] || ''),
        });
      });

      return listview(data.rows);
      // return;
      // sessionStorage.setItem('lv-data', JSON.stringify(data));
      const cols = [
        { name: 'productTitle', title: 'Titel'},
        { name: 'supplier', title: 'Leverancier', filter: true},
        { name: 'brand', title: 'brand', filter: true},
        // { name: 'productGroup', title: 'productGroup'},
        // { name: 'description', title: 'description'},
        { name: 'ordercode', title: 'ordercode'},
        { name: 'salesPrice', title: 'salesPrice'},
        { name: 'catalogPrice', title: 'catalogPrice'},
        { name: 'orderQuantity', title: 'Bestellen', cell: () => $('input').type('number').on('click', e => e.stopPropagation() )},
      ];
      const args = [
        {name: 'Korrel', regexp: /P\d+/ },
        // {name: 'diameter', values: [ '150mm', '50mm' ] },
        // {name: 'type', values: [ 'abralon' ] },
        // {name: 'verpakking', values: [ 'tube' ] },
        // {name: 'Afmeting', regexp: /(\d+\s*?x\s*?\d+\s*?x\s*?\d+|\d+\s*?x\s*?\d+|\d+)(mm|cm|m|mtr)/ },
        {name: 'Afmeting', regexp: /(\d+(mm|cm|m|mtr)?\s*?x\s*?\d+\s*?x\s*?\d+|\d+\s*?x\s*?\d+|\d+)(mm|cm|m|mtr)/ },
      ];
      var match;
      data.rows.forEach(row => {
        if (row.description) {

          for (let arg of args) {
            if (match = row.productTitle.match(arg.regexp)) {
              // console.log(match);
              arg.col = arg.col || cols.push({
                name: arg.name, filter: true,
              })
              row[arg.name] = match[0];
              // row.productTitle = row.productTitle.replace(arg.regexp, '');
            }
            // for (let value of arg.values) {
            //   const regexp = new RegExp(`${value}`);
            //   if (row.description.match(regexp)) {
            //     row.description = row.description.replace(regexp, '');
            //     arg.col = arg.col || cols.push({
            //       name: arg.name, filter: true,
            //     })
            //     row[arg.name] = value;
            //   }
            // }
          }
          // if (match = row.description.match(/\d+x\d+mm/)) {
          //   console.log(match);
          //   args.afm = args.afm || cols.push({
          //     name: 'Afmeting', filter: true,
          //   })
          //   row.Afmeting = match[0];
          //   row.description = row.description.replace(match[0], '');
          // }

        }
      });
      // $('.pv').text('');
      $('aside.right').text('');
      $('aside.left').text('');
      listview(data.rows);
    }))
  }
  function page(ref){
    inputId = 0;
    aim.isEdit = true;
    // const [s,schemaName,id] = ref.match(/(\w+)\((\d+)\)/);
    // console.log(schemaName,id);
    const hostname = new URL(ref).hostname;
    const client = aim.clients.get(hostname);
    client.api(ref).get().then(body => {
      console.log(ref,body.schemaName,body);
      const schema = config.components.schemas[body.schemaName];
      const app = schema.app || {};
      const data = {};
      const cfg = {};
      var legend = body.schemaName;
      if (!schema) console.log(body);
      Object.entries(schema.properties).forEach(([name, metaData]) => {
        metaData = metaData || {};
        legend = metaData.legend = metaData.legend || legend;
        metaData['@id'] = body['@id'];
        // console.log(legend,name)
        cfg[legend] = cfg[legend] || {};
        cfg[legend][name] = {metaData};
        data[legend] = data[legend] || {};
        data[legend][name] = body[name];
      });
      // console.log(111, data, body, cfg);
      // return;
      $('.pv').text('').append(
        $('nav').append(
          app.nav ? app.nav(body) : null,
          // $('button').text('select').on('click', e => {
          //   sessionStorage.setItem('clientId', body.id);
          //   document.location.href = '/';
          // })
        ),
        $('form').class('oa').buildForm(data, cfg),
        // (
        //
        // $('div').append(
        //   Object.entries(schema.properties)
        //   .filter(([name, property]) => aim.readOnly === false || data[name])
        //   .map(([name, property]) => $('div').class('attr').append(
        //     $('label').text(property.title || name),
        //     $(aim.readOnly === false ? 'input' : 'span').text(data[name]).value(data[name] || ''),
        //   ))
        // )
      )
      // console.log(1, data);
      // return;
      // // sessionStorage.setItem('lv-data', JSON.stringify(data));
      // const cols = [
      //   { name: 'productTitle', title: 'Titel'},
      //   { name: 'supplier', title: 'Leverancier', filter: true},
      //   { name: 'brand', title: 'brand', filter: true},
      //   // { name: 'productGroup', title: 'productGroup'},
      //   // { name: 'description', title: 'description'},
      //   { name: 'ordercode', title: 'ordercode'},
      //   { name: 'salesPrice', title: 'salesPrice'},
      //   { name: 'catalogPrice', title: 'catalogPrice'},
      //   { name: 'orderQuantity', title: 'Bestellen', type: 'number'},
      // ];
      // const args = [
      //   {name: 'Korrel', regexp: /P\d+/ },
      //   // {name: 'diameter', values: [ '150mm', '50mm' ] },
      //   // {name: 'type', values: [ 'abralon' ] },
      //   // {name: 'verpakking', values: [ 'tube' ] },
      //   // {name: 'Afmeting', regexp: /(\d+\s*?x\s*?\d+\s*?x\s*?\d+|\d+\s*?x\s*?\d+|\d+)(mm|cm|m|mtr)/ },
      //   {name: 'Afmeting', regexp: /(\d+(mm|cm|m|mtr)?\s*?x\s*?\d+\s*?x\s*?\d+|\d+\s*?x\s*?\d+|\d+)(mm|cm|m|mtr)/ },
      // ];
      // var match;
      // data.rows.forEach(row => {
      //   if (row.description) {
      //
      //     for (let arg of args) {
      //       if (match = row.productTitle.match(arg.regexp)) {
      //         // console.log(match);
      //         arg.col = arg.col || cols.push({
      //           name: arg.name, filter: true,
      //         })
      //         row[arg.name] = match[0];
      //         // row.productTitle = row.productTitle.replace(arg.regexp, '');
      //       }
      //       // for (let value of arg.values) {
      //       //   const regexp = new RegExp(`${value}`);
      //       //   if (row.description.match(regexp)) {
      //       //     row.description = row.description.replace(regexp, '');
      //       //     arg.col = arg.col || cols.push({
      //       //       name: arg.name, filter: true,
      //       //     })
      //       //     row[arg.name] = value;
      //       //   }
      //       // }
      //     }
      //     // if (match = row.description.match(/\d+x\d+mm/)) {
      //     //   console.log(match);
      //     //   args.afm = args.afm || cols.push({
      //     //     name: 'Afmeting', filter: true,
      //     //   })
      //     //   row.Afmeting = match[0];
      //     //   row.description = row.description.replace(match[0], '');
      //     // }
      //
      //   }
      // });
      // $('.pv').text('');
      // listview(cols, data.rows);
    });
  }
  function buildForm(data, config){
    console.log('buildForm',data,config)
    // const metaData = cfg.metaData || { title: isNaN(key) ? key : Number(key)+1 };
    // var dataObj = data;
    const types = {
      boolean: 'checkbox',
      number: 'number',
      string: 'text',
      object: 'object',
    };
    (function buildForm(parent, obj, config, path = []) {
      if (obj) {
        Object.entries(obj).forEach(([key,value]) => {
          if (!config[key]) {
            if (value && typeof value === 'object') {
              // console.log(value);
              config[key] = Object.fromEntries(
                Object.entries(value).map(([key,value]) => {
                  return [key, typeof value === 'object' ? {} : ''];
                })
              )
            } else {
              config[key] = {metaData:{type:typeof value}};
            }
          }
        });
      }
      const configEntries = Object.entries(config);
      const properties = configEntries.filter(
        ([key,property]) => property.metaData &&
        Object.keys(property).length === 1 &&
        (property.metaData.type = property.metaData.type || types[property.value ? typeof property.value : 'string']) &&
        ['text','number','string','boolean'].includes(property.metaData.type || 'text')
      )
      const children = configEntries.filter(entry => entry[0] !== 'metaData' && !properties.includes(entry));

      // console.log(111, properties);
      properties
      .filter(([key,property]) => aim.isEdit || obj[key])
      .forEach(([key,property]) => {
        const metaData = config && config[key] && config[key].metaData ? config[key].metaData : {};
        parent.append(
          $('div').class('attr').append(
            $('label').class('title').text(metaData.title || nameToTitle(key)),
            aim.isEdit
            ? $('input').id('input'+inputId)
            .name(key)
            .value(obj[key])
            .type(metaData.type || types[typeof property.value])
            // .autofocus(name === activeField ? '' : null)
            // .required(metaData.required || dataObj === null ? '' : null)
            // .placeholder(placeholder)
            // .pattern(metaData.pattern)
            .on('change', e => {
              let obj = data;


              path.forEach(key => obj = obj[key] = obj[key] || {});

              console.log(metaData);

              obj[key] = e.target.value;
              if (metaData['@id']) {
                const ref = metaData['@id'];
                const hostname = new URL(ref).hostname;
                const client = aim.clients.get(hostname);
                client.api(ref).post({
                  name: key,
                  value: e.target.value,
                }).then(body => {
                  console.log(3333, body);
                })

              }
            })
            // $('label').class('caption').for('input'+inputId),
            // $('label').class('ico').for('input'+inputId),
            : $('span').text(obj[key]),
          )
        )
      })
      children.forEach(([key,value]) => {
        const metaData = value.metaData = value.metaData || {
          title: nameToTitle(key)
        }
        // console.log(key, localStorage.getItem(key+'Open'));
        buildForm(
          $('details')
          .parent(parent)
          .open(localStorage.getItem(key+'Open'))
          .on('toggle', e => localStorage.setItem(key+'Open', e.target.open ? 1 : ''))
          .append(
            $('summary').text(metaData.title)
          ),
          obj[key] || {},
          value || {},
          path.concat(key),
        );
      });
    })(this, data, config);
    return this;
  };

  var inputId;

  Paint = function (canvas, options) {
    setTimeout(()=>{
      var self = this;
      var opts = options || {};
      this._handleMouseDown = function(e) {
        if (e.which === 1) {
          self._mouseButtonDown = true;
          self._strokeBegin(e);
        }
      };
      this._handleMouseMove = function(e) {
        if (self._mouseButtonDown) {
          self._strokeUpdate(e);
        }
      };
      this._handleMouseUp = function(e) {
        if (e.which === 1 && self._mouseButtonDown) {
          self._mouseButtonDown = false;
          self._strokeEnd(e);
        }
      };
      this._handleTouchStart = function(e) {
        if (e.targetTouches.length == 1) {
          var touch = e.changedTouches[0];
          self._strokeBegin(touch);
        }
      };
      this._handleTouchMove = function(e) {
        // Prevent scrolling.
        e.preventDefault();
        var touch = e.targetTouches[0];
        self._strokeUpdate(touch);
      };
      this._handleTouchEnd = function(e) {
        var wasCanvasTouched = e.target === self._canvas;
        if (wasCanvasTouched) {
          e.preventDefault();
          self._strokeEnd(e);
        }
      };
      this._canvas = canvas;
      this._ctx = canvas.context = canvas.getContext("2d");
      // console.log(canvas);
      // canvas.width = canvas.clientWidth;
      // canvas.height = canvas.clientHeight;
      // console.log(canvas.clientWidth,canvas.offsetWidth,canvas.width,canvas.height)
      // canvas.width = 640;
      // canvas.height = 480;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // console.log('CANVAS', canvas.getBoundingClientRect(), canvas.height, canvas.width, canvas.clientWidth, canvas.clientHeight, canvas.offsetHeight)
      this.velocityFilterWeight = opts.velocityFilterWeight || 0.7;
      this.minWidth = opts.minWidth || 0.5;
      this.maxWidth = opts.maxWidth || 2.5;
      this.dotSize = opts.dotSize || function() {
        return (this.minWidth + this.maxWidth) / 2;
      };
      this.penColor = opts.penColor || "black";
      this.backgroundColor = opts.backgroundColor || "rgba(0, 0, 0, 0)";
      this.onEnd = opts.onEnd;
      this.onBegin = opts.onBegin;
      // this.clear();
      // we need add these inline so they are available to unbind while still having
      //  access to 'self' we could use _.bind but it's not worth adding a dependency
      // setTimeout(()=>{
        this._handleMouseEvents();
        this._handleTouchEvents();
        // })

    })
  };
  Paint.prototype = {
    clear : function() {
      var ctx = this._ctx,
      canvas = this._canvas;
      ctx.fillStyle = this.backgroundColor;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      this._reset();
    },
    toDataURL : function(imageType, quality) {
      var canvas = this._canvas;
      return canvas.toDataURL.apply(canvas, arguments);
    },
    fromDataURL : function(dataUrl) {
      var self = this,
      image = new Image(),
      ratio = window.devicePixelRatio || 1,
      width = this._canvas.width / ratio,
      height = this._canvas.height / ratio;
      this._reset();
      image.src = dataUrl;
      image.onload = function() {
        self._ctx.drawImage(image, 0, 0, width, height);
      };
      this._isEmpty = false;
    },
    _strokeUpdate : function(e) {
      var point = this._createPoint(e);
      this._addPoint(point);
    },
    _strokeBegin : function(e) {
      this._reset();
      this._strokeUpdate(e);
      if (typeof this.onBegin === 'function') {
        this.onBegin(e);
      }
    },
    _strokeDraw : function(point) {
      var ctx = this._ctx,
      dotSize = typeof (this.dotSize) === 'function' ? this.dotSize() : this.dotSize;
      ctx.beginPath();
      this._drawPoint(point.x, point.y, dotSize);
      ctx.closePath();
      ctx.fill();
    },
    _strokeEnd : function(e) {
      var canDrawCurve = this.points.length > 2,
      point = this.points[0];
      if (!canDrawCurve && point) {
        this._strokeDraw(point);
      }
      if (typeof this.onEnd === 'function') {
        this.onEnd(e);
      }
    },
    _handleMouseEvents : function() {
      this._mouseButtonDown = false;
      this._canvas.addEventListener("mousedown", this._handleMouseDown);
      this._canvas.addEventListener("mousemove", this._handleMouseMove);
      document.addEventListener("mouseup", this._handleMouseUp);
    },
    _handleTouchEvents : function() {
      // Pass touch events to canvas elem on mobile IE.
      this._canvas.style.msTouchAction = 'none';
      this._canvas.addEventListener("touchstart", this._handleTouchStart);
      this._canvas.addEventListener("touchmove", this._handleTouchMove);
      document.addEventListener("touchend", this._handleTouchEnd);
    },
    on : function() {
      this._handleMouseEvents();
      this._handleTouchEvents();
    },
    off : function() {
      this._canvas.removeEventListener("mousedown", this._handleMouseDown);
      this._canvas.removeEventListener("mousemove", this._handleMouseMove);
      document.removeEventListener("mouseup", this._handleMouseUp);
      this._canvas.removeEventListener("touchstart", this._handleTouchStart);
      this._canvas.removeEventListener("touchmove", this._handleTouchMove);
      document.removeEventListener("touchend", this._handleTouchEnd);
    },
    isEmpty : function() {
      return this._isEmpty;
    },
    _reset : function() {
      this.points = [];
      this._lastVelocity = 0;
      this._lastWidth = (this.minWidth + this.maxWidth) / 2;
      this._isEmpty = true;
      this._ctx.fillStyle = this.penColor;
    },
    _createPoint : function(e) {
      var rect = this._canvas.getBoundingClientRect();
      return new Point(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    },
    _addPoint : function(point) {
      var points = this.points,
      c2, c3,
      curve, tmp;
      points.push(point);
      if (points.length > 2) {
        // To reduce the initial lag make it work with 3 points
        // by copying the first point to the beginning.
        if (points.length === 3) points.unshift(points[0]);
        tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
        c2 = tmp.c2;
        tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
        c3 = tmp.c1;
        curve = new Bezier(points[1], c2, c3, points[2]);
        this._addCurve(curve);
        // Remove the first elem from the list,
        // so that we always have no more than 4 points in points array.
        points.shift();
      }
    },
    _calculateCurveControlPoints : function(s1, s2, s3) {
      var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
      dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,
      m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 },
      m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 },
      l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
      l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2),
      dxm = (m1.x - m2.x),
      dym = (m1.y - m2.y),
      k = l2 / (l1 + l2),
      cm = { x: m2.x + dxm * k, y: m2.y + dym * k },
      tx = s2.x - cm.x,
      ty = s2.y - cm.y;
      return {
        c1: new Point(m1.x + tx, m1.y + ty),
        c2: new Point(m2.x + tx, m2.y + ty)
      };
    },
    _addCurve : function(curve) {
      var startPoint = curve.startPoint,
      endPoint = curve.endPoint,
      velocity, newWidth;
      velocity = endPoint.velocityFrom(startPoint);
      velocity = this.velocityFilterWeight * velocity
      + (1 - this.velocityFilterWeight) * this._lastVelocity;
      newWidth = this._strokeWidth(velocity);
      this._drawCurve(curve, this._lastWidth, newWidth);
      this._lastVelocity = velocity;
      this._lastWidth = newWidth;
    },
    _drawPoint : function(x, y, size) {
      var ctx = this._ctx;
      ctx.moveTo(x, y);
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      this._isEmpty = false;
    },
    _drawCurve : function(curve, startWidth, endWidth) {
      var ctx = this._ctx,
      widthDelta = endWidth - startWidth,
      drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;
      drawSteps = Math.floor(curve.length());
      ctx.beginPath();
      for (i = 0; i < drawSteps; i++) {
        // Calculate the Bezier (x, y) coordinate for this step.
        t = i / drawSteps;
        tt = t * t;
        ttt = tt * t;
        u = 1 - t;
        uu = u * u;
        uuu = uu * u;
        x = uuu * curve.startPoint.x;
        x += 3 * uu * t * curve.control1.x;
        x += 3 * u * tt * curve.control2.x;
        x += ttt * curve.endPoint.x;
        y = uuu * curve.startPoint.y;
        y += 3 * uu * t * curve.control1.y;
        y += 3 * u * tt * curve.control2.y;
        y += ttt * curve.endPoint.y;
        width = startWidth + ttt * widthDelta;
        this._drawPoint(x, y, width);
      }
      ctx.closePath();
      ctx.fill();
    },
    _strokeWidth : function(velocity) {
      return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
    },
  };
  function Point(x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || new Date().getTime();
  };
  Point.prototype = {
    velocityFrom : function(start) {
      return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
    },
    distanceTo : function(start) {
      return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    },
  };
  function Bezier(startPoint, control1, control2, endPoint) {
    this.startPoint = startPoint;
    this.control1 = control1;
    this.control2 = control2;
    this.endPoint = endPoint;
  };
  Bezier.prototype = {
    length : function() {
      var steps = 10,
      length = 0,
      i, t, cx, cy, px, py, xdiff, ydiff;
      for (i = 0; i <= steps; i++) {
        t = i / steps;
        cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
        cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
        if (i > 0) {
          xdiff = cx - px;
          ydiff = cy - py;
          length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
        }
        px = cx;
        py = cy;
      }
      return length;
    },
    _point : function(t, start, c1, c2, end) {
      return start * (1.0 - t) * (1.0 - t) * (1.0 - t)
      + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t
      + 3.0 * c2 * (1.0 - t) * t * t
      + end * t * t * t;
    },
  };

  function prop(row,col,edit){
    this.append(
      $('label').text(col.name),
      $('input').value(row[col.name]),
    )
    return this;
  }

  function Elem (selector) {
    const args = Array.from(arguments);
    selector = args.shift();
    // selector = element ? element : (aim.Elem && aim.Elem.tagnames.includes(selector) ? document.createElement(selector) : selector);
    if (selector instanceof Element) {
      this.elem = selector;
    } else if (tagnames.includes(selector)) {
      this.elem = document.createElement(selector);
    } else {
      this.elem = document.getElementById(selector) || document.querySelector(selector);
    }
    if (!this.elem) return selector;
    // if (!(this instanceof Elem)) return new Elem(...arguments);

    this.elem.selector = this.elem.is = this;
    this.map = new Map();
    if (args.length){
      if (typeof this[this.elem.id] === 'function'){
        // console.debug(elem.id);
        this[this.elem.id](...args);
      } else {
        args.forEach(arg => {
          if (arg instanceof Object){
            Object.assign(this.elem, arg);
          } else if (typeof arg === 'string'){
            if ('className' in this){
              this.innerHTML = this.elem.innerHTML = arg;
            } else if (this.className = arg){
              this.elem.className = arg;
            }
          }
        })
      }
    }
  };
  Elem.prototype = {
    prop,
    buildForm,
    append(){
			this.elem = this.elem || document.body;
      // const args = [].concat(...arguments);
      // console.log(arguments, args);
      Array.from(arguments).forEach(arg => {
        if (typeof arg === 'string') {
          this.elem.insertAdjacentHTML('beforeend', arg);
        } else if (Array.isArray(arg)) {
          arg.forEach(arg => this.append(arg));
        } else if (arg instanceof Elem) {
          this.elem.append(arg.elem);
        } else if (arg) {
          this.elem.append(arg);
        }
      });
			// args.forEach(a => a ? this.elem.append(typeof a === 'string' ? document.createTextNode(a) : a.elem || a) : null);
			return this;
		},
    acceptScope(scope, socket_id) {
      const properties = Object.fromEntries(scope.map(val => [val, {
        name: val,
        format: 'checkbox',
        checked: 1,
      }]));
      properties.expire_time = {format: 'number', value: 3600};
      const form = aim.promptform($().url(AUTHORIZATION_URL).query('socket_id', socket_id), this.elem, arguments.callee.name, {
        properties: properties,
        btns: {
          deny: { name: 'accept', value:'deny', type:'button' },
          allow: { name: 'accept', value:'allow', type:'submit', default: true },
        }
      })
    },
    get children(){
      return this.elem.children;
    },
    paint(options) {
      this.paint = new Paint(this.elem, options);
      return this;
    },
    cam() {
      const video = this.video = $('video').parent(this).autoplay().on('click', e => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }).elem;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          try {
            video.srcObject = stream;
          } catch (error) {
            video.src = window.URL.createObjectURL(stream);
          }
          video.play();
        });
      }
      return this;
    },
    index(docelem){
      docelem = $(docelem);
      const all = Array.from(docelem.elem.querySelectorAll('a.anchor')).filter(el => el.nextElementSibling);
      if (all[0]) {
        const topItem = docelem.topItem = all[0].parentElement;
        const elemTop = docelem.elemTop = docelem.elem.getBoundingClientRect().top;
        const findAll = docelem.findAll = all.slice().reverse();
        const allmenu = docelem.allmenu = [];
        let i = 0;
        var li;
        var path = [];
        function addChapters (ul, level) {
          for (let elem = all[i]; elem; elem = all[i]) {
            // console.log(elem);
            const tagLevel = Number(elem.nextElementSibling.tagName[1]);
            path.slice(0, tagLevel-1);
            // console.log(path);
            const title = elem.getAttribute('title');
            path[tagLevel-1] = title.toLowerCase().replace(/ /g,'_');
            const name = elem.getAttribute('name');//path.join('-');
            // console.log(i,title,name,tagLevel,level);
            if (tagLevel === level) {
              // $(elem).append(
              //   // $('a').attr('name', 'chapter' + i)
              //   $('a').attr('name', name)
              // );
              li = $('li').parent(ul).append(
                elem.a = $('a').text(title).href('#' + name).attr('open', '0').attr('target', '_self')
              );
              i++;
              allmenu.push(elem.a);
              // all.shift();
            } else if (li && tagLevel > level) {
              li.append(
                addChapters($('ul'), level+1)
              )
            } else {
              return ul;
            }
          }
          return ul;
        }
        let to;
        // all.reverse();
        var lastScrollTop = 0;
        addChapters($('ul').parent(this.text('')), 1);
        // console.error(docelem.elem);

        // (document.body.onscroll = e => {
        //   clearTimeout(to);
        //   // console.log(e);
        //   // if (!to) {
        //   // const div = Math.abs(lastScrollTop - docelem.elem.scrollTop);
        //   // clearTimeout(to);
        //   to = setTimeout(() => {
        //     // to = null;
        //     console.log(elemTop);
        //     // all.reverse().forEach(el => console.log(el.getBoundingClientRect().top));
        //     const elem = findAll.find(el => el.getBoundingClientRect().top < elemTop) || topItem;
        //     if (elem && elem.a) {
        //       //
        //       // return console.log('re', el);
        //       // // if (div > 50) {
        //       // lastScrollTop = document.body.scrollTop;
        //       // let elem = findAll.find(elem => elem.getBoundingClientRect().top < elemTop) || topItem;
        //       // console.log(findAll, elem);
        //       // let elem = all.find(elem => elem.offsetParent );
        //       // console.log(elem.innerText, elemTop, elem.getBoundingClientRect().top, elem.getBoundingClientRect().height, all.indexOf(elem));
        //       // return;
        //       // elem = all[all.indexOf(elem)-1];
        //       allmenu.forEach(a => a.attr('open', '0').attr('select', null));
        //       const path = [];
        //       for (var p = elem.a.elem; p.tagName === 'A' && p.parentElement && p.parentElement.parentElement; p=p.parentElement.parentElement.parentElement.firstChild) {
        //         p.setAttribute('select', '');
        //         p.setAttribute('open', '1');
        //         path.push(p);
        //       }
        //       $(elem.a.elem).scrollIntoView();
        //       // if ($('navDoc')) {
        //       //   $('navDoc').text('').append(...path.reverse().map(elem => ['/', $('a').text(elem.innerText)]))
        //       // }
        //       // elem.li.select();
        //       // $()
        //       // let elem = all.forEach(elem => //console.log(elem.getBoundingClientRect().top));
        //       // //console.log(elem, elem.li);
        //       // }
        //
        //     }
        //   }, 500);
        //   // }
        // })();
        // document.body.removeEventListener('scroll', docelem.onscroll);
        // document.body.addEventListener('scroll', docelem.onscroll);
        return this;
        // return $('ul').append(...[...this.elem.querySelectorAll("h1, h2, h3")].map(elem => $('li').text(elem.innerText)))
        this.addNextPreviousButtons()

      }
		},
    pageForm(config, data){
      let activeField;
      const properties = Object.entries(config.properties).map(([name,prop]) => Object({
        metaData: Object.assign({name: name}, prop),
      }));
      var formDefinitions = {};
      var chapterTitle = 'Top';
      properties.forEach(prop => {
        // console.log(chapterTitle,prop.metaData);
        chapterTitle = prop.metaData.chapter = prop.metaData.chapter || chapterTitle;
        const chapter = formDefinitions[chapterTitle] = formDefinitions[chapterTitle] || {
          metaData: {
            title: chapterTitle,
          },
        };
        chapter[prop.metaData.name] = prop;
      })

      console.log(formDefinitions);
      const formElem = $('form').class('page-form').autocomplete("off").parent(this.text('')).on('submit', e => false);
      var contentElem = formElem;
      // $('details').open(1).parent(formElem).append(
      //   $('summary').text('Config')
      // );
      let inputId=0;
      function build(key, cfg, path){
        const metaData = cfg.metaData || { title: isNaN(key) ? key : Number(key)+1 };
        var dataObj = data;
        for (let p of path.concat(key)) {
          if (!(p in dataObj)) {
            dataObj = ''; break;
            return;
          }
          dataObj = dataObj[p];
        }
        // console.log(path,key,cfg,dataObj);
        const types = {
          boolean: 'checkbox',
          number: 'number',
          string: 'text',
          object: 'object',
        }

        // var inputElem;') Object.keys(cfg).length === 1) {
        if (cfg.metaData && Object.keys(cfg).length === 1 && (cfg.metaData.type = cfg.metaData.type || types[dataObj ? typeof dataObj : 'string']) && ['text','number','string','boolean'].includes(cfg.metaData.type || 'text')) {
          // console.log(metaData.name, data[metaData.name]);
          const value = data[metaData.name];

          const name = path.concat(key).join('-');
          // console.log(name, typeof dataObj);
          var placeholder = metaData.placeholder || (metaData.required || dataObj === null ? metaData.title || key : ' ');
          if (typeof dataObj === 'string' && dataObj.match(/^  .*  $/)) {
            placeholder = dataObj.trim();
            dataObj = null;
          }
          if (metaData.format === 'cam') {
            let userMedia;
            const video = $('video').style('background:white;flex-base: 50px;').autoplay().elem;
            const pausePlayElem = $('button').type('button').class('pause').text('Pause/Play').on('click', e => video.paused ? video.play() : video.pause());
            function toggleCam() {
              const rect = video.getBoundingClientRect();
              video.width = rect.width;
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                if (video.srcObject) {
                  video.srcObject.getTracks().forEach(track => track.stop());
                  pausePlayElem.disabled(true);
                  video.srcObject = null;
                } else {
                  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                    try {
                      video.srcObject = stream;
                    } catch (error) {
                      video.src = window.URL.createObjectURL(stream);
                    }
                    video.play();
                    pausePlayElem.disabled(false);
                  });
                }
              }
            }
            contentElem.append(
              $('div').class('input').append(
                $('span').class('info').title(metaData.description),
                $('label').class('title').text(metaData.title || key),
                $('div').class('aco col').append(
                  $('div').class('row').append(
                    $('button').type('button').class('clear').text('Clear'),
                    $('button').type('button').class('on').text('On/Off').on('click', toggleCam),
                    pausePlayElem.disabled(true),
                    $('button').type('button').class('share').text('Share'),
                    $('button').type('button').class('save').text('Save'),
                    $('button').type('button').class('paint').text('Paint'),
                  ),
                  video,
                )
              ),
            );
          } else if (metaData.format === 'draw') {
            const canvasElem = $('canvas').style('background:white;height:150px;').paint();
            contentElem.append(
              $('div').class('input').append(
                $('span').class('info').title(metaData.description),
                $('label').class('title').text(metaData.title || key),
                $('div').class('aco col').append(
                  $('div').class('row').append(
                    $('button').type('button').class('clear').text('Clear').on('click', e => canvasElem.paint.clear()),
                  ),
                  canvasElem,
                  // $('canvas').class('aco').style('background:white;height:150px;').paint(),
                )
              ),
            );
          } else {
            contentElem.append(
              $('div').class('input').append(
                $('span').class('info').title(metaData.description),
                $('label').class('title').text(metaData.title || key),
                $('input').id('input'+inputId).class('aco')
                .name(name)
                .value(value === null ? metaData.defaultValue || '' : value)
                .type(types[typeof dataObj])
                // .autofocus(name === activeField ? '' : null)
                .required(metaData.required || dataObj === null ? '' : null)
                .placeholder(placeholder)
                .pattern(metaData.pattern)
                .on('change', e => {
                  let obj = data;
                  path.forEach(key => obj = obj[key] = obj[key] || {});
                  obj[key] = e.target.value;
                }),
                // $('label').class('caption').for('input'+inputId),
                $('label').class('ico').for('input'+inputId),
              )
            )
          }
          inputId++;
          // console.log(inputElem, focusElement);
          // focusElement = focusElement || inputElem;
          // if (name === activeField || metaData.required || dataObj === null || !dataObj) {
          //   focusElement = inputElem;
          // }

          // if (cfg === null) {
          //   for (var p = contentElem; p; p = p.parentElement) p.open(1);
          // }
        } else {
          const parent = contentElem;
          contentElem = $('details').parent(contentElem).append(
            $('summary').text(metaData.title)
          );
          if (metaData.description) {
            contentElem.append($('div').html(metaData.description))
          }
          Object.entries(cfg).filter(([key,cfg])=>key !== 'metaData').forEach(entry => {
            build(...entry, path.concat(key));
          });
          contentElem = parent;
        }
      }
      Object.entries(formDefinitions).filter(([key,cfg])=>key !== 'metaData').forEach(entry => build(...entry, []));
      const elems = Array.from(formElem.elem.elements);
      const activeElement = elems.find(el => el.required) || elems.find(el => el.name === activeField) || elems.find(el => !el.value) || elems[0];
      // console.log(elems, activeElement)
      document.querySelectorAll('details').forEach(el => el.open = false);
      Array.from(formElem.elem.elements).forEach(el => {
        if (el.required || el.value) {
          for (var p = el; p; p = p.parentElement) {
            if ('open' in p) {
              p.open = true;
            }
          }
        }
      })
      // console.log(formElem.elem.elements);
      activeElement.focus();


      // this.text('').append(
      //   $('h1').text('JAaa'),
      // )

    },
    // dark(){
    //   $(document.documentElement).attr('dark', sessionStorage.getItem('dark'));
    //   this.on('click', e => {
    //     sessionStorage.setItem('dark', sessionStorage.getItem('dark') ^1 );
    //     $(document.documentElement).attr('dark', sessionStorage.getItem('dark'));
    //   });
    //   return this;
    // }
  }
  Object.defineProperties(Elem.prototype, {
    // action() {
    //   return this.attr('action', ...arguments)
    // },
    attr: { value: function (selector, context, save) {
      if (save && this.elem.id) {
        $.localAttr.set(this.elem.id, selector, context);
      }
      if (selector) {
        if (typeof selector === 'object') {
          Object.entries(selector).forEach(entry => this.attr(...entry));
        } else {
          if (arguments.length === 1) {
            return this.elem.getAttribute(selector)
          } else if (context === null || context === undefined) {
            this.elem.removeAttribute(selector)
          } else if (typeof context === 'function') {
            this.on(selector, context)
          } else if (typeof context === 'object') {
            this.elem[selector] = context;
          // } else if (selector in this.elem) {
          //   this.elem[selector] = context;
          } else {
            this.elem.setAttribute(selector.replace(/ |%/g, ''), [].concat(context).join(' '))
          }
        }
      }
      return this;
    }},
    assign: { enumerable: true, value: function (selector, context) {
			if (typeof selector === 'string') {
				this.elem[selector] = context;
			} else if (selector instanceof Object) {
				Object.assign(this.elem, context);
			}
			// //console.log(this.elem);
			return this;
		}},
    btns: { value: function (selector, context) {
      const elem = $('div').parent(this).class('row btns');
      function btn(selector, context) {
        if (typeof selector === 'object') {
          return Object.entries(selector).forEach(entry => btn(...entry));
        }
        $(context.href ? 'a' : 'button').parent(elem).class('abtn').name(selector).caption(selector).attr(context)
      }
      [].concat(...arguments).forEach(
        selector => typeof selector !== 'object' ? null : (
          selector.name
          ? btn(selector.name, selector)
          : Object.entries(selector).forEach(entry => btn(...entry))
        )
      );
      return this;
    }},
    cancel: { value: function () {
      this.elem.innerText;
			// if (this.elem.innerText) {
			// 	if (this.selector.contains(this.form)) {
			// 		this.form.remove();
			// 	} else {
			// 		this.selector.innerText = '';
			// 	}
			// 	return this;
			// } else {
			// 	return false;
			// }
			// el.innerText = '';
			// targetElement.item = null;
			// if ($.show) $.show({ id: 0 });
			// if (window.onWindowResize) window.onWindowResize();
		}},
    caption: { value: function () {
      return this.attr('caption', __(...arguments))
    }},
    calendar: { value: function (data) {
			new Calendar(data, this);
			return this;
		}},
    chat: { value: function (selector, context){
			const $chat = this.sections.get('chat', selector => {
				$().main().append(
					selector = $('section').id('chat-room').append(
						$('div').id('videos').append(
							$('video').id('self-view').attr('autoplay', ''),
							$('video').id('remote-view').attr('autoplay', ''),
						)
					),
				);
				return selector;
			});
			return this;
		}},
    checkbox: { value: function () {
      const property = Object.assign({}, ...arguments);
      // console.log(property);
      const id = 'checkbox' + ($.his.checkboxInt = $.his.checkboxInt ? ++$.his.checkboxInt : 1);
      return [
        this
        .class('check')
        .attr('id', id)
        .value(property.value)
        .name(property.name)
        .disabled(property.disabled)
        .checked(property.checked),
        $('label')
        .class('aco')
        .for(id)
        .append(
          $('span')
          .ttext(property.Title || property.title || property.name)
        ),
        $('span')
        .text(property.cnt),
      ];
    }},
    children: { get() { return Array.from(this.elem.children).map(el => $(el)); }},
    class: { value: function (className) {
      // this.elem.className = [].concat(this.elem.className.split(' '), [...arguments]).unique().join(' ').trim();
      this.elem.className = [...arguments].join(' ').trim();
			return this;
		}},
    code: { value: function (content, format) {
      this.class('code');
      if (typeof content === 'function') {
        format = 'js';
        content = String(content).replace(/^(.*?)\{|\}$/g,'');
      }
      content = format && $.string[format] ? $.string[format](content) : content;
      this.elem.innerHTML = content;
      return this;
    }},
    contextmenu: { value: function (menu){
      // console.warn(menu);
      menu = $.extend({}, ...arguments);
      if (!menu.items) console.warn('no items', menu);
      // console.log(menu);
      const menuitems = new Map(Object.entries(menu.items));
      // console.log(menuitems);
      this.tabindex(0);
      this.on('keydown', e => {
        // console.warn('keydown', e.keyPressed);
        [...menuitems.entries()]
        .filter(([name, menuitem]) => menuitem.key === e.keyPressed && menuitem.on && menuitem.on.click)
        .forEach(([name, menuitem]) => menuitem.on.click(e));
      });
      return this;
      this.on('contextmenu', e => {
        e.preventDefault(e.stopPropagation());
        console.log(menu);
    		const targetElement = this.elem;
    		const targetRect = targetElement.getBoundingClientRect();
        var top = targetRect.bottom;
        if ('left' in menu) {
          var left = menu.left;
        } else if ('right' in menu) {
          var left = menu.right - menuElement.clientWidth;
        } else {
          var left = e.clientX;
          var top = e.clientY;
        }
        this.close = e => {
          window.removeEventListener('contextmenu', this.close, true);
          window.removeEventListener('click', this.close, true);
          window.removeEventListener('keydown', this.onKeydown, true);
          this.elemPopup.remove();
        };
        window.addEventListener('keydown', this.onKeydown = e => e.key === 'Escape' ? this.close(e) : null, true);
        // window.addEventListener('contextmenu', this.close, true);
        window.addEventListener('click', this.close, true);
        this.elemPopup = $('div')
        .parent(document.body)
        .class('col popup')
        .css('top', top+'px')
        .css('left', Math.max(0, left)+'px')
        .css('max-height', (window.screen.availHeight - top) + 'px')
        // .on('contextmenu', e => e.preventDefault(e.stopPropagation()))
        .append(
          [...menuitems.entries()].map(([name, menuitem]) => $('div').class('row abtn icn').extend(menuitem).extend({srcEvent:e})),
        );
        return;
    		if (this.handlers.menuElement) {
    			this.handlers.menuElement.remove();
    		}
    		// window.addEventListener('mousedown', e => {
    		// 	if (e.path.find(elem => elem === menuElement)) {
    		// 		return;
    		// 	}
    		// }, true);
    		// var menu = $.mainPopup;
    		if (targetElement.popupmenu) {
    			targetElement.right = 0;
    		}
    		// //console.debug('POS', targetElement, targetRect, targetElement.left, targetElement.right);
    		// //console.debug('PUMENU', this, this.menu, menu, pos);
    		menuElement.innerText = '';
    		for (let [menuname, menuitem] of Object.entries(menuItems)) {
    			// let title = __(menuitem.header0 || menuname);
    			// //console.debug('MENUITEM', menuitem, title);
    			if (menuitem.hidden) continue;
    			var linkElement = menuElement.createElement('A', {
    				name: menuname,
    				value: menuname,
    				elMenu: menuElement,
    				left: 5,
    				menuitem: menuitem,
    				popupmenu: menuitem.menu,
    				// item: this.item,
    				onclick: menuitem.onclick || (this.menu ? this.menu.onclick : null) || targetElement.onselect || function (e) {
    					//console.log ('MENU CLICK');
    					e.stopPropagation();
    				},
    				// onselect: this.onselect,
    				onmouseenter: this.enter
    			}, menuitem, {
    				className: 'row abtn icn ' + (menuitem.className || menuname),
    			});
    			if (menuitem.color) {
    				linkElement.createElement('icon', {}).style = 'background-color:' + menuitem.color;
    			}
    			linkElement.createElement('SPAN', 'aco', __(menuitem.header0 || menuname));
    			if (menuitem.key) {
    				linkElement.createElement('SPAN', '', menuitem.key);
    			}
    		};
    		var top = targetRect.bottom;
    		if ('left' in targetElement) {
    			// var left = pos.right;
    			var left = pos.left;
    		} else if ('right' in targetElement) {
    			var left = targetRect.right - menuElement.clientWidth, top = targetRect.bottom;
    		} else {
    			var left = e.clientX, top = e.clientY;
    		}
    		left = Math.max(0, left);
    		menuElement.style.left = left + 'px';
    		menuElement.style.top = top + 'px';
    		menuElement.style.maxHeight = (window.screen.availHeight - top) + 'px';
        // new Popup(e, context);
      });
			// this.elem.contextmenu = context;
			return this;
		}},
    messagesPanel: { value: function () {
      this.append(
        $('div')
        .class('col err')
        .append(
          $('div').class('row err hdr').append(
            $('span').class('').text(''),
            $('span').class('').text('System'),
            $('span').class('aco').text('Message'),
            $('span').class('time').text('Start'),
            $('span').class('time').text('Accept'),
            $('span').class('time').text('End'),
          ),
          $().elemMessages = $('div').class('col aco'),
        ),
      );
      return this;
    }},
    css: { value: function (selector, value) {
			const args = [...arguments];
			const elem = this.elem || this.selector;
			if (selector instanceof Object) {
				Object.entries(selector).forEach(entry => arguments.callee.call(this, ...entry))
			} else {
				const css = elem.style.cssText.split(';').filter(s => s.trim()).filter(s => s.split(':')[0].trim() !== selector);
        if (value === '') {
					css.push(selector);
        } else if (value === null) {
				} else {
					css.push(`${selector}:${value}`);
					// let id = elem === document.body ? '_body' : elem.id;
					// if (id) {
					// 	let css = localStorage.getItem('css');
					// 	css = css ? JSON.parse(css) : {};
					// 	(css[id] = css[id] || {})[selector] = value;
					// 	localStorage.setItem('css', JSON.stringify(css));
					// }
				}
        elem.style.cssText = css.join(';');
			}
			return this;
		}},
    displayvalue: { value: function (selector) {
      if (this.elem.item) {
        this.text(this.elem.item.displayvalue(selector));
      }
      return this;
    }},
    draw: { value: function (options) {
			// this.elem = elem('CANVAS', 'aco');
			// setTimeout(() => this.paint = new Paint(this.elem, options));
      this.paint = new Paint(this.elem, options);
			// if (this.selector) {
			// 	this.selector.append(this.elem);
			// }
			// //console.log(this.elem);
			return this;
		}},
    insertBefore: { value: function (newNode, referenceNode) {
      console.log(newNode, referenceNode);
      this.elem.insertBefore(newNode.elem || newNode, referenceNode ? referenceNode.elem || referenceNode : null)
    }},
    extend: { value: function () {
      $.extend(this, ...arguments);
      return this;
    }},
    edit: { value: function (item) {
      console.log('EDIT', item);
      item.editing = true;
      item.onloadEdit = false;
      function stopVideo() {
        var c = document.getElementsByTagName('video');
  			for (var i = 0, e; e = c[i]; i++) {
          e.pause();
        }
      }
      function users() {
        return;
        // TODO: Item Users
        return ['A', 'c ' + row.ID, row.Value || ($.getItem(row.tag) ? $.getItem(row.tag).Title : row.ID), {
					onclick: Web.Element.onclick,
					id: row.ID,
					// innerText: row.Value || ($.getItem(row.tag] ? $.getItem(row.tag].Title : row.ID),
				},[
					['BUTTON', {
						type: 'BUTTON',
						row: row,
						onclick: $.removeUser = (e)=>{
							e.preventDefault();
							e.stopPropagation();
							// //console.log();
							new $.HttpRequest($.config.$, 'DELETE', `/${this.tag}/Users(${e.target.row.ID})`, e => {
								//console.log(e.target.responseText);
							}).send();
							e.target.parentElement.remove();
							inputElement.focus();
							return false;
						}
					}]
				]];
      }
      item.elemFiles = $('div').files(item, 'Files');
      function openDialog (accept) {
        $('input').type('file').multiple(true).accept(accept).on('change', e => {
          if (e.target.files) {
            [...e.target.files].forEach(item.elemFiles.appendFile)
          }
        }).click().remove()
      }
      const buttons = {
        attach: () => openDialog(''),
        image: () => openDialog('image/*'),
        camera: () => {
          const panelElem = $('div').parent(document.querySelector('#section_main')).class('col aco abs panel').append(
            $('nav').class('row top abs btnbar np').append(
              $('span').class('aco'),
              $('button').class('abtn freedraw').on('click', this.openFreedraw = e => {
                window.event.stopPropagation();
                buttons.freedraw().canvas.context.drawImage(this.cam.video, 0, 0, this.canvas.width, this.canvas.height);
                return this;
              }),
              $('button').class('abtn save').on('click', e => {
                window.event.stopPropagation();
                this.openFreedraw().save().closeFreedraw();
                //
                // const video = this.cam.video;
                // const canvasElem = $('canvas').parent(panelElem).width(video.videoWidth).height(video.videoHeight).draw();
                // const canvas = canvasElem.paint._canvas;
                // const context = canvasElem.paint._ctx;
                // context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // canvas.toBlob(blob => {
                //   item.elemFiles.appendFile(new File([blob], `image_${new Date().toISOString().replace(/\.|:|Z|-/g,'')}.png`));
                //   // canvas.remove();
                // });
              }),
              $('button').class('abtn close').on( 'click', this.closeCam = e => panelElem.remove() )
              // this.panelElem
            ),
            this.cam = $('div').class('aco').cam()
          )
        },
        freedraw: () => {
          const panelElem = $('div').parent(document.querySelector('#section_main')).class('col aco abs panel').append(
            $('nav').class('row top abs btnbar np').append(
              $('span').class('aco'),
              $('button').class('abtn clean').on('click', e => {
                this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
              }),
              $('button').class('abtn save').on('click', this.save = e => {
                window.event.stopPropagation();
                this.canvas.toBlob(blob => {
                  item.elemFiles.appendFile(new File([blob], `image.png`));
                });
                return this;
              }),
              $('button').class('abtn close').on( 'click', this.closeFreedraw = e => panelElem.remove() )
              // this.panelElem
            ),
            this.canvasElem = $('canvas').width(640).height(480).draw()
          );
          this.canvas = this.canvasElem.elem;
          return this;
        },
        close() {
          $().send({
            body: {
              notify: {
                title: `${item.header0} modified`,
                options:  {
                  body: `Bla Bla`,
                  icon: 'https://aliconnect.nl/favicon.ico',
                  image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
                  data: {
                    url: document.location.href,
                  },
                  // actions: [
                  //   {
                  //     action: 'new',
                  //     title: 'New',
                  //     // icon: 'https://aliconnect.nl/favicon.ico',
                  //   },
                  //   {
                  //     action: 'open',
                  //     title: 'Open',
                  //     // icon: 'https://aliconnect.nl/favicon.ico',
                  //   },
                  //   // {
                  //   //   action: 'gramophone-action',
                  //   //   title: 'gramophone',
                  //   //   icon: '/images/demos/action-3-128x128.png'
                  //   // },
                  //   // {
                  //   //   action: 'atom-action',
                  //   //   title: 'Atom',
                  //   //   icon: '/images/demos/action-4-128x128.png'
                  //   // }
                  // ]
                }
              }
            }
          });
          // return;
          // var notification = new Notification('sadfasd');
          // notification.onclick = function(e) {
          //   console.log('CLICKED');
          //   window.focus();
          //   // window.open("http://www.stackoverflow.com");
          //   // window.location.href = 'https://aliconnect.nl';
          // }
          // notification.onclick = e => {
          //   console.log('CLICKED');
          //   window.focus();
          // }
          // return;
          //
          // $().notify(`${item.header0} modified`, {
          //   body: `Bla Bla`,
          //   url: 'https://moba.aliconnect.nl',
          //   icon: 'https://aliconnect.nl/favicon.ico',
          //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
          //   data: {
          //     href: document.location.href,
          //     url: 'test',
          //   },
          // });
          return $('view').show(item)
        },
      };
      const edit = $('div').parent(this).class('col aco abs').append(
        $('nav').class('row top abs btnbar np').append(
          $('span').class('aco'),
          Object.entries(buttons).map(([name, fn])=>$('button').class('abtn',name).on('click', fn))
        ),
        this.header(item),
        $('form').class('oa aco').append(
          item.elemFiles,
        ).properties(item.properties),
      );
      return this;
    }},
    markup: { value: function (el) {
      const replace = {
        yaml(str) {
          return str
          .replace(/\n/g, '')
          .replace(/^(.*?)(#.*?|)$/, (s,codeString,cmt) => {
            return codeString
            .replace(/^(\s*)(.+?):/, '$1<span class="hl-fn">$2</span>:')
            .replace(/: (.*?)$/, ': <span class="hl-string">$1</span>')
            + (cmt ? `<span class=hl-cmt>${cmt}</span>` : '')
          });
        }
      };
      this.elem.innerHTML = replace.yaml(this.elem.innerText);
      this.elem.markup = true;
      return this;
    }},
    editor: { value: function (lang) {
      // const statusBar =
      // setTimeout(() => {
      //   console.log('EDITOR', this.parentElement);
      //   this.parentElement.insertBefore($('div').text('ja'), this.nextSibling)
      // })
      // this.parentElement.insertBefore($('div').text('pos'), this.nextSibling);
      this.class('code-editor');
      const his = [];
			const elem = this.elem;
      const rectContainer = this.elem.getBoundingClientRect();
      const html = lang ? $.string[lang](elem.innerText) : elem.innerText;
      let rows;
      let selLine;
      // console.log(html);
      function toggleOpen (el, open) {
        if (open === -1) {
          return s.removeAttribute('open');
        }
        if (el.hasAttribute('open')) {
          open = open === undefined ? el.getAttribute('open') ^1 : open;
          el.setAttribute('open', open);
          for (var s = el.nextSibling;s;s = s.nextSibling) {
            if (s.level <= el.level) break;
            if (open) {
              if (s.level<=el.level+2) {
                s.removeAttribute('hide');
              }
            } else {
              s.setAttribute('hide', '');
              if (s.hasAttribute('open')) {
                s.setAttribute('open', 0);
              }
            }
          }
        }
      }
      this.on('click', e => {
        if (e.offsetX<0) {
          toggleOpen(e.target);
        }
      });
      function checkOpen(el, open = 1) {
        if (!el) return;
        el.level = el.innerText.search(/\S/);
        if (el.nextSibling) {
          el.nextSibling.level = el.nextSibling.innerText.search(/\S/);
          if (el.nextSibling.level > el.level) {
            if (!el.hasAttribute('open')) {
              el.setAttribute('open', open);
            }
          } else if (el.hasAttribute('open')) {
            el.removeAttribute('open');
          }
        } else if (el.hasAttribute('open')) {
          el.removeAttribute('open');
        }
      }
      this.text = content => {
        this.elem.innerText = '';
        this.append(content.split(/\n/).map(l => $('div').text(l).markup()));
        this.append($('div').html('<br>'));
        var children = Array.from(this.elem.children);
        children.forEach(el => {
          checkOpen(el, 0);
          if (el.level > 0) el.setAttribute('hide', '');
        });
        // this.createRows();
      };
      this.src = url => {

      };
      function caret (el) {
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(el);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
      }
      function getNode (parent, pos) {
        if (parent.childNodes) {
          for (var node of parent.childNodes) {
            if (node.nodeType == Node.TEXT_NODE) {
              if (pos <= node.length) {
                return [node, pos, true];
              } else {
                pos = pos - node.length;
              }
            } else {
              var [node, pos, done] = getNode(node, pos);
              if (done) {
                return [node, pos, done];
              }
            }
          }
        }
        return [parent, pos];
      };
      function setCaret (parent, pos) {
        var [node, nodepos] = getNode(parent, pos);
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(node, nodepos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

			return this
			.attr('contenteditable','')
			.attr('spellcheck',false)
			// .css("display:inline-block;width:100%;")
      .on('paste', e => {
        // console.log(e);
        e.preventDefault();
        var text = e.clipboardData.getData("text");
        document.execCommand('insertText', false, text.replace(/\r/gs,''));
        var el = e.path.find(el => el.tagName === 'DIV');
        for (var el; el; el = el.nextSibling) {
          checkOpen(el);
          $(el).markup();
          if (el.nextSibling && el.nextSibling.markup) {
            break;
          }
        }
      })
			.on('keydown', e => {
        var range = window.getSelection().getRangeAt(0);
        for (var el = range.startContainer.parentElement; el && el.tagName !== 'DIV'; el = el.parentElement);
        if (e.keyPressed === 'ctrl_alt_BracketLeft') {
          e.preventDefault();
          toggleOpen(el, 0)
        }
        if (e.keyPressed === 'ctrl_alt_BracketRight') {
          e.preventDefault();
          toggleOpen(el, 1)
        }
				if(e.keyCode==9 && !e.shiftKey){
					e.preventDefault();
					// document.execCommand('insertHTML', false, '&#009');
					document.execCommand('insertHTML', false, '  ');
				}
        setTimeout(() => {
          var sel = window.getSelection();
          var an = sel.focusNode;
          var range = sel.getRangeAt(0);
          for (var el = an.nodeType === 3 ? an.parentNode : an; el.tagName !== 'DIV'; el = el.parentElement);
          var children = Array.from(this.elem.children);
          const row = children.indexOf(el);
          const prefix = range.cloneRange();
          prefix.selectNodeContents(el);
          prefix.setEnd(range.endContainer, range.endOffset);
          var col = prefix.toString().length;
          // $.his.elem.statusbar['pos'].text(`${row+1}:${col+1}`);
          var el = children[row];
          // console.log(el, sel, e.keyCode);
          if (el.hasAttribute('hide')) {
            for (var el; el && el.hasAttribute('hide'); el = e.keyCode >= 39 ? el.nextSibling : el.previousSibling);
            if (el) {
              if (e.keyCode === 37) col=el.innerText.length;
              if (e.keyCode === 39) col=0;
              var range = window.getSelection().getRangeAt(0).cloneRange();
              var [node,pos] = getNode(el, Math.min(col, el.innerText.length));
              // console.log(node,pos);
              range.setEnd(node,pos);
              if (!e.shiftKey) {
                range.setStart(node,pos);
                range.collapse(true);
              }
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
          rows = Array.from(this.elem.children);
          rows.filter(el => el.hasAttribute('selected')).forEach(el => el.removeAttribute('selected'));
          el.setAttribute('selected', '');
          checkOpen(el);
          checkOpen(el.previousElementSibling);

          // console.log('pos', row, col);
          if (!e.ctrlKey) {
            if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
              const rowsOpen = children.map(el => el.getAttribute('open'));
              $(el).markup();
              // console.log(el, col);
              setCaret(el, col);

              //
              //
              // // rowsOpen.forEach(i => children[i].setAttribute('open', ''));
              //
              // return;
              //
              // var content = children.map(el => el.innerText.replace(/\n$/, '')).join('\n');
              // his.push(content);
              // // console.log(content);
              // this.elem.innerText = '';
              // this.append(content.split(/\n/).map(l => $('div').html(replace.yaml(l) || '<br>')));
              // var children = Array.from(this.elem.children);
              // var el = children[row];
              //
              // setCaret(col, el);
              // // this.refresh();
              // // console.log('up');
              // // const pos = caret(elem);
              // //
              // // const range = window.getSelection().getRangeAt(0);
              // // const el = range.startContainer.parentElement;
              // // el.innerHTML = replace.yaml(el.innerText);
              // // // console.log(el, el.innerText, el.innerHTML)
              // // // Array.from(this.elem.children).forEach(el => el.innerText = el.innerText);
              // // // js(el);
              // // // this.attr('showall', 1);
              // // // this.text(elem.innerText.replace(/\n\n/gs, '\n'));
              // // // this.attr('showall', null);
              // // // elem.innerHTML = lang ? $.string[lang](elem.innerText) : elem.innerHTML;
              // // // elem.innerText = elem.innerText.replace(/\n\n/gs, '\n');
              // // setCaret(pos, elem);
            }
          }
          // this.elem.getElementsByTagName('SPAN')

        })
			})
		}},
    editorCollapse: { value: function (){

    }},
    emit: { value: function (selector, detail){
			this.elem.dispatchEvent(new CustomEvent(selector, {detail: detail}));
			return this;
		}},
    exists: { value: function (parent) {
			return (parent || document.documentElement).contains(this.elem)
		}},
    files: { value: function files (item, attributeName){
      this.item = item;
      console.log('FILES', item, attributeName);
      this.files = item[attributeName];
      // this.files = [];
      if (this.files === 'string' && this.files[0] === '[') this.files = JSON.parse(this.files);
      if (this.files === 'string' && this.files[0] === '{') this.files = [JSON.parse(this.files)];
      if (!Array.isArray(this.files)) this.files = [];
      this.appendFile = file => $.promise( 'appendFile', callback => {
        console.log(file, file.type, file.name);
        aimClient.api(`/${this.item.tag}/file`)
        .query({
          uid: this.item.data.UID,
          name: file.name,
          lastModified: file.lastModified,
          // lastModifiedDate: file.lastModifiedDate,
          size: file.size,
          type: file.type,
        })
        .post(file)
        .then(file => {
          this.files.push(file);
          if (file.type === 'application/pdf') {
            $().pdfpages(e.body.src).then(pages => {
              const textpages = pages.map(lines => lines.map(line => line.str).join("\n"));
              let words = [].concat(textpages.map(page => page.match(/\b\w+\b/gs))).map(words => words.map(word => word.toLowerCase()).unique().sort());
              console.log('PDF PAGES', words);
              aimClient.api(`/${this.item.tag}/?request_type=words`).patch(words).then(body => {
                console.log('WORDS', body);
              })
            })
          }
          console.log(e.target.responseText, attributeName, this.files);
          // item[attributeName] = { max:999, Value: JSON.stringify(e.body) };
          item[attributeName] = JSON.stringify(this.files);
          // console.log(item[attributeName]);
          this.emit('change');
          callback(file);
        })
      });
      this.removeElem = (elem, e) => {
        e.stopPropagation();
        elem.remove();
        this.files = [...this.elem.getElementsByClassName('file')].map(e => e.is.get('ofile'));
        // console.log(this.files);
        item[attributeName] = JSON.stringify(this.files);
        return false;
      };
      return this.class('col files')
      .on('drop', e => {
        e.preventDefault();
        if (e.dataTransfer.files) {
          [...e.dataTransfer.files].forEach(this.appendFile)
        }
      })
      .on('dragover', e => {
        e.dataTransfer.dropEffect = 'link';
        e.preventDefault();
      })
      .on('change', e => {
        this.text('').append(
          this.imagesElem = $('div').class('row images'),
          this.attachElem = $('div').class('row attach'),
        );
        console.debug(this, files, item, attributeName); // DEBUG:
        return;
        this.files.filter(Boolean).forEach(ofile => {
          let filename = ofile.src.split('/').pop();
          let ext = ofile.ext || ofile.src.split('.').pop();
          filename = filename.split('_');
          if (filename[0].length == 32) filename.shift();
          filename = filename.join('_');
          let href = ofile.src;
          if (ofile.src.match(/jpg|png|bmp|jpeg|gif|bin/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('img').class('aimage').src(ofile.src).set('ofile', ofile),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', e => this.removeElem(elem, e)),
              ),
            );
            // elem.elem.ofile = ofile;
            return;
            // return elem;
            if (ofile.src) {
              this.src(ofile.src);
            }
            return this;
            const access_token = $.auth.access_token;
            const iss = $.auth.access.iss;
            if (!ofile.src) return imgElement;
            var src = (ofile.srcs || ofile.src) + '?access_token=' + access_token;
            imgElement.src = (src.indexOf('http') === -1 ? ofile.host || "https://" + iss : '') + src;
            var src = (ofile.src) + '?' + ofile.lastModifiedDate;
            imgElement.srcl = (src.indexOf('http') === -1 ? ofile.host || "https://" + iss : '') + src;
            imgElement.alt = ofile.name || '';
            // return imgElement;
            return this;
          } else if (ofile.src.match(/3ds/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('div').class('aimage').set('ofile', ofile).width(120).height(120).tds({src: ofile.src}),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', e => this.removeElem(elem, e)),
              ),
            );
          } else if (ofile.src.match(/mp4|webm|mov/i)) {
            const elem = $('span')
            .parent(this.imagesElem)
            .class('row file elplay')
            .set('ofile', ofile)
            .append(
              $('i').class('bt sel'),
              $('video').class('aimage').src(ofile.src).set('ofile', ofile),
              $('div').class('row title').append(
                $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                $('i').class('abtn del').on('click', e => {
                  e.stopPropagation();
                  elem.remove();
                  item[attributeName] = JSON.stringify([...this.elem.getElementsByClassName('file')].map(e => e.ofile));
                  return false;
                })
              ),
            );
          } else {
            const elem = $('a')
            .parent(this.attachElem)
            .class('row file icn file_'+ext)
            .set('ofile', ofile)
            .href(href)
            .download(ofile.name)
            .draggable()
            .on('click', e => {
              if (ext === 'pdf') {
                const href = ofile.host + ofile.src;
                const iframeElem = $('view').append(
                  $('div').class('col aco iframe').append(
                    $('iframe').class('aco').src(href),
                    $('button').class('abtn close abs').on('click', e => iframeElem.remove()),
                  )
                );
                return false;
              }
            })
            .append(
              $('div').class('col aco').target('file').draggable().append(
                $('div').class('row title').append(
                  $('span').class('aco').text(ofile.alt || ofile.name).title(ofile.title),
                  $('i').class('abtn del').on('click', e => this.removeElem(elem, e)),
                ),
                $('div').class('row dt').append(
                  $('span').class('aco').text(ofile.size ? Math.round(ofile.size / 1000) + 'kB' : ''),
                  $('i').class('abtn download').href(href).download(ofile.name).on('click', e => {
                    e.stopPropagation();
                    if ($().aliconnector_id && href.match(/(.doc|.docx|.xls|.xlsx)$/)) {
                      e.preventDefault();
                      console.log(href);
                      $().ws().sendto($().aliconnector_id, {external: {filedownload: ['http://alicon.nl'+href]}}).then(e => {
                        console.log(e);
                      });
                    }
                  }),
                  // el.elModDate = createElement('SPAN', { className: 'aco', innerText: (ofile.lastModifiedDate ? new Date(ofile.lastModifiedDate).toLocaleString() + ' ' : '') + ((ofile.size) ? Math.round(ofile.size / 1000) + 'kB' : '') });
                  // if (hasEdit) {
                  // 	createElement('A', 'abtn pulldown', { popupmenu: {
                  // 		bewerken: {
                  // 			Title: 'Bewerken',
                  // 			onclick: editFile,
                  // 		},
                  // 	} });
                  // }
                ),
              ),
            );
            elem.elem.ofile = ofile;
            // return elem;
          }
        })
      })
      .emit('change')
    }},
		filesNext: { value: function () {
			this.filesSlide(1);
			if (this.slideIdx == 0 && get.pv) {
				//// //console.debug('NEXT PAGE');
			}
		}},
		filesSlide: { value: function (step) {
			//var elSlide = this.images[this.slideIdx];
			//if (elSlide) {
			//    if (elSlide.pause) this.elSlide.pause();
			//    elSlide.parentElement.removeAttribute('show');
			//}
			this.images = this.elem.getElementsByClassName('aimage');
			//// //console.debug('IMAGES', this.images);
			this.slideIdx += step || 0;
			this.imagesElement.setAttribute('prev', this.slideIdx > 0);
			this.imagesElement.setAttribute('next', this.slideIdx < this.images.length - 1);
			//if (this.slideIdx == 0) this.setAttribute('dir', 'r');
			//if (this.slideIdx < 0) this.slideIdx = this.images.length - 1;
			//// //console.debug(this, step, elSlide, this.slideIdx);
			var elSlide = this.images[this.slideIdx];
			if (!elSlide) {
				this.slideIdx = 0;
				var elSlide = this.images[this.slideIdx];
			}
			if (!elSlide) return;
			elSlide.show();
			if (elSlide.play && checkVisible(elSlide)) {
				if ($.player.elPlaying) items.player.elPlaying.pause();
				elSlide.currentTime = 0;
				//items.player.elPlaying = elSlide;
				elSlide.play();
			}
			//else
			//    items.player.play();
		}},
		forEach: { value: function (fn, selector, context) {
			if (selector) {
				if (typeof selector !== 'object') {
					return fn.apply(this, [...arguments].slice(1))
				} else {
					Object.entries(selector).forEach(entry => fn.call(this, ...entry))
				}
			}
			return this;
		}},
    ganth: { value: function (data) {
			setTimeout(() => new Ganth(data, this));
			return this;
		}},
    get: { value: function () {
      return this.map.get(...arguments);
    }},
    has: { value: function () {
      return this.map.has(...arguments);
    }},
    header: { value: function (item) {
			// let startDate = new Date(this.StartDateTime.replace('000Z','Z'));
			// let endDate = new Date(this.EndDateTime.replace('000Z','Z'));
			// let createdDate = new Date(this.CreatedDateTime.replace('000Z','Z'));
      // if (item.IsPublic) {
			// 	item.publicElement = ['DIV', 'icn IsPublic ' + (item.hostID === 1 ? 'public' : '')];
			// }
			return $('header')
      .class('row header', item.tag)
      .draggable()
      // .item(item, 'view')
      .on('change', function (e) {
        function linkMaster(item, name, elem) {
          if (item && item.data && item.data[name]) {
            const master = $(data = [].concat(item.data[name]).shift());
            elem.insert($('span').itemLink(master), '/');
            if (master && master.details) {
              master.details().then(item => linkMaster(item, name, elem));
            }
          }
          return elem;
        }
        function linkSource(item, name, elem) {
          if (item && item.data && item.data[name]) {
            const master = $(data = [].concat(item.data[name]).shift());
            elem.append(':', $('span').itemLink(master));
            if (master && master.details) {
              master.details().then(item => linkSource(item, name, elem));
            }
          }
          return elem;
        }
        this.is.text('').append(
          // $('div').class('modified'),
					// .contextmenu(this.properties.State.options)
					// .on('contextmenu', e => //console.log(e))
					$('button').class('abtn stateicon')
					.append(
						$('i').append(
							$('i').css('background-color', item.stateColor),
						),
						item.elemStateUl = $('ul').class('col').append(
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
							$('li').class('abtn').text('JAdsfg sdfg sd'),
						)
					)
					.on('mouseenter', function (e) {
						const rect = this.getBoundingClientRect();
						//console.log(window.innerHeight);
						item.elemStateUl.css('top', (rect.top)+'px').css('left', rect.left+'px');
					}),
          item.IsPublic ? $('div', 'icn IsPublic').class(item.hostID === 1 ? 'public' : '') : null,
          $('div')
          .class('icn itemicon', item.className)
          .css('border-color', item.modColor)
          .css('color', item.schemaColor)
          .append(
            item.gui && item.gui.global
            ? $('div', 'gui').append(
              $('div', 'detail').append(
                $('div', 'object').append(
                  $('div', item.tag, item.gui.detail),
                ),
              ),
            )
            : (item.iconsrc ? $('img').src(item.iconsrc) : null),
          ),
          $('div').class('aco col headername inline').append(
            $('div', 'header title', item.header0).append(
              // linkSource(item, 'Src', $('span').class('path source')),
            ),
            $('div', 'header subject', item.header1),
            $('div', 'header preview', item.header2),
            // linkMaster(item, 'Master', $('div').class('row path master')),
            $('div', 'row date')
            // .contextmenu(item.flagMenu)
            ,
          ),
        );
      }).emit('change')
		}},
    html: { value: function (content, format) {
			const elem = this.elem;
      [].concat(content).forEach(content => {
        if (typeof content === 'function') {
          format = 'js';
          content = String(content).replace(/^(.*?)\{|\}$/g,'');
        }
        content = format && $.string[format] ? $.string[format](content) : content;
        this.elem.innerHTML += content;
      });
			return this;
		}},
    write: { value: function (content) {
      return this.elem.innerHTML += content;
    }},
    htmledit: { value: function (property) {
			const oDoc = this.elem;
			const stateButtons = {};
			function formatDoc(sCmd, sValue) {
				if (oDoc.currentRange) {
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(oDoc.currentRange);
				}
				if (validateMode()) {
					document.execCommand(this.cmd || sCmd, false, this.value || this.name || this.Title || sValue || this.cmd || sCmd);
					oDoc.focus();
				}
			}
			function validateMode() {
				if (!oDoc.codeview || !oDoc.codeview.checked) { return true; }
				alert("Uncheck \"Show HTML\".");
				oDoc.focus();
				return false;
			}
			function setDocMode() {
				var oContent;
				if (oDoc.contentEditable !== 'false') {
					oContent = document.createTextNode(oDoc.innerHTML);
					oDoc.innerHTML = '';
					var oPre = document.createElement('PRE');
					oPre.onfocus = function(e) { this.parentElement.onfocus() };
					oDoc.contentEditable = false;
					oPre.id = 'sourceText';
					oPre.contentEditable = true;
					oPre.appendChild(oContent);
					oDoc.appendChild(oPre);
					document.execCommand('defaultParagraphSeparator', false, 'p');
				}
				else {
					if (document.all) {
						oDoc.innerHTML = oDoc.innerText;
					} else {
						oContent = document.createRange();
						oContent.selectNodeContents(oDoc.firstChild);
						oDoc.innerHTML = oContent.toString();
					}
					oDoc.contentEditable = true;
				}
				oDoc.focus();
			}
			function printDoc() {
				if (!validateMode()) { return; }
				var oPrntWin = window.open('', '_blank', 'width=450, height=470, left=400, top=100, menubar=yes, toolbar=no, location=no, scrollbars=yes');
				oPrntWin.document.open();
				oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
				oPrntWin.document.close();
			}
			const contentEditableCheck = (e) => {
				var sel = window.getSelection();
				stateButtons.hyperlink.attr('checked', sel.focusNode.parentElement.tagName === 'A');
				stateButtons.unlink.attr('disabled', !(
					(sel.anchorNode.nextSibling && sel.anchorNode.nextSibling.tagName === 'A' && sel.extentNode.previousSibling && sel.extentNode.previousSibling.tagName === 'A') ||
					(sel.extentNode.nextSibling && sel.extentNode.nextSibling.tagName === 'A' && sel.anchorNode.previousSibling && sel.anchorNode.previousSibling.tagName === 'A') ||
					(sel.anchorNode.parentElement.tagName === 'A' && sel.extentNode.parentElement.tagName !== 'A') ||
					(sel.anchorNode.parentElement.tagName !== 'A' && sel.extentNode.parentElement.tagName === 'A')
				));
				stateButtons.blockquote.attr('checked', sel.anchorNode.parentElement === sel.extentNode.parentElement && sel.extentNode.parentElement.tagName === 'BLOCKQUOTE');
				[
					'bold',
					'italic',
					'underline',
					'strikeThrough',
					'superscript',
					'subscript',
					'insertunorderedlist',
					'insertorderedlist',
					'justifyleft',
					'justifycenter',
					'justifyright',
					'justifyfull'
				].forEach(name => stateButtons[name].attr('checked', document.queryCommandState(name)))
			};
			let keyupTimeout;
			const keysup = {
				shift_alt_ArrowRight() {
					formatDoc('indent');
				},
				shift_alt_ArrowLeft() {
					formatDoc('outdent');
				},
				ctrl_Space() {
					formatDoc('removeFormat');
					oDoc.innerHTML = oDoc.innerHTML.replace(/\r/g,'').replace(/<p><\/p>/g,'');
				},
				ctrl_alt_Digit1() {
					formatDoc('formatblock', 'H1');
				},
				ctrl_alt_Digit2() {
					formatDoc('formatblock', 'H2');
				},
				ctrl_alt_Digit3() {
					formatDoc('formatblock', 'H3');
				},
				ctrl_shift_Period() {
					var startSize = parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize);
					for (var i = 1; i <= 7; i++) {
						formatDoc('fontsize', i);
						if (parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize) > startSize) break;
					}
				},
				ctrl_shift_Comma() {
					//console.log('<');
					var startSize = parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize);
					for (var i = 7; i >= 1; i--) {
						formatDoc('fontsize', i);
						if (parseInt(window.getComputedStyle(window.getSelection().anchorNode.parentElement, null).fontSize) < startSize) break;
					}
				},
			};
			const keysdown = {
				ctrl_KeyD() {
					//console.log('D');
					formatDoc('strikeThrough');
				},
			};
      this
      .contenteditable('')
      .on('paste', e => {
        // e.preventDefault();
        console.log(e, e.clipboardData, e.clipboardData.files, e.clipboardData.types.includes('Files'));
      })
      .on('drop', e => {
        e.preventDefault();
        if (e.dataTransfer.files) {
          [...e.dataTransfer.files].forEach(file => {
            property.item.elemFiles.appendFile(file).then(file => {
              console.log(file);
              // return;
              if (window.getSelection) {
                var sel, range, html;
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                  //let offset = sel.focusOffset;
                  range = sel.getRangeAt(0);
                  range.deleteContents();
                  var elImg = document.createElement('img');
                  elImg.src = file.srcs || file.src;
                  range.insertNode(elImg);
                  range.setStartAfter(elImg);
                  //range.setEnd(elImg, 0);
                  //range.setStart()
                  //range.set
                  //window.getSelection().addRange()
                  //range.setStart(el.childNodes[2], 5);
                  //range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  //document.activeElement.setSelectionRange(5,5);
                }
              }
              else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = text;
              }
            });
          })
        }
      })
			.on('focus', e => {
				//console.log('FOCUS')
				oDoc.currentRange = null;
				// setDocMode();
				document.execCommand('defaultParagraphSeparator', false, 'p');
				// if ($.editBtnRowElement) $.editBtnRowElement.remove();
				// switchBox = $.editBtnRowElement.createElement('INPUT', {type:"checkbox", onchange:function(e){setDocMode(this.checked);} });
				// for (var name in btns) $.editBtnRowElement.createElement('span', { className: 'abtn icn ' + name }).createElement('img', Object.assign({
				// 	// onclick: Element.onclick,
				// 	src:'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
				// 	title: __(name),
				// }, btns[name]));
				for (var menuParentElement = oDoc; menuParentElement.tagName !== 'FORM'; menuParentElement = menuParentElement.parentElement);
				if (!$.editBtnRowElement || !$.editBtnRowElement.parentElement) {
					function formatButton(name, classname) {
						return stateButtons[name] = $('button').class('abtn', name, classname).attr('title', name).on('click', e => formatDoc(name))
					}
					$.editBtnRowElement = $('div').parent(document.body).class('row top abs textedit np shdw').append(
						formatButton('undo r'),
						formatButton('redo'),
						formatButton('cut', 'split'),
						formatButton('copy'),
						formatButton('paste'),
						$('button').class('abtn fontname split').append($('ul').append([
							'Arial','Arial Black','Courier New','Times New Roman'
						].map(fontname => $('li').class('abtn').text(fontname).on('click', e => formatDoc('fontname', fontname))))),
						$('button').class('abtn fontsize').append($('ul').append([
							[1, 'Very small'],
							[2, 'A bit small'],
							[3, 'Normal'],
							[4, 'Medium-large'],
							[5, 'Big'],
							[6, 'Very big'],
							[7, 'Maximum'],
						].map(([size, text]) => $('li').class('abtn').text(text).on('click', e => formatDoc('fontsize', size))))),
						$('button').class('abtn switchMode').append($('ul').append([
							['h1', __('Header 1') + ' <h1>'],
							['h2', __('Header 2') + ' <h2>'],
							['h3', __('Header 3') + ' <h3>'],
							['p', __('Paragraph') + ' <p>'],
							['pre', __('Preformated') + ' <pre>'],
						].map(([tag, text]) => $('li').class('abtn').text(text).on('click', e => formatDoc('formatblock', tag))))),
						formatButton('removeFormat', 'split'),
						formatButton('bold', 'split'),
						formatButton('italic'),
						formatButton('underline'),
						formatButton('strikeThrough'),
						formatButton('subscript'),
						formatButton('superscript'),
						$('button').class('abtn backcolor split').append($('ul').append([
							'black','red','orange','yellow','green','blue','white'
						].map(color => $('li').class('abtn', color).text(color).on('click', e => formatDoc('backcolor', color))))),
						$('button').class('abtn forecolor').append($('ul').append([
							'black','red','orange','yellow','green','blue','white'
						].map(color => $('li').class('abtn', color).text(color).on('click', e => formatDoc('forecolor', color))))),
						formatButton('insertunorderedlist', 'split'),
						formatButton('insertorderedlist'),
						formatButton('outdent', 'split'),
						formatButton('indent'),
						formatButton('justifyleft', 'split'),
						formatButton('justifycenter'),
						formatButton('justifyright'),
						formatButton('justifyfull'),
						stateButtons.blockquote = $('button').class('abtn blockquote split').on('click', e => formatDoc('formatblock', 'blockquote')),
						stateButtons.hyperlink = $('button').class('abtn hyperlink split').on('click', e => {
							var sLnk = prompt('Write the URL here', 'http:\/\/');
							if (sLnk && sLnk != '' && sLnk != 'http://') {
								formatDoc('createlink', sLnk)
							}
						}),
						stateButtons.unlink = $('button').class('abtn unlink').on('click', e => formatDoc('unlink')),
						$('button').class('abtn clean split').on('click', e => {
							if(validateMode()&&confirm('Are you sure?')){ this.innerHTML = this.value; }
						}),
						$('button').class('abtn print').on('click', e => printDoc()),
						// $('button').class('abtn paste').attr('cmd', 'paste').on('click', setDocMode),
					).on('click', e => {
						//console.log('CLICK');
						clearTimeout(oDoc.blurTimeout);
					}, true);
				}
			})
			.on('keyup', e => {
				let key = e.keyPressed;
				if (oDoc.innerHTML && oDoc.innerHTML[0] !== '<') {
					oDoc.innerHTML='<p>'+oDoc.innerHTML+'</p>';
					const node = oDoc.childNodes[0];
					const range = document.createRange();
					const sel = window.getSelection();
					range.setStart(node, 1);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
					e.preventDefault();
				}
				if (keysup[key]) {
					keysup[key]();
					e.preventDefault();
				}
				clearTimeout(keyupTimeout);
				keyupTimeout = setTimeout (contentEditableCheck, 200, e);
			})
			.on('keydown', e => {
				let key = e.keyPressed;
				if (keysdown[key]) {
					keysdown[key]();
					e.preventDefault();
				}
			})
			.on('blur', e => {
				oDoc.blurTimeout = setTimeout(e => $.editBtnRowElement.elem.remove(), 300);
				oDoc.currentRange = window.getSelection().getRangeAt(0);
				for (var i = 0, p; p = e.path[i]; i++) {
					if (p.item) break;
				}
				// let html = oDoc.innerHTML;
				// //console.log(html);
				// html = html.trim()
				// .replace(/<p><\/p>/gis, '')
				// .replace(/<p><br><\/p>/gis, '')
				// .replace(/<div><\/div>/gis, '')
				// .replace(/<div><br><\/div>/gis, '')
				// .replace(/^<p>/is, '')
				// .replace(/<\/p>$/is, '')
				// .replace(/^/is, '<p>')
				// .replace(/$/is, '</p>')
				// ;
				// oDoc.innerHTML = html;
				if (p && p.item && oDoc.name) {
					p.item[oDoc.name] = oDoc.innerHTML;
				}
				if (property) {
						property.value = oDoc.innerHTML;
					}
			})
			.on('mouseup', e => contentEditableCheck);
			return this;
		}},
    insert: { value: function (){
			this.elem = this.elem || document.body;
			const args = [].concat(...arguments);
			args.forEach(a => !a ? null : this.elem.insertBefore(typeof a === 'string' ? document.createTextNode(a) : a.elem || a, this.elem.firstChild));
			return this;
		}},
    id: { value: function (selector) {
			this.elem.setAttribute('id', selector);
      $.his.map.set(selector, this);
			// this.attr('id', ...arguments);
			// if ($.localAttr[selector]) {
			// 	Object.entries($.localAttr[selector]).forEach(entry => this.elem.setAttribute(...entry));
			// }
			return this;
		}},
    item: { value: function (item, name) {
      if (item) {
        if (name) {
          // console.log(item.elems);
          item.elems = item.elems || new Map();
          // console.log(item.elems, Map, new Map());
          item.elems.set(name, this);
        }
        this.elem.item = item;
        return this;
        this.set('item', item);
      }
      // console.log(elem, elem.item)
      for (var elem = this.elem; elem && !elem.item; elem = elem.parentElement);
      // console.log(elem, elem.item)
      return elem ? elem.item : null;
      // return this;
    }},
    itemAttr: { value: function (items, attributeName, value) {
			items = Array.isArray(items) ? items : [items];
			const a = $.his.attributeItems = $.his.attributeItems || {};
			if (a[attributeName]) {
				a[attributeName].forEach(item => {
					delete item[attributeName];
					Object.values(item)
					.filter(value => value instanceof Element)
					.forEach(elem => elem.removeAttribute(attributeName));
				})
			}
			// set attributen van nieuwe lijst
			items.forEach(item => {
				const elements = Object.values(item).filter(value => value instanceof Element);
				if (value === undefined) {
					delete item[attributeName];
					elements.forEach(elem => elem.removeAttribute(attributeName));
				} else {
					item[attributeName] = value;
					elements.forEach(elem => elem.setAttribute(attributeName, value));
				}
			});
			return a[attributeName] = items || [];
		}},
    itemLink: { value: function (link){
      if (link) {
        item = link instanceof Item ? link : $(link);
        return this.append(
          (this.linkElem = $('a'))
          .text(item.header0)
          .item(item)
          .href('#/id/' + item.Id)
          .on('mouseenter', e => {
            console.log('a mouseenter');
            const targetElement = this.linkElem.elem;
            const rect = targetElement.getBoundingClientRect();
            const popupElem = $.popupcardElem = $.popupcardElem || $('div').parent(document.body).class('pucard');
            popupElem
            .style(`top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height+10}px;`)
            .on('close', e => {
              console.log('div close', this);
              $.popupcardElem = null;
              popupElem.remove();
            })
            .on('mouseleave', e => {
              console.log('div mouseleave', this);
              popupElem.to = clearTimeout(popupElem.to);
              popupElem.emit('close');
            })
            .on('mouseenter', e => {
              console.log('div mouseenter');
              clearTimeout(this.to);
              const divElem = $('div').parent(popupElem.text(''));
              console.log(item);
              this.to = setTimeout(() => item.details().then(item => {
                popupElem.css(`opacity:1;`);
                const infoID = item.tag;
                divElem.append(
                  $('div').class(' shdw col').append(
                    $('div').class('aco point').append(
                      $('div').class('kop0').text(item.header0),
                      $('div').class('kop1').text(item.header1),
                      $('div').class('kop2').text(item.header2),
                    ),
                    $('div').class('row top btnbar').append(
                      Array.isArray(item.Email) ? item.Email.map(email => $('a').class('abtn icn email').text(email.Value).href(`mailto:${property.Value}`)) : null,
                    )
                  ).on('click', e => {
                    popupElem.emit('close');
                    $().preview(item);
                  })
                );
              }),500);
            });
          })
        );
      }
    }},
    langtext: { value: function (value){
      return this.ttext(...arguments);
    }},
    list: { value: function (){
      $().list(this);
      return this;
    }},
    load: { value: async function (src, callback){
      console.warn(src);
      if (src.match(/\w+\(\d+\)/)) {
        return;
      }
      if (src.match(/wiki$/)) {
        src += '/';
      }
      if (src.match(/wiki\/$/)) {
        src += 'Home';
      }
      function rawSrc(src) {
        console.log(777, src, document.location.hostname);
        src = src.replace(/\/(blob|tree)\/main/,'');
        if (document.location.hostname.split('.').pop() === 'localhost') {
          // src = src.replace(/github.com/, 'github.localhost');
          // console.error(333, new URL(new URL(src, document.location).pathname, document.location).href);
          src = new URL(new URL(src, document.location).pathname, 'http://github.aliconnect.nl').href;
        } else if (!src.match(/githubusercontent/)) {
          // src = src.replace(/\/\/([\w\.-]+)\.github\.io/, '//github.com/$1/$1.github.io');
          // src = src.replace(/\/\/([\w\.-]+)\.github\.io$/, '//github.com/$1/$1.github.io');
          src = src.replace(/\/\/([\w\.-]+)\.github\.io/, '//github.com/$1');
          src = src.replace(/github.com/, 'raw.githubusercontent.com');
        }
        if (src.match(/githubusercontent/)) {
          if (src.match(/\/wiki/)) {
            src = src.replace(/wiki$/,'wiki/Home');
            src = src.replace(/raw.githubusercontent.com\/(.*?)\/wiki/, 'raw.githubusercontent.com/wiki/$1');
          } else if (!src.match(/\/main/)) {
            src = src.replace(/raw.githubusercontent.com\/([\w\.-]+)\/([\w\.-]+)/, 'raw.githubusercontent.com/$1/$2/main');
          }
        } else {
          src = src.replace(/\/main/g, '');
          // src = src.replace(/\/main|\/aliconnect/g, '');
        }
        src = src.replace(/\/tree|\/glob|\/README.md/g, '');
        src = new URL(src, document.location).href;
        console.log(1, src);
        return src;
      }
      const elem = this;
      elem.paths = elem.paths || [];
      const homePath = document.location.origin;
      const origin = new URL(src, document.location).origin;
      const linksrc = hrefSrc(src).toLowerCase();
      this.links = this.links || [];
      src = rawSrc(src);
      this.loadMenu = async function (src) {
        // console.warn(4, src, rawSrc(src).replace(/wiki$/, 'wiki/'));
        var wikiPath = rawSrc(src).replace(/wiki$/, 'wiki/').replace(/[\w\.-]*$/,'');
        // wikiPath = wikiPath.match(/wiki/) ? wikiPath : new URL(wikiPath).origin + '/wiki/';
        // wikiPath = wikiPath.match(/wiki/) ? wikiPath : new URL(wikiPath).origin + '/wiki/';
        if (!elem.paths.includes(wikiPath)) {
          console.log(9, 'loadMenu', wikiPath, this.links);
          elem.paths.push(wikiPath);
          await $().url(rawSrc(wikiPath+'_Sidebar.md')).accept('text/markdown').get().catch(console.error)
          .then(e => {
            this.doc.leftElem.md(e.target.responseText);
            Array.from(this.doc.leftElem.elem.getElementsByTagName('A')).forEach(elem => $(elem).href(hrefSrc(elem.getAttribute('href'), e.target.responseURL)));
          });
          Array.from(this.doc.leftElem.elem.getElementsByTagName('LI')).forEach(li => {
            if (li.childNodes.length) {
              if (li.childNodes[0].nodeValue) {
                li.replaceChild($('span').text(li.childNodes[0].nodeValue.trim()).elem, li.childNodes[0]);
              }
              const nodeElem = li.firstChild;
              if (!nodeElem.hasAttribute('open') && nodeElem.nextElementSibling) {
                nodeElem.setAttribute('open', '0');
                $(nodeElem).attr('open', '0').on('click', e => {
                  nodeElem.setAttribute('open', nodeElem.getAttribute('open') ^ 1);
                });
              }
            }
            // console.log(li.childNodes);
          });
          this.links = Array.from(this.doc.leftElem.elem.getElementsByTagName('A'));
        }
        // console.log('loadMenu2', src, wikiPath, this.links);
      };
      if (!this.doc) {
        this.doc = $().document(
          $('div'),
        );
        await this.loadMenu($.config.ref.home);
      }
      (this.findlink = () => {
        this.link = this.links.find(link => link.getAttribute('href') && link.getAttribute('href').toLowerCase() === linksrc);
      })();
      if (!this.link) {
        await this.loadMenu(src);
        this.findlink();
      }
      if (src.match(/wiki/)) {
      } else if (!src.match(/\.md$/)) {
        src += '/README';
      }
      if (!src.match(/\.md$/)) {
        src += '.md';
      }
      this.src = src;
      this.scrollTop = this.scrollTop || new Map();
      (this.url = $().url(src).accept('text/markdown').get()).then(async e => {
        if (elem.pageElem && elem.pageElem.elem.parentElement) {
          elem.loadIndex = false;
          // console.log('elem.docElem', elem, elem.docElem && elem.docElem.elem.parentElement);
        } else {
          elem.loadIndex = true;
        }
				let content = e.target.responseText;
        if (callback) {
          content = callback(content);
        }
        const responseURL = e.target.responseURL;
        var title = responseURL.replace(/\/\//g,'/');
        var match = content.match(/^#\s(.*)/);
        if (match) {
          content = content.replace(/^#.*/,'').trim();
          title = match[1];
        } else {
          title = title.match(/README.md$/)
          ? title.replace(/\/README.md$/,'').split('/').pop().split('.').shift().capitalize()
          : title.split('/').pop().split('.').shift().replace(/-/g,' ');
          title = title.replace(/-/,' ');
        }
        const date = e.target.getResponseHeader('last-modified');
				content = content.replace(/<\!-- sample button -->/gs,`<button onclick="$().demo(e)">Show sample</button>`);

				try {
					// eval('content=`'+content.replace(/\`/gs,'\\`')+'`;');
				} catch (err) {
					//console.error(err);
				}

				this.doc.docElem.text('').append(
          this.doc.navElem = $('nav'),
          $('h1').text(title),
          date ? $('div').class('modified').text(__('Last modified'), new Date(date).toLocaleString()) : null,
        )
        .md(content)
        .mdAddCodeButtons();
        this.doc.docElem.renderCode();

        // [...this.doc.docElem.elem.getElementsByTagName('code')].forEach(elem => {
        //   if (elem.hasAttribute('source')) {
        //     $().url(hrefSrc(elem.getAttribute('source'), responseURL)).get()
        //     .then(e => {
        //       var content = e.target.responseText.replace(/\r/g, '');
        //       if (elem.hasAttribute('id')) {
        //         var id = elem.getAttribute('id');
        //         var content = content.replace(new RegExp(`.*?<${id}>.*?\n(.*?)\n(\/\/|<\!--) <\/${id}.*`, 's'), '$1').trim();
        //       }
        //       if (elem.hasAttribute('function')) {
        //         var id = elem.getAttribute('function');
        //         var content = content.replace(/\r/g, '').replace(new RegExp(`.*?((async |)function ${id}.*?\n\})\n.*`, 's'), '$1').trim();
        //       }
        //       elem.innerHTML = elem.hasAttribute('language') ? $.string[elem.getAttribute('language')](content) : content;
        //       // console.log(content);
        //       // $(elem).html(content, elem.getAttribute('language'));
        //     });
        //   }
        // });
        [...this.doc.docElem.elem.getElementsByTagName('A')].forEach(elem => $(elem).href(hrefSrc(elem.getAttribute('href'), responseURL)));
        [...this.doc.docElem.elem.getElementsByTagName('IMG')].forEach(elem => {
          // let imgsrc = elem.getAttribute('src')||'';
          // if (imgsrc.match(/\/\//)) {
          //   const url = new URL(imgsrc);
          //   src = url.origin + url.pathname;
          // } else if (src.match(/^\//)) {
          //   const url = new URL(filename);
          //   src = url.origin + src;
          // } else {
          //   const url = new URL(src, filename.replace(/[^\/]+$/,''));
          //   src = url.origin + url.pathname;
          // }
          // src = src.replace(/\/wiki$/, '/wiki/Home');
          // src = src.replace(/github.com/, 'raw.githubusercontent.com');
          // src = src.replace(/raw.githubusercontent.com\/(.*?)\/wiki/, 'raw.githubusercontent.com/wiki/$1');
          // src = src.replace(/\/tree|\/blob/, '');
          elem.setAttribute('src', new URL(elem.getAttribute('src'), new URL(src, document.location)).href.replace(/^.*?\//,'/'));
        });
        setTimeout(() => this.doc.indexElem.index(this.doc.docElem));

        this.links.forEach(link => link.removeAttribute('selected'));
        if (this.link) {
          $(this.link).attr('selected', '');
          for (var link = this.link; link; link = link.parentElement.parentElement ? link.parentElement.parentElement.previousElementSibling : null) {
            if (link.hasAttribute('open')) {
              link.setAttribute('open', '1');
            }
          }
          const children = Array.from(this.link.parentElement.parentElement.children);
          const total = children.length;
          const index = children.indexOf(this.link.parentElement) + 1;
          var elemPrevious;
          var elemNext;
          this.doc.docNavTop.text('');
          if (this.link.parentElement.previousElementSibling) {
            elemPrevious=$('a').class('row prev').href(this.link.parentElement.previousElementSibling.firstChild.getAttribute('href')).append(
              $('span').text('←'),
              $('small').class('aco').text('Previous'),
            );
            this.doc.docNavTop.append(
              $('a').class('row prev').href(this.link.parentElement.previousElementSibling.firstChild.getAttribute('href')).append(
                $('span').text('←'),
                $('small').text(this.link.parentElement.previousElementSibling.firstChild.innerText),
              )
            )
          }
          if (this.link.parentElement.nextElementSibling) {
            elemNext=$('a').class('row next').href(this.link.parentElement.nextElementSibling.firstChild.getAttribute('href')).append(
              $('small').class('aco').text('Next'),
              $('span').text('→'),
            );
            this.doc.docNavTop.append(
              $('a').class('row next').href(this.link.parentElement.nextElementSibling.firstChild.getAttribute('href')).append(
                $('small').class('aco').text(this.link.parentElement.nextElementSibling.firstChild.innerText),
                $('span').text('→'),
              )
            )
          }
          $('div').parent(this.doc.docElem).class('row').append(
            $('span').append(elemPrevious),
            $('span').class('aco').align('center').text(`${index} van ${total}`),
            $('span').append(elemNext),
          );
        }

        this.doc.docElem.elem.scrollTop = this.scrollTop.get(src);

        return this;

			});
      return this.url;
    }},
    maps: { value: async function (selector, referenceNode) {
			const maps = await $.his.maps();
			// if (!$.his.maps.script) {
			// 	return $.his.maps.script = $('script')
			// 	.attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&libraries=places')
			// 	.parent(document.head)
			// 	.on('load', e => arguments.callee.apply(this, arguments))
			// }
			// $.his.maps.showonmap (par.maps, el);
			// referenceNode = referenceNode || $.listview.listItemElement;
			// referenceNode.innerText = '';
			// //console.log('============================');
			// const myLatLng = { lat: -25.363, lng: 131.044 };
			// const map = new google.maps.Map(document.getElementById("map"), {
			// 	zoom: 4,
			// 	center: myLatLng,
			// });
			// new google.maps.Marker({
			// 	position: myLatLng,
			// 	map,
			// 	title: "Hello World!",
			// });
			// referenceNode.style = 'width:100%;height:500px;';
			// this.mapel = referenceNode;//referenceNode.createElement('DIV', { className: 'googlemap', style: 'width:100%;height:100%;' });
			let map = new maps.Map(this.elem, { zoom: 8 });
			bounds = new maps.LatLngBounds();
			geocoder = new maps.Geocoder();
			// var address = selector;//decodeURI(params).split('/').pop();
			// //console.debug(address);
			geocoder.geocode({
				'address': selector
			}, function(results, status) {
				if (status == maps.GeocoderStatus.OK) {
					$.marker = new maps.Marker({
						map: map,
						position: results[0].geometry.location
					});
					bounds.extend($.marker.getPosition());
					map.fitBounds(bounds);
					maps.e.addListenerOnce(map, 'bounds_changed', e => this.setZoom(Math.min(10, this.getZoom())));
				} else {
					// //console.debug('Geocode was not successful for the following reason: ' + status);
				}
			});
			// new $.his.maps(el, par.maps);
		}},
    renderCode: { value: function (responseURL) {
      Array.from(this.elem.getElementsByTagName('code')).forEach(elem => {
        if (elem.hasAttribute('source')) {
          $().url(hrefSrc(elem.getAttribute('source'), responseURL)).get().then(e => {
            var content = e.target.responseText.replace(/\r/g, '');
            if (elem.hasAttribute('id')) {
              var id = elem.getAttribute('id');
              var content = content.replace(new RegExp(`.*?<${id}>.*?\n(.*?)\n(\/\/|<\!--) <\/${id}.*`, 's'), '$1').trim();
            }
            if (elem.hasAttribute('function')) {
              var id = elem.getAttribute('function');
              var content = content.replace(/\r/g, '').replace(new RegExp(`.*?((async |)function ${id}.*?\n\})\n.*`, 's'), '$1').trim();
            }
            content = window.markdown().render(content, elem.getAttribute('language'));
            // console.log(content);
            // console.log(content);
            $(elem).class('block').append($('pre').html(content.trim()));
            // console.log(content);
            // $(elem).html(content, elem.getAttribute('language'));
          });
        }
      });
      return this;
    }},
    md: { value: function (content) {
      if (window.markdown) {
        for (let [key,value] of Object.entries($.his.api_parameters)) {
          content = content.replace(key,value);
        }
        const mdElem = $('div').html(window.markdown().render(content));
        for (let divElement of mdElem.elem.getElementsByTagName('DIV')) {
          if (divElement.hasAttribute('source')) {
            var loadingTask = pdfjsLib.getDocument(divElement.getAttribute('source'));
            loadingTask.promise.then(async pdf => {
              // console.log('PDF loaded');
              var numPages = pdf.numPages;
              // console.log(pdf);
              for (var pageNumber=1, numPages = pdf.numPages;pageNumber<=numPages;pageNumber++) {
                await pdf.getPage(pageNumber).then(function(page) {
                  // console.log('Page loaded');

                  var scale = 1;
                  var viewport = page.getViewport({scale: scale});

                  // Prepare canvas using PDF page dimensions
                  var a = $('a').parent(divElement).href(divElement.getAttribute('source'));
                  var canvas = $('canvas').parent(a).elem;
                  // document.body.appendChild(canvas);
                  // var canvas = document.getElementById('the-canvas');
                  var context = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;

                  // Render PDF page into canvas context
                  var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                  };
                  var renderTask = page.render(renderContext);
                  renderTask.promise.then(function () {
                    // console.log('Page rendered');
                  });
                });
              }

              // Fetch the first page
            }, function (reason) {
              // PDF loading error
              console.error(reason);
            });
            // console.log(source);
          }
        }
        // this.elem.innerHTML += $.string.mdHtml(s);
        this.elem.append(...mdElem.elem.childNodes);
      }
      // const src = currentScript.src.replace(/elem/g, 'markdown');
      // const md = Array.from(document.getElementsByTagName('SCRIPT')).find(e => e.src === src);
      // console.log(window.markdown);
      // console.log('md1');
      // importScript(currentScript.src.replace(/elem/g, 'markdown')).then(e => {
      //   console.log('md');
      //   // console.log($.his.api_parameters);
      // });
			return this;
		}},
    mdc: { value: function (s) {
      const newlines = [];
      let level = 0;
      $.string.mdHtml(s).split(/\n/).forEach(line => {
        const match = line.match(/^<h(\d)>(>\s)/);
        if (match) {
          // line = line.replace(/h\d>/g,'summary>')
          // if (match[1]==level) {
          //   newlines.push('</details><details>'+line);
          // } else if (match[1]>level) {
          //   newlines.push('<details>'+line);
          // } else if (match[1]<level) {
          //   newlines.push('</details></details><details>'+line);
          // }
          line = '<summary>'+line.replace(/>\s/,'')+'</summary>';
          if (match[1]==level) {
            newlines.push('</details><details>'+line);
          } else if (match[1]>level) {
            newlines.push('<details>'+line);
          } else if (match[1]<level) {
            newlines.push('</details></details><details>'+line);
          }
          level = match[1];
          return;
        }
        return newlines.push(line);
      });
      this.elem.innerHTML += newlines.join('\n');
      [...this.elem.getElementsByTagName('DETAILS')].forEach(
        el => el.addEventListener('toggle', e => el.open ? ga('send', 'pageview', el.firstChild.innerText) : null)
      );
      //   if (el.open) {
      //     console.log(el.firstChild.innerText);
      //     ga('send', 'pageview', el.firstChild.innerText);
      //   }
      // }))
      // this.on('click', e => {
      //   const el = e.path.filter(el => el.tagName === 'SUMMARY').shift();
      //   if (el && el.firstChild) {
      //     // ga('send', 'e', 'click', el.firstChild.innerText);
      //     ga('send', 'pageview', el.firstChild.innerText);
      //     // ga('send', 'e', {
      //     //   'hitType': 'pageview',
      //     //   'page': 'Testpage'
      //     // });
      //     // ga('send', 'e', 'Videos', 'play', 'Fall Campaign');
      //     // ga('send', 'e', {
      //     //   'eventCategory': 'Category',
      //     //   'eventAction': 'Action'
      //     // });
      //     // ga('set', 'title', el.firstChild.innerText);
      //     console.log(el.firstChild.innerText);
      //   }
      // })
      return this;
    }},
    mdAddCodeButtons: { value: function (){
      [...this.elem.getElementsByClassName('code-header')].forEach(elem => {
        const elemHeader = $(elem);
        const elemCode = $(elem.nextElementSibling);
        elemHeader.append(
          $('button').class('abtn copy').css('margin-left: auto'),
          $('button').class('abtn edit').on('click', e => elemCode.editor(elemHeader.attr('ln'))),
          $('button').class('abtn view').on('click', e => {
            const block = {
              html: '',
              css: '',
              js: '',
            };
            for (let codeElem of this.docElem.elem.getElementsByClassName('code')) {
              const type = codeElem.previousElementSibling.innerText.toLowerCase();
              if (type === 'html') {
                block[type] = block[type].includes('<!-- html -->') ? block[type].replace('<!-- html -->', codeElem.innerText) : codeElem.innerText;
              } else if (type === 'js') {
                block.html = block.html.replace(
                  /\/\*\* js start \*\*\/.*?\/\*\* js end \*\*\//s, codeElem.innerText
                );
              } else if (type === 'yaml') {
                block.html = block.html.replace(
                  /`yaml`/s, '`'+codeElem.innerText + '`',
                );
              } else if (type === 'css') {
                block.html = block.html.replace(
                  /\/\*\* css start \*\*\/.*?\/\*\* css end \*\*\//s, codeElem.innerText
                );
              }
              if (codeElem === elem) break;
            }
            var html = block.html
            .replace('/** css **/', block.css)
            .replace('/** js **/', block.js);
            console.log(html);
            return;
            const win = window.open('about:blank', 'sample');
            const doc = win.document;
            doc.open();
            doc.write(html);
            doc.close();
          }),
        )
      });
      return this;
    }},
    // media: new Media(),

    // menuitems: {
		// 	copy: { Title: 'Kopieren', key: 'Ctrl+C', onclick: function() { aimClient.selection.copy(); } },
		// 	cut: { Title: 'Knippen', key: 'Ctrl+X', onclick: function() { aimClient.selection.cut(); } },
		// 	paste: { Title: 'Plakken', key: 'Ctrl+V', onclick: function() { aimClient.selection.paste(); } },
		// 	hyperlink: { Title: 'Hyperlink plakken', key: 'Ctrl+K', onclick: function() { aimClient.selection.link(); } },
		// 	del: { Title: 'Verwijderen', key: 'Ctrl+Del', onclick: function() { aimClient.selection.delete(); } },
		// 	//add: {
		// 	//    Title: 'Nieuw',
		// 	//    click: function() { // //console.debug(this); },
		// 	//    menu: {
		// 	//        map: { Title: 'Map', key: 'Ctrl+N', },
		// 	//        contact: { Title: 'Contact', },
		// 	//    }
		// 	//},
		// 	move: {
		// 		Title: 'Verplaatsen',
		// 		popupmenu: {
		// 			moveup: { Title: 'Omhoog', key: 'Alt+Shift+Up', },
		// 			movedown: { Title: 'Omlaag', key: 'Alt+Shift+Dwon', },
		// 			ident: { Title: 'Inspringen', key: 'Alt+Shift+Right', },
		// 			outdent: { Title: 'Terughalen', key: 'Alt+Shift+Left', },
		// 		}
		// 	},
		// 	//cat: {
		// 	//    Title: 'Categoriseren',
		// 	//    menu: {
		// 	//        Ja: { Title: 'Ja', color: 'black', },
		// 	//        Nee: { Title: 'Nee', color: 'red', },
		// 	//        Groen: { Title: 'Groen', color: 'green', },
		// 	//        Blauw: { Title: 'Blauw', color: 'blue', },
		// 	//    }
		// 	//},
		// 	state: {
		// 		Title: 'Status',
		// 		//menu: this.item.class.fields.state.options
		// 	},
		// },
    // mse: {
		// 	Contacts: {
		// 		/** @function $.mse.Contacts.find
		// 		*/
		// 		find: function() {
		// 			if (!$.mse.loggedin === undefined) setTimeout(arguments.callee.bind(this), 500);
		// 			var url = "/api/v2.0/me/contacts?$select=DisplayName&$top=1000&$order=LastModifiedDateTime+DESC";
		// 			$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(e) {
		// 				//console.log("OUTLOOK contacts", e.body);
		// 				if (!e.body || !e.body.Value) return;
		// 				e.body.Value.forEach(function(row){
		// 					row.req = {headers: $.mse.headers, path: row['@odata.id'] };
		// 					row.Title = row.DisplayName
		// 				});
		// 				Listview.show(e.body.Value);
		// 			});
		// 		},
		// 	},
		// 	Messages: {
		// 		/** @function $.mse.Messages.find
		// 		*/
		// 		find: function(){
		// 			//console.log(this);
		// 			var url = "/api/v2.0/me/messages?$select=*&$top=10&order=LastModifiedDateTime DESC";
		// 			$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(e) {
		// 				//console.log("OUTLOOK messsages", e.body);
		// 				if (!e.body || !e.body.Value) return;
		// 				e.body.Value.forEach(function(row){
		// 					row.req = {headers: $.mse.headers, path: row['@odata.id'] };
		// 					row.Title = row.From.EmailAddress.Name;
		// 					row.Subject = row.Subject;
		// 				});
		// 				Listview.show(e.body.Value);
		// 			});
		// 		},
		// 	},
		// 	Events: {
		// 		/** @function $.mse.Events.find
		// 		*/
		// 		find: function(){
		// 			var url = "/api/v2.0/me/es?$select=*&$top=10";
		// 			$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(e) {
		// 				e.body.Value.forEach(function(row){
		// 					row.Title = row.Subject;
		// 					row.Subject = row.Start.DateTime + row.End.DateTime;
		// 					row.Summary = row.BodyPreview;
		// 					row.req = {headers: $.mse.headers, path: row['@odata.id'] };
		// 				});
		// 				Listview.show(e.body.Value);
		// 				//console.log("OUTLOOK DATA", this.getHeader("OData-Version"), e.body);
		// 			});
		// 		},
		// 	},
		// 	Calendarview: {
		// 		/** @function $.mse.Calendarview.find
		// 		*/
		// 		find: function() {
		// 			var url = "/api/v2.0/me/calendarview?startDateTime=2017-01-01T01:00:00&endDateTime=2017-03-31T23:00:00&$select=Id, Subject, BodyPreview, HasAttachments&$top=100";
		// 			$.https.request ({ hostname: "outlook.office.com", path: url, headers: $.mse.headers }, function(e) {
		// 				e.body.Value.forEach(function(row){
		// 					row.Title = row.Subject;
		// 					row.req = {headers: $.mse.headers, path: row['@odata.id'] };
		// 				});
		// 				Listview.show(e.body.Value);
		// 				//console.log("OUTLOOK DATA", this.getHeader("OData-Version"), e.body);
		// 			});
		// 		},
		// 	},
		// 	userdata: {},
		// 	login: function() {
		// 		return;
		// 		if (!$.paths || !$.paths['/mse/login']) return $.mse.loggedin = null;
		// 		aimClient.api.request ({ path: '/mse/login' }, function(e) {
		// 			if (!e.body || !e.body.access_token) return $.mse.loggedin = false;
		// 			$.mse.loggedin = true;
		// 			this.userdata = e.body;
		// 			var mse_access_token = e.body.access_token.split('-');
		// 			var access = mse_access_token[0].split('.');
		// 			var header = JSON.parse(atob(access[0]));
		// 			this.payload = JSON.parse(atob(access[1]));
		// 			// //console.log("RT", e.body.refresh_token);
		// 			// //console.log("RT", e.body.refresh_token.split('.'));
		// 			// for (var i=0, c=e.body.refresh_token.split('-'), code;i<c.length;i++) {
		// 			// 	//console.log("C1", i, c[i]);
		// 			// 	try { //console.log("E1", i, atob(c[i])); } catch(err) {}
		// 			// 	for (var i2=0, c2=c[i].split('_'), code2;i2<c2.length;i2++) {
		// 			// 		//console.log("C1", i, "C2", i2, c2[i2]);
		// 			// 		try { //console.log("C1", i, "E2", i2, atob(c2[i2])); } catch(err) {}
		// 			// 	}
		// 			// }
		// 			// //console.log("MSE", e.body.refresh_token.split('-'));
		// 			var timeleft = Math.round(this.payload.exp * 1000 - new Date().getTime());
		// 			// //console.log("MSE USER DATA", this.responseText, header, this.payload);
		// 			this.headers = {
		// 				"Authorization": "Bearer " + this.userdata.access_token,
		// 				"Accept": "application/json",
		// 				"client-request-id": $().client_id,
		// 				"return-client-request-id": "true",
		// 				"X-AnchorMailbox": this.userdata.preferred_username,
		// 			};
		// 			setTimeout(this.login, timeleft<0 ? 5000 : timeleft-10);
		// 			rowinfo.createElement('SPAN', 'mse', this.payload.unique_name);
		// 			this.userdata.login_url = this.userdata.login_url + "&state=" + btoa(document.location.href);
		// 			// , href: "https://login.microsoftonline.com/common/oauth/v2.0/authorize?response_type=code&client_id=24622611-2311-4791-947c-5c1d1b086d6c&redirect_uri=https://aliconnect.nl/$/v1/api/mse.php&state=" + [$.config.$.domain].join("+") + "&prompt=login&scope=openid offline_access profile email https://outlook.office.com/mail.readwrite https://outlook.office.com/calendars.readwrite https://outlook.office.com/contacts.readwrite https://outlook.office.com/people.read"
		// 			// rowinfo.createElement('SPAN').createElement('A', {innerText: 'login', href: $.mse.btnLogin.href = this.userdata.login_url = this.userdata.login_url + "&state=" + btoa(document.location.href) });
		// 		}.bind(this));
		// 	},
		// },

    navlist: { value: function (selector, context) {
			(function init(parent, selector, context) {
				if (selector) {
					if (typeof selector === 'string') {
						const li = $('li').parent(parent);
						const a = $('a').parent(li).attr('id', 'nav'+selector).text(selector.replace(/^\d+-/,''));
						if (context && typeof context === 'object') {
							Object.entries(context).forEach(entry => {
								if (typeof entry[1] === 'object') {
									a.attr('open', a.attr('open') || '0');
									const ul = li.ul = li.ul || $('ul').parent(li);
									init(ul, ...entry);
								} else if (typeof entry[1] === 'function') {
									a.elem[entry[0]] = entry[1];
								} else {
									a.attr(...entry);
								}
							});
							a.class('abtn')
						}
					} else {
						if (Array.isArray(selector)) {
							selector.forEach(item => init(parent, item))
						} else if (selector instanceof Object) {
							Object.entries(selector).forEach(entry => init(parent, ...entry));
						}
					}
				}
			})(this, ...arguments);
			return this;
		}},
    on: { value: function (selector, context) {
			if (typeof selector === 'object') {
				Object.entries(selector).forEach(entry => this.on(...entry))
			} else {
				// //console.log(selector, 'on'+selector in this.elem, this.elem['on'+selector])
				if (('on'+selector in this.elem) && !this.elem['on'+selector]) {
					this.elem['on'+selector] = context
					// //console.log('JA', this.elem['on'+selector])
				} else {
					this.elem.addEventListener(...arguments);
				}
			}
			// //console.log(this.elem, ...arguments);
			return this;
		},},
    open: { value: function elemOpen (state) {
      if (!arguments.length) {
        return this.elem.hasAttribute('open')
      }
			if ('open' in this.elem) {
        this.elem.open = state;
      } else {
        this.attr('open', state ? '' : null);
      }
      return this;
    },},
    operations: { value: function (selector){
			this.append(Object.entries(selector).map(entry =>
				$('button').class('abtn', entry[0]).attr(name, entry[0]).assign(entry[1])
			))
		},},
    payform: { value: function (params){
			// if (!$.shop.customer || !$.shop.customer.Product) return;
			let subtotal = 0;
			function nr(val) {
				return Number(val).toLocaleString(undefined, {minimumFractionDigits: 2});
			}
			this.append(
				$('form')
				.class('col aco payform doc-content')
				.attr('action', '/?order')
				.attr('novalidate', 'true')
				// .on('submit', e => {
				// 	//console.log('submit', order);
				// 	e.preventDefault();
				// 	for (var i=0, el;el=this.elements[i];i++) {
				// 		if (el.required && el.offsetParent && !el.value) {
				// 			el.focus();
				// 			// return false;
				// 		}
				// 	}
				// 	this.order.value = JSON.stringify(order);
				// 	new $.HttpRequest($.config.$, 'POST', '/?order', this);
				// 	return false;
				// })
				.append(
					$('fieldset').append(
						$('legend').text('Vul je gegevens in'),
						$('div').text('Heb je al een account? Dan kun je inloggen.'),
						$('div').properties({
							Type: { format:'radio', required:true, options: {
								particulier: { },
								zakelijk: {},
							}},
							CompanyName: {required1: true, autofocus: true, value: params.customer.Title},
							FirstName: { required1: true },
							LastName: { required1: true },
							BusinessPhone0: { type: 'tel', required1: true },
							EmailAddress0: { type: 'email', required1: true, autocomplete: false },
							gender: { format:'radio', options: {
								male: { color: 'red' },
								female: { color: 'green' },
							} },
							OtherAddress: { format: 'address' },
							hasBusinessAddress: { format: 'checkbox' },
							BusinessAddress: { format: 'address' },
							NewsLetter: { format: 'checkbox', title: 'Ja, ik wil nieuwsbrieven ontvangen.' },
							SendDeals: { format: 'checkbox', title: 'Ja, stuur mij relevante deals afgestemd op mijn interesses' },
							CreateAccount: { format: 'checkbox', title: 'Ik wil een account aanmaken' },
							Password: { type: 'password', autocomplete:'new-password' },
							day: { type:'number', min: 1, max: 31, value:'1' },
							month: { type:'number', min: 1, max: 12, value:'1' },
							year: { type:'number', min: 1900, max: 2020, value:'2000' },
						}),
					),
					$('fieldset').append(
						$('legend').text('Kies een verzendmethode'),
						$('div').text('Maak een keuze: (zie Verzendkosten)'),
						$('div').properties({
							verzending: { format:'radio', required:true, className:'col', options: {
								afleveradres: {
									title: 'Bezorgen op het afleveradres',
									checked:1,
								},
								westerfoort: {
									title: 'Afhalen in Westerfoort',
									info: 'Openingstijden: di/wo/vr: 9:00-18:00\Ado: 9:00-20:00, za: 09:00-17:00\AAdres: Hopjesweg 12A, 1234AB, Westerfoort',
								},
								dhl: {
									title: 'Afhalen bij een DHL ServicePoint'
								},
							}}
						}),
					),
					$('fieldset').append(
						$('legend').text('Kies een betaalmethode'),
						$('div').text('Kies de betaalmethode die je makkelijk vindt.'),
						$('div').properties({
							paymethod: { format:'radio', required:true, options: {
								oprekening: {
									title: 'Achteraf betalen',
									unit: '+2%',
									checked: 1,
								},
								contant: {
									title: 'Contant bij afhalen',
								},
								ideal: {
									title: 'iDEAL',
								},
								paypal: {
									title: 'PayPAL',
									unit: '+2%',
									disabled: true,
								},
								mastercard: {
									disabled: true,
								},
								visa: {
									disabled: true,
								},
								meastro: {
									disabled: true,
								},
							}},
							issuer_id: {
								title: 'Kies bank.',
								id: 'issuerID',
								options: {
									0031: 'ABN Amro bank',
									0761: 'ASN Bank',
									0802: 'bunq',
									0721: 'ING',
									0801: 'Knab',
									0021: 'Rabobank',
									0771: 'RegioBank',
									0751: 'SNS Bank',
									0511: 'Triodos Bank',
									0161: 'Van Lanschot Bankiers',
								}
							}
						}),
					),
					$('fieldset').append(
						$('legend').text('Waardebon- of actiecode invoeren'),
					).properties({
						discountcode: { title: 'Waardebon- of actiecode invoeren' },
						// }).operations({
						// 	activate: { type: 'button' },
					}),
					$('fieldset').class('col').append(
						$('legend').text('Overzicht van je bestelling'),
						$('table').append(
							$('thead').append(
								$('tr').append(
									'Omschrijving,Aantal,Prijs,Totaal'.split(',').map(val => $('th').text(val)),
								),
							),
							$('tbody').append(
								params.rows.map(
									row => $('tr').append(
										Object.values(row).map(
											val => $('td').text(
												isNaN(val)
												? val
												: nr(val, subtotal += row.tot = Math.round(row.amount * row.price * 100) / 100)
											)
										)
									)
								),
								$('tr').append(
									$('td').text('Verzendkosten').attr('colspan', 3),
									$('td').text(nr(params.verzendkosten, subtotal += params.verzendkosten)),
								),
								$('tr').append(
									$('td').text('Transactiekosten').attr('colspan', 3),
									$('td').text(nr(params.transactiekosten, subtotal += params.transactiekosten)),
								),
								$('tr').append(
									$('td').text(`BTW ${params.btw}% over ${nr(subtotal)}`).attr('colspan', 3),
									$('td').text(nr(params.btw = Math.round(subtotal * params.btw) / 100, subtotal += params.btw)),
								),
								$('tr').append(
									$('td').text('TE BETALEN').attr('colspan', 3),
									$('td').text(nr(subtotal)),
								),
							),
						),
						$('input').attr('hidden', '').attr('name', 'order'),
						$('div').text('Als je op de bestelknop klikt ga je akkoord met onze algemene leveringsvoorwaarden.'),
						// $('div').class('row btns').operations({
						// 	activate: { label: 'Bestellen en betalen', default:true },
						// }),
						$('div').text('Door op de bestelknop te klikken rond je de bestelling af.'),
						$('div').text('Als je nu bestelt, gaan we direct aan de slag!'),
					),
				),
			)
		},},
    prompts: { value: function () {
      this.append([...arguments].map(name=>$('a').class('abtn', name).caption(name).href('#?prompt='+name)));
      return this;
    },},
    parent: { value: function (selector){
			$(selector).append(this.elem);
			return this;
		},},
    path: { value: function (){
			const path = [];
			for (let p = this.elem; p ;p = p.parentElement) {
				// //console.log(p);
				path.push(p);
			}
			return path;
		},},
    properties: { value: function (properties) {
      [...arguments].filter(Boolean).forEach(properties => {
        let elem = this.elem;
  			let parent = this;
  			let selector = parent;
  			const format = {
          address: {
  					edit() {
  						const addressField = this.property;
              const item = this.property.item;
              const prefix = this.property.name;
              // console.log(prefix);
              function onchange (e) {
  							const formElement = e.target.form;
                item[e.target.name] = e.target.value;
  							e.target.modified = true;
  							let address = [
                  ['Street', 'Number'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
                  ['PostalCode', 'City'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
                  ['Country'].map(name => formElement[prefix + name].value).filter(Boolean).join('+'),
  							].join(',');
                // console.log(address, formElement);
  							$().url('https://maps.googleapis.com/maps/api/geocode/json').query({
  								address: address,
  							}).get().then(e => {
  								let compnames = {
  									route: prefix + 'Street',
  									sublocality_level_2: prefix + 'Street',
  									sublocality: prefix + 'Street',
  									street_number: prefix + 'Number',
  									postal_code: prefix + 'PostalCode',
  									locality: prefix + 'City',
  									administrative_area_level_2: prefix + 'Town',
  									administrative_area_level_1: prefix + 'State',
  									country: prefix + 'Country',
  								};
  								e.body.results.forEach(result => {
  									if (result.address_components) {
  										result.address_components.forEach(comp => {
  											comp.types.forEach(type => {
  												fieldname = compnames[type];
                          // console.log(type);
  												if (formElement[fieldname] && !formElement[fieldname].modified) {
  													item[fieldname] = formElement[fieldname].value = comp.long_name;
  												}
  											})
  										});
  									}
  								});
  							});
  						};
              function prop (selector, options) {
                return $('span').class('col aco prop input').append(
                  $('input').id(prefix + selector).name(prefix + selector).value(item[prefix + selector]).class('inp')
                  .placeholder(' ').on('change', onchange),
                  $('label').for(prefix + selector).ttext('Address' + selector),
                  $('i'),
                )
              }
              this.selector.append(
                $('div').class('row wrap').append(prop('Street'), prop('Number')),
                $('div').class('row wrap').append(prop('PostalCode'), prop('City')),
                $('div').class('row wrap').append(prop('Town'), prop('State'), prop('Country')),
              );
  					},
  				},
          cam: {
  					className: 'doc-content',
  					createInput: function() {
  						let snap = 0;
  						let camElement = this.elEdit.createElement('div', 'cam col', [
  							['div', 'row top w', [
  								['button', 'abtn icn r save', 'save', {onclick() {
  									$('video').pause();
  									let canvas = camElement.createElement('canvas', {
  										width: 640,
  										height: 480,
  									});
  									let context = canvas.getContext("2d");
  									context.drawImage(video, 0, 0, 640, 480);
  									data = canvas.toDataURL("image/png");
  									//console.log(data);
  									// UPLOAD DATA
  									canvas.remove();
  									// App.files.fileUpload(this.item, { name: 'photo.png' }, $('canvas').toDataURL("image/png"));
  								}}],
  							]],
  							['video', 'aco', { id:'video', autoplay: true, width: 640, height: 480, onclick() {
  								let video = $('video');
  								if (video.paused) {
  									$('video').play();
  								} else {
  									$('video').pause();
  								}
  							}}],
  						]);
  						if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  							navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  								try {
  									$('video').srcObject = stream;
  								} catch (error) {
  									$('video').src = window.URL.createObjectURL(stream);
  								}
  								if ($('video')) {
  									$('video').play();
  								}
  							});
  						}
  					},
  				},
          // check: {
  				// 	createInput: function() {
  				// 		this.elEdit.className += ' fw';
  				// 		var values = this.value.split(', ');
  				// 		this.elInp = this.elEdit.createElement('DIV', { className: 'inp row wrap' });
  				// 		this.options = this.options || this.enum;
  				// 		for (var optionname in this.options) {
  				// 			var option = this.options[optionname];
  				// 			var elInpOption = this.elInp.createElement('span', { className: 'radiobtn check' });
  				// 			elInpOption.createElement('INPUT', {
  				// 				el: this.elInp, type: 'checkbox', id: this.name + optionname, value: optionname, checked: (values.indexOf(optionname) != -1) ? 1 : 0, onclick: function(e) {
  				// 					var c = this.elEdit.getElementsByTagName('INPUT');
  				// 					var a = [];
  				// 					for (var i = 0, e; e = c[i]; i++) if (e.checked) a.push(e.value);
  				// 					this.elEdit.newvalue = a.join(', ');
  				// 				}
  				// 			});
  				// 			elInpLabel = elInpSpan.createElement('LABEL', { for: this.name + optionname  });
  				// 			elInpLabel.createElement('icon').style.backgroundColor = option.color;
  				// 			elInpLabel.createElement('span', { innerText: option.Title });
  				// 		}
  				// 		//this.elEdit.createElement('LABEL', { innerText: this.placeholder });
  				// 	}
  				// },
          checkbox: {
  					view() {
              $('div')
  						.parent(this.selector)
  						.class('row prop check',this.property.format,this.property.name)
  						.append(
                $('label').class('check').text(this.property.title || this.property.name),
  							$('label').ttext(this.displayvalue)
  						);
  						return this;
  					},
  					edit() {
              const property = this.property;
              let value = this.value || this.defaultValue;
              // var forId = ['property',this.name].join('_');
              console.log('CEHCKBOX', this.name);
							$('div')
              .parent(this.selector)
              .class('col input check',this.format || this.type || '',this.property.name)
              .append(
                $('div').class('row check').append(
                  $('input')
                  .on('change', e => this.value = e.target.checked ? 'on' : null)
                  .type('checkbox')
                  // .name(this.name)
                  // .attr(this)
                  .checkbox(this, this.property, this.attributes),
                )
							);
              // return;
              // const elements = [];
  						// const inputElement = this.selector;
              //
              //
  						// let el = inputElement.createElement('DIV', ['col input check',property.format,property.name].join(' '));
              //
              // let value = this.value || this.defaultValue || '';
  						// if (property.options) {
  						// 	value = value.split(',');
  						// 	var options = property.options || {   };
  						// 	el.createElement('LABEL', '', __(property.title || property.name));
  						// 	el = el.createElement('DIV', 'row');
  						// 	function createElem(tag, option) {
  						// 		var forId = ['property',property.name,tag].join('_');
  						// 		el.createElement('DIV', 'row check', [
  						// 			['INPUT', {
  						// 				type: 'checkbox',
  						// 				// name: tag,
  						// 				id: forId,
  						// 				checked: value.includes(tag),
  						// 			}],
  						// 			['LABEL', 'caption', { for: forId }, [
  						// 				['I', option.color ? {style : `background-color:${option.color};`} : null],
  						// 				['SPAN', '', __(option.title || tag)],
  						// 			]],
  						// 		]);
  						// 	}
  						// 	Object.entries(options).forEach(entry => createElem(...entry));
  						// } else {
  						// 	var forId = ['property',property.name].join('_');
  						// 	el.createElement('DIV', 'row check', [
  						// 		['INPUT', {
  						// 			type: 'checkbox',
  						// 			name: property.name,
  						// 			id: forId,
  						// 			checked: value ? 1 : 0,
  						// 		}],
  						// 		['LABEL', 'caption', { for: forId }, [
  						// 			['I'],
  						// 			['SPAN', '', __(property.title || property.name)],
  						// 		]],
  						// 	]);
  						// }
  					},
  				},
          checklist: {
  					createInput: function() {
  						this.elInp = this.elEdit.createElement('select', {});
  						for (var optionname in this.options) this.elInp.createElement('option', { value: optionname, innerText: this.options[optionname].Title || optionname });
  					},
  				},
  				default: {
            showDetails() {
  						if (lastLegend !== legend) {
  							const currentLegend = lastLegend = legend;
  							$('div').parent(parent).append(
  								this.selector = selector = $('details').class('col')
                  .parent(parent)
  								.open($().storage(currentLegend))
  								.on('toggle', e => $().storage(currentLegend, e.target.open))
  								.append(
  									$('summary').class('focus').text(currentLegend)
  								)
  							)
  						}
              return this;
  					},
  					view(property) {
  						$('div')
              .parent(this.selector)
              .class(
                'row prop', this.format || this.type || '',
                this.property.name,
              )
              .append(
  							$('label').ttext(this.title),
								$('span')
                .class(
                  'aco pre wrap',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .html(this.displayvalue),
  						)
  					},
  					edit(property) {
              // console.log(property);
							$('div').parent(this.selector).class('col prop input',this.format || this.type || '',this.property.name).append(
								this.input = $('input')
                .class(
                  'inp focus aco',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .id(this.name)
                .name(this.property.name)
                .attr(this)
                // .attr(this.attributes)
                .value(this.ownprop || !this.srcprop ? this.value : '')
                .placeholder(this.srcprop ? this.value : ' ')
								.on('change', e => this.value = e.target.value),
								$('label').class('row aco').ttext(this.title || this.name).for(this.name),
								$('i').pattern(this.pattern),
							)
  					},
  				},
          draw: {
  					view(property) {
  					},
  					edit(property) {
  						$(this.selector).append(
                $('div').append(
                  $('canvas').width(640).height(480).style('border:solid 1px gray;').draw()
                )
              );
  					},
  				},
          email: {
						type: 'email',
						pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
  				},
          files: {
  					createInput() {
  						//console.log('FILESSSSS', attributeName, attribute, this.elEdit, this.item);
  						const files = new Files(this, this.elEdit);
  						if (this.item && this.item.editBarElement) {
  							if (!this.item.files) {
  								this.item.files = files;
  								this.item.editBarElement.createElement('button', 'abtn attach', {type: 'button', accept: '', onclick: files.openDialog});
  								this.item.editBarElement.createElement('button', 'abtn image', {type: 'button', accept: 'image/*', onclick: files.openDialog});
  							}
  						}
  						this.elEdit.append(files.elem);
  						// apr.item.editBarElement = $.pageEditElement.createElement('DIV', 'row top abs btnbar np', { id: 'pageEditTopBar', operations: {
  						// 	close: {Title: 'Sluit formulier' },
  						// 	attach: {type: 'button', accept: '', onclick: files.openDialog},
  						// 	image: {type: 'button', accept: 'image/*', onclick: files.openDialog},
  						// 	camera: {type: 'button', item: this, onclick: $.prompt.camera},
  						// 	freedraw: {type: 'button', item: this, onclick: $.prompt.freedraw},
  						// }});
  						// this.elEdit.append(new Files(this).elem);
  					},
  					createView() {
  						const files = new Files(this);
  						this.item.files = this.item.files || files;
  						// elForm.filesAttribute = elForm.filesAttribute || files;
  						// this.elSpan = this.elView.append(files.elem);
  						return this.elView = files.elem;
  						// new Files(this, this.elSpan);
  					},
  				},
          hidden: {
  					edit() {
  						const is = $('input')
              .attr(this.property)
              .parent(this.selector)
              .name(this.name)
              .attr('tabindex', -1);
  						if (this.property.format === 'hidden') {
  							is.class('hide_input');
  						}
  					}
  				},
          html: {
						view(property) {
  						$('div').parent(this.selector).class('col prop', this.format || this.type || '', this.property.name).append(
  							$('label').ttext(this.title),
  							$('span').class('aco pre wrap doc-content',this.className).html(this.displayvalue),
  						)
  					},
  					edit() {
							// let html = (this.value||'').trim()
							// 				.replace(/<p><\/p>/gis, '')
							// 				.replace(/<p><br><\/p>/gis, '')
							// 				.replace(/<div><\/div>/gis, '')
							// 				.replace(/<div><br><\/div>/gis, '')
							// 				.replace(/^<p>/is, '')
							// 				.replace(/<\/p>$/is, '')
							// 				.replace(/^/is, '<p>')
							// 				.replace(/$/is, '</p>')
							// 				;
							// 				html='';
							// //console.log(html);
							let html = this.value || '';
              $('div').class('prop col').parent(this.selector).append(
                $('div')
                .class('inp doc-content')
                .placeholder('')
                .html(html)
                .htmledit(this.property),
								$('label').text(this.property.title || this.property.name),
              );
  					},
  				},
          json: {
  					createInput: function() {
  						this.elEdit.className = 'field col fw';
  						this.elInp = this.elEdit.createElement('CODE').createElement('TEXTAREA', { className: 'inp oa', style: 'white-space:nowrap;', value: editor.json(this.value) });
  						this.elInp.addEventListener('change', function() { try { JSON.parse(this.value, true) } catch (err) { alert('JSON format niet in orde;'); } });
  						this.elEdit.createElement('LABEL', { innerText: this.placeholder });
  						this.elInp.onkeyup = function(e) {
  							if (this.style.height < 300) {
  								this.style.height = 'auto';
  								this.style.height = Math.min(this.scrollHeight + 20, 300) + 'px';
  							}
  						};
  						setTimeout(function(el) { this.elEdit.onkeyup(); }, 100, this.elInp);
  					},
  				},
          linkedin: {
  				},
          location: {
  					className: 'doc-content',
  					createInput: function() {
  						let mapsElement = this.elEdit.createElement('DIV', {
  							id:'map',
  							style: 'width:100%;height:400px;',
  						});
  						let map = new google.maps.Map(mapsElement, {
  							zoom: 8,
  							// zoomControl: true,
  							// scaleControl: false,
  							// scrollwheel: false,
  							// disableDoubleClickZoom: true,
  							// gestureHandling: 'greedy',
  							// gestureHandling: 'none',
  							// gestureHandling: 'auto',
  							gestureHandling: 'cooperative',
  						});
  						bounds = new google.maps.LatLngBounds();
  						geocoder = new google.maps.Geocoder();
  						if (navigator.geolocation) {
  							navigator.geolocation.getCurrentPosition(function(position) {
  								var pos = {
  									lat: position.coords.latitude,
  									lng: position.coords.longitude
  								};
  								//console.log('CURRENT POS', position);
  								var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  								$.currgeocoder = $.currgeocoder || new google.maps.Geocoder();
  								$.currgeocoder.geocode({
  									'location': myLatlng
  								}, function (results, status) {
  									if (status == google.maps.GeocoderStatus.OK) {
  										let marker = new google.maps.Marker({
  											map: map,
  											position: results[0].geometry.location
  										});
  										bounds.extend(marker.getPosition());
  										map.fitBounds(bounds);
  										google.maps.e.addListenerOnce(map, 'bounds_changed', function() {
  											this.setZoom(Math.min(10, this.getZoom()));
  										});
  									} else {
  										//console.error('Geocode was not successful for the following reason: ' + status);
  									}
  								});
  							}, function() {
  								// handleLocationError(true, infoWindow, map.getCenter());
  							});
  						} else {
  							alert('NOT navigator.geolocation');
  							// Browser doesn't support Geolocation
  							handleLocationError(false, infoWindow, map.getCenter());
  						}
  					},
  				},
          meter: {
  					view() {
  						this.selector.createElement('DIV', ['row prop',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name, {for: this.property.name } ],
  							['METER', 'aco', '2 outof 10', this.property, {id: this.property.name } ],
  						]);
  					},
  					edit() {
  						this.selector.createElement('DIV', ['row input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', {for: this.property.name } ],
  							['METER', 'aco', '2 outof 10', this.property, {id: this.property.name } ],
  						]);
  					},
  				},
          number: {
						type: 'number',
  				},
          password: {
						type: 'password',
  				},
          radio: {
  					view() {
  						$('div')
  						.parent(this.selector)
  						.class('row prop',this.property.format,this.property.name)
              .setProperty('btbg', ((this.property.options||{})[this.value]||{}).color)
  						.append(
  							$('label').class('check').text(this.property.title || this.property.name),
  							$('label').ttext(this.displayvalue)
  						);
  						return this;
  					},
            edit() {
  						const property = this.property;
  						let value = this.value || this.defaultValue;
  						function option(tag, option){
                option.value = tag;
                option.checked = tag === value;
  							const forId = ['property',property.name, tag].join('_');
  							if (property.required && !value) {
  								value = this.value = tag;
  							}
  							return $('div')
                .class('row')
                .setProperty('btbg', option.color)
                .append(
                  $('input')
                  .type('radio')
                  .on('change', e => {
                    property.value = tag;
                    this.changed = e.target;
                  })
                  .on('keydown', e => {
                    if (this.changed === e.target && e.code === 'Space' && !property.required) {
                      e.target.checked ^= 1;
                      property.value = e.target.form[e.target.name].value = e.target.checked ? e.target.value : null;
                      this.changed = null;
                      e.preventDefault();
                    }
                  })
                  .on('click', e => {
                    if (this.changed === e.target && !property.required) {
                      e.target.checked ^= 1;
                      property.value = e.target.form[e.target.name].value = e.target.checked ? e.target.value : null;
                      this.changed = null;
                    }
                  })
                  .checkbox(property, option)
  							)
  						}
  						this.selector.append(
  							$('div').class('col prop input',property.format,property.name).append(
  								$('label').text(property.title || property.name),
  								$('div').class('row wrap').append(
  									Object.entries(property.options||{}).map(entry => option(...entry))
  								)
  							)
  						);
  						return this;
  					},
  				},
          select: {
            get textvalue() {
              return 'ja';
            },
            view(property) {
              // console.log(this.textvalue, this.property.options, this.property.value);
  						$('div')
              .parent(this.selector)
              .class(
                'row prop', this.format || this.type || '',
                this.property.name,
              )
              .append(
  							$('label').ttext(this.title),
								$('span')
                .class(
                  'aco pre wrap',
                  this.className,
                  // data.some(data => data.SrcID == ID) ? 'ownprop' : '',
                  // data.some(data => data.SrcID != ID) ? 'srcprop' : '',
                )
                .displayvalue(this.property.name)
                .item(this.property.item, this.name + 'view')
                // .html(this.displayvalue),
  						)
  					},
            createInput() {
              console.log(this.textvalue);
  						this.elInp = this.elEdit.createElement('select', 'inp row aco', { item: this.item, name: this.name });
  						this.elEdit.createElement('LABEL', '', this.title || this.name);
  						let selected = [];
  						let value = this.value || this.defaultvalue || '';
  						// //console.log(value);
  						if (this.type === 'array') {
  							this.elInp.setAttribute('multiple', '');
  							selected = value ? String(value).split(',') : [];
  							// //console.log(selected);
  						}
  						if (Object.prototype.toString.call(this.options) === '[object Array]') {
  							for (var i = 0, optionvalue; optionvalue = this.options[i]; i++) {
  								var optionElement = this.elInp.createElement('option', '', optionvalue, { value: optionvalue, selected: selected.includes(optionvalue) });
  							}
  						} else {
  							for (let [optionName, option] of Object.entries(this.options)) {
  								// //console.log(selected, option.value);
  								var optionElement = this.elInp.createElement('option', '', typeof option === 'object' ? option.title || optionName : option, { value: optionName });
  								if (selected.includes(optionName)) {
  									optionElement.setAttribute('selected', '');
  								}
  							}
  						}
  						//this.elInp.value = 'pe';
  						// //console.debug(this.value, this);
  						this.elInp.addEventListener('change', e => {
  							this.value = [...e.target.options].filter(option => option.selected).map(option => option.value).join(',');
  							//console.log(this.value);
  							// //console.log(e, [...e.target.options].filter(option => option.selected).map(option => option.value).join(','), e.target.value);
  							// this.elInp.value = [...e.target.options].filter(option => option.selected).map(option => option.value).join(',');
  							// // e.target.value = e.target.
  							// //console.log(this.elInp.value);
  						}, true);
  						// this.elInp.value = '1,2';
  						this.elInp.value = this.value;
  					},
            edit() {
              console.log(this.value, this.property);
              this.selector.append(
  							$('div').class('row prop input',this.format || this.type || '',this.property.name).append(
  								this.input = $('select')
                  .class(
                    'inp focus aco',
                    this.className,
                  )
                  .id(this.name)
                  .name(this.name)
                  .placeholder(' ')
                  .attr(this.property)
  								.attr(this.attributes)
                  .append(
                    Object.entries(this.property.options||{}).map(([optionName,option])=>$('option').value(optionName).text(option.title).selected(optionName === this.value ? 'JA': null))
                  )
                  // .value(this.value)
  								.on('change', e => {
                    console.log(e.target, e.target.value);
                    this.property.value = e.target.value;
                  }),
  								$('label').class('row aco').ttext(this.title || this.name).attr('for', this.name),
  								$('i').attr('pattern', this.attributes ? this.attributes.pattern : null),
  							)
  						)
  					},
  				},
          selectitem: {
            view() {
  						const property = this.property;
  						const data = {};//[].concat(this.property.item.data[property.name]).shift();
              // console.log(this.name, this.property.item.data, this.property.item.Master);
  						$('div').parent(this.selector)
  						.class('row prop', this.format || this.type || '', this.property.name)
  						.append(
  							$('label').ttext(property.title),
                $('span').itemLink(data)
  						)
  					},
  					edit() {
  						const property = this.property;
              const items = [...$.props.values()]
              .unique()
              .filter(item => item instanceof Item)
              .filter(item => this.schema && (this.schema === '*' || this.schema.includes(item.schemaName)));
  						const listElement = $.his.listElement = $.his.listElement || $('datalist')
              .parent(document.body)
              .id('listitems')
              .on('updateList', e => {
                listElement.text('');
                const value = e.detail.value.toLowerCase();
                // console.log('updateList', e.detail, schemaName, finditems);
                e.detail.items
                .filter(item => item.header0.toLowerCase().includes(value))
                .forEach(item => $('option').parent(listElement).text(item.subject).value(item.header0 === item.tag ? item.header0 : item.header0 + ' ' + item.tag))
              });
              // console.log(this.selector, selector);
              selector.append(
  							$('div').class('col prop', property.format, property.name).append(
  								this.inputElem = $('input').class('inp')
                  .value(this.oldValue = this.value)
                  .name(this.name)
                  .autocomplete('none')
                  .placeholder(' ')
                  .attr('list', 'listitems')
                  .attr(property)
                  .on('drop', e => {
                    let data = (e.dataTransfer || e.clipboardData).getData("aim/items");
                    if (data) {
                      e.stopPropagation();
                      e.preventDefault();
                      data = JSON.parse(data);
                      const linkitem = data.value[0];
                      // console.log(item, this.property.item);
                      // return;
                      if (linkitem) {
                        this.property.item.attr(this.name, {
                          AttributeID: this.data ? this.data.AttributeID : null,
                          LinkID: linkitem.ID,
                        }, true).then(item => {
                          console.log('updated');
                          // this.inputElem.value($(linkitem).header0);
                          item.details(true).then(item => $('view').show(item, true));
                        })
                      }
                      // console.log(item, $(item));
                    }
                  })
                  .on('change', e => {
                    this.oldValue = e.target.value;
                    const [tag] = e.target.value.match(/\b[\w_]+\(\d+\)/);
                    if (tag) {
                      const item = items.find(item => item.tag === tag);
                      if (item) {
                        this.value = {
                          LinkID: item.ID,
                        }
                      }
                    }
                  })
                  .on('keyup', e => {
                    //console.log(e.type);
                    if (this.oldValue === e.target.value) return;
                    const value = this.oldValue = e.target.value;
                    listElement.emit('updateList', {value: e.target.value, items: items});
                    if (this.request) return;
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                      return;
                      this.request = $().api(`/${attribute.schema}`)
                      .select('Title')
                      .search(inputElement.value)
                      .top(20)
                      .get()
                      .then(result => {
                        $.his.listElement.updateList(property.schema, value, this.request = null);
                      });
                    },500);
                  }),
  								$('label').text(property.title || property.name),
  							),
  						);
  					},
  				},
          sharecam: {
  					createInput: function() {
  						//console.log('SHARE CAM', this);
  						this.wall = this.item.tag;
  						this.client = $.access.sub;
  						new Chat(this, this.elEdit);
  					},
  				},
          skype: {
  				},
          tel: {
						type: 'tel',
						pattern: '[0-9]{10,11}',
  				},
          text: {
						type: 'text',
  				},
          textarea: {
  					view() {
  						return;
  						this.selector.createElement('DIV', ['row prop check',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['SPAN', '', this.value],
  						]);
  					},
  					edit() {
  						function resize (e) {
  							e.target.style.height = '0px';
  							e.target.style.height = (e.target.scrollHeight + 24) + 'px';
  						}
  						return;
  						let el = this.selector.createElement('DIV', ['col input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['TEXTAREA', 'inp', {value: this.value, onkeyup: resize }],
  						]);
  					},
  				},
          url: {
  				},
          yaml: {
  					view() {
  						this.selector.createElement('DIV', ['row prop check',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['SPAN', '', this.value],
  						]);
  					},
  					edit() {
  						function resize (e) {
  							e.target.style.height = '0px';
  							e.target.style.height = (e.target.scrollHeight + 24) + 'px';
  						}
  						let el = this.selector.createElement('DIV', ['col input',this.property.format,this.property.name].join(' '), [
  							['LABEL', '', this.property.title || this.property.name],
  							['TEXTAREA', 'inp', {value: this.value, onkeyup: resize }],
  						]);
  					},
  				},
          bedieningen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', e => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: aimClient.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // e => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
          besturingen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', e => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: aimClient.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // e => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
          autonoom_processen: {
            view() {
              return this.selector.append(
                $('div').class('col').append(
                  $('button').class('abtn')
                  .ttext(this.property.title || this.property.name)
                  // .click(this.property.item[this.name].bind(this.property.item))
                  .on('click', e => {
                    console.log(this.property.item.tag);
                    $().send({
                      // to: { aud: aimClient.access.aud },
                      path: `/${this.property.item.tag}/${this.name}()`,
                      method: 'post',
                      // forward: $.forward || $.WebsocketClient.socket_id,
                    })
                  })
                  // e => {
                  //   console.log(this.property.item, this.name, this.property.item[this.name]);
                  //   // property.item.handVerkeerslichtenGedoofd.call(property.item);
                  // })
                )
              );
            },
            edit() {
              return this.view();
            },
          },
  			};
  			const path = parent.path();
  			const isForm = path.some(elem => elem.tagName === 'FORM');
  			let legend = '';
  			let lastLegend = '';
        for (let [name, property] of Object.entries(properties)) {
          // console.log('properties', name, property);
          function Property () {
            if (!property) return;
            this.property = property;
            this.selector = selector;
            this.name = name;
            // if (this.enum && !this.options) {
            // 	if (Array.isArray(this.enum)) {
            // 		this.options = this.enum;
            // 	} else if (typeof this.enum === 'object') {
            // 		this.options = this.enum;
            // 		this.enum = Object.keys(this.options);
            // 		if (this.enum.length === 2 && Object.values(this.options).filter(Boolean).length === 1) {
            // 			this.format = 'checkbox';
            // 		}
            // 	}
            // }
            // if (this.options && !this.enum) {
            // 	this.enum = Object.keys(this.options);
            // 	// property.format = property.format || 'radio';
            // }
            if (this.schema) {
              this.format = 'selectitem';
            }
            if (!this.format) {
              if (this.enum && this.type !== 'array') {
                this.format = this.enum.length > 4 ? 'select' : 'radio';
              }
            }
            if (!this.type) {
              if (this.enum) {
                this.type = this.enum.some(v => typeof v === 'string') ? 'string' : 'number';
              }
            }
            if (property.stereotype) {
              property.format = property.format || property.stereotype;
              property.legend = property.legend || __(property.stereotype);
            }
            Object.assign(this, property, format.default, format[this.type], format[this.format]);
            this.placeholder = this.placeholder || ' ';
            this.data = this.item ? this.item.data[name] : {};
            this.title = this.title || this.name;
            legend = this.legend = property.legend || legend;
            if (this.property.item) {
              const ID = this.property.item.ID;
              const data = [].concat(this.data, this.item);
              // console.log('CLASSNAME', data);
              this.ownprop = data.some(data => data && data.Value && data.SrcID && data.SrcID == ID );
              this.srcprop = data.some(data => data && data.Value && data.SrcID && data.SrcID != ID);
              this.className = [
                this.ownprop ? 'ownprop' : '',
                this.srcprop ? 'srcprop' : '',
              ].join(' ')
              // console.log('CLASSNAME', this.name, this.className, data, this);
            }
            // console.log(333, name, this.property);
            if (isForm) {
              if (elem.elements[this.property.name]) return;
              this.showDetails().edit();
              if (this.autofocus && this.input) {
                setTimeout(() => this.input.focus(),500);
              }
            } else if (this.displayvalue !== null || ['bediening','besturing','autonoom_proces'].includes(property.stereotype)) {
              if (property.type === 'hidden') return;
              this.showDetails().view();
            }
          }
          Property.prototype = Object.create(property, {
            displayvalue: {
              get() {
                return $.attr.displayvalue(this.value, property);
              },
            },
          });
          new Property();
        }
      });
			return this;
		},},
    qr: { value: function (selector, context) {
      const elem = this.elem;
      const src = scriptPath.replace(/src/, 'dist') + '/js/qrcode.js';
      importScript(src).then(e => {
        new QRCode(elem, selector);
        if (elem.tagName === 'IMG') {
          elem.src = elem.firstChild.toDataURL("image/png");
          elem.firstChild.remove();
        }
      });
      return this;
		},},
    remove: { value: function (selector) {
      if (selector) {
        if (this.elem.hasAttribute(selector)) {
          this.elem.removeAttribute(selector)
        } else {
          (this.elem || this.selector).removeEventListener(...arguments);
        }
      } else {
        this.elem.remove()
      }
      return this;
    },},
    resizable: { value: function () {
      this.class('resizable');
      const table = this.elem;
      const row = table.getElementsByTagName('tr')[0];
      if (!row) return;
      const cols = [...row.children];
      cols.forEach(elem => {
        $('i').parent(elem).class('resizer').on('mousedown', function (e) {
          let pageX,curCol,nxtCol,curColWidth,nxtColWidth;
          table.style.cursor = 'col-resize';
          curCol = e.target.parentElement;
          nxtCol = curCol.nextElementSibling;
          pageX = e.pageX;
          let padding = paddingDiff(curCol);
          curColWidth = curCol.offsetWidth - padding;
          if (nxtCol) {
            nxtColWidth = nxtCol.offsetWidth - padding;
          }
          function mousemove (e) {
            if (curCol) {
              let diffX = e.pageX - pageX;
              if (nxtCol)
              clearTimeout(to);
              to = setTimeout(() => {
                // nxtCol.style.width = (nxtColWidth - (diffX))+'px';
                curCol.style.width = (curColWidth + diffX)+'px';
              }, 100);
            }
          }
          function mouseup (e) {
            table.style.cursor = '';
            curCol = nxtCol = pageX = nxtColWidth = curColWidth = undefined;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
          }
          document.addEventListener('mousemove', mousemove);
          document.addEventListener('mouseup', mouseup);
        });
        elem.style.width = elem.offsetWidth + 'px';
      });
      table.style.tableLayout = 'fixed';
      let to;
      function paddingDiff(col){
        if (getStyleVal(col,'box-sizing') == 'border-box') {
          return 0;
        }
        var padLeft = getStyleVal(col,'padding-left');
        var padRight = getStyleVal(col,'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));
      }
      function getStyleVal(elm,css){
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
      }
    },},
    sample: { value: function (selector, sample) {
			const htmlScript = `
			<html>
			<head>
			<link rel="stylesheet" href="https://aliconnect.nl/v1/api/css/web.css" />
			<script src="https://aliconnect.nl/v1/api/js/aim.js"></script>
			<style><!-- style --></style>
			<script><!-- script --></script>
			</head>
			<body>
			</body>
			`;
			const head = `<script src="/v1/api/js/aim.js"></script><script src="/v1/api/js/web.js"></script>`;
			function codeJs (f) {
				let content = String(f);
				content = String(content).replace(/^(.*?)\{|\}$/g,'').split(/\n/);
				let ident = content.filter(line => line.trim());
				if (ident.length) {
					ident = ident[0].search(/\S/);
					content = content.map(line => line.substr(ident));
				}
				// //console.log(content);
				return content.join('\n').trim();
			}
			//console.log(selector);
      const ref = {};
      sample.template = sample.template || htmlScript;
      // const elemHtml = $('td', 'code');
      if (sample.type === 'iframe') {
				this.elem.append(
 					$('table').append(
	          $('tr').append(
	            $('th', '', 'script'),
	            $('th', '', 'iframe'),
	          ),
	          $('tr').append(
	            $('td', 'code', $().toHtml(codeJs(sample.script), 'js')),
	            $('td').append(sampleBody = $('iframe')),
	          ),
					),
        );
        const doc = sampleBody.elem.contentWindow.document;
        const html = sample.template.replace(/<\!-- script -->/, script);
        doc.open();
        doc.write(html);
        doc.close();
      } else {
        ref.table = $('table').append(
          $('tr').append(
            $('th', '', 'script'),
            $('th', '', 'div'),
          ),
          $('tr').append(
            $('td', 'code', $().toHtml(codeJs(sample.script), 'js')),
            $('td').append(sampleBody = $('div')),
          ),
        );
        document._body = sampleBody.elem;
        //console.log(document._body);
        sample.script();
        document._body = null;
      }
			this.elem.append(
				$('h1', '', selector),
			);
			return this;
		},},
		scrollIntoView: { value: function (options = { block: "nearest", inline: "nearest" }) {
			this.elem.scrollIntoView(options);
			return this;
		},},
    script: { value: function (src) {
			return $.promise('script', resolve => $('script').src(src).parent(this).on('load', resolve))
		},},
    _select: { value: function (e) {
			const elem = this.elem;
			const setOpen = open => {
				//console.log('setOpen', open, elem);
				open = Number(open);
				$(elem).attr('open', open);
				if (elem.label) {
					var foldersOpen = $.his.cookie.foldersOpen
					? $.his.cookie.foldersOpen.split(', ').filter(x => x !== elem.label)
					: [];
					if (open) {
						foldersOpen.push(elem.label);
					}
					$.his.cookie = {
						foldersOpen: foldersOpen.join(', ')
					};
				}
				if (open) {
					if (elem.onopen && !elem.loaded) {
						elem.loaded = elem.onopen();
					}
				} else {
					if (elem.onclose) {
						elem.onclose();
					}
				}
			};
			if (!elem.label) {
				// //console.log('elementSelect', elem);
				for (var par = elem.parentElement; par; par = par.parentElement) {
					if (!['UL', 'LI'].includes(par.tagName)) {
						break;
					}
				}
				[...par.getElementsByTagName('A')].forEach(el => {
					if (el.hasAttribute('open') && el !== elem) {
						if (el.hasAttribute('selected')) {
							el.removeAttribute('selected');
						}
						if (el.getAttribute('open') === '1') {
							el.setAttribute('open', 0);
						}
					}
				});
				for (var el = elem.parentElement; el; el = el.parentElement) {
					[el, el.firstChild].forEach(el => {
						if (['A','DIV'].includes(el.tagName) && el.getAttribute && el.getAttribute('open') === '0' && el !== elem) {
							el.setAttribute('open', 1);
						}
					});
				}
			}
			if (e && e.type === 'click' && elem.tagName === 'A') {
				if (elem.href && elem.href.match(/#(\w)/)) {
					return;
				}
				if (elem.hasAttribute('selected')) {
					if (elem.getAttribute('open') === '1') {
						return setOpen(0);
					}
				}
			} else {
				if (elem.getAttribute('open') === '1') {
					return setOpen(0);
					// for (var el = elem.nextElementSibling; el && el.tagName != elem.tagName; el = el.nextElementSibling) {
					// 	el.style.display = 'none';
					// }
				}
			}
			if (elem.getAttribute('open') === '0') {
				return setOpen(1);
				// for (var el = elem.nextElementSibling; el && el.tagName != elem.tagName; el = el.nextElementSibling) {
				// 	el.style.display = '';
				// }
			}
			elem.setAttribute('selected', '');
			elem.scrollIntoViewIfNeeded(false);
			// //console.log('OPEN', elem.label);
			return this;
		},},
    seperator: { value: function (pos) {
			const ZINDEX = 6;
			const selector = this;
			const elem = selector.elem;
			let targetElement;
			function start(e) {
				if (e.which === 1) {
					if (!e) e = window.event;
					e.stopPropagation();
					e.preventDefault();
					window.getSelection().removeAllRanges();
					targetElement = elem.hasAttribute('right') ? elem.nextElementSibling : elem.previousElementSibling;
					elem.clientX = e.clientX;
					selector.css('left', elem.moveX = 0).css('z-index', 300).attr('active', '');
					document.addEventListener("mouseup", checkmouseup, true);
					document.addEventListener("mousemove", doresizeelement, true);
				}
			};
			function doresizeelement(e) {
				selector.css('left', (elem.moveX = e.clientX - elem.clientX) + 'px');
			};
			function checkmouseup (e) {
				document.removeEventListener('mousemove', doresizeelement, true);
				document.removeEventListener('mouseup', checkmouseup, true);
				$(targetElement).css('max-width', (targetElement.offsetWidth + (elem.hasAttribute('right') ? -elem.moveX : elem.moveX)) + 'px');
				$().storage(targetElement.id + '.width', targetElement.style.maxWidth);
				// //console.log(targetElement.id + 'Width', targetElement.style.maxWidth);
				selector.css('left', elem.moveX = 0).css('z-index', ZINDEX).attr('active', null);
			};
			selector
			.attr(pos, '')
			// .class('seperator')
			.class('seperator noselect')
			.on('mousedown', start)
			.css('z-index',ZINDEX);
			return this;
		},},
    set: { value: function () {
      return this.map.set(...arguments);
    },},
    show: { value: function (item, doEdit) {
      // TODO: wijzig rechten
      // var edit = !Number(this.userID) || this.userID == $.auth.sub;
      item.details().then(e => {
        // console.log(item);
        ItemSelected = item;
        this.item = item;
        document.title = item.header0;
        $().ga('send', 'pageview');
        // if (item.data.Id) {
        //   const url = new URL(document.location);
        //   url.searchParams.set('id', item.data.Id);
        //   $.his.replaceUrl(url.toString());
        //
        //   // $.his.replaceUrl(document.location.origin+document.location.pathname.replace(/\/id\/.*/,'')+'/id/'+item.data.Id+document.location.search)
        // }
        function logVisit() {
          console.debug('logVisit');return; // DEBUG:
          if (item.data.ID) {
            clearTimeout($.his.viewTimeout);
            $.his.viewTimeout = setTimeout(() => {
              aimClient.api('/').query('request_type','visit').query('id',item.data.ID).get().then(result => {
                $.his.items[item.data.ID] = new Date().toISOString();
              })
            },1000);
          }
        }
        item.data.fav = [
          {
            '@id': '/Contact(265090)',
            LinkID: 265090,
            Value: 'Max van Kampen',
            AttributeID: 1,
          },
          {
            '@id': '/Contact(265091)',
            LinkID: 265091,
            Value: 'Text Alicon',
            AttributeID: 1,
          },
        ];
        const fav = [].concat(item.data.fav).map(item => $(item));
        const isFav = fav.some(item => item === $.user);
        function users() {
          return;
          // TODO: Item Users
          fieldsElement.createElement('DIV', 'row users', [
  					__('To') + ': ',
  					['DIV', 'row aco', userElement],
  				]);
          if (Array.isArray(this.Users)) {
  					this.Users.forEach((row)=>{
  						userElement.push(['A', 'c ' + row.ID, row.Value || ($.getItem(row.tag) ? $.getItem(row.tag).Title : row.ID), {
  							// onclick: Web.Element.onclick,
  							href: '#'+row.tag,
  							// id: row.ID,
  							// innerText: row.Value || ($.getItem(row.tag] ? $.getItem(row.tag].Title : row.ID),
  						}], ';\u00A0');
  					});
  				}
        }
        function printmenu() {
          return;
          // TODO:
          //if (this.printmenu) for (var menuname in this.printmenu) {
          //	menuitem = this.printmenu[menuname];
          //	menuitem.name = menuname;
          //	menuitem.id = this.id;
          //	//menuitem.href = this.href;
          //	menuitem.item = this;
          //	//// //console.debug('MENU ITEM ', menuname);
          //	break;
          //	//// //console.debug('menuitem href', menuitem.href);
          //	//if (this.ref) this.printmenu[menuname].href = this.href+'/'+
          //	if (!menuitem.href) this.printmenu[menuname].onclick = menuitem.ref ? $.url.objbyref(menuitem.ref).e : function(e) {
          //		if (this.menuitem.object) {
          //			if (window[this.menuitem.object]) window[this.menuitem.object].onload(this.menuitem.id);
          //			else window[this.menuitem.script] = document.body.createElement('script', { src: this.menuitem.script, menuitem: this.menuitem, onload: function() { window[this.menuitem.object].onload(this.menuitem.id) } });
          //			return false;
          //		}
          //		if (this.menuitem.href) return true;// document.location.href = this.menuitem.href;
          //		this.menuitem.post = this.menuitem.post || {};
          //		this.menuitem.get = this.menuitem.get || {};
          //		this.menuitem.get.name = this.menuitem.name;
          //		this.menuitem.get.Title = this.menuitem.Title;
          //		this.menuitem.get.id = this.menuitem.id;
          //		//// //console.debug('MENUITEM PRINT', this.menuitem.post, this.menuitem.src);
          //		//if ($.url.byref())
          //		new $.HttpRequest({
          //			menuitem: this.menuitem,
          //			item: this.menuitem.item,
          //			api: this.menuitem.api ? this.menuitem.api : rpt ? this.menuitem.item.class.name + '/' + this.menuitem.id + '/' + this.menuitem.rpt + '.html' : null,
          //			src: this.menuitem.src,
          //			post: this.menuitem.post,
          //			get: this.menuitem.get,
          //			onload: $.Docs.onload
          //		});
          //	};
          //}
        }
        this.showMessages = e => {
          let date;
          let time;
          let author;
          aimClient.api(`/${item.tag}/Messages`)
          .top(100)
          .select('schemaPath,BodyHTML,CreatedDateTime,CreatedByID,CreatedByTitle,files')
          .get()
          .then(body => {
            console.log(body, aimClient.access.sub);
            let el;
            this.messagesElem.text('').append(
              $('summary').text('Messages'),
              $('div').class('oa').append(
                body.value.map(message => {
                  const dt = new Date(message.data.CreatedDateTime);
                  const messageDate = dt.toLocaleDateString();
                  const messageTime = dt.toLocaleTimeString().substr(0,5);
                  const messageAuthor = message.data.CreatedByID;
                  return el = $('div').class('msgbox row', aimClient.access.sub == message.data.CreatedByID ? 'me' : '').append(
                    $('div').append(
                      $('div').class('small').append(
                        author === messageAuthor ? null : $('span').class('author').text(author = messageAuthor),
                        date === messageDate ? null : $('span').text(date = messageDate),
                        time === messageTime ? null : $('span').text(time = messageTime),
                        $('i').class('icn del').on('click', e => {
                          e.target.parentElement.parentElement.remove();
                          message.delete();
                        }),
                      ),
                      $('div').class('body').html(message.BodyHTML || 'Empty'),
                    ),
                  )
                })
              )
            );
            el.scrollIntoView();
          })
        };
        logVisit();
        const itemdata = {};
        let properties;
        function breakdown_data() {
          return aimClient.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(body => {
            const data = body.value;
            let items = [];
            (function row(item, level) {
              item.level = level;
              item[item.schemaPath] = item.header0;
              items.push(item);
              data.filter(child => child.data.MasterID === item.ID).forEach(item => row(item, level+1))
            })(data.find(child => child.ID == item.data.ID), 1);
            const schemaNames = items.map(item => item.schemaPath).unique();
            const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
            const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
            // properties = ['ID', 'level','schemaPath','schemaName','header0','header1','header2'].concat(...schemas.map(([schemaName, schema]) => schemaName), ...schemas.map(([key, schema]) => Object.keys(schema.properties))).unique();
            const schema_values = {};
            items.forEach(item => {
              let value = '';
              schemaKeys.forEach(schemaName => {
                if (value) {
                  item[schemaName] = schema_values[schemaName] = null;
                } else if (item.schemaPath === schemaName) {
                  value = item[schemaName] = schema_values[schemaName] = item.header0;
                } else {
                  item[schemaName] = schema_values[schemaName];
                }
              })
            });
            return items;
          });
        }
        function build_map(fn) {
          if (itemdata.build_map) {
            $('list').text('').append($('div').text('Generate document'));
            setTimeout(() => fn(itemdata.build_map));
          } else {
            $('list').text('').append($('div').text('Loading data'));
            aimClient.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(body => {
              const data = body.value;
              let items = [];
              (function row(item, level) {
                item.level = level;
                item[item.schemaPath] = item.header0;
                items.push(item);
                data.filter(child => child.data.MasterID === item.ID).forEach(item => row(item, level+1))
              })(data.find(child => child.ID == item.data.ID), 1);
              const schemaNames = items.map(item => item.schemaPath).unique();
              const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
              const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
              // properties = ['ID', 'level','schemaPath','schemaName','header0','header1','header2'].concat(...schemas.map(([schemaName, schema]) => schemaName), ...schemas.map(([key, schema]) => Object.keys(schema.properties))).unique();
              const schema_values = {};
              items.forEach(item => {
                let value = '';
                schemaKeys.forEach(schemaName => {
                  if (value) {
                    item[schemaName] = schema_values[schemaName] = null;
                  } else if (item.schemaPath === schemaName) {
                    value = item[schemaName] = schema_values[schemaName] = item.header0;
                  } else {
                    item[schemaName] = schema_values[schemaName];
                  }
                })
              });
              fn(itemdata.build_map = items);
            });
          }
        }
        function linkElem(link) {
          const elem = $('span').itemLink(link).append(
            $('button')
            .type('button')
            .on('click', e => {
              e.preventDefault();
              e.stopPropagation();
              elem.remove();
              item.elemTo.emit('change');
            })
          );
          return elem;
        }
        const to = [].concat(item.data.to||[]);

        // console.debug('item.properties', item, item.properties); // DEBUG:

        this.text('').append(
          $('nav').class('row top abs btnbar np').append(
            this.schema === 'Company' ? $('button').class('abtn shop').on('click', e => $.shop.setCustomer.bind(this)) : null,
            $('button').class('abtn refresh r').on('click', e => item.details(true).then(item => $('view').show(item))),
            $('button').class('abtn view').append($('ul').append(
              $('li').class('abtn dashboard').text('Dashbord').on('click', e => this.showDashboard()),
              $('li').class('abtn slide').text('Slideshow').on('click', e => {
                var el = document.documentElement, rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                rfs.call(el);
                $.show({ sv: this.item.id });
              }),
              $('li').class('abtn model3d').text('Build 3D Model').on('click', e => {
                const elem = $('div').parent($('list')).class('col abs').append(
                  $('div').class('row top abs btnbar').append(
                    $('button').class('abtn icn r refresh').on('click', e => this.rebuild() ),
                    $('button').class('abtn icn close').on('click', e => elem.remove()),
                  ),
                  this.three = $('div').class('col aco').three(
                    this.init = three => (this.rebuild = e => aimClient.api('/'+item.tag).query('three', '').get().then(three.build))()
                  ),
                );
              }),
              $('li').class('abtn network').text('Netwerk').on('click', e => {
                (function init() {
                  const elem = $('div').parent($('list')).class('col abs').append(
                    $('div').class('row top abs btnbar').append(
                      $('button').class('abtn icn r refresh').on('click', e => {
                        elem.remove();
                        init();
                      }),
                      $('button').class('abtn icn close').on('click', e => elem.remove()),
                    ),
                  );
                  aimClient.api(`/${item.tag}`).query('request_type','build_link_data').get().then(
                    body => $('div').class('col aco').parent(elem).style('background:white;').modelDigraph(body)
                  );
                })();
              }),
              !this.srcID ? null : $('li').class('abtn showInherited').attr('title', 'Toon master-class').on('click', e => {
                items.show({ id: this.item.srcID })
              }),
              !this.srcID ? null : $('li').class('abtn clone').attr('title', 'Overnemen class eigenschappen').on('click', e => {
                this.setAttribute('clone', 1, { post: 1 })
              }),
              //revert: { disabled: !this.srcID, Title: 'Revert to inherited', item: this, onclick: function() { this.item.revertToInherited(); } },
              // $('li').class('abtn sbs').text('SBS').on('click', e => {}),
              // $('li').class('abtn').text('Api key').href(`api/?request_type=api_key&sub=${item.ID}`),
              $('li').class('abtn').text('Api key').on('click', e => {
                aimClient.api('/').query('request_type', 'api_key').query('expires_after', 30).post({
                  sub: item.ID,
                  aud: item.ID
                }).get().then(body => {
                  $('dialog').open(true).parent(document.body).text(body);
                  console.log(body);
                })
              }),
              // $('li').class('abtn').text('Secret JSON Unlimited').attr('href', `api/?request_type=secret_json&release&sub=${this.ID}&aud=${$.auth.access.aud}`),
              // $('li').class('abtn doc').text('Breakdown').click(e => build_map(items => $().list(items))),
              $('li').class('abtn doc').text('Breakdown').on('click', e => {
                $().list([]);
                aimClient.api(`/${item.tag}`).query('request_type', 'build_breakdown').get().then(body => {
                  const data = body.value;
                  console.log(data);
                  const topitem = data.find(child => child.ID == item.data.ID);
                  const items = [];
                  (function build(item, tagname) {
                    console.log(item);
                    // if (!item) return;
                    items.push(item);
                    item.data.Tagname = tagname = (tagname ? tagname + '.' : '') + (item.data.Prefix || '') + (item.data.Tag || item.data.Name || '');
                    item.data.children = data
                    .filter(child => child.data.MasterID == item.data.ID)
                    .sort((a,b) => String(a.data.idx||'').localeCompare(b.data.idx||'', undefined, {numeric: true}))
                    .map(child => build(child, tagname));
                    return item;
                  })(topitem);
                  items.forEach(item => {
                    if (item.data && item.data.link) {
                      const link = item.data.link.shift();
                      const linkItem = $(link.LinkID);
                      item.data.LinkTagname = linkItem.data.Tagname;
                      linkItem.data.LinkTagname = item.data.Tagname;
                      // item.data.Linktagname = $(item.data.link.shift().LinkID).data.Tagname;
                    }
                  });
                  // items.sort((a,b) => (a.data.Tagname || '').localeCompare(b.data.Tagname || ''));
                  return $().list(items);
                });
              }),
              $('li').class('abtn doc').text('Doc').on('click', e => {
                (async function init() {
                  const elem = $('div').parent($('list')).class('col abs').append(
                    $('div').class('row top abs btnbar').append(
                      $('button').class('abtn icn r refresh').on('click', e => {
                        elem.remove();
                        init();
                      }),
                      $('button').class('abtn icn close').on('click', e => elem.remove()),
                    ),
                  );
                  breakdown_data().then(e => {
                    const items = e.body.value;
                    console.log(items);
                    const topitem = items.find(child => child.ID == item.data.ID);
                    function chapter(item, level) {
                      // console.log(item.schema, item.schemaPath);
                      // const schemaName = item.schemaPath.split(':').pop();
                      const properties = Object.entries(item.schema.properties)
                      .filter(([propertyName, property])=> item[propertyName])
                      .map(([propertyName, property])=> $('li').class('prop').append(
                        $('label').text(propertyName+': '),item[propertyName],
                      ));
                      return [
                        $('h'+level).text(item.header0),
                        // $('div').text('inleiding'),
                        $('ul').append(properties),
                      ].concat(...items.filter(child => child.data.MasterID === item.ID).map(item => chapter(item, level+1)));
                    }
                    $('div').parent(elem).class('row doc aco').append(
                      (this.docElem = $('div')).class('aco doc-content counter oa').append(
                        chapter(topitem, 1)
                      ),
                      $('div').class('mc-menu right np oa').append(
                        $('div').class('ac-header').text('Table of contents'),
                        $('ul').index(this.docElem)
                      ),
                    )
                  });
                })();
              }),
              // $('li').class('abtn download').text('Data JSON').attr('href', `api/?request_type=data_json&id=${this.ID}`),
              $('a').class('abtn download').text('config_data').href(`https://dms.aliconnect.nl/system/build?response_type=config_data&id=${item.data.ID}&download`),
              $('a').class('abtn download').text('data_v1').href(`https://dms.aliconnect.nl/system/build?response_type=data_v1&id=${item.data.ID}&download`),
            )),
            $('button').class('abtn msg').attr('cnt', item.data.Messages ? item.data.Messages.length : 0).on('click', this.showMessages),
            $('button').class('abtn send').on('click', e => {
              new $.HttpRequest($.config.$, 'GET', `/${this.item.schema}(${this.item.id})?mailing`, e => {
                // //console.debug(this.responseText);
                alert(this.responseText);
              }).send();
              return false;
            }),
            $('button').class('abtn fav').attr('checked', isFav).on('click', e => e => this.fav ^= 1),
            $('button').class('abtn edit').name('edit').on('click', e => this.edit(item)).append(
              $('ul').append(
                // $('li').class('row').append(
                //   $('a').class('aco abtn share').text('share').href('#?prompt=share'),
                // ),
                $('li').class('abtn share').text('share').on('click', e => e.stopPropagation()).on('click', e => aim.prompt('share_item')),
                $('li').class('abtn read').text('readonly').attr('disabled', '').on('click', e => e.stopPropagation()),
                $('li').class('abtn public').text('public').on('click', e => this.scope = 'private').on('click', e => e.stopPropagation()),
                $('li').class('abtn private').text('private').on('click', e => this.scope = 'public').on('click', e => e.stopPropagation()),
                $('li').class('abtn upload mailimport').text('Importeer mail uit outlook')
                // .attr('hidden', !$.Aliconnector.connected)
                .on('click', e => external.Mailimport())
                .on('click', e => e.stopPropagation()),
                $('li').class('abtn clone').text('clone').on('click', e => item.clone()),
                $('li').class('abtn del').text('delete').on('click', e => item.delete()),
              ),
            ),
            $('button').class('abtn popout').on('click', e => {
              const rect = this.elem.getBoundingClientRect();
              item.popout(window.screenX+rect.x, window.screenY+rect.y+window.outerHeight-window.innerHeight, rect.width, rect.height)
            }),
            $('button').class('abtn close').name('close').on('click', e => {
              this.text('');
              delete ItemSelected;
              $.his.replaceUrl(document.location.pathname.replace(/\/id\/.*/,'')+'?'+document.location.search);
            }),
          ),
          this.header(item),
          this.main = $('main')
          .class('aco oa')
          .on('dragover', e => {
            e.preventDefault();
          })
          .on('drop', e => {
            e.stopPropagation();
            const eventData = e.dataTransfer || e.clipboardData;
            const type = $.his.keyEvent && $.his.keyEvent.shiftKey ? 'link' : e.type;
            if (data = eventData.getData("aim/items")) {
              data = JSON.parse(data);
              data.type = data.type || (e.ctrlKey ? 'copy' : 'cut');
              //console.log('ja1', data.value, data.value.length);
              data.value.forEach(link => {
                link = Item.get(link.tag);
                console.log(([].concat(item.data.link).shift()||{}).AttributeID);
                item.attr('link', {
                  AttributeID: e.ctrlKey ? null : ([].concat(item.data.link).shift()||{}).AttributeID,
                  LinkID: link.data.ID,
                  max: 999,
                  type: e.ctrlKey ? 'append' : '',
                }, true)
                .then(item => item.details(true).then(item => $('view').show(item)));
              });
              //console.log('DROP', data.value);
            } else if (eventData.files) {
              e.preventDefault();
              [...eventData.files].forEach(item.elemFiles.appendFile)
            }
          })
          .append(
            item.elemTo = $('div')
            .class('row editlinks to')
            .text('to:')
            .on('change', e => {
              const items = [...e.target.getElementsByTagName('A')].map(e=>e.item);
              items.filter(item => !to.find(to => to.LinkID == item.ID)).forEach(to => item.to = { LinkID: to.ID });
              to.filter(to => !items.find(item => to.LinkID == item.ID)).forEach(to => item.to = { AttributeID: to.AttributeID, LinkID: null, Value: null });
            })
            .on('drop', e => {
              e.preventDefault();
              e.stopPropagation();
              const eventData = e.dataTransfer || e.clipboardData;
              const type = $.his.keyEvent && $.his.keyEvent.shiftKey ? 'link' : e.type;
              if (data = eventData.getData("aim/items")) {
                data = JSON.parse(data);
                data.type = data.type || (e.ctrlKey ? 'copy' : 'cut');
                data.value.forEach(item => e.target.is.append(linkElem(item)));
                e.target.is.emit('change')
              }
            })
            .append(to.map(linkElem)),
            item.elemFiles = $('div').files(item, 'Files'),
          )
          .properties(item.properties),
          this.messagesElem = $('details').class('message-list').attr('open', 1),
          $('form').class('message-new col msgbox')
          .on('keydown', e => {
            if (e.keyPressed === 'Enter') {
              e.preventDefault();
              e.target.dispatchEvent(new Event('submit'));
            }
          })
          .on('submit', e => {
            e.preventDefault();
            let html = this.msgElem.elem.innerHTML.replace(/<p><br><\/p>/g,'');
            if (!html) return;
            e.target.BodyHTML.value = html;
            this.msgElem.elem.innerHTML = '<p><br></p>';
            aimClient.api(`/${item.tag}/Messages`).post(e.target).then(body => this.showMessages());
            return false;
          })
          .append(
            // $().files(),
            $('input').type('hidden').name('BodyHTML'),
            $('input').type('hidden').name('masterId').value(this.id),
            $('div').class('row aco msgbox').append(
              this.msgElem = $('div').class('aco').html('<p><br></p>').placeholder('Write message or add attachements').htmledit(),
              $('div').class('row np').append(
                $('button').class('abtn send').type('submit'),
                $('button').class('abtn image').type('button').attr('accept', 'image/*').on('click', e => {}),
                $('button').class('abtn image').type('button').attr('accept', '').on('click', e => {}),
              )
            )
          )
        );
        // console.log('FILES',item, item.data.files);
        //
        //
        // if (item.data.files) {
        //   JSON.parse(item.data.files).forEach(item.elemFiles.appendFile)
        // }
        // return console.log('SHOW', item);
        $.clipboard.setItem([item], 'selected', '');
        let link;
        if (item.data.link) {
          // console.log(item.data.link);
          link = [].concat(item.data.link).map(link => Object.assign(link, {item: $(link)}));
          this.main.append(link.map(link => link.item.schemaName).unique().map(
            schemaName => $('details')
            .class('col')
            .open(localStorage.getItem('detailsLink'))
            .on('toggle', e => localStorage.setItem('detailsLink', e.target.open))
            .append(
              $('summary').text(schemaName),
              $('div')
              .class('row editlinks')
              .append(
                link.filter(link => link.item.schemaName === schemaName).map(
                  link => $('span').itemLink(link).append(
                    $('button')
                    .type('button')
                    .on('click', e => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.attr('link', {
                        AttributeID: link.AttributeID,
                        LinkID: null,
                        Value: null,
                      }, true)
                      .then(item => item.details(true).then(item => $('view').show(item)));
                    })
                  )),
                )
              )
          ));
        }
        if (item.onloadEdit = item.onloadEdit || doEdit) {
  				return this.edit(item);
  			}
      });
      return this;
    },},
    showpage: { value: function (item) {
      item.details().then(item => {
        $('list').text('').append(
          this.elemDiv = $('div').class('aco col').append(
            $('h1').text(item.header0),
            $('div').text(item.header1),
            $('div').html(item.BodyHTML||''),
          )
        );
        aimClient.api(`/${item.tag}/children`).select('*').get().then(async body => {
          console.log(body);
          this.elemDiv.append(
            (await item.children).map(item => $('div').append(
              $('h2').text(item.header0),
              $('div').text(item.header1),
              $('div').html(item.BodyHTML||''),
            ))
          );
        });
      })
    },},
    showMenuTop: { value: async function (item) {
      const children = await item.children;
      if (this.webpage = children.find(item => item instanceof Webpage)) {
        aimClient.api(`/${this.webpage.tag}/children`).query('level', 3).get().then(async body => {
          $.his.elem.menuList = $('ul').parent(this.elem);
          function addChildren(elem, item, level) {
            if (Array.isArray(item.data.Children)) {
              item.data.Children.forEach(data => {
                const item = $(data);
                const elemLi = $('li').parent(elem);
                $('a').parent(elemLi).text(item.header0).on('click', e => {
                  e.stopPropagation();
                  $.his.elem.menuList.style('display:none;');
                  $('view').showpage(item);
                });
                if (level < 3) {
                  addChildren($('ul').parent(elemLi), item, level + 1);
                }
              });
            }
          }
          addChildren($.his.elem.menuList, this.webpage, 1);
          this.on('mouseenter', e => $.his.elem.menuList.style(''))
        });
      }
    },},
    showLinks: { value: function (item) {
			aimClient.api(`/${item.tag}`).query('request_type','build_link_data').get().then(body => {
				//console.log(e.body);
				$('div').style('display:block;width:100%;height:400px;background:white;border:solid 1px red;')
				.attr('height',400)
				.width(400)
				.parent(this.main)
				// .modelLinks(e.body)
				// .modelTraverse(e.body)
				.modelDigraph(body)
			});
		},},

    // sort: {
    //   Title: function(a, b) { return String(a.Title.toLowerCase()).localeCompare(String(b.Title.toLowerCase())) },
    //   index: function(a, b) {
    //     if (a.index != undefined && b.index == undefined) return -1;
    //     if (a.index != undefined && b.index == undefined) return 1;
    //     if (a.index > b.index) return 1;
    //     if (a.index < b.index) return -1;
    //     return 0;
    //   },
    //   id: function(a, b) {
    //     if (a.id < b.id)
    //     return -1;
    //     if (a.id > b.id)
    //     return 1;
    //     return 0;
    //   },
    //   filter: function(a, b) {
    //     if (a.cnt > 0 && b.cnt == 0) return -1;
    //     if (a.cnt == 0 && b.cnt > 0) return 1;
    //     return a.value.localeCompare(b.value, {}, 'numeric');
    //   },
    //   value: function(a, b) {
    //     var va = (isNaN(a.value)) ? a.value.toLowerCase() : a.value;
    //     var vb = (isNaN(b.value)) ? b.value.toLowerCase() : b.value;
    //     if (va < vb) return -1;
    //     if (va > vb) return 1;
    //     return 0;
    //   },
    //   prijs: function(a, b) {
    //     if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
    //     return -1;
    //     if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
    //     return 1;
    //     return 0;
    //   },
    //   prijsLaagHoog: function(a, b) {
    //     if (Number(isnull(a.field.Prijs.Value, 0)) < Number(isnull(b.field.Prijs.Value, 0)))
    //     return -1;
    //     if (Number(isnull(a.field.Prijs.Value, 0)) > Number(isnull(b.field.Prijs.Value, 0)))
    //     return 1;
    //     return 0;
    //   },
    //   prijsHoogLaag: function(a, b) {
    //     if (Number(isnull(a.field.Prijs.Value, 0)) < Number(isnull(b.field.Prijs.Value, 0)))
    //     return 1;
    //     if (Number(isnull(a.field.Prijs.Value, 0)) > Number(isnull(b.field.Prijs.Value, 0)))
    //     return -1;
    //     return 0;
    //   },
    //   nameAz: function(a, b) {
    //     if ((a.field.Name.Value || '').toLowerCase() < (b.field.Name.Value || '').toLowerCase())
    //     return -1;
    //     if ((a.field.Name.Value || '').toLowerCase() > (b.field.Name.Value || '').toLowerCase())
    //     return 1;
    //     return 0;
    //   },
    //   nameZa: function(a, b) {
    //     if ((a.field.Name.Value || '').toLowerCase() < (b.field.Name.Value || '').toLowerCase())
    //     return 1;
    //     if ((a.field.Name.Value || '').toLowerCase() > (b.field.Name.Value || '').toLowerCase())
    //     return -1;
    //     return 0;
    //   },
    //   prijsdesc: function(a, b) {
    //     if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
    //     return 1;
    //     if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
    //     return -1;
    //     return 0;
    //   },
    //   idx1: function(a, b) {
    //     if (a.index < b.index)
    //     return -1;
    //     if (a.index > b.index)
    //     return 1;
    //     return 0;
    //   },
    //   az: function(a, b) {
    //     if (isnull(a.Name, '') < isnull(b.Name, ''))
    //     return 1;
    //     if (isnull(a.Name, '') > isnull(b.Name, ''))
    //     return -1;
    //     return 0;
    //   },
    //   za: function(a, b) {
    //     if (isnull(a.Name, '') < isnull(b.Name, ''))
    //     return -1;
    //     if (isnull(a.Name, '') > isnull(b.Name, ''))
    //     return 1;
    //     return 0;
    //   },
    //   cntdn: function(a, b) {
    //     if (a.cnt < b.cnt)
    //     return 1;
    //     if (a.cnt > b.cnt)
    //     return -1;
    //     return 0;
    //   },
    // },

    // statusbar: { value: function () {
    //   $.his.elem.statusbar = this.class('row statusbar np').append(
    //     ['ws','aliconnector','http','is_checked','clipboard','pos','source','target','main']
    //     .map(name => this[name] = $('span').class(name)),
    //   );
    //   this.progress = $('progress').parent(this.main.class('aco'));
    //   return this;
    // },},
    setProperty: { value: function (selector, context) {
      this.elem.style.setProperty('--'+selector, context);
      return this;
    },},
    slider: { value: function (element){
      console.error('SLIDER');
  		const elements = [...document.getElementsByClassName('aimage')].filter(elem => elem.is.has('ofile'));
      let imageNr = elements.indexOf(element);
  		elements.forEach(element => { if (element.pause) element.pause() });
  		// let imageNr = 0;
      this.show = element => {
        const elem = element.is;
        const ofile = elem.get('ofile') || {};
        const src = ofile.src;
        console.log(imageNr, elements.length, src);
        this.titleElem.text(
          element.alt,
          ofile.lastmodifieddate ? new Date(ofile.lastmodifieddate).toLocaleString(): null,
  				ofile.size ? ofile.size + 'kB': null,
  			);
  			if (this.srcElem) {
  				this.srcElem.remove();
  			}
        this.scrollPlay = () => {
          this.srcElem.elem.currentTime = frameNumber;
          //window.requestAnimationFrame(scrollPlay);
        };
        if (ofile.src.match(/jpg|png|bmp|jpeg|gif|bin/i)) {
          this.srcElem = $('img')
          .parent(this.containerElem)
          .class(element.className)
          .src(ofile.src)
        } else if (ofile.src.match(/3ds/i)) {
          this.srcElem = $('div')
          .parent(this.containerElem)
          .class(element.className)
          .tds({src:ofile.src, hasControls: true})
        } else if (ofile.src.match(/mp4|webm|mov/i)) {
          frameNumber = 0;
          this.srcElem = $('video')
          .parent(this.containerElem)
          .class(element.className)
          .src(ofile.src)
          .controls('')
          .autobuffer('')
          .preload('')
          .autoplay('')
          .on('click', e => {
            if (!this.srcElem.elem.paused) {
              this.srcElem.elem.pause();
              frameNumber = this.srcElem.elem.currentTime;
            } else {
              this.srcElem.elem.play();
            }
          })
          .on('wheel', e => {
            if (!this.srcElem.elem.paused) {
              this.srcElem.elem.pause();
              frameNumber = this.srcElem.elem.currentTime;
            }
            frameNumber += e.deltaY / 1000;
            window.requestAnimationFrame(this.scrollPlay);
          });
          window.requestAnimationFrame(this.scrollPlay);
          // this.srcElement.onended = e => {
          // 	this.next();
          // };
        }
      };
      this.prior = e => {
        console.warn(imageNr, elements.length);
        this.show(elements[imageNr = imageNr ? imageNr - 1 : elements.length - 1]);
  		};
  		this.next = e => {
        console.warn(imageNr, elements.length);
  			this.show(elements[imageNr = imageNr < elements.length - 1 ? imageNr + 1 : 0]);
  		};
  		const onkeydown = e => {
  			if (e.code === "ArrowLeft") {
          e.stopPropagation(e.preventDefault(this.prior(e)))
        } else if (e.code === "ArrowRight") {
          e.stopPropagation(e.preventDefault(this.next(e)))
        } else if (e.code === "Escape") {
          e.stopPropagation(e.preventDefault(this.closeSlider(e)))
        }
  		};
  		document.addEventListener('keydown', onkeydown, true);
  		this.closeSlider = e => {
  			document.removeEventListener('keydown', onkeydown, true);
  			this.sliderElem.remove();
  			// this.elem = null;
  		};
      this.sliderElem = $('div')
      .class('imageSlider')
      .parent(this.elem)
      .on('click', e => e.stopPropagation())
      .append(
        $('div').class('row top').append(
          $('button').class('abtn icn close abs').on('click', this.closeSlider),
          this.titleElem = $('div').class('aco'),
        ),
        this.containerElem = $('div').class('Image').append(
          $('div').class('sliderButton prior').on('click', this.prior).append(
            $('span'),
          ),
          $('div').class('sliderButton next').on('click', this.next).append(
            $('span'),
          ),
        ),
      );
  		// swipedetect(divElement, swipedir => {
  		// 	if (swipedir === 'left') next();
  		// 	else if (swipedir === 'right') prior();
  		// });
      this.show(element);
    },},
    text: { value: function (value) {
			if (arguments.length) {
        this.elem.innerText = [].concat(...arguments).join(' ');
        return this;
			}
      return this.elem.innerText;
		},},
    tds: { value: function (options = {}) {
      var container, controls;
      var camera, scene, renderer;
      container = this.elem;
      // console.log(this.elem, this.width(), this.height());
      // container.style = 'width:120px;';
      const width = this.width() || container.offsetWidth;
      const height = this.height() || container.offsetHeight;
      // console.log([...document.getElementsByTagName('SCRIPT')].find(s => s.src === '/lib/three/examples/js/controls/TrackballControls.js'));
      (async () => {
        await importScript('three/build/three.js');
        await importScript('three/examples/js/controls/TrackballControls.js');
        await importScript('three/examples/js/loaders/TDSLoader.js');
        console.log(container.offsetWidth, container.offsetHeight);
        camera = new THREE.PerspectiveCamera( 60, width / height, 0.1, 10 );
        camera.position.z = 2;
        scene = new THREE.Scene();
        scene.add( new THREE.HemisphereLight() );
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 2 );
        scene.add( directionalLight );
        //3ds files dont store normal maps
        // var loader = new THREE.TextureLoader();
        // // var normal = loader.load( '/lib/three/examples/models/3ds/portalgun/textures/normal.jpg' );
        // var normal = loader.load( '/shared/upload/normal.jpg' );
        var loader = new THREE.TDSLoader( );
        // loader.setResourcePath( '/lib/three/examples/models/3ds/portalgun/textures/' );
        // loader.setResourcePath( '/shared/upload/' );
        // loader.load( '/lib/three/examples/models/3ds/portalgun/portalgun.3ds', function ( object ) {
        loader.load( options.src, function ( object ) {
          // object.traverse( function ( child ) {
          //
          // 	if ( child.isMesh ) {
          //
          // 		child.material.normalMap = normal;
          //
          // 	}
          //
          // } );
          scene.add( object );
        } );
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setSize( width, height );
        this.append( renderer.domElement );
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        // console.log(window);
        $(window).on('resize', resize, false).emit('resize');
        setTimeout(() => {
          renderer.render( scene, camera );
        },200);
        if (options.hasControls) {
          animate();
        }
        // requestAnimationFrame( animate );
        // animate();
      })();
			function resize() {
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize( width, height );
			}
			function animate() {
				controls.update();
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
      return this;
    },},
    treelist: { value: function (){
			if (!Array.isArray(par.treelist)) return;
			var treelist = treelist || {};
			par.treelist.sort($.sort.index);
			par.treelist.forEach(row => {
				var elLI = el.createElement('LI', 'col', treelist.li || {
					onmouseenter: e => elLI.hasAttribute('open') ? elLI.setAttribute('open', 1) : null,
					onmouseleave: e => elLI.hasAttribute('open') ? elLI.setAttribute('open', 0) : null,
					onclick: e => elLI.hasAttribute('open') ? elLI.setAttribute('open', 0) : null,
					draggable: 1
				});
				var elA = elLI.createElement('A', { href: `#${row.tag}`, href: '#/id/' + btoa(row['@id']), innerText: row.Title, });
				row.Children = row.Children || row.items;
				if (row.Children && row.Children.length) {
					elLI.setAttribute('open', treelist.opendefault || 0);
					elLI.createElement('UL', 'bg', {open: 1, treelist: row.Children});
				}
			});
		},},
    ttext: { value: function (value){
      this.elem.innerText = [].concat(...arguments).map(s => __(s)).join(' ');
			return this;
		},},
    toggle: { value: function () {
			this.open(!this.open());
      return this;
    },},
    toHtml: { value: function () {
			return web.html(...arguments);
		},},
    type: { value: function (){
			return this.attr('type', ...arguments);
		},},
    openLinkInIframe: { value: function (src) {
      return this.append(
        this.iframePanelElem = $('div').class('col aco iframe').append(
          $('div').class('row top').append(
            $('button').class('abtn download').href(src).download().target("_blank"),
            $('button').class('abtn print').on('click', e => this.iframeElem.elem.contentWindow.print()),
            $('button').class('abtn close').on('click', e => this.iframePanelElem.remove()),
          ),
          this.iframeElem = $('iframe').class('aco').src(src),
        )
      );
    },},
    openHtmlInIframe: { value: function (html) {
      this.append(
        this.iframePanelElem = $('div').class('col aco iframe').append(
          $('div').class('row top').append(
            $('button').class('abtn download').href(src).download().target("_blank"),
            $('button').class('abtn print').on('click', e => this.iframeElem.elem.contentWindow.print()),
            $('button').class('abtn close').on('click', e => this.iframePanelElem.remove()),
          ),
          this.iframeElem = $('iframe').class('aco'),
        )
      );
      const doc = this.iframeElem.elem.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      return this;
    },},
    window: { value: function (e) {
			this.url = apiorigin + "/" + $.config.$.domain + "/" + $.version + "/app/form/?select*&schema=" + this.schema + "&id=" + (this.detailID || this.id) + (this.uid ? "&uid=" + this.uid : "");
			if ($.his.handles[this.url]) {
				$.his.handles[this.url].focus();
			}
			else {
				$.his.handles[this.url] = window.open(this.url, this.url, 'width=600, height=800, left=' + (e.screenX || 0) + ', top=' + (e.screenY || 0));
				$.his.handles[this.url].name = this.url;
				$.his.handles[this.url].onbeforeunload = function() { $.his.handles[this.name] = null };
			}
		},},
		sampleWindow: { value: function (url) {
			const height = 600;
			const width = 1200;
			let rect = document.body.getBoundingClientRect();
			let top = window.screenTop + window.innerHeight - height + 50 - 20;
			let left = window.screenLeft + window.innerWidth - width - 20;
			return window.open(url, 'sample', `top=${top},left=${left},width=${width},height=${height},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`);
		},},
		tileboard: { value: function (menuname) {
			if (menuname) return ($.$.menu.items[menuname]) ? $.tileboard.call($.$.menu.items[menuname]) : null;
			if (this.el) return $.elBrd.appendChild(this.el);
			with (this.el = $.elBrd.createElement('DIV', 'col aco start aimitems')) {
				with (createElement('DIV', 'row')) {
					for (var menuname in this.items) {
						var menuitem = this.items[menuname];
						if (menuitem) {
							with (menuitem.elTegel = createElement('DIV', { className: 'col card' })) {
								menuitem.get = menuitem.get || { bv: menuname };
								createElement('DIV', { className: 'row bgd' }).createElement('A', {
									name: menuname, className: 'row aco abtn icn ' + menuitem.className, innerText: menuitem.Title, menuitem: menuitem,
									par: menuitem.get,
									onclick: Element.onclick,
									//href: '#' + $.url.stringify(menuitem.get || { bv: menuname })
								});
								if (menuitem.showbody) menuitem.showbody();
								for (var itemname in menuitem.items) {
									var item = $.$.menu.items[itemname];
									if (item) {
										item.elLink = createElement('DIV', { className: 'row bgd' }).createElement('A', {
											name: itemname, className: 'row aco abtn icn ' + item.className, innerText: item.Title, menuitem: item,
											//par: { mn: this.name },
											par: item.get,
											onclick: Element.onclick,
											//href: '#' + $.url.stringify({ mn: itemname })
										});
										if (item.showtitle) item.showtitle();
									}
								}
							}
						}
					}
					for (var i = 0; i < 4; i++) createElement('DIV', { className: 'card ghost' });
				}
			}
		},},
    panel: { value: function (parent) {
      return this.parent(parent || $('list')).class('col abs').append(
        this.elemBar = $('div').class('row top abs btnbar').append(
          $('span').class('aco'),
          $('button').class('abtn close').on('click', e => this.elem.remove()),
        ),
        this.elemMain = $('main').class('aco oa'),
      );
      // return this.parent($('list')).class('col abs').append(
      //   this.elemBar = $('div').class('row top abs btnbar').append(
      //     $('span').class('aco'),
      //     $('button').class('abtn close').on('click', e => this.elem.remove()),
      //   ),
      //   this.elemMain = $('main').class('aco oa'),
      // );
    },},
	});
  [
    'parentElement',
    'nextSibling'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    get() {
      return this.elem[name] ? this.elem[name].is : null;
    },
  }));
  [
    'default',
    'autoplay'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function attr() {
      return this.attr(name, '');
    }
  }));
  Object.defineProperties(Elem.prototype, {
    query:{value(selector, fn){ fn($(this.elem.querySelector(selector))); return this;}},
    querySelector:{value(){return $(this.elem.querySelector(...arguments))}},
    querySelectorAll:{value(){return Array.from(this.elem.querySelectorAll(...arguments)).map($)}},
  });

  [
    'focus',
    'select',
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function fn() {
      // console.log(name, typeof this.elem[name]);
      this.elem[name](...arguments);
      // if (typeof this.elem[name] === 'function'){
      //   this.elem[name](...arguments);
      // }
      return this;
    }
  }));
  [
    'draggable'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function attrTrue() {
      return this.attr(name, true);
    }
  }));
  [
    'checked',
    'disabled',
    'hasChildren',
    'selected'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function attrIfTrue(value) {
      return this.attr(name, value ? '' : null)
    }
  }));
  [
    'accept',
    'accesskey',
    'action',
    'align',
    'allow',
    'alt',
    'async',
    'autocapitalize',
    'autocomplete',
    'autofocus',
    'background',
    'bgcolor',
    'border',
    'buffered',
    'capture',
    'challenge',
    'charset',
    'cite',
    // 'class',
    // 'code',
    'codebase',
    'color',
    'cols',
    'colspan',
    'content',
    'contenteditable',
    // 'contextmenu',
    'controls',
    'coords',
    'crossorigin',
    'csp',
    'data',
    'datetime',
    'decoding',
    'defer',
    'dir',
    'dirname',
    // 'displayvalue',
    'download',
    'enctype',
    'enterkeyhint',
    'for',
    'form',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'headers',
    'height',
    'hidden',
    'high',
    'href',
    'hreflang',
    'hotkey',
    'icon',
    // 'id',
    'importance',
    'integrity',
    'intrinsicsize',
    'inputmode',
    'ismap',
    'itemprop',
    'keytype',
    'kind',
    'label',
    'lang',
    'language',
    'loading',
    // 'list',
    'loop',
    'low',
    'manifest',
    'max',
    'maxlength',
    'minlength',
    'media',
    'method',
    'min',
    'multiple',
    'muted',
    'name',
    'novalidate',
    // 'open',
    'optimum',
    'pattern',
    'ping',
    'placeholder',
    'poster',
    'preload',
    'radiogroup',
    'readonly',
    'referrerpolicy',
    'rel',
    'required',
    'reversed',
    'rows',
    'rowspan',
    'sandbox',
    'scope',
    'scoped',
    'shape',
    'size',
    'sizes',
    'slot',
    'span',
    'spellcheck',
    'src',
    'srcdoc',
    'srclang',
    'srcset',
    'start',
    'step',
    'style',
    'summary',
    'tabindex',
    'target',
    // 'tag',
    'title',
    'translate',
    // 'type',
    'usemap',
    'value',
    'width',
    'wrap'
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function attrValue() {
      return this.attr(name, ...arguments);
    }
  }));
  [
    'click',
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function exec() {
      this.elem[name](...arguments);
      return this;
    }
  }));
  [
    'submit',
  ].forEach(name => Object.defineProperty(Elem.prototype, name, {
    enumerable: false,
    value: function emit() {
      this.emit(name, ...arguments);
      return this;
    }
  }));

  function Om() {
    const om = this;
    function construct(selector) {
      console.log('a')
      // this.selector = selector;
      const elem = this.elem;
      const self = this;
      this.menu = {
        items: {
          previous: {
            class: 'previous',
            text: 'previous',
            hotkey: 'Up',
            key: 'ArrowUp',
            on: {
              click: e => this.setFocusElement(this.getPreviousElement(e), e),
            },
          },
          next: {
            class: 'next',
            text: 'next',
            hotkey: 'Down',
            key: 'ArrowDown',
            on: {
              click: e => this.setFocusElement(this.getNextElement(e), e),
            },
          },
          selectUp: {
            class: 'previous',
            text: 'Select previous',
            hotkey: 'Shift+Up',
            key: 'shift_ArrowUp',
            on: {
              click: e => this.setFocusElement(this.getPreviousElement(e), e),
            },
          },
          selectDown: {
            class: 'next',
            text: 'Select next',
            hotkey: 'Shift+Down',
            key: 'shift_ArrowDown',
            on: {
              click: e => this.setFocusElement(this.getNextElement(e), e),
            },
          },
          moveUp: {
            class: 'moveup',
            text: 'Move up',
            hotkey: 'Ctrl+Up',
            key: 'ctrl_ArrowUp',
            on: {
              click: e => this.moveUp(e),
            },
          },
          moveDown: {
            class: 'movedown',
            text: 'Move down',
            hotkey: 'Ctrl+Down',
            key: 'ctrl_ArrowDown',
            on: {
              click: e => this.moveDown(e),
            },
          },
        }
      };
      elem.addEventListener('click', e => {
        if (e.itemElement) {
          self.setFocusElement(e.itemElement, e);
        }
      }, true);
      $(elem).extend({
        cancel(e) {},
        onkeydown(e) {
          clearTimeout(self.arrowTimeout);
          if (document.activeElement === document.body) {
            const str = e.keybuffer.join('').trim();
            if (str) {
              const listItems = [...elem.getElementsByClassName('item')];
              const elementFind = listItems.find(elem => elem.is.item() && String(elem.is.item().header0) && String(elem.is.item().header0).toLowerCase().includes(str));
              if (elementFind) {
                self.setFocusElement(elementFind, e);
              }
            }
          }
        },
      });
    }
    function getOffsetElement(offset, e) {
      // console.log('getOffsetElement', e);
      const focusElement = e && e.target && e.target.is && e.target.is.srcEvent ? e.target.is.srcEvent.path.find(el => el.item) : this.focusElement;
      // if (e) this.focusElement = e.path.find(el => el.item);
      const listElements = [...this.elem.getElementsByClassName('item')].filter(el => el.tagName !== 'I');
      for (var index = listElements.indexOf(focusElement) + offset, elem; elem = listElements[index]; index+=offset) {
        if (elem.offsetParent !== null) {
          break;
        }
      };
      return elem;
    }
    function getPreviousElement(e) {
      return this.getOffsetElement(-1, e);
    }
    function getNextElement(e) {
      return this.getOffsetElement(1, e);
    }
    function move(e, offset) {
      // console.log(e.target.parentElement);
      console.log(e.target.parentElement);
      const itemElem = e.path.find(el => el.item);
      this.setFocusElement(itemElem);
      if (this.focusElement) {
        e.preventDefault();
        e.stopPropagation();
        const parent = this.focusElement.parentElement.item;
        const index = [...this.focusElement.parentElement.children].indexOf(this.focusElement) - 1;
        // this.focusElement.item.attr('Master', {
        //   action: 'move',
        //   LinkID: parent.ID,
        //   Data: index + offset,
        // }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
        $.link({
          name: 'Master',
          item: this.focusElement.item,
          to: parent,
          // current: parent,
          index: index + offset,
          action: 'move',
        })
        .then(item => {
          console.log('move done', item, item.elemTreeLi.elem);
          this.setFocusElement(item.elemTreeLi.elem);
        });
        // }).then(item => this.setFocusElement(e.target.parentElement)item.elemTreeLi.elemTreeDiv.scrollIntoView());
      }
    }
    function moveUp(e) {
      this.move(e, -1);
    }
    function moveDown(e) {
      this.move(e, 1);
    }
    function setFocusElement(newFocusElement, e) {
      // console.log('setFocusElement', newFocusElement, e);
      const elem = this.elem;
      const list = [...elem.getElementsByClassName('item')].filter(elem => elem.item);
      if (e) {
        e.preventDefault();
      }
      // console.log('FOCUS', newFocusElement, this.focusElement);
      if (newFocusElement && newFocusElement !== this.focusElement) {
        if (e && e.shiftKey) {
          e.stopPropagation();
          elem.multiSelectStartElement = elem.multiSelectStartElement || newFocusElement;
          const startIndex = list.indexOf(elem.multiSelectStartElement);
          const thisIndex = list.indexOf(newFocusElement);
          const [firstIndex,lastIndex] = thisIndex > startIndex ? [startIndex,thisIndex] : [thisIndex,startIndex];
          const all = list.slice(firstIndex,lastIndex+1);
          $.clipboard.setItem(all.map(elem => $(elem).item()), 'checked', '');
        } else {
          if (e && e.ctrlKey) {
            e.stopPropagation();
          } else {
            elem.multiSelectStartElement = newFocusElement;
            // //console.log(newFocusElement);
            if (newFocusElement) {
              $(newFocusElement).emit('focusselect');
              if (newFocusElement.item) {
                $.clipboard.setItem([newFocusElement.item], 'checked', '');
              }
            }
            // const e = window.event;
            // elem.arrowTimeout = setTimeout(() => setSelectElement(this.focusElement), e.type === 'keydown' ? 200 : 0);
          }
        }
        if (this.focusElement && this.focusElement.removeAttribute) {
          this.focusElement.removeAttribute('focus');
        }
        if (newFocusElement instanceof aim.Elem) {
          console.log('Elem', newFocusElement);
        }
        this.focusElement = newFocusElement;
      }
      if (this.focusElement instanceof Element) {
        $(this.focusElement).attr('focus', '');
        if (this.focusElement && this.focusElement.firstChild && this.focusElement.firstChild.focus) {
          $(this.focusElement.firstChild).scrollIntoView();
          setTimeout(() => this.focusElement.firstChild.focus(), 100);
        }
      }
      return this.focusElement;
    }
    function setSelectElement(elem) {
      console.log('setSelectElement', elem);
      // return;
      if (elem && elem.is.item()) {
        const item = elem.is.item();
        $('view').show(item);
        //console.log(item, item.tag, item.header0);
        return;
        if (elem && elem.is.item() && elem !== this.selectElement) {
          // //console.log('SELECT PAGE', elem.is.item());
          this.selectElement = elem;
          $('view').show(elem.is.item());
          // elem.is.item().PageElement();
        }
        return elem;
      }
      // //console.log(arguments.callee.name, ...arguments);
    }
    function selectFocusElement(newFocusElement) {
      if (newFocusElement) {
        //console.log('selectFocusElement', newFocusElement);
        const e = window.event;
        this.setFocusElement(newFocusElement, e);
        clearTimeout(this.arrowTimeout);
        this.arrowTimeout = setTimeout(() => this.setSelectElement(this.focusElement), e.type === 'keydown' ? 200 : 0);
        // $.view()
        return;
        //console.log(arguments.callee.name, newFocusElement);
      }
    }
    function Treeview(selector) {
      console.log('Treeview', selector);
      // Elem.call(this, ...arguments);
      // console.log(111, this.elem);
      this.construct(...arguments);
      console.log(om.navleft);
      const elem = this.elem;
      const self = this;
      Object.assign(Item.prototype, {
        edit() {
          const elem = $('input')
          .parent(this.elemTreeTitle.text(''))
          .class('aco')
          .value(this.header0)
          .on('focus', e => e.stopPropagation())
          .on('change', e => this.header0 = e.target.value)
          .on('blur', e => this.elemTreeLi.emit('change'))
          .on('keydown', e => {
            e.stopPropagation();
            if (['Enter','Escape'].includes(e.key)) {
              $(e.target).emit('blur');
              this.elemTreeDiv.focus();
              e.preventDefault();
            }
          })
          .focus().select()
        },
        close(e) {
          var item = this.item || this;
          // if (item.opened) item.elemTreeLi.elemTreeDiv.setAttribute('open', item.opened = 0);
        },
        focus(e) {
          self.setFocusElement(this.elemTreeLi);
          return;
          //console.warn('FOCUS');
          return;
          // self.focusElement =
          //if (!e) e = window.event;
          //$.setfocus(navtree);
          if (self.focusElement && self.focusElement.elemTreeLi) {
            self.focusElement.elemTreeLi.removeAttribute('focus');
            // $.clipboard.items.push(self.focusElement);
          }
          // $.clipboard.cancel();
          // $.clipboard.items.forEach(function (item) {
          // 	if (!item.elemTreeLi.getAttribute('checked')) {
          // 		item.elemTreeLi.removeAttribute('checked');
          // 	}
          // });
          // $.targetItem = $.selectEndItem = self.focusItem = this;
          if (!e || e.type !== 'mousemove') {
            $.scrollIntoView(self.focusElement.elemTreeLi.elemTreeDiv.elem);
          }
          if (self.focusElement.elemTreeLi) {
            self.focusElement.elemTreeLi.setAttribute('focus', '');
            //if (!e) return;
            // if (e && e.shiftKey) {
            //   $.clipboard.items = [this];
            //   var selactive = 0;
            //   [...elem.getElementsByTagName('LI')].forEach(listItemElement => {
            //     if (listItemElement.item === $.selectStartItem) {
            //       selactive ^= 1;
            //       if ($.clipboard.items.indexOf(listItemElement.item) === -1) {
            //         $.clipboard.items.push(listItemElement.item);
            //       }
            //     }
            //     if (listItemElement.item === $.selectEndItem) {
            //       selactive ^= 1;
            //       if ($.clipboard.items.indexOf(listItemElement.item) === -1) {
            //         $.clipboard.items.push(listItemElement.item);
            //       }
            //     }
            //     if (selactive && $.clipboard.items.indexOf(listItemElement.item) === -1) {
            //       $.clipboard.items.push(listItemElement.item);
            //     }
            //   });
            //   $.clipboard.items.forEach(listItemElement => {
            //     listItemElement.elemTreeLi.setAttribute('checked', '');
            //   });
            // } else if (e && e.ctrlKey) {
            //   $.clipboard.items.push(this);
            //   $.clipboard.items.forEach(listItemElement => {
            //     listItemElement.elemTreeLi.setAttribute('checked', '');
            //   });
            // } else {
            //   $.clipboard.items = [this];
            //   $.selectStartItem = $.selectEndItem;
            // }
          }
          // //console.error($.clipboard);
        },
        setSelect(e) {
          this.focus();
          if (this.selectedElement) {
            this.selectedElement.removeAttribute('selected');
          }
          if (this.elemTreeLi) {
            (this.selectedElement = this.elemTreeLi).setAttribute('selected', '');
          }
        },
        select(e) {
          $('view').show(this);
          $().list(this.children);
          return;
          //console.log(this, e);
          this.setSelect();
          $.attr(this, 'treeselect', '');
          document.location.href = `#/${this.tag}/children/id/${btoa(this['@id'])}?$select=${$.config.listAttributes}&$filter=FinishDateTime+IS+NULL`;
          // document.location.href = `#/id/${btoa(this['@id'])}?$select=${LIST_ATTRIBUTES}&$filter=FinishDateTime+IS+NULL`;
          // //console.log('JA', btoa(this['@id']));
          // document.location.href = `#/id/${btoa(this['@id'])}`;
        },
        close(e) {
          if (this.elemTreeLi.elemTreeDiv) {
            // this.elemTreeLi.elemTreeDiv.setAttribute('open', 0);
            self.openItemsSave();
          }
        },
        async open(e) {
          return self.open(this);
        },
      });
      $(elem).extend({
        close() {
          $(document.body).attr('tv', 0);
        },
        // cancel() {
        // 	// //console.log('cancel', self.editItem);
        // 	if (self.editItem) {
        // 		self.editItem.createTreenode();
        // 		self.editItem = null;
        // 	}
        // 	return;
        // 	// if (e) return this.item.editclose();
        // 	delete Treeview.elFocus;
        // 	return;
        // 	//this.loaded = false;
        // 	// document.getElementById('ckeTop').style = "display:none;";
        // 	// document.body.appendChild(document.getElementById('ckeTop'));
        // 	if ($.pageEditElement && $.pageEditElement.parentElement === colpage) {
        // 		$.pageEditElement.remove();
        // 	}
        // 	if ($.elCover) $.his.body.removeChild($.elCover);
        // 	//if ($.elPc) $.elPc.innerText = '';
        // },
        selitems: function () {
          //var items = [];
          $.clipboard.items.forEach(function (item) {
            $.clipitems.push(item);
            e.elemTreeLi.setAttribute('checked', e.type);
          });
        },
        keydown: {
          // Space: e => {
          // 	if (document.activeElement === document.body) {
          // 		if (self.focusElement) {
          // 			self.focusElement.item.select();
          // 		}
          // 		e.preventDefault();
          // 	}
          // },
          ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),//.focusElement ? this.focusElement.previousElementSibling : null, e),
          shift_ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),//this.focusElement ? this.focusElement.previousElementSibling : null, e),
          ArrowDown: e => this.setFocusElement(this.getNextElement(), e),//this.focusElement ? this.focusElement.nextElementSibling : null, e),
          shift_ArrowDown: e => this.setFocusElement(this.getNextElement(), e),//this.focusElement ? this.focusElement.nextElementSibling : null, e),
          shift_alt_ArrowDown: e => this.moveDown(e),
          shift_alt_ArrowUp: e => this.moveUp(e),
          ctrl_ArrowDown: e => this.moveDown(e),
          ctrl_ArrowUp: e => this.moveUp(e),
          ArrowLeft(e) {
            if (self.focusElement) {
              const item = self.focusElement.item;
              if (item.elemTreeLi.elemTreeDiv.attr('open') == 1) {
                item.elemTreeLi.elemTreeDiv.attr('open', 0);
              } else if (item.master) {
                item.master.focus();
              }
            }
          },
          ArrowRight(e) {
            return;
            // //console.log('ArrowRight', self.focusElement);
            if (self.focusElement) {
              const item = self.focusElement.item;
              // //console.log('ArrowRight', elem.keydown, elem.keydown.ArrowDown);
              //console.log(e, e.target, elem, elem.open);
              if (elem.open) return elem.open = 1;//self.open(item);
              elem.keydown.ArrowDown(e);
              item.select();
            }
          },
          shift_alt_ArrowLeft: e => this.outdent(e),
          shift_alt_ArrowRight: e => this.ident(e),
          ctrl_ArrowLeft: e => this.outdent(e),
          ctrl_ArrowRight: e => this.ident(e),
          ctrl_Delete(e) {
            if (self.focusElement) {
              const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
              self.focusElement.item.delete();
              self.setFocusElement(nextElement);
            }
          },
          ctrl_Backspace(e) {
            if (self.focusElement) {
              const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
              self.focusElement.item.delete();
              self.setFocusElement(nextElement);
            }
          },
          async Enter(e) {
            // toeboegen sibling
            if (document.activeElement === document.body && self.focusElement) {
              const focusItem = self.focusElement.item;
              // indien listitem niet geselcteerd, dan selecteren
              if (!self.focusElement.hasAttribute('treeselect')) {
                return focusItem.select();
              }
              const schemaName = focusItem.schemaName;
              const parentItem = focusItem.master;
              const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
              const item = await parentItem.appendItem(focusItem, {
                schemaName: schemaName,
                Title: schemaName + schemaIndex,
              });
              if (focusItem.isClass) {
                param.srcID = param.masterID = master.id;
              }
              item.focus();
              item.edit();
            }
          },
          // async ctrl_Enter(e) {
          // 	// maak een kopie van het huidige item, idem aan class
          // 	if (document.activeElement === document.body && self.focusElement) {
          // 		const focusItem = self.focusElement.item;
          // 		const schemaName = focusItem.schemaName;
          // 		const parentItem = focusItem.master;
          // 		const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
          // 		const item = await parentItem.appendItem(focusItem, {
          // 			schemaName: schemaName,
          // 			Title: schemaName + schemaIndex,
          // 		});
          // 		const sourceID = focusItem.values.Source ? focusItem.values.Source.LinkID : focusItem.ID;
          // 		item.Source = { LinkID: sourceID };
          // 		item.focus();
          // 		item.edit();
          // 	}
          // },
          async Insert(e) {
            // toevoegen child
            if (document.activeElement === document.body && self.focusElement) {
              e.preventDefault();
              //console.debug('keys.tv.Insert', self.focusElement );
              const parentElement = self.focusElement;
              const parentItem = parentElement.item;
              const schemaName = parentItem.schemaName;
              const childItem = {
                schemaName: schemaName,
                Title: schemaName,
              };
              parentItem.appendItem(null, childItem);
            }
          },
          async ctrl_Insert(e) {
            // toevoegen child derived class
            if (document.activeElement === document.body && self.focusElement) {
              const parentItem = self.focusElement.item;
              const schemaName = parentItem.schemaName;
              const schemaIndex = parentItem.children ? parentItem.children.filter(child => child.schemaName === schemaName).length : 0;
              const item = await parentItem.appendItem(null, {
                schemaName: schemaName,
                Title: schemaName + schemaIndex,
              });
              item.Src = { LinkID: parentItem.ID };
              item.focus();
              item.edit();
            }
          },
        }
      });
      // console.log('Treeview',this);
    }
    Treeview.prototype = {
      construct,
      getOffsetElement,
      getPreviousElement,
      getNextElement,
      move,
      moveUp,
      moveDown,
      setFocusElement,
      setSelectElement,
      selectFocusElement,
      childnode(child) {
        return (child.elemTreeLi = $('details'))
        .open($.his.openItems.includes(child.tag))
        .item(child, 'treeview')
        .on('toggle', async e => {
          // if (!e.target.open) e.target.open = true;
          // e.target.open = !e.target.open;
          // console.warn('TOGGLE', e.target.open);
          // return;
          // e.target.open = true;
          if (e.target.open) {//child.elemTreeLi.open) {
            let children = await child.children || [];
            // console.log(111, children);
            children.sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0 );
            child.elemTreeLi.append(
              children
              .filter(item => !(item.elemTreeLi || this.childnode(item)).elem.contains(child.elemTreeLi.elem) )
              .map(child => child.elemTreeLi || this.childnode(child))
            );
          }
          this.openItemsSave();
        })
        .on('close', e => this.close(child))
        .on('keyup', e => {
          e.preventDefault();
          e.stopPropagation();
        })
        .on('keydown', e => {
          // console.log('kd', e);
          // if (e.target.tagName === 'INPUT') return e.preventDefault();
          const keydown = {
            Space: e => {
              if (this.focusElement) {
                this.focusElement.item.select();
              }
            },
            // ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),//.focusElement ? this.focusElement.previousElementSibling : null, e),
            // shift_ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),//this.focusElement ? this.focusElement.previousElementSibling : null, e),
            // ArrowDown: e => this.setFocusElement(this.getNextElement(), e),//this.focusElement ? this.focusElement.nextElementSibling : null, e),
            // shift_ArrowDown: e => this.setFocusElement(this.getNextElement(), e),//this.focusElement ? this.focusElement.nextElementSibling : null, e),
            // shift_alt_ArrowDown: e => this.moveDown(e),
            // shift_alt_ArrowUp: e => this.moveUp(e),
            // ctrl_ArrowDown: e => this.moveDown(e),
            // ctrl_ArrowUp: e => this.moveUp(e),
            ArrowLeft: e => {
              if (this.focusElement) {
                const item = this.focusElement.item;
                if (this.focusElement.open) {
                  this.focusElement.open = false;
                } else if (this.focusElement.parentElement) {
                  this.setFocusElement(this.focusElement.parentElement);
                }
              }
            },
            // ArrowRight(e) {
            //   return;
            //   // //console.log('ArrowRight', self.focusElement);
            //   if (self.focusElement) {
            //     const item = self.focusElement.item;
            //     // //console.log('ArrowRight', elem.keydown, elem.keydown.ArrowDown);
            //     //console.log(e, e.target, elem, elem.open);
            //     if (elem.open) return elem.open = 1;//self.open(item);
            //     elem.keydown.ArrowDown(e);
            //     item.select();
            //   }
            // },
            //
            ArrowRight: e => {
              e.preventDefault();
              e.stopPropagation();
              if (this.focusElement) {
                this.focusElement.open = true;
              }
              // child.elemTreeLi.elem.open = false;
            },
            ctrl_Enter: e => {
              //console.log('ctrl_Enter', this.focusElement);
              if (this.focusElement) {
                $()
                .copyFrom(this.focusElement.item.source || this.focusElement.item.class, this.focusElement.parentElement.item, this.focusElement.item.index)
                .then(item => setTimeout(()=>{
                  this.setFocusElement(item.elemTreeLi.elem);
                  item.edit();
                }));
              }
            },
            shift_alt_ArrowLeft: e => this.outdent(e),
            shift_alt_ArrowRight: e => this.ident(e),
            ctrl_ArrowLeft: e => this.outdent(e),
            ctrl_ArrowRight: e => this.ident(e),
            ctrl_Delete: e => {
              const nextElement = this.focusElement.nextElementSibling || this.focusElement.previousElementSibling || this.focusElement.parentElement;
              console.log('ctrl_Delete', nextElement, this.focusElement, this.focusElement.parentElement);
              this.focusElement.item.delete().then(item => setTimeout(() => this.setFocusElement(nextElement)));
            },
            Delete: e => {
              const nextElement = this.focusElement.nextElementSibling || this.focusElement.previousElementSibling || this.focusElement.parentElement;
              console.log('DELETE', nextElement);
              $.link({
                name: 'Master',
                item: this.focusElement.item,
                to: null,
                current: this.focusElement.parentElement.item,
                action: 'move',
              }).then(item => this.setFocusElement(nextElement))
            },
            ctrl_Backspace(e) {
              if (self.focusElement) {
                const nextElement = self.focusElement.nextElementSibling || self.focusElement.previousElementSibling || self.focusElement.parentElement.parentElement;
                self.focusElement.item.delete();
                self.setFocusElement(nextElement);
              }
            },
            async Enter(e) {
              // toeboegen sibling
              if (document.activeElement === document.body && self.focusElement) {
                const focusItem = self.focusElement.item;
                // indien listitem niet geselcteerd, dan selecteren
                if (!self.focusElement.hasAttribute('treeselect')) {
                  return focusItem.select();
                }
                const schemaName = focusItem.schemaName;
                const parentItem = focusItem.master;
                const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
                const item = await parentItem.appendItem(focusItem, {
                  schemaName: schemaName,
                  Title: schemaName + schemaIndex,
                });
                if (focusItem.isClass) {
                  param.srcID = param.masterID = master.id;
                }
                item.focus();
                item.edit();
              }
            },
            // async ctrl_Enter(e) {
            // 	// maak een kopie van het huidige item, idem aan class
            // 	if (document.activeElement === document.body && self.focusElement) {
            // 		const focusItem = self.focusElement.item;
            // 		const schemaName = focusItem.schemaName;
            // 		const parentItem = focusItem.master;
            // 		const schemaIndex = parentItem.children.filter(child => child.schemaName === schemaName).length;
            // 		const item = await parentItem.appendItem(focusItem, {
            // 			schemaName: schemaName,
            // 			Title: schemaName + schemaIndex,
            // 		});
            // 		const sourceID = focusItem.values.Source ? focusItem.values.Source.LinkID : focusItem.ID;
            // 		item.Source = { LinkID: sourceID };
            // 		item.focus();
            // 		item.edit();
            // 	}
            // },
            async Insert(e) {
              // toevoegen child
              if (document.activeElement === document.body && self.focusElement) {
                e.preventDefault();
                //console.debug('keys.tv.Insert', self.focusElement );
                const parentElement = self.focusElement;
                const parentItem = parentElement.item;
                const schemaName = parentItem.schemaName;
                const childItem = {
                  schemaName: schemaName,
                  Title: schemaName,
                };
                parentItem.appendItem(null, childItem);
              }
            },
            async ctrl_Insert(e) {
              // toevoegen child derived class
              if (document.activeElement === document.body && self.focusElement) {
                const parentItem = self.focusElement.item;
                const schemaName = parentItem.schemaName;
                const schemaIndex = parentItem.children ? parentItem.children.filter(child => child.schemaName === schemaName).length : 0;
                const item = await parentItem.appendItem(null, {
                  schemaName: schemaName,
                  Title: schemaName + schemaIndex,
                });
                item.Src = { LinkID: parentItem.ID };
                item.focus();
                item.edit();
              }
            },
            F2: e => {
              if (this.focusElement) {
                this.focusElement.firstChild.disabled = true;
                this.focusElement.item.edit();
              }
            }
          };
          // //console.log('DETAILS KEYDOWN', e.keyPressed, this.focusElement, keydown[e.keyPressed]);
          if (this.focusElement && keydown[e.keyPressed]) {
            e.stopPropagation();
            e.preventDefault();
            keydown[e.keyPressed](e);
          }
        })
        .on('change', e => {
          child.elemTreeLi
          .class('item', child.className)
          .hasChildren(1 || child.hasChildren)
          .name(child.name)
          .attr('inherited', child.isInherited ? 'ja' : 'nee')
          .elemTreeDiv.text('').append(
            $('i', 'open').on('click', function elemTreeDivClick (e) {
              // anders opend het item
              e.stopPropagation();
              child.elemTreeLi.emit('toggle');
              // console.warn('CHILD', child, child.elemTreeLi);
              // child.elemTreeLi.elem.open = !child.elemTreeLi.elem.open;
            }),
            $('i', 'state').css('background-color', child.stateColor),
            $('i').class('icn folder', child.className)
            // .src(child.data.src),
            .css('color', child.schemaColor),
            child.elemTreeTitle = $('span').class('title row aco')
            // .caption(child.header0)
            .attr('schemaPath', ((child.data||{}).schemaPath || '').split(':').slice(0,-1).join(' :'))
            .append(
              $('span').class('aco').ttext(child.header0),
              $('i').class('icn',child.type),
            )
            // .attr('flag', '')
            .on('dblclick', e => {
              e.stopPropagation();
              elem.setAttribute('sel', child.IsSelected ^= 1);
            }),
            // $('i').class('icn',child.type),
            // $('i').class('icn flag', child.EndDateTime && !child.FinishDateTime ? 'task' : ''),
          );
        })
        .append(
          (child.elemTreeDiv = child.elemTreeLi.elemTreeDiv = $('summary'))
          .class('row', child.reltype, child.srcID == child.masterID ? 'derived' : '')
          .attr('isClass', child.isClass)
          .draggable()
          .attr('groupname', child.groupname)
          .on('click', e => this.select(child, e))
          .on('click', e => document.body.hasAttribute('tv') ? document.body.setAttribute('tv', 0) : null)
          .on('dblclick1', child.toggle)
          .on('moveup', e => this.move(e, -1))
          .on('movedown', e => this.move(e, +1))
        )
        .emit('change')
      },
      close(item) {
        if (item.elemTreeLi && item.elemTreeLi.elemTreeDiv) {
          item.elemTreeLi.elemTreeDiv.attr('open', '0');
          this.openItemsSave();
        }
      },
      get data1() {
        // return this.items;
      },
      set data1(data) {
        // this.show(data);
      },
      async ident(e) {
        e.preventDefault();
        this.focusElement.previousElementSibling.open = true;
        $.link({
          name: 'Master',
          item: this.focusElement.item,
          to: this.focusElement.previousElementSibling.item,
          // current: this.focusElement.parentElement.item,
          index: 9999999,
          action: 'move',
        }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
      },
      outdent(e) {
        e.preventDefault();
        const index = [...this.focusElement.parentElement.parentElement.children].indexOf(this.focusElement.parentElement) - 1;
        $.link({
          name: 'Master',
          item: this.focusElement.item,
          to: this.focusElement.parentElement.parentElement.item,
          // current: this.focusElement.parentElement.item,
          index: index + 1,
          action: 'move',
        }).then(item => item.elemTreeLi.elemTreeDiv.scrollIntoView());
      },
      openItemsSave() {
        localStorage.setItem(
          'openItems',
          [...this.elem.getElementsByTagName('details')]
          .filter(e => e.item && e.open)
          .map(e => e.item.tag).join()
        )
        // //console.log([...this.elem.getElementsByTagName('details')], localStorage.getItem('openItems'));
      },
      on(selector, context) {
        this[selector] = context;
      },
      async select(item, e) {
        e.preventDefault();
        e.stopPropagation();
        if (item.data.src) {
          $('list').load(item.data.src);
          return;
        }
        if (item.data.onclick) {
          item.data.onclick();
          return;
        }
        if (item.data.href) {
          document.location.href = '#/' + item.data.href;
          return;
        }
        this.setFocusElement(item.elemTreeLi.elem, e);
        // console.error(item.data['@id']);
        $().execQuery({
          l: urlToId(item.data['@id']),
          v: urlToId(item.data['@id']+'/children?$filter=FinishDateTime eq NULL&$select='+aim.config.listAttributes),
        });
        return;
        $('view').show(item);
        $.clipboard.setItem([item], 'treeselect', '');
        const children = await item.children || [];
        console.log('children', item.header0, children);
        $().list(children, item.header0);
      },
      show(data) {
        [...arguments].forEach(item => {
          if (typeof item === 'object') {
            // console.log(item);
            item = item instanceof Item ? item : Item.get(item);
            this.listElem.append(this.childnode(item));
            //
            //
            // // //console.log(data);
            // this.item.children.push(data);
            // this.open(this.item);
            // this.setFocusElement(data.elemTreeLi);
            // //console.log('treevie.show',this, data);
            // this.DIV = data;
            // const listItemElement = data.elemTreeLi = this.topElement;
            // listItemElement.item = data;
            // data.elemTreeLi.elemTreeUl = this.topElement.createElement('UL', 'col');
            // //console.log(;)
            // this.DIV.open();
            // }
          }
        });
        return this;
      },
      toggle() {
        //console.log($(document.body).attr('tv'));
        $(document.body).attr('tv', $(document.body).attr('tv') ^ 1, true);
      },
    };
    function Listview (selector) {
      Elem.call(...arguments);
      console.log(this.elem);
      selector.class('row aco listview');
      this.construct(...arguments);
      const elem = this.elem;
      const self = this;
      this.viewType = document.body.getAttribute('view');
      $(elem).extend({
        keyup: {
          ArrowUp: e => this.selectFocusElement(),
          ArrowDown: e => this.selectFocusElement(),
        },
        keydown: {
          // shift_ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),
          // ArrowUp: e => this.setFocusElement(this.getPreviousElement(), e),
          // ArrowDown: e => this.setFocusElement(this.getNextElement(), e),
          // shift_ArrowDown: e => this.setFocusElement(this.getNextElement(), e),
          shift_alt_ArrowDown: e => this.moveDown(e),
          shift_alt_ArrowUp: e => this.moveUp(e),
          ctrl_ArrowDown: e => this.moveDown(e),
          ctrl_ArrowUp: e => this.moveUp(e),
          ArrowRight: e => {
            // $.url.set({ folder: this.focusElement.item.id });
          },
          ArrowLeft: e => {
            // var master = this.focusElement.item.master;
            // if (master) {
            // 	if (master.master) $.url.set({ folder: master.master.id });
            // 	$.url.setitem(master);
            // }
          },
        },
      });
      // console.log('Listview',this);
    };
    Listview.prototype = {
      construct,
      getOffsetElement,
      getPreviousElement,
      getNextElement,
      move,
      moveUp,
      moveDown,
      setFocusElement,
      setSelectElement,
      selectFocusElement,
      activeFilterAttributes:{},
      calendar() {
        $('div').class('aco').parent(this.div.text(''))
        .calendar(this.itemsVisible)
      },
      chart() {
        $('div').class('aco').parent(this.div.text('')).chart(this.itemsVisible)
        // var data = [];
        // for (var i=0, item; item = this.items[i]; i++) {
        //   for (var category in item.Datachart) data.push({category:category, label:item.Title, value:item.Datachart[category]});
        //   if(i>10) break;
        //   // //console.log(item.Datachart);
        // }
        // // //console.log(data);
        // // return;
        // return $.Charts.show(data, listItemElement);
      },
      clickfilter(e) {
        const target = e.target;
        const activeFilterAttributes = this.activeFilterAttributes;
        activeFilterAttributes[target.name] = activeFilterAttributes[target.name] || [];
        if (activeFilterAttributes[target.name].includes(target.value)) {
          activeFilterAttributes[target.name].splice(activeFilterAttributes[target.name].indexOf(target.value), 1);
        } else {
          activeFilterAttributes[target.name].push(target.value);
        }
        if (!activeFilterAttributes[target.name].length) {
          delete activeFilterAttributes[target.name];
        }
        var searchParams = new URLSearchParams(document.location.search);
        searchParams.set('f',btoa(JSON.stringify(activeFilterAttributes)));//$.Object.stringify(this.activeFilterAttributes);
        window.history.pushState('page', 'PAGINA', '?' + searchParams.toString() );
        this.refilter();
      },
      get data(){
          return this.items;
        },
      set data(data) {
          if (Array.isArray(data)) {
          }
          if (typeof data === 'string')
          this.show(data);
        },
      elementSelect(el) {
        //// //console.log("select");
        if (this.elSelect) this.elSelect.removeAttribute('selected');
        if (!el) return;
        this.setFocusElement(el);
        (this.elSelect = el).setAttribute('selected', '');
      },
      filtersOpen:{},
      filterAttributes:{},
      fill() {
        this.itemsVisible.forEach(row => {
          if (row.elemListLi && row.elemListLi.elem) {
            const h = document.documentElement.clientHeight;
            const rect = row.elemListLi.elem.getBoundingClientRect();
            const visible = rect.bottom > -h && rect.top < h + h;
            if (!visible) {
              row.elemListLi.text('');
            } else if (!row.elemListLi.elem.innerText) {
            this.listnode(row)
          }
          }
        });
      },
      ganth() {
        $('div').class('aco').parent(this.div.text('')).ganth(this.itemsVisible)
      },
      go() {
        return $.Go.create({ el: listItemElement, data: this.items });
      },
      get:{},
      getProperties() {
        const schemaNames = this.itemsVisible.map(item => item.schemaName).unique();
        const schemas = [...Object($().schemas()).entries()].filter(([schemaName, schema]) => schemaNames.includes(schemaName));
        const schemaKeys = schemas.map(([schemaName, schema]) => schemaName);
        let properties = [].concat(
          'Tagname',
          'LinkTagname',
          'header0',
          'header1',
          'header2',
          // 'schemaPath',
          // 'schemaName',
          ...schemas.map(([schemaName, schema]) => schemaName), ...schemas.filter(([key, schema]) => !['hidden'].includes(schema.format)).map(([key, schema]) => Object.keys(schema.properties)),
          'ID',
          'level',
        ).unique();
        properties = properties.filter(name => this.itemsVisible.some(item => item.data[name]));
        return properties;
      },
      listnode(item) {
        const li = item.elemListLi;
        const [stateOption, stateOptions] = item.options('State');
        const [catOption, catOptions] = item.options('Categories');
        const iconsrc = item.iconsrc;
        let icon;
        if (iconsrc) {
          icon = $('img', {src: iconsrc || ''});
        } else if (item.gui && item.gui.global) {
          icon = $('div', 'gui global').append(
            $('div', 'object').append(
              $('div', item.tag).append(
                $('div', item.tag).append(item.gui.global),
              ),
            ),
          );
          // [...guiElement.attributes].forEach(attribute => {
          // 	const key = attribute.name[0].toUpperCase() + attribute.name.substr(1);
          // 	if (key === 'Class') return;
          // 	$.HttpRequest($.config.$, this['@id']).select(key).get().then(e => {
          // 		const value = String(this[key]);
          // 		guiElement.setAttribute(attribute.name, value);
          // 	})
          // 	// //console.log(key, this[key]);
          // 	// if (key in this) {
          // 	//   const value = String(this[key]);
          // 	//   if (value) {
          // 	//     childElement.setAttribute(attribute.name, value);
          // 	//     // //console.log(attribute.name, value);
          // 	//   }
          // 	// }
          // });
        }
        if (item.elemListLi) {
          item.elemListLi
          .text('')
          .attr('online', item.online)
          .checked(item.checked)
          .css('border-color', item.modColor)
          .attr('viewstate', item.viewstate)
          .append(
            $('div').class('itemrow row card noselect aco').append(
              $('i', 'modified'),
              $('button').class('abtn stateicon').append(
                $('i').append(
                  $('i').css('background-color', item.stateColor),
                ),
                li.elemStateUl = $('ul').class('col').append(
                  // $('li').class('abtn').text('JAdsfg sdfg sd'),
                  // $('li').class('abtn').text('JAdsfg sdfg sd'),
                  // $('li').class('abtn').text('JAdsfg sdfg sd'),
                  // $('li').class('abtn').text('JAdsfg sdfg sd'),
                )
              )
              .on('mouseenter', function (e) {
                const rect = this.getBoundingClientRect();
                // //console.log(window.innerHeight,rect.top,li.elemStateUl.elem,li.elemStateUl.elem.clientHeight);
                // setTimeout(() => //console.log(window.innerHeight,rect.top,li.elemStateUl.elem,li.elemStateUl.elem.clientHeight));
                li.elemStateUl.css('top', Math.min(rect.top, window.innerHeight-li.elemStateUl.elem.clientHeight-20)+'px').css('left', rect.left+'px');
              }),
              // $('i', 'stateicon')
              // .contextmenu(stateOptions)
              // .on('select', e => item.state = [...e.path].find(el => el.value).value)
              // .append(
              // 	$('i').css(item.stateColor ? { style: 'background-color:' + item.stateColor } : null),
              // ),
              // ...item.schemaPath.toLowerCase().split(':'),
              $('div')
              .class('icn itemicon', item.className)
              .css('color', item.schemaColor)
              .append(
                icon,
                $('div', 'bt sel').on('click', e => e.stopPropagation(item.checked ^= 1)),
              ),
              $('div', 'col aco').append(
                $('div', 'kop row')
                .attr('hassrc', item.srcID ? 1 : 0)
                // haslink: li.linkrow ? 1 : 0,
                .attr('hasattach', item.hasAttach)
                .attr('type', item.type) // class, copy, inherit
                .append(
                  $('span', 'aco header title').text(item.header0),
                  $('div', 'icn hdn type').on('click', e => document.location.href = '#id=' + item.srcID),
                  $('div', 'icn del').on('click', e => item.delete()),
                  $('div', 'icn hdn attach'),
                  $('div', 'icn fav').attr('checked', item.fav).on('click', e => {
                    item.fav ^= 1;
                    e.stopPropagation();
                  }),
                  $('div', 'icn flag').on('click', e => {
                    if (!item.FinishDateTime) {
                      item.FinishDateTime = aDate().toISOString();
                    } else {
                      item.FinishDateTime = '';
                      var d = aDate();
                      d.setDate(aDate().getDate() + 6);
                      d.setHours(16, 0, 0, 0);
                      d.toLocal();
                      item.EndDateTime = d.toISOString();
                    }
                  }),
                ),
                $('div', 'header subject', item.header1),
                $('div', 'header preview', item.header2).append(
                  item.operations ? item.operations.map(o => $('a', '', o.title, o)) : null,
                ),
              ),
            )
          )
        }
        // if (this === $.pageItem) {
        // 	$(listItemElement).classAdd('pageItem');
        // }
        //if (this.hasModified = !$.clipboard.replace[this.id] || new Date($.his[this.id]) < new Date(this.modifiedDT)) createElement('DIV', { className: !$.his[this.id] ? 'created' : 'modified' });
        // kopElement.createElement(item.srcID && item.revertshow ? ['A', 'copy', { par: { id: item.srcID } }] : null);
      },
      // itemsVisible:{ value:[]},
      // items:{ value:[]},
      async maps() {
        // this.setAttribute('view', 'maps');
        // //console.debug('MAPSSSSSS');
        //this.rewrite();
        this.div.text('').append(
          this.mapElem = $('div').class('googlemap').css('width:100%;height:100%;'),
        );
        const maps = await $.his.maps();
        const mapOptions = {
          zoom: 10,
          center: { lat: 51, lng: 6 },//new maps.LatLng(51,6),
          mapTypeId: maps.MapTypeId.ROADMAP,
          // mapId: 'cb830478947dbf25',
          // styles: [
          //   {
          //     "featureType": "all",
          //     "stylers": [
          //       { "color": "#C0C0C0" }
          //     ]
          //   },{
          //     "featureType": "road.arterial",
          //     "elementType": "geometry",
          //     "stylers": [
          //       { "color": "#CCFFFF" }
          //     ]
          //   },{
          //     "featureType": "landscape",
          //     "elementType": "labels",
          //     "stylers": [
          //       { "visibility": "off" }
          //     ]
          //   }
          // ],
          // https://mapstyle.withgoogle.com/
          styles: $().maps.styles,
        };
        const map = new maps.Map(this.mapElem.elem, mapOptions);
        // return;
        // new maps.Marker({
        //   position: {
        //     // lat: Number(loc[0]),
        //     // lng: Number(loc[1]),
        //     lat: 51.93281270000000,
        //     lng: 6.07558600000000,
        //   },
        //   map: map,
        //   title: 'Hello world',
        // });
        var bounds = new maps.LatLngBounds();
        // var focusmarker;
        const dataItems = this.itemsVisible.filter(item => item.data.Location && item.data.data);
        if (dataItems.length) {
          dataItems.forEach(item => item.value = Object.values(item.data.data).reduce((a,b) => a+b));
          const maxValue = dataItems.map(item => item.value).reduce((a,b) => Math.max(a,b));
          console.log(maxValue);
          dataItems.forEach(item => item.scale = 1 + 2 / maxValue * item.value);
        }
        this.itemsVisible.filter(item => item.data.colorid && item.schema.colorid).forEach(item => item.color = item.schema.colorid[item.data.colorid] || item.schema.colorid.default);
        this.itemsVisible.filter(item => item.data.Location).forEach(item => {
          const loc = item.data.Location.split(',');
          const marker = new maps.Marker({
            position: {
              lat: Number(loc[0]),
              lng: Number(loc[1]),
            },
            map: map,
            item: item,
            zIndex: Number(1),
            title: [item.header0,item.header1,item.header2].join('\n'),
            // icon: getCircle((row.state && row.state.value && row.fields.state.options && row.fields.state.options[row.fields.state.value]) ? row.fields.state.options[row.fields.state.value].color : 'red')
            icon: {
              //url: document.location.protocol+'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
              //// This marker is 20 pixels wide by 32 pixels high.
              //size: new google.maps.Size(20, 32),
              //// The origin for this image is (0, 0).
              //origin: new google.maps.Point(0, 0),
              //// The anchor for this image is the base of the flagpole at (0, 32).
              //anchor: new google.maps.Point(0, 32)
              path: maps.SymbolPath.CIRCLE,
              fillColor: 'red',
              fillOpacity: .6,
              scale: 10, //Math.pow(2, magnitude) / 2,
              strokeColor: 'white',
              strokeWeight: .5
            },
            icon: {
              // path: "M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z",
              // path: "M146.667,0C94.903,0,52.946,41.957,52.946,93.721c0,22.322,7.849,42.789,20.891,58.878 c4.204,5.178,11.237,13.331,14.903,18.906c21.109,32.069,48.19,78.643,56.082,116.864c1.354,6.527,2.986,6.641,4.743,0.212 c5.629-20.609,20.228-65.639,50.377-112.757c3.595-5.619,10.884-13.483,15.409-18.379c6.554-7.098,12.009-15.224,16.154-24.084 c5.651-12.086,8.882-25.466,8.882-39.629C240.387,41.962,198.43,0,146.667,0z M146.667,144.358 c-28.892,0-52.313-23.421-52.313-52.313c0-28.887,23.421-52.307,52.313-52.307s52.313,23.421,52.313,52.307 C198.98,120.938,175.559,144.358,146.667,144.358z",
              // path: "M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z",
              // path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
              path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
              scale: (item.scale || 1)/2,
              fillColor: item.color || "blue",
              fillOpacity: 0.6,
              strokeWeight: 0,
              strokeColor: 'white',
              rotation: 0,
              anchor: new maps.Point(15, 30),
            },
            //icon: (row.state) ? 'icon/' + row.state.value + '.png' : null,
          });
          // console.log(marker);
          marker.addListener('click', e => $('view').show(item));
          bounds.extend(marker.getPosition());
        });
        // if (bounds) {
        map.fitBounds(bounds);
        // //console.log(google.maps);
        if (maps.e) {
          maps.e.addListenerOnce(map, 'bounds_changed', function () {
            this.setZoom(Math.min(15, this.getZoom()));
          });
        }
        // }
      },
      refilter() {
        for (let [attributeName, attribute] of Object.entries(this.filterAttributes)) {
          attribute.cnt = 0;
          attribute.checked = false;
          for (var fieldvalue in attribute.values) {
            var field = attribute.values[fieldvalue];
            field.cnt = 0;
            field.checked = this.activeFilterAttributes && this.activeFilterAttributes[attributeName] && this.activeFilterAttributes[attributeName].indexOf(fieldvalue) > -1;
            attribute.checked = attribute.checked || field.checked;
          }
        }
        this.items.forEach(row => {
          row.hidden = false;
          for (let [attributeName, attribute] of Object.entries(this.activeFilterAttributes)) {
            if (!(attributeName in row.filterfieldslower) || attribute.indexOf(row.filterfieldslower[attributeName]) === -1) {
              row.hidden = true;
              break;
            }
          }
        });
        // add: this.childClasses && this.childClasses.length > 1
        // ? {
        // 	Title: __('newitem'),
        // 	popupmenu: (function (childClasses) {
        // 		for (var i = 0, childclass; childclass = childClasses[i]; i++) {
        // 			//var schema = $.config.components.schemas[className];
        // 			//// //console.debug(childclass);
        // 			//if (!schema) return;
        // 			//var menuitem = menuitems[className] = { Title: schema.Title || className };
        // 			////var childclass = childClasses[name];
        // 			////schema.Title = schema.Title || className;
        // 			////if (item) menuitem.masterID = item.id;
        // 			////menuitem.onclick = $.config.components.schemas.item.add.bind({ schema: className, srcID: childclass.scrID, masterID: childclass.masterID, });
        // 			childclass.onclick = $.config.components.schemas.item.add.bind({ schema: childclass.schema || childclass.Title, masterID: item ? item.id : null });
        // 			//if (item && item.schema == name) childClasses["Typical"] = { schema: "System", srcID: item.scrID }
        // 		}
        // 		//// //console.debug('childClasses', childClasses);
        // 		return childClasses;
        // 	})(this.childClasses)
        // }
        // : {
        // 	Title: __('newitem'),
        // 	onclick: e => {
        // 		let schemaname = this.path.split('/')[1];
        // 		//console.log(1,schemaname);
        // 		$(schemaname).post();
        // 	}
        // },
        this.itemsVisible = this.items.filter(item => !item.hidden);
        this.selector.text('')
        .attr('hidefilter', $().storage('hidefilter'))
        .append(
          $('div', 'row top abs btnbar np').append(
            $('button').class('abtn select').on('click', e => this.selector.attr('hidefilter', $().storage('hidefilter', this.selector.attr('hidefilter')^1).storage('hidefilter'))),
            $('span').class('aco').text(this.title + ' (' + this.items.length + ')'),
            $('button').class('abtn add').append(
              $('ul').append(
                [...$().schemas().entries()].map(
                  ([name,schema]) => $('li')
                  .class('abtn')
                  .draggable()
                  .text(name)
                  .item($(schema), 'elemAdd')
                  .on('click', e => {
                    e.stopPropagation();
                    const targetItem = this.tag ? $(this.tag) : null;
                    const sourceItem = Item.toData($(schema));
                    // return console.log(this.tag, sourecItem, targetItem);
                    $().copyFrom(sourceItem, targetItem).then(item => {
                      $('view').show(item, true);
                    });
                  })
                ),
              ),
            ),
            $('button').class('abtn refresh').on(
              'click', e => aimClient
              .api(document.location.pathname.replace(/\/id\/.*/,''))
              .query(document.location.search).get().then(item => $().list(item))
            ),
            $('button').class('abtn download').append(
              $('ul').append(
                $('li').class('abtn toexcel').text('Excel').on('click', e => {
                  const properties = this.getProperties();
                  const data = this.itemsVisible.map(item => Object.fromEntries(properties.map(key => [key, item[key]] )));
                  let ws = XLSX.utils.json_to_sheet(data);
                  let wb = XLSX.utils.book_new();
                  // let title = this.title.replace(/\/|\(|\)|\_/g,'');
                  let title = 'export';
                  XLSX.utils.book_append_sheet(wb, ws, title);
                  XLSX.writeFile(wb, title + '.xlsx');
                }),
              )
            ),
            $('button').class('abtn print').on('click', null),
            $('button').class('abtn filter').attr('title', 'Lijst filteren').on('click', e => $.show({ flt: get.flt ^= 1 }) ),
            $('button').class('abtn sort').attr('title', 'Menu Opties sorteren openen').append(
              $('ul').append(
                $('li').class('abtn').text('Title').on('click', e => this.sortby('Title')),
                $('li').class('abtn').text('Subject').on('click', e => this.sortby('Subject')),
                $('li').class('abtn').text('Summary').on('click', e => this.sortby('Summary')),
                $('li').class('abtn').text('Deadline').on('click', e => this.sortby('EndDateTime')),
              ),
            ),
            $('button').class('abtn view', this.viewType).append(
              $('ul').append(
                $('li').class('abtn rows').text('Lijst').on('click', e => this.rewrite('rows')),
                $('li').class('abtn cols').text('Tegels').on('click', e => this.rewrite('cols')),
                $('li').class('abtn table').text('Tabel').on('click', e => this.rewrite('table')),
                !this.hasMapsData ? null : $('li').class('abtn maps').text('Maps').on('click', e => this.rewrite('maps')),
                !this.hasChartData ? null : $('li').class('abtn chart').text('Graph').on('click', e => this.rewrite('chart')),
                !this.hasDateData ? null : $('li').class('abtn ganth').text('Ganth').on('click', e => this.rewrite('ganth')),
                !this.hasDateData ? null : $('li').class('abtn calendar').text('Calendar').on('click', e => this.rewrite('calendar')),
                $('li').class('abtn flow').text('Flow').on('click', e => this.rewrite('flow')),
                !this.hasModelData ? null : $('li').class('abtn model').text('Model').on('click', e => this.rewrite('go')),
                $('li').class('abtn model2d').text('2D').on('click', e => {
                  //get hidden() {
                  //	var item = colpage.item;
                  //	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
                  //},
                  colpage.item.model2d();
                }),
                $('li').class('abtn model3d').text('3D').on('click', e => {
                  //get hidden() {
                  //	var item = colpage.item;
                  //	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
                  //},
                  colpage.item.model3d();
                }),
              ),
            ),
          ),
          this.filter = $('ul', 'col afilter liopen np noselect').id('afilter')
          .css('max-width', $().storage('afilter.width') || '150px').on('click', e => document.body.setAttribute('ca', 'lvfilter')),
          $('div').seperator(),
          this.div = $('div', 'col aco oa').on('scroll', e => {
            clearTimeout($.toBodyScroll);
            $.toBodyScroll = setTimeout(() => this.fill(), 100);
          }),
        );
        this.rewrite();
        this.filterFields.forEach(filterfield => filterfield.avalues.sort((a,b)=>{
          if (a.cnt > 0 && b.cnt === 0) return -1;
          if (a.cnt === 0 && b.cnt > 0) return 1;
          return a.value.localeCompare(b.value, {}, 'numeric');
        }));
        this.filter.append(...this.filterFields.filter(
          filterfield => filterfield.avalues.length > 1 || filterfield.avalues[0].items.length != this.items.length
        ).map(
          filterfield => $('li', 'col')
          .open(filterfield.open = this.filtersOpen[filterfield.name] || filterfield.checked)
          .attr('cnt', filterfield.cnt || 0)
          .checked(filterfield.checked)
          .append(
            $('a').class('row')
            // .on('click', e => this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open)
            .on('click', e => this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open)
            .append(
              $('span').class('aco attrlabel').ttext(filterfield.Title),
            ),
            $('ul')
            .checked(filterfield.checked)
            .attr('meer', filterfield.meer || 0)
            .open(filterfield.avalues.some(field => field.checked))
            .append(
              filterfield.avalues
              .filter(field => field.Title && (filterfield.checked || field.checked || field.cnt))
              .map(
                (field,i) => $('li').class('row')
                .setProperty('btbg', 'red')
                .append(
                  $('input')
                  .type('checkbox')
                  .on('change', e => this.clickfilter(e))
                  .checkbox(filterfield, field),
                )),
                $('div')
                .class('meer')
                .on('click', e => $(e.target.parentElement)
                .attr('meer', $(e.target.parentElement).attr('meer')^1)),
                // $('div').class('minder').on('click', e => $(e.target.parentElement).attr('meer', '0')),
              )
            )
          )
        );
        return this;
        if (filterElement) {
          filterElement.innerText = '';
          this.filterFields.forEach(filterfield => {
            filterfield.avalues.sort((a,b)=>{
              if (a.cnt > 0 && b.cnt === 0) return -1;
              if (a.cnt === 0 && b.cnt > 0) return 1;
              return a.value.localeCompare(b.value, {}, 'numeric');
            });
            filterfield.listItemElement = filterElement.createElement('LI', 'col', {
              cnt: filterfield.cnt || 0,
              checked: filterfield.checked || 0,
              open: filterfield.open = this.filtersOpen[filterfield.name] || filterfield.checked || 1
            }, [
              ['A', 'row', {
                onclick: (e)=> {
                  this.filtersOpen[filterfield.name] = filterfield.listItemElement.getAttribute('open') = filterfield.open;
                }
              }, [
                ['SPAN', 'aco', __(filterfield.Title)]
              ]],
            ]);
            filterfield.listItemElement = filterfield.listItemElement.createElement('UL', {
              checked: filterfield.checked || 0,
              meer: filterfield.meer || 0
            });
            var ic = 0;
            for (var i = 0, field; field = filterfield.avalues[i]; i++) {
              if (!field.Title) continue;
              if (filterfield.checked || field.checked || field.cnt) {
                if (field.checked) {
                  filterfield.listItemElement.setAttribute('open', filterfield.open = 1);
                }
                filterfield.listItemElement.createElement('LI', 'row', {
                  ondragover(e) {
                    e.dataTransfer.dropEffect = 'move';
                    e.stopPropagation();
                    e.preventDefault();
                  },
                  ondrop(e) {
                    // //console.debug(this.filterfield, this.field, $.dragdata.item, e);
                    var par = {};
                    par[this.filterfield.name] = field.Title;
                    if ($.dragdata.item) $.dragdata.item.set(par);
                  }
                }, [
                  ['INPUT', '', {
                    type: 'checkbox',
                    value: field.value,
                    name: filterfield.name,
                    id: filterfield.name + field.value + i,
                    checked: field.checked,
                    onchange: e => this.clickfilter(e),
                  }],
                  ['LABEL', 'aco', __(field.Title), { for: filterfield.name + field.value + i }],
                  ['SPAN', '', field.cnt],//{ for: filterfield.name + field.value + i, cnt: field.cnt, caption: __(field.Title) }],
                ]);
                ic++;
              }
            }
            if (ic > 5) {
              filterfield.listItemElement.createElement('LI', 'meer', {
                onclick() {
                  filterfield.listItemElement.setAttribute('meer', filterfield.meer ^= 1)
                }
              });
            }
          });
        }
      },
      rewrite(viewType) {
        localStorage.setItem('viewType', viewType = this.viewType = viewType || localStorage.getItem('viewType'));
        const itemsVisible = this.itemsVisible;
        itemsVisible.forEach(row => {
          for (var attributeName in this.filterAttributes) {
            if (row.filterfieldslower && row.filterfieldslower[attributeName] && this.filterAttributes[attributeName].values) {
              var value = row.filterfieldslower[attributeName];
              if (this.filterAttributes[attributeName].values[value]) {
                this.filterAttributes[attributeName].values[value].cnt++;
                this.filterAttributes[attributeName].cnt++;
              }
            }
          }
        });
        this.div.text('');
        if (this[this.viewType]) {
          return this[this.viewType]();
        }
        $('summary')
        .class('col list')
        .parent(this.div)
        .contextmenu(this.menu)
        .append(...itemsVisible.map(
          item => item.elemListLi = $('li')
          .class('item')
          .draggable()
          .item(item, 'listview')
          .on('click', e => this.select(item))
          .on('focusselect', e => {
            clearTimeout($.arrowTimeout);
            $.arrowTimeout = setTimeout(() => this.select(item), window.event.type === 'keydown' ? 300 : 0);
          })
          .on('change', e => this.listnode(item))
          .emit('change')
          // .attr('userID', item.userID || '0')
          // .attr('level', item.level || '0')
          // .on('rewrite', () => this.listnode(item))
          // .on('select', function () {
          // 	if (!this.innerText) this.createListRowElement(this, this.item);
          // 	Web.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
          // 	if (this.item.listItemElement) this.item.listItemElement.click();
          // })
          // .assign({
          // 	// item: item,
          // 	//oncontextmenu: $.mainPopup.show,
          // 	//attr: function (row) {
          // 	//	var res = {};
          // 	//	if ($.fav && $.fav[row.id]) res.Fav = 1;
          // 	//	if (row.fields && row.fields.state) res.state = row.fields.state.value;
          // 	//	//if (row.srcID) res.derived = '';
          // 	//	return res;
          // 	//}(row),
          // 	// userID: item.userID || '0',
          // 	// level: item.level || '0',
          // 	select: function () {
          // 		return;
          // 		if (!this.innerText) this.createListRowElement(this, this.item);
          // 		Web.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
          // 		if (this.item.listItemElement) this.item.listItemElement.click();
          // 	},
          // 	rewrite: () => this.listnode(item),
          // })
          // .contextmenu($(item).popupmenuitems())
          // .on('click', e => this.selectFocusElement(item.elemListLi.elem, e))
          // .on('click', e => //console.log(item.tag, item.header0))
        ));
        this.fill();
      },
      select(item, e) {
        // //console.log(2);
        // $.clipboard.setItem([item], 'checked', '');
        // this.focus(item);
        this.setFocusElement(item.elemListLi.elem, e);
        $().execQuery({
          v: urlToId(item.data['@id']),
        });
        //
        // $('view').show(item);
      },
      set(set) {
        //// //console.debug('LIST SET', this.get.filter, set);
        //// //console.debug('LIST SET', set);
        //if (!set.q) this.get = {};
        //'folder, function, q, filter, search, Title, id, child, select, src, master, users, link, refby, origin, source'.split(', ').forEach(function (name) { if (name in set) this.get[name] = set[name]; }, this);
        //$.url.sethis(this.get);
        //Object.assign(set, { id: '', schema: '', tv: '', lv: '', reload: '' , Title: '' });
        //Object.assign(set, { id: '', schema: '', reload: '' });
        //// //console.debug('LIST SET', set.Title, set.filter);
        for (var name in set) if (this.get[name] != set[name]) break; else name = null;
        if (!name) return;
        //// //console.debug('LIST SET', set);
        //// //console.debug(set);
        //// //console.debug('LIST SET', this.get.filter, set);
        Object.assign(this.get, set);
        //indien er een filter aanstaat en er een zoekopdracht wordt gegeven, schakelen we het filter uit. Zoeken vindt plaats op alle items van een masterclass
        //Voorbeeld is EWR moba. Filter is actief, alleen actieve items. Bij zoeken alle items.
        //if (this.get.q && this.get.q != '*' && this.get.filter) this.get.filter = '';
        this.schema = this.get.schema || ($.getItem(this.get.folder) ? $.getItem(this.get.folder).schema : null) || this.get.folder;
        this.childClasses = $.config.components.schemas[this.schema] && $.config.components.schemas[this.schema].childClasses ? $.config.components.schemas[this.schema].childClasses : [this.schema];
        //// //console.debug('SCHEMA', this.schema, this.childClasses);
        //// //console.debug('LIST SET', this.get.filter, set);
        for (var name in this.get) if (!this.get[name]) delete this.get[name];
        //// //console.debug('LIST SET', this.get.filter, set.filter);
        if (this.get.folder && Number(this.get.folder) && $.getItem(this.get.folder)) {
          $.getItem(this.get.folder).focus();
          if ($.getItem(this.get.folder).children.length) {
            this.show($.getItem(this.get.folder).children);
            return
          }
        }
        this.show(this.data[this.get.Title] || []);
        //// //console.debug('LIST SET', this.get);
        if (!this.get.q) return;
        //// //console.debug('LIST SET', this.get.filter, set.filter);
        var get = this.get;
        this.loadget = {};
        "folder, filter, child, q, select".split(", ").forEach(function (name) { if (get[name]) this.loadget[name] = get[name]; });
        delete this.loadget.select;
        new $.HttpRequest($.config.$, 'GET', this.loadget, e => {
          //// //console.debug('list_set', this.responseText, e.body);
          this.show(e.body.value);
        }).send();
        //if (!get.value) this.items = [];
        //var par = Object.assign($.url.par(document.location.search.substr(1)), { q: this.value, search: 'Title, Subject, Summary' }), get = {};
        //'folder, q, filter, search'.split(', ').forEach(function (name) { if (par[name]) get[name] = par[name]; });
        //$.url.set(get);
      },
      sortby(sortname) {
        this.sortdir = this.sortname == sortname ? -this.sortdir : 1;
        this.sortname = sortname;
        console.debug(sortname);
        this.btns.sort.className = this.sortdir == 1 ? '' : 'asc';
        this.items.sort(function (a, b) {
          return this.sortdir * String(a[this.sortname]).localeCompare(String(b[this.sortname]), {}, 'numeric');
        }.bind(this));
        refilter();
        //this.show();
      },
      sortlist(a, b) {
        //// //console.debug('SORT', a, b);
        if (a.masterID && b.masterID && a.masterID == b.masterID) {
          if (a.index < b.index) return -1;
          if (a.index > b.index) return 1;
          return 0;
        }
        if (a.prio && b.prio && a.prio < b.prio) return -1;
        if (a.prio && b.prio && a.prio > b.prio) return 1;
        if (a.FinishDateTime && !b.FinishDateTime) return 1;
        if (!a.FinishDateTime && b.FinishDateTime) return -1;
        if (a.FinishDateTime && b.FinishDateTime) {
          if (a.FinishDateTime < b.FinishDateTime) return -1;
          if (a.FinishDateTime > b.FinishDateTime) return 1;
        }
        if (a.fav && !b.fav) return -1;
        if (!a.fav && b.fav) return 1;
        //// //console.debug(a, b);
        if (a.lastvisitDT && !b.lastvisitDT) return -1;
        if (!a.lastvisitDT && b.lastvisitDT) return 1;
        if (a.lastvisitDT && b.lastvisitDT) {
          if (a.lastvisitDT.substr(0, 10) < b.lastvisitDT.substr(0, 10)) return -1;
          if (a.lastvisitDT.substr(0, 10) > b.lastvisitDT.substr(0, 10)) return 1;
        }
        if (a.accountprice && !b.accountprice) return -1;
        if (!a.accountprice && b.accountprice) return 1;
        //if (sortname) {
        //    if (a[sortname].value < b[sortname].value) return -1;
        //    if (a[sortname].value > b[sortname].value) return 1;
        //}
        //if (a.EndDateTime && !b.EndDateTime) return -1;
        //if (!a.EndDateTime && b.EndDateTime) return 1;
        if (a.EndDateTime && b.EndDateTime) {
          if (a.EndDateTime < b.EndDateTime) return -1;
          if (a.EndDateTime > b.EndDateTime) return 1;
        }
        //if (a.StartDateTime && !b.StartDateTime) return 1;
        //if (!a.StartDateTime && b.StartDateTime) return -1;
        if (a.StartDateTime && b.StartDateTime) {
          if (a.StartDateTime < b.StartDateTime) return -1;
          if (a.StartDateTime > b.StartDateTime) return 1;
        }
        //if (a.lastvisitDT && b.lastvisitDT) {
        //    if (a.lastvisitDT < b.lastvisitDT) return -1;
        //    if (a.lastvisitDT > b.lastvisitDT) return 1;
        //}
        if (a.searchname && b.searchname) {
          var awords = a.searchname.match(/\w+/g),
          bwords = b.searchname.match(/\w+/g),
          ia = 999,
          ib = 999,
          l = $.his.search.value.length;
          for (var i = 0, word; word = awords[i]; i++) {
            //// //console.debug(word);
            if (word.indexOf($.his.search.value) != -1) ia = Math.min(ia, word.indexOf($.his.search.value) + word.length - l);
            //var pos = word.indexOf($.his.search.value);
            //ia -= pos != -1 ? l + word.length - pos : 0;
          }
          for (var i = 0, word; word = bwords[i]; i++) {
            //// //console.debug(word);
            if (word.indexOf($.his.search.value) != -1) ib = Math.min(ib, word.indexOf($.his.search.value) + word.length - l);
            //var pos = word.indexOf($.his.search.value);
            //ib -= pos != -1 ? l + word.length - pos : 0;
            //ib += word.length - l + (pos != -1 ? pos - l : 0);
            //ib += pos != -1 ? pos : word.length;
            //ib += word.indexOf($.his.search.value) || word.length;
          }
          //// //console.debug(a, a.searchname, ia, b, b.searchname, ib);
          //var ia = a.searchname.indexOf($.his.search.value);
          //var ib = b.searchname.indexOf($.his.search.value);
          //if (ia == -1 && ib != -1) return 1;
          //if (ia != -1 && ib == -1) return -1;
          if (ia < ib) return -1;
          if (ia > ib) return 1;
        }
        return 0;
      },
      table() {
        const properties = this.getProperties();
        const tableElem = $('table').parent(this.div.text('')).class('list').append(
          $('thead').append(
            $('tr').append(
              $('th'),
              properties.map(propertyName => $('th').class('attrlabel').ttext(propertyName)),
            ),
          ),
          $('tbody').append(
            this.itemsVisible.map(item => $('tr')
            .item(item, 'tableview')
            .on('click', e => $('view').show(item))
            .draggable()
            .append(
              $('td')
              .class('icn', item.schemaName)
              .css('color', item.schemaColor),
              properties.map(propertyName => $('td').text(item.getDisplayValue(propertyName))),
            )),
          ),
        ).resizable();
      },
      _init1(get) {
        Object.assign(this, get);
        refilter();
      },
      _focus(item, e) {
        //console.log(1);
        // item.elemListLi
        // return;
        $.clipboard.setItem([item], 'checked', '');
        clearTimeout(this.arrowTimeout);
        this.arrowTimeout = setTimeout(() => this.select(item), e && e.type === 'keydown' ? 500 : 0);
        $().view(item);
        // //console.log(item.tag, item.header0);
        return;
        if (newFocusElement) {
          //console.log('selectFocusElement', newFocusElement);
          const e = window.event;
          this.setFocusElement(newFocusElement, e);
          // $.view()
          return;
          //console.log(arguments.callee.name, newFocusElement);
        }
      },
    };

    // console.log(this);
  }
  Om.prototype = {
    async list(items, cols) {
      // console.log(items);
      cols = cols || Object.keys(items[0]).map(name => Object({name: name}))

      function cell(col, row) {
        const data = row[col.name];
        const elem = $('td');
        if (col.cell) return elem.append(col.cell(row));
        if (!data) return elem;
        if (typeof data === 'object') {
          if ('value' in data) return elem.text(data.value);
        }
        return elem.text(data);
      }

      this.listElem.text('').append(
        $('table').append(
          $('thead').append(
            $('tr').append(
              cols.map(col => $('th').text(col.title || col.name)),
            )
          ),
          $('tbody').append(
            items.map(row => $('tr').append(cols.map(col => cell(col, row))))
          ),
        )
      )
      return;
      if (Array.isArray(this.items = (await items) || [])) {

        this.viewMap = new Map();
        this.title = path || '';
        this.tag = ((this.items.url||'').match(/\w+\(\d+\)/)||[''])[0];
        if (this.items.url) {
          // const url = new URL(document.location);
          // console.log('this.items.url', this.items.url, document.location.href);
          // url.searchParams.set('p', this.items.url);
          // window.history.pushState('page', '', url);
          // $.his.replaceUrl(url.toString());
          //
          // const url = new URL(this.items.url, document.location.origin);
          // url.searchParams.set('p', )
          // url.hostname = document.location.hostname;
          // this.title = url.pathname = url.pathname.replace(/.*(?=\b\w+\()/,'');
          // url.pathname += document.location.pathname.replace(/.*(?=\/id\/)/,'');
          // // console.log('show', this.title, this.items.url);
          // $.his.replaceUrl(url.toString())
          // this.title = this.items.url.replace(/.*\/api/,'');
          // const url = new URL(this.items.url.replace(/.*\/api/,''), document.location.origin);
          // TODO: werkt niet altijd
          // const match = document.location.pathname.match(/(\/id\/.*)/);
          // if (match) {
          //   url.pathname += match[0];
          //   $.his.replaceUrl(url.toString())
          // }
        }
        itemsVisible = [];
        this.elMeer = null;
        this.filterAttributes = {};
        if (document.getElementById('elBanner')) {
          document.getElementById('elBanner').style.display = 'none';
        }
        if (window.aThree && window.aThree.initdone) {
          return;
        }
        if ($.clipboardtree) {
          if ($.clipboardtree.elSelected) $.clipboardtree.elSelected.removeAttribute('selected');
          if ($.his.folder) {
            var item = $.getItem($.his.folder.substr(1).split('?').shift());
            if (item && item.elemTreeLi) ($.clipboardtree.elSelected = item.elemTreeLi).setAttribute('selected', '');
          }
        }
        // const this.viewType = document.body.getAttribute('view');
        // if (this.get.function && this.get.folder && $.config.components.schemas[this.get.folder] && $.config.components.schemas[this.get.folder][this.get.function]) {
        // 	$.config.components.schemas[this.get.folder][this.get.function](this.items);
        // }
        // this.items.sort((a, b) => { return a.index > b.index ? 1 : a.index < b.index ? -1 : 0; });
        // //console.error(this.items);
        this.items = this.items.filter(Boolean).map(item => item instanceof Item ? item : Item.get(item));
        // console.log(this.items);
        this.hasDateData = this.items.some(item => item.data.EndDateTime && item.data.StartDateTime);
        // this.hasChartData = this.items.some(item => item.data.data || (item.data.key && item.data.category && item.data.value));
        this.hasChartData = this.items.some(item => item.data.data && item.data.key);
        this.hasMapsData = this.items.some(item => item.data.Location);
        this.hasModelData = this.items.some(item => item.data.Title && item.data.linkto);
        // console.log('hasMapsData', this.hasMapsData, this.hasChartData);
        this.items.forEach((row, i) => {
          // row = row instanceof Item ? row : Item.get(row);
          // if (row.EndDateTime && row.StartDateTime) this.viewMap.set('ganth', true);
          // //console.error(row.schema, row);
          row.createListRowElement = row.createListRowElement || Item.createListRowElement;
          if (row['@id'] && Item(row['@id'])) row = this.items[i] = Item(row['@id']);
          const properties = row.schema.properties || {};
          const filternames = Object.entries(properties).filter(([name,prop])=>prop.filter);
          row.filterfields = Object.fromEntries(row.filternames.filter(name => row[name]).map(name => [name,row[name]]));
          // console.log(row.filternames, row.filterfields);
          //   Object.entries(properties)
          //   .filter(([name,prop])=>prop.filter && row[name])
          //   .map(([name,prop])=>[name, row[name]])
          // );
          row.filterfields.schemaName = row.schemaName;
          row.filterfields.hasAttach = row.hasAttach ? 'ja' : 'nee';
          // row.filterfields.test1 = 1;
          row.filterfields.state = row.state;
          // //console.log(row.state, row.State)
          // row.filterfields.lastModified = row.lastModified;
          // row.filterfields.created = row.created;
          // if (row.state && properties.state && properties.state.options && properties.state.options[row.state]) {
          //   row.stateColor = properties.state.options[row.state].color;
          // }
          //this.iconsrc = (this.files && this.files.avalue && this.files.avalue[0]) ? this.iconsrc = files.avalue[0].src : (this.class && this.class.className ? apiroot + 'img/icon/' + this.class.className + '.png' : '');
          //aimClient.listitem.call(row);
          // var cfgclass = $.config.components.schemas[aimClient.api.find(row.classID)], filterfields = {};
          $.config.components = $.config.components || {};
          $.config.components.schemas = $.config.components.schemas || {};
          var cfgclass = $.config.components.schemas[row.schema] || {};
          var filterfields = {};
          row.filtervalues = [];
          for (var attributeName in row.filterfields) {
            // //console.log(row.properties[attributeName].title);
            var fieldtitle = __(row.properties && row.properties[attributeName] && row.properties[attributeName].title ? row.properties[attributeName].title : attributeName);
            if (cfgclass && cfgclass.fields && cfgclass.fields[attributeName]) var fieldtitle = cfgclass.fields[attributeName].Title || cfgclass.fields[attributeName].placeholder || attributeName;
            row.filtervalues.push(row.filterfields[attributeName]);
            var value = String(row.filterfields[attributeName]).trim().toLowerCase();
            filterfields[attributeName] = value;
            this.filterAttributes[attributeName] = this.filterAttributes[attributeName] || {
              values: [],
              avalues: [],
              Title: fieldtitle
            };
            this.filterAttributes[attributeName].values[value] = this.filterAttributes[attributeName].values[value] || {
              value: value,
              Title: row.filterfields[attributeName],
              items: [],
              checked: false,
            };
            this.filterAttributes[attributeName].values[value].items.push(row);
          };
          row.filterfieldslower = filterfields;
        });
        if (this.viewType === 'chart' && !this.hasChartData) {
          $(document.body).attr('view', '');
        }
        this.filterFields = [];
        for (let [attributeName, attribute] of Object.entries(this.filterAttributes)) {
          attribute.name = attributeName;
          for (let [fieldvalue, value] of Object.entries(attribute.values)) {
            attribute.avalues.push(attribute.values[fieldvalue]);
          }
          // console.log(attributeName, attribute.avalues, attribute.values);
          if (attribute.avalues.length > 1 || attribute.avalues[0].cnt != this.items.length) {
            this.filterFields.push(attribute);
          }
        };
        var searchParams = new URLSearchParams(document.location.search);
        if (searchParams.has('f')) {
          this.activeFilterAttributes = JSON.parse(atob(searchParams.get('f')));
          for (var attributeName in this.activeFilterAttributes) {
            if (!(attributeName in this.filterAttributes)) {
              delete this.activeFilterAttributes[attributeName];
            } else {
              for (var i = 0, val; val = this.activeFilterAttributes[attributeName][i]; i++) if (!(val in this.filterAttributes[attributeName].values)) {
                this.activeFilterAttributes[attributeName].splice(this.activeFilterAttributes[attributeName].indexOf(val), 1);
                i--;
              }
              if (!this.activeFilterAttributes[attributeName].length) {
                delete this.activeFilterAttributes[attributeName];
              }
            }
          }
        }
        this.idxstart = 0;
        this.filterFields.sort((a, b)=> {
          return a.name.localeCompare(b.name, {}, 'numeric');
        });
        this.refilter();
      }
      return this;
    },
    async init() {
      const name = document.currentScript.getAttribute('name') || 'om';
      const om = this[name] = $(name, new ObjectManager);
      const client_id = $.config.client_id;
      const aimConfig = {
        client_id: client_id,
        scope: 'openid profile name email admin.write',
      };
      aimClient = new aim.UserAgentApplication(aimConfig);
      const aimRequest = {
        scopes: aimConfig.scope.split(' '),
      };
      console.log('aimConfig', aimConfig);
      // aimClient.storage.clear();
      if (aimConfig.access_token) {
        aimClient.setAccessToken(aimConfig.access_token);
      }
      if (aimConfig.id_token) {
        aimClient.setIdToken(aimConfig.id_token);
      }
      let dmsConfig = {
        client_id: client_id,
        servers: [{url: 'https://dms.aliconnect.nl'}],
      };
      const authProvider = {
        getAccessToken: async () => {
          let account = aimClient.storage.getItem('aimAccount');
          if (!account){
            throw new Error(
              'User account missing from session. Please sign out and sign in again.'
            );
          }
          try {
            // First, attempt to get the token silently
            const silentRequest = {
              scopes: aimRequest.scopes,
              account: aimClient.getAccountByUsername(account)
            };
            const silentResult = await aimClient.acquireTokenSilent(silentRequest);
            return silentResult.accessToken;
          } catch (silentError) {
            // If silent requests fails with InteractionRequiredAuthError,
            // attempt to get the token interactively
            if (silentError instanceof aim.InteractionRequiredAuthError) {
              const interactiveResult = await aimClient.acquireTokenPopup(aimRequest);
              return interactiveResult.accessToken;
            } else {
              throw silentError;
            }
          }
        }
      };
      const dmsClient = aim.Client.initWithMiddleware({authProvider}, dmsConfig);
      dmsConfig = await dmsClient.loadConfig();
      $().schemas(dmsConfig.components.schemas);
      console.log(dmsConfig);
      // return;
      // dmsClient.api('/Contact(265090)').get().then(body => {
      //   console.log(body);
      // }).catch(err => {
      //   console.error(err);
      // })
      // return;
      await $().translate();
      async function signIn() {
        //  Login
        try {
          // Use AIM to login
          console.log('OPTIONS', aimRequest);

          const authResult = await aimClient.loginPopup(aimRequest);
          console.log('id_token acquired at: ' + new Date().toString());
          // Save the account username, needed for token acquisition
          aimClient.storage.setItem('aimAccount', authResult.account.username);
          document.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
      // const aimAccount = aimClient.storage.getItem('aimAccount');
      // $(document.documentElement).class('app');
      $(document.body).om();
      // await $().translate();
      // console.log(aimClient.account, sessionStorage);
      if (aimConfig.info) {
        $('toptitle').text(document.title = aimConfig.info.title).title([aimConfig.info.description,aimConfig.info.version,aimConfig.info.lastModifiedDateTime].join(' '));
      }
      // console.warn(2222, aimConfig);
      // aimConfig.ref.home = 'https://github.com/schiphol-nl/schiphol-nl.github.io/wiki';
      // aimConfig.ref.home = 'https://github.com/aliconnect/sdk/wiki';
      // aimConfig.ref.home = aimConfig.ref && aimConfig.ref.home ? aimConfig.ref.home : 'https://aliconnect.nl/sdk/wiki';
      if (!document.location.search && aimConfig.ref && aimConfig.ref.home) {
        if (document.location.hostname.match(/localhost$/)) {
          // console.error(document.location.hostname, document.location.hostname.match(/localhost$/));
          aimConfig.ref.home = aimConfig.ref.home.replace(/https:\/\/github.com/, 'http://github.localhost');
        }

        window.history.replaceState('page', '', '?l=' + urlToId(aimConfig.ref.home));
      }
      var aimAccount = JSON.parse(aimClient.storage.getItem('aimAccount'));
      // var aimAccount = null;
      if (aimAccount) {
        $.his.elem.navtop.prompts(...$.const.prompt.menu.prompts).append(
          $.his.elem.account = $('a').class('abtn account').caption('Account').href('#?prompt=account').draggable(),
        );
        // await dmsClient.api('/').get().then(body => $.extend(aimConfig, body));
        if (aimConfig.menu) {
          $().tree(...childObject(aimConfig.menu).children);
        }

        async function treeItem(url) {
          const item = await $(url).details();
          $().tree(item);
          return item;
        }


        // await dmsClient.api('/').get().then(e => console.log(999, e.body));
        // return;

        // console.log(1, $().schemas());

        const sub = aimAccount.sub;
        dmsClient.headers = {
          'OData-Version': '3.0',
          'aim-Version': '1.0',
        };

        // console.log('Aangemeld', dmsClient.headers, aimAccount, sub);

        // dmsClient.api('/me').select('CompanyName,Surname').get().then(body => {
        //   console.log('MEEEE', body);
        // }).catch(err => console.error);

        // $.his.items.sub = await $(`https://dms.aliconnect.nl/Contact(${aimAccount.sub})`).details();

        // console.log('a');
        // await $().url('https://dms.aliconnect.nl/me').get();
        // console.log('a');

        const user = $.his.items.sub = await dmsClient.api('/me').get();
        console.log('USER', user);
        // $.his.items.aud = await dmsClient.api(`/Company(${aimClient.clientId})`).get();
        // return console.log('ME', $.his.items.sub, $.his.items.aud);
        //
        $().tree(user);


        // return;
        // await aimClient.api(`/`).query('request_type','visit').get().then(body => $.his.items = body);
        // $.his.elem.account.item($.user, 'accountElem');
        // $.user.emit('change');
        // if (aimConfig.aud) {
        //   $().tree($.his.items.aud = await $(`/Company(${aimConfig.aud})`).details());
        //   $.his.elem.menu.showMenuTop($({tag: `Company(${aimConfig.aud})`}));
        // }
        if ('Notification' in window) {
          var permission = Notification.permission;
          if (Notification.permission === 'default') {
            $.his.elem.navtop.append(
              $('a').class('abtn').text('Notifications').on('click', e => Notification.requestPermission())
            )
          }
        }
      } else {
        $.his.elem.navtop.append(
          // $('div').id('g_id_onload')
          // .attr('data-client_id', '916030731619-t989crc0f9ilh9kvoivapg7216gijtcb.apps.googleusercontent.com')
          // .attr('data-login_uri', 'https://login.aliconnect.nl/maxvankampen/login/callback.php')
          // .attr('data-auto_prompt', 'false'),
          // $('div').class('g_id_signin')
          // .attr('data-type', 'standard')
          // .attr('data-size', 'large')
          // .attr('data-theme', 'outline')
          // .attr('data-text', 'sign_in_with')
          // .attr('data-shape', 'rectangular')
          // .attr('data-logo_alignment', 'left'),
          //
          $('button').class('abtn login').text('Aanmelden').on('click', e => signIn()),
        );
        // <script src="https://accounts.google.com/gsi/client" async defer></script>
      }
    },
    treeview(menu){
      function menuItem(key, obj){
        // console.log(key,obj)
        return $('details').open(1).append(
          $('summary').append(
            $('span').text(key).on('click', e => {
              $('.col.tv>div').querySelectorAll('div').forEach(el => el.attr('select', null));
              e.target.setAttribute('select', '');
              if (typeof obj === 'function') {
                obj();
              } else if (obj && obj.metaData && obj.metaData.l) {
                e.preventDefault();
                const url = obj.metaData.l.url;
                const entries = Object.entries(obj.metaData.l);
                entries.shift();
                const search = '?'+entries.map(e => e.join('=')).join('&').replace(/ /g,'+');
                console.log(search);
                document.location.hash = `#?l=${aim.urlToId(url + search)}`;
              } else {
                // e.preventDefault();
                e.stopPropagation();
              }
            })
          )
        ).append(
          Object.entries(obj||{}).filter(e => e[0]!=='metaData').map(e => menuItem(...e))
        )
      }

      // console.log(menu);
      $('.col.tv>div').append(
        Array.from(Object.entries(menu||{})).map(e => menuItem(...e)),
      )
    },
    listview,
  }

  function url_string(s) {
    return s.replace(/%2F/g, '/');
  }
  function childObject(object, schemaname) {
    // console.log(schemaname);
    if (object) {
      const obj = Object.fromEntries(Object.entries(object).filter(([name, obj]) => typeof obj !== 'object'));
      obj.children = Object
      .entries(object)
      .filter(([name, obj]) => typeof obj === 'object')
      .map(([name, obj]) => Item.get(Object.assign({
        schema: schemaname,
        name: name,
        title: name.replace(/^\d+[-| ]/,'')
      }, childObject(obj, schemaname))));
      return obj;
    }
  }
  function Clipboard() {}
  Object.defineProperties(Clipboard.prototype, {
    undo: { value: function() {
      //console.debug('UNDO', $.his.updateList);
      if (this.undoData = $.his.updateList.shift()) {
        this.undoData.Value.reverse().forEach(function(row) {
          if (row.eventType == 'paste') row.eventType = 'cut';
          else if (row.eventType == 'cut') row.eventType = 'paste';
        });
        this.undoData.from = true;
        $.data.update(this.undoData, true);
      }
    },},
    update: { value: function(data, targetItem, eventType) {
      //if (!data || !targetItem) return false;
      if (!data) return false;
      if (typeof data == 'string') data = JSON.parse(data);
      if (data.Value) {
        //var updateAction = '';
        if (!data.from) $.his.updateList.unshift(data); // Add data to update history list
        data.Value.forEach(function(row, i, rows) {
          var item = Item.create(row.id);
          row.eventType = row.eventType || eventType;
          ////console.debug("UPDATE", eventType, row.eventType, row, targetItem, item);
          if (!item) return;
          switch (eventType || row.eventType) {
            case 'copy':
            targetItem.appendItem(null, { schema: item.schema, Title: item.Title, userID: 0, srcID: item.id }, null, true);
            break;
            case 'link':
            //console.debug('LINK', item);
            new $.HttpRequest($.config.$, 'POST', '/' + targetItem.tag + '/link', { itemID: item.id } ).send();
            // targetItem.appendChild(null, { schema: item.schema, Title: item.Title, detailID: item.id }, null, true);
            break;
            case 'cut':
            ////console.debug('CUT', row.masterID, item.masterID);
            if (row.masterID != item.masterID) {
              //console.debug('NO CUT', row.masterID, item.masterID);
              return;
            }
            if (item.master && item.master.children && item.master.children.length) {
              item.master.children.splice(item.master.children.indexOf(item), 1);
              item.master.children.forEach(function(item, i) { item.index = i });
            }
            if (item.elemTreeLi) item.elemTreeLi.parentElement.removeChild(item.elemTreeLi);
            if (item.elemListLi && item.elemListLi.parentElement) item.elemListLi.parentElement.removeChild(item.elemListLi);
            if (targetItem) {
              ////console.debug('MOVE TO');
              if (targetItem.masterID == targetItem.srcID) {
                //target isClass en verplaatsen: ITEM wordt afgeleid van nieuwe CLASS
                //item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
                //console.debug('MOVE TO CLASS', targetItem, item.srcID = row.srcID = item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
                var propertyAttributeName = item.getPropertyAttributeName('srcID');
                if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.srcID };
                var propertyAttributeName = item.getPropertyAttributeName('masterID');
                if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.masterID };
              }
              else {
                //console.debug('MOVE TO', targetItem.elLI, item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
              }
              ////Item isClass en target !isClass, dus verplaatsen en ITEM wordt afgeleid van nieuwe CLASS
              //if (row.masterID == row.srcID && targetItem.masterID != targetItem.srcID && eventType=="paste") item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
              //item.masterID = targetItem.id;
              if (item.master) {
                item.master.children = item.master.children || [];
                item.master.children.push(item);
                if (item.master.elemTreeLi.elemTreeUl) item.appendTo(item.master.elemTreeLi.elemTreeUl);
              }
            }
            $.Selection.cancel();
            break;
            //case 'paste':
            //	if (row.masterID) {
            //		item.masterID = row.masterID;
            //		if (item.master) {
            //			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);
            //			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);
            //			item.master.children.push(item);
            //			if (item.master.elemTreeLi.elemTreeUl) item.appendTo(item.master.elemTreeLi.elemTreeUl);
            //		}
            //	}
            //	break;
            default:
            break;
          }
        });
        ////console.debug('UPDATE', data);
        //return true;
        // @todo: mkan, versturen via ws
        // if (!data.from) $.ws.send(Object.assign({ post: 1, to: { host: $.config.$.auth.accessToken.aud } }, data));
        return true;
      }
    },},
    cancel: { value: function() {
      //console.debug($.his.items.oncancel);
      return $.his.items.oncancel && $.his.items.oncancel.length ? $.his.items.oncancel.pop()() : null;
    },},
    oncancel: { value: function(fn) {
      const oncancel = $.his.items.oncancel = $.his.items.oncancel || [];
      if (oncancel.includes(fn)) {
        oncancel.splice(oncancel.indexOf(fn), 1);
      }
      oncancel.push(fn);
    },},
    reload: { value: function(href) {
      //console.error('$.reload', href);
      setTimeout(() => {
        if (href) document.location.href = href;
        else document.location.reload();
      },0);
    },},
    // attr(items, attributeName, value) {
    // 	//console.debug(items, attributeName, value, this[attributeName]);
    // 	if (this[attributeName]) {
    // 		this[attributeName].forEach(item => {
    // 			Object.values(item).filter(value => value instanceof Elem).forEach(selector => selector.attr(attributeName, null))
    // 		})
    // 	}
    // 	items.forEach(item => {
    // 		Object.values(item).filter(value => value instanceof Elem).forEach(selector => selector.attr(attributeName, value))
    // 	})
    // 	this[attributeName] = items;
    // },
    items: { value: [], },
    setItem: { value: function(item, attributeName, value) {
      if (!item) throw 'no item';
      e = window.event;
      let items = this[attributeName] || [];
      items.forEach(item => item.setAttribute ? item.setAttribute(attributeName, null) : null);
      // this.items.forEach(item => item.setAttribute(attributeName));
      // $.attr(this.items,'checked');
      // $.attr(this.items,'clipboard');
      if (item) {
        if (Array.isArray(item)) {
          items = item;
          this.itemFocussed = item[0];
        } else {
          if (!e.altKey) {
            if (e.ctrlKey) {
              if (e.shiftKey) {
                // !ALT+CTRL+SHIFT
              } else {
                // !ALT+CTRL+!SHIFT
                items.push(item);
              }
            } else if (e.shiftKey) {
              // !ALT+!CTRL+SHIFT
              // if (this.items.length) {
              // 	//console.error ('find first elem', e.path);
              //
              // }
              items.push(item); // lijst
            } else {
              // !ALT+!CTRL+!SHIFT
              items = [item];
            }
          }
        }
        // items.forEach(item => item.setAttribute(attributeName, this.items.length));
      } else {
        items = [];
      }
      // //console.debug(item);
      value = items.length;
      $().status('is_checked', value);
      items.forEach(item => {
        Object.values(item)
        .filter(value => value instanceof Elem)
        .forEach(selector => selector.attr(attributeName, value))
      });
      this[attributeName] = items;
      return this;
    },},
    length: { get() {
      return this.items.length;
    },},
    push: { value: function(item) {
      if (!this.items.includes(item)) {
        this.items.push(item);
      }
    },},
    copy: { value: function(e) {
      const selection = window.getSelection();
      if (selection.focusNode.nodeType === 3) {
        return;
      }
      // console.log('CLIPBOARD', e.type, selection, selection.focusNode.nodeType, selection.focusNode, selection.ancherNode, selection.extendNode, selection.baseNode);
      if(document.activeElement.isContentEditable || ['INPUT'].includes(document.activeElement.tagName)) {
        return;
      }
      let type = '';
      if (this.clipboardItems) {
        this.clipboardItems.forEach(item => item.setAttribute('clipboard'));
        this.clipboardItems = [];
      }
      if (e) {
        e.preventDefault();
        if (this.data) {
          e.clipboardData.setData('application/json', JSON.stringify(this.data));
          e.clipboardData.setData('Text', JSON.stringify(this.data));
          this.data = null;
        } else {
          type = e.type;
          const items = this.clipboardItems = this.checked;
          items.forEach(item => item.setAttribute('clipboard', type));
          const data = {type: type, value: items.map(item => {return { tag: item.tag, title: item.title }})};
          e.clipboardData.setData('aim/items', JSON.stringify(data));
          e.clipboardData.setData('text', items.map(Item.toText).join('\n'));
          e.clipboardData.setData('text/html', items.map(Item.toHtml).join(''));
          $().status('clipboard', `${type}: ${this.clipboardItems.length}`);
        }
      }
    },},
    remove: { value: function(item) {
      console.debug('REMOVE');
      if (this.items.includes(item)) {
        this.items.splice(this.items.indexOf(item), 1);
      }
    },},
    cancel: { value: function(e){
      this.setItem([]);
    },},
    clear: { value: function(e){
      //console.debug('clear');
      $.attr(this.items,'clipboard');
      this.items = [this.itemFocussed];
      document.execCommand('copy');
      // this.setItem([]);
      return;
    },},
    paste: { value: function(e) {
    },},
    link: { value: function() {
      for (var i = 0, o; o = $.selapi.item[i]; i++) {
        //console.debug(o);
      }
    },},
    delete: { value: function() {
      for (var i = 0, o; o = $.selapi.item[i]; i++) {
        //console.debug(o);
      }
    },},
    copyToClipboard: { value: function(obj) {
    $.clipboard.data = obj;
    // // $('input').value(JSON.stringify(obj)).focus().select();
    // const el = e => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   console.log(obj);
    // };
    // window.addEventListener('copy', el);
    document.execCommand('copy');
    // window.removeEventListener('copy', el);
    // const el = $('input')
    // .parent(document.body)
    // // .value(JSON.stringify(obj))
    // .focus()
    // .select()
    // .on('copy', e => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   console.log('COPY', obj);
    // });
    // // window.addEventListener('copy', el, true);
    // document.execCommand('copy');
    // el.remove();
    // // window.removeEventListener('copy', el, true);
  },},
  });
  function Attr() {}
  Object.defineProperties(Attr.prototype, {
    displayvalue: { value: function(value, property) {
      if (value === undefined) {
        return null;
      }
      if (property) {
        if (property.options && property.options[value]) {
          // console.log(property.name, value, property.options[value].title);
          return property.options[value].title;
        }
        if (property.type === 'datetime') {
          return value ? new Date(value).toLocaleString() : null;
        }
      }
      return value;
    },},
  });
  const prompts = {};
  const promptElems = {};
  aim().on({
    // connect: handleEvent,
    message(e){
      if (e.body && e.body.code){
        $.his.replaceUrl( '#');
        $.auth.loginWindow.close();
        $.auth.get_access_token(e.body);
      }
    },
    // logout(e){
    //   $.clipboard.reload('https://login.aliconnect.nl/api/oauth?' + new URLSearchParams({
    //     prompt: 'logout',
    //     client_id: config.auth.client_id || config.auth.clientId,
    //     redirect_uri: document.location.origin,
    //   }).toString());
    // },
  });
	function ScriptLoader() {
		let loaded = [];
		let loading = [];
		let args = [];
		let callback;
		this.load = function(files) {
			if (files) {
				let difference = files.filter(x => !loaded.includes(x));
				if (!difference.length) return true;
				loading = files;
				callback = arguments.callee.caller;
				args = arguments.callee.caller.arguments;
			}
			if (!loading.length) return callback(...args);
			let src = loading.shift();
			if (loaded.includes(src)) {
				return arguments.callee();
			}
			loaded.push(src);
			//console.log('SCRIPT', src);
			document.head.createElement('script', {
				src: src,
				onload: e => arguments.callee(),
			});
		}
	};
	scriptLoader = new ScriptLoader();
	function Popup(e) {
		// //console.log('POPUP');
		e = e || window.event;
		let targetElement = e.path.find(targetElement => targetElement.popupmenu || targetElement.contextmenu);
		//console.error('POPUP', targetElement);
		if (!targetElement) return;
		e.preventDefault();
		e.stopPropagation();
		let targetRect = targetElement.getBoundingClientRect();
		let menuItems = targetElement.popupmenu || targetElement.contextmenu;
		// let popupPageElement = targetElement.createElement('DIV', 'popupPage', { oncontextmenu: e => {
		// 	e.stopPropagation();
		// }});
		if (this.handlers.menuElement) {
			this.handlers.menuElement.remove();
		}
		let menuElement = this.handlers.menuElement = targetElement.createElement('DIV', 'col popup', { oncontextmenu: e => {
			e.stopPropagation();
		}});
		targetElement.addEventListener('mouseleave', e => {
			//console.log('mouseleave', e.target === targetElement);
			if (e.target === targetElement) {
				this.close();
			}
			// //console.log('OUT', e.target === menuElement);
		}, true);
		this.close = e => {
			menuElement.remove();
			window.removeEventListener('click', this.close, true);
		};
		// window.addEventListener('mousedown', e => {
		// 	if (e.path.find(elem => elem === menuElement)) {
		// 		return;
		// 	}
		// }, true);
		// var menu = $.mainPopup;
		if (targetElement.popupmenu) {
			targetElement.right = 0;
		}
		// //console.debug('POS', targetElement, targetRect, targetElement.left, targetElement.right);
		// //console.debug('PUMENU', this, this.menu, menu, pos);
		menuElement.innerText = '';
		for (let [menuname, menuitem] of Object.entries(menuItems)) {
			// let title = __(menuitem.header0 || menuname);
			// //console.debug('MENUITEM', menuitem, title);
			if (menuitem.hidden) continue;
			var linkElement = menuElement.createElement('A', {
				name: menuname,
				value: menuname,
				elMenu: menuElement,
				left: 5,
				menuitem: menuitem,
				popupmenu: menuitem.menu,
				// item: this.item,
				onclick: menuitem.onclick || (this.menu ? this.menu.onclick : null) || targetElement.onselect || function (e) {
					//console.log ('MENU CLICK');
					e.stopPropagation();
				},
				// onselect: this.onselect,
				onmouseenter: this.enter
			}, menuitem, {
				className: 'row abtn icn ' + (menuitem.className || menuname),
			});
			if (menuitem.color) {
				linkElement.createElement('icon', {}).style = 'background-color:' + menuitem.color;
			}
			linkElement.createElement('SPAN', 'aco', __(menuitem.header0 || menuname));
			if (menuitem.key) {
				linkElement.createElement('SPAN', '', menuitem.key);
			}
		};
		var top = targetRect.bottom;
		if ('left' in targetElement) {
			// var left = pos.right;
			var left = pos.left;
		} else if ('right' in targetElement) {
			var left = targetRect.right - menuElement.clientWidth, top = targetRect.bottom;
		} else {
			var left = e.clientX, top = e.clientY;
		}
		// //console.log(top, window.screen.availHeight, clientHeight);
		// var innerWidth = window.innerWidth;
		// window.addEventListener('resize', e => {
		// 	//console.log(e, e.currentTarget.innerWidth, e.target.innerWidth);
		// 	resizeLeft = (window.innerWidth - innerWidth) / 2;
		// 	innerWidth = window.innerWidth;
		// 	menu.left += resizeLeft;
		// 	menu.style.left = menu.left + 'px';
		// })
		left = Math.max(0, left);
		// var top = Math.max(48, Math.min(top, window.screen.availHeight - clientHeight - 10));
		menuElement.style.left = left + 'px';
		menuElement.style.top = top + 'px';
		menuElement.style.maxHeight = (window.screen.availHeight - top) + 'px';
	};
	Popup.prototype = {
		handlers: {},
		enter(e) {
			// //console.debug('ENTER', this.elMenu == $.mainPopup);
			e.stopPropagation();
			if (this.elMenu.menuitemFocused) {
				this.elMenu.menuitemFocused.removeAttribute('focus');
			}
			this.elMenu.menuitemFocused = this;
			this.elMenu.menuitemFocused.setAttribute('focus', '');
			if (this === $.mainPopup) {
				$.subPopup.elem.innerText = '';
			}
			if (this.menu) {
				$.subPopup.show.call(this);
			}
		},
	};
  const Aliconnector = {
		/** @function Aliconnector.outlookImportMail
		*/
		outlookImportMail: function(){
			ws.send({ to: { deviceUID: $.deviceUID }, msg: { external: 'mailimport' } });
		},
		/** @function Aliconnector.outlookImportContacts
		*/
		outlookImportContacts: function(){
			ws.send({ to: { deviceUID: $.deviceUID }, msg: { external: 'mailimport' } });
		},
	};
  // (function () {
  //   const config = {
  //     apiPath: document.currentScript.src.split('/js')[0],
  //   };
  //   if (document.currentScript.attributes)
  //   (new URL(document.currentScript.src)).searchParams.forEach((value, key)=>$.extend(config, minimist([key,value])));
  //   [...document.currentScript.attributes].forEach(attribute => $.extend(config, minimist(['--'+attribute.name.replace(/^--/, ''), attribute.value])));
  //   (new URLSearchParams(document.location.search)).forEach((value,key)=>$.extend(config, minimist([key,value])));
  //   $.extend({config:config});
  // })()


  function importScript(src) {
    return new Promise((resolve, reject) => {
      function loaded(e) {
        e.target.loading = false;
        for (let [key,value] of Object.entries(e.target)) {
          if (typeof value === 'function') {
            Elem.prototype[key] = value;
          }
        }
        resolve();
      }
      for (let script of [...document.getElementsByTagName('SCRIPT')]) {
        if (script.getAttribute('src') === src) {
          return script.loading ? $(script).on('load', loaded) : resolve();
        }
      }
      var el = $('script').src(src).parent(document.head).on('load', loaded);
      el.elem.loading = true;
    });
  }
  function prompt(selector, context) {
    console.warn('PROMPT', selector, context);
    if (selector instanceof Object) {
      return Object.assign(prompts, selector);
    } else if (context) {
      return prompts[selector] = context;
    }
    const is = $('.prompt') || $('section').parent(document.body).class('prompt').append(
      $('button').class('abtn abs close').attr('open', '').on('click', e => aim.prompt(''))
    );
    const currentSelector = is.attr('open');
    const keys = Object.keys(prompts);
    is.attr('open', selector ? selector : null);
    if (prompts[selector]) {
      const url = new URL(document.location);
      url.searchParams.set('prompt', selector);
      window.history.replaceState('page', '', url.href);
      const prompt = prompts[selector];
      context = prompts[selector];
      const promptElem = promptElems[selector] = promptElems[selector] || $('div').parent(is).class('col', selector).on('open', typeof context === 'function' ? context : function () {
        this.is.text('').append(
          $('h1').ttext(selector),
          $('form').class('col')
          .properties(context.properties)
          .btns(context.btns),
        )
      });
      const index = keys.indexOf(selector);
      Object.values(promptElems).forEach(elem => elem.attr('pos', ''));
      var currentIndex = 0;
      if (currentSelector) {
        var currentIndex = keys.indexOf(currentSelector);
        promptElems[currentSelector].attr('pos', currentIndex < index ? 'l' : 'r');
      }
      if (promptElem && promptElem.attr) {
        promptElem.attr('pos', currentIndex > index ? 'l' : 'r');
        clearTimeout(this.promptTimeout);
        promptElem.emit('open');
        this.promptTimeout = setTimeout(() => promptElem.attr('pos', 'm'),10);
        return promptElem;
      }
    }
    return this;
  }
  function promptform(url, prompt, title = '', options = {}){
    options.description = options.description || aim.his.translate.get('prompt-'+title+'-description') || '';
    title = aim.his.translate.get('prompt-'+title+'-title') || title;
    console.log([title, options.description]);
    options.properties = options.properties || {};
    // Object.entries(aim.sessionPost).forEach(([key,value])=>Object.assign(options.properties[key] = options.properties[key] || {type:'hidden'}, {value: value, checked: ''}));
    aim.sessionPost = aim.sessionPost || {};
    //console.log('aim.sessionPost', aim.sessionPost);
    Object.entries(aim.sessionPost).forEach(([selector,value])=>Object.assign(selector = (options.properties[selector] = options.properties[selector] || {type:'hidden'}), {value: selector.value || value, checked: ''}));
    return prompt.form = aim('form').parent(prompt.is.text('')).class('col aco').append(
      aim('h1').ttext(title),
      prompt.div = aim('div').md(options.description),
    )
    .properties(options.properties)
    .append(options.append)
    .btns(options.btns)
    .on('submit', e => url.query(document.location.search).post(e).then(e => {
      console.log(e.body);

      self.sessionStorage.setItem('post', JSON.stringify(aim.sessionPost = e.body));
      // return;
      // return console.log('aim.sessionPost', aim.sessionPost);
      if (aim.sessionPost.id_token) {
        localStorage.setItem('id_token', aim.sessionPost.id_token);
        aim().send({ to: { nonce: aim.sessionPost.nonce }, id_token: aim.sessionPost.id_token });
      }
      if (aim.sessionPost.url) {
        if (aim.messageHandler) {
          console.log(aim.sessionPost.url);
          aim.messageHandler.source.postMessage({url: aim.sessionPost.url}, aim.messageHandler.origin);
          // self.close();
          return;
        }
        document.location.href = aim.sessionPost.url;
      }


      if (aim.sessionPost.prompt) prompt = aim.prompt(aim.sessionPost.prompt);
      if (aim.sessionPost.msg && prompt && prompt.div) {
        prompt.div.text('').html(aim.sessionPost.msg);
      }
      if (aim.sessionPost.socket_id) {
        return aim().send({to:{sid:aim.sessionPost.socket_id}, body:aim.sessionPost});
      }
      // return;
      // // //console.log(e.target.responseText);
      // if (!e.body) return;
      // aim.sessionPost = e.body;
      // aim.responseProperties = Object.fromEntries(Object.entries(aim.sessionPost).map(([key,value])=>[key,{format:'hidden',value:value}]));
      //
      // // //console.log('aim.sessionPost', aim.sessionPost);
      // [...document.getElementsByClassName('AccountName')].forEach((element)=>{
      //   element.innerText = aim.sessionPost.AccountName;
      // });
      // if (e.body.msg) {
      //   e.target.formElement.messageElement.innerHTML = e.body.msg;
      //   //console.log(e.target.formElement.messageElement);
      // } else if (e.body.socket_id) {
      //   //console.log('socket_id', e.body);
      //   // return;
      //   aim.WebsocketClient.request({
      //     to: { sid: e.body.socket_id },
      //     body: e.body,
      //   });
      //   self.close();
      // } else if (e.body.url) {
      //   // return //console.error(e.body.url);
      //   // if ()
      //
      //   document.location.href = e.body.url;
      // } else {
      //   //console.log(e.body);
      //   // document.location.href = '/api/oauth' + document.location.search;
      // }
    }).catch(err => {
      console.error(err, prompt, prompt.div);
      if (err.error && prompt && prompt.div) {
        prompt.div.text('').html(err.error.message);
      }
    }))
  }


  Object.assign(aim, {
    Clipboard,
    Popup,
    ScriptLoader,
    Om,
    Elem,
    libraries,
    attr: new Attr,
    checkPath: (e) => {
      let elem;
      if (elem = e.path.find(elem => elem.item)) {
        e.itemElement = elem;
        e.item = e.itemElement.item;
      }
    },
    checkkey: (e) => {
      const path = $.his.clickEvent ? [...$.his.clickEvent.path] : [];
      path.push($);
      path.forEach(elem => {
        // const onkey = elem['on' + e.type];
        // // //console.log(e, elem, onkey);
        // if (onkey) {
        // 	onkey.call(elem, e);
        // }
        const keys = elem[e.type];
        if (keys && keys[e.keyPressed]) {
          keys[e.keyPressed].call(elem, e);
        }
      })
    },
    eventKeyState: (e) => {
      return e ? (e.shiftKey && e.ctrlKey ? 'link' : (e.shiftKey ? 'move' : (e.ctrlKey ? 'copy' : 'default'))) : 'default';
    },
    handleData: (targetItem, e) => {
      if(document.activeElement.isContentEditable || ['INPUT'].includes(document.activeElement.tagName)) {
        return;
      }
      console.log('web.js.handleData', e, e.view === window);

      if (targetItem) {
        console.log(targetItem);
        const eventData = e.dataTransfer || e.clipboardData;
        const type = $.his.keyEvent && $.his.keyEvent.shiftKey ? 'link' : e.type;
        let data;
        if (eventData.types.includes('Files')) {
          e.preventDefault();
          e.stopPropagation();
          const files = [...eventData.files];
          const xls = files.find(file => file.name.includes('.xls'));
          if (xls) {
            return importXlsFile(xls);
          }
          files.forEach(targetItem.elemFiles.appendFile)
        } else if (data = eventData.getData("aim/items")) {
          data = JSON.parse(data);
          data.type = data.type || (e.ctrlKey ? 'copy' : 'cut');
          data.target = targetItem.tag;
          if (data.value) {
            const targetItem = Item.get(data.target);
            console.log(data, targetItem, data.value);
            if (data.type === 'cut') {
              const parent = targetItem;
              // return;
              // data.value.forEach(item => targetItem.append($(item.tag)));
              data.value.forEach(item => $.link({
                name: 'Master',
                item: item,
                to: targetItem,
                current: item.Master,
                index: 99999,
                action: 'move',
              }));
            } else if (data.type === 'copy') {
              const items = [];
              (async function copy (item) {
                if (item) items.push(item);
                const source = data.value.shift();
                if (source) return await $().copyFrom(source, targetItem).then(copy);
                item = items.shift();
                //console.log(item, $().tree());
                $().tree().setFocusElement(item.elemTreeLi.elem);
                item.edit();
              })();
            }
          }
          // TODO: files cut copy uitwerken
          if (data.files) {
            if (type === 'cut') {
              data.files.forEach(ofile => {console.warn('cut', ofile);} );
            } else if (type === 'copy') {
              data.files.forEach(ofile => {console.warn('copy', ofile);} );
            }
          }
          e.preventDefault();
          e.stopPropagation();
        } else if (data = eventData.getData("text/html")) {
          // //console.debug('HTML', html);
          // importeer html img if pasted
          var tmpStr = data.match("<!--StartFragment-->(.*)<!--EndFragment-->");
          var fragment = tmpStr[1];
          // //console.debug('FRAGMENT', fragment);
          if (fragment.substr(0, 3) == '<a>') {
            console.debug('REF', fragment);
          }
          else if (fragment.substr(0, 5) == '<img ') {
            console.debug('IMG', fragment);
          }
          //return;
        } else if (data = eventData.getData("text")) {
          if (data.substr(0, 4) == 'http') {
            //console.debug('URL', data);
          }
        }
      }
      $.clipboard.dragItems = [];
    },
    handleEvent: (e) => {
      if (e){
        if (e.body){
          console.error('handleEvent', e.body);//JSON.parse(e.target.responseText));
          // console.error('CONNECT API', connectState, e.body);
          $.extend(e.body);
          // Ophalen localhost web applicatie config file
          if ($.config_url){
            let res = new XMLHttpRequest();
            res.open('get', $.config_url);
            res.onload = e => $.url('https://aliconnect.nl/v1beta1/api?request_type=yamlToJson', e.target.response).post().then(handleEvent);
            res.send();
            $.config_url = null;
            return;
          }
          $().emit('config');
          new $.WebsocketRequest();
        }
        if (e.type === 'connect' && e.socket_id && $.his.cookie.id_token){
          uploadState({ type: 'focus' });
        }
      }
      connectState++;
      if (connectState === 2){
        if (window.addEventListener){
          window.addEventListener('focus', uploadState);
          window.addEventListener('blur', uploadState);
        }
        $.auth.init();
        if ($.webinit){
          $.webinit();
        }
      }
    },
    hrefSrc: (href, src = '/') => {
      if (href[0]==='#') return href;
      // console.log(href, src, new URL(src, document.location).href);
      if (href.match(/^http/)) return href;
      href = new URL(href, new URL(src, document.location)).href.replace(/^.*?\//,'/');
        // console.log(href);
      return href;
      // return href.toLowerCase();
    },
    importScript,
    linkify: (inputText) => {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    },
    listview,
    loadStoredCss: () => {
      const css = JSON.parse(localStorage.getItem('css')) || {};
      for (let [id, param] of Object.entries(css)) {
        let selector = id === '_body' ? document.body : document.getElementById(id);
        if (selector) {
          selector.style.cssText += Object.entries(param).map(entry => entry.join(':')).join(';');
        }
      }
    },
    onkey: (e) => {
      window.event = e;
      e.keyPressed = [
        e.ctrlKey ? 'ctrl_' : '',
        e.shiftKey ? 'shift_' : '',
        e.altKey ? 'alt_' : '',
        e.code,
      ].join('');
      $.his.keyEvent = null;
      clearTimeout($.his.keydownTimeout);
      clearTimeout($.his.keyupTimeout);
      clearTimeout($.his.keybufferTimeout);
      $.his.keybufferTimeout = setTimeout(() => $.his.keybuffer = [], 300);
      $.his.keybuffer = $.his.keybuffer || [];
      $.his.keybuffer.push(e.key);
      e.keybuffer = $.his.keybuffer;
      // if (document.activeElement !== document.body) {
      // 	e.keyPressed += '_edit';
      // }
      // 	key = key.replace('Arrow', '').replace('Escape', 'Esc');
      checkPath(e);
      if ($.his.clickEvent) {
        e.itemElement = e.itemElement || $.his.clickEvent.itemElement;
        e.item = e.item || $.his.clickEvent.item;
        e.clickEvent = $.his.clickEvent;
      }
    },
    prompt,
    promptform,
    search,
    urlString: (s = '') => {
      return s.replace(/%2F/g, '/');
    },
  });

  // console.log(1, this.global);
  Object.defineProperties(aim, {
    clipboard: { value: new Clipboard() },
    initEvents: { value: function () {
      $(window)
      .on('afterprint', e => {
        //var e = Listview.elOa;
        ////console.debug('BEFORE PRINT'); //items.printiframe(Listview.elOa);
        //if ($.elPrintDiv) $.elPrintDiv.innerText = '';
      })
      .on('beforeunload', e => {
        if ($.his.handles) for (var name in $.his.handles) { $.his.handles[name].close(); }
      })
      .on('beforeprint', e => {
        //var e = Listview.elOa;
        //console.debug('BEFORE PRINT'); //items.printiframe(Listview.elOa);
        return;
        if (!$.printElement) {
          $.printElement = document.body.createElement('DIV', 'doc-content printablediv' ); //document.body.createElement('table', { className: 'printablediv', style: 'width:100%;' });
        }
        //$.elPrintDiv.innerHTML = $.printdiv.innerHTML;
        with ($.printElement) {
          //console.debug($.printSource, $.printHeader);
          innerText = '';
          if (!$.printHeader) return innerHTML = $.printSource.innerHTML;
          with (createElement('TABLE', 'border', {  style: 'width:100%;' })) {
            //with (createElement('thead').createElement('TR').createElement('th').createElement('DIV', { style: 'display:table;table-layout:fixed;width:100%;' }).createElement('DIV', { style: 'display:table-row;' })) {
            //    createElement('DIV', { style: 'display:table-cell;width:35mm;padding:10px;border-bottom:solid 1px #ccc;vertical-align:middle;' }).createElement('img', { src: Files && Files[1] ? Files[1].src : '' });
            //    with (createElement('DIV', { style: 'display:table-cell;padding:10px;border-bottom:solid 1px #ccc;vertical-align:top;' })) {
            //        if ($.printheader) {
            //            createElement('DIV', { className: 'kop0', innerText: $.printheader.kop0 || '' });
            //            createElement('DIV', { className: 'kop1', innerText: $.printheader.kop1 || '' });
            //            createElement('DIV', { className: 'kop2', innerText: $.printdiv ? $.printdiv.Title : $.printheader.kop2 || '' });
            //        }
            //    }
            //}
            createElement('thead').createElement('TR').createElement('TH', '', $.printHeader.innerHTML );
            createElement('tbody').createElement('TR').createElement('TD', 'doc', $.printSource.innerHTML );
            with (createElement('tfoot').createElement('TR').createElement('TH').createElement('DIV')) {
              createElement('SPAN', '', 'Printed: ' + new Date().toLocaleString() + ' by ' + $.accountName, { style: 'float:right;'});
            }
          }
        }
      })
      .on('blur', e => {
        $.his.focussed = false;
        document.body.setAttribute('blur', '');
        clearTimeout($.his.stateTimeout);
        $.his.stateTimeout = setTimeout(() => $().state('inactive'), 500);
      })
      .on('click', e => {
        // return; // DEBUG:
        checkPath(e);
        $.his.clickEvent = e;
        const sectionElement = e.path.find(elem => elem.tagName === 'SECTION' && elem.id);
        if (sectionElement) {
          document.body.setAttribute('section', sectionElement.id);
        }
      }, true)
      .on('click', e => {
        // return; // DEBUG:
        $.clickEvent = e;
        // return;
        $.his.clickElement = e.target;
        $.his.clickPath = e.path = e.path || function(el) {
          var path = [];
          while (el) {
            path.push(el);
            el = el.parentElement;
          };
          return path;
        } (e.target);
        // //console.log($('colpanel'));
        if (document.getElementById('colpanel') && !$.his.clickPath.includes($('colpanel'))) {
          // $.request('?prompt=');
        }
        // const itemElement = e.path.find(itemElement => itemElement.item);
        // if (itemElement) {
        // 	$.clipboard.setItem(itemElement.item);
        // }
        let elem = e.target;
        // //console.debug('CLICK', el, el.$infoID);
        //if (this.printable) $.printdiv = this;
        // //console.log(this);
        //// //console.debug('CLICK', this.get);
        // if (el.hasAttribute('accept') && el.tagName !== 'INPUT') {
        // 	//console.log('ACCEPT', itemElement.item);
        // 	if (itemElement.files) {
        // 		itemElement.files.openDialog();
        // 		return;
        // 	}
        // }
        // DEBUG: MAX
        // if (elem.hasAttribute('open')) {
        //   $(elem).select();
        // }
        // if (elem = e.path.find(elem => elem instanceof Element && elem.hasAttribute('open'))) {
        // 	$.el.select.call(elem);
        // }
        if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
          for (let elem of e.path.filter(elem => elem instanceof Element)) {
            if (elem.is && elem.is.has('ofile') && elem.is.get('ofile').src.match(/\.(jpg|png|bmp|jpeg|gif|bin|mp4|webm|mov|3ds)/i)) {
              return $(document.body).slider(elem)
            }
            // if (elem.hasAttribute('src')) {
            //   return document.location.href = '#?src='+elem.getAttribute('src');
            // }
            if (elem.hasAttribute('href')) {
              if (elem.getAttribute('href').match(/^\/\//)) {
                console.log('CLICK MAIN href REL');

                e.preventDefault();
                $().execQuery('l', urlToId(elem.getAttribute('href')));
                // $('list').load(elem.getAttribute('href'))
                return;
              }
              if (window.colpage) {
                if (elem.getAttribute('href')[0] === '#' && elem.getAttribute('href')[1] === '/') {
                  return $().exec(elem.getAttribute('href').substr(1));
                } else if (elem.getAttribute('href').includes('.pdf') && !elem.download) {
                  e.preventDefault();
                  return new $.Frame(elem.href);
                }
                // } else if (elem.getAttribute('href')[0] !== '#' && elem.href.includes(document.location.origin)) {
                //   e.preventDefault();
                //   window.history.pushState('page', 'test1', elem.href);
                //   $(window).emit('popstate');
                //   // $('list').load(elem.getAttribute('href')+'.md');
                //
                //   // console.log();
                //   return;// e.preventDefault();
              }
            }
          }
        }
        if ($.mainPopup) {
          $.mainPopup.close();
          $.subPopup.close();
        }
        //if (window.colpanel && ref.clickPath.indexOf(colpanel) == -1) $.prompt.open();
        //alert(ref.clickPath);
        // //console.log(1, e.target);
        for (var i = 0, el; el = $.his.clickPath[i]; i++) {
          if (el.itemID) {
            console.debug('itemID');
            var item = $.getItem(el.itemID);
            if (item) document.location.href = '#' + item.schema + '/' + item.id + '?select=*';
            return false
            //$.show({ id: this.itemID });
          }
          else if (el.set) {
            $.url.set(el.set);
            return false
            //$.show({ id: this.itemID });
          }
          else if (el.$infoID) {
            //console.debug('infoID');
            e.stopPropagation();
            $.getItem(el.$infoID, item => {
              item.showinfo();
              el.remove();
            });
            return;
          }
          //if (this.pnl)
          //if (this.par) {
          //	$.show(this.par);
          //	e.stopPropagation();
          //	e.preventDefault();
          //	return false;
          //}
          //else if (this.colName) $.setfocus(this);
          else if (el.colName) {
            document.body.setAttribute('ca', el.colName);
            $.colActive = el;
            $.elColActive = el;
            $.printSource = el;
          }
          else if (el.elClose) el.elClose.parentElement.removeChild(el.elClose);
          // else if (el.get) $().exec(el.get);//$.url.set(typeof this.get == 'function' ? this.get() : this.get);
          if ($.targetItem = el.item) {
            break;
          }
        }
        // //console.log('ONCLICK MAIN', e.target);
        // //if ($.targetItem && $.targetItem.focus) $.targetItem.focus(e);
        //
        // // if ($.prompt.panelName) {
        // // 	$.prompt('');
        // // }
        //
        //
        //
        //  // MKA is denk ik vervallen omdat er een algemeen window on click e is die het path bepaald
        // return;
        //
        // ////console.debug('OM CLICK', e);
        //
        // //if ($.mainPopup) {
        // //	$.mainPopup.close();
        // //	$.subPopup.close();
        // //}
        // //$.clickElement = e.target;
        // //$.clickPath = e.path;
        // //for (var i = 0, el; el = $.clickPath[i]; i++) if ($.targetItem = el.item) break;
        // //if ($.targetItem && $.targetItem.focus) $.targetItem.focus(e);
        // return;
        //
        //
        // var el = $.clickElement = e.target;
        // while (el && !el.item) el = el.parentElement;
        // if (!el) return;
        // $.targetItem = el.item;
        // //console.debug('itemClicked', $.clickElement, $.targetItem.id, $.targetItem.Title, $.targetItem, e);
        //
        // if (msg.newItem) msg.write();
        //
        // //$.play('/wav/Windows Notify Email.wav').then(function() { //console.debug('PLAYING'); }, function() { //console.debug('NOT PLAYING'); });
        //
        //
        //
        //
        //
        // $.activeElement = e.path ? e.path.shift() : e.target;
        // if ($.activeElement.item && $.activeElement.item.focus) $.activeElement.item.focus(e);//aimClient.selection.cancel();
        // //Element.Pulldown.el.innerText = '';
      })
      .on('copy', e => $.clipboard.copy(e))
      .on('cut', e => $.clipboard.copy(e))
      .on('dragend', e => {
        $().status('source');
        $().status('target');
        const dragItems = $.clipboard.dragItems;
        //console.log('dragend', e.dataTransfer.dropEffect, dragItems, e, e.view === window);
        switch (e.dataTransfer.dropEffect) {
          // case 'move': {
          // 	if (dragItems) {
          // 		if (e.view === window) return;
          // 		//console.log('dragend', e);
          // 		dragItems.forEach(item => item.remove());
          // 	}
          // 	return;
          // }
          // // if drop outside window then open window
          case 'none': {
            var outside = e.screenX > window.screenX + window.outerWidth || e.screenX < window.screenX || e.screenY > window.screenY + window.outerHeight || e.screenY < window.screenY;
            if (outside) {
              return dragItems.forEach(item => item.popout(e.screenX,e.screenY));
            }
          }
          // case 'move' : {
          // 	dragItems.forEach(item => item.parent.removeChild(item));
          // }
        }
      })
      .on('dragenter', e => {
        if (
          e.dataTransfer.types.includes('aim/items') ||
          e.dataTransfer.types.includes('Files')
        ){
          const targetItemElement = e.path.filter(elem => elem.item).shift();
          if (targetItemElement instanceof Element) {
            e.stopPropagation();
            setTimeout(() => ($.his.targetItemElement = targetItemElement).setAttribute('target', ''));
          }
        }
      })
      .on('dragleave', e => {
        if ($.his.targetItemElement) {
          $.his.targetItemElement.removeAttribute('target');
        }
      })
      .on('dragover', e => {
        if ($.his.targetItemElement) {
          $().status('target', $.his.targetType = eventKeyState(e));
          e.dataTransfer.dropEffect = e.ctrlKey ? (e.shiftKey ? 'link' : 'copy') : 'move';
          // e.dataTransfer.dropEffect = e.ctrlKey ? (e.shiftKey ? 'link' : 'copy') : 'move';
        }
        e.preventDefault();
      })
      .on('dragstart', e => {
        // letop ook files selecteren in AIm.Selection gebaseerd op ofile in path
        // console.log(e.type);
        $().status('source', $.his.sourceType = eventKeyState($.his.keyEvent));
        var elem = e.path.find(elem => elem.ofile);
        if (elem) {
          var dragItems = $.clipboard.items.includes(elem.ofile) ? $.clipboard.items : [elem];
          e.dataTransfer.setData('aim/items', JSON.stringify({files: dragItems.map(elem => elem.ofile)}));
        } else {
          var item = e.path.filter(elem => elem.item).map(elem => elem.item).shift();
          var dragItems = $.clipboard.items.includes(item) ? $.clipboard.items : [item];
          e.dataTransfer.setData('aim/items', JSON.stringify({
            value: dragItems.map(Item.toData),
            sid: $().ws().socket_id,
          }));
          e.dataTransfer.setData('text', dragItems.map(Item.toText).join('\n'));
          e.dataTransfer.setData('text/html', dragItems.map(Item.toHtml).join(''));
        }
        $.clipboard.dragItems = dragItems;
        //console.log(dragItems);
      })
      // .on('drop', e => $.his.targetItemElement ? handleData($.his.targetItemElement.item, e) : null)
      .on('drop', e => {
        e.preventDefault();
        handleData($.his.targetItemElement.item, e);
      })
      .on('focus', e => {
        // console.log('FOCUS');
        if (!$.his.focussed) {
          $.his.focussed = true;
          document.body.removeAttribute('blur');
          $().state('available');
          // $.send();
          // setTimeout(function() { $.auth.setstate('focus'); }, 100);
          // if ($.user.sub) $.auth.check_state();
          ////if (!aimClient.user) return;
          //var data = { activestate: 'focus', accountID: $.client.account.id, userID: $.auth.sub, to: [$.key] };
          //ItemSetAttribute(data.userID, 'activestate', data.activestate);
          //ItemSetAttribute(data.accountID, 'activestate', data.activestate);
          //ws.send(data);
          ////// //console.debug('onfocus start');
          ////msg.check(true); HOEFT NIET GEBEURD VIA EVENT RT SERVER
          //new $.HttpRequest({
          //    api: 'window/focus/' + aliconnect.deviceUID,
          //    //post: { exec: 'onfocus', deviceUID: aimClient.user ? aliconnect.deviceUID : '', },
          //    onload: function() {
          //        //// //console.debug('onfocus done', this.post, this.responseText);
          //        //if (aimClient.user && $.auth.sub && this.data.UserID != $.auth.sub) $.show({ wv: 1, apnl: 'login' });//document.location.href = '?wv=1&apnl=login';
          //    }
          //});
        }
      })
      .on('keyup', onkey, true)
      .on('keyup', checkkey)
      .on('keydown', onkey, true)
      .on('keydown', checkkey)
      .on('keydown', e => {
        switch (e.keyPressed) {
          case 'F1': {
            aim.prompt('help');
            e.preventDefault();
            return;
          }
          case 'Escape': {
            if (window.activeElement) return;
            if ($.clipboard.copyItems && $.clipboard.copyItems.length) {
              return $.clipboard.copy();
            }
            // if ($('view').show() && $('view').show().elem && $('view').show().elem.innerText) {
            //   return $('view').show().elem.innerText = '';
            // }
            if (document.activeElement && document.activeElement.cancel && document.activeElement.cancel()) {
              return;
            }
            if ($.his.iframeElement) {
              $.his.iframeElement.remove();
            }
            if ($.imageSlider && $.imageSlider.elem) {
              $.imageSlider.close();
            }
            if (new URLSearchParams(document.location.search).has('prompt')) {
              aim.prompt('');
            }
            if (document.activeElement === $.elMsgTextarea) {
              contentEditableEnd($.elMsgTextarea.blur());
            }
            if ($().tree().editing) {
              $().tree().editcancel(Treeview.elINP.Value = Treeview.elINP.initValue)
            }
            if ($('colpage').elFrame) {
              $('colpage').elFrame.close(e);
            }
            // $().tree().cancel();
            // $.tree().edit.cancel() ||
            // $.popup().cancel() ||
            // $.edit().cancel() ||
          }
          // EscapeEdit: keyEscape,
          // F2(e) {
          // 	if ($.path.includes($('self'))) {
          // 		if (self.focusElement) {
          // 			return self.focusElement.edit();
          // 		}
          // 	}
          // 	if ($.pageItem) {
          // 		return $.pageItem.PageEditElement();
          // 	}
          // },
          // pv: {
          // 	EscEdit: function(e) {
          // 		if ($.pageItem && $.pageItem.editing) {
          // 			e.preventDefault();
          // 			$.pageItem.editclose();
          // 		}
          // 	},
          // 	UpShiftAlt: function(e) {
          // 		var field = document.activeElement.field;
          // 		if (field.aid) {
          // 			var el = field.el;
          // 			if (el.previousElementSibling) {
          // 				el.parentElement.insertBefore(el, el.previousElementSibling);
          // 				field.elINP.focus();
          // 			}
          // 		}
          // 		e.preventDefault();
          // 	},
          // 	Up: function(e) {
          // 		if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.previousElementSibling) {
          // 			document.activeElement.field.el.previousElementSibling.field.elINP.focus();
          // 			e.preventDefault();
          // 		}
          // 		e.preventDefault();
          // 	},
          // 	Down: function(e) {
          // 		if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.nextElementSibling) {
          // 			document.activeElement.field.el.nextElementSibling.field.elINP.focus();
          // 			e.preventDefault();
          // 		}
          // 	},
          // 	DownShiftAlt: function(e) {
          // 		var field = document.activeElement.field;
          // 		if (field.aid) {
          // 			var el = field.el;
          // 			if (el.nextElementSibling) {
          // 				el.parentElement.insertBefore(el, el.nextElementSibling.nextElementSibling);
          // 				field.elINP.focus();
          // 			}
          // 		}
          // 	},
          // },
          // //tv: {		},
          // //lv: {		},
          // //CtrlKeyP: function() {
          // //	//if (!) document.body.createElement('DIV', { className: 'divprint' , innerHTML:colpage.innerHTML});
          // //	//e.preventDefault();
          //
          // //},
          //
          //
          // // ShiftShift wordt gegenereerd door scanner voor barcode. Bij scannen code tree select resetten
          // ShiftShift: function() {
          // 	Treeview.selstart = null;
          // },
          // CtrlKeySEdit: function(e) {
          // 	if ($.pageItem && $.pageItem.editing) {
          // 		e.preventDefault();
          // 		//if (document.activeElement && document.activeElement.onblur) document.activeElement.onblur();
          // 		//if (document.activeElement && document.activeElement.onchange) document.activeElement.onchange();
          // 		//$.pageItem.btnSave.focus();
          // 		$.pageItem.btnSave.click();
          // 	}
          // },
          // CtrlKeyZ: function(e) {
          // 	$.undo();
          // },
          // //KeyCCtrl: function(e) {
          // //    return $.clipboard.copy();
          // //},
        }
      })
      .on('keydown', e => {
        // //console.log(e, window.event);
        $().state('available');
        // 	if (key == 'Enter') {
        // 		if ($.setting.keybuf.length == 10 && !isNaN($.setting.keybuf)) return auth.keyloggin($.setting.keybuf);
        // 		$.setting.keybuf = $.setting.keybuf.split('CapsLockCapsLock');
        // 		if ($.setting.keybuf[1]) {
        // 			bc = $.setting.keybuf.pop();
        // 			//console.debug(bc);
        // 			private.search.Value = bc;
        // 			$.formfind.onsubmit();
        // 		};
        // 		$.setting.keybuf = '';
        // 	} else {
        // 		$.setting.keybuf += e.key;
        // 	}
        // onkey(e);
        $.his.keyEvent = e;
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
          e.preventDefault();
          document.execCommand('copy');
        }
        // //console.log('keydown', e, e.keyPressed);
        e.previousKey = $.his.previousKey;
        $.his.previousKey = e.keyPressed;
      }, true)
      .on('message', e => {
        // if (e && e.body && e.body.code) {
        // 	$.auth.get_access_token(e.body);
        // 	// return $.auth.login({
        // 	// 	code: e.body.code,
        // 	// 	client_id: $.config.$.client_id,
        // 	// });
        //
        // 	// $.his.cookie = {
        // 	// 	id_token: e.body.id_token,
        // 	// }
        // 	// //console.error('document.cookie', document.cookie);
        // 	//
        // 	//
        // 	// //console.debug('id_token', e.body.id_token);
        // 	// $.extendLocal({auth:{id_token: e.body.id_token}});
        // 	// document.cookie = 'id_token=' + e.body.id_token;
        // 	// $.auth.id_token = e.body.id_token;
        // 	// new $.WebsocketRequest({
        // 	// 	to: {
        // 	// 		sid: e.from_id,
        // 	// 	},
        // 	// 	message_id: e.id,
        // 	// 	body: {
        // 	// 		state: 'ack',
        // 	// 	},
        // 	// }, e => {
        // 	// 	//console.log('RESPONSE ACK ACK', e.body);
        // 	// });
        // 	//
        // }
        // var data = e.body;
        // if (!data) return;
        // //console.debug('ON MESSAGE WEB DATA', e);
        const data = e;
        if (e.body && e.body.Master && e.body.Master.LinkID) {
          const parent = $.ref[Number(e.body.Master.LinkID)];
          const item = $.ref[Number(data.ID)];
          if (parent && item) {
            $.noPost(() => {
              item.movetoidx(parent, Number(e.body.Master.Data));
            })
          }
        }
        // if (data.changeData) {
        // 	return changeData(data.changeData);
        // }
        if (data.state && data.description && document.getElementById('aimStatusMsg'))
        document.getElementById('aimStatusMsg').innerText = data.description;
        switch (data.state) {
          case 'datatransfered':
          for (var name in data.values) {
            for (var c = document.getElementsByName(name), el, i = 0; el = c[i]; i++) el.Value = data.values[name];
          }
          break;
        }
        if (data.systemalert) {
          // //console.debug('ONMESSAGE ALERT', data);
          if (!document.getElementById('alertpanel')) return;
          if (!$.elAlertrow) {
            with (document.getElementById('alertpanel')) {
              $.elAlertsum = document.getElementById('alertsum') || createElement('DIV', { className: 'col', id: 'alertsum' });
              $.elAlertrow = document.getElementById('alertrow') || createElement('DIV', { className: 'col aco', id: 'alertrow' });
            }
          }
          if (!$.alerts[data.systemalert.id]) $.alerts[data.systemalert.id] = $.elAlertrow.createElement('DIV', {
            className: data.systemalert.categorie, innerText: [data.systemalert.Title, data.systemalert.created].join(' '),
            onchange: function(e) {
              // //console.debug('CHANGE', this);
              if ('condition' in this) this.setAttribute('condition', this.condition);
              if ('ack' in this) this.setAttribute('ack', this.ack);
              if (this.ack && !this.condition) { $.alerts[this.id] = null; $.elAlertrow.removeChild(this); }
            },
            onclick: function() {
              ws.send({ systemalert: { id: this.id, ack: this.ack = 1 } });
              this.onchange();
            }
          });
          Object.assign($.alerts[data.systemalert.id], data.systemalert).onchange();
        }
        return;
        if (data.itemID && data.attributeName && ('value' in data)) {
          c = document.getElementsByName([data.itemID, data.attributeName].join('.'));
          for (var i = 0, e; e = c[i]; i++) e.setAttribute('value', data.Value);
          var c = document.getElementsByClassName(data.itemID);
          for (var i = 0, e; e = c[i]; i++) e.setAttribute(data.attributeName, data.Value);
          if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'MeshColor') {
            window.meshapi.item[data.itemID].src.basiccolor = data.Value;
            window.meshapi.item[data.itemID].colorSet(data.Value);
          }
          if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'err') {
            for (var i = 0, c = $.his.err.children, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == data.itemID) break;
            if (elErrRow) {
              elErrRow.elEnd.innerText = (elErrRow.end = new Date()).toISOString().substr(11, 8);
              elErrRow.refresh();
            }
            else with ($.his.err.insertBefore(elErrRow = $.his.err.createElement('DIV', { className: 'row err start', itemID: data.itemID, meshitem: window.meshapi.item[data.itemID], start: new Date() }), $.his.err.firstChild)) {
              createElement('SPAN', { className: 'icon' });
              createElement('SPAN', { className: '', innerText: window.meshapi.item[data.itemID].src.name });
              createElement('SPAN', { className: '', innerText: data.Value });
              createElement('SPAN', { className: '', innerText: elErrRow.start.toISOString().substr(11, 8) });
              elErrRow.elAccept = createElement('SPAN', { className: '', innerText: '' });
              elErrRow.elEnd = createElement('SPAN', { className: '', innerText: '' });
              elErrRow.refresh = function() {
                if (this.end && this.accept) {
                  this.meshitem.colorSet();
                  $.his.err.removeChild(this);
                }
                $.his.errCont.style = $.his.err.children.length ? '' : 'display:none;';
                window.onWindowResize();
              };
              elErrRow.refresh();
            }
          }
        }
        return;
        //console.debug('message', e.body);
        if (e.body) $.data.update(e.body);
        // var data = e.body;
        if (data.Value)
        ////console.debug('ONMESSAGE OM', this, e);
        ////console.debug('onreceive', this.data);
        //if (data.Notification) $.Notification.create(data.Notification);
        if (data.state && data.fraim.app === 'aliconnector' && data.fraim.ip == $.client.ip) {
          ////console.debug('CONNECT');
          document.body.setAttribute('aliconnector', $.aliconnector.state = data.state);
          // if (data.state=='disconnected') {
          // 	$.hasConnector=false;
          // 	//document.body.style.color='red';
          // }
          if (data.state == 'connected') {
            //$.hasConnector=true;
            //document.body.style.color='green';
            if (!data.ack) ws.send({ to: { client: data.fraim.client }, state: 'connected', ack: 1 });
            if (data.fraim.device != $.client.device.id) {
              //alert('SYNC ALICONNECT DEVICE_ID');
              ws.send({ to: { client: data.fraim.client }, device: $.client.device });
              ////console.debug('CONNECT ALICONNECTOR', senddata);
            }
          }
        }
        //{
        //	//console.debug('Notification', data.Notification);
        //	$.Notification.Notify(data.Notification.Title, data.Notification.options);
        //	//{
        //	//	body: "Bericht geplaatst door " + data.get.from,
        //	//	url: "https://aliconnect.nl/tms/app/om/#id=" + data.get.id,
        //	//	//url: "https://aliconnect.nl/moba/app?lid=;2101;;FinishDateTime+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
        //	//	//icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //	//	//image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //	//	data: data,
        //	//});
        //}
        //if (data.Value) data.Value.forEach(function(item) {
        //});
        ////console.debug('OnReceive', data);
        ////console.debug(data);
        //if (data.supportmessage) $.Notification.create(data.supportmessage);
        if (data.reload) document.location.href = document.location.href;
        if (data.app === 'aliconnector') {
          if (!msg) return;
          $.aliconnector = msg;
          //console.debug('aliconnector', msg);
          if (msg.state == 'connected') {
            ws.send({ to: { deviceUID: $.deviceUID }, msg: { userName: $.accountName || $.client.user.name, userUID: $.userUID } });
            //Notify("EWR 4292 Updated", {
            //    body: "TL20 on packing lanes before CP12",
            //    url: "https://aliconnect.nl/moba/app?lid=;2101;;FinishDateTime+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
            //    icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
            //    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
            //});
            //Notify('fdsgsdfgsdfgs');
          }
          if (msg.state) {
            //ws.send({ broadcast: true, msg: { id: $.Account.sub, uid: $.userUID, state: msg.state } });
            //document.body.setAttribute('aliconnector', msg.state);
          }
          //{
          //    document.body.setAttribute('aliconnector', 'online');
          //}
          //return;
          //if ($.aliconnector.state == 'init') ws.send({ to: { deviceUID: $.deviceUID }, msg: { userName: $.accountName } });
          //clearTimeout($.toaliconnector);
          //$.toaliconnector = setTimeout(function() { document.body.setAttribute('aliconnector', $.aliconnector.state = 'offline'); }, 40000);
          ////console.debug('ONLINE SERVICE', data);
          //document.body.setAttribute('aliconnector', 'online');
        }
        //if (msg.post && msg.post.item && $.ref[msg.post.item.id]) {
        //    var item = $.ref[msg.post.item.id];
        //    //console.debug(document.location.href);
        //    //Notify(item.Title, {
        //    //    body: "Modified by user",
        //    //    icon: item.files && item.files[0] ? "https://aliconnect.nl" + item.files[0].src : null, //"https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //    //    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
        //    //    data: { id: item.id, url: document.location.href },
        //    //});
        //}
        if (data.editfiledone) {
          var c = document.getElementsByName(data.editfiledone);
          for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', '');
        }
        if (data.editfile) {
          data.editfile = data.editfile.split('/').pop();
          var c = document.getElementsByName(data.editfile);
          for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'editing');
        }
        //if ($.ref[data.id]) ItemSetAttribute(data.id, data.name, data.Value);
        //if (msg.items) itemset(msg.items);//for (var id in msg.items) if ($.ref[id]) { msg.items[id].id = id; itemset(msg.items[id]); }
        //if (data.activestate) {
        //    ItemSetAttribute(data.userID, 'activestate', data.activestate);
        //    ItemSetAttribute(data.accountID, 'activestate', data.activestate);
        //    //if ($.ref[data.userID]) {
        //    //    $.ref[data.userID].guistate = data.guistate;
        //    //    var c = document.getElementsByName('state' + data.accountID);
        //    //}
        //    //if ($.ref[data.accountID]) $.ref[data.accountID].guistate = data.guistate;
        //    //for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'online');
        //    //if ($.ref[data.accountID]) $.ref[data.accountID].onlinestate = 'online';
        //}
        //if (data.a == 'blur') {
        //    var c = document.getElementsByName('state' + data.accountID);
        //    for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'offline');
        //    if ($.ref[data.accountID]) $.ref[data.accountID].onlinestate = 'offline';
        //}
        if (data.alert) alert(data.alert);
        //if (data.deviceUID == $.deviceUID) {
        return;
        //}
        if (data.a == 'submit' && $.getItem(data.id) && $.getItem(data.id).modifiedDT != data.modifiedDT) {
          ////console.debug('SUBMIT', data.id);
          //if (data.hostID == $.config.$.auth.accessToken.aud) {
          ////console.debug('SUBMIT', data, $.config.$.auth.accessToken.aud, get.id, data.id);
          if (get.id == data.id) {
            $.getItem(data.id).reload();
          } else if ($.getItem(data.id)) {
            $.getItem(data.id).loaded = false;
          }
          msg.check();
          //}
        }
      })
      .on('mousemove', e => {
        $.his.clickPath = e.path;
        $().state('available');
        // if (e.target.item) // //console.log(e.target.tagName, e.target.item);
        // if (!$.his.clickPath.includes($)) $.his.clickPath.push($);
      })
      .on('paste', e => handleData($.clipboard.itemFocussed, e))
      .on('resize', e => {
        if ($.mainPopup) {
          $.mainPopup.close();
          $.subPopup.close();
        }
        // if (document.body.clientWidth < 400 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'phone');
        // else if (document.body.clientHeight < 400 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'phonewide');
        // else if (document.body.clientWidth < 800 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'tablet');
        // else if (document.body.clientHeight < 800 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'tabletwide');
        // else document.body.setAttribute('device', device = 'pc');
      })
      .on('scroll', e => {

        if ($('doc') && $('doc').elem && $('doc').elem.lastChild) {
          const lastdoc = $('doc').elem.lastChild;
          if (lastdoc && lastdoc.doc) {
            const docelem = lastdoc.doc.docElem;
            // console.log(docelem, docelem.findAll);
            if (!$.toScroll) {
              // const div = Math.abs(lastScrollTop - docelem.elem.scrollTop);
              // clearTimeout(to);
              $.toScroll = setTimeout(() => {
                // console.log('re');
                $.toScroll = null;
                // if (div > 50) {
                lastScrollTop = document.body.scrollTop;
                let elem = docelem.findAll.find(elem => elem.getBoundingClientRect().top < docelem.elemTop) || docelem.topItem;
                // console.log(docelem.findAll);
                // let elem = all.find(elem => elem.offsetParent );
                // console.log(elem.innerText, elemTop, elem.getBoundingClientRect().top, elem.getBoundingClientRect().height, all.indexOf(elem));
                // return;
                // elem = all[all.indexOf(elem)-1];
                docelem.allmenu.forEach(a => a.attr('open', '0').attr('select', null));
                const path = [];
                for (var p = elem.a.elem; p.tagName === 'A' && p.parentElement && p.parentElement.parentElement; p=p.parentElement.parentElement.parentElement.firstChild) {
                  p.setAttribute('select', '');
                  p.setAttribute('open', '1');
                  path.push(p);
                }
                $(elem.a.elem).scrollIntoView();
                if ($('navDoc')) {
                  $('navDoc').text('').append(...path.reverse().map(elem => ['/', $('a').text(elem.innerText)]))
                }
                // elem.li.select();
                // $()
                // let elem = all.forEach(elem => //console.log(elem.getBoundingClientRect().top));
                // //console.log(elem, elem.li);
                // }
              }, 500);
            }
          }
        }
        // console.error(docelem, docelem.doc);



        if ($.mainPopup) {
          $.mainPopup.close();
          $.subPopup.close();
        }
        var st = window.pageYOffset || document.documentElement.scrollTop;
        var scrolldir = st > 50 && st > $.lastScrollTop ? 'down' : 'up';
        if ($.his.body) $.his.body.setAttribute('scroll', scrolldir);
        $.lastScrollTop = st;
        if (Element && Element.iv) {
          if (window.toscroll) clearTimeout(window.toscroll);
          toscroll = setTimeout(function() {
            var e = Element.iv, ot = 0;
            while (e = e.parentElement) ot += e.offsetTop;
            ////console.debug(ot);
            for (var i = 0, elHFocus, elNext; elNext = hapi.item[i]; i++) {
              if (elNext.offsetTop > st - ot) break;
              elHFocus = elNext;
            }
            elHFocus = elHFocus || elNext;
            var c = Element.iv.getElementsByTagName('LI');
            ////console.debug(c);
            //var elFocus = null, elPrev = null;
            for (var i = 0, e; e = c[i]; i++) {
              //if (e.h.offsetTop - 25 >= st) elFocus = elFocus || elPrev || e;
              //elPrev = e;
              if (e.hasAttribute('open')) e.setAttribute('open', 0);
              e.removeAttribute('focus');
            }
            ////console.debug(elHFocus.innerText, elHFocus.elemTreeLi);
            Element.iv.style.paddingTop = Math.max(0, st - ot + 50) + 'px';
            if (elHFocus) {
              elPar = elFocus = elHFocus.elemTreeLi;
              ////console.debug('FOCUS', elHFocus.innerText, elHFocus.elemTreeLi, elPar.innerText);
              //var otf = elFocus.offsetTop;
              //elFocus = elFocus || elPrev || e;
              elFocus.setAttribute('focus', 1);
              while (elPar.h) {
                ////console.debug('FOCUS', elPar.innerText, elPar.offsetTop, elPar.tagName);
                //otf += elPar.offsetTop + 30;
                if (elPar.hasAttribute('open')) elPar.setAttribute('open', 1);
                elPar = elPar.parentElement.previousElementSibling;
              }
              ////console.debug('go');
              //while ((elFocus = elFocus.parentElement) && elFocus != Element.iv.firstChild) {
              //    //console.debug(elFocus.offsetTop);
              //    otf += elFocus.offsetTop;
              //}
              //console.debug('TOTAL', Element.iv.firstChild.getBoundingClientRect().top, elFocus.getBoundingClientRect().top);
              ////console.debug(elPar.innerText, elPar.offsetTop);
              //otf += elPar.offsetTop;
              //elFocus.scrollIntoView({ block: "nearest", inline: "nearest" });
              //var br = Element.iv.getBoundingClientRect();
              //var bre = elFocus.getBoundingClientRect();
              if (scrolldir == 'down') Element.iv.style.paddingTop = (st - ot - elFocus.getBoundingClientRect().top + Element.iv.firstChild.getBoundingClientRect().top + 50) + 'px';
              //else Element.iv.style.paddingTop = (st - ot + 50) + 'px';
              ////console.debug(st, bre.top, elHFocus.offsetTop);
            }
          }, 300);
        }
        // $.player.onscroll();
        ////console.debug(document.documentElement.clientHeight, Element.iv.clientHeight, Element.iv.firstChild.clientHeight, document.documentElement.clientHeight);
        //Element.iv.style.paddingTop = Math.min(Element.iv.clientHeight - Element.iv.firstChild.clientHeight - 300, Math.max(0, document.documentElement.scrollTop - 300)) + 'px';
      })
      .on('unload', e => {
        // aimClient.api.setactivestate('offline');
      });
    } },
    producties: {value: async function(elem){

      // console.log('producties');

      const producties = [];

      const { PDFDocument } = PDFLib;


      // var doc = new jsPDF();
      // var elementHandler = {
      //   '#ignorePDF': function (element, renderer) {
      //     return true;
      //   }
      // };
      // var source = document.getElementById('doc-content');//window.document.getElementsByTagName("body")[0];
      // doc.fromHTML(
      //     source,
      //     15,
      //     15,
      //     {
      //       'width': 180,'elementHandlers': elementHandler
      //     });
      //
      //     window.open(doc.output('bloburl'))
      //
      // // doc.output("dataurlnewwindow");
      //
      // return;
      // var pdf = new jsPDF('p','pt','a4');
      // pdf.addHTML(document.getElementById('doc-content'), e => {
      //   pdf.save('web.pdf');
      // });
      // return;
      const docs = [];
      const pdfDoc = await PDFDocument.create();

      const links = Array.from(elem.querySelectorAll('a')).filter(a => a.href && a.href.match(/\.pdf$/));
      let i=1;
      Array.from(elem.querySelectorAll('a')).filter(a => a.href && a.href.match(/\.pdf$/)).forEach(a => {
        a.className = 'productie-link';
        if (producties[a.href]) {
          a.text = producties[a.href].link;
        } else {
          producties.push(producties[a.href] = {
            text: a.innerText,
            // link: a.innerText = `productie ${i}, ${a.innerText.toLowerCase()}`,
            link: a.innerText = `productie ${i}`,
            href: a.href,
            i: i++,
          });
        }
      })

      await (async function(){
        const pdfBytes = await fetch('https://aliconnect.nl/api/Aim/Pdf', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          // mode: 'cors', // no-cors, *cors, same-origin
          // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'text/html'
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          // body: JSON.stringify(data), // body data type must match "Content-Type" header
          body: document.querySelector('.doc-content').innerHTML, // body data type must match "Content-Type" header
        }).then((res) => res.arrayBuffer());
        const pdfLoad = await PDFDocument.load(pdfBytes);
        const pages = pdfLoad.getPages();
        for (let page of pages) {
          const embedPage = await pdfDoc.embedPage(page);
          pdfDoc.addPage().drawPage(embedPage);
        }
      })()




      for (let productie of producties) {

        var doc = new jsPDF();

        let top = 20;
        let marginLeft = 20;
        doc.setFontSize(22);
        doc.setFontSize(22);
        doc.text(marginLeft, top+=10, 'Productie');
        doc.setFont('helvetica'); // string: courier | times | helvetica
        doc.setFontType("italic"); // string: italic | bold | bolditalic
        doc.setTextColor(255, 0, 0); // red
        doc.setTextColor(150); // light gray
        doc.setTextColor(100); // gray
        doc.text(marginLeft, top+=10, String(productie.i));
        doc.setTextColor(0); // black
        doc.setFontSize(16);
        doc.text(marginLeft, top+=10, productie.text);
        // doc.fromHTML('');

        const docArray = doc.output('arraybuffer');

        const firstDoc = await PDFDocument.load(docArray);
        const firstPage = await pdfDoc.copyPages(firstDoc, firstDoc.getPageIndices());
        firstPage.forEach((page) => pdfDoc.addPage(page));


        const pdfBytes = await fetch(productie.href).then((res) => res.arrayBuffer());
        const pdfLoad = await PDFDocument.load(pdfBytes);
        const pages = pdfLoad.getPages();
        for (let page of pages) {
          const embedPage = await pdfDoc.embedPage(page);
          pdfDoc.addPage().drawPage(embedPage);
        }
      }
      const pdfBytes = await pdfDoc.save();

      let file = new Blob([pdfBytes], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      // download(pdfBytes, "doc.pdf", "application/pdf");

      // window.open(doc.output('bloburl'))
      // return;
      // window.open(doc.output('dataurlnewwindow'));
      // return doc.output('dataurlnewwindow');     //opens the data uri in new window
      // return doc.output('datauri');              //opens the data uri in current window
      // doc.output('datauristring');        //returns the data uri string
      // doc.output('save', 'filename.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
      // doc.save('Test.pdf');
      //
      // return
      // // console.log(111, elem, elem.getElementsByTagName('A'));
      // const links = Array.from(elem.getElementsByTagName('A')).filter(a => a.href);
      // let ip = 1;
      // links.forEach((a,i) => {
      //   if (a.href.match(/pdf$/)) {
      //     if (producties[a.href]) return a.text = producties[a.href].toLowerCase();
      //     const title = producties[a.href] = 'Productie ' + ip++ + ', ' + a.text;
      //     a.text = title.toLowerCase();
      //
      //     $(elem).append($('h1').class('productie').text(title));
      //
      //     const divElem = $('div').parent(elem);
      //     var loadingTask = pdfjsLib.getDocument(a.href);
      //     loadingTask.promise.then(async pdf => {
      //       // console.log('PDF loaded');
      //       var numPages = pdf.numPages;
      //       // console.log(pdf);
      //       for (var pageNumber=1, numPages = pdf.numPages;pageNumber<=numPages;pageNumber++) {
      //         await pdf.getPage(pageNumber).then(function(page) {
      //           // console.log('Page loaded');
      //
      //           var scale = 1;
      //           var viewport = page.getViewport({scale: scale});
      //
      //           // Prepare canvas using PDF page dimensions
      //           // var a = $('a').parent(divElement).href(divElement.getAttribute('source'));
      //           var canvas = $('canvas').parent(divElem).elem;
      //           // document.body.appendChild(canvas);
      //           // var canvas = document.getElementById('the-canvas');
      //           var context = canvas.getContext('2d');
      //           canvas.height = viewport.height;
      //           canvas.width = viewport.width;
      //
      //           // Render PDF page into canvas context
      //           var renderContext = {
      //             canvasContext: context,
      //             viewport: viewport
      //           };
      //           var renderTask = page.render(renderContext);
      //           renderTask.promise.then(function () {
      //             // console.log('Page rendered');
      //           });
      //         });
      //       }
      //
      //       // Fetch the first page
      //     }, function (reason) {
      //       // PDF loading error
      //       console.error(reason);
      //     });
      //     // console.log(source);
      //   }
      //   if (a.href.match(/jpg$/)) {
      //     if (producties[a.href]) return a.text = producties[a.href].toLowerCase();
      //     const title = producties[a.href] = 'Productie ' + (i+1) + ', ' + a.text;
      //     $(elem).append($('h1').class('productie').text(title));
      //     a.text = title.toLowerCase();
      //     $('img').parent(elem).src(a.href);
      //   }
      // })
    }},
  });


  $.his.openItems = localStorage.getItem('openItems');
  let localAttr = localStorage.getItem('attr');
  $.localAttr = localAttr = localAttr ? JSON.parse(localAttr) : {};

  const apiorigin = $.httpHost === 'localhost' && $().storage === 'api' ? 'http://localhost' : $.origin;
  // aim = $.aim = $('aim');
  require = function () {};

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the e so it can be triggered later.
    // deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    // showInstallPromotion();
    // Optionally, send analytics e that PWA install promo was shown.
    // console.error(`LETOP 'beforeinstallprompt' e was fired.`);
    // alert('install');
  });
  // console.log(1, document.currentScript.attributes.libraries.value);


  // console.log('WEB');
  // const el = document.createElement('link');
  // el.rel = 'stylesheet';
  // el.href = 'https://aliconnect.nl/v1/api/css/web.css';
  // document.head.appendChild(el);
  // function require(){};
  $.his.openItems = $.his.openItems ? $.his.openItems.split(',') : [];
  window.console = window.console || { log: function() { } };
  window.Object = window.Object || {
    assign: function(dest) {
      for (var i = 1, source; source = arguments[i]; i++) for (var name in source) dest[name] = source[name];
      return dest;
    },
    values: function(obj) {
      var arr = [];
      for (var name in obj) arr.push(obj[name]);
      return arr;
    }
  };
  (function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('append')) {
        return;
      }
      Object.defineProperty(item, 'append', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function append() {
          const argArr = Array.prototype.slice.call(arguments);
          const docFrag = document.createDocumentFragment();
          argArr.forEach(function(argItem) {
            const isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          this.appendChild(docFrag);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
  let match = document.location.pathname.match(/(.*)(api|docs|omd|om)(?=\/)/);
  if (match) {
    $.basePath = match[0];
  }
  localAttr.set = function(id, selector, context) {
    localAttr[id] = localAttr[id] || {};
    if (context === null) {
      delete localAttr[id][selector];
    } else {
      localAttr[id][selector] = context;
    }
    localStorage.setItem('attr', JSON.stringify(localAttr));
  };
  $(document.documentElement).attr('lang', navigator.language);
  $().on('ready', async e => {
    // console.log('web ready', $.prompts);
    if ($.prompts) {
      $.prompt($.prompts);
    }
    return;
    // await $().emit('ready');
    // //console.log('web ready2',$(), $().ws());
    // $.prompt('TEST', e => {
    // 	alert(1);
    // });
    // $.prompt('TEST');
    // return;
    // initConfigCss();
    loadStoredCss();
    // loadStoredAttr();
    // initAllSeperators()
    if (document.getElementById('colpage')) {
      Object.assign(document.getElementById('colpage'), {
        cancel(e) {
          //console.log('PAGE CANCEL', this);
        },
        keydown: {
          F2(e) {
            if (this.item) {
              this.item.PageEditElement()
            }
          }
        },
      });
    }
    // //console.log('AFTER READY', document.location.hostname);
    // setTimeout(() => {
    //   //console.log('web after ready')
    //   $(window).emit('popstate');
    //   $(window).emit('focus');
    // })
    //console.log('web ready done')
  });
  // this.sw();

  const currentScript = document.currentScript;
  const scriptPath = currentScript.src.replace(/\/js\/.*/, '');
  [...currentScript.attributes].forEach(attribute => $.extend({config: minimist(['--'+attribute.name.replace(/^--/, ''), attribute.value])}));
  (new URLSearchParams(document.location.search)).forEach((value,key)=>$.extend({config: minimist([key,value])}));

  config = {};
  aim.searchParams = new URLSearchParams(document.location.search);
  window.addEventListener('load', async e => {
    // // if (aim.config.client_id) {
    //   config = await aim.api('/aliconnect/config').query({
    //     path: 'https://aliconnect.nl/forms/config',
    //     response_type: 'data',
    //     hostname: document.location.hostname,
    //     client_id: aim.config.client_id,
    //   })
    //   .get()
    //   .then(res => res.json());
    //   // console.log(1, config, config.client);
    //   // config = JSON.parse(config);
    //   // console.log(JSON.parse(config));
    //
    //
    //   if (config && config.components && config.components.schemas) {
    //     Object.entries(config.components.schemas).forEach(([schemaName, schema]) => schema.cols = Object.entries(schema.properties||{}).map(([name,prop]) => Object.assign({name: name}, prop)));
    //   }
    //   // console.log(111, config, aim.config.client_id);
    //   // return;
    // // }
    // Object.assign(aim.config, config);
    // aim.config.client_id = aim.config.client_id || aim.config.client.client_id;
    // // console.warn('START', aim.config)
    //
    //
    //
    //
    var firstFolder = document.location.pathname.match(/(\w+)\//);
    if (firstFolder && libraries[firstFolder[1]]) {
      await libraries[firstFolder[1]]();
    } else {
      if (currentScript.attributes.libraries) {
        for (lib of currentScript.attributes.libraries.value.split(',')) {
          await libraries[lib]();
        }
      }
    }
    await $().emit('load');
    await $().emit('ready');
    function seturl(e){
      if (aim.href === document.location.href) return;
      aim.href = document.location.href;
      // e.stopPropagation();
      const docsearchParams = new URLSearchParams(document.location.search);
      const searchParams = new URLSearchParams(document.location.hash ? document.location.hash.substr(1) : document.location.search);
      // console.log('seturl', e.type, searchParams, aim.searchParams);
      // console.log('seturl', searchParams);
      searchParams.forEach((value,key) => docsearchParams.set(key,value));
      searchParams.forEach((value,key) => aim[key] ? aim[key](value) : null);
      // console.log(aim.searchParams.get('l'), searchParams.get('l'));

      if (docsearchParams.get('l') || docsearchParams.get('id')) {
        if (docsearchParams.get('l')) {
          if (searchParams.get('l') || searchParams.get('$search')) {
            const listUrl = new URL(aim.idToUrl(docsearchParams.get('l')));
            if (docsearchParams.get('$search')) {
              listUrl.searchParams.set('$search', docsearchParams.get('$search'));
            }
            docsearchParams.set('l', aim.urlToId(listUrl));
            const hostname = new URL(listUrl).hostname;
            const client = aim.clients.get(hostname);
            // console.log(client);
            if (client) {
              client.api(listUrl.href).get().then(async body => {
                console.log(listUrl.href, body);
                // const items = body.value || body.Children || await body.children;
                listShow(body);
                // aim().list(items);
              });
            } else {
              // aim('list').load(refurl.href);
            }
          } else if (!docsearchParams.get('l')) {
            $('.lv').text('');
          }
        }
        if (searchParams.get('id')) {
          page(atob(searchParams.get('id')));
        } else if (!docsearchParams.get('id')) {

        }
      } else {
        // const pathname = document.location.pathname.substr(1) || 'Home';


      }
      // console.log(aim.searchParams);
      if (aim.searchParams) {
        // console.log(aim.searchParams.get('id'), docsearchParams.get('id'));
        if (aim.searchParams.get('id') && !docsearchParams.get('id')) {
          $('.pv').text('');
        }
      }
      docsearchParams.hash = '';
      aim.searchParams = docsearchParams;
      // if (e.type === 'hashchange') {
        window.history.replaceState('','','?' + docsearchParams.toString());
      // }
    }
    $(window).on('popstate', seturl)
    $(window).on('hashchange', seturl)
    await $(window).emit('popstate');
    await $(window).emit('focus');
  })

})();
