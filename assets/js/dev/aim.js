(function(global, factory) { typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.aim = factory()); }(this, function (exports) {
  eol = '\n';

  const self = this;
  function aim(selector, context){
    // console.error(1);
    if (aim.Elem && selector instanceof aim.Elem) return selector;
    if (!(this instanceof aim)) return new aim(...arguments);
    // if (!selector) return new aim('aim');
    if (selector){
      if (self.Item && selector instanceof self.Item){
        return selector;
      }
      this.selector = selector;
    }
    selector = selector || 'aim';
    if (['string','number'].includes(typeof selector)){
      if (aim.his.map.has(selector)){
        selector = aim.his.map.get(selector);
        if (context) aim(selector).extend(context);
        return selector;
      } else if (self.document) {
        // selector = TAGNAMES.includes(selector) ? document.createElement(selector) : (document.getElementById(selector) || selector)
        // const element = document.getElementById(selector);
        // selector = element ? element : (aim.Elem && aim.Elem.tagnames.includes(selector) ? document.createElement(selector) : selector);
        // console.log(7, selector);
        selector = aim.Elem ? new aim.Elem(...arguments) : selector;
        // console.log(6, selector);
      }
    }
    // console.warn(5, selector, self.Element, selector instanceof self.Element);
    // console.log(selector, selector instanceof self.Element, aim.Elem);
    if (self.Element && selector instanceof self.Element) {
      if (aim.his.map.has(selector.id)) {
        return aim.his.map.get(selector.id);
      }
      if (aim.Elem) {
        return new aim.Elem(selector);
      }
    }
    if (aim.Elem && selector instanceof aim.Elem) {
      if (selector.elem.id) {
        aim.his.map.set(selector.elem.id, selector);
      }
      return selector;
    }
    // if(!(this instanceof aim)) return new aim(...arguments);
    if (typeof selector === 'string'){
      if (selector.match(/\w+\(\d+\)/)){
        return Item.get(selector);
      } else {
        this.id(selector);
        if (context) {
          this.set(context);
          return context;
        }
      }
    // } else if (self.Item && selector instanceof Item) {
    //   return selector;
    } else if (typeof Window !== 'undefined' && selector instanceof Window) {
      return this;
    } else if (selector.ID || selector.LinkID || selector.tag) {
      // //console.log(selector, selector.ID, selector.LinkID, selector.tag);
      return Item.get(selector);
    }
    this.extend(context)
  };
  const $ = aim;
  const libUrl = 'https://aliconnect.nl/npm/@aliconnect/lib@0.0.0/dist';
  // const Elem = self.elem ? self.elem.Elem : null;
  const dmsOrigin = 'https://aliconnect.nl';
  const dmsUrl = 'https://dms.aliconnect.nl';
  const AUTHORIZATION_URL = 'https://login.aliconnect.nl/oauth';
  const AUTHORIZATION_TOKEN_URL = 'https://login.aliconnect.nl/token';
  let aimClient;
  //use b in some fashion.
  // attach properties to the exports object to define
  // the exported module properties.
  // const isModule = typeof module === "object" && typeof exports === "object";
  // self = isModule ? global : self;
  // document = self.document;
  console.msg = console.msg || console.info;
  today = new Date();
  dstart = 0;
  maxdate = 0;
  const meshitems = [];
  const zoneMappings = {
    "Dateline Standard Time": "Etc/GMT+12",
    "UTC-11": "Etc/GMT+11",
    "Aleutian Standard Time": "America/Adak",
    "Hawaiian Standard Time": "Pacific/Honolulu",
    "Marquesas Standard Time": "Pacific/Marquesas",
    "Alaskan Standard Time": "America/Anchorage",
    "UTC-09": "Etc/GMT+9",
    "Pacific Standard Time (Mexico)": "America/Tijuana",
    "UTC-08": "Etc/GMT+8",
    "Pacific Standard Time": "America/Los_Angeles",
    "US Mountain Standard Time": "America/Phoenix",
    "Mountain Standard Time (Mexico)": "America/Chihuahua",
    "Mountain Standard Time": "America/Denver",
    "Central America Standard Time": "America/Guatemala",
    "Central Standard Time": "America/Chicago",
    "Easter Island Standard Time": "Pacific/Easter",
    "Central Standard Time (Mexico)": "America/Mexico_City",
    "Canada Central Standard Time": "America/Regina",
    "SA Pacific Standard Time": "America/Bogota",
    "Eastern Standard Time (Mexico)": "America/Cancun",
    "Eastern Standard Time": "America/New_York",
    "Haiti Standard Time": "America/Port-au-Prince",
    "Cuba Standard Time": "America/Havana",
    "US Eastern Standard Time": "America/Indianapolis",
    "Turks And Caicos Standard Time": "America/Grand_Turk",
    "Paraguay Standard Time": "America/Asuncion",
    "Atlantic Standard Time": "America/Halifax",
    "Venezuela Standard Time": "America/Caracas",
    "Central Brazilian Standard Time": "America/Cuiaba",
    "SA Western Standard Time": "America/La_Paz",
    "Pacific SA Standard Time": "America/Santiago",
    "Newfoundland Standard Time": "America/St_Johns",
    "Tocantins Standard Time": "America/Araguaina",
    "E. South America Standard Time": "America/Sao_Paulo",
    "SA Eastern Standard Time": "America/Cayenne",
    "Argentina Standard Time": "America/Buenos_Aires",
    "Greenland Standard Time": "America/Godthab",
    "Montevideo Standard Time": "America/Montevideo",
    "Magallanes Standard Time": "America/Punta_Arenas",
    "Saint Pierre Standard Time": "America/Miquelon",
    "Bahia Standard Time": "America/Bahia",
    "UTC-02": "Etc/GMT+2",
    "Azores Standard Time": "Atlantic/Azores",
    "Cape Verde Standard Time": "Atlantic/Cape_Verde",
    "UTC": "Etc/GMT",
    "GMT Standard Time": "Europe/London",
    "Greenwich Standard Time": "Atlantic/Reykjavik",
    "Sao Tome Standard Time": "Africa/Sao_Tome",
    "Morocco Standard Time": "Africa/Casablanca",
    "W. Europe Standard Time": "Europe/Berlin",
    "Central Europe Standard Time": "Europe/Budapest",
    "Romance Standard Time": "Europe/Paris",
    "Central European Standard Time": "Europe/Warsaw",
    "W. Central Africa Standard Time": "Africa/Lagos",
    "Jordan Standard Time": "Asia/Amman",
    "GTB Standard Time": "Europe/Bucharest",
    "Middle East Standard Time": "Asia/Beirut",
    "Egypt Standard Time": "Africa/Cairo",
    "E. Europe Standard Time": "Europe/Chisinau",
    "Syria Standard Time": "Asia/Damascus",
    "West Bank Standard Time": "Asia/Hebron",
    "South Africa Standard Time": "Africa/Johannesburg",
    "FLE Standard Time": "Europe/Kiev",
    "Israel Standard Time": "Asia/Jerusalem",
    "Kaliningrad Standard Time": "Europe/Kaliningrad",
    "Sudan Standard Time": "Africa/Khartoum",
    "Libya Standard Time": "Africa/Tripoli",
    "Namibia Standard Time": "Africa/Windhoek",
    "Arabic Standard Time": "Asia/Baghdad",
    "Turkey Standard Time": "Europe/Istanbul",
    "Arab Standard Time": "Asia/Riyadh",
    "Belarus Standard Time": "Europe/Minsk",
    "Russian Standard Time": "Europe/Moscow",
    "E. Africa Standard Time": "Africa/Nairobi",
    "Iran Standard Time": "Asia/Tehran",
    "Arabian Standard Time": "Asia/Dubai",
    "Astrakhan Standard Time": "Europe/Astrakhan",
    "Azerbaijan Standard Time": "Asia/Baku",
    "Russia Time Zone 3": "Europe/Samara",
    "Mauritius Standard Time": "Indian/Mauritius",
    "Saratov Standard Time": "Europe/Saratov",
    "Georgian Standard Time": "Asia/Tbilisi",
    "Volgograd Standard Time": "Europe/Volgograd",
    "Caucasus Standard Time": "Asia/Yerevan",
    "Afghanistan Standard Time": "Asia/Kabul",
    "West Asia Standard Time": "Asia/Tashkent",
    "Ekaterinburg Standard Time": "Asia/Yekaterinburg",
    "Pakistan Standard Time": "Asia/Karachi",
    "Qyzylorda Standard Time": "Asia/Qyzylorda",
    "India Standard Time": "Asia/Calcutta",
    "Sri Lanka Standard Time": "Asia/Colombo",
    "Nepal Standard Time": "Asia/Katmandu",
    "Central Asia Standard Time": "Asia/Almaty",
    "Bangladesh Standard Time": "Asia/Dhaka",
    "Omsk Standard Time": "Asia/Omsk",
    "Myanmar Standard Time": "Asia/Rangoon",
    "SE Asia Standard Time": "Asia/Bangkok",
    "Altai Standard Time": "Asia/Barnaul",
    "W. Mongolia Standard Time": "Asia/Hovd",
    "North Asia Standard Time": "Asia/Krasnoyarsk",
    "N. Central Asia Standard Time": "Asia/Novosibirsk",
    "Tomsk Standard Time": "Asia/Tomsk",
    "China Standard Time": "Asia/Shanghai",
    "North Asia East Standard Time": "Asia/Irkutsk",
    "Singapore Standard Time": "Asia/Singapore",
    "W. Australia Standard Time": "Australia/Perth",
    "Taipei Standard Time": "Asia/Taipei",
    "Ulaanbaatar Standard Time": "Asia/Ulaanbaatar",
    "Aus Central W. Standard Time": "Australia/Eucla",
    "Transbaikal Standard Time": "Asia/Chita",
    "Tokyo Standard Time": "Asia/Tokyo",
    "North Korea Standard Time": "Asia/Pyongyang",
    "Korea Standard Time": "Asia/Seoul",
    "Yakutsk Standard Time": "Asia/Yakutsk",
    "Cen. Australia Standard Time": "Australia/Adelaide",
    "AUS Central Standard Time": "Australia/Darwin",
    "E. Australia Standard Time": "Australia/Brisbane",
    "AUS Eastern Standard Time": "Australia/Sydney",
    "West Pacific Standard Time": "Pacific/Port_Moresby",
    "Tasmania Standard Time": "Australia/Hobart",
    "Vladivostok Standard Time": "Asia/Vladivostok",
    "Lord Howe Standard Time": "Australia/Lord_Howe",
    "Bougainville Standard Time": "Pacific/Bougainville",
    "Russia Time Zone 10": "Asia/Srednekolymsk",
    "Magadan Standard Time": "Asia/Magadan",
    "Norfolk Standard Time": "Pacific/Norfolk",
    "Sakhalin Standard Time": "Asia/Sakhalin",
    "Central Pacific Standard Time": "Pacific/Guadalcanal",
    "Russia Time Zone 11": "Asia/Kamchatka",
    "New Zealand Standard Time": "Pacific/Auckland",
    "UTC+12": "Etc/GMT-12",
    "Fiji Standard Time": "Pacific/Fiji",
    "Chatham Islands Standard Time": "Pacific/Chatham",
    "UTC+13": "Etc/GMT-13",
    "Tonga Standard Time": "Pacific/Tongatapu",
    "Samoa Standard Time": "Pacific/Apia",
    "Line Islands Standard Time": "Pacific/Kiritimati"
  };

  const pageHtml = `<!DOCTYPE HTML><html><head><link href="${dmsUrl}/css/web_debug.css" rel="stylesheet"/><script src="${dmsUrl}/js/aim_debug.js" libraries="web"></script></head><body></body></html>`;

  function messagePopup(msg){
    // self.messageElem = self.messageElem || $('div').class('message error');
    // console.log(msg);
    const elem = $('div')
    .parent(self.messageElem = self.messageElem || $('div').parent(document.body).class('message error'))
    .append(
      $('h1').text(`${msg.code||''} ${msg.status||''} ${msg.statusText||''}`),
      $('pre').text(typeof msg.message === 'object' ? JSON.stringify(msg.message, null, 2) : msg.message || ''),
      $('code').text(msg.url||''),
      $('pre').html(msg.body||'').append(
        $('ol').append(
          (msg.trace||[]).map(l => $('li').text(l)),
        )
      ),
      $('div').append($('button').text('Gezien').on('click', e => elem.remove())),
    )
  }

  minimist = function (args, opts){
    if (!opts) opts = {};
    var flags = { bools: {}, strings: {}, unknownFn: null };
    if (typeof opts['unknown'] === 'function'){
      flags.unknownFn = opts['unknown'];
    }
    if (typeof opts['boolean'] === 'boolean' && opts['boolean']){
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key){
        flags.bools[key] = true;
      });
    }
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key){
      aliases[key] = [].concat(opts.alias[key]);
      aliases[key].forEach(function (x){
        aliases[x] = [key].concat(aliases[key].filter(function (y){
          return x !== y;
        }));
      });
    });
    [].concat(opts.string).filter(Boolean).forEach(function (key){
      flags.strings[key] = true;
      if (aliases[key]){
        flags.strings[aliases[key]] = true;
      }
    });
    var defaults = opts['default'] || {};
    // var argv = { _: [] };
    var argv = { };
    // var argv = {};//{ _: [] };
    Object.keys(flags.bools).forEach(function (key){
      setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    var notFlags = [];
    if (args.indexOf('--') !== -1){
      notFlags = args.slice(args.indexOf('--') + 1);
      args = args.slice(0, args.indexOf('--'));
    }
    function argDefined(key, arg){
      return (flags.allBools && /^--[^=]+aim/.test(arg)) ||
      flags.strings[key] || flags.bools[key] || aliases[key];
    }
    function setArg(key, val, arg){
      if (arg && flags.unknownFn && !argDefined(key, arg)){
        if (flags.unknownFn(arg) === false) return;
      }
      var value = !flags.strings[key] && !isNaN(val)
      ? Number(val) : val
      ;
      setKey(argv, key.split('-'), value);
      (aliases[key] || []).forEach(function (x){
        setKey(argv, x.split('-'), value);
      });
    }
    function setKey(obj, keys, value){
      var o = obj;
      keys.slice(0, -1).forEach(function (key){
        if (o[key] === undefined) o[key] = {};
        o = o[key];
      });
      var key = keys[keys.length - 1];
      if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean'){
        o[key] = value;
      }
      else if (Array.isArray(o[key])){ o[key].push(value); }
      else {
        o[key] = [o[key], value];
      }
    }
    function aliasIsBoolean(key){
      return aliases[key].some(function (x){
        return flags.bools[x];
      });
    }
    for (var i = 0; i < args.length; i++){
      var arg = args[i];
      if (/^--.+=/.test(arg)){
        // Using [\s\S] instead of . because js doesn't support the
        // 'dotall' regex modifier. See:
        // http://stackoverflow.com/a/1068308/13216
        var m = arg.match(/^--([^=]+)=([\s\S]*)aim/);
        var key = m[1];
        var value = m[2];
        if (flags.bools[key]){
          value = value !== 'false';
        }
        setArg(key, value, arg);
      }
      else if (/^--no-.+/.test(arg)){
        var key = arg.match(/^--no-(.+)/)[1];
        setArg(key, false, arg);
      }
      else if (/^--.+/.test(arg)){
        var key = arg.match(/^--(.+)/)[1];
        var next = args[i + 1];
        if (next !== undefined && !/^-/.test(next)
        && !flags.bools[key]
        && !flags.allBools
        && (aliases[key] ? !aliasIsBoolean(key) : true)){
          setArg(key, next, arg);
          i++;
        }
        else if (/^(true|false)aim/.test(next)){
          setArg(key, next === 'true', arg);
          i++;
        }
        else {
          setArg(key, flags.strings[key] ? '' : true, arg);
        }
      }
      else if (/^-[^-]+/.test(arg)){
        var letters = arg.slice(1, -1).split('');
        var broken = false;
        for (var j = 0; j < letters.length; j++){
          var next = arg.slice(j + 2);
          if (next === '-'){
            setArg(letters[j], next, arg);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)){
            setArg(letters[j], next.split('=')[1], arg);
            broken = true;
            break;
          }
          if (/[A-Za-z]/.test(letters[j])
          && /-?\d+(\.\d*)?(e-?\d+)?aim/.test(next)){
            setArg(letters[j], next, arg);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)){
            setArg(letters[j], arg.slice(j + 2), arg);
            broken = true;
            break;
          }
          else {
            setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
          }
        }
        var key = arg.slice(-1)[0];
        if (!broken && key !== '-'){
          if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1])
          && !flags.bools[key]
          && (aliases[key] ? !aliasIsBoolean(key) : true)){
            setArg(key, args[i + 1], arg);
            i++;
          }
          else if (args[i + 1] && /true|false/.test(args[i + 1])){
            setArg(key, args[i + 1] === 'true', arg);
            i++;
          }
          else {
            setArg(key, flags.strings[key] ? '' : true, arg);
          }
        }
      }
      else {
        if (!flags.unknownFn || flags.unknownFn(arg) !== false){
          // argv._.push(
          // 	flags.strings['_'] || isNaN(arg) ? arg : Number(arg)
          // );
        }
        if (opts.stopEarly){
          argv._.push.apply(argv._, args.slice(i + 1));
          break;
        }
      }
    }
    Object.keys(defaults).forEach(function (key){
      if (!hasKey(argv, key.split('.'))){
        setKey(argv, key.split('.'), defaults[key]);
        (aliases[key] || []).forEach(function (x){
          setKey(argv, x.split('.'), defaults[key]);
        });
      }
    });
    if (opts['--']){
      argv['--'] = new Array();
      notFlags.forEach(function (key){
        argv['--'].push(key);
      });
    }
    else {
      notFlags.forEach(function (key){
        argv._.push(key);
      });
    }
    return argv;
  };
  function extend(selector, context) {
    for (let [key, value] of Object.entries(context)) {
      if (Array.isArray(value)) {
        selector[key] = value;
      } else if (typeof value === 'object') {
        selector[key] = extend(selector[key] || {}, value);
      } else {
        selector[key] = value;
      }
    }
    return selector;
  };
  function validSchemaName(schemaName){
    if (!schemaName) throw 'invalid schemaname';
    // TODO: Location illegal schema name
    return String(schemaName)
    .replace(/^\d|\.|\s|-|\(|\)|,/g,'')
    .replace(/\bLocation\b/,'Loc')
  }
  function urlToId(href){
    return btoa(href).replace(/[=]+aim/g,'');
  }
  function idToUrl(id){
    return atob(id);
  }
  function createParam (param, splitter){
    var result = {};
    if (param) param.split(splitter || '&').forEach(function (val){
      var val = val.split('='), name = val.shift(), val = val.shift();
      result[name] = val ? decodeURIComponent(val) : val;
    });
    return result;
  };
  function dateText(date){
    const dateTime = new Date(date);
    dateTime.setHours(0,0,0,0);
    const now = new Date();
    now.setHours(0,0,0,0);
    const days = Math.round((dateTime.valueOf() - now.valueOf())/1000/60/60/24);
    if (days<-730) return '2 years ago';
    if (days<-365) return '1 year ago';
    if (days<-60) return '2 months ago';
    if (days<-30) return '1 month ago';
    if (days<-14) return '2 weeks ago';
    if (days<-7) return '1 weeks ago';
    if (days<-2) return 'last week';
    if (days<-1) return 'yesterday';
    if (days<0) return 'today';
    if (days>730) return 'after 2 years';
    if (days>365) return 'after 1 year';
    if (days>60) return 'after 2 months';
    if (days>30) return 'after 1 month';
    if (days>14) return 'over 2 weeks';
    if (days>7) return 'next week';
    if (days>1) return 'day after tomorrow';
    if (days>0) return 'tomorrow';
  }
  function setPrototype(fn, prototype, properties){
    Object.assign(fn.prototype, prototype);
    for (let [name, property] of Object.entries(properties)){
      Object.defineProperty(fn.prototype, name, property);
    }
  }
  function uploadState(e){
    aim.url(AUTHORIZATION_URL)
    .query({
      response_type: 'socket_id',
      state: e.type,
      socket_id: aim.WebsocketClient.socket_id,
      id_token: aim.his.cookie.id_token,
      // origin: document.location.href,
    })
    .get();
  };
  function aDate(d) {
    if (!d) return new Date();
    var resdate = new Date(d);
    //// //console.debug('new date 1', d, resdate.toLocaleString());
    if (d.length === 10) resdate.setTime(resdate.getTime() + resdate.getTimezoneOffset() * 60 * 1000);
    //// //console.debug('new date 2', d, resdate.toLocaleString());
    //// //console.debug(['new date 2', d, res.toDateTimeStr(), res.toLocaleString(), res.toGMTString(), res.toISOString(), res.toLocal(), res.getTimezoneOffset()].join(';'));
    return resdate;
  }
  function authSubmit(e) {
    aim()
    .url(AUTHORIZATION_URL + document.location.search)
    .post(e.target)
    .then(checkResponse);
    return false;
  }
  function dateTime0 (date, days) {
    date = new Date(date);
    date.setHours(0,0,0,0);
    if (days) {
      date.setDate(date.getDate() + days);
    }
    return date;
  }
  function focusSection(e, offset) {
    if (e.clickEvent && document.activeElement === document.body) {
      const currentSection = e.clickEvent.path.find(elem => elem.tagName === 'SECTION');
      const children = [...document.body.getElementsByTagName('SECTION')];
      const index = children.indexOf(currentSection);
      const nextSection = children[index + offset];
      if (nextSection) {
        nextSection.click();
      }
      e.preventDefault();
    }
  }
  function importXlsFile(file) {
    // new aim.HttpRequest(aim.config.aim, '/')
    const basePath = document.location.pathname.split(/\/(api|docs|om)/)[0];
    const sub = aim.access.sub;
    const path = `/${sub}/config.json`;
    const config = {app:{nav:{items:{List:{items:{}}}}}};
    // //console.error(importXlsFile);
    // //console.error('IMPORT XLS', XLSX, file.name);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = e => {
      //console.error(XLSX, jszip);
      const components = config.components = config.components || {};
      const schemas = components.schemas = components.schemas || {};
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      function importSheet(sheetname) {
        const wbsheet = workbook.Sheets[sheetname];
        const schema = schemas[sheetname] = schemas[sheetname] || {};
        const properties = schema.properties = schema.properties || {};
        // const aim.his = wbsheet['!aim.his'].split(':').pop();
        const [start,end] = wbsheet['!ref'].split(':');
        const [end_colstr] = end.match(/[A-Z]+/);
        const col_index = XLSX.utils.decode_col(end_colstr);
        const types = {
          s: 'string',
        };
        for (var c=0;c<=col_index;c++) {
          var cellstr = XLSX.utils.encode_cell({c:c,r:0});
          var cell = wbsheet[cellstr];
          if (!cell || !cell.v) {
            break;
          }
          properties[cell.v] = properties[cell.v] || { type: types[cell.t] || 'string' }
          // ////console.log(cellstr, cell);
        }
        // var irows = Number(aim.his.match(/\d+/g));
        // ////console.log(sheetname, wbsheet, ref, irows);
      }
      for (let sheetname in workbook.Sheets) {
        importSheet(sheetname);
        config.app.nav.items.List.items[sheetname] = {
          title: sheetname,
          href: '#/' + sheetname,
        }
      }
      ////console.log(config);
      // aim().url(aim.config.aim).post('/').input(config).res(e => {
      // 	////console.log(e.target.responseText);
      // 	// aim.SampleWindow('/om/?prompt=config_edit');
      // }).send();
      new aim.HttpRequest(aim.config.aim, 'post', '/').query({append: true}).input(config).send().onload = e => {
        ////console.log(e.target.responseText);
      };
    }
  }
  function getIanaFromWindows(windowsZoneName) {
    return zoneMappings[windowsZoneName] || "Etc/GMT";
  }
  function _gotDevices(mediaDevices) {
    select.innerHTML = '';
    select.appendChild(document.createElement('option'));
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = mediaDevice.deviceId;
        const label = mediaDevice.label || `Camera ${count++}`;
        const textNode = document.createTextNode(label);
        option.appendChild(textNode);
        select.appendChild(option);
      }
    });
  }
  function pageClose() {
    colpage.innerText = '';
    aim.his.replaceUrl(document.location.href.replace(/\/id\/([^\?]*)/, ''));
  }
  function stopMediaTracks(stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  function swipedetect(el, callback) {
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) { };
    touchsurface.addEventListener('touchstart', function (e) {
      var touchobj = e.changedTouches[0],
      swipedir = 'none',
      dist = 0,
      startX = touchobj.pageX,
      startY = touchobj.pageY,
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      e.preventDefault();
    }, false);
    touchsurface.addEventListener('touchmove', function (e) {
      e.preventDefault(); // pre scrolling when inside DIV
    }, false);
    touchsurface.addEventListener('touchend', function (e) {
      var touchobj = e.changedTouches[0],
      distX = touchobj.pageX - startX, // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY, // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) { // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false);
  }
  function getId(id){
    return Number(id.split('-').shift());
  }
  function getUid(id){
    return id.replace(/^\d+-/,'')
  }
  // function defineProperties(obj, props) {
  //   for (let [name, prop] of Object.entries(props)) {
  //     Object.defineProperty(Date.prototype, name, typeof prop === 'function' ? {
  //       value: prop,
  //     } : prop );
  //   }
  // }

  Object.defineProperties(Array.prototype, {
    unique: { value: function () {
      return this.filter((e,i,arr) => arr.indexOf(e) === i)
    }},
    // delete(selector){
    //   return this.splice(this.indexOf(selector), 1);
    // },
  });
  Object.defineProperties(Date.prototype, {
    addDays: { value: function addDays(days){
      var day = new Date(this);
      day.setDate(this.getDate() + days);
      return day;
    }},
    getWeek: { value: function getWeek(){
      var d = new Date(+this);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    }},
    getWeekday: { value: function getWeekday(){
      return (this.getDay() + 6) % 7;
    }},
    monthDays: { value: function monthDays(){
      var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
      return d.getDate();
    }},
    toDateText: { value: function toDateText(full){
      // return this.toDateString();
      let res = '';
      if (this){
        const now = new Date();
        let dagen = Math.ceil((this.getTime() - now.getTime()) / 24 / 60 / 60 / 1000);
        let dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday'];
        let monthNames = ['Januari', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
        const time = this.toLocaleTimeString();
        return [
          __(dagen===0 ? 'Today' : dagen === -1 ? 'Yesterday' : dayNames[this.getDay()-1]),
          this.getDate(),
          __(monthNames[this.getMonth()-1]),
          this.getFullYear(),
          time === '00:00:00' ? '' : time.substr(0,5),
          __('week'),
          this.getWeek(),
        ].filter(Boolean).join(' ');
        // res += '-'+this.toISOString();
        //var t = this.toLocaleTimeString().substr(0, 5);
        //if (t != '00:00') res += ' ' + t;
      }
      return res;
    }},
    toDateTimeText: { value: function toDateTimeText(full){
      var res = this.toDateText();
      if (this.getHours() || this.getMinutes()) res += this.toLocaleTimeString().substr(0, 5);
    }},
    toDateTimeStr: { value: function toDateTimeStr(length){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      var s = this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2);
      if (this.getHours() != 0 && this.getMinutes() != 0 && this.getSeconds() != 0)
      s += ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2); + '.' + this.getMilliseconds().pad(3);
      return s.substring(0, length);
    }},
    toDateTimeStringT: { value: function toDateTimeStringT(){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + 'T' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
    }},
    toDateTimeString: { value: function toDateTimeString(){
      //    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
      return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
    }},
    toLocal: { value: function toLocal(){
      this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
      return this;
    }},
    toLocalDBString: { value: function toLocalDBString(){
      this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
      return this.toISOString().replace(/T|Z/g, ' ');
    }},
    toShortStr: { value: function toShortStr(){
      return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2);
    }},
    toWeekDay: { value: function toWeekDay(){
      return this.getFullYear() + '-' + this.getWeek() + ' ' + day[this.getDay()];
    }},
  });
  Object.defineProperties(Number.prototype, {
    formatMoney: { value: function (c, d, t){
      var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? ', ' : d,
      t = t == undefined ? '.' : t,
      s = n < 0 ? '-' : '',
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
      j = (j = i.length) > 3 ? j % 3 : 0;
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    }},
    pad: { value: function (size){
      var s = String(this);
      while (s.length < (size || 2)){
        s = '0' + s;
      }
      return s;
    }},
  });
  Object.defineProperties(String.prototype, {
    capitalize: { value: function (){
      return this.charAt(0).toUpperCase() + this.slice(1);
    }},
    stripTags: { value: function () {
      return this.replace(/(<([^>]+)>)/gi, "");
    }},
  });
  Object.defineProperties(Object, {
    extend: {value: extend},
  });
  Object.defineProperties(JSON, {
    stringifyReplacer: { value: function stringifyReplacer (data, space) {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null){
            if (seen.has(value)){
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      return JSON.stringify(data, getCircularReplacer(), space);
    }},
  });
  YAML = {
    stringify(selector) {
      return JSON.stringify(selector, null, 2)
      .replace(/^\{|^  /gm, '')
      .replace(/,\n/gs, '\n')
      .replace(
        /\[(.*?)\]/gs, (s, p1) => p1
        .replace(/^(.*?)"(.*?)": "(.*?)"aim/gm, '$1$2: $3')
        .replace(/^(.*?)"(.*?)":/gm, '$1$2:')
        .replace(/(.*?)\{(.*?)(\w+)/gs, '$1- $3')
        .replace(/^(.*?)"(.*?)"$/gm, '$1- "$2"')
      )
      .replace(/(\},|\}|\{|\])(?=\n|$)/gs, '')
      .replace(/"(.*?)":/g, '$1:')
      .replace(/: "(.+?)"/g, ': $1')
      .replace(/- "(.+?)"/g, '- $1')
      .replace(/^\s*\n/gms, '')
    },
  };

  __ = function (){
    const translate = aim.his.translate || new Map();
    // console.debug(arguments, translate);
    // return '';
    return [].concat(...arguments).map(text => {
      // //console.log([text, translate[text]]);
      if (translate.has(text)) return translate.get(text);
      text = String(text||'').replace(/^\w/,v => v.toUpperCase()).replace(/([a-z])([A-Z])/g, (v,p1,p2) => p1+' '+p2.toLowerCase()).replace(/_/g, ' ');
      return text && translate.has(text) ? translate.get(text) : (text || '');
    }).join(' ');
  };
  Crypto = {
    base64_encode: function (obj){
      return this.btoajson(JSON.stringify(obj));
    },
    jwt_signature: function (base64_header, base64_payload, secret){
      var message = [base64_header, base64_payload].join('.');
      var signature = this.btoaToJson(CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Base64));
      //var signature = this.btoaToJson(crypto.createHmac('sha256', secret).update(message).digest('base64'));//.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
      // console.debug("signature", base64_header, base64_payload, secret, signature);
      return signature;
    },
    jwt_encode: function (payload, secret){
      var base64_header = this.base64_encode({ typ: "JWT", alg: "sha256" });
      var base64_payload = this.base64_encode(payload);
      return [base64_header, base64_payload, this.jwt_signature(base64_header, base64_payload, secret)].join('.');
    },
    btoajson: function (s){
      return this.btoaToJson(btoa(s));
    },
    btoaToJson: function (s){
      return s.replace(
        /\+/g,
        '-'
      ).replace(
        /\=/g,
        ''
      ).replace(
        /\//g,
        "_"
      );
    },
    decodeId: function (Id){
      if (!Id) return {};
      var a = Id.split('.');
      return JSON.parse(atob(a[1] || a[0]));
    },
  };
  function Request(url, base){
    if (!(this instanceof Request)) return new Request(...arguments);
    this.url = this.url || new URL(url || '', base || (self.document ? self.document.location.href : dmsOrigin));
    this.url.headers = this.url.headers || {};
    this.input.data = null;
  }
  Request.prototype = {
    get(){
      this.method='get';
      return this.http();
    },
    input(param, formData = false){
      if (!param) {
        return this.input.data;
      }
      //console.log(param.constructor.name);
      switch(param.constructor.name) {
        case 'CustomEvent':
        case 'SubmitEvent': {
          param.preventDefault();
          this.input.data = new FormData(param.target);
          if (param.submitter){
            this.input.data.append(param.submitter.name, param.submitter.value);
          };
          break;
        }
        case 'HTMLFormElement': {
          this.input.data = new FormData(param);
          break;
        }
        case 'Elem': {
          this.input.data = new FormData(param.elem);
          break;
        }
        case 'Object': {
          if (formData) {
            this.input.data = new FormData();
            Object.entries(param).forEach(entry => this.input.data.append(...entry));
          } else {
            this.headers('Content-Type', 'application/json');
            this.input.data = JSON.stringifyReplacer(param);
          }
          break;
        }
        case 'Array': {
          if (formData) {
            this.input.data = new FormData();
            Object.entries(param).forEach(entry => this.input.data.append(...entry));
          } else {
            this.headers('Content-Type', 'application/json');
            this.input.data = JSON.stringifyReplacer(param);
          }
          break;
        }
        default: {
          this.input.data = param;
          break;
        }
      }
      return this;
    },
    post(param){
      this.method = 'post';
      if (param){
        this.input(param, true);
      }
      return this.http();
    },
    patch(data){
      this.method='post';
      this.input(data);
      return this.http();
    },
    top(){
      return this.query('$top', ...arguments);
    },
    order(){
      return this.query('$order', ...arguments);
    },
    select(){
      return this.query('$select', ...arguments);
    },
    query(selector, context){
      // this.url();
      if (selector instanceof Object){
        Object.entries(selector).forEach(entry => this.query(...entry));
      } else if (arguments.length === 1){
        const search = new URLSearchParams(selector);
        search.forEach((value,key) => this.url.searchParams.set(key,value));
        // this.url.search = selector;
      } else {
        this.url.searchParams.set(selector, context === undefined ? '' : context);
      }
      return this;
    },
    delete(){
      this.method = 'delete';
      return this.http();
    },
    accept(selector){
      return this.headers('Accept', selector);
    },
    headers(selector, context){
      if (typeof selector === 'object'){
        Object.assign(this.url.headers, selector)
      } else {
        this.url.headers[selector] = context;
      }
      return this;
    },
  }
  Object.defineProperties(Request.prototype, {
    body: { value: function(){
      this.returnBody = true;
      return this;
    }},
    exec: { value: function(){
      for ([key, value] of this.url.searchParams) {
        // //console.log(key, value);
        if (typeof aim[key] === 'function'){
          // aim.his.replaceUrl(new aim().url().query(req.query).toString());
          // console.error('EXEC', key, value);
          return aim[key].apply(aim, value ? value.split(', ') : []) || true;
        }
      };
      console.error('EXEC', this.url.pathname);
      // return;
      const getPathname = path => {
        var [dummy, basePath, folder, sep, id] = path.match(/(.*?\/om|\/api|^)(\/.*?)(\/id\/|aim)(.*)/);
        return [basePath, folder, sep, id];
      };
      var basePath, path, sep, id, newPath = [basePath, path, sep, id] = getPathname(this.url.pathname);
      if (path && path !== '/') {
        var [root, tag, propertyName, attr] = path.match(/.*?\/(\w+\(\d+\))\/([\w_]+?)\((\.*?)\)/)||[];
        // //console.log(tag, aim.his.map.has(tag));
        const item = aim.his.map.get(tag)||{};
        if (item[propertyName]) {
          return item[propertyName].apply(item, attr.split(','));
        }
        if (aim().paths) {
          const paths = aim().paths;
          // console.debug('this.paths2', [basePath, path, sep, id]);
          let replaceLocation = false;
          if (id) {
            replaceLocation = true;
            try {
              [id] = atob(aim.id = id.replace(/(\/.*)/, '')).match(/\/\w+\(.+?\)/);
              // console.error(aim(id));
              // dms.api(id).get().then(e => aim('view').show(e.body));
              aim(id).details().then(item => aim('view').show(item));
            } catch (err){
              return console.error('Illegal requestPath.id', id, paths);
            }
          }
          const method = this.method || 'get';
          const folderTag = path.replace(/\(.*?\)/g,'()');
          let pathKey = Object.keys(paths).find(key => key.replace(/\(.*?\)/g,'()') === folderTag);
          let apiPath = paths[pathKey];
          if (apiPath && apiPath.get){
            replaceLocation = true;
            aim().list([], path);
            if (this.url.searchParams.has('$search') && !this.url.searchParams.get('$search')){
              console.error('NO SEARCH');
              // return;
            }
            aimClient.api(path).query(this.url.searchParams.toString())
            .get().then(async body => {
              if (body){
                const items = body.value || await body.children;
                aim().list(items);
              }
            });
          }
          if (replaceLocation && typeof document !== 'undefined'){
            if (document.location.protocol === 'file:'){
              var currentPath = getPathname(document.location.hash.substr(1));
              [basePath, path, sep, id] = currentPath.map((value,i) => newPath[i] || value);
              var replacePath = ['#', path, sep, id];
            } else {
              var currentPath = getPathname(document.location.pathname);
              var replacePath = currentPath.map((value,i) => newPath[i] || value);
            }
            const search = this.url.searchParams.toString();
            var replacePath = replacePath.join('') + (search ? '?' + search : '');
            // console.debug(
            // 	currentPath.join(''),
            // 	replacePath,
            // );
            aim.his.replaceUrl( replacePath);
          }
        }
        if (this.paths_){
          // console.debug(req.path, pathKey);
          var args = [];
          let pathKey = path.replace(/\((.+?)\)/g, '()');
          pathKey = Object.keys(aim.paths).find(key => key.replace(/\(([^\)]+)\)/g,'()') === pathKey);
          if (pathKey){
            const def = aim.paths[pathKey][req.method.toLowerCase()] || aim.paths[pathKey][req.method.toUpperCase()];
            console.error('pathKey', pathKey, def);
            if (!def){
              return console.error(req.method.toUpperCase(), req.toString(), 'Method not allowed');
            }
            if (req.search){
              req.search.forEach((value, key) => req.path = req.path.replace(key, value));
            }
            var args = path.match(/\(([^\)]+)\)/g);
            for (var i=0, arr = def.operationId.split(/\/|\./), name, obj; name = arr[i]; i++){
              var objName = name.split('(').shift();
              console.error('objName', objName, obj, self[objName]);
              var parentObj = obj ? obj : (self[objName] ? self : ( aim.operations && aim.operations[objName] ? aim.operations : Item.items ));
              // console.error('objName', objName, parentObj, obj);
              console.error('parentObj', objName, parentObj);
              var nextArgument = args ? args.shift() : null;
              var param = nextArgument ? nextArgument.replace(/\(|\)/g, '').split(', ') : [];
              if (typeof parentObj[objName] === 'function'){
                obj = parentObj[objName](...param);
              } else {
                obj = parentObj[objName];
              }
            }
            if (obj){
              console.debug('obj', obj);
              return obj;
            }
          }
        }
      }
      return;
      return this;
    },},
    filter: { value: function(){
      return this.query('$filter', ...arguments);
    },},
    getPath: { value: function(path){
      path = path || (this.url ? this.url.pathname : '');
      // console.debug([path])
      var [dummy, basePath, folder, sep, id] = path.match(/(.*?\/om|\/api|^)(\/.*?)(\/id\/|aim)(.*)/) || [];
      return [basePath, folder, sep, id];
    },},
    authProvider: { value: function(authProvider){
      this.getAccessToken = authProvider.getAccessToken;
      return this;
    },},
    http: { value: function(){
      return aim.promise('http', async (resolve,reject) => {
        if (this.getAccessToken) {
          const access_token = await this.getAccessToken();
          // //console.log('access_token', access_token);
          this.headers('Authorization', 'Bearer ' + access_token);
        }
        return typeof XMLHttpRequest !== 'undefined' ? this.web(resolve,reject) : this.node(resolve,reject)
      });
    },},
    // body(callback){
    //   this.promise.then(e => callback(e.body));
    //   return this;
    // },
    item: { value: function(callback){
      this.promise.then(e => callback(e.body));
      return this;
    },},
    data: { value: function(callback){
      this.promise.then(e => callback(JSON.parse(e.target.responseText)));
      return this;
    },},
    setmethod: { value: function(method) {
      this.method = method;
      return this;
    },},
    node: { value: function(resolve,reject){
      // this.resolve = resolve;
      const input = this.input();
      if (input){
        this.headers('Content-Length',input.length);
      }
      const options = {
        method: this.method,
        hostname: this.url.hostname,
        // path: req.pathname,//[req.basePath, req.path, req.searchParams.toString()].filter(Boolean).join(''),
        path: this.url.pathname+'?'+this.url.searchParams.toString(),
        headers: this.url.headers,
        patch: input,
      };
      // console.debug(this.url.headers);
      const url = this.url.toString();
      // const handleTag = this.method + url;
      const protocol = url.split(':').shift();
      // const path = [req.params.basePath, req.params.path, req.params.search].filter(Boolean).join('');
      // const HTTP = self[protocol] = self[protocol] || require(protocol);
      const HTTP = require(protocol);
      // console.debug('NODE SEND');
      // let options = req.options;
      // { method: req.method, hostname:req.hostname, path: req.pathname, headers:req.headers};
      // console.debug('OPTIONS', req.options);
      const xhr = HTTP.request(options, e => {
        e.target = xhr;
        e.target.request = this;
        e.target.responseText = '';
        e.on('data', function (data){
          // console.debug('data', data);
          e.target.responseText += data;
        }).on('end', () => {
          // console.debug('end', Object.keys(xhr));
          e.status = e.statusCode;
          e.statusText = e.statusMessage;
          try {
            // console.debug(e.headers['content-type'], e.data);
            e.body = e.headers['content-type'].includes('application/json')
            ? JSON.parse(e.target.responseText)
            : e.target.responseText;
            e.response = e.body = e.body; // deprecated
          } catch(err){
            console.debug('ERROR JSON', err, e.target.responseText.substr(0,1000));
            return reject(e);
            // throw e.target.responseText;
          }
          if (e.status===200) {
            return resolve(e.body);
          }
          return reject({
            error: {
              code: e.status,
              message: e.statusMessage,
            }
          });
          // if (req.params.then){
          // 	req.params.then.call(e.target, e);
          // }
        });
      }).on('error', e => {
        console.debug('ERROR');
        reject(error);
      });
      if (input){
        xhr.write(input);
      }
      xhr.startTime = new Date();
      xhr.end();
      return xhr;
    },},
    onerror: { value: function(e){
      console.msg('HTTP ON ERROR', e)
    },},
    onload: { value: function(e){
      ((e.body||{}).responses || [e]).forEach(res => res.body = aim().evalData(res.body));

      if (this.statusElem){
        this.statusElem.remove();
      }
      if (aim.config.debug && e.target.status < 400 || isModule){
        console.warn (
          // e.target.sender,
          this.method.toUpperCase(),
          this.url.toString(),
          e.target.status,
          e.target.statusText,
          e.target.responseText.length, 'bytes',
          new Date().valueOf() - e.target.startTime.valueOf(), 'ms',
          // [e.target.responseText],
          e.body || this.responseText,
        );
      }
    },},
    onprogress: { value: function(e){
      // console.debug('onprogressssssssssssssssssssss', e.type, e);
      var msg = `%c${this.method} ${this.responseURL} ${this.status} (${this.statusText}) ${this.response.length} bytes ${new Date().valueOf() - this.startTime.valueOf()}ms`;
      if (this.elStatus){
        this.elStatus.innerText = decodeURIComponent(this.msg) + ' ' + e.loaded + 'Bytes';
      }
    },},
    setParam: { value: function(name, value){
      this.props = this.props || [];
      this.props[name] = value;
    },},
    servers: { value: function(servers){
      if (servers && servers.length){
        url(servers[0].url);
      }
    },},
    toString: { value: function(){
      return this.url.toString();
    },},
    // url(url, base){
    //   this.url = this.url || new URL(url || '', base || (self.document ? document.location.href : dmsOrigin));
    //   this.url.headers = this.url.headers || {};
    //   this.input.data = null;
    // },
    web: { value: function(resolve,reject){
      // //console.log('AAAAA',resolve,reject,this);
      // this.resolve = resolve;
      const xhr = new XMLHttpRequest();
      xhr.request = this;
      const url = this.url.toString();
      // console.log(url);
      xhr.open(this.method, url);
      // xhr.addEventListener('error', e => {
      //   console.error(111, `${xhr.method} ${xhr.src} ${xhr.status} ERROR ${xhr.statusText}`); // responseText is the server
      // });
      // xhr.addEventListener('error', err => {
      //   console.error(99991, err);
      // });
      xhr.addEventListener('load', e => {
        if (xhr.elLoadlog){
          xhr.elLoadlog.appendTag('span', '', new Date().toLocaleString() );
        }
        if (xhr.waitfolder){
          self.collist.setAttribute('wait', Number(self.collist.getAttribute('wait')) - 1);
        }
        e.body = xhr.response;
        // console.log(this.url.headers);
        if (xhr.status >= 400) {
          // console.error(`${xhr.method} ${xhr.src} ${xhr.status} (${xhr.statusText})`, e.body); // responseText is the server
          // //console.log(xhr);
          try {
            const arr = e.body.match(/(.*?)([\[|\{].*)/s
            );
            const data = JSON.parse(arr[2]);
            const error = data.error || data;
            messagePopup({
              code: error.code,
              status: error.status,
              message: error.message,
              duration: error.duration,
              trace: error.trace,
              body: arr[1],
              url: this.method.toUpperCase() + ' ' + decodeURIComponent(xhr.request.url.href),
            });
          } catch (err) {
            console.error(555, err);
            messagePopup({
              status: xhr.status, statusText: xhr.statusText,
              url: this.method.toUpperCase() + ' ' + decodeURIComponent(xhr.request.url.href),
              body: e.body && e.body.error ? e.body.error.message : '',
            })
          }
          // console.error(xhr.getResponseHeader('content-type'), e.body, e);
          return reject(e);
          // throw 'FOUTJE';
          // reject('STATUS', xhr.status);
        } else if (this.url.headers.Accept === 'application/json' || xhr.getResponseHeader('content-type').includes('application/json')) {
          try {
            // console.log(e.body.replace(/.*?(?=\[|\{)/s, ''));
            // e.body = JSON.parse(e.body.replace(/.*?(?=\[|\{)/s, ''));
            // console.log(e);
            const arr = e.body.match(/(.*?)([\[|\{].*)/s
            );
            e.body = JSON.parse(arr[2]);
            if (arr[1]) {
              messagePopup({
                code: error.code,
                status: error.status,
                message: error.message,
                duration: error.duration,
                trace: error.trace,
                body: arr[1],
                url: this.method.toUpperCase() + ' ' + decodeURIComponent(xhr.request.url.href),
              });
              // const error = data.error || data;

            }
          } catch (err) {
            messagePopup({
              status: xhr.status, statusText: xhr.statusText,
              url: this.method.toUpperCase() + ' ' + decodeURIComponent(xhr.request.url.href),
              body: xhr.response.substr(0,5000),
            })
            console.error('JSON error', xhr, xhr.response.substr(0,5000));
          }
        }
        this.onload(e);
        resolve(this.returnBody ? e.body : e);
      });
      if (aim.his.elem.statusbar) {
        xhr.total = xhr.loaded = 0;
        xhr.addEventListener('loadend', e => {
          aim().progress(-xhr.loaded,-xhr.total);
        });
        if (xhr.upload) {
          xhr.addEventListener('progress', e => {
            const loaded = e.loaded - xhr.loaded;
            xhr.loaded = e.loaded;
            if (!xhr.total){
              aim().progress(0, xhr.total = e.total);
            }
            aim().progress(loaded)
          });
        }
      }
      // //console.log('this.url.headers', this.url.headers);
      Object.entries(this.url.headers).forEach(entry => xhr.setRequestHeader(...entry));
      xhr.startTime = new Date();
      xhr.send(this.input.data);

      // return xhr;
      // aim().status('main', url);
      // xhr.withCredentials = url.includes(document.location.origin);
      // xhr.setCharacterEncoding("UTF-8");
      // xhr.overrideMimeType('text/xml; charset=iso-8859-1');
    },},
  });
  // const clients = new Map();


  // const aim = aim;
  // self.aim = self.aim || aim;

  // sessionStorage.clear();


  function replaceOutsideQuotes(codeString, callback, pre = '<span class=hl-string>', post = '</span>') {
    // const a = codeString.split(/((?<![\\])['"`])((?:.(?!(?<![\\])\1))*.?)\1/);
    const a = codeString.split(/(['"`])\1/);
    return a.map((s,i) => i%3===0 ? (callback ? callback(s) : s) : i%3===2 ? `${a[i-1]}${pre}${s}${post}${a[i-1]}` : '').join('');
  }
  function Markdown() {
    if (!(this instanceof Markdown)) {
      return new Markdown();
    }
  }
  function toLink(s){
    return s.replace(/\(|\)|\[|\]|,|\.|\=|\{|\}/g,'').replace(/ /g,'-').toLowerCase();
  }
  Markdown.prototype = {
    render(s, type) {
      function code(s, type) {
        const highlight = {
          html(s) {
            return s.replace(/(.*?)(&lt;\!--.*?--&gt;|$)/gs, (s,codeString,cmt) => {
              return codeString
              .replace(/&lt;(.*?)&gt;/g, (s,p1) => `&lt;${
                replaceOutsideQuotes(
                  p1.replace(/(\w+)/,'<span class=hl-name>$1</span>')
                  , s => {
                    return s.replace(/ (\w+)(?![^<]*>|[^<>]*<\/)/g,' <span class=hl-attr>$1</span>')
                  }
                )
              }&gt;`) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          js(s) {
            return s
            .replace(/(.*?)(\/\/.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
              return replaceOutsideQuotes(
                codeString, codeString => codeString.replace(
                  /\b(class|abstract|arguments|await|boolean|break|byte|case|catch|char|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|abstract|boolean|byte|char|double|final|float|goto|int|long|native|short|synchronized|throws|transient|volatile)\b(?![^<]*>|[^<>]*<\/)/gi,
                  '<span class=hl-res>$1</span>'
                )
                .replace(
                  /\b(Array|Date|eval|function|hasOwnProperty|Infinity|isFinite|isNaN|isPrototypeOf|length|Math|NaN|name|Number|Object|prototype|String|toString|undefined|valueOf)\b/g,
                  '<span class=hl-method>$1</span>'
                )
                .replace(
                  /\b(alert|all|anchor|anchors|area|assign|blur|button|checkbox|clearInterval|clearTimeout|clientInformation|close|closed|confirm|constructor|crypto|decodeURI|decodeURIComponent|defaultStatus|document|element|elements|embed|embeds|encodeURI|encodeURIComponent|escape|e|fileUpload|focus|form|forms|frame|innerHeight|innerWidth|layer|layers|link|location|mimeTypes|navigate|navigator|frames|frameRate|hidden|history|image|images|offscreenBuffering|open|opener|option|outerHeight|outerWidth|packages|pageXOffset|pageYOffset|parent|parseFloat|parseInt|password|pkcs11|plugin|prompt|propertyIsEnum|radio|reset|screenX|screenY|scroll|secure|select|self|setInterval|setTimeout|status|submit|taint|text|textarea|top|unescape|untaint)\b/g,
                  '<span class=hl-prop>$1</span>'
                )
                .replace(
                  /\b(onblur|onclick|onerror|onfocus|onkeydown|onkeypress|onkeyup|onmouseover|onload|onmouseup|onmousedown|onsubmit)\b/g,
                  '<span class=hl-event>$1</span>'
                )
                .replace(/(\w+)(\s*\()/g, '<span class="hl-fn">$1</span>$2')
                .replace(/\.(\w+)/g, '.<span class="hl-attr">$1</span>')
                .replace(/\b([A-Z]\w+)\./g, '<span class="hl-obj">$1</span>.')
                .replace(/\b(\w+)\./g, '<span class="hl-attr">$1</span>.')
                .replace(/\b(\d+)\b/g, '<span class="hl-nr">$1</span>')
              ) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          javascript(s) {
            return this.js(s);
          },
          css(s) {
            return s.replace(/(.*?)(\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
              return replaceOutsideQuotes(
                codeString, codeString => codeString
                .replace(/\.(.*)\b/g, '.<span class="hl-obj">$1</span>')
              ) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          json(s) {
            return s
            .replace(/"(.*?)":/g, '"<span class="hl-fn">$1</span>":')
            .replace(/(:\s*)"(.*?)"/g, '$1"<span class="hl-string">$2</span>"')
          },
          yaml(s) {
            return s.replace(/(.*?)(#.*?\n|$)/gs, (s,codeString,cmt) => {
              return codeString
              .replace(/^(?=\s*)(.+?):/gm, '<span class="hl-fn">$1</span>:')
              .replace(/: (.*?)$/gm, ': <span class="hl-string">$1</span>')
              + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          php(s) {
            return s.replace(/(.*?)(\/\/.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
              return replaceOutsideQuotes(
                codeString, codeString => codeString.replace(
                  /\b(class|abstract|arguments|await|boolean|break|byte|case|catch|char|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var|void|volatile|while|with|yield|abstract|boolean|byte|char|double|final|float|goto|int|long|native|short|synchronized|throws|transient|volatile)\b(?![^<]*>|[^<>]*<\/)/gi,
                  '<span class=hl-res>$1</span>'
                )
              ) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          sql(s) {
            return s.replace(/(.*?)(--.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
              return replaceOutsideQuotes(
                codeString, codeString => codeString.replace(
                  /\b(ADD|ADD CONSTRAINT|ALTER|ALTER COLUMN|ALTER TABLE|ALL|AND|ANY|AS|ASC|BACKUP DATABASE|BETWEEN|CASE|CHECK|COLUMN|CONSTRAINT|CREATE|CREATE DATABASE|CREATE INDEX|CREATE OR REPLACE VIEW|CREATE TABLE|CREATE PROCEDURE|CREATE UNIQUE INDEX|CREATE VIEW|DATABASE|DEFAULT|DELETE|DESC|DISTINCT|DROP|DROP COLUMN|DROP CONSTRAINT|DROP DATABASE|DROP DEFAULT|DROP INDEX|DROP TABLE|DROP VIEW|EXEC|EXISTS|FOREIGN KEY|FROM|FULL OUTER JOIN|GROUP BY|HAVING|IN|INDEX|INNER JOIN|INSERT INTO|INSERT|IS NULL|IS NOT NULL|JOIN|LEFT JOIN|LIKE|LIMIT|NOT|NOT NULL|OR|ORDER BY|OUTER JOIN|PRIMARY KEY|PROCEDURE|RIGHT JOIN|ROWNUM|SELECT|SELECT DISTINCT|SELECT INTO|SELECT TOP|SET|TABLE|TOP|TRUNCATE TABLE|UNION|UNION ALL|UNIQUE|UPDATE|VALUES|VIEW|WHERE)\b/gi,
                  '<span class=hl-res>$1</span>'
                )
              ) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
          st(s) {
            return s.replace(/(.*?)(--.*?\n|\/\*.*?\*\/|$)/gs, (s,codeString,cmt) => {
              return replaceOutsideQuotes(
                codeString, codeString => codeString.replace(
                  /\b(PROGRAM|END_PROGRAM|VAR|END_VAR|IF|THEN|ELSEIF|ELSIF|ELSE|END_IF|CASE|OF|END_CASE|FOR|TO|BY|DO|END_FOR|REPEAT|UNTIL|END_REPEAT|WHILE|DO|END_WHILE|EXIT|RETURN|ADD|SQRT|SIN|COS|GT|MIN|MAX|AND|OR|BYTE|WORD|DWORD|LWORD|INTEGER|SINT|INT|DINT|LINT|USINT|UINT|UDINT|ULINT|REAL|REAL|LREAL|TIME|LTIME|DATE|LDATE|TIME_OF_DAY|TOD|LTIME_OF_DAY|LTOD|DATE_AND_TIME|DT|LDATE_AND_TIME|LDT|CHAR|WCHAR|STRING|WSTRING|STRING|ANY|ANY_DERIVED|ANY_ELEMENTARY|ANY_MAGNITUDE|ANY_NUM|ANY_REAL|ANY_INT|ANY_UNSIGNED|ANY_SIGNED|ANY_DURATION|ANY_BIT|ANY_CHARS|ANY_STRING|ANY_CHAR|ANY_DATE|DATE_AND_TIME|DATE_AND_TIME|DATE|TIME_OF_DAY|LTIME_OF_DAY)\b/g,
                  '<span class=hl-res>$1</span>'
                )
                .replace(
                  /\b(LEN|CONCAT|LEFT|RIGHT|MID|INSERT|DELETE|REPLACE|FIND|SEL|MAX|MIN|LIMIT|MUX|TP|TON|TOF|R_TRIG|F_TRIG|TRUNC|TRUNC_INT|ROL|ROR|SHL|SHR|CTU|CTD|CTUD|ABS|SQR|LN|LOG|EXP|SIN|COS|TAN|ASIN|ACOS|ATAN|EXPT|NOT|AND|XOR|OR|MOD|BOOL_TO_INT|WORD_TO_DINT|BYTE_TO_REAL|REAL_TO_LREAL|TIME_TO_DINT)\b/g,
                  '<span class=hl-method>$1</span>'
                )
                .replace(
                  /(&lt;|&gt;|&lt;&equals;|&gt;&equals;|&lt;&gt;|:&equals;|&equals;)/g,
                  '<b class=hl-string>$1</b>'
                )
                .replace(
                  /\b(BOOL|TRUE|FALSE)\b/gi,
                  '<span class=hl-prop>$1</span>'
                )
              ) + (cmt ? `<span class=hl-comment>${cmt}</span>` : '')
            })
          },
        };
        s = s || '';
        const ident = (s.match(/^ +/)||[''])[0].length;
        s = s.split(/\n/).map(s => s.slice(ident)).join('\n').trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/=/g, '&equals;')
        .replace(/\t/g, '  ')
        .replace(/\^\^(.*?)\^\^/g, '<MARK>$1</MARK>');
        // .replace(/"/g, '&quot;')
        // .replace(/'/g, '&apos;')
        if (highlight[type]) {
          return highlight[type](s);
        }
        return s;
      }
      if (type) {
        return code(s, type);
      }
      // const lines = [];
      s = s.replace(
        /<\!-- docIndex -->.*?<\!-- \/docIndex -->/s,
        p => `<!-- docIndex -->\n${
          s.match(/^(#+) (.*)/gm)
          .map(h => h.replace(
            /(#+) (.*)/,
            (s,p1,h) => p1.replace(/#/g, '    ') + `- [${h}](#${toLink(h)})`
          ))
          .join("\n")
        }\n<!-- /docIndex -->`
      );
      var identArray = [];
      var lineIdent=0;
      var identTags = [];
      function closetag(lineIdent){
        const tags = identArray.slice(lineIdent).reverse();
        identArray.length = lineIdent;
        return tags.filter(Boolean).map(t => `</${t}>`).join('')
      }
      function opentag(tag,lineIdent){
        return `<${identArray[lineIdent] = tag}>`
      }
      const html = [];
      function space(l){
        return '                                  '.substring(0,l);
      }
      function formatedline(s){
        return s
        .replace(/  $/, '<BR>')
        .replace(/\[ \]/g, '&#9744;')
        .replace(/\[v\]/g, '&#9745;')
        .replace(/\[x\]/g, '&#9746;')
        .replace(/\!\[(.*?)\]\((.*?)\)/g, '<IMG src="$2" alt="$1">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<A href="$2">$1</A>')
        .replace(/\[\s(.*?)\s\]/g, '<button>$1</button>')
        .replace(/:::(\w+)(.*?):::/gs, '<$1$2></$1>')
        .replace(/(?![^<]*>)\*\*(.+?)\*\*/g, '<B>$1</B>')
        .replace(/(?![^<]*>)__(.+?)__/g, '<B>$1</B>')
        .replace(/(?!<a[^>]*>)(?![^<]*>)_(.+?)_(?![^<]*<\/a>)/gi, '<i>$1</i>')
        .replace(/(?![^<]*>)\*(.+?)\*/g, '<i>$1</i>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/~(.*?)~/g, '<u>$1</u>')
        .replace(/\^\^(.*?)\^\^/gs, '<mark>$1</mark>')
      }

      const lines = s
      .replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')
      .replace(/(```.*?```)/gs, (s,p1) => p1.replace(/\r\n/gs, '\n'))
      .replace(/(\r\n[^\r\n]+?)(\r\n\s*-+\s\|\s.*?\r\n)(.*?)(?=\r\n\r\n|$)/gs, (s,p1,p2,p3) => `<TABLE><THEAD><TR><TH>${p1.trim().replace(/\s\|\s/g, '</TH><TH>')}</TH></TR></THEAD><TBODY><TR><TD>${p3.trim().replace(/\s\|\s/g, '</TD><TD>').replace(/\r\n/g,'</TD></TR>\n<TR><TD>')}</TD></TR></TBODY></TABLE>`)
      .split(/\r\n/);

      function identtag(tag, ident){
        // console.log('ident', tag, ident, identTags.length, identTags);
        ident = ident === undefined ? identTags.length : ident;
        for (var i=identTags.length,itag; i>=ident; i--) {
          itag=identTags[i];
          if (itag) html.push(`</${itag}>`);
        }
        identTags.length = ident;
        if (tag) {
          html.push(`<${identTags[ident] = tag}>`);
        }
      }

      for (var i=0, s;i<lines.length;i++) {
        if (s = lines[i]) {
          const prevLineIdent = lineIdent;
          lineIdent = (s.match(/^ +/)||[''])[0].length;
          if (s.match(/^\s*(\*|-|\d+\.) /)) {
            const tag = s.match(/^\s*(\*|-) /) ? 'ul' : 'ol';
            if (identTags[lineIdent] !== tag) {
              identtag(tag, lineIdent);
            }
            identtag('li', lineIdent+1);
          } else if (s.match(/\s*```/)) {
            html.push(s.replace(/```(.*?)\n(.*?)```$/s, (s,p1,p2) => `<pre><code language="${p1}">${code(p2,p1.toLowerCase())}</code></pre>`));
            continue;
          } else if (s.match(/^#/)) {
            identtag('', lineIdent);
          } else if (s.match(/^\s*>\s/)) {
            identtag('', lineIdent);
          } else if (!lines[i-1]){
            identtag('p', lineIdent);
          // } else if (!s.match(/^\s*</)){
          //   identtag('p', lineIdent);
          }
          html.push(
            s
            .replace(/(.*?)(`(.*?)`|$)/g, (s1,p1,s2,p2) => formatedline(p1) + (p2 ? `<code>${code(p2)}</code>` : ''))
            .replace(/^\s*> (\[\!(\w+)\]\s|.*?)(.+?)(?=\n\n|$)/gs, (s,p1,p2,p3,p4) => `${p1}<BLOCKQUOTE${p3?` class="${p3.toLowerCase()}"`:``}>${(p4||'').replace(/(^|\s)> /gm, ' ')}</BLOCKQUOTE>`)
            .replace(/^(#+) (.*)/, (s,p1,p2) => closetag(0) + `<A class='anchor' title="${p2}" name="${s = toLink(p2)}"></A><H${p1.length} class="${s}"><A class="anchorref" href="#${s}"></A>${p2}</H${p1.length}>`)
            .replace(/^(\s*)(\*|-|\d+\.) /, '')
            // .replace(/^(#+) (.*)/, (s,p1,p2) => closetag(0) + `<A class='anchor' title="${p2}" name="${s = toLink(p2)}"></A><H${p1.length} class="${s}"><A class="anchorref" href="#${s}"></A>${p2}</H${p1.length}>`)
            .trim()
          );
        }
      }
      for (let tag of identTags.reverse()) {
        if (tag) html.push(`</${tag}>`);
      }
      // console.log(html.join('\n'));
      // console.warn(html.join('\n'));
      return html.join(' ');



      s = s
      .replace(/\r/g,'')
      .replace(/  \n/g, '<BR>')
      .replace(/(.*?)(```(.*?)\n(.*?)```|$)/gs, (s,md,s2,type,codeLines) => {
        s = ('\n\n' + md)
        .replace(/(^|\n)\s*> (\[\!(\w+)\]\s|.*?)(.+?)(?=\n\n|$)/gs, (s,p1,p2,p3,p4) => `${p1}<BLOCKQUOTE${p3?` class="${p3.toLowerCase()}"`:``}>${(p4||'').replace(/(^|\s)> /gm, ' ')}</BLOCKQUOTE>`)
        .replace(/(\n[^\n]+?)(\n\s*-+\s\|\s.*?\n)(.*?)(?=\n\n|$)/gs, (s,p1,p2,p3) => `<TABLE><THEAD><TR><TH>${p1.trim().replace(/\s\|\s/g, '</TH><TH>')}</TH></TR></THEAD><TBODY><TR><TD>${p3.trim().replace(/\s\|\s/g, '</TD><TD>').replace(/\n/g,'</TD></TR>\n<TR><TD>')}</TD></TR></TBODY></TABLE>`)
        .replace(/\[\s(.*?)\s\]/g, '<button>$1</button>')
        .trim()
        .split(/\n/)
        .map((s,i,lines) => {
          var p = '';
          if (s) {
            const prevLineIdent = lineIdent;
            lineIdent = (s.match(/^ +/)||[''])[0].length;
            if (lineIdent<prevLineIdent) {
              p += closetag(prevLineIdent);
            }
            if (s.match(/^\s*(\*|-|\d+\.) /)) {
              if (identArray[identArray.length-1] === 'P') {
                p += closetag(identArray.length-1);
              }
              p += closetag(lineIdent+1);
              const tag = s.match(/^\s*(\*|-) /) ? 'UL' : 'OL';
              if (identArray[lineIdent] !== tag) {
                p+=closetag(lineIdent);
                p+=opentag(tag,lineIdent);
              }
              p += opentag('LI',lineIdent+1);
              s = s.replace(/^\s*(\*|-|\d+\.) /, '');
            } else if (s.match(/^#/)) {
              s = s.replace(/^(#+) (.*)/, (s,p1,p2) => closetag(0) + `<A class='anchor' title="${p2}" name="${s = toLink(p2)}"></A><H${p1.length} class="${s}"><A class="anchorref" href="#${s}"></A>${p2}</H${p1.length}>`)
            } else {
              if (!lines[i-1]) {
                if (identArray[identArray.length-1] === 'P') {
                  p += closetag(identArray.length-1);
                }
                p += opentag('P',identArray.length);
              }
            }
          }
          s = p + s.trim();
          return s
          .replace(/  $/g, '<BR>')
          .replace(/(.*?)(`(.*?)`|$)/g, (s1,p1,s2,p2) => p1
          .replace(/\!\[(.*?)\]\((.*?)\)/g, '<IMG src="$2" alt="$1">')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<A href="$2">$1</A>')
          .replace(/:::(\w+)(.*?):::/gs, '<$1$2></$1>')
          .replace(/(?![^<]*>)\*\*(.+?)\*\*/g, '<B>$1</B>')
          .replace(/(?![^<]*>)__(.+?)__/g, '<B>$1</B>')
          .replace(/(?!<a[^>]*>)(?![^<]*>)_(.+?)_(?![^<]*<\/a>)/gi, '<I>$1</I>')
          .replace(/(?![^<]*>)\*(.+?)\*/g, '<I>$1</I>')
          .replace(/\[ \]/g, '&#9744;')
          .replace(/\[v\]/g, '&#9745;')
          .replace(/\[x\]/g, '&#9746;')
          .replace(/~~(.*?)~~/g, '<DEL>$1</DEL>')
          .replace(/~(.*?)~/g, '<U>$1</U>')
          .replace(/\^\^(.*?)\^\^/gs, '<MARK>$1</MARK>')
          + (p2 ? `<CODE>${code(p2)}</CODE>` : ''))
        })
        .join('\n') + closetag(0);
        if (codeLines) {
          s+= `<PRE><CODE language="${type = type.toLowerCase()}">${code(codeLines, type).replace(/\n/g,'<br>')}</CODE></PRE>`;
        }
        return s
      });
      // console.log(s);
      return s
      .replace(/<P>[\s|\n]*<\/P>/gs,'')
      .trim();
    },
    isImg1(src) {
      return src.match(/jpg|png|bmp|jpeg|gif|bin/i)
    },
    isImgSrc(src) {
      if (src) for (var i = 0, ext; ext = ['.jpg', '.png', '.bmp', '.jpeg', '.gif', '.bin'][i]; i++) if (src.toLowerCase().indexOf(ext) != -1) return true;
      return false;
    },
  };


  aim.prototype = {
    accessToken(){
      return this.set('access_token', ...arguments);
    },
    accountConfig(config, extend, save) {
      const panel = aim('form').class('col')
      .style('position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;background-color:white;z-index:200;')
      .parent(aim('list'));
      const tabControl = aim('div').parent(panel).class('row top btnbar');
      const pageControl = aim('div').parent(panel).class('row aco').style('height:100%;');
      function upload() {
        // //console.log('UPLOAD', page);
        configInput.elem.value = configText.elem.innerText;
        aimClient.api('/').post(panel).then(body => {
          console.debug("API", body);
        });
        // aimClient.api(url).post(page).query({
        //   base_path: document.location.protocol === 'file:' ? '/' : document.location.pathname.split(/\/(api|docs|om)/)[0],
        // }).input(this.value).post().then(e => {
        //   console.debug("API", e.target.responseText );
        // });
      }
      const page = aim('div').parent(pageControl)
      .class('aco oa col')
      .css('margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;')
      .css('background-color:var(--bg);');
      const configText = aim('pre').parent(page)
      .class('aco')
      .css('margin:0;padding:0 10px;outline:none;')
      .text(config.replace(/^---\n/, '').replace(/\n\.\.\./, '').trim())
      .contenteditable('')
      .spellcheck(false)
      .on('keydown', e => {
        if (e.key === "s" && e.ctrlKey) {
          e.preventDefault();
          upload();
        }
        if (e.key == 'Tab' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          document.execCommand('insertHTML', false, '&#009');
          e.preventDefault()
        }
      });
      const configInput = aim('input').parent(page).name('config').type('hidden');
      function focus () {
        [...pageControl.elem.children].forEach(elem => elem.style.display = 'none');
        page.elem.style.display = '';
      }
      function close () {
        page.remove();
        tab.remove();
        if (!tabControl.elem.innerText) {
          panel.remove();
        }
      }
      const tab = aim('div').parent(tabControl).append(
        aim('span').text('config.yaml').on('click', focus),
        aim('input').type('checkbox').name('extend').id('expand').checked(extend),
        aim('label').text('extend').for('expand'),
        aim('button').class('abtn close').on('click', close),
      );
      focus();
      if (save) upload();
      // open(aimClient.api('/').accept('yaml'));
    },
    analytics() {
      (function (i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function (){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(self,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', {
        trackingId: 'UA-28018977-1',
        cookieDomain: 'auto',
        // name: 'schiphol',
        // userId: '12345'
      });
      ga('send', 'pageview');
    },
    auth(context){
      console.error('AUTH', context);
      return this.get(AuthProvider, {auth: context});
    },
    copyFrom(source, master, index) {
      return aim.promise( 'copyFrom', resolve => {
        // return;
        const [s,schemaName,sourceId] = source.tag.match(/(\w+)\((\d+)\)/);
        console.warn(schemaName, source, master);
        const item = {
          // schema: source.schema,
          header0: source.header0,
          Src: {
            LinkID: sourceId,
          },
          Class: {
            LinkID: !source.Class || !source.Class.LinkID === 0 ? sourceId : source.Class.LinkID,
          },
        };
        if (master) {
          master.attr('HasChildren', 1, true);
          item.Master = {
            LinkID: master.data.ID,
            Data: index === undefined ? (master.items ? master.items.length : 0) : index,
          }
        }
        console.debug('COPY START', item);
        aimClient.api(`/${schemaName}`).input(item).post().then(item => {
          // console.debug('COPY DONE', e.target.responseText);
          item.details().then(async item => {
            console.debug('COPY START', item);
            await item.clone();
            if (master) {
              if (master.items) {
                master.items.push(item);
                // master.emit('change');
                await master.reindex();
                if (master.elemTreeLi.elem.open) {
                  master.elemTreeLi.emit('toggle')
                } else {
                  master.elemTreeLi.elem.open = true;
                }
                // if (index !== undefined) {
                //   console.debug('INDEX', index);
                //   item.movetoidx(master,index);
                // }
              }
            }
            console.debug('COPY END', item);
            // item.emit('change');
            resolve(item);
          })
        })
      });
    },
    clone(obj){
      // console.error('clone', obj);
      return JSON.parse(JSON.stringify(obj));
    },
    cam() {
      const elem = document.head.appendChild(document.createElement('script'));
      elem.setAttribute('src', aim.config.apiPath + '/js/cam.js');
    },
    components(components){
      return this.extend(components)
    },
    connector(){
      Object.assign(this, {
        external(name, args, callback){
          let params = {to: { sid: aim.Aliconnector.connector_id }, external: {} };
          // let args = [...arguments];
          params.external[name] = Array.isArray(args) ? args : (args ? [args] : []);
          aim.Aliconnector.callback = callback;
          wsClient.send(JSON.stringify(params));
        },
        reply(par){
          if (aim.Aliconnector.callback){
            aim.Aliconnector.callback(par);
          }
          aim.Aliconnector.callback = null;
          // console.debug('ALICONNECTOR REPLY', par);
        },
        printurl(url){
          this.external('printurl', url, par => {
            console.debug('PRINT REPLY', par);
          });
        },
        hide(){
          this.external('hide', null, par => {
            console.debug('HIDE REPLY', par);
          });
        },
        show(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        // writelnfile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // writefile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // readfile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // readfilearray(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        // EditFile(){
        // 	this.external('show', null, par => {
        // 		console.debug('SHOW REPLY', par);
        // 	});
        // },
        filedownload(par){
          this.external('filedownload', "http://alicon.nl" + par, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        mailimport(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        contactimport(){
          this.external('show', null, par => {
            console.debug('SHOW REPLY', par);
          });
        },
        // opcSetVar(){},
        // opcSet(){},
        // opcConnect(){},
        // opcDisconnect(){},
        // geturl(){},
        // getHtml(){},
      });
    },
    cookies() {
      //console.log('COOKIES');
      aim().on({
        async load() {
          if (!localStorage.getItem('cookieSettings')) {
            const elem = aim('div')
            .parent(document.body)
            .class('cookieWarning')
            .text('Opslag van uw gegevens')
            .append(
              aim('button')
              .text('Werkende website')
              .on('click', e => {
                localStorage.setItem('cookieSettings', 'session');
                elem.remove();
              }),
              aim('button')
              .text('Allen voor u persoonlijk')
              .on('click', e => {
                localStorage.setItem('cookieWarning', 'private');
                elem.remove();
              }),
              aim('button')
              .text('Delen met onze organisatie')
              .on('click', e => {
                localStorage.setItem('cookieWarning', 'shared');
                elem.remove();
              }),
              aim('a').text('Cookie beleid').href('#?l=//aliconnect.nl/aliconnect/wiki/Explore-Legal-Cookie-Policy')
            )
          }
          return this;
        }
      })
    },
    create(){
      this.selector = this.selector.createElement(...arguments);
      return this;
    },
    clientGet(){
      return clients;
    },
    css(selector, context) {
      if (document) {
        if (selector instanceof Object) {
          Object.entries(selector).forEach(entry => arguments.callee(...entry))
        } else {
          document.querySelector('html').style.setProperty('--' + selector, context);
        }
      }
      return this;
      //
      //
      // let style = [...document.getElementsByTagName('style')].pop() || aim('style').parent(document.head).elem;
      // const sheet = style.sheet;
      // function addRule(selector, context) {
      // 	if ('insertRule' in sheet) {
      // 		sheet.insertRule(selector + "{" + context + "}", sheet.cssRules.length);
      // 	} else if ('addRule' in sheet) {
      // 		sheet.addRule(selector, context);
      // 	}
      // }
      // if (selector instanceof Object) {
      // 	Object.entries(selector).forEach(entry => addRule(...entry))
      // } else {
      // 	addRule(...arguments);
      // }
      // return this;
    },
    data(data){
      Item.get(data);
      return this;
    },
    document(mainElem, buttons){
      aim('doc').append(
        this.pageElem = aim('div').class('col doc').append(
          aim('div').class('row top stickybar').append(
            aim('span').class('aco'),
            aim('button').class('abtn pdf').on('click', async e => {
              const html = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>'+this.docElem.elem.innerHTML;
              aim().url(dmsUrl + '/?request_type=pdf').post(html).then(e => {
                const elem = aim('div').parent(this.pageElem).class('col abs').append(
                  aim('div').class('row top btnbar').append(
                    aim('button').class('abtn close').on('click', e => elem.remove()),
                  ),
                  aim('iframe').class('aco').src(e.body.src)
                )
              })
            }),
            aim('button').class('abtn close').on('click', e => this.pageElem.remove()),
          ),
          aim('div').class('row aco').append(
            this.leftElem = aim('div').class('mc-menu left np oa').append(),
            aim('div').class('aco col').on('click', e => {
              const href = e.target.getAttribute('href');
              if (href && href.match(/^http/)) {
                e.stopPropagation();
                e.preventDefault();
                self.history.pushState('page', '', '?l='+url_string(href));
                const panel = aim('div').parent(elem.docElem).class('col abs').append(
                  elem.elemBar = aim('div').class('row top abs btnbar').append(
                    aim('span').class('aco'),
                    aim('button').class('abtn close').on('click', e => panel.remove()),
                  ),
                  aim('iframe').src(href),
                );
              }
            }).append(
              aim('nav').class('row docpath').append(aim('small').id('navDoc')),
              this.docNavTop = aim('nav').class('row dir'),
              this.docElem = mainElem.class('doc-content aco'),
            ),
            aim('div').class('mc-menu right np oa').append(
              aim('div').class('ac-header').text('Table of contents'),
              this.indexElem = aim('ul').index(this.docElem)
            ),
          ),
        )
      );
      // aim(document.body).on('scroll', e => this.scrollTop.set(this.src, e.target.scrollTop));
      // this.doc.indexElem.index(this.doc.docElem)
      this.pageElem.elem.doc = this;
      return this;
    },
    dashboard() {
      const panel = aim('div').panel();
      aimClient.api('/').query('request_type', 'personal_dashboard_data_domain').get().then(body => {
        panel.elemMain.class('dashboard').append(
          aim('div').class('row wrap').append(
            ...body.map(row => aim('div').class('col').append(
              aim('h1').text(row.schemaPath),
              ...row.items.map(item => aim('a').text(item.header0).on('click', e => aim('view').show(aim(`${row.schemaPath}(${item.id})`)) ))
            )),
            ...[0,0,0,0,0,0,0,0,0].map(a => aim('div').class('ghost')),
          )
        );
      })
    },
    async emit(type, context){
      const selector = this.elem || this.selector || this;
      // if (type === 'change') console.debug('emit', type, context, selector);
      if (selector.addEventListener){
        let e;
        if (typeof (Event) === 'function'){
          e = new Event(type);
        } else {
          e = document.createEvent('Event');
          e.initEvent(selector, true, true);
        }
        if (typeof context === 'object'){
          delete context.path;
          Object.assign(e, context);
        }
        await selector.dispatchEvent(e);
      } else {
        if (selector.eventListeners && selector.eventListeners.has(type)){
          for (const eventListener of selector.eventListeners.get(type)){
            await eventListener(context || {});
          }
        }
      }
      return this;
    },
    evalData(data){
      // console.debug('evalData', data);
      // keys = ['components'];
      // const cfg = ['components'].map(key => data[key]);
      if (data instanceof Object){
        // const keys = ['components','info'].filter(key => key in data);
        // const config = keys.reduce((result, key) => ({ ...result, [key]: data[key] }), {});
        //
        // // console.debug(data,config);
        //
        // this.extend(config);
        // console.debug('evalDataevalDataevalDataevalData', data);
        if (Array.isArray(data.value)){
          data.value = data.value.map(data => Item.get(data));
        } else if (data['@id']){
          // data = Item.get(data);
        }
        // console.debug('A', data.body);
      }
      return data;
    },
  };

  Object.defineProperties(aim.prototype, {
    eventHandle: { value: null, },
    elements:{
      get() {
        if (isModule){
          return [];
        }
        return this.props && (this.props[0] instanceof Object)
        ? Object.values(this.props[0]).filter(value => value instanceof Element)
        : [];
      },
    },
    extend: {value: function extend(){
      aim.extend(this.elem || this.selector || this, ...arguments);
      return this;
    },},
    extendConfig: {value: function (yaml){
      // //console.log(yaml);
      return aimClient.api('/').query('extend', true).post({config: yaml});
    },},
    execQuery: {value: function (selector, context, replace){
      console.error('execQuery', selector, context, replace);
      const currentUrl = new URL(document.location.origin);
      var url = new URL(document.location);
      if (typeof selector === 'object') {
        Object.entries(selector).forEach(entry => url.searchParams.set(...entry));
      } else {
        url.searchParams.set(selector, context);
      }


      if (url_string(currentUrl.href) !== url_string(url.href)) {
        this.execUrl(url_string(url.href));
        // if (url.searchParams.get('l')) {
        //   url.searchParams.set('l', decodeURIComponent(url.searchParams.get('l')));
        //   //console.log(url.searchParams.get('l'));
        //
        // }
        // var href = url.href;
        // //console.log(href);
        if (replace) {
          // console.error('REPLACE');
          self.history.replaceState('page', '', url_string(url.href));
        } else {
          // console.error('PUSH');
          self.history.pushState('page', '', url_string(url.href));
        }
      }
      return this;
    },},
    execUrl: {value: function (url){
      console.warn('execUrl', url);
      const documentUrl = new URL(document.location);
      // const currentUrl = new URL(document.location);
      // aim.url = aim.url || new URL(document.location.origin);
      url = new URL(url, document.location);

      // //console.log(url.hash, url.searchParams.get('l'), aim.url.searchParams.get('l'));
      if (url.hash) {
        if (this.execUrl(url.hash.substr(1))) {
          aim.his.mergeState(url.hash.substr(1));
          return;
        }
        // if (aim[url.hash.substr(1)]) {
        //   return aim[url.hash.substr(1)]();
        // }
        // this.execUrl(url.hash.substr(1));
      }
      // //console.log(url.searchParams.get('l'));
      // if (url.searchParams.get('l')) {// && url.searchParams.get('l') !== aim.url.searchParams.get('l')) {
      //   documentUrl.searchParams.set('l', url.searchParams.get('l'));
      //
      //   const listUrl = idToUrl(url.searchParams.get('l'));
      // }
      if (url.searchParams.get('v') && url.searchParams.get('v') !== documentUrl.searchParams.get('v')) {
        documentUrl.searchParams.set('v', url.searchParams.get('v'));
        if (url.searchParams.get('v')) {
          var refurl = new URL(idToUrl(url.searchParams.get('v')), document.location);
          if (refurl.hostname.match(/^dms\./)) {
            // const client = clients.get(refurl.hostname) || aim();
            // aimClient.api(refurl.href).get().then(console.error);
            aimClient.api(refurl.href).get().then(async body => aim('view').show(body));
          }
        } else {
          aim('view').text('');
        }
      }
      for ([key, value] of url.searchParams) {
        if (typeof aim[key] === 'function'){
          return aim[key].apply(aim, value ? value.split(', ') : []) || true;
        }
      }
      self.history.replaceState('page', '', documentUrl.href);

      // if (!aim().url(document.location.hash ? document.location.hash.substr(1) : document.location.href).exec()) {
      //   if (url.searchParams.get('p')) {
      //     return aim('list').load(url.searchParams.get('p'));
      //   }
      // }
      // if (url.searchParams.get('id')) {
      //   var refurl = new URL(atob(url.searchParams.get('id')));
      //   if (refurl.pathname.match(/^\/api\//)) {
      //     aim().url(refurl.href).get().then(async e => {
      //       aim('view').show(e.body);
      //     });
      //   }
      // }
      // return;
      // //console.log('POPSTATE2', document.location.pathname);
    }},
    forEach: {value: function (selector, context, fn){
      if (selector instanceof Object){
        Object.entries(selector).forEach(entry => fn.call(this, ...entry));
      } else {
        fn.call(this, selector, context)
      }
      return this;
    },},
    ga: {value: function (){
      if (self.ga) {
        ga(arguments);
      }
      return this;
    },},
    get: {value: function (selector, options) {
      this.props = this.props || new Map();
      if (!selector) return this.props;
      const name = selector.name || selector;
      if (!this.props.has(name)){
        options = typeof options === 'string' ? aim(options) : options;
        // //console.log(selector);
        // this.props.set(name, typeof selector === 'function' && selector.prototype ? new selector(options) : options);
      }
      return this.props.get(name)
      // let prop = (this.props = this.props || new Map()).get(name);
      // if (options){
      //   if (!prop){
      //     options = Array.isArray(options) ? options.shift() : options;
      //     options = typeof options === 'string' ? aim(options) : options;
      //     options = typeof selector === 'function' ? new selector(options) : options;
      //     prop = this.props.set(name, options).get(name)
      //     prop.key = this.key;
      //   } else {
      //     aim(prop).extend(options)
      //     if (prop.init){
      //       prop.init();
      //     }
      //   }
      // }
      // return prop
    },},
    getApi: {value: function getApi(url){
      return aim.promise(
        'getApi',
        resolve => this
        .url(url)
        .get()
        .then(e => {
          console.debug('GET', JSON.parse(e.target.responseText));
          aim(this).extend(e.body);
          resolve(e);
        })
      )
    },},
    getObject: {value: function getObject(name, constructor, args) {
      const props = this.props = this.props || new Map();
      if (!props.has(name)) {
        props.set(name, new constructor(...args))
      } else if (!args.length) {
        return props.get(name);
      } else {
        props.get(name).show(...args);
      }
      return this;
    },},
    has: {value: function (selector){
      return this.props && this.props.has(selector);
    },},
    id: {value: function (selector){
      this.key = selector; // deprecated
      this.set('id', selector);
      aim.his.map.set(selector, this);
      return this;
    },},
    login: {value: async function (){
      // const url = new URL(this.server.url, document.location);
      var url = new URL(this.server ? this.server.url : '/api', dmsOrigin);
      if (this.authProvider().access && this.authProvider().access.iss) {
        url.hostname = this.authProvider().access.iss;
      }
      // console.debug( url );
      // return;
      //
      // var url = new URL(this.server ? this.server.url : this.authProvider().access.iss, 'https://aliconnect.nl/api');
      //
      // console.debug( this.authProvider().access.iss, url );
      // return;
      clients.set(url.hostname, this);
      // return console.debug(this.ws());
      // clients.set()
      if (this.ws().url){
        await this.ws().connect()
      }
      if (this.authProvider()){
        await this.authProvider().login(...arguments);
        if (this.ws()){
          await this.ws().login(this.authProvider().getAccessToken())
        }
      }
      return this;
    },},
    message: {
      get() {
        const [basePath, folder, sep, id] = this.getPath();
        // console.debug(basePath, folder, sep, id, this);
        return {
          method: this.req.method,
          url: [folder, this.url.searchParams.toString()].filter(Boolean).join(''),
          body: this.req.input,
          to: this.to,
        }
      },
    },
    msa: {value: function () {
      return aim.msa = aim.msa || new Msa(...arguments);
    },},
    nav: {value: function () {
      return nav;
    },},
    notify: {value: function (title, options) {
      // aim().sw.active.postMessage({
      //   test: 'ja',
      // })
      return;
      if ("Notification" in self) {
        if (Notification.permission === "granted") {
          // aim().sw.showNotification(title, {
          //   body: `Bla Bla`,
          //   // url: 'https://moba.aliconnect.nl',
          //   icon: 'https://aliconnect.nl/favicon.ico',
          //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
          //   // data: {
          //   //   href: document.location.href,
          //   //   url: 'test',
          //   // },
          //   actions: [
          //     {
          //       action: 'coffee-action',
          //       title: 'Coffee',
          //       icon: '/images/demos/action-1-128x128.png'
          //     },
          //     {
          //       action: 'doughnut-action',
          //       title: 'Doughnut',
          //       icon: '/images/demos/action-2-128x128.png'
          //     },
          //     {
          //       action: 'gramophone-action',
          //       title: 'gramophone',
          //       icon: '/images/demos/action-3-128x128.png'
          //     },
          //     {
          //       action: 'atom-action',
          //       title: 'Atom',
          //       icon: '/images/demos/action-4-128x128.png'
          //     }
          //   ]
          // })
          //
          // return;
          //
          options = {
            body: `Bla Bla`,
            url: 'https://moba.aliconnect.nl?test=1',
            icon: 'https://aliconnect.nl/favicon.ico',
            image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
            // data: 'https://moba.aliconnect.nl?test=1',
            data: {
              href: document.location.href,
              url: document.location.href,
            },
            //   actions: [
            //     {
            //       action: 'open-action',
            //       title: 'Open',
            //       icon: 'https://aliconnect.nl/favicon.ico',
            //     },
            //     // {
            //     //   action: 'doughnut-action',
            //     //   title: 'Doughnut',
            //     //   icon: '/images/demos/action-2-128x128.png'
            //     // },
            //     // {
            //     //   action: 'gramophone-action',
            //     //   title: 'gramophone',
            //     //   icon: '/images/demos/action-3-128x128.png'
            //     // },
            //     // {
            //     //   action: 'atom-action',
            //     //   title: 'Atom',
            //     //   icon: '/images/demos/action-4-128x128.png'
            //     // }
            //   ]
          };
          var notification = new Notification(title, options);
          notification.onclick = function (e) {
            //console.log('CLICKED', options);
            // self.open("http://www.stackoverflow.com");
            // self.location.href = 'https://aliconnect.nl';
          }
        }
      }
    },},
    noPost: {value: function (fn){
      aim.his.noPost = true;
      fn();
      aim.his.noPost = false;
    },},
    on: {value: function (type, context, useCapture){
      const selector = this.elem || this.selector || this;
      this.forEach(type, context, (type, context) => {
        if (selector.addEventListener){
          selector.addEventListener(type, context, useCapture);
        } else {
          // if (type === 'change') console.debug('on', type, context, selector);
          const eventListeners = selector.eventListeners = selector.eventListeners || new Map();
          if (!eventListeners.has(type)) eventListeners.set(type, []);
          const eventListener = eventListeners.get(type);
          if (!eventListener.includes(context)){
            eventListener.push(context);
          }
        }
      });
      return this;
    },},
    onload: {value: function (e){
      // console.error(this, e.target);
      if (aim.config.debug && e.target.status < 400 || isModule){
        console.debug (
          // e.target.sender,
          this.props('method').toUpperCase(),
          this.props('url').toString(),
          e.target.status,
          e.target.statusText,
          e.target.responseText.length, 'bytes',
          new Date().valueOf() - this.startTime.valueOf(), 'ms',
          // e.target.responseText,
          // e.body || this.responseText,
        );
      }
      // if (e.status >= 400) document.body.appendTag('DIV', {className:'errorMessage', innerHTML:this.responseText });
      // this.getHeader = this.getHeader || this.getResponseHeader;
      // var contentType = e.headers ? e.headers['content-type'] : this.getHeader('content-type');
      (e.body.responses || [e]).forEach((res, i) => {
        if (res && res.body){
          // res.body = aim.evalData(res.body);
        }
        // console.debug('BODY', res.body);
      });
      // this.body = e.body;
      // this.resolve(this);
      this.resolve(e);
      // this.resolve({
      // 	body: e.body,
      // 	json(){
      // 		return e.body;
      // 	}
      // });
    },},
    pdfpages: {value: function (selector) {
      return aim.promise('pdf-pages', resolve => {
        let pages=[];
        function read_pages(pdf) {
          // pagesProgress.max = pdf.numPages;
          aim().progress(0, pdf.numPages);
          (function getPage(pageNumber) {
            // //console.log(pageNumber);
            pdf.getPage(pageNumber).then(function (page) {
              page.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false,
              }).then(item => {
                pages.push(item.items);
                if (pageNumber < pdf.numPages) {
                  aim().progress(pageNumber);
                  setTimeout(() => getPage(++pageNumber),0);
                } else {
                  resolve(pages);
                }
              });
            });
          })(1);
        }
        if (selector instanceof File) {
          //console.log('is file', selector);
          var fileReader = new FileReader();
          fileReader.onload = function (e){
            const array = new Uint8Array(e.target.result);
            pdfjsLib.getDocument({data: array}).promise.then(read_pages);
          };
          fileReader.readAsArrayBuffer(selector);
        } else {
          pdfjsLib.getDocument(selector).promise.then(read_pages);
        }
      });
    },},
    panel: {value: function () {
      return aim('div').panel();
    },},
    procstate: {value: function (selector) {
      return aim('div').class('procstate').text(selector);
    },},
    progress: {value: function (value = 0, max = 0) {
      if (aim.his.elem.statusbar) {
        value = aim.his.elem.statusbar.progress.elem.value = (aim.his.elem.statusbar.progress.elem.value || 0) + value;
        max = aim.his.elem.statusbar.progress.elem.max = (aim.his.elem.statusbar.progress.elem.max || 0) + max;
        aim.his.elem.statusbar.progress
        .max(max)
        .value(value || null)
        .attr('proc', max ? Math.round(value / max * 100) : null)
      }
    },},
    popupmenuitems: {value: function (item) {
      return;
      var itemmenu = aim.menuitems;
      if (item.attributes && item.attributes.state && item.attributes.state.options) {
        //item.attributes.state.options.onclick = function () {
        //	// //console.debug('SET STATE', this.item);
        //	this.item.set({ state: aim.Object.findFieldValue(this.item.attributes.state.options, 'Title', this.menuitem.Title) });
        //};
        itemmenu.state.menu = item.attributes.state.options;
      }
      return itemmenu;
    },},
    schemas: {value: function schemas(selector, context){
      if (!selector) return this.get('schemas');
      if (selector instanceof Object){
        return Object.entries(selector).forEach(entry => this.schemas(...entry));
      } else {
        const schemas = this.get('schemas') || this.set('schemas', new Map()).get('schemas');
        selector = validSchemaName(selector);
        if (!schemas.has(selector)){
          if (!self[selector]){
            // console.debug('CREATE SCHEMA', selector);
            eval(`${selector} = function (){}`);
          }
          const constructor = self[selector];
          Object.values(context.properties = context.properties || {}).forEach(property => {
            if (property.enum && typeof property.enum === 'object') {
              property.options = property.enum;
            }
            if (property.options) {
              property.options = Object.fromEntries(Object.entries(property.options).map(([optionName,option])=>[optionName,typeof option === 'object' ? option : {title: option}]));
              property.enum = Object.keys(property.options);
              if (property.enum.length === 2 && Object.values(property.options).filter(Boolean).length === 1) {
                property.format = 'checkbox';
              }
            }
          });
          context.allOf = context.allOf || ['Item'];
          const allOf = context.allOf || [];
          var allContext = {};
          // //console.log(selector, context);
          allOf.forEach(name => {
            if (schemas.has(name)) {
              allContext = extend(allContext, schemas.get(name));
              // //console.log(selector, name,schemas.get(name),allContext);
            }
          });
          context = extend(allContext, context);
          this.schemas[selector] = context = extend(allContext, context);
          // //console.log(selector, context);
          schemas.set(selector, context);
          if (selector !== 'Item') {
            // constructor.prototype = Object.create(Object.getPrototypeOf(Item.prototype), Object.getOwnPropertyDescriptors(Item.prototype));
            constructor.prototype = Object.create(Item.prototype, Object.getOwnPropertyDescriptors(Item.prototype));
          }


          for (let [propertyName, property] of Object.entries(context.properties||{})) {
            property.name = propertyName;
            if (!constructor.prototype.hasOwnProperty(propertyName)){
              Object.defineProperty(constructor.prototype, propertyName, typeof property.value === 'function' ? {
                value: new Function(property.value.replace(/^value\(\) \{|\}aim/g,''))
              } : {
                get() {
                  // if (property.get){
                  //   if (typeof property.get === 'function'){
                  //     return property.get.call(this);
                  //   } else {
                  //     const names = property.get.split(',');
                  //     return Object.entries(this.schema.properties)
                  //     .filter(entry => names.includes(entry[0]))
                  //     .filter(entry => entry[0] in this.data)
                  //     .map(entry => (this.data[entry[0]] ? this.data[entry[0]].Value || this.data[entry[0]] : '') )
                  //     .join(' ')
                  //     // 	console.debug('headerValue', attributeName, index, v, this.data, this.schemaName, this.schema.properties);
                  //
                  //   }
                  // }
                  // console.debug(propertyName, this);
                  return this.getValue(propertyName);
                  // if (this.data && this.data[propertyName]){
                  //   return typeof this.data[propertyName] === 'object' ? this.data[propertyName].Value : this.data[propertyName];
                  // }
                },
                set(value) {
                  this.attr(propertyName, value, true);
                }
              });
            }
          }
          Object.defineProperties(constructor.prototype, {
            schema: { value: context, writable: true },
            schemaName: {value: selector, writable: true},
          });
          if (context.operations){
            for (let [operationName, operation] of Object.entries(context.operations)){
              // console.debug(operationName);
              operationName = operationName.replace(/(\(.*)/,'');
              if (constructor.prototype[operationName]){
                let operation = constructor.prototype[operationName];
                // console.debug('OPEREATION', operationName, String(operation));
                console.debug('OPERATION', selector, operationName);
                constructor.prototype[operationName] = function (){
                  aim.forward = null;
                  operation.apply(item, arguments);
                }
              } else {
                if (typeof operation === 'function'){
                  constructor.prototype[operationName] = operation;
                } else {
                  constructor.prototype[operationName] = function (){
                    let args = [...arguments];
                    if (aim.forward) return;
                    // console.error('Send',tag,operationName,args);
                    // return;
                    let path = `/${tag}/${operationName}(${args.join(', ')})`;
                    new aim.WebsocketRequest({
                      to: { aud: aim.auth.access.aud },
                      path: path,
                      method: 'post',
                      forward: aim.forward || aim.WebsocketClient.socket_id,
                    });
                  };//.bind({ path: '/' + tag + '/' + operationName  });
                }
              }
            }
          }
          // DEBUG: schema toevoegen als item voor aanpaasen in OM, vervalt. Gaat mis door aanmaken
          // const item = Item.get(context);
          // item.isSchema = true;
        }
      }
      return this;
    },},
    send: {value: function (context){
      // console.debug(context, this.ws());
      // this.ws().send(context);
      // if (aim.ws){
      // 	aim.ws.message(JSON.stringify(context));
      // }
    },},
    _sendNotification: {value: function () {
      ws.send({
        to: this.item.users,
        Notification: {
          Title: this.put.Subject,
          options: {
            body: "Bericht geplaatst door " + this.get.from,
            url: "https://aliconnect.nl/tms/app/om/#id=" + this.get.id,
            icon: "https://aliconnect.nl/favicon.ico",
            //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
            data: {
              href: '#?id=' + this.get.id
            },
          }
          //api: this.api, get: this.get, put: this.put
        }
      });
    },},
    set: {value: function (selector, context){
      (this.props = this.props || new Map()).set(selector, context);
      return this;
    },},
    setconfig: {value: function (context){
      aim().extend(context);
    },},
    setState: {value: function (state){
      Object.values(aim.client).forEach(client => client.setUserstate(state));
    },},
    state: {value: function (){},},
    storage: {value: function (selector, context, type){
      // cookieSettings = localStorage.getItem('cookieSettings');
      const cookieSettings = {
        session: true,
        functional: true,
        tracking: true,
        cookie: true,
      };
      aim.his.cookie = aim.his.cookie || new Map(self.document ? document.cookie.split("; ").map(val => val.split('=')) : null);
      // console.debug(aim.his.cookie.get('id_token'));
      if (arguments.length === 1){
        const value =
        aim.his.cookie.get(selector) ||
        (self.sessionStorage ? self.sessionStorage.getItem(selector) : null) ||
        (localStorage ? localStorage.getItem(selector) : null) ||
        '';
        // console.warn(selector,value);
        try {
          return JSON.parse(value);
        } catch (err){
          return value;
        }
      } else if (context === null){
        console.debug('remove', selector);
        self.sessionStorage.removeItem(selector);
        localStorage.removeItem(selector);
        document.cookie = `${selector}= ;path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
        aim.his.cookie.delete(selector);
        // console.debug(document.cookie);
        // console.debug('delete', selector, localStorage.getItem(selector));
      } else {
        type = type || 'functional';
        context = JSON.stringify(context);
        // console.warn('SET', selector, context);
        if (type === 'cookie'){
          aim.his.cookie(selector, context);
          document.cookie = `${selector}=${context} ;path=/; SameSite=Lax`;
        } else if (type === 'session'){
          if (self.sessionStorage){
            self.sessionStorage.setItem(selector, context);
          }
        } else if (cookieSettings[type]){
          if (localStorage){
            localStorage.setItem(selector, context);
          }
          // console.debug('set', selector, context, localStorage.getItem(selector));
        }
      }
      return this;
    },},
    status: {value: function (selector, context){
      if (aim.his.elem.statusbar && aim.his.elem.statusbar[selector]){
        // console.warn(selector, aim.his.elem.statusbar, aim.his.elem.statusbar[selector]);
        aim.his.elem.statusbar[selector].attr('context', context);
      } else {
        // console.debug(selector, context);
      }
      return this;
    },},
    signin: {value: function (){
      aim().on({
        async load() {
          aim().server.url = aim().server.url || document.location.origin;
          await aim().url(aim().server.url+'/api.json').get().then(e => aim().extend(e.body));
          await aim().login();
        }
      });
    },},
    translate: {value: function (lang) {
      lang = (lang || navigator.language || navigator.userLanguage).split(/-/)[0];
      return this.url(dmsUrl + '/translate').query('lang', lang)
      .get().then(e => aim.his.translate = new Map(Object.entries(e.body)));
    },},
    url: {value: Request },
    // url: {value: function (url, base){
    //   return new Request(url, base);
    // },},
    userName: {value: function (){
      return aim.auth && aim.auth.id ? aim.auth.id.name : ''
    },},
    ws: {value: function (options){
      // //console.log('MAXXXX');
      return this.get(WebSocket, options ? Object.assign(options,{authProvider: options.authProvider || aim.client.authProvider}) : null);
    },},
  });

  function Account(id_token) {
    console.warn(1, id_token);
    try {
      const id = this.idToken = JSON.parse(atob((this.id_token = id_token).split('.')[1]));
      aimClient.storage.setItem('aimAccount', JSON.stringify(id));
      // console.warn(2, id);
      this.sub = id.sub;
      this.name = id.name || id.email || id.sub;
      this.username = id.preferred_username || this.name;
      this.accountIdentifier = this.idToken.account_id;
    } catch (err) {
      console.error(err);
    }
  };
  function clientAttr(options) {
    return aim().url(dmsUrl).query({
      request_type: 'client_attr',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }).post(options).then(e => {
      //console.log(e.target.responseText);
    })
  }
  function getAccount() {
    return Object.fromEntries(
      [
        'accountname',
        'unique_name',
        'prefered_username',
        'name',
        'email',
        'family_name',
        'given_name',
        'middle_name',
        'nickname',
        'phone_number',
      ]
      .filter(name => this.account.idToken[name])
      .map(name => [name,this.account.idToken[name]])
    );
  }
  function store(name, value) {
    if (value) {
      this.storage.setItem(`aim.${name}`, value);
      this.storage.setItem(`aim.${this.clientId}.${name}`, value);
    } else {
      this.storage.removeItem(`aim.${name}`);
      this.storage.removeItem(`aim.${this.clientId}.${name}`);
    }
  }
  function setIdToken(id_token) {
    this.store('id_token', id_token);
    this.account = new Account(id_token);
  }
  function setAccessToken(id_token) {
    this.store('access_token', id_token);
  }
  function getAccessToken(options){
    return aim.promise('getAccessToken', resolve => {
      if (options){
        aim().url(AUTHORIZATION_TOKEN_URL).post(Object.assign({
          grant_type: 'authorization_code',
          // code: options.code, // default, overide by params
          client_id: this.config.auth.client_id,
          // 'client_secret' => Aimthis->client_secret,
          access_type: 'offline', // only if access to client data is needed when user is not logged in
        }, options)).then(e => {
          this.setIdToken(e.body.id_token);
          this.setAccessToken(e.body.access_token);
          this.store('refresh_token', e.body.refresh_token);
          // this.account = new Account(e.body.id_token);
          resolve(this.access_token);
        })
      } else {
        resolve(this.access_token);
      }
    });
  }
  function login(options){
    return aim.promise('Login', async (resolve, fail) => {
      // //console.log('LOGIN', options);
      // return;

      if (options !== undefined){
        let state = Math.ceil(Math.random() * 99999);
        //console.log(99999, options);
        options = {
          // scope: 'name+email+phone_number',
          response_type: 'code',
          client_id: this.config.auth.client_id = this.config.auth.client_id || this.config.auth.clientId,
          redirect_uri: this.config.auth.redirect_uri = this.config.auth.redirect_uri || this.config.auth.redirectUri || this.config.redirect_uri || this.config.redirectUri,
          state: state,
          prompt: 'consent',
          scope: options.scope || options.scopes.join(' ') || '',
          // socket_id: aim.WebsocketClient.socket_id,
        };
        const url = aim().url(this.config.auth.url).query(options).toString();
        //console.log(url, this.config);
        if (document.location.protocol === 'file:'){
          options.socket_id = this.ws.socket_id;
          this.loginWindow = self.open(
            url,
            'login',
            `top=${10},left=${10},width=400,height=500,resizable=0,menubar=0,status=0,titlebar=0`
          );
        } else {
          aim.clipboard.reload(url);
        }
      }
      this.init();

      self.addEventListener('focus', e => {
        if (this.access_token) {
          // //console.log('JE BENT INGELOGT, DUS CONTROLEREN OF TOKEN NOG OK IS ALS HET EEN INLOG TOKEN IS');
          const access = this.access;
          // als een nonce aanwezig is dan is het een inlog token.
          // controleer of token nog actief is, c.q. gebruiker is ingelogt
          if (access.nonce) {
            aim().url(AUTHORIZATION_URL).headers('Authorization', 'Bearer ' + this.access_token).post({
              request_type: 'access_token_verification',
              // access_token: aimClient.access_token,
            }).then(e => {
              if (e.target.status !== 200) {
                aim().logout();
              }
            });
          }
          // //console.log(aimClient);
        }
      });

      // //console.log(this);
      if (this.account) {
        resolve(this.account);
      } else {
        fail('no login');
      }

      // let previousIdToken = aim.auth.id_token;
      // let previousAccessToken = aim.auth.access_token;
      // aim.auth.init();
      // if (aim.auth.id_token && previousIdToken !== aim.auth.id_token){
      // 	aim().emit('login');
      // }
    });
  }
  function loginPopup (options) {
    return aim.promise('LoginPopup', async (resolve, reject) => {
      console.log('options', options, this.config);
      options = {
        // scope: 'name+email+phone_number',
        response_type: 'code',
        response_type: 'token',
        client_id: this.config.auth.client_id = this.config.auth.client_id || this.config.auth.clientId,
        // redirect_uri: this.config.auth.redirect_uri = this.config.auth.redirect_uri || this.config.auth.redirectUri || this.config.redirect_uri || this.config.redirectUri,
        // state: state,
        prompt: 'consent',
        scope: options.scope || options.scopes.join(' ') || '',
        // socket_id: aim.WebsocketClient.socket_id,
      };
      const url = aim().url(AUTHORIZATION_URL).query(options).toString();
      const height = 600;
      const width = 400;
      let rect = document.body.getBoundingClientRect();
      let top = self.screenTop + (self.innerHeight - height) / 2;
      let left = self.screenLeft + (self.innerWidth - width) / 2;
      const popup = self.open(url, 'loginPopup', `top=${top},left=${left},width=${width},height=${height},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`);
      const interval = setInterval(() => popup.postMessage({msg: 'loginPopup'}, 'https://login.aliconnect.nl'), 1000);
      self.removeEventListener('message', loginPopup.messageListener);
      loginPopup.messageListener = self.addEventListener('message', (event) => {
        console.log(event.data);
        if (event.data.msg === 'loginPopupAck') {
          clearInterval(interval);
        }
        if (event.data.url) {
          const url = new URL(event.data.url, document.location);
          if (url.searchParams.has('token')) {
            const access_token = url.searchParams.get('token');
            console.log(this);
            this.store('access_token', access_token);
            const access = JSON.parse(atob((access_token).split('.')[1]));
            aim().url('https://login.aliconnect.nl/token')
            .query('client_id', this.config.auth.client_id)
            .query('response_type', 'id_token')
            .headers('Authorization', 'Bearer ' + access_token)
            .get().then(e => {
              this.store('id_token', e.body.id_token);
              this.account = new Account(e.body.id_token);
              popup.postMessage({msg: 'close'}, 'https://login.aliconnect.nl');
              resolve({account: this.account});
            })
          } else if (url.searchParams.has('code')) {
            this.getAccessToken({
              code: url.searchParams.get('code')
            }).then(e => {
              //console.log(3333);
              resolve({
                accessToken: this.storage.getItem('aim.access_token'),
                account: this.account,
                accountState: "72fc40a8-a2d7-4998-afd0-3a74589015ac",
                expiresOn: null,
                fromCache: false,
                idToken: this.account.idToken,
                // idToken: {
                //   rawIdToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5Pbz…SUqywC4QuHklGPvrKVQiMc9jpdJfz2DMIfT6O--gxZD2ApJZg",
                //   claims: {…},
                //   issuer: "https://login.microsoftonline.com/09786696-f227-4199-91a0-45783f6c660b/v2.0",
                //   objectId: "f40f8462-da7f-457c-bd8c-d9e5639d2975", subject: "w6TIVTl01uuD9UHe12Fk6YLiilqhf1arasLwPwGnxV0", …}
                // idTokenClaims: {aud: "4573bb93-5012-4c50-9cc5-562ac8f9a626", iss: "https://login.microsoftonline.com/09786696-f227-4199-91a0-45783f6c660b/v2.0", iat: 1625751439, nbf: 1625751439, exp: 1625755339, …}
                scopes: [],
                tenantId: "09786696-f227-4199-91a0-45783f6c660b",
                tokenType: "id_token",
                uniqueId: "f40f8462-da7f-457c-bd8c-d9e5639d2975",
              });
            });
          }
        }
      }, false);
      // win.onbeforeunload = e => resolve();
    });
    // this.authProvider.login(this.config.auth);
  }
  function setConfig(config){
    aim.extend(this.config, config);
    if (this.config.components && this.config.components.schemas) {
      aim().schemas(this.config.components.schemas);
    }
  }
  function logout(options){
    return new Promise((resolve, reject) => {
      // //console.log(sessionStorage('aim.id_token'));
      if (this.storage.getItem('aim.id_token')) {
        this.storage.removeItem('aim.id_token');
        this.storage.removeItem('aim.refresh_token');
        this.storage.removeItem('aim.access_token');
        return resolve();
        // aim.clipboard.reload();
        aim.clipboard.reload(aim().url(AUTHORIZATION_URL).query({
          prompt: 'logout',
          client_id: aim().client_id || '',
          redirect_uri: document.location.origin + document.location.pathname,
        }).toString());
      } else {
        return resolve();
        const searchParams = new URLSearchParams(document.location.href);
        if (searchParams.get('redirect_uri')) {
          document.location.href = searchParams.get('redirect_uri');
        }
      }
    })
  }
  function refreshToken(){
    return console.error('refreshToken');
    if (this.refreshTokenHandle) return;
    //console.log(aim.Client);
    this.refreshTokenHandle = new aim.Client('https://login.aliconnect.nl/token/').post({
      grant_type: 'refresh_token',
      refresh_token: aim.his.cookie.refresh_token,
      client_id: aim().client_id,
      // 'redirect_uri' => self::Aimredirect_uri,
      // 'client_secret' => Aimthis->client_secret,
    }).then(e => {
      // console.debug('REFR TOKEN',e);
      this.refreshTokenHandle = null;
      // var token = e.body.access_token;
      // var access = JSON.parse(atob(token.split('.')[1]));
      // var time = new Date().getTime()/1000;
      // var expires_in = Math.round(access.exp - time);
      // console.error('RRRRRRRRRRRRefreshToken', expires_in, access);
      // aim.his.cookie = {
      // 	access_token: e.body.access_token
      // };
      // var token = aim.auth.access_token = aim.his.cookie.access_token || aim.his.cookie.id_token;
      // var access = JSON.parse(atob(token.split('.')[1]));
      // var time = new Date().getTime()/1000;
      // var expires_in = Math.round(access.exp - time);
      // console.error('RRRRRRRRRRRRefreshToken', expires_in, access);
      //
      return;
      aim.his.cookie = {
        access_token: e.body.access_token
      };
      aim.auth.init();
      // aim.auth.refreshToken = () => {console.debug('NOOOO');};
      // updateAccessToken();
    });
  }
  function token(token, clientSecret){
    if (token){
      const time = new Date().getTime() / 1000;
      const access = JSON.parse(atob(token.split('.')[1]));
      return {
        token: token,
        access: access,
        time: time,
        expires_in: Math.round(access.exp - time),
        isValid: access.exp > time || true,
      }
    }
  }
  function trackLocalSession(){
    return;
    clearTimeout(arguments.callee.timeout);
    const cookie = aim.his.cookie;
    // console.debug (`trackLocalSession`);
    if (!cookie.id_token && auth.id_token > ''){
      return this.logout();
    } else if (cookie.id_token > '' && !auth.id_token){
      // return client.login();
    }
    arguments.callee.timeout = setTimeout(arguments.callee, aim.config.trackLocalSessionTime);
  }
  function trackSession(){
    return;
    // console.error (`trackSession`, aim.auth.id.iss, arguments.callee.timeout);
    if (arguments.callee.httpRequest) return;
    clearTimeout(arguments.callee.timeout);
    self.removeEventListener('focus', arguments.callee);
    self.addEventListener('focus', arguments.callee);
    // aim.auth.id.iss = 'login.aliconnect.nl/api/oauth';
    // alert(1);
    arguments.callee.timeout = setTimeout(arguments.callee, aim.config.trackSessionTime);
    arguments.callee.httpRequest = aim().url(authorizationUrl)
    .query('request_type', 'check_access_token')
    .headers('Authorization', 'Bearer ' + auth.id_token)
    .get()
    .then(e => {
      console.warn('trackSession', e.target);
      arguments.callee.httpRequest = null;
      // console.debug(aim.auth.id.nonce, e.target.status, e.target.responseText);
      if (e.target.status !== 200){
        self.removeEventListener('focus', arguments.callee);
        // return aim.auth.logout();
      }
    });
  }
  function getAccountByUsername(name) {
    // //console.log(name);
    return this.account;
  }
  function acquireTokenSilent(silentRequest) {
    /**
    silentRequest.scopes
    silentRequest.account (aimClient.getAccountByUsername(account))
    */
    return aim.promise('acquireTokenSilent', async (resolve, fail) => {
      // check token exppired, if yes get new token.
      // //console.log(this);
      resolve({
        accessToken: this.storage.getItem(`aim.${this.clientId}.access_token`),
      });
    })
  }
  function acquireTokenPopup(aimRequest) {
    return this.loginPopup(aimRequest);
  }

  function UserAgentApplication(config = {}) {
    // if (!config.client_id) throw 'Missing client_id';
    // //console.log('WEB CONSTRUCTOR');
    aimClient = this;
    aim.extend(aim.config, config);
    config = this.config = aim.config;
    this.clients = [];
    this.servers = new Map;
    this.storage = self[config.cache.cacheLocation];

    // this.storage.clear();

    this.clientId = config.auth.client_id = config.client_id || config.auth.client_id;
    // config.auth.scopes = config.scope.split(' ');

    // this.clientSecret = config.client_secret = this.storage.getItem('client_secret');


    if (this.storage.getItem('aim.id_token')) {
      this.account = new Account(this.storage.getItem('aim.id_token'));
      // //console.log(111, this.account);
    }
    if (this.storage.getItem('aim.access_token')) {
      // //console.log(this.storage.getItem('access_token'));
    }
    const url = new URL(document.location);

    if (url.searchParams.has('token')) {
      this.store('access_token', url.searchParams.get('token'));
      url.searchParams.delete('token');
      url.searchParams.delete('state');
      self.history.replaceState('page', '', url.href);
    }




    // console.error(this.config.components, this.config, aim().schemas())


    (function loadpar(arr, path = '') {
      if (arr) {
        for (let [key,value] of Object.entries(arr)) {
          if (typeof value === 'object') {
            loadpar(value, `${path}${key}-`);
          } else {
            // //console.log(`%${path}${key}%`,value);
            aim.his.api_parameters[`%${path}${key}%`] = value;
          }
        }
      }
    })(config);
    // if (config.components && config.components.schemas) {
    //   aim().schemas(config.components.schemas);
    // }
    aim.his.items = {};
  };

  async function init () {
    // //console.log('INIT');
    const url = new URL(document.location);
    if (url.searchParams.has('code')){
      // return console.error(url.searchParams.get('code'));
      await this.getAccessToken({code: url.searchParams.get('code')}).then(e => {
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        self.history.replaceState('page', '', url.href);
        // document.location.href = url.href;
      });
      // throw "Sign in processed. Please wait";
    }
    return this;
    // return console.warn(this);
    // Object.assign(this, options);
    // const auth = this.config.auth;
    // ['id_token', 'refresh_token', 'access_token'].forEach(token => aim().storage(token, auth[token] = auth[token] || aim().storage(token) || ''));
    // self.sessionStorage.clear();
    // localStorage.clear();
    const access_token = auth.api_key || auth.access_token || auth.id_token;
    // //console.log([access_token, auth.api_key, auth.access_token, auth.id_token]);
    if (access_token){
      try {
        // console.error(access_token);
        this.access = JSON.parse(atob(access_token.split('.')[1]));
        this.sub = this.access.sub;
        this.aud = this.access.aud;
        if (this.ws){
          this.send({ headers: {Authorization:'Bearer ' + aimClient.getAccessToken() } });
        }
      } catch (err){
      }
    }
    if (token = this.token(auth.api_key)){
      this.access_token = token.token;
    } else if (token = this.token(auth.access_token)){
      const refresh = this.token(this.access_token = auth.refresh_token);
      if (refresh){
        clearTimeout(this.refreshTokenTimeout);
        // console.error(`REFRESH EXPIRES IN ${expires_in}`, aim.auth.refreshTokenTimeout);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, (refresh.expires_in - 2) * 1000);
      }
    }
    // aim().storage(this.key+'AuthProvider',this.auth)
    return this;
  }
  UserAgentApplication.prototype = {
    init,
    loginPopup,
    logout,
    store,
  }

  aim.clients = new Map();
  function initWithMiddleware(options, config) {
    return new Client(options, config);
  }
  function Client (options, config) {
    console.warn('Client', options, config);

    this.config = config;
    this.options = options;
    // this.client_id = config.client_id;
    // aim.clients.push(this);
    config.servers = config.servers || [{url: aim.config.url}];
    // console.warn(config.servers, aim.config.url);
    Array.from(config.servers).forEach(server => aimClient.servers.set(server.url, this));
    this.url = config.servers[0].url;
    this.hostname = new URL(this.url).hostname;
    aim.clients.set(this.hostname, this);


    // this.hostname = this.url.match(/\/\/(.*?)\//)[1];
    // this.headers = {};

    // return this;
    // this.hostname = new (this.url).hostname;//.match(/\/\/(.*?)\//)[1];
    // clients.set(this.hostname, this);
    // client(options){
    //   this.get(Client, options ? Object.assign(options,{authProvider: options.authProvider || this.authProvider()}) : null);
    //   return this;
    // },
    // console.error(...arguments);
    // [...arguments].forEach(aim(this).extend)
    // this.config = {
    //   id: {},
    //   server: [
    //     {
    //       url: self.document ? document.location.origin+'/api' : 'https://aliconnect.nl/api',
    //     }
    //   ]
    // };
    // [...arguments].forEach(options => aim(this.config).extend(options));



    // this.config = config;
    // console.debug(this.authProvider);
    // if (this.access_token = this.authProvider.getAccessToken()){
    // 	this.access = JSON.parse(atob(this.access_token.split('.')[1]));
    // 	this.sub = this.access.sub;
    // 	this.aud = this.access.aud;
    // }
    // aim.his.dms = aim.his.dms || [];
    // aim.his.dms.push(this);
    // aim().dms[selector] = this;
    // Object.assign(this, context);
    // this.config = context;
    // console.debug('SERVERS', this.servers);

    // this.id = {};
    // this.servers = this.servers || [];
    // this.server = this.servers[0] || {};
    // this.url = this.server.url || (self.document ? document.location.origin+'/api' : 'https://aliconnect.nl/api');
    // const hostname = this.hostname = this.url.match(/\/\/(.*?)\//)[1];
    // aim[hostname] = this;
    // console.debug('Client', this.hostname, this);
    // const servers = this.servers || [];
    // this.server = servers[0] || {};
    // console.debug(`Client ${selector} = ${context.info ? context.info.title : ''}`);
  };
  Object.assign(Client, {
    initWithMiddleware,
  })
  Client.prototype = {
    headers: {},
    loadConfig() {
      return new Promise((success, fail) => {
        aim().url(this.url + '/aliconnect/config')
        .query('client_id', this.config.client_id)
        .get()
        .then(e => success(this.config = e.body))
      });
    },
  }
  Object.defineProperties(Client.prototype, {
    loginUrl: { value: function loginUrl() {
      console.error(this.config.client_id);
      return aim()
      .url('https://login.aliconnect.nl/')
      .query({
        prompt: 'login',
        response_type: 'code',
        client_id: this.config.client_id,
        redirect_uri: document.location.origin + (this.config.redirect_path || ''),
        // client_id: config.auth.client_id || config.auth.clientId,
        // state: state,
        scope: this.config.scope,//('all'),
        // socket_id: data.socket_id,
      });
    }},
    // configGet() {
    //   return aim().url(this.url+'/../config.json').get().then(e => {
    //     console.warn('configGet', e.body);
    //     aim.extend(this.config, e.body);
    //     // aim.config = e.body;
    //   }).catch(console.error);
    // },
    // configUserGet() {
    //   return aim().url(this.url+`/../config/${this.authProvider.sub}/config.json`).get().then(e => {
    //     aim.extend(this.config, e.body);
    //     // aim.extend(aim.config, JSON.parse(e.target.responseText));
    //     // aim(aim.config).extend(aimClient.api_user = e.body);
    //   }).catch(err => {
    //     // aimClient.api_user = {};
    //   });
    // },
    api: { value: function (src){
      // console.error(5555, this.headers, this.options, this.config, this.url);
      // const thisUrl = new URL(this.url);
      // const basePath =
      // const url = new URL(src, this.url);
      return aim().url(src.match(/\/\//) ? src : this.url + src)//new URL(src, this.url).href)
      .headers('accept', 'application/json')
      .headers(this.headers)
      .authProvider(this.options.authProvider)
      .body()
    }},
    // getApi(){
    //   return aim.promise( 'Get API', (resolve,fail) => {
    //     const api = this.api('/').get().then(e => {
    //       if (e.body.components && e.body.components.schemas) {
    //         aim().schemas(e.body.components.schemas);
    //       }
    //       // console.warn(e.body);
    //       resolve(e.body);
    //     })
    //   });
    // },



    Get_Aliconnector_Key: { value: function (){
      copyText = document.body.createElement('INPUT', { value: aim.deviceUID });
      copyText.select();
      document.execCommand("Copy");
      document.body.removeChild(copyText);
      alert('Plak (Ctrl+V) de code in het veld "User device UID" van uw aliconnector app');
    }},
    addrules: { value: function (){
      if (this.web && this.web.css && this.web.css.rules){
        for (let [name, value] of Object.entries(this.web.css.rules)){
          new aim.css(name, value);
        }
      }
    }},
    createLoginFrame: { value: function (params){
      params = Object.assign(params, {
        response_type: 'code',
        // redirect_uri: document.location.href,
        prompt: 'accept',
        scope: 'name email',
      });
      // params = new URLSearchParams({
      // 	client_id: client_id || aim.config.aim.client_id,
      // 	response_type: 'code',
      // 	// redirect_uri: document.location.href,
      // 	scope: 'name email',
      // 	state: '12345',
      // 	prompt: 'login',
      // });
      let url = 'https://login.aliconnect.nl?' + new URLSearchParams(params).toString();
      console.debug('LOGIN', url);
      // let login_window = self.open(url, 'login', 'top=0,left=0,width=300,height=300');
      // let loginElement = document.body.createElement('iframe', {src: url, style: 'position:fixed;margin:auto;width:100%;height:100%;top:50px;right:50px;bottom:50px;left:50px;'});
      let loginElement = document.body.createElement('DIV', { style: 'position:fixed;margin:auto;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);' }, [
        ['IFRAME', { src: url, style: 'position:fixed;margin:auto;top:0;right:0;bottom:0;left:0;width:100%;height:100%;max-width:500px;max-height:500px;border:none;' }]
      ]);
      self.addEventListener('message', e => {
        loginElement.remove();
        aim.auth.getLogin();
        // if (callback) callback(aim.auth.id);
      }, false);
      return;
      // const params = new URLSearchParams({
      // 	client_id: client_id || aim.config.aim.client_id,
      // 	response_type: 'code',
      // 	redirect_uri: document.location.href,
      // 	scope: 'name email',
      // 	state: '12345',
      // 	prompt: 'login',
      // });
      // document.location.href = 'https://login.aliconnect.nl?' + params.toString();
    }},
    mail: { value: function (){
      return new aim.HttpRequest('POST', aim.origin + '/api?request_type=mail', params, res).send();
    }},
    pdf: { value: function (){
      return new aim.HttpRequest('POST', aim.origin + '/api?request_type=pdf', params, res).send();
    }},
    publish: { value: function (){
      console.debug("PUBLISH");
      new aim.HttpRequest(aim.config.aim, 'POST', '/', aimapi, e => {
        console.debug("API", this.responseText );
        return;
        var swaggerUrl = 'https://editor.swagger.io/?url=https://'+aim.config.aim.domain+'.aliconnect.nl/openapi.json';
        var onlineUrl = 'https://' + aim.config.aim.domain + '.aliconnect.nl';
        console.debug(swaggerUrl, onlineUrl);
        if (confirm("Show in Swagger editor")) self.open(swaggerUrl, "swagger");
        //else console.debug(swaggerUrl);
        if (confirm("Show online")) self.open(onlineUrl, "om");
        return;
        console.debug(onlineUrl, this.responseText);
        document.location.href = document.location.pathname;
      }).send();
      return;
      var def = {
        paths: {
          item: {
            get: {
              parameters: [
                {name: "id", in: "path", description: "", required: true, schema: { type: "integer", format:"int64"}},
                {name: "child", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "tree", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "master", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "src", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "user", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "refby", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "link", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "select", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "search", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "sync", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "order", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "filter", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "three", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "top", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Accept", in: "query", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Accept", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "Odata-Version", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "aud", in: "header", description: "", schema: { type: "integer", format:"int64"}},
                {name: "sub", in: "header", description: "", schema: { type: "integer", format:"int64"}},
              ],
              responses: {
                405: { description: "Invalid input", content: { } }
              },
            },
          }
        }
      };
      var api = JSON.parse(aimapi);
      api.paths = api.paths || {};
      for (var SchemaName in api.components.schemas){
        var schemaName = SchemaName, schema = api.components.schemas[SchemaName];
        (api.tags = api.tags || []).push({name:SchemaName});
        schema.security = schema.security || {
          get: [{ default_auth: ['read:web'] }],
          post: [{ default_auth: ['read:web'] }],
          patch: [{ default_auth: ['read:web'] }],
          delete: [{ default_auth: ['read:web'] }],
        };
        api.paths['/' + schemaName] = api.paths['/' + schemaName] || {
          get: {
            //"tableName": schema.tableName, "idname": schema.idname, "searchNames": schema.searchNames,
            tags: [schemaName],
            Summary: "Get list of " + SchemaName,
            operationId: "item('" + SchemaName + "').find",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "Aimref": "#/paths/item/get/responses" },
            security: schema.security.get,
          },
          post: {
            tableName: schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Add a new " + SchemaName,
            operationId: "item('" + SchemaName + "').add",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "Aimref": "#/paths/item/get/responses" },
            requestBody: {
              description: SchemaName + " object that needs to be added to the store",
              content: { "application/json": { schema: { "Aimref": "#/components/schemas/" + SchemaName } } }
            },
            security: schema.security.post,
          },
        };
        api.paths['/' + schemaName + "(id)"] = api.paths['/' + schemaName + "(id)"] || {
          get: {
            // tableName: schema.tableName,
            // idname: schema.idname,
            tags: [schemaName],
            Summary: "Find " + SchemaName + " by ID",
            description: "Returns a single " + SchemaName,
            operationId: "item('" + SchemaName + "').get",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: {
              200: { description: "successful operation", content: { "application/json": { schema: { "Aimref": "#/components/schemas/" + SchemaName } } } },
              400: { description: "Invalid ID supplied", content: {} },
              404: { description: SchemaName + " not found", content: {} }
            },
            security: schema.security.get,
          },
          post: {
            // tableName: schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Updates a " + SchemaName + " with form data",
            operationId: "item('" + SchemaName + "').post",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "Aimref": "#/paths/item/get/responses" },
            requestBody: {
              content: {
                "application/x-IsPublic-form-urlencoded": {
                  schema: {
                    properties: {
                      name: { type: "string", description: "Updated name of the " + SchemaName },
                      status: { type: "string", description: "Updated status of the " + SchemaName }
                    }
                  }
                }
              }
            },
            security: schema.security.post,
          },
          patch: {
            // tableName: schema.tableName,
            // idname: schema.idname,
            tags: [schemaName],
            Summary: "Updates a " + SchemaName,
            operationId: "item('" + SchemaName + "').patch",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "Aimref": "#/paths/item/get/responses" },
            security: schema.security.patch,
          },
          delete: {
            // "tableName": schema.tableName, "idname": schema.idname,
            tags: [schemaName],
            Summary: "Deletes a " + SchemaName,
            operationId: "item('" + SchemaName + "').delete",
            parameters: def.paths.item.get.parameters, //{ "Aimref": "#/paths/item/get/parameters" },
            responses: def.paths.item.get.responses, //{ "Aimref": "#/paths/item/get/responses" },
            security: schema.security.delete,
          }
        }
        //"security, usertasks".split(", ").forEach(function (key){delete(schema[key]);});
        // var properties = {};
        // for (var propertyName in schema.properties){
        // 	var property = properties[propertyName] = {};
        // 	for (var key in ref.properties){
        // 		if (schema.properties[propertyName][key]) property[key] = schema.properties[propertyName][key];
        // 	}
        // }
        //api.components.schemas[SchemaName] = {properties: properties};
      }
      console.debug(api.paths);
      aimapi = JSON.stringify(api, null, 2);
      var js = aim.operations ? JSON.stringify(aim.operations, function (key, value){ return typeof value == "function" ? value.toString() : value }, 4).replace(/\\r\\n/g, '\r\n').replace(/\\t/g, '    ').replace(/"function /g, 'function ').replace(/}"/g, '}') : "";
      //return;
      //console.debug("FN", "aim.extend({operations: {\n" + fn.join(", \n") + "\n}});" );
      new aim.HttpRequest(aim.config.aim, 'POST', '/', aimapi, e => {
        console.debug("API", this.responseText );
        new aim.HttpRequest(aim.config.aim, 'POST', '/?js', `aim.operations = ${js};`, e => {
          console.debug("JS", this.responseText );
          var swaggerUrl = 'https://editor.swagger.io/?url=https://'+aim.config.aim.domain+'.aliconnect.nl/openapi.json';
          var onlineUrl = 'https://'+aim.config.aim.domain+'.aliconnect.nl';
          console.debug(swaggerUrl, onlineUrl);
          if (confirm("Show in Swagger editor")) self.open(swaggerUrl, "swagger");
          //else console.debug(swaggerUrl);
          self.open(onlineUrl, "om");
          return;
          console.debug(onlineUrl, this.responseText);
          document.location.href = document.location.pathname;
        });
      }).send();
    }},
    qrcode: { value: function (selector){
      if (typeof QRCode === 'undefined'){
        return Object.assign(document.head.createElement('script'), {
          src: scriptPath + 'qrcode.js',
          onload: arguments.callee.bind(this, ...arguments),
        });
      }
      new QRCode(selector, {
        // text: aim.config.aim.websocket.socket_id,
        text: aim.config.aim.websocket.socket_id ? 'https://login.aliconnect.nl?s=' + aim.config.aim.websocket.socket_id : '',
        width: 160,
        height: 160
      });
    }},
    randompassword: { value: function (){
      a = [];
      for (var i = 0; i < 20; i++){
        // a.push(String.fromCharCode(48 + Math.round(74 * Math.random())));
        a.push(String.fromCharCode(33 + Math.round((126-33) * Math.random())));
      }
      return a.join('');
    }},
    setUserstate: { value: function (userstate){
      clearTimeout(this.stateTimeout);
      const config = this.config;
      if (this.access && this.access.sub){
        if (userstate === 'available'){
          this.stateTimeout = setTimeout(() => aim.setUserstate('inactive'), 5 * aim.config.minMs);
        } else if (userstate === 'inactive'){
          this.stateTimeout = setTimeout(() => aim.setUserstate('appear_away'), 5 * aim.config.minMs);
        }
        if (this.userstate !== userstate){
          aim.send({
            // to: { aud: aim.auth.access.aud, sub: aim.auth.access.sub },
            sub: this.access.sub,
            userstate: this.userstate = userstate,
          });
        }
      }
    }},
    setState: { value: function (activestate){
      //// console.debug('setactivestate', activestate);
      //var data = { activestate: activestate, accountID: aim.client.account.id, userID: aim.Account.sub, to: [aim.key] };
      //fieldset(aim.Account.sub, 'state', activestate, true);
      //fieldset(aim.client.account.id, 'state', activestate, true);
      // Check if current logged in user is still logged in
      if (activestate == 'focus'){
        //if ('auth' in aim) aim.auth.check_state();
        // src='https://login.aliconnect.nl/api/v1/oauth/tokenindex.php';
        // src='https://login.aliconnect.nl/aim-connect/aim-api/v1/oauth/token/index.php';
        // new aim.Client({
        // 	src: src, onload: function (e){
        // 		// console.debug('SETACTIVESTATE', this.status, this.responseText, this.data);
        // 		if (this.status != 200) aim.auth.login();
        // 		//// console.debug('api', this.data);
        // 	}
        // });
        // src=aim.authurl + 'token/';
        // new aim.Client({
        // 	src: src, onload: function (e){
        // 		// console.debug('SETACTIVESTATE', this.status, this.responseText, this.data);
        // 		if (this.status != 200) aim.auth.login();
        // 		//// console.debug('api', this.data);
        // 	}
        // });
        return;
        ws.send({
          //broadcast: true,
          //to: { host: aim.Account.aud },
          value: [{ id: aim.Account.sub, values: { state: activestate } }, { id: aim.client.account.id, values: { state: activestate } }]
        });
      }
      //return;
      //ws.send(data);
      //ws.send({ a: 'set', id: aim.client.account.id, name: 'online', value: false });
      //ws.send({ a: 'blur' });
      //clearTimeout(msg.to);
      //new aim.Client({
      //    api: 'self/blur/' + aliconnect.deviceUID,
      //    //post: { exec: 'onblur', deviceUID: aliconnect.deviceUID, },
      //    onload: function (){
      //        //// console.debug('onblur done', this.post);
      //    }
      //});
    }},
    sms: { value: function (){
      return new aim.HttpRequest('POST', aim.origin + '/api?request_type=sms', params, res).send();
    }},
    then: { value: function (callback){
      this.callback = callback;
    }},
    ws_send_code: { value: function (socket_id, code){
      aim.WebsocketClient.request({
        to: {
          sid: socket_id,
        },
        body: {
          // id_token: aim.auth.id_token,
          code: code,
        },
      });
      self.close();
    }},
  });

  function His() {}
  His.prototype = {
    map: new Map(),
    api_parameters: {},
    classes: {},
    fav: [],
    items: [],
    elem: {},
  };
  Object.defineProperties(His.prototype, {
    itemsModified: { value: {}},
    handlers: { value: {}},
    httpHandlers: { value: {}},
    mergeState: { value: function (url) {
      var documentUrl = new URL(document.location);
      url = new URL(url, document.location);
      url.searchParams.forEach((value, key) => documentUrl.searchParams.set(key, value));
      // documentUrl.hash='';
      self.history.replaceState('page', '', documentUrl.href.replace(/%2F/g, '/'));
    }},
    replaceUrl: { value: function (selector, context) {
      if (self.history) {
        if (typeof selector === 'object') {
          Object.entries(selector).forEach(entry => arguments.callee(...entry));
        } else if (arguments.length>1) {
          var url = new URL(document.location);
          if (context) {
            url.searchParams.set(selector, context);
          } else {
            url.searchParams.delete(selector)
          }
          url.hash='';
        } else {
          var url = new URL(selector, document.location.origin);
        }
        url = url.pathname.replace(
          /^\/\//,
          '/'
        ) + url.search;
        self.history.replaceState('page', '', url);
      }
    }},
  });

  Item = function () {};
  Object.defineProperties(Item, {
    get: { value: function itemGet (selector, schemaName){
      // iii++;
      // if (iii>1000) throw 'STOP';
      if (!selector) throw 'No Item selector';
      // console.warn(selector, schemaName);

      if (selector instanceof Item) return selector;

      if (typeof selector !== 'object'){
        if (aim.his.map.has(selector)){
          return aim.his.map.get(selector);
        } else if (isNaN(selector)){
          selector = { '@id' : selector };
        } else {
          return null;
        }
      }
      if (selector.AttributeID){
        selector = {
          '@id': selector['@id'],
          header0: selector.Value,
        };
      }
      let match = (selector['@id'] || selector['@odata.id'] || selector.tag || '').match(/(\w+)\((\d+)\)/);
      // //console.log(selector.schema);
      if (match && !selector.schema && !selector.schemaName) {
        selector.schema = match[1];
        selector.ID = match[2];
      }
      const ID = selector.ID = selector.ID ? selector.ID.Value || selector.ID : String('item'+(selector.nr = Item.nr = Item.nr ? ++Item.nr : 1));
      // //console.log(selector.ID);
      // if (selector.schemaPath) console.debug(selector.schemaPath)
      // if (!selector.schema) console.error(selector.schemaPath, selector)
      // //console.log(selector.schema);
      schemaName = validSchemaName(selector.schema = selector.schema || selector.schemaName || schemaName || 'Item');

      const tag = `${schemaName}(${ID})`;

      if (tag.includes('[')) console.error(selector instanceof Item, tag, selector);

      const id = selector.id || tag;
      var item = aim.his.map.get(id);
      if (item) {
        item.data = Object.assign(item.data, selector);
      } else {
        // console.debug(schemaName, self[schemaName]);
        // if (!self[schemaName]) return console.warn(schemaName, 'not exists');

        // //console.log('NEW ITEM', schemaName, self[schemaName].prototype);

        var item = self[schemaName] ? new self[schemaName]() : new Item();
        // console.debug(selector, item.schema, self[schemaName].prototype);
        console.log(selector, item);
        item.properties = Object.fromEntries(
          Object.entries(selector.properties || item.schema.properties)
          .map(([propertyName, property]) => [
            propertyName,
            Object.assign({
              item: item,
              get value(){
                return item[propertyName];
              },
              set value(value) {
                item[propertyName] = value;
              },
            }, property)
          ])
        );
        item.tag = tag;
        // if (item.href = selector['@id'] || selector['@odata.id']) {
        //   item.Id = btoa(item.href);
        // }
        item.data = selector;
        // item.schemaName = schemaName;
        if (self[schemaName] && self[schemaName].set){
          self[schemaName].set(tag, item);
        }
        aim.his.map.set(ID,item);
        // console.debug(ID, aim.his.map.get(ID));
        aim.his.map.set(tag,item);
        aim.his.map.set(id,item);
        // item.on('change', e => {
        //   // console.debug(aim().list())
        //   // Object.values(this).filter(obj => typeof obj === 'object' && obj.emit).forEach(obj => obj.emit('change'));
        // });
      }
      return item;
      Object.entries(item.data).forEach(([propertyName,property]) => {
        // //console.log(propertyName,property, item.hasOwnProperty(propertyName));
        if (!item.hasOwnProperty(propertyName)) {
          Object.defineProperty(item, propertyName, {
            get(){
              return this.getValue(propertyName);
            },
            set(value){
              this.attr(propertyName, value, true);
            }
          });
        }
      });
      return item;
    } },
    mergeinto: { value: function itemMergeInto (newID, oldID){
      //om drop action move into
      // console.debug('SAMENVOEGEN');
      new aim.HttpRequest(aim.config.aim, 'GET', `/item(${newID})`, {
        oldID: oldID,
      }, this.onload || function (){
        // console.debug(this.data);
      }).send();
    } },
    new: { value: function itemNew (item){
      return aim.promise( 'New item', resolve => {
        //Geeft inzicht in bal bla
        //// console.debug('ADD', this.caller);
        //return;
        //var a = String(this.id || get.lid).split(';');
        //var schemaname;// = api.find(post.classID);
        //var schema = aim.config.components.schemas[this.caller.schema];// || aim.config.components.schemas[schemaname = api.find(post.classID)];
        //var post = { id: a.shift(), };
        //if (schema.onadd) schema.onadd.call(post);
        // var put = { schema: item.schema || item.get.folder };
        //// console.debug('ADD', this, put, this.caller);
        if (item.source){
          const [s,schemaName,id] = item.source.match(/(\w+)\((\d+)\)/);
          var url = `/${schemaName}`;
          item
        }
        aimClient.api(url).patch(item).then(body => {
          console.debug(body);
          resolve(body);
        });
        return;
        new aim.HttpRequest(aim.config.aim, 'PATCH', '/' + this.schema, {
          value: [put],
        }, this.onload || function (e){
          // console.debug('ADDED', this.data);
          //return;
          //// console.debug(this.src, this.responseText, this.data.id, this.data, aim.getItem(this.data.id]);
          //var itemID = this.data[];//.set[0][0].id;
          var item = ItemAdded = aim.getItem(e.body.Value.shift().id);
          item.onloadEdit = true;
          for (var name in item.properties){
            if (item.properties[name].initvalue){
              item.setAttribute(name, item.properties[name].initvalue);
            }
          }
          aim.url.set({ schema: item.schema, id: item.id });
          //// console.debug('LV', aim.listview);
          //aim.listview.elItems.insertBefore(aim.listview.items.appendListitem(item), aim.listview.elItems.firstChild);
          //aim.show({ id: item.id });
        }).send();
        resolve('ja');
      })
    } },
    toData: { value: function itemToData (item){
      console.debug('TODATA', item);
      return {
        ID: item.ID,
        tag: item.tag,
        index: item.index,
        title: item.headerTitle,
        // hostID: item.hostID,
        // srcID: item.srcID,
        // classID: item.classID,
        Master: item.elemTreeLi && item.elemTreeLi.elem.parentElement.item ? { tag: item.elemTreeLi.elem.parentElement.item.tag } : null,
        Class: item.data.Class,
        // type: type,
      }
    } },
    toHtml: { value: function itemToHtml (item){
      return `<table>${Object.entries(item).filter(entry => !['object', 'function'].includes(typeof entry[1])).map(entry => `<tr><td>${entry[0]}</td><td>${entry[1]}</td></tr>`).join('')}</table>`;
    } },
    toText: { value: function itemToText (item){
      return `${Object.entries(item).filter(entry => !['object', 'function'].includes(typeof entry[1])).map(entry => `${entry[0]}\t${entry[1]}\n`).join('')}`;
    } },
  });
  Object.defineProperties(Item.prototype, {
    api: {value: function (selector = '') {
      const url = this.data['@id'];
      //console.log(6666, url + selector);
      const hostname = new URL(url).hostname;
      const client = aim.clients.get(hostname);
      return client.api(url + selector)
    }},
    attr: {
      value: function (attributeName, value, postdata){
        return aim.promise( 'Attribute', async resolve => {
          try {
            // console.warn(1, 'attr', attributeName, value, postdata);
            const item = this;
            const property = this.schema.properties[attributeName] || {};
            if (property.readOnly) return resolve(item);
            if (value === undefined){
              return resolve(item);// console.error('value is undefined', arguments.length, attributeName, this);
            }
            if (value instanceof String){
              value = String(value);
            }
            const values = item.data = item.data || {};
            if (Array.isArray(value)){
              values[attributeName] = value;
              // console.debug('attr1', attributeName, value);
              return resolve(item);
            }
            let data = values[attributeName] = values[attributeName] || {};
            data = [].concat(data);
            data = data.filter(data => !data.SrcID || data.SrcID == item.ID);
            if (typeof value !== 'object' || value === null) {
              value = { Value: value };//values[attributeName] = values[attributeName] || value;
            }
            function getItem(selector) {
              if (selector instanceof Item) return selector;
              selector = typeof selector === 'object' ? selector.tag : selector;
              if (aim.his.map.has(selector)) return aim.his.map.get(selector);
            }
            if (value.target) {
              //console.log(value.target);
              value.LinkID = getItem(value.target).ID;
            }
            if (value.current) {
              const current = getItem(value.current);
              data = data.find(attr => attr.AttributeName === attributeName && attr.LinkID === current.ID) || null;
            } else if (value.AttributeID) {
              data = data.find(data => data.AttributeID === value.AttributeID)
            } else if (value.type !== 'append') {
              data = data.shift();
            }
            // if (value === data){
            //   console.debug('attr2', attributeName, value);
            //   return resolve(item);
            // }
            if (typeof data !== 'object' || data === null){
              data = values[attributeName] = { Value: data };
            }
            value = Object.assign({},{
              AttributeID: data.AttributeID,
              Value: data.Value,
              HostID: data.HostID,
              Data: data.Data,
              LinkID: data.LinkID
            },value);
            if (value.LinkID1) {
              async function reindex(parent) {
                await parent.children.then(children => {
                  if (children.length) {
                    // children.forEach((item,i) => item.getIndex(attributeName, parent) != i ? item.setLink(attributeName, parent, i, parent) : null);
                  }
                  // parent.attr('HasChildren', children.length ? 1 : 0, true);
                })
              }
              const to = aim.his.map.get(value.LinkID);
              // const name = attributeName || 'link';
              const action = value.action || 'move';
              if (attributeName === 'Master') {
                if (action === 'move') {
                  const current = item.elemTreeLi.elem.parentElement.item;
                  value.Data = Math.max(0, value.Data === undefined ? 99999 : value.Data );
                  await current.children.then(children => {
                    children.splice(children.indexOf(item), 1);
                    if (current !== to) {
                      // reindex(current);
                    }
                  });
                  if (to) {
                    await to.children.then(children => {
                      children.splice(value.Data, 0, item);
                      reindex(to);
                    });
                    // } else {
                    //   item.setLink(attributeName, to, value.Data, current);
                  }
                  // } else {
                  //   item.setLink(attributeName, to, params.index, current);
                }
                // setTimeout(() => resolve(item));
                // return;
              }
            }
            const currentJson = [data.AttributeID,data.Value,data.HostID,data.Data,data.LinkID].join();
            const newJson = [value.AttributeID,value.Value,value.HostID,value.Data,value.LinkID].join();
            if (value.max) {
              delete value.AttributeID;
            } else if (currentJson === newJson){
              return resolve(item);
            } else {
              // //console.log(attributeName,currentJson,newJson,value,data);
            }
            // console.debug(attributeName, value);
            if (aim.threeObjects && aim.threeObjects[item.tag] && aim.threeObjects[item.tag].obj.onchange){
              aim.threeObjects[item.tag].obj.onchange(attributeName, value.Value);
            }
            item['@id'] = item['@id'] || item.tag;
            // console.debug(attributeName, value);
            Object.assign(data, value);
            if (item.elems) {
              item.elems.forEach(elem => {
                var displayvalue = newvalue = typeof value === 'object' ? value.Value : value;
                // console.debug(attributeName, value, item.elems);
                // var displayvalue = property.displayvalue || displayvalue;
                const el = elem.elem;
                if (el.hasAttribute('displayvalue')) {
                  elem.displayvalue(this.displayvalue(attributeName));
                }
                // if (property.type === 'datetime'){
                // 	newvalue = new Date(newvalue).toISOString().substr(0,19);
                // }
                // Do not update if type in files
                // if (!['files','radio','select'].includes(property.format)){
                // displayvalue = String(displayvalue).split('-').length == 3 && String(displayvalue).split(':').length == 3 && new Date(displayvalue) !== "Invalid Date" && !isNaN(new Date(displayvalue)) ? new Date(displayvalue).toISOString().substr(0, 19).replace(/T/, ' ') : displayvalue;
                // if (displayvalue && !isNaN(displayvalue)){
                // 	displayvalue = Math.round(displayvalue * 100) / 100;
                // }
                if (el.hasAttribute(attributeName) && el.getAttribute(attributeName) != newvalue){
                  el.setAttribute(attributeName, newvalue);
                  el.setAttribute('modified', new Date().toLocaleString());
                }
                // [...el.getElementsByClassName(attributeName)].forEach((attributeElement, i) => {
                //   // if (attributeElement.noupdate) return;
                //   // if (attributeElement === document.activeElement) return;
                //
                //   if (['files','radio','select'].includes(attributeElement.format)) return;
                //   if (attributeElement.hasAttribute('checked')){
                //     if (newvalue){
                //       attributeElement.setAttribute('checked', '');
                //     } else {
                //       attributeElement.removeAttribute('checked');
                //     }
                //     attributeElement.setAttribute('modified', new Date().toLocaleString());
                //   } else if ('value' in attributeElement && attributeElement.type === 'radio'){
                //     attributeElement.checked = attributeElement.value === newvalue;
                //   } else if ('value' in attributeElement){
                //     // return console.error(attributeElement, document.activeElement, attributeElement === document.activeElement);
                //     // return console.error(1);
                //     // console.error(attributeElement.value, newvalue)
                //     if (attributeElement.value != newvalue){
                //       attributeElement.value = newvalue;
                //       attributeElement.setAttribute('modified', new Date().toLocaleString());
                //     }
                //   } else if (attributeElement.hasAttribute('value')){
                //     if (attributeElement.getAttribute('value') != newvalue){
                //       attributeElement.setAttribute('value', newvalue);
                //       attributeElement.setAttribute('modified', new Date().toLocaleString());
                //     }
                //   } else if (['SPAN', 'DIV', 'TD'].includes(attributeElement.tagName)){
                //     // console.debug(attributeElement.tagName, attributeElement, attributeElement.children);
                //     if (property && property.options && property.options[newvalue] && property.options[newvalue].color){
                //       if (attributeElement.style.backgroundColor){
                //         attributeElement.style.backgroundColor = property.options[newvalue].color;
                //       }
                //     } else if (!attributeElement.children.length){
                //       attributeElement.innerHTML = displayvalue != undefined ? displayvalue : '';
                //     }
                //     // attributeElement.setAttribute('modified3', new Date().toLocaleString());
                //   }
                // });
                setTimeout(e => elem.emit('change'));
                // if (el.onupdate){
                //   setTimeout(el.onupdate);
                // }
              })
            }
            if (!aim.his.noPost && postdata){
              // console.error(arguments);
              // for (var callee = arguments.callee, caller = callee.caller;caller;caller = caller.caller){
              // 	console.debug(caller);
              // }
              // return;
              const itemModified = aim.his.itemsModified[item['@id']] = aim.his.itemsModified[item['@id']] || {
                ID: item.data.ID ? item.data.ID.Value || item.data.ID : null,
                method: 'patch',
                path: '/' + item.tag,
                body: {
                  // ID: item.data.ID,
                },
                // res: (e) => {
                // 	// console.debug('DONE', item.tag, e.request );
                // }
              };
              // //console.log(itemModified);
              const updateProperty = itemModified.body[attributeName] = itemModified.body[attributeName] || {};
              Object.assign(updateProperty, (({ AttributeID, Value, HostID, UserID, LinkID, Data }) => ({ AttributeID, Value, HostID, UserID, LinkID, Data }))(data));
              if ('max' in property && !('max' in value)) {
                value.max = property.max;
              }
              if ('max' in value) {
                updateProperty.max = value.max;
                if (value.LinkID !== null || value.Value !== null) {
                  delete updateProperty.AttributeID;
                }
              }
              // if (value.LinkID === null) return console.warn(value,updateProperty);
              let values = Object.values(aim.his.itemsModified);
              if (values.length){
                clearTimeout(aim.his.itemsModifiedTimeout);
                aim.his.itemsModifiedResolve = aim.his.itemsModifiedResolve || [];
                aim.his.itemsModifiedResolve.push([resolve, item]);
                aim.his.itemsModifiedTimeout = setTimeout(() => {
                  aim.his.itemsModified = {};
                  const param = { requests: values };
                  // console.debug('saveRequests', param.requests);
                  if (aim.config && aim.config.dbs) {
                    aim.saveRequests(param.requests);
                  } else if (this.schema.table) {
                  } else {
                    aim().send({
                      to: { aud: aim.aud, sub: aim.aud },
                      body: param,
                      itemsModified: true,
                    });
                    // DEBUG: MKAN STAAT UIT IVM SCHIPHOL
                    aim().send({body: param});
                  }
                  aim.handleData({body: { requests: values }});
                  aim.his.itemsModifiedResolve.forEach(([resolve, item]) => resolve(item));
                  aim.his.itemsModifiedResolve = [];
                });
              }
            } else {
              resolve(item);
            }
            // if (properties[attributeName]){
            // var property = item.properties[attributeName];
            // if (property.type === 'datetime'){
            // 	if (value.Value){
            // 		value.Value = (value.Value + ':00').substr(0,19);
            // 	}
            // }
            // return;
            if (property.type === 'datetime'){
              if (value.Value && value.Value.match(/T\d+:\d+aim/)){
                value.Value = (value.Value + ':00').substr(0,19);
              }
            }
            // let {UserID,Value} = value;
            // console.debug(Object.entries(value), JSON.stringify(data), JSON.stringify(value));
            // Object.assign(data, value);
            //
            // for (let [key, keyValue] of Object.entries(value)){
            // 	if (values[key] != keyValue){
            // 		let object = Object.assign(data, value);
            // 		['UserID', 'Value', 'LinkID', 'Data'].forEach(key => {
            // 			if (key in data){
            // 				var bodyAttribute = itemModified.body[attributeName] = itemModified.body[attributeName] || {};
            // 				bodyAttribute[key] = value[key];
            // 			}
            // 		});
            // 		break;
            // 	}
            // }
            // execute autonoom_proces for item and parent
            for (let parent = item; parent; parent = parent.parent){
              if (parent.operations){
                for (let [operationName, operation] of Object.entries(parent.operations)){
                  if (parent[operationName] && operation.stereotype === 'autonoom_proces' && typeof parent[operationName] === 'function'){
                    // console.debug('setAttribute autonoom_proces', operationName);
                    try {
                      // item[operationName]();
                    } catch (err){
                      console.debug('ERROR', err);
                    }
                  }
                }
              }
            }
            // }
            /* bij data van database, item.loading dan stoppen met uitvoeren, niet wegschrijven naar database, is ook actief bij data van WS  */
            /* If attribute exists (been loaded) then this is an update and the change should be writen to the database			*/
            (recursive = function (item){
              if (!item) return;
              if (typeof item.onchange === 'function') item.onchange();
              recursive(item.master);
            })(item);
            // aim().emit("attributeChange", { item: this, [attributeName]: modvalues });
            // return ref.itemsModified;
          } catch (err) {
            console.error(err);
          }
        });
      },
    },
    append: {
      value: function (item, index){
        return aim.promise( 'Append', async resolve => {
          if (item.parent) {
            await item.parent.children.then(children => {
              const index = children.indexOf(item);
              children.splice(index, 1);
              if (item.parent !== this) {
                children.forEach((item,i) => item.index !== i ? item.Masterindex = i : i);
              }
            });
          }
          this.children.then(children => {
            children.splice(index = Math.max(index,0), 0, item);
            item.attr('Master', { LinkID: this.data.ID }, true);
            console.debug('MASTER',this.data.ID,item.data.Master.LinkID);
            children.forEach((item,i) => item.index !== i ? item.index = i : i);
            setTimeout(() => resolve(item));
          });
        });
      },
    },
    appendItem: {
      value: async function (previousItem, item, sourceItem, noedit) {
        // const itemIndex = previousItem ? this.children.indexOf(previousItem) + 1 : (this.children ? this.children.length : 0);
        // ? this.children.indexOf(previousItem) + 1 : (this.children ? this.children.length : 0);
        // Update all indexes of childs after inserted item
        item.Master = { LinkID: this.ID };
        if (sourceItem) {
          item.schema = sourceItem.schema;
          item.userID = 0;
          item.srcID = sourceItem.ID;
        };
        // let e = await aimClient.api(`/${item.schemaName}`).input(item).post();
        // TODO: 1 aanroep naar api
        const newItem = await aimClient.api(`/${e.body.tag}`).select('*').get();
        newItem.selectall = true;
        const index = previousItem ? previousItem.index + 1 : this.children.length;
        // TODO: index meenemen in aanroep => een api call, => na aanroep wel sorteren.
        ////console.log(index, previousItem);
        await newItem.movetoidx(this, index);
        return newItem;
        // await this.open();
      },
    },
    bccRecipients: {
      get(){
        //console.log(this);
        return this.data.bccRecipients || 0;
      },
    },
    ccRecipients: {
      get(){
        return this.data.ccRecipients || 0;
      },
    },
    children: {get() {
      return aim.promise( 'Children', (resolve, reject) => {
        if (this.items) return resolve(this.items);
        const api = this.api(`/children`).filter('FinishDateTime eq NULL')
        .select(aim.config.listAttributes).get().then(body => {
          // const children = Array.isArray(this.data.Children) ? this.data.Children : this.data.children;
          //console.log('children_then', body);
          const children = body.Children || body.children;
          this.items = [].concat(children).filter(Boolean).map(aim).unique();
          // console.warn('BODY', this.items);
          this.items.url = body['@context'];
          this.HasChildren = this.items.length>0;
          resolve(this.items);
        })
      });
    }},
    class: {
      get() {
        console.debug(this,this.schemaName,this.schema,this.classID);
        return aim.his.map.get(this.classID);
      },
    },
    classItemName: {
      get(){
        return (this.source && this.source.name ? this.source.name : '') + (this.name || '');
      },
    },
    classTag: {
      get(){
        return (this.source && this.source.tag ? this.source.tag : '') + (this.tag || '');
      },
    },
    className: { get() {
      return [
        // this.schema.Name || 'Item',
        ...Array.from(this.schema.allOf || []),
        this.name,
        this.schemaName,
        this.isSchema ? 'constructor' : '',
        // this.schema.Name === 'Item' ? 'isclass' : 'noclass',
        // this.ID,
      ].join(' ')
    }, },
    created: {
      get(){
        return dateText(this.data.CreatedDateTime);
      },
    },
    createdDateTime: {
      get(){
        return this.data.createdDateTime;
      },
    },
    combine: {
      value: function (config){
        return config.split(',')
        .map(name => this.data[name] ? this.data[name].Value || this.data[name] || '' : '')
        .filter(Boolean)
        .join(' ');
      },
    },
    _catElement: {
      value: function () {
        if (this.Categories && this.Categories.options) {
          let categories = String(this.Categories);
          categories = 'draft,concept';
          let catElement = aim.createElement('DIV', 'cat');
          var cats = categories.split(',');
          cats.forEach((cat)=>{
            // ////console.log(cat, this.Categories.options[cat].color);
            catElement.createElement('SPAN').style.backgroundColor = this.Categories.options[cat].color;
          });
          return catElement;
        }
      },
    },
    copytoidx: {
      value: function (master, index) {
        //console.debug('COPY TO', master, index);
        master.appendChild(null, { srcID: this.detailID || this.id });
        this.master.reindex();
      },
    },
    _createPriceElement: {
      value: function (parentElement) {
        // this.CatalogPrice = 0;
        // this.SalesDiscount = 3;
        // this.AccountDiscount = 4;
        let catalogPrice = this.catalogPrice = Number(this.CatalogPrice || 0);
        if (!catalogPrice) {
          return;
        }
        let salesDiscount = Number(this.SalesDiscount);
        let accountDiscount = Number(this.AccountDiscount);
        let discount = accountDiscount || salesDiscount;
        let price = this.price = discount ? catalogPrice * (100 - discount) / 100 : catalogPrice;
        let customer = aim.shop.customer, item = this;
        let product = customer && customer.Product && customer.Product.find
        ? customer.Product.find(function (row){
          return row == item;
        })
        : null;
        // writeprice: function (el, index) {
        // ////console.log('CatalogPrice', this.CatalogPrice);
        // ////console.log('SalesDiscount', this.SalesDiscount);
        // ////console.log('AccountDiscount', this.AccountDiscount);
        if (accountDiscount) {
          parentElement.createElement('DIV', 'tagAccountDiscount', __('Account discount'));
        }
        if (discount) {
          parentElement.createElement('DIV', 'tagSalesDiscount', -discount.toFixed(1));
        }
        return parentElement.createElement('DIV', 'pricerow col', [
          ['DIV', 'aco', [
            discount ? ['SPAN', 'currency strikeThrough', catalogPrice.toFixed(2)] : null,
            ['SPAN', 'currency price', price.toFixed(2)],
          ]],
          ['DIV', 'shopbag', [
            ['INPUT', 'addbag', {type:'number', value:this.amount = product ? product.Data : '', onchange: (e)=>{
              return // ////console.log(this.tag, e.target.value);
              aim.shop.add(this.row, e.target.value);
            }}],
            ['BUTTON', 'abtn icn bagAdd', {type:'button', tabindex: -1, onclick: (e)=>{
              e.stopPropagation();
              e.preventDefault();
              return // ////console.log(this.tag);
              aim.shop.add(
                this.id,
                aim.shop.data && aim.shop.data[this.id]
                ? Number(aim.shop.data[this.id].quant) + 1
                : 1
              );
            }}],
          ]],
          ['DIV', this.Stock ? 'delivery onstock' : 'delivery notonstock', __('notonstock', this.Stock) ],
        ]);
      },
    },
    clone: {
      value: function () {
        if (this.data.Src) {
          return aim.promise( 'Clone', resolve => {
            console.debug('CLONE', this.data);
            const sourceId = [].concat(this.data.Src).shift().LinkID;
            aimClient.api(`/${this.tag}`).query('request_type','build_clone_data').get().then(async items => {
              // console.warn('clone1',e.body);
              (async function clone(targetId,sourceId){
                // console.warn('clone',targetId,sourceId);
                if (targetId && sourceId) {
                  const children = items.filter(row => row.masterId && sourceId && row.masterId == sourceId);
                  await children.forEach(async (child,i) => {
                    let allOf = JSON.parse(child.allOf);
                    const schemaName = allOf.find(schemaName => aim().schemas().has(schemaName));
                    if (child.cloneId === null){
                      const data = {
                        header0: child.header0,
                        header1: child.header1,
                        header2: child.header2,
                        Master: {
                          LinkID: targetId,
                          Data: i,
                        },
                        Src: {
                          LinkID: child.itemId,
                        },
                        Inherited: {
                          LinkID: child.itemId,
                        },
                      };
                      console.debug('create',data);
                      // console.debug(targetId, sourceId, i, child.id, child.title, child.schemaName);
                      await aimClient.api(`/${schemaName}`).input(data).post().then(body => clone(body.data.ID, child.itemId));
                    } else {
                      clone(child.cloneId, child.itemId)
                    }
                  });
                  const target = aim(targetId);
                  if(target && target.elemTreeLi) {
                    target.elemTreeLi.emit('toggle')
                  }
                }
              })(this.data.ID,sourceId);
              resolve(this);
            });
          });
        }
      },
    },
    detail: {
      get(){
        return this.detailID ? Item.create({ id: this.detailID }) : {};
      },
    },
    details: {
      value: function (reload){
        return aim.promise( 'Details', resolve => {
          if (reload || !this.hasDetails){
            this.data = {};
            this.get().then(e => resolve(e.body, this.hasDetails = true)).catch(console.error);
          } else {
            resolve(this)
          }
        })
      },
    },
    delete: {
      value: function (){
        this.remove();
        return aimClient.api(`/${this.tag}`).delete();
      },
    },
    displayvalue: {
      value: function (attributeName) {
        return aim.attr.displayvalue(this.getValue(attributeName), ((this.schema||{}).properties||{})[attributeName]);
      },
    },
    elements: {
      get(){
        return Object.values(this).filter(value => value instanceof Element);
      },
    },
    eval: {
      value: function (name){
        const config = this.schema[name] || '';
        // console.debug(name);
        if (typeof config === 'function'){
          return config.call(this);
        }
        return this.combine(config);
      },
    },
    emit: {
      value: aim.prototype.emit,
    },
    fav: {
      get(){
        let isFavorite = 'Fav' in this ? Number(this.Fav) : aim.his.fav.includes(this.tag);
        // console.debug('isFavorite', isFavorite);
        return isFavorite;
      },
      set(value){
        console.debug(value);
        let id = this.tag;
        aim.his.fav.splice(aim.his.fav.indexOf(id), 1);
        if (value){
          aim.his.fav.unshift(this.tag);
        }
        // console.debug('SET FAV', private.fav, this.tag, this.id, value, aim.auth.access.sub);
        this.Fav = { UserID: aim.auth.access.sub, Value: value };
        this.rewriteElements();
      },
    },
    filternames: {
      get() {
        return Object.entries(this.schema.properties||{}).filter(([name,prop]) => prop.filter).map(([name,prop]) => name);
      },
    },
    fieldDefault: {
      value: function () {
        for (var attributeName in this.properties) { if (this.properties[attributeName].default) break; }
        if (!attributeName) for (var attributeName in this.properties) { if (this.properties[attributeName].kop === 0) break; }
        return this.properties[attributeName];
      },
    },
    flag: {
      get(){
        return this.data.flag || false;
      },
    },
    flagState: {
      value: function (){
        const today = new Date();
        if (String(this.FinishDateTime)){
          return 'done';
        } else if (String(this.EndDateTime)){
          let daysLeft = Math.round((new Date(this.EndDateTime) - today) / 1000 / 60 / 60 / 24);
          if (daysLeft > 28) return '4weeks';
          if (daysLeft > 21) return '3weeks';
          if (daysLeft > 14) return '2weeks';
          if (daysLeft > 7) return 'nextweek';
          if (daysLeft > 1) return 'thisweek';
          if (daysLeft > 0) return 'tomorrow';
          if (daysLeft == 0) return 'today';
          return 'overdate';
        }
        return '';
      },
    },
    flagMenu: {
      value: {
        vandaag: { title: 'Vandaag', className: 'flag', flag: 'today', onclick: e => {
          // console.debug(this, new Date().toISOString().substr(0, 10));
          this.FinishDateTime = '';
          this.EndDateTime = new Date().toISOString().substr(0, 10) + 'T17:00:00';
          // this.item.set({ FinishDateTime: '', EndDateTime: aDate().toISOString().substr(0, 10) });
        }},
        morgen: { title: 'Morgen', className: 'flag', flag: 'tomorrow', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + (0 < today.getDay() < 5 ? 1 : 3));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        }},
        dezeweek: { title: 'Deze week', className: 'flag', flag: 'thisweek', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + (5 - today.getDay()));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        }},
        volgendeWeek: { title: 'Volgende week', className: 'flag', flag: 'nextweek', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 7 + (5 - today.getDay()));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        }},
        over2weken: { title: 'Over 2 weken', className: 'flag', flag: '2weeks', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 14 + (5 - today.getDay()));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        } },
        over3weken: { title: 'Over 3 weken', className: 'flag', flag: '3weeks', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 21 + (5 - today.getDay()));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        } },
        over4weken: { title: 'Over 4 weken', className: 'flag', flag: '4weeks', onclick: e => {
          const today = new Date();
          const endDate = new Date();
          endDate.setDate(today.getDate() + 28 + (5 - today.getDay()));
          this.FinishDateTime = '';
          this.EndDateTime = endDate.toISOString().substr(0, 10) + 'T17:00:00';
        } },
        none: { title: 'Geen', className: 'flag', flag: '', onclick: e => {
          this.EndDateTime = '';
        } },
        // datum: { title: 'Datum', className: 'calendar', onclick: e => {
        // 	// console.debug(this.item);
        // } },
        gereed: { title: 'Gereed', className: 'flag', flag: 'done', onclick: e => {
          const today = new Date();
          this.FinishDateTime = today.toISOString().substr(0, 19);
        } },
      },
    },
    forEach: {
      value: aim.prototype.forEach,
    },
    fullName: {
      get(){
        var text = [this.classItemName], item = this.master;
        while (item){
          if (item.tag) text.unshift(item.classItemName);
          item = item.master;
        }
        return text.join('_');
      },
    },
    fullTag: {
      get(){
        var text = [this.classTag], item = this.master;
        while (item){
          if (item.tag) text.unshift(item.classTag);
          item = item.master;
        }
        return text.join('.');
      },
    },
    from: {
      get(){
        return this.data.from || 0;
      },
    },
    get: {
      value: function () {
        return this.api().select('*').get();
      },
    },
    getrel: {
      value: function (name, root){
        if (!this[name]) return;
      },
    },
    getPropertyAttributeName: {
      value: function (propertyName){
        for (var attributeName in this.properties){
          if (this.properties[attributeName].idname == propertyName){
            return attributeName;
          }
        }
      },
    },
    getValue: {
      value: function (name) {
        if (this.data && this.data[name]) {
          const data = [].concat(this.data[name]);
          const value =
          data.find(value => typeof value === 'object' && value.SrcID == this.data.ID && 'Value' in value) ||
          data.find(value => typeof value === 'object' && 'Value' in value) ||
          data.shift();
          // //console.log(value);
          // // console.debug(name, this.data[name]);
          // value = value
          // .filter(value => value.Value)
          // .map(value => value.Value)
          // .shift() ||
          // value
          // .filter(value => value.SrcValue)
          // .map(value => value.SrcValue)
          // .shift();
          return typeof value === 'object' ? value.value || value.Value : value;
        }
        return null;
      },
    },
    getIndex: {
      value: function (name, to) {
        if (this.data[name] && to) {
          to = to instanceof Item ? to : aim(to.tag);
          const attribute = [].concat(this.data[name]).find(attr => attr.AttributeName === name && attr.LinkID === to.ID) || {};
          return attribute.Data;
        }
      },
    },
    getDisplayValue: {
      value: function getDisplayValue (attributeName) {
        return aim.attr.displayvalue(this.getValue(attributeName), ((this.schema||{}).properties||{})[attributeName]);
      },
    },
    hasAttach: {
      get(){
        return Object.values((this.schema || {}).properties || {}).find(property => property.format === 'files' && this.data[property.name]) ? true : false;
      },
    },
    hasAttachments: {
      get(){
        return this.data.hasAttachments || false;
      },
    },
    _hasChildren: {
      get(){
        if (this.data && this.data.children) return true;
        // console.debug(this.data);
        return this.getValue('HasChildren');
        const children = this.data.Children || this.data.children;
        return children ? children.length > 0 : this.getValue('HasChildren');
      },
    },
    hasChildren: {
      get: function hasChildren (value){
        new aim(this).elements.forEach(element => {
          if (element.hasAttribute('open')){
            if (value){
              if (element.getAttribute('open') === ''){
                element.setAttribute('open', 0);
                element.onopen = e => this.open();
                element.onclose = e => this.close();
              }
            } else {
              element.setAttribute('open', '');
              element.onopen = null;
              element.onclose = null;
              console.debug('REMOVE OPEN', element.getAttribute('open'), element);
            }
          }
        });
      },
    },
    hasImage: {
      get(){
        return this.hasAttach && aim.object.isFile(this.files[0]);
      },
    },
    header0: {
      get() {
        // return this.getValue('header0') || this.getValue('Title') || this.getValue('Name') || this.title || this.name || this.tag || '';
        // //console.log(this.data);
        // return this.data.header0.value;
        var value = this.headerValue(0,'header0') || this.getValue('header0') || this.getValue('Title') || this.getValue('Name') || this.title || this.name || this.tag || '';
        return (typeof value === 'object' ? value.value || value.Value : value);
      },
      set(value) {
        this[this.headerId(0)[0]] = value;
      },
    },
    header1: {
      get() {
        return this.headerValue(1,'header1');
      },
    },
    header2: {
      get() {
        return this.headerValue(2,'header2');
      },
    },
    headerId: {
      value: function (id) {
        return this.schema.header && this.schema.header[id] ? this.schema.header[id] : Object.entries(this.schema.properties).filter(([name,prop]) => prop.header === id).map(([name,prop]) => name);
      },
    },
    headerValue: {
      value: function (id,name) {
        if (this.hasDetails) {
          const headerValue = this.headerId(id).map(name => String(this.getValue(name)||'').stripTags()).filter(Boolean).join(' ').substr(0,500) || null;
          const value = this.getValue(name) || null;
          if (headerValue != value) {
            // console.warn([headerValue, value]);
            this.attr(name, headerValue, true);
          }
        }
        return this.getValue(name)||'';
      },
    },
    iconsrc: {
      get(){
        if (!this.files || !this.files.length) return '';
        for (var i = 0, f; f = this.files[i]; i++){
          if (aim.object.isFile(f)){
            break;
          }
        }
        if (f && f.src && f.src[0] == '/'){
          f.src = 'https://aliconnect.nl' + f.src;//// console.debug(f.src);
        }
        return f ? f.src : '';
      },
    },
    index: {
      get: function itemIndexGet (){
        return Number(this.getIndex('Master', this.parent));
      },
      set: function itemIndexSet (value) {
        if (this.parent) this.Master = { LinkID: this.parent.data.ID, Data: value };
      },
    },
    init: {
      value: function () {},
    },
    ID: {
      get(){
        return this.data.ID;
      },
    },
    id: {
      get(){
        return this.data.ID;
      },
    },
    importance: {
      get(){
        return this.data.importance || 0;
      },
    },
    isClass: {
      get(){
        return this.data && this.data.Class && [].concat(this.data.Class).shift().LinkID == 0 ? true : false;
      },
    },
    isInherited: {
      get(){
        // console.debug(this.tag,this.header0,this.data.InheritedID);
        return this.getValue('InheritedID') ? 1 : 0;//this.data && this.data.InheritedID;
      },
    },
    isDraft: {
      get(){
        return this.data.isDraft || false;
      },
    },
    lastModified: {
      get(){
        return dateText(this.data.LastModifiedDateTime);
      },
    },
    lastModifiedDateTime: {
      get(){
        return this.data.lastModifiedDateTime;
      },
    },
    lastModifiedBy: {
      get(){
        var value = (this.data || {}).lastModifiedBy || '';
        value = value.user || value;
        value = value.displayName || value.Value || value.value || value || '';
        return value;
      },
    },
    modified: {
      get(){
        return !this.LastModifiedDateTime ? '' : (!this.LastVisitDateTime ? 'new' : (new Date(this.LastModifiedDateTime).valueOf() > new Date(this.LastVisitDateTime).valueOf() ? 'modified' : ''));
      },
    },
    movetoidx: {
      value: async function (parent, index, noput){
        return parent.append(this, index === undefined ? 99999 : index, true);
        // return;
        // DEBUG: CLASS LOGICA
        if (this.isClass && master.isClass){
          this.srcID = master.id;
        } else if (this.isClass && !master.isClass){
          if (confirm("Class '" + this.Title + "' moved into object '" + master.Title + "', do you want to instantiate?")) return this.copytoidx(master, index);
          if (confirm("Make '" + this.Title + "' a derived class from '" + master.Title + "'?")) set.srcID = master.id;
          else if (!confirm("Continue move?")) return;
        } else if (!this.isClass && master.isClass){
          if (confirm("Object '" + this.Title + "' moved into class '" + master.Title + "', make this an inherited?")) set.srcID = master.id;
          //else if (!confirm("Continue move?")) return;
        }
      },
    },
    moveup: {
      value: function () {
        return aim.link({
          item: this,
          to: this.parent,
          name: 'Master',
          index: this.index - 1,
          action: 'move',
        });
        // return this.parent.append(this, this.index - 1);
        // if (this.index > 0){
        //   this.movetoidx(this.parent, this.index - 1);
        // }
      },
    },
    movedown: {
      value: function (e){
        return aim.link({
          item: this,
          to: this.parent,
          name: 'Master',
          index: this.index - 1,
          action: 'move',
        });
        // return this.parent.append(this, this.index + 1);
        // if (this.index < this.parent.items.length - 1){
        //   this.movetoidx(this.parent, this.index + 1);
        // }
      },
    },
    model2d: {
      value: function (e) {
        //console.debug('MODEL 2d', this.id, this.ID, this.tag, this, this.item);
        //get:{masterID: this.id} ?
        new aim.HttpRequest(aim.config.aim, 'GET', `/item(${this.id})/model2d`, e => {
          self.innerText = '';
          self.createElement('DIV', 'row top btnbar np', { operations: {
            filter: { Title: 'Lijst filteren', onclick: function (e) { aim.show({ flt: get.flt ^= 1 }); } },
          } });
          function ondrop (e) {
            //console.debug(e, this, e.clientX, e.clientY);
            e.stopPropagation();
            var childItem = aim.dragdata.item;
            with (this.newTag = this.createElement('DIV', { Title: childItem.Title, className: 'symbol icn ' + childItem.schema + " " + childItem.typical + " " + (childItem.name || childItem.Title) + " " + childItem.id, item: childItem, id: childItem.id, value: 1 })) {
              style.top = (e.offsetY - 25) + 'px';
              style.left = (e.offsetX - 25) + 'px';
            }
            var children = [];
            new aim.HttpRequest(aim.config.aim, 'POST', `/item(${this.id})/model2d`, {
              masterID: this.id,
              childID: childItem.id,
              offsetTop: this.newTag.offsetTop,
              offsetLeft: this.newTag.offsetLeft,
            });
            return false;
          };
          this.elContent = self.createElement('DIV', 'row aco model2d', { id: this.get.masterID, ondrop: ondrop });
          this.data.forEach(row => {
            var childItem = aim.getItem(row.id);
            let el = this.elContent.createElement('DIV', { Title: row.Title, className: 'symbol icn ' + row.schema + " " + row.typical + " " + (childItem.name || childItem.Title) + " " + row.id, id: row.id, value: childItem.Value, onclick: Element.onclick, set: { schema: row.schema, id: row.id } });
            el.style.top = (row.offsetTop) + 'px';
            el.style.left = (row.offsetLeft) + 'px';
          });
        }).send();
      },
    },
    name: {
      get() {
        return this.getValue('name') || this.getValue('Name') ;
      },
    },
    networkdiagram: {
      value: function (e) {
        new aim.HttpRequest(aim.config.aim, 'GET', `/item(${this.item.id})/network`, e => {
          //console.debug(this.src, this.data);
          new aim.graph(Listview.createElement('DIV', { className: 'slidepanel col bgd oa pu', }), this.data);
          //if (!aim.graph.init()) return;
          //aim.graph(Listview.createElement('DIV', { className: 'slidepanel col bgd oa pu', }), this.data);
        }).send();
      },
    },
    on: {
      value: aim.prototype.on,
    },
    options: {
      value: function (attr){
        const properties = (this.schema || {}).properties || {};
        const property = properties[attr] || {};
        const options = property.options || {};
        const value = this[attr] || '';
        const option = value.split(',').map(v => options[v] || { color: '' });
        return [option, options];
      },
    },
    parent: {
      get() {
        if (this.elemTreeLi && this.elemTreeLi.elem.parentElement) {
          return this.elemTreeLi.elem.parentElement.item;
        }
        return this.data.Master ? aim([].concat(this.data.Master).shift()) : null
        // return this.elemTreeLi && this.elemTreeLi.elem.parentElement ? this.elemTreeLi.elem.parentElement.item : null;
      },
    },
    properties: {
      get(){
        const item = this;
        return Object.fromEntries(
          Object.entries(this.schema.properties)
          .map(([propertyName,property]) => [propertyName,Object.create(property, {
            name: {
              value: propertyName,
            },
            value: {
              get() {
                return item[propertyName];
              }
            }
          })])
        );
        // //console.log(this);
        // return this.schema.properties;
      },
    },
    post: {
      value: function (postfields) {
        setItems([{ id: this.id, schema: this.schema, values: postfields }], true);
      },
    },
    popout: {
      value: function (left = 0,top = 0,width = 600,height = 600) {
        const item = this;
        var url = document.location.origin;
        var url = 'about:blank';
        if (item.popoutWindow) {
          return item.popoutWindow.focus();
        }
        const win = item.popoutWindow = self.open(url, item.tag, `top=${top},left=${left},width=${width},height=${height}`);
        // ////console.log(self.innerHeight,self.outerHeight,self.outerHeight-self.innerHeight,self.screen,this.elem.getBoundingClientRect());
        self.addEventListener('beforeunload', e => win.close());
        const doc = win.document;
        ////console.log(pageHtml);
        doc.open();
        doc.write(pageHtml);
        doc.close();
        win.onload = function (e) {
          const aim = this.aim;
          aim(this.document.documentElement).class('app');
          aim(this.document.body).class('col aim om bg').id('body').append(
            aim('section').class('row aco main').append(
              aim('section').class('col aco apv printcol').id('view'),
            ),
          );
          //console.log(item);
          aim('view').show(item);
          win.addEventListener('beforeunload', e => item.popoutWindow = null);
        }
        // win.aim.on('load', e => {
          //   win.elem = win.aim(doc.body)
          //   win.elem.append(
            //     aim('div').text('JAsfdssdfgs')
            //   )
            // })
            //popout: { schema: this.schema, id: this.id, uid: this.uid, onclick: aim.windows.open },
            //
            // dragItems.forEach(item => self.open(
              //   document.location.href.split('/id').shift()+'/id/'+ btoa(item['@id']),
              //   '_blank',
              //   'width=640, height=480, left=' + (e.screenX || 0) + ', top=' + (e.screenY || 0)
              // ));
            },
          },
    receivedDateTime: {
      get(){
        return this.data.receivedDateTime || 0;
      },
    },
    reindex: {
      value: function (e){
        return aim.promise( 'Reindex', async resolve => {
          // return;
          if (this.hasChildren){
            console.warn('reindexOOOO1');
            const children = await this.children;
            console.warn('reindexOOOO', children);
            if (this.elemTreeLi) this.elemTreeLi.emit('toggle');
            children.forEach((child, i) => {
              if (child.elemListLi && child.elemListLi.elem && child.elemListLi.elem.parentElement){
                child.elemListLi.elem.parentElement.appendChild(child.elemListLi.elem);
              }
            });
          }
          resolve(this);
        });
      },
    },
    refresh: {
      value: function (row){
        const deadline = {
          'done': 'Gereed',
          'overdate': 'Te laat',
          'today': 'Vandaag',
          'tomorrow': 'Morgen',
          'thisweek': 'Deze week',
          'nextweek': 'Volgende week',
          'afternextweek': 'Later',
          '': 'Geen'
        };
        this.filterfields = this.filterfields || {
        };
        this.filterfields.Deadline = deadline[this.flagState()];
        this.filterfields.Bijlagen = this.hasAttach ? 'Ja' : 'Nee';
        this.filterfields.Status = this.state;
        this.filterfields.Schema = this.schema;
        if (this.elLvLi) this.elLvLi.rewrite();
        if (this.createTreenode) this.createTreenode();
      },
    },
    refreshAttribute: {
      value: function (attributeName){
      },
    },
    refreshAttributes: {
      value: function (){
        var s = new Date();
        var attributes = {
          Title: { displayvalue: this.Title }, Subject: { displayvalue: this.Subject }, Summary: { displayvalue: this.Summary }, ModifiedDT: { displayvalue: this.modifiedDT = new Date().toISOString() }
        };
        if (this.data)
        for (var attributeName in this.data)
        if (!attributes[attributeName]) attributes[attributeName] = {
          value: this.data[attributeName].value, displayvalue: this.properties[attributeName].displayvalue
        };
        //this.ModifiedDT = (this.data.ModifiedDT = this.data.ModifiedDT || {}).value =
        //this.modifiedDT = attributes.ModifiedDT = new Date().toISOString();
        for (var i = 0, e, c = document.getElementsByClassName(this.id) ; e = c[i]; i++){
          //aim.Alert.appendAlert({ id: 1, condition: 1, Title: 'TEMP HOOG', created: new Date().toISOString(), categorie: 'Alert', ack: 0 });
          //if (row.attr) for (var name in row.attr) if (row.attr[name]) e.setAttribute(name, row.attr[name]); else e.removeAttribute(name);
          for (var attributeName in attributes){
            //if (attributeName == 'ModifiedDT') // console.debug(attributeName, attributes[attributeName]);
            var displayvalue = attributes[attributeName].displayvalue, value = attributes[attributeName].value;//typeof attributes[attributeName] == 'object' ? attributes[attributeName].value : attributes[attributeName];
            //if (attributeName=='Value') // console.debug('hhhhhh', attributeName, displayvalue);
            displayvalue = String(displayvalue).split('-').length == 3 && String(displayvalue).split(':').length == 3 && new Date(displayvalue) !== "Invalid Date" && !isNaN(new Date(displayvalue)) ? new Date(displayvalue).toISOString().substr(0, 19).replace(/T/, ' ') : displayvalue;
            displayvalue = (isNaN(displayvalue) ? displayvalue : Math.round(displayvalue * 100) / 100);
            //if (attributeName == "CriticalFailure") // console.debug('REFESH', this.id, this.Title, attributeName, e.getAttribute(attributeName), val);
            if (e.hasAttribute(attributeName) && e.getAttribute(attributeName) != value){
              e.setAttribute(attributeName, value);
              e.setAttribute('modified', new Date().toLocaleString());
            }
            for (var i1 = 0, e1, c1 = e.getElementsByClassName(attributeName) ; e1 = c1[i1]; i1++){
              if (e1.hasAttribute('checked')){
                if (value) e1.setAttribute('checked', ''); else e1.removeAttribute('checked');
                e1.setAttribute('modified', new Date().toLocaleString());
              }
              else if ("value" in e1){
                if (e1.value != value){
                  e1.value = value;
                  e1.setAttribute('modified', new Date().toLocaleString());
                }
              }
              else if (e1.hasAttribute('value')){
                if (e1.getAttribute('value') != value){
                  e1.setAttribute('value', value);
                  e1.setAttribute('modified', new Date().toLocaleString());
                }
              }
              else if (['SPAN', 'DIV', 'TD'].indexOf(e1.tagName) != -1){
                //if (attributeName == "CriticalFailure") // console.debug('REFESH', this.id, this.Title, attributeName, e.getAttribute(attributeName), val);
                //MKAN DIsplay value of value, probleem DMS
                e1.innerHTML = displayvalue != undefined ? displayvalue : "";
                e1.setAttribute('modified', new Date().toLocaleString());
              }
            }
          }
        }
      },
    },
    remove: {
      value: function (){
        console.warn('remove', this);
        if (this.parent){
          if (this.parent.items){
            this.parent.items.splice(this.parent.items.indexOf(this), 1);
            this.elemTreeLi.elem.remove();
            if (this.parent) {
              this.parent.reindex();
            }
            // aim.delay(this.parent.reindex);
          }
        }
        Object.entries(this).filter(elem => elem instanceof Element).forEach(elem => elem.remove());
      },
    },
    rewriteElements: {
      value: function (){
        [...document.getElementsByClassName(this.tag)].forEach(element => element.rewrite ? element.rewrite() : null);
      },
    },
    replyTo: {
      get(){
        return this.data.replyTo || 0;
      },
    },
    schemaColor: {
      get() {
        return (this.data||{}).color || (this.schema||{}).color || '';
      },
    },
    set: {
      value: function (values, onload){
        api.request({
          put: { value: [{ schema: this.schema, id: this.detailID || this.id, values: values }] },
          item: this
        }, onload || function (){
          // console.debug('SET DONE', this.src, this.put, this.data);
          //if (this.item.id == get.id) this.item.reload();
        });
        this.refresh();
        this.show();
      },
    },
    setAttribute: {
      value: function (selector, context){
        if (self.document && this.elems) {
          this.elems.forEach( elem => elem.attr(selector, context))
          // Object.entries(this).filter(entry => entry[1] instanceof Element).forEach(entry => context === undefined ? entry[1].removeAttribute(selector) : entry[1].setAttribute(selector, context))
        }
      },
    },
    sender: {
      get(){
        return this.data.sender || 0;
      },
    },
    selectitem: {
      value: function (e) {
        if (e) {
          ////console.debug('selectitem stopPropagation');
          e.stopPropagation();
          return this.item.selectitem();
        }
        this.selectitemset(this.elemTreeLi.getAttribute('sel') ^ 1);
      },
    },
    selectitemcheckchildren: {
      value: function (value) {
        if (isnull(this.selected, false) !== false) {
          this.selectcnt = 0;
          for (var i = 0, e; e = this.items[i]; i++) if (e.selected) this.selectcnt += 1;
          if (this.selectcnt) this.selectitemset(1);
          else this.selectitemset(0);
          if (this.parent && this.parent.selectitemcheckchildren) this.parent.selectitemcheckchildren();
        }
      },
    },
    selectitemset: {
      value: function (value) {
        if (this.groupname) {
          var c = this.elemTreeLi.parentElement.children;
          for (var i = 0, e; e = c[i]; i++) if (e.item.groupname == this.groupname && e.item.selected) {
            e.setAttribute('sel', 0);
            e.item.selected = 0;
            e.item.set({ selected: e.item.selected });
            e.item.close();
          }
        }
        var a = [];
        var ia = [];
        e = this.elemTreeLi;
        if (value) {
          while (e.item) {
            a.push(e);
            e = e.parentElement.parentElement;
          }
        }
        else
        a.push(e);
        var c = this.elemTreeLi.getElementsByTagName('LI');
        for (var i = 0, e; e = c[i]; i++) a.push(e);
        for (var i = 0, e; e = a[i]; i++) {
          e.item.selected = value;
          e.setAttribute('sel', value);
        }
        this.set({ selected: value });
      },
    },
    sentDateTime: {
      get(){
        return this.data.sentDateTime || 0;
      },
    },
    setClass: {
      value: function (className, unique) {
        this.elements.forEach(elem => elem.className = elem.className.split(' ').concat(className).filter((value, index, self) => self.indexOf(value) === index).join(' '));
      },
    },
    setChecked: {
      value: function (checked) {
        this.checked = checked;
        // 	if (!item.elemTreeLi.getAttribute('checked')) {
        // 		item.elemTreeLi.removeAttribute('checked');
        // 	}
        let elements = [this.elemListLi,this.elemTreeLi];
        if (this.checked) {
          aim.clipboard.push(this);
          elements.forEach((elem)=>{
            if (elem) {
              elem.setAttribute('checked', '');
            }
          });
        } else {
          aim.clipboard.remove(this);
          elements.forEach((elem)=>{
            if (elem) {
              elem.removeAttribute('checked');
            }
          });
        }
      },
    },
    setFocus: {
      value: function () {
        // if (aim.focusItem) {
        //
        // }
        // aim.focusItem = this;
        // this.checked = checked;
        // // 	if (!item.elemTreeLi.getAttribute('checked')) {
        // // 		item.elemTreeLi.removeAttribute('checked');
        // // 	}
        // let elements = [this.elemListLi,this.elemTreeLi];
        // if (this.checked) {
        // 	aim.clipboard.push(this);
        // 	elements.forEach((elem)=>{
        // 		if (elem) {
        // 			elem.setAttribute('checked', '');
        // 		}
        // 	});
        // } else {
        // 	aim.clipboard.remove(this);
        // 	elements.forEach((elem)=>{
        // 		if (elem) {
        // 			elem.removeAttribute('checked');
        // 		}
        // 	});
        // }
      },
    },
    show: {
      value: function (e) {
        if (e) return this.item.show();
        //if ()
        // get.id = this.id;
        if (colpage.item && colpage.item.editing) colpage.item.editclose();
        this.PageElement();
        if (aim.his.err) {
          var c = aim.his.err.children;
          for (var i = 0, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == this.id) break;
          if (elErrRow) {
            elErrRow.accept = new Date();
            elErrRow.elAccept.innerText = elErrRow.accept.toISOString().substr(11, 8);
            elErrRow.refresh();
          }
        }
      },
    },
    showinfo: {
      value: function () {
        //this.load(function () {
        colinfo = document.getElementById('colinfo') || document.body.createElement('SECTION', 'col ainf', {id: 'colinfo'});
        colinfo.innerText = '';
        setTimeout(() => {
          colinfo.createElement([
            this.createHeaderElement(),
            ['DIV', 'row top btnbar', [
              ['A', 'abtn icn form r', ]
            ]]
          ]);
        })
        // with (colinfo.createElement('DIV', { className: 'row top btnbar' })) {
        // 	createElement('A', {
        // 		className: 'abtn icn form r', onclick: Element.onclick, par: { id: this.itemID, lid: this.itemID }, onclick: function (e) {
        // 			//console.debug('show ifo');
        // 			e.stopPropagation();
        // 			private.info.innerText = '';
        // 		}
        // 	});
        // }
        // var elDetails = createElement('DIV', { className: 'details' });
        // elDetails.createElement('DIV', { className: 'name', innerText: this.Title });
        // this.writedetails(elDetails);
        //});
      },
    },
    state: {
      get(){
        const data = this.data.State || '';
        return data.Value || data;
      },
    },
    stateElementArray: {
      value: function () {
        if (this.properties && this.properties.state && this.properties.state.options) {
          return ['DIV', 'stateicon', {
            // item: this,
            contextmenu: this.properties.state.options,
            onselect: e => {
              ////console.log(e);
              let el = [...e.path].find(el => el.value);
              this.state = el.value;
            },
          }, [
            ['SPAN', 'state', {
              style: 'background-color:' + (this.state ? this.state.color : ''),
            }]
          ]]
        } else {
          return [];
        }
      },
    },
    _stateColor: {
      get(){
        return (((((this.schema || {}).properties || {}).State || {}).options || {})[((this.data || {}).State || {}).Value] || {}).color;
      },
    },
    stateColor: {
      get(){
        return this.properties && this.properties.State && this.properties.State.options && this.properties.State.options[this.State] ? this.properties.State.options[this.State].color : 'inherited';
      },
    },
    scope: {
      get(){
        // let isFavorite = 'Fav' in this ? Number(this.Fav) : private.fav.includes(this.tag);
        // console.debug('isFavorite', isFavorite);
        let userId = Number(this.UserID);
        if (!userId) return 'public';
        if (userId && userId == aim.auth.access.sub) return 'private';
        return 'read';
      },
      set(value){
        /// console.debug(value);
        const values = {
          private: () => this.UserID = aim.auth.access.sub,
          public: () => this.UserID = 0,
        }[value]();
        this.rewriteElements();
        // values[value]();
        // let id = this.tag;
        // private.fav.splice(private.fav.indexOf(id), 1);
        // if (value){
        // 	private.fav.unshift(this.tag);
        // }
        // console.debug('SET FAV', private.fav, this.tag, this.id, value, aim.auth.access.sub);
        // this.Fav = { UserID: aim.auth.access.sub, Value: value };
        // this.rewriteElements();
      },
    },
    source: {
      get(){
        return this.data && this.data.Src ? aim([].concat(this.data.Src).shift()) : null;
      },
    },
    sourceName: {
      get() {
        // console.debug(this.data.Source);
        return this.data && this.data.Src
        ? [].concat(this.data.Src)
        .filter(v=>v['@id'])
        .map(v=>v['@id'].match(/(\w+)\(\d+\)/)[1])
        .shift()
        : null;
        // return this.data.schemaPath ? this.data.schemaPath.split('/')[1] : '';
      },
    },
    submit: {
      value: function (e) {
        if (e) e.preventDefault();
        this.remove();
        return;
        //// //console.debug('SUBMIT', this, this.elUsers.innerText, this.oldusers);
        var item = { id: this.id };
        //// //console.debug(this.oldusers, this.elUsers.innerText);
        if (this.elUsers && this.oldusers != this.elUsers.innerText) {
          var users = (this.link = this.link || {}).users = [];
          item.userlist = {};
          for (var i = 0, e, c = this.elUsers.getElementsByTagName('A') ; e = c[i]; i++) if (e.id) users.push(item.userlist[e.innerText] = e.id);// || e.getAttribute('itemID') || '';
        }
        // //console.debug('SUBMIT ITEM', item);
        aim.ws.request({
          to: [ { sub: aim.auth.sub } ],
          showNotification: [this.Title, {
            // title: 'Come',
            tag: this.ID,
            body: 'Modified', //this.Subject,
            click_action: document.location.href,
            data: { click_action: document.location.href },
            actions: [ {action: "open_url", title: "Read Now"} ],
          }]
        });
        // (new aim.showNotification(this.Title, {
        // 	// title: 'Come',
        // 	tag: this.ID,
        // 	body: 'Modified', //this.Subject,
        // 	click_action: document.location.href,
        // 	data: { click_action: document.location.href },
        // 	actions: [ {action: "open_url", title: "Read Now"} ],
        // })).send();
        //// //console.debug('item.submit', document.activeElement);
        this.editclose();
        setTimeout(function (item) {
          //// //console.debug(item);
          //return;
          new aim.HttpRequest(aim.config.aim, 'PATCH', `/item(${item.id})`, item, {
            query: { reindex: 1 },
          }).send();
        }, 10, item);
        // ////console.log(this);
        // this.remove();
      },
    },
    // schema: {
    //   value: {
    //     properties: {}
    //   },
    // },
    toRecipients: {
      get(){
        return this.data.toRecipients || 0;
      },
    },
    tooltipText: {
      get(){
        return;
        var s = '';
        var fnames = 'keyname, name, fullName, tag, fullTag'.split(', ');
        for (var i = 0, name; name = fnames[i]; i++) if (this[name]) s += name + ':' + this.getAttribute(name) + "\r\n";
        return s;
      },
    },
    typicalIdx: {
      get(){
        if (!this.master) return null;
        var index = 0;
        for (var i = 0, item; item = this.master.Children[i]; i++){
          if ('selected' in item && item.selected == 0) continue;
          if (item.srcID == this.srcID) index++;
          if (item == this) return index;
        }
      },
    },
    type: {
      get(){
        if (this.data){
          const parent = this.parent;
          const sourceID = this.data.Src ? Number([].concat(this.data.Src).shift().LinkID) : null;
          if (sourceID) {
            const masterID = this.parent ? this.parent.ID : null;
            if (this.getValue('InheritedID')) {
              return 'inherit';
            } else if (![...aim().schemas().values()].some(schema => schema.ID == sourceID)) {
              // console.debug(sourceID, [...aim().schemas().values()].some(schema => schema.ID == sourceID));
              return 'copy';
            }
          }
        }
        return 'nodata';
      },
    },
    url: {
      get() {
        return (this.data||{})['@id'] || '/'+this.schemaName;
      },
    },
    viewstate: {
      get(){
        return aim.his.items[this.data.ID] ? 'read' : 'new';
      },
    },
  });

  function WebsocketClient(){
    $(this).extend(...arguments);
    this.clients = new Map();
    // return this.connect(...arguments)
  }
  function EventManager() {}
  Object.defineProperties(EventManager.prototype, {
    _events: {value: {}},
    on: {value: function on(selector, context) {
      // //console.log('ON', selector, context)
      // const events = this._events = this._events || {};
      (this._events[selector] = this._events[selector] || []).push(context);
    }},
    emit: {value: function emit(selector, data) {
      if (this._events && this._events[selector]) {
        this._events[selector].forEach(callback => callback(data));
      }
    }},
  });
  function WebsocketClient(options = {}){
    options.url = options.url || document.location.origin.replace(/^http/, 'ws');
    this.options = options;
    // this.ws = new window.WebSocket(url);
    // const self = this;
    // let ws;
    // function send(msg) {
    //   msg = JSON.stringify(msg);
    //   ws.send(msg);
    // }
    // Object.defineProperties(this, {
    //   send: {value: send },
    // });
    // (function connect() {
    //
    // })()
    // // Object.defineProperties(this, EventManager);

  }
  WebsocketClient.prototype = new EventManager;
  Object.defineProperties(WebsocketClient.prototype, {
    // prop: {value: {}},
    send: {value: function (msg){
      msg = JSON.stringify(msg);
      this.ws.send(msg);
    }},

    connect: {value: function () {
      return new Promise((resolve, fail) => {
        //console.log('WS CONNECT', this.options.url);
        const ws = this.ws = new window.WebSocket(this.options.url);
        ws.addEventListener('open', e => {
          aimClient.getAccessToken().then(accessToken => {
            // //console.log('accessToken', accessToken);
            const msg = {
              hostname: this.hostname || 'aliconnect',
              // nonce: this.nonce,
              // PHPSESSID: this.PHPSESSID,
            };
            if (accessToken) {
              msg.headers = { Authorization: 'Bearer ' + accessToken }
            }
            this.send(msg);
          })
        });
        ws.addEventListener('error', console.error);
        ws.addEventListener('close', e => setTimeout(connect, 5000));
        ws.addEventListener('message', e => {
          console.debug('ws.onmessage', e.data);
          try {
            const data = JSON.parse(e.data);
            // data = JSON.parse(e.data);
            if (data.attr) {
              if (data.attr.systemId) {
                const system = systems[data.attr.systemId];
                if (system) {
                  const attr = system.data[data.attr.name];
                  // //console.log(attr);
                  const oldValue = attr.value;
                  if (attr.state != data.attr.state) {
                    setItemTypeValue(attr.item, data.attr.state, -1);
                    setItemTypeValue(attr.item, attr.state, 1);
                  }
                  Object.assign(attr, data.attr);
                  if (attr.AttributeType) {
                    setItemTypeValue(system, attr.AttributeType, - Number(oldValue));
                    setItemTypeValue(system, attr.AttributeType, Number(attr.value));
                  }
                  attributeRowUpdate(attr);
                }
              }
            }

            const ws = e.target;
            // return;
            // const config = this.config;
            // let data = e.data;
            // try {
            //   this.data = data = JSON.parse(data);
            //   // $().status('ws', `${new Date().toLocaleString()} ${data.from_id || ''}`);
            // } catch (err){
            //   return $().status('wsm', 'error');
            //   // return console.error('ws.onmessage error', data.substr(0,1000));
            // }

            if (data.body) {
              if (data.body.notify) {
                //console.log('NOTIFY', window.document.hasFocus());
                if (!window.document.hasFocus()) {
                  if ("Notification" in window) {
                    if (Notification.permission === "granted") {
                      // var notification = new Notification(...Object.values(data.body.notify));
                      // notification.onclick = function(e) {
                      //   window.focus();
                      //   //console.log('CLICKED', data.body.notify);
                      // }
                      new $().sw.showNotification(...Object.values(data.body.notify));
                      // `test modified SW`, {
                      //   body: `Bla Bla`,
                      //   icon: 'https://aliconnect.nl/favicon.ico',
                      //   image: 'https://aliconnect.nl/shared/265090/2020/07/09/5f0719fb8fa69.png',
                      //   data: {
                      //     url: document.location.href,
                      //   },
                      //   actions: [
                      //     {
                      //       action: 'new',
                      //       title: 'New',
                      //       // icon: 'https://aliconnect.nl/favicon.ico',
                      //     },
                      //     {
                      //       action: 'open',
                      //       title: 'Open',
                      //       // icon: 'https://aliconnect.nl/favicon.ico',
                      //     },
                      //     // {
                      //     //   action: 'gramophone-action',
                      //     //   title: 'gramophone',
                      //     //   icon: '/images/demos/action-3-128x128.png'
                      //     // },
                      //     // {
                      //     //   action: 'atom-action',
                      //     //   title: 'Atom',
                      //     //   icon: '/images/demos/action-4-128x128.png'
                      //     // }
                      //   ]
                      // });
                    }
                  }
                }
              }
              if (data.body.accept) {
                $().prompt('accept').accept_scope(data.body.accept.scopes, data.from_id);
                // //console.log($().prompt('accept_scope'), $.his.map.get('accept_scope'));
              }
            }
            if (data.state === 'disconnect') {
              //console.log('disconnect', $().aliconnector_id, data.from_id);
              // return;
              if ($().aliconnector_id === data.from_id) {
                $().status('aliconnector', 'offline');
                $().aliconnector_id = null;
              }
            }
            console.error(data);
            if (data.id_token) {
              const id = JSON.parse(atob(data.id_token.split('.')[1]));
              //console.log(id, getId(id.sub), getUid(id.sub), aimClient.sub);
              if (getId(id.sub) !== getId(aimClient.sub)) {
                return $().logout();
              }
            }
            // console.debug('ws.onmessage', data);


            // if (this.clients.has(data.from_id)){
            //   //console.log('REPLY FROM', data.from_id);
            //   this.clients.get(data.from_id)(data.body);
            //   this.clients.delete(data.from_id);
            //   return
            // }


            if (data.from_id === $().aliconnector_id) {
              if (data.param) {
                if (data.param.filedownload) {
                  //console.log('filedownload', data.param.filedownload);
                }
                if (data.param.fileupload) {
                  //console.log('fileupload', data.param.fileupload);
                }
              }
            }
            if ('userstate' in data){
              console.debug('userstate', data);
              console.debug(Item.items, Item.items.filter(item => item.ID == data.sub));
              Item.items
              .filter(item => item.ID == data.sub)
              .forEach(item => item.elements.forEach(element => element.hasAttribute('userstate') ? element.setAttribute('userstate', data.userstate) : null))
            }
            if ('socket_id' in data){
              console.warn(this, 'socket_id', data);
              this.socket_id = data.socket_id;
              let currentState = ws.state;
              if (data.socket_id === 1){
                this.setState('UNAUTHORIZED');
              } else if (data.payload){
                this.setState('AUTHORIZED');
                setState = (state) => {
                  this.setState(state);
                  // broadcast message with state
                  // op ws server bijhouden alle connecties van gebruiker,
                  // alleen als alle connecties offline zijn dan bericht sturen.
                  // timeout opnemen in geval van omschakelen naar andere app
                }
                // window.addEventListener('focus', e => setTimeout(() => setState('focussed')))
                // window.addEventListener('blur', e => setTimeout(() => setState('online')))
              } else {
                // this.setState('CONNECTED');
                // ws.login();
              }
              resolve(this);
              // this.resolve(this);
              // self.emit("connect", self);
              data.type = 'connect';
              if (currentState === 'CONNECTING'){
                $().emit('connect', data);
              }
              while (message = ws.messages.shift()){
                console.debug('MESSAGE', message);
                ws.send(message);
              }
            } else {
              $.handleData(data);
            }
            return;
            if (data.aliconnector) {
              //console.log(data);
              if (data.aliconnector === 'online') {
                $().status('aliconnector', 'online');
                this.sendto($().aliconnector_id = data.from_id, { path: 'sign_in' });
              }
              // console.debug('aliconnector', data, data.from_id);
              // $.Aliconnector.state = 'online';
              // if (ws.infoElement){
              //   ws.infoElement.innerText = ws.state + '+';
              // }
            }
            // if ('reply' in data){
            //   $.Aliconnector.reply(data.reply);
            // }
            // if ('signin' in data){
            //   console.debug('SIGNIN', data);
            //   const sub = config.id ? config.id.sub : (config.access ? config.access.sub : null);
            //   if (data.access.sub != sub){
            //     $.clipboard.reload();
            //   }
            // }
            return;
            if (((data.ref && data.ref.itemsModified) || data.forward) && data.from_id && this.wsServer){
              this.wsServer.forwardMessageFromClient(data, e.data, ws);
            }
          } catch (err) {
            // return $().status('wsm', 'error');
            return console.error(err);
          }

          // return;
        });
      });
    }},


    login: {value: function login(access_token){
      return new Promise((resolve, fail) => {
        this.connect().then(e => {
          //console.log('CONNN', e);
        });
        return;
        console.debug('WS LOGIN');
        // this.resolve = resolve;
        if (!access_token || !this.WebSocket) return resolve(this);
        this.WebSocket.send(JSON.stringify({
          headers: {
            authorization: 'Bearer '+access_token,
          }
        }));
      })
    }},
    message: {value: function message(par){
      console.error('$.WebsocketRequest', par);
      let message='';
      if (par){
        // let req=par;
        // const request = new $().url(...arguments);
        // const res = request.req.res;
        // message = request.message;
        console.error('WebsocketRequest', par);
        // return;
        // if (req.message_id){
        // 	message.message_id = req.message_id;
        // }
        // if (res){
        // 	message.id = req.id = req.id || new Date().valueOf();
        // 	$.WebsocketClient.requests[message.id] = res;
        // }
        message = JSON.stringify(par);
        $.WebsocketClient.messages.push(message);
        // req.device_id = $.his.cookie ? $.his.cookie.device_id : 'test_max';
      }
      if (!$.WebsocketClient.conn){
        // console.debug('STARTCONNECT',$.WebsocketClient);
        return $.WebsocketClient.connect();
      }
      // console.debug('SERVER REQUEST', message);
      if ($.WebsocketServer){
        // console.debug('SERVER REQUEST', message);
        $.WebsocketServer.clients.forEach(wsChild => wsChild.send(message));
      }
      if ($.WebsocketClient.conn.readyState !== 1){
        return;
      }
      while (message = $.WebsocketClient.messages.shift()){
        $.WebsocketClient.send(message);
      }
    }},
    // onmessage: {value: onmessage},
    reply: {value: function reply(message){
      console.debug('repl', message);
      return this.sendto(this.data.from_id, {body: message});
    }},
    sendto: {value: function sendto(sid, message = {}){
      console.debug('send to', this.state);
      $().status('ws', 'ACTIVE');
      message.to = { sid: sid };
      return $.promise( 'send to', resolve => {
        $().status('ws', this.state);
        this.clients.set(sid, resolve);
        this.send(message);
      });
    }},
    setState: {value: function setState(state, message){
      $().status('ws', this.state = state);
      // if (window.document){
      //   this.procstate = this.procstate || $().procstate();
      //   this.procstate.text(message || '');
      // }
    }},

    send1: {value: function(message){
      // console.debug('send', message);
      if (!this.WebSocket) return;
      $().status('ws', 'ACTIVE');
      setTimeout(() => {
        $().status('ws', this.state);
      },100);
      message = JSON.stringifyReplacer(message);
      this.WebSocket.send(message);
      if ($.server) {
        $.server.clients.forEach(ws => ws.send(message));
      }
    }},


    connect1: {value: function(){
      return $.promise( 'connect', resolve => {
        this.setState('CONNECTING', `Connecting ${this.url}`);
        if (this.WebSocket) return resolve(this);
        this.resolve = resolve;
        // console.debug('connect', this.url);
        Object.assign(this.WebSocket = new window.WebSocket(this.url), {
          messages: [],
          requests: {},
          message: message => {
            // alert('SEND'+JSON.stringify(message));
            // console.debug('MESSAGE', ws.readyState, webSocket, this.ws, this);
            webSocket.send(message);
            if ($.wsServer && $.wsServer){
              $.wsServer.forEach(ws => ws.send(message))
            }
          },
          // onconnect: e => {
          // 	console.debug('onconnect', ws, e.target);
          // },
          onmessage: e => this.onmessage(e),
          onopen: e => {
            this.setState('OPEN');
            this.WebSocket.send(JSON.stringify({
              hostname: this.hostname || 'aliconnect',
              nonce: this.nonce,
              PHPSESSID: this.PHPSESSID,
              headers: aimClient.getAccessToken()
              ? {
                Authorization:'Bearer ' + aimClient.getAccessToken()
              }
              : null
            }));
            // console.debug('ONOPEN', e.target, webSocket, this.ws);
            // resolve(webSocket);
          },
          onclose: e => {
            this.setState('DISCONNECTED');
            this.WebSocket = null;
            setTimeout(() => this.connect(), 5000);
            // clearTimeout(this.pingTimeout);
            //this.pingTimeout=setTimeout(function, 1000);
            // $().emit('wscClose');
          },
          onerror: e => {
            this.setState('ERROR');
            // $().emit('wscClose');
          },
        });
        return this;
      })
    }},
  });

  const now = new Date();
  Object.defineProperties(this, {
    defineClasses: { value: function (classes) {
      defineClasses.classes[document.currentScript.src] = classes;
      for ([selector,context] of Object.entries(classes)) {
        context.lastModifiedDateTime = now;
        const fn = new Function(`return function ${selector}(){${context.construct?'this.construct(...arguments)':''}}`)();
        for ([name,property] of Object.entries(context)) {
          property.lastModifiedDateTime = now;
          Object.defineProperty(fn.prototype, name, property);
        }
        Object.defineProperty(this, selector, { value: fn });
        // console.log(document.currentScript, context);
      }
    }},
  })
  defineClasses.classes = {
    lastModifiedDateTime: now,
  };

  function extend (parent, selector, context) {
    if (!selector) {
      selector = parent;
      parent = this;
    }
    // //console.log(111, parent, selector);
    const objects = [];
    if (context) {
      Object.entries(context).forEach(entry => Object.defineProperty(parent, ...entry))
    }
    if (selector) {
      (function recurse(parent, selector, context){
        if (parent && selector && selector instanceof Object) {
          for (let [key, value] of Object.entries(selector)) {
            if (typeof parent[key] === 'function' && typeof value !== 'function') {
              // //console.log(key, value, parent[key]);
              parent[key](value)
            } else if (typeof value === 'function' && !parent.hasOwnProperty(key)) {
              parent[key] = value;
              // Object.defineProperty(parent, key, {
              //   enumerable: false,
              //   configurable: false,
              //   writable: false,
              //   value: value,
              // });
            }
            if (typeof value !== 'object' || Array.isArray(value) || !(key in parent) || objects.includes(value)) {
              parent[key] = value;
            } else {
              objects.push(value);
              recurse(parent[key], selector[key]);
            }
          }
        }
      })(parent, selector, context);
    }
    return parent;
  };
  function Server(config) {
    // console.log(config.paths);
    const server = this;
    server.config = config;
    const events = require('events');
    const paths = [process.mainModule.path+'/public', process.mainModule.path];
    (function addpath(module) {
      if (module.parent) addpath(module.parent);
      //console.log(module.paths);
      // paths.push(...module.paths.map(path => path.replace(/node_modules$/,'public')));
      paths.push(...module.paths);
    })(module);
    server.paths = paths.unique().filter(path => fs.existsSync(path));
    // console.log(server.paths);

    function onconnection (wsc, req) {
      //console.log('connect');
      wsc.remoteAddress = req.connection.remoteAddress.split(':').pop();
      wsc.sid = Crypto.btoaToJson(req.headers['sec-websocket-key']);
      wsc.access = {sid: wsc.sid};
      console.msg('CONNECTION', wsc.sid, wsc.remoteAddress);
      wsc.on('close', connection => {
        if (wsc.access) {
          const message = JSON.stringify({from_id: wsc.sid, state: 'disconnect'});
          Array.from(wsServer.clients)
          .filter(ws => ws !== wsc && ws.access && (ws.access.sub === wsc.access.sub || ws.access.aud === wsc.access.aud || ws.access.nonce === wsc.access.nonce))
          .forEach(ws => ws.send(message));
        }
        console.msg('DISCONNECT', wsc.sid, wsc.remoteAddress, wsc.access.sub);
        // console.debug(userConnected);

        // wsServer.clients.forEach(wsChild => {
        // 	console.msg('DISCONNECT CHILDS', wsChild.sid);
        // });
        // wsServer.clients.splice(wsServer.clients.indexOf(wsc), 1);
      });
      wsc.on('message', data => {

        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error('json_error', data.substr(0,1000));
        }
        if (data && typeof data === 'object') {
          //console.log(wsc.sid);
          /** check user state
            *
            */
          (function userstate(){
            if (userstate) {
              const states = [
                'unknown',
                'offline',
                'blocked',
                'busy_inactive',
                'inactive',
                'appear_away',
                'urgentonly',
                'donotdisturb',
                'busy',
                'available',
              ];
              const userstate = states.indexOf(data.userstate);
              var clients = Array.from(wsServer.clients).filter(ws => ws.access && ws.access.aud === wsc.access.aud);
              var subclients = clients.filter(ws => ws.access.sub === wsc.access.sub);
              const currentState = Math.max(...subclients.map(ws => ws.userstate || 0));
              wsc.userstate = userstate;
              // var sub = wsc.access.sub;
              const newState = Math.max(...subclients.map(ws => ws.userstate || 0));
              if (currentState !== newState) {
                //console.log('state set', data.userstate, currentState, newState, subclients.map(ws => ws.userstate));
                data.userstate = states[newState];
                const msg = JSON.stringify(data);
                clients.forEach(ws => ws.send(msg));
              }


              // if (subclients.every(ws => ws.userstate < userstate)) {
              // 	//console.log('newstate', userstate, data.userstate);
              // 	var clients = wsServer.clients.filter(ws => ws.access && ws.access.aud && ws.access.aud === wsc.access.aud);
              // 	clients.forEach(ws => ws.send(event.data));
              // }


              // if (!subclients.some(ws => ws.userstate > userstate)) {
              // 	//console.log('newstate', userstate, data.userstate);
              // 	var clients = wsServer.clients.filter(ws => ws.access && ws.access.aud && ws.access.aud === wsc.access.aud);
              // 	clients.forEach(ws => ws.send(event.data));
              // }
              // if (!subclients.some(ws => ws.userstate < userstate)) {
              // 	//console.log('newstate some');
              // 	var clients = wsServer.clients.filter(ws => ws.access && ws.access.aud && ws.access.aud === wsc.access.aud && ws.userstate);
              // 	clients.forEach(ws => ws.send(event.data));
              // }

              // var a = subclients.map(ws => ws.userstate);
              // console.debug(data.userstate);
              // //console.log(subclients.filter(ws => ws.userstate === data.userstate).map(ws => ws.userstate));
              // //console.log(data.userstate, a, a.every(userstate => userstate == data.userstate));
              // //console.log(['ja','ja','ja','ja'].every(ws => ws === 'ja'));

              // if (data.userstate === 'available' && !subclients.some(ws => ws.userstate === data.userstate)) {
              // 	clients.forEach(ws => ws.send(event.data));
              // 	console.debug('send', data.userstate);
              // }
              // wsc.userstate = data.userstate;
              // if (data.userstate === 'inactive' && subclients.every(ws => ws.userstate === data.userstate)) {
              // 	clients.forEach(ws => ws.send(event.data));
              // 	console.debug('send', data.userstate);
              // }


              // if (data.userstate === 'available' && !subclients.some(ws => ws.userstate === data.userstate)) {
              // 	clients.forEach(ws => ws.send(event.data));
              // 	console.debug('send', data.userstate);
              // }
              // wsc.userstate = data.userstate;
              // if (data.userstate === 'inactive' && subclients.every(ws => ws.userstate === data.userstate)) {
              // 	clients.forEach(ws => ws.send(event.data));
              // 	console.debug('send', data.userstate);
              // }
              return;

              // console.debug(wsServer.clients.map(ws => ws.access));

              // console.debug('userstate',data,clients,sub);
            }
          })();

          if (data.attr) {
            attr(...data.attr);
          }
          if (data.itemsModified) {
            // //console.log('response.itemsModified FROM CLIENT');
            if (data.body && data.body.requests) {
              aim.saveRequests(data.body.requests);
            }
            if (aim.ws) {
              aim.ws.send(event.data);
            }
          }

          if (data.forward && aim.WebsocketClient && aim.WebsocketClient.conn) {
            // console.debug('FORWARD TO SERVER', response.forward, aim.WebsocketClient.socket_id);
            aim.WebsocketClient.conn.send(event.data);
            // forwardMessageFromClient(response, responseText, aim.WebsocketClient.conn);
          }


          // CHAT ROOM
          if (data.message_type) {
            var { message_type, content, to } = data;
            if (message_type === 'OPTIONS') {
              wsc.options = content;
              // return;
            }
            data.from = wsc.sid;
            data.options = wsc.options;
            let message = JSON.stringify(data);
            if (to) {
              var clients = wsServer.clients
              .filter(ws => ws.options && ws.options.wall === wsc.options.wall && wsc !== ws && ws.readyState && ws.sid === to);
            } else {
              var clients = wsServer.clients
              .filter(ws => ws.options && ws.options.wall === wsc.options.wall && wsc !== ws && ws.readyState && ws.sid);
            }
            clients.forEach(ws => {
              console.msg('SEND', message_type, ws.sid);
              ws.send(message);
            });
            return;
          }

          // console.debug('server ws client');
          // aim.onmessage.call(wsc, event);

          if (this.response) {
            try {
              data = this.response = JSON.parse(this.responseText);
            } catch (err) {
              console.error('json_error', String(this.responseText).substr(0,1000));
            }
          }

          if (data.headers) {
            const headers = Object.fromEntries(Object.entries(data.headers).map(([key, value]) => [key.toLowerCase(), value]));
            //console.log('headers', headers);
            // this.hostname = this.response.hostname;
            let apiKey = Object.keys(headers).find(key => ['api_key','api-key','x-api-key'].includes(key.toLowerCase()));
            let accessToken;
            if (apiKey) {
              accessToken = headers[apiKey];
            } else {
              let authorizationKey = Object.keys(headers).find(key => ['authorization'].includes(key.toLowerCase()));
              if (authorizationKey) {
                accessToken = headers[authorizationKey].split(' ')[1];
              }
            }

            if (accessToken) {
              //console.log('accessToken', accessToken);
              let accessTokenArray = accessToken.split('.');
              try {
                var data = wsc.response = JSON.parse(data);
              } catch (err) {
                console.error('json_error');
              }
              try {
                let payload = wsc.access = JSON.parse(atob(accessTokenArray[1]));
                let domainName = payload.iss.split('.').shift();
                aim().url('https://' + payload.iss + '/api/').query({
                  request_type:'check_access_token',
                  headers: {
                    Authorization: 'Bearer ' + accessToken,
                  },
                }).get().then(event => {
                  console.msg('SIGNIN', wsc.sid );
                  if (payload.nonce) {
                    const message = JSON.stringify({signin: wsc.sid, access:wsc.access });
                    wsServer.clients
                    .filter(ws => ws !== wsc && ws.access.nonce === payload.nonce)
                    .forEach(ws => ws.send(message));
                  }
                  wsc.send(JSON.stringify({ socket_id: wsc.sid, payload: payload }));
                  return;
                });
              } catch (err) {
                console.error(err, accessTokenArray)
              }
              return;
            }
          }
          if (data.hostname) {
            // console.msg('CONNECT', wsc.sid, wsc.remoteAddress, wsc.response.hostname, wsc.response);
            console.msg('CONNECT', wsc.sid, wsc.remoteAddress, data.hostname);
            wsc.access = data;
            wsc.access.socket_id = wsc.sid;
            return wsc.send(JSON.stringify(wsc.access));
          }



          // if (!this.access) return;
          // console.debug('wsc.access && wsServer.clients');
          if (wsc.access && wsServer.clients) {
            data.from_id = wsc.sid;
            data.nonce = wsc.access.nonce;
            responseText = JSON.stringify(data);
            var sendto = [];
            // console.debug('server onmessage clients', this.response.path, this.response.form_id, 'aud', wsc.access.aud, 'sub', wsc.access.sub);
            // console.msg('clients', response.to, this.responseText);
            forwardMessageFromClient(data, responseText, wsc);
          }


        }
      });
      //var a = 2;
    };
    const host = config.host || config.http;
    const protocol = host.ca ? "https" : "http";
    const options = host.ca ? {
      key: fs.readFileSync(process.cwd() + host.key),
      cert: fs.readFileSync(process.cwd() + host.cert),
      ca: host.ca ? fs.readFileSync(process.cwd() + host.ca) : null,
    } : null;
    console.log('host active', protocol, host.port, options);
    const http = require(protocol);
    function processRequest (req, res) {
      function end(statusCode, body, header) {
        // console.log(statusCode, body, header);
        res.writeHead(res.statusCode = statusCode, header);
        res.end(body);
      }
      if (req.url.match(/secret/)) return end(401, `401 No authorize ${req.url}`, { 'Content-Type': 'text/html' } );
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
      res.setHeader('Access-Control-Request-Method', '*');

      var url = new URL(req.url, 'http://localhost');
      //console.log(url.pathname, fname);
      if (config.paths) {
        if (config.paths[url.pathname]) {
          if (config.paths[url.pathname].get) {
            if (config.paths[url.pathname].get.operationId) {
              const operationId = config.paths[url.pathname].get.operationId;
              // console.log(operationId, server[operationId]);
              if (server[operationId]) {
                (async function () {
                  const res = await server[operationId]();
                  // const body = JSON.stringify(res);
                  // console.log(res);
                  // return end(200, 'AOK', {});
                  return end(res.code, res.body, res.headers);
                })()
                return;
              }
            }
          }
        }
      }

      if (url.pathname === '/config.js') {
        return end(200, 'config='+JSON.stringify(config), { 'Content-Type': 'application/json' });
      }
      if (url.pathname === '/sql.json') {
        const sql = `SELECT TOP 1000 * FROM his.attr WHERE ${url.searchParams.get('filter')}`;
        debug(sql);
        return new mssql.Request().query(sql, (err, res) => {
          if (err) //console.log(err);
          end(200, JSON.stringify(res.recordsets), { 'Content-Type': 'application/json' });
        })
      }
      const headers = {
        json: {
          'Content-Type': 'application/json',
          'OData-Version': '4.0',
        },
        js: {
          'Content-Type': 'text/javascript',
          'Service-Worker-Allowed': '/',
        },
        md: {
          'Content-Type': 'text/md',
          'Service-Worker-Allowed': '/',
        },
        css: {
          'Content-Type': 'text/css',
          'Service-Worker-Allowed': '/',
        },
        html: {
          'Content-Type': 'text/html',
          'Service-Worker-Allowed': '/',
        },
      };
      let pathname = url.pathname;

      pathname = pathname.replace(/\/blob\/main(.*?)\.md/, '$1');
      pathname = pathname.replace(/^\/(.*?)\/.*?\.(.*?)\//, '/@$1/$2/');
      console.log(pathname);
      var fname = paths.map(path => path+pathname).find(fname => fs.existsSync(fname) && fs.statSync(fname).isFile()) || paths.map(path => path+pathname+'index.html').find(fs.existsSync);


      if (!fname && paths.map(path => path+pathname+'.md').find(fs.existsSync)) {
        return fs.readFile(module.path+'/../../public/md.html', (err, data) => {
          data = String(data)
          .replace(/\@\d+\.\d+\.\d+/g, '')
          .replace(/=".*aliconnect.sdk/g, '="/@aliconnect/sdk')
          .replace(/="\/\/.*?\.github\.io\/(.*?)\./g, '="/@$1/')
          end(200, data, headers.html);
        });
        // fname = paths.map(path => '/@aliconnect/sdk/public/md.html').find(fs.existsSync);
      }
      if (fname) {
        return fs.readFile(fname, (err, data) => {
          if (err) {
            return end(404, `404 Not Found 1 ${req.url}`, { 'Content-Type': 'text/html' });
          }
          var ext = fname.split('.').pop();
          if (fname.match(/\.html/)) {
            data = String(data)
            .replace(/\@\d+\.\d+\.\d+/g, '')
            .replace(/=".*aliconnect.sdk/g, '="/@aliconnect/sdk')
            .replace(/="\/\/.*?\.github\.io\/(.*?)\./g, '="/@$1/')
          }
          // //console.log('JA');
          end(200, data, headers[ext]);
        })
      }
      return end(404, `404 Not Found 1 ${req.url}`, { 'Content-Type': 'text/html' });
      // //console.log(url.pathname, fname);
      //
      //
      //
      // res.writeHead(200);
      // //res.end(JSON.stringify({ clients: wss, a: a }));
      //
      // res.end("This is the Aliconnect messageserver");
      //
    };
    const httpServer = http.createServer(options, processRequest).listen(host.port);
    const ws = require('ws');
    const wsServer = new ws.Server({server: httpServer}).on('connection', onconnection);
    const clients = this.clients = wsServer.clients;
    function forwardMessageFromClient(response, responseText, wsc) {
      Array.from(wsServer.clients).filter(ws => ws !== wsc).forEach(ws => {
        ws.access.sid = ws.sid;
        // if (wsChild.readyState !== 1 || wsc === wsChild || !wsChild.access || wsChild.sid === response.forward) return;
        if (ws.readyState !== 1 || wsc === ws || !ws.access ) return;
        if (response.to) {
          for (let [name, value] of Object.entries(response.to)) {
            if (ws.access[name] && ws.access[name] == value) {
              ws.send(responseText);
              return;
            }
          }
        } else {
          if (
            ws.access.sub == wsc.access.aud ||
            ws.access.aud == wsc.access.sub ||
            String(ws.access.aud).split(',').includes(String(wsc.access.aud))
          ) {
            return ws.send(responseText);
          }
        }
      });
    }
    Object.defineProperties(this.clients, {
      send: { value: function(msg) {
        msg = JSON.stringify(msg);
        Array.from(clients).filter(wsa => wsa.readyState === wsa.OPEN).forEach(wsa => wsa.send(msg))
      }}
    });

    const attributes = this.attributes = new events;
    const types = {
      D: { title: "Digital", BitLength: 1 },
      Bool: { title: "Boolean", BitLength: 1 },
      SByte: { title: "Signed Byte", BitLength: 8, signed: 1 },
      UByte: { title: "Unsigned Byte", BitLength: 8 },
      SInt: { title: "Signed Integer", BitLength: 16, signed: 1 },
      UInt: { title: "Unsigned Integer", BitLength: 16 },
      SDInt: { title: "Signed Double Integer", BitLength: 32, signed: 1 },
      UDInt: { title: "Unsigned Double Integer", BitLength: 32 },
      Float: { title: "Float", BitLength: 32, signed: 1, exponent: 8 },
      Double: { title: "Double", BitLength: 64, signed: 1, exponent: 11 },
    };
    const items = [];
    // let itemId = 0;
    const timers = {};
    var setItems = [];

    function debug(s){
      console.log(s);
      fs.appendFile("logger.log", `${new Date().toISOString()}: ${s}\n`, err => console.log);
    }
    function exit(s){
      debug(s);
      process.exit();

    }
    function bitTo (typename, s) {
      var s = s.match(/.{1,16}/g).reverse().join('');
      var type = types[typename], arr = s.replace(/ /g, '').split(''), sign = type.signed ? (Number(arr.shift()) ? -1 : 1) : 1;
      if (!type.exponent) return parseInt(arr.join(''), 2) * sign;
      var mantissa = 0, exponent = parseInt(exp = arr.splice(0, type.exponent).join(''), 2) - (Math.pow(2, type.exponent - 1) - 1);
      arr.unshift(1);
      arr.forEach(function (val, i) { if (Number(val)) mantissa += Math.pow(2, -i); });
      return sign * mantissa * Math.pow(2, exponent);
    };
    function getSqlParams (object) {
      var params = [];
      for (var property in object) params.push('@' + property + "='" + String(object[property]).replace(/'/g, "''") + "'");
      return params.join(',');
    };
    if (config.dbs) {
      const options = {
        port: config.dbs.port || 1433,
        server: config.dbs.server,
        authentication: {
          type: 'default',
          options: {
            userName: config.dbs.user,
            password: config.dbs.password,
          }
        },
        options: {
          encrypt: true,
          validateBulkLoadParameters: true,
          trustServerCertificate: true,
          cryptoCredentialsDetails: { minVersion: 'TLSv1' },
          database: config.dbs.database,
        },
      };
      server.requests = [];
      const tedious = server.tedious = require('tedious');
      const conn = server.conn = new tedious.Connection(options);
      conn.on('connect', err => {
        if (err) throw err;
        console.log('SQL ONN');
        server.query(
          `IF OBJECT_ID('his.attr') IS NULL
          BEGIN
          CREATE TABLE [his].[attr](
          	[ts] [timestamp] NULL,
          	[id] [bigint] NULL,
          	[name] [varchar](50) NULL,
          	[value] [varchar](max) NULL,
          	[modifiedDateTime] [datetime] NULL,
          	[parent] [varchar](500) NULL,
          	[attributeType] [varchar](50) NULL,
          	[title] [varchar](500) NULL
          ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
          END`
        );
        // items = config.items;
        // console.log(config.items);

        // config.items.forEach(function addItem(item) {
        //   if (item) {
        //     items.push(item);
        //     (item.children||[]).forEach(addItem)
        //   }
        //   // items[item.id = item.id || item.SystemId || items.length]=item;
        // });
        // items.push(...config.items);
        const systemTimeoutMs = 2000;
        systemAttributes = {
          MEMORY_USED_SPACE(item) {
            const osUtils = require('os-utils');
            (function memoryUsedSpace() {
              server.attrSetValue(item, Math.round(100 - osUtils.freememPercentage() * 100));
              setTimeout(memoryUsedSpace, systemTimeoutMs);
            })();
          },
          HDD_USED_SPACE(item) {
            const checkDiskSpace = require('check-disk-space');
            (function hddUsedSpace() {
              checkDiskSpace('C:/').then(diskSpace => server.attrSetValue(item, Math.round((diskSpace.size - diskSpace.free) / diskSpace.size * 100)));
              setTimeout(hddUsedSpace, systemTimeoutMs);
            })();
          },
          TIME_SYNC(item) {
            const nodeCmd = require('node-cmd');
            (function timeSync() {
              nodeCmd.get('w32tm /query /status', (err, data, stderr) => {
                if (!err) {
                  server.attrSet(item, 'state', 'connected');
                  const [s,value] = data.match(/Leap Indicator: (\d)/) || [];
                  return server.attrSetValue(item, value === '0' ? 0 : 1);
                } else {
                  server.attrSet(item, 'state', 'disconnected');
                  console.error(err);
                }
                server.attrSetValue(item, 1);
              });
              setTimeout(timeSync, systemTimeoutMs);
            })();
          },
          WATCHDOG_ACSM(item) {
            let acsmCount = 0;
            (function watchdogAcsm() {
              server.attrSetValue(item, acsmCount = acsmCount >= 100 ? 1 : acsmCount+1);
              setTimeout(watchdogAcsm, systemTimeoutMs);
            })();
          },
        };

        // items.forEach(item => {
        //   console.log(1, item.name);
        // })
        // const osUtils = require('os-utils');
        // const checkDiskSpace = require('check-disk-space');
        // const nodeCmd = require('node-cmd');
        // let acsmCount = 0;
        // (function getSystemAttributes() {
        //   attr(systemId, 'MEMORY_USED_SPACE', Math.round(100 - osUtils.freememPercentage() * 100));
        //   checkDiskSpace('C:/').then((diskSpace) => { attr(systemId, 'HDD_USED_SPACE', Math.round((diskSpace.size - diskSpace.free) / diskSpace.size * 100)); });
        //   nodeCmd.get('w32tm /query /status', (err, data, stderr) => {
        //     console.log(data);
        //     var value = Number(data.split(/\n/).shift().split(':').pop().split('(').shift().trim());
        //     attr(systemId, 'TIME_SYNC', value);
        //   });
        //   attr(systemId, 'WATCHDOG_ACSM', acsmCount = acsmCount >= 100 ? 1 : acsmCount+1);
        //   setTimeout(getSystemAttributes, 5000);
        // })();

        Array.from(config.items).forEach(function addChildren(item) {
          if (item) {
            if (systemAttributes[item.name]) {
              // console.log(111, item);
              systemAttributes[item.name](item);
            }
            if (item.Enumeration) {
              item.enum = item.Enumeration.replace(/, /g,',').split(',');
            }
            items.push(item);
            (item.children||[]).forEach(child => addChildren(child));
          }
        });

        // items.forEach((item,i) => item.id = i);
        // return console.log(config.items, items);
        //
        // items.forEach(item => {
        //   if (item.parent) {
        //     const parent = items.find(row => item.parent === [row.parent,row.name].join('.'));
        //     if (!parent) {
        //
        //     }
        //     console.log(item.parent, parent ? 1 : 0);
        //   }
        // })
        //
        //
        // // console.log(items);
        // return;

        // initSystemAttributes(config.items[0].id);

        this.initControlEquipment(items);
        attributes.on('change', attr => clients.send({attr:attr}));
      });
      conn.connect();
    }
  }
  Server.prototype = {
    query(sql) {
      return new Promise((resolve, reject) => {
        if (sql) {
          this.requests.push([sql,resolve, reject]);
        } else {
          this.sqlBusy = false;
        }
        if (!this.sqlBusy && this.requests.length) {
          this.sqlBusy = true;
          [sql, resolve, reject] = this.requests.shift();
          const rows = [];
          const request = new this.tedious.Request(sql, err => {
            if (err) {
              err.query = sql;
              reject(err);
            } else {
              resolve(rows);
              this.query();
            }
          });
          request.on('row', columns => rows.push(Object.fromEntries(columns.map(col => [col.metadata.colName, col.value]))));
          this.conn.execSql(request);
        }
      });
    },
    attrSet(attribute, name, value) {
      if (attribute[name] !== value) {
        attribute[name] = value;
        // console.log(name,value);
        this.attributes.emit('change', attribute);
      }
    },
    attrSetValue(attribute, value, path = []) {
      const server = this;
      function has(name) {
        return (name in attribute) && attribute[name] !== null;
      }
      // Valideer waarde
      if (!isNaN(value)) {
        value = Number(value || 0);

        // // Validate value
        // let quality = "Valid";
        // if (has('min') && has('max') && (attribute.min > value || attribute.max < value)) {
        //   console.error('NotValid', id, attributeName, value);
        //   return attrSet(attribute, 'quality', "NotValid");
        // }


        // Omrekenen raw value naar value
        if (has('MaxEngValue') && has('MinEngValue') && has('MaxRawValue') && has('MinRawValue')) {
          value = Math.round(((Number(attribute.MaxEngValue) - Number(attribute.MinEngValue)) / (Number(attribute.MaxRawValue) - Number(attribute.MinRawValue)) * (value - Number(attribute.MinRawValue)) + Number(attribute.MinEngValue)) * 100) / 100;
        }

        // Binnenkomende waarde bewaren voor enum text
        if (has('Ne')) {
          attribute.TextualValue = value;
        }

        // Low High
        const low = Number(attribute.Low || 0);
        const high = Number(attribute.High || 0);
        if (has('Low') && has('High') && high <= low) {
          if (value >= high && value <= low) {
            value = 1;
          } else if (value <= high || value >= low) {
            value = 0;
          }
        } else if (has('Low')) {
          if (value <= low) {
            value = 1;
          } else if (value >= low) {
            value = 0;
          }
        } else if (has('High')) {
          if (value >= high) {
            value = 1;
          } else if (value <= high) {
            value = 0;
          }
        }

        if (has('Eq')) {
          value = value == attribute.Eq ? 1 : 0;
        }
        if (has('Ne')) {
          value = value != attribute.Ne ? 1 : 0;
        }


        curValue = Number(attribute.value || 0);
        // Hysteresis
        const hyst = Number(attribute.Hysteresis || 0);
        if (value < curValue - hyst || value > curValue + hyst || !('value' in attribute)) {

          // console.log(1, attribute.name, attribute.SystemId);
          // if (attribute.systemId)
          if (attribute.SystemId) {
            const name = path.concat(attribute.name).join('.');
            // console.log(attribute.SystemId, attribute.parent, name, value);

            attribute.modifiedDT = new Date().toISOString();
            server.attrSet(attribute, 'value', value);
            const values = [
              attribute.id,
              name,
              attribute.value,
              attribute.parent,
              attribute.title,
              attribute.AttributeType,
            ];
            this.query(`INSERT his.attr(id,name,value,parent,title,AttributeType) VALUES('${values.join("','")}')`).catch((err,sql) => console.error('attrSetValue', err));
            server.attributes.emit('changeValue', attribute);
          }

          (attribute.children||[]).forEach(child => server.attrSetValue(child, value, path.concat(attribute.name)));
        }

        // // OnlineHours
        // if (attribute.Calc == 'OnlineHours') {
        //   //console.log('OnlineHours event',item.title, item.Value);
        //   attribute.deltaTimeS = 3600;
        //   (attribute.OnlineHours = function () {
        //     clearTimeout(timers[attribute.id]);
        //     var master = items[this.masterID];
        //     var masterOn = Number(master.Value);
        //     //masterOn = 1; // MKA
        //     //console.log('OnlineHours', masterOn, this.masterStart);
        //     if (this.masterStart) {
        //       attr(this.id, 'Value', Number(this.Value || 0) + ((new Date().valueOf() - this.masterStart.valueOf()) / 1000 / 3600), true);
        //     }
        //     this.masterStart = masterOn ? new Date() : null;
        //     if (masterOn) {
        //       timers[this.id] = setTimeout(this.OnlineHours.bind(this), this.deltaTimeS * 1000);
        //     }
        //   }).call(item);
        //   return;
        // }
      }
    },
    initControlEquipment(items) {
      const server = this;
      function itemSetState(item, state){
        server.attrSet(item, 'state', state);
        (item.children||[]).filter(Boolean).forEach(child => itemSetState(child, state));
      }
      function initAttributes(item) {
        const attributes = [];
        let parent;
        let parentItem;
        (function addChildren(item, path) {
          if (item) {
            attributes.push(item);
            (item.children||[]).forEach(child => addChildren(child, path));
          }
        })(item, []);
        return attributes;
      }
      const modbusDevices = items.filter(item => item.Device === 'MODBUS' && item.IPAddress);
      const snmpDevices = items.filter(item => item.Device === 'SNMP' && item.IPAddress);
      // console.log(modbusDevices);
      // console.log(snmpDevices);
      if (modbusDevices) {
        const net = require('net');
        const jsmodbus = require('jsmodbus');
        modbusDevices.forEach((item, i) => {
          // let readAddress = item.ReadAddress || 0;
          // const devices = item.children;
          // let readLength = 0;
          // devices.forEach(d => {
          //   readLength += d.children.length;
          //   readLength += d.children.filter(c => ['Float'].includes(c.type)).length;
          // })
          const attributes = initAttributes(item);
          // console.log(attributes);
          function setSate(state){
            attributes.forEach(attr => server.attrSet(attr, 'state', state));
          }
          const socket = new net.Socket();
          const client = new jsmodbus.client.TCP(socket, i + 1);
          function connect() {
            setSate('connecting');
            socket.connect({ host: item.IPAddress, port: item.Port || 502 });
          }

          const types = {
            D: { title: "Digital", bitLength: 1 },
            Bool: { title: "Boolean", bitLength: 1 },
            SByte: { title: "Signed Byte", bitLength: 8, signed: 1 },
            UByte: { title: "Unsigned Byte", bitLength: 8 },
            SInt: { title: "Signed Integer", bitLength: 16, signed: 1 },
            UInt: { title: "Unsigned Integer", bitLength: 16, dec:0 },
            SDInt: { title: "Signed Double Integer", bitLength: 32, signed: 1 },
            UDInt: { title: "Unsigned Double Integer", bitLength: 32 },
            Float: { title: "Float", bitLength: 32, signed: 1, exponent: 8, dec: 2 },
            Double: { title: "Double", bitLength: 64, signed: 1, exponent: 11, dec: 2 },
          };

          function bitTo (typename, s) {
          	var s = s.match(/.{1,16}/g).reverse().join('');
          	var type = types[typename], arr = s.replace(/ /g, '').split(''), sign = type.signed ? (Number(arr.shift()) ? -1 : 1) : 1;
          	if (!type.exponent) return parseInt(arr.join(''), 2) * sign;
          	var mantissa = 0, exponent = parseInt(exp = arr.splice(0, type.exponent).join(''), 2) - (Math.pow(2, type.exponent - 1) - 1);
          	arr.unshift(1);
          	arr.forEach(function (val, i) { if (Number(val)) mantissa += Math.pow(2, -i); });
          	return sign * mantissa * Math.pow(2, exponent);
          };

          socket.on('connect', e => {
            setSate('connected');
            console.log('MODBUS', item.IPAddress, 'CONNECTED');
            // function readRegister(readAddress, readLength) {
            //   return new Promise((succes, reject) => {
            //     client.readInputRegisters(readAddress, readLength)
            //     .then(resp => {
            //       succes(resp);
            //     })
            //   })
            // }
            (async function readData() {
              let readAddress = item.readAddress || item.ReadAddress || 0;
              for (let device of item.children) {
                if (device) {
                  readAddress = device.readAddress || device.ReadAddress || readAddress;
                  device.type = device.type || device.Type || 'UInt';
                  const bitPos = device.bitPos || device.BitPos || 0;
                  const type = types[device.type];
                  const bitLength = type.bitLength;
                  const readLength = Math.ceil(bitLength/16);
                  // console.log(item.IPAddress, child.name, readAddress, readLength);
                  // continue;

                  await client.readInputRegisters(readAddress, readLength).then(resp => {
                    // const bitArray = [];
                    const byteArray = resp.response._body._valuesAsArray;
                    const bitString = byteArray.reverse().map(b => ('0000000000000000' + b.toString(2)).substr(-16)).join('');
                    const bitArray = bitString.split('').reverse();
                    const childBitString = bitString.substr(bitString.length - bitLength - bitPos, bitLength)
                    let readValue = bitTo(device.type, device.bitString = bitString.substr(bitString.length - bitLength - bitPos, bitLength));
                    if (device.SystemId && device.name && device.AttributeType) {
                      if (type.dec) readValue = Math.round ( readValue * 10**type.dec ) / 10**type.dec || 0;
                      server.attrSetValue(device, readValue);
                    }
                    const children = device.children || [];
                    children.forEach((child,i) => {
                      if (child && child.type) {
                        // console.log('aaa', item.IPAddress, device.readAddress, device.ReadAddress, child.type, readValue, byteArray, readAddress, readLength);
                        switch(child.type) {
                          case 'UInt': return server.attrSetValue(child, readValue);
                          case 'Bool': return server.attrSetValue(child, bitArray[i]);
                        }
                      }
                    })
                  })
                  .catch(err => {
                    console.log('modbus read error', item.IPAddress);
                    attributes.forEach(attr => server.attrSet(attr, 'state', 'error'));
                    setTimeout(connect, 20000);
                  })

                }
                readAddress++;
              }
              setTimeout(readData, item.PollInterval = 10000);
            })();
          }).on('disconnect', e => {
            setSate('disconnect');
            console.error('modbus disconnect');
          }).on('error', e => {
            console.error('modbus error', item.state, item.IPAddress);
            setSate('error');
            setTimeout(connect, 5000);
          });
          connect();
          // return;
        });
      }
      if (snmpDevices) {
        function strToOid (oid) {
          oid = oid.split(".");
          oid.forEach(function (nr, i) { oid[i] = Number(nr); });
          return oid;
        };
        const snmpNative = require('snmp-native');
        snmpDevices.forEach(item => {
          item.PollInterval = 400;
          item.children = Array.from(item.children);
          const session = new snmpNative.Session({ host: item.IPAddress, community: item.Community || 'public' });
          const children = item.children.filter(Boolean);
          const oids = children.map(child => strToOid(child.oid));
          itemSetState(item, 'connecting');
          (function read() {
            session.getAll({ oids: oids }, (err, varbinds) => {
              if (!varbinds.length) {
                itemSetState(item, 'error');
                setTimeout(() => {
                  itemSetState(item, 'connecting');
                  read();
                }, 5000);
              } else {
                itemSetState(item, 'connected');
                children.forEach((child,i) => server.attrSetValue(child, varbinds[i] && varbinds[i].value));
                setTimeout(read, item.PollInterval);
              }
            })
          })();
        });
      }
    },
  }

  function clean_code(content){
    return content
    .replace(/\\\*.*?\*\\/gs,'')
    .replace(/\/\/.*?\n/gs,'')
    .split(/\n/)
    .filter(l => l.trim())
    .join('\n')
  }
  function minimize_code(content) {
    return content.replace(/\n/g, '')
  }
  function toLink(s){
    return s.replace(/\(|\)|\[|\]|,|\.|\=|\{|\}/g,'').replace(/ /g,'-').toLowerCase();
  }

  function Dist() {
    this.all = [];
  }
  Dist.prototype = {
    doc(objectname, topobj) {
      return new Promise((success, fail) => {
        // this[objectname] = require(`../${objectname}/src/${objectname}.js`);
        // console.log(aim.om)
        const all = this.all;
        let filename = `docs/api/${objectname}.md`;
        console.log('doc', objectname);
        fs.readFile(filename, (err, data) => {
          if (err) throw err;
          const content = String(data);
          const index = ['**Table of contents**'];
          function addIndex(level, title, link){
            index.push(s = '                        '.slice(0,(level-1)*4) + `- [${title}](#${toLink(`${link}`)})`)
            // console.log(s);
          }
          const doc = [];
          var chapters = Object.fromEntries(content.split(/[#]+ /).map(c => [c.split(/\r|\n/)[0], c]));
          // console.log(chapters);
          (function docObj(name, obj, level) {
            // console.log(1, name, all.includes(obj));
            if (obj !== topobj && all.includes(obj)) return;
            all.push(obj);
            const h = '#########'.slice(0,level-1 );
            function chap(title) {
              doc.push(h + ` ${title}`);
              return chapters[title] ? chapters[title].split('<!-- body -->')[1] : '';
            }
            function getProperties(obj, name){
              const pd = Object.getOwnPropertyDescriptors(obj);
              const entries = Object.entries(pd).filter(([key,value]) => value.enumerable);
              if (entries.length) {
                entries.forEach(([propertyName, descriptor]) => {
                  if (descriptor.get || descriptor.set) {
                    chap((name ? name + '.' : '') + propertyName);
                  }
                  if ('value' in descriptor) {
                    docObj((name ? name + '.' : '') + propertyName, descriptor.value, level + 1);
                  }
                });
              }
            }
            if (typeof obj === 'function') {
              // getProperties(obj, name);
              var content = String(obj).replace(
                /\/\*.*?\*\//gs,''
              ).replace(
                /\/\/.*?(?=\n|$)/gs,''
              ).replace(/\r/,'').split(/\n/).filter(l => l.trim());
              // console.log(content);
              var header = content.shift();
              // console.log(header);
              var params = header.match(/\((.*)\)/)[1] || '';
              content.pop();
              var ident = content[0] && content[0][0] === ' ' ? content[0].match(/^ +/)[0].length : 0;
              content = content.map(s => s.slice(ident)).join('\n')
              var title = name.replace(/(.*?)\.prototype/, '$1()');
              if (Object.keys(obj).length) {
                addIndex(level, `${name}`, `${name}`);
                var body = chap(`${name}`);
                getProperties(obj, name);
              }

              if (obj.name.match(/^[A-Z]/)) {
                var body = chap(`${title}(${params})`);
                addIndex(level, `Class: ${title}()`, `${title}(${params})`);
                doc.push('type: constructor');
              } else {
                var body = chap(`${title}(${params})`);
                addIndex(level, `${title}()`, `${title}(${params})`);
                // doc.push('type: function');
              }
              if (body) {
                doc.push('<!-- body -->', body.trim());
              }
              if (obj.prototype) {
                getProperties(obj.prototype, obj.name.replace(/\w/, s => s.toLowerCase()));
              }
              // Object.getOwnPropertyDescriptors(obj).forEach(console.log);
              // Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(entry => docObj(name+'.'+entry[0], entry[1], level+1));
              // doc.push("```\n"+content+"\n```");
            } else if (Array.isArray(obj)) {
              addIndex(level, `Array: ${name}`, `${name}`);
              doc.push(h + ` ${name}`);
            } else if (typeof obj === 'object') {
              addIndex(level, `${name}`, `${name}`);
              var body = chap(`${name}`);
              getProperties(obj, name);
            } else {
              addIndex(level, `${name}`, `${name}`);
              doc.push(h + ` ${name}`);
              doc.push('type: ' + typeof obj);
              doc.push('value: ' + obj);
            }
          })(topobj.name, topobj, 1);
          fs.writeFile(filename, index.concat(doc).join('\n'), (err) => {
            fail(err);
            success();
          });
        });

      })
    },
    src(source) {
      const dest = source.replace(/src/, 'dist')
      fs.readFile(source, (err, data) => {
        console.log(source);
        if (err) throw err;
        // data = clean_code(String(data));
        fs.writeFile(dest, data = clean_code(String(data)), (err) => {
          if (err) throw err;
          fs.writeFile(dest.replace(/(\.\w+)$/,'.min$1'), minimize_code(data), (err) => {
            if (err) throw err;
            console.log(`saved ${dest}`);
            // doc(objectname);
          });
        });
      });
    },
  }

  function Api(url, options) {
    // console.warn(url);
    this.options = options || {};
    this.url = new URL(url, document.location);
  }
  Api.prototype = {
    query(selector, context){
      if (typeof selector === 'object') Object.entries(selector).forEach(entry => this.query(...entry))
      else this.url.searchParams.set(selector, context);
      return this;
    },
    headers(selector, context){
      if (typeof selector === 'object') Object.entries(selector).forEach(entry => this.headers(...entry))
      else this.options.headers[selector] = context;
      return this;
    },
    get(){
      return this.fetch();
    },
    post(data){
      this.input(data);
      this.options.method = 'POST';
      return this.fetch();
    },
    input(data){
      this.options.body = JSON.stringify(data);
      return this;
    },
    fetch(){
      return new Promise((resolve, reject) => {
        // console.log(111, this.url.toString(), this.options);
        fetch(this.url, this.options).then(resolve).catch(reject);
      })
    },
  }

  Object.assign(aim, {
    Client,
    Dist,
    Request,
    Server,
    UserAgentApplication,
    WebsocketClient,
    setConfig(configYaml) {
      console.log(configYaml);
      $(document.body).append($('pre').text(configYaml));
      return fetch('https://aliconnect.nl/api/aliconnect/config', {
        method: 'POST',
        body: configYaml,
      }).then(res => res.text().then(console.log));
    },
    markdown: Markdown,
    paths: {
      '/dist': {
        get: {
          operation() {
            console.log('DIST/GET')
          }
        },
      }
    },
    url: (url) => {
      return new Request(url);
    },
    urlToId,
    idToUrl,
    extend,
    fetch(url, options) {
      return (new Api(url, options)).fetch();
    },
    api(href, options){
      options = options || {};
      // const url = new URL(href, 'https://aliconnect.nl/api');
      // console.log(url.toString());
      const headers = options.headers = options.headers || {};
      headers.accept = headers.accept || 'application/json';
      href = (href[0] === '/' ? 'https://aliconnect.nl/api' : '') + href;
      // console.log(href);
      return new Api(href, options);
    },
    his: new His,
    log: () => {
      if (self.document && document.getElementById('console')) {
        aim('console').append(aim('div').text(...arguments))
      } else if (aim().statusElem) {
        aim().statusElem.text(...arguments);
      } else {
        console.msg(...arguments)
      }
      return arguments;
    },
    maps: () => new Promise((resolve) => {
      if (this.google) resolve (this.google.maps);
      else {
        $('script').parent(document.head)
        .src(`https://maps.googleapis.com/maps/api/js?key=${aim.config.maps.clientKey}&libraries=places`)
        .on('load', e => resolve(self.google.maps))
      }
    }),
  })
  Object.defineProperties(aim, {
    InteractionRequiredAuthError: { value: function () { } },
    config: { value: {
      listAttributes: 'header0,header1,header2,name,schemaPath,Master,Src,Class,Tagname,InheritedID,HasChildren,HasAttachements,State,Categories,CreatedDateTime,LastModifiedDateTime,LastVisitDateTime,StartDateTime,EndDateTime,FinishDateTime',
      trackLocalSessionTime: 5000, // timeout between tracking local cookie login session
      trackSessionTime: 30000, // timeout between tracking login session
      debug: 1,
      minMs: 60000,
      auth: {
        url: AUTHORIZATION_URL,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
        forceRefresh: false
      },
      clients: [],
      url: dmsUrl,
      app: {
        url: dmsOrigin,
      },
    } },
    const: { value: {
      prompt: {
        menu: {
          prompts: [
            // 'qrscan',
            'lang',
            // 'chat',
            // 'msg',
            // 'task',
            // 'shop',
            'config',
            'help',
          ]
        },
        config: {
          prompts: [
            // 'upload_datafile',
            // 'import_outlook_mail',
            // 'import_outlook_contact',
            // 'account_create',
            // 'account_domain',
            'account_config',
            // 'sitemap',
            // 'get_api_key',
            'get_aliconnector_key',
            'verwerkingsregister',
          ]
        },
      },
      languages: {
        ab:{iso:'Abkhazian', native:'аҧсуа бызшәа, аҧсшәа'},
        aa:{iso:'Afar', native:'Afaraf'},
        af:{iso:'Afrikaans', native:'Afrikaans'},
        ak:{iso:'Akan', native:'Akan'},
        sq:{iso:'Albanian', native:'Shqip'},
        am:{iso:'Amharic', native:'አማርኛ'},
        ar:{iso:'Arabic', native:'العربية'},
        an:{iso:'Aragonese', native:'aragonés'},
        hy:{iso:'Armenian', native:'Հայերեն'},
        as:{iso:'Assamese', native:'অসমীয়া'},
        av:{iso:'Avaric', native:'авар мацӀ, магӀарул мацӀ'},
        ae:{iso:'Avestan', native:'avesta'},
        ay:{iso:'Aymara', native:'aymar aru'},
        az:{iso:'Azerbaijani', native:'azərbaycan dili'},
        bm:{iso:'Bambara', native:'bamanankan'},
        ba:{iso:'Bashkir', native:'башҡорт теле'},
        eu:{iso:'Basque', native:'euskara, euskera'},
        be:{iso:'Belarusian', native:'беларуская мова'},
        bn:{iso:'Bengali', native:'বাংলা'},
        bh:{iso:'Bihari languages', native:'भोजपुरी'},
        bi:{iso:'Bislama', native:'Bislama'},
        bs:{iso:'Bosnian', native:'bosanski jezik'},
        br:{iso:'Breton', native:'brezhoneg'},
        bg:{iso:'Bulgarian', native:'български език'},
        my:{iso:'Burmese', native:'ဗမာစာ'},
        ca:{iso:'Catalan, Valencian', native:'català, valencià'},
        ch:{iso:'Chamorro', native:'Chamoru'},
        ce:{iso:'Chechen', native:'нохчийн мотт'},
        ny:{iso:'Chichewa, Chewa, Nyanja', native:'chiCheŵa, chinyanja'},
        zh:{iso:'Chinese', native:'中文 (Zhōngwén), 汉语, 漢語'},
        cv:{iso:'Chuvash', native:'чӑваш чӗлхи'},
        kw:{iso:'Cornish', native:'Kernewek'},
        co:{iso:'Corsican', native:'corsu, lingua corsa'},
        cr:{iso:'Cree', native:'ᓀᐦᐃᔭᐍᐏᐣ'},
        hr:{iso:'Croatian', native:'hrvatski jezik'},
        cs:{iso:'Czech', native:'čeština, český jazyk'},
        da:{iso:'Danish', native:'dansk'},
        dv:{iso:'Divehi, Dhivehi, Maldivian', native:'ދިވެހި'},
        nl:{iso:'Dutch, Flemish', native:'Nederlands, Vlaams'},
        dz:{iso:'Dzongkha', native:'རྫོང་ཁ'},
        en:{iso:'English', native:'English'},
        eo:{iso:'Esperanto', native:'Esperanto'},
        et:{iso:'Estonian', native:'eesti, eesti keel'},
        ee:{iso:'Ewe', native:'Eʋegbe'},
        fo:{iso:'Faroese', native:'føroyskt'},
        fj:{iso:'Fijian', native:'vosa Vakaviti'},
        fi:{iso:'Finnish', native:'suomi, suomen kieli'},
        fr:{iso:'French', native:'français, langue française'},
        ff:{iso:'Fulah', native:'Fulfulde, Pulaar, Pular'},
        gl:{iso:'Galician', native:'Galego'},
        ka:{iso:'Georgian', native:'ქართული'},
        de:{iso:'German', native:'Deutsch'},
        el:{iso:'Greek, Modern (1453-)', native:'ελληνικά'},
        gn:{iso:'Guarani', native:'Avañe\'ẽ'},
        gu:{iso:'Gujarati', native:'ગુજરાતી'},
        ht:{iso:'Haitian, Haitian Creole', native:'Kreyòl ayisyen'},
        ha:{iso:'Hausa', native:'(Hausa) هَوُسَ'},
        he:{iso:'Hebrew', native:'עברית'},
        hz:{iso:'Herero', native:'Otjiherero'},
        hi:{iso:'Hindi', native:'हिन्दी, हिंदी'},
        ho:{iso:'Hiri Motu', native:'Hiri Motu'},
        hu:{iso:'Hungarian', native:'magyar'},
        ia:{iso:'Interlingua (International Auxiliary Language Association)', native:'Interlingua'},
        id:{iso:'Indonesian', native:'Bahasa Indonesia'},
        ie:{iso:'Interlingue, Occidental', native:'(originally:) Occidental, (after WWII:) Interlingue'},
        ga:{iso:'Irish', native:'Gaeilge'},
        ig:{iso:'Igbo', native:'Asụsụ Igbo'},
        ik:{iso:'Inupiaq', native:'Iñupiaq, Iñupiatun'},
        io:{iso:'Ido', native:'Ido'},
        is:{iso:'Icelandic', native:'Íslenska'},
        it:{iso:'Italian', native:'Italiano'},
        iu:{iso:'Inuktitut', native:'ᐃᓄᒃᑎᑐᑦ'},
        ja:{iso:'Japanese', native:'日本語 (にほんご)'},
        jv:{iso:'Javanese', native:'ꦧꦱꦗꦮ, Basa Jawa'},
        kl:{iso:'Kalaallisut, Greenlandic', native:'kalaallisut, kalaallit oqaasii'},
        kn:{iso:'Kannada', native:'ಕನ್ನಡ'},
        kr:{iso:'Kanuri', native:'Kanuri'},
        ks:{iso:'Kashmiri', native:'कश्मीरी, كشميري‎'},
        kk:{iso:'Kazakh', native:'қазақ тілі'},
        km:{iso:'Central Khmer', native:'ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ'},
        ki:{iso:'Kikuyu, Gikuyu', native:'Gĩkũyũ'},
        rw:{iso:'Kinyarwanda', native:'Ikinyarwanda'},
        ky:{iso:'Kirghiz, Kyrgyz', native:'Кыргызча, Кыргыз тили'},
        kv:{iso:'Komi', native:'коми кыв'},
        kg:{iso:'Kongo', native:'Kikongo'},
        ko:{iso:'Korean', native:'한국어'},
        ku:{iso:'Kurdish', native:'Kurdî, کوردی‎'},
        kj:{iso:'Kuanyama, Kwanyama', native:'Kuanyama'},
        la:{iso:'Latin', native:'latine, lingua latina'},
        lb:{iso:'Luxembourgish, Letzeburgesch', native:'Lëtzebuergesch'},
        lg:{iso:'Ganda', native:'Luganda'},
        li:{iso:'Limburgan, Limburger, Limburgish', native:'Limburgs'},
        ln:{iso:'Lingala', native:'Lingála'},
        lo:{iso:'Lao', native:'ພາສາລາວ'},
        lt:{iso:'Lithuanian', native:'lietuvių kalba'},
        lu:{iso:'Luba-Katanga', native:'Kiluba'},
        lv:{iso:'Latvian', native:'latviešu valoda'},
        gv:{iso:'Manx', native:'Gaelg, Gailck'},
        mk:{iso:'Macedonian', native:'македонски јазик'},
        mg:{iso:'Malagasy', native:'fiteny malagasy'},
        ms:{iso:'Malay', native:'Bahasa Melayu, بهاس ملايو‎'},
        ml:{iso:'Malayalam', native:'മലയാളം'},
        mt:{iso:'Maltese', native:'Malti'},
        mi:{iso:'Maori', native:'te reo Māori'},
        mr:{iso:'Marathi', native:'मराठी'},
        mh:{iso:'Marshallese', native:'Kajin M̧ajeļ'},
        mn:{iso:'Mongolian', native:'Монгол хэл'},
        na:{iso:'Nauru', native:'Dorerin Naoero'},
        nv:{iso:'Navajo, Navaho', native:'Diné bizaad'},
        nd:{iso:'North Ndebele', native:'isiNdebele'},
        ne:{iso:'Nepali', native:'नेपाली'},
        ng:{iso:'Ndonga', native:'Owambo'},
        nb:{iso:'Norwegian Bokmål', native:'Norsk Bokmål'},
        nn:{iso:'Norwegian Nynorsk', native:'Norsk Nynorsk'},
        no:{iso:'Norwegian', native:'Norsk'},
        ii:{iso:'Sichuan Yi, Nuosu', native:'ꆈꌠ꒿ Nuosuhxop'},
        nr:{iso:'South Ndebele', native:'isiNdebele'},
        oc:{iso:'Occitan', native:'occitan, lenga d\'òc'},
        oj:{iso:'Ojibwa', native:'ᐊᓂᔑᓈᐯᒧᐎᓐ'},
        cu:{iso:'Church Slavic, Old Slavonic, Church Slavonic, Old Bulgarian, Old Church Slavonic', native:'ѩзыкъ словѣньскъ'},
        om:{iso:'Oromo', native:'Afaan Oromoo'},
        or:{iso:'Oriya', native:'ଓଡ଼ିଆ'},
        os:{iso:'Ossetian, Ossetic', native:'ирон æвзаг'},
        pa:{iso:'Punjabi, Panjabi', native:'ਪੰਜਾਬੀ, پنجابی‎'},
        pi:{iso:'Pali', native:'पालि, पाळि'},
        fa:{iso:'Persian', native:'فارسی'},
        pl:{iso:'Polish', native:'język polski, polszczyzna'},
        ps:{iso:'Pashto, Pushto', native:'پښتو'},
        pt:{iso:'Portuguese', native:'Português'},
        qu:{iso:'Quechua', native:'Runa Simi, Kichwa'},
        rm:{iso:'Romansh', native:'Rumantsch Grischun'},
        rn:{iso:'Rundi', native:'Ikirundi'},
        ro:{iso:'Romanian, Moldavian, Moldovan', native:'Română'},
        ru:{iso:'Russian', native:'русский'},
        sa:{iso:'Sanskrit', native:'संस्कृतम्'},
        sc:{iso:'Sardinian', native:'sardu'},
        sd:{iso:'Sindhi', native:'सिन्धी, سنڌي، سندھی‎'},
        se:{iso:'Northern Sami', native:'Davvisámegiella'},
        sm:{iso:'Samoan', native:'gagana fa\'a Samoa'},
        sg:{iso:'Sango', native:'yângâ tî sängö'},
        sr:{iso:'Serbian', native:'српски језик'},
        gd:{iso:'Gaelic, Scottish Gaelic', native:'Gàidhlig'},
        sn:{iso:'Shona', native:'chiShona'},
        si:{iso:'Sinhala, Sinhalese', native:'සිංහල'},
        sk:{iso:'Slovak', native:'Slovenčina, Slovenský Jazyk'},
        sl:{iso:'Slovenian', native:'Slovenski Jezik, Slovenščina'},
        so:{iso:'Somali', native:'Soomaaliga, af Soomaali'},
        st:{iso:'Southern Sotho', native:'Sesotho'},
        es:{iso:'Spanish, Castilian', native:'Español'},
        su:{iso:'Sundanese', native:'Basa Sunda'},
        sw:{iso:'Swahili', native:'Kiswahili'},
        ss:{iso:'Swati', native:'SiSwati'},
        sv:{iso:'Swedish', native:'Svenska'},
        ta:{iso:'Tamil', native:'தமிழ்'},
        te:{iso:'Telugu', native:'తెలుగు'},
        tg:{iso:'Tajik', native:'тоҷикӣ, toçikī, تاجیکی‎'},
        th:{iso:'Thai', native:'ไทย'},
        ti:{iso:'Tigrinya', native:'ትግርኛ'},
        bo:{iso:'Tibetan', native:'བོད་ཡིག'},
        tk:{iso:'Turkmen', native:'Türkmen, Түркмен'},
        tl:{iso:'Tagalog', native:'Wikang Tagalog'},
        tn:{iso:'Tswana', native:'Setswana'},
        to:{iso:'Tonga (Tonga Islands)', native:'Faka Tonga'},
        tr:{iso:'Turkish', native:'Türkçe'},
        ts:{iso:'Tsonga', native:'Xitsonga'},
        tt:{iso:'Tatar', native:'татар теле, tatar tele'},
        tw:{iso:'Twi', native:'Twi'},
        ty:{iso:'Tahitian', native:'Reo Tahiti'},
        ug:{iso:'Uighur, Uyghur', native:'ئۇيغۇرچە‎, Uyghurche'},
        uk:{iso:'Ukrainian', native:'Українська'},
        ur:{iso:'Urdu', native:'اردو'},
        uz:{iso:'Uzbek', native:'Oʻzbek, Ўзбек, أۇزبېك‎'},
        ve:{iso:'Venda', native:'Tshivenḓa'},
        vi:{iso:'Vietnamese', native:'Tiếng Việt'},
        vo:{iso:'Volapük', native:'Volapük'},
        wa:{iso:'Walloon', native:'Walon'},
        cy:{iso:'Welsh', native:'Cymraeg'},
        wo:{iso:'Wolof', native:'Wollof'},
        fy:{iso:'Western Frisian', native:'Frysk'},
        xh:{iso:'Xhosa', native:'isiXhosa'},
        yi:{iso:'Yiddish', native:'ייִדיש'},
        yo:{iso:'Yoruba', native:'Yorùbá'},
        za:{iso:'Zhuang, Chuang', native:'Saɯ cueŋƅ, Saw cuengh'},
        zu:{iso:'Zulu', native:'isiZulu'},
      },
    } },
    // extend: { value: },
    handleData1: { value: function handleData (data){
      return aim.promise( 'handle data', async resolve => {
        // console.debug('handleData');
        if (data.path){
          aim().url(data.path).setmethod(data.method).exec();
        }
        const body = data.body;
        if (body){
          const reindex = [];
          function handleData(data) {
            // console.debug('handleData', data);
            if (data.method === 'patch'){
              const body = data.body;
              const itemId = body.ID || data.ID;
              if (aim.his.map.has(itemId)) {
                const item = aim.his.map.get(itemId);
                if (body.Master) {
                  const parentID = body.Master.LinkID;
                  const index = body.Master.Data;
                  const parent = aim.his.map.get(parentID);
                  if (item) {
                    if (item.parent) {
                      if (item.parent !== parent && item.elemTreeLi) {
                        // DEBUG: MAX FOUT
                        // item.parent.items.splice(item.parent.items.indexOf(item), 1);
                        item.elemTreeLi.elem.remove();
                        reindex.push(item.parent);
                      }
                      // if (item.elemTreeLi) {
                      // }
                    }
                    // const master = [].concat(item.data.Master).shift();
                    // master.LinkID = parentID;
                    // master.Data = index;
                    if (parent && parent.items) {
                      if (!parent.items.includes(item)) {
                        // parent.items.push(item);
                      }
                      reindex.push(parent);
                    }
                  }
                }
                Object.entries(body).forEach(entry=>item.attr(...entry));
                item.refresh();
              }
            }
          }
          if (body.requests){
            body.requests.forEach(handleData)
          } else {
            handleData(data);
          }
          reindex.unique().forEach(parent => parent ? parent.reindex() : null);
        }
        resolve();
        //
        //
        //
        // // console.debug('handleRequest', req);
        // if (req.method && req.method.toLowerCase() === 'patch'){
        //   const [tag] = req.path.match(/\w+\(\d+\)/);
        //   const item = Item.get(tag);
        //   if (item){
        //     for (let [attributeName, value] of Object.entries(req.body)){
        //       if (item.properties[attributeName].setValue){
        //         item.properties[attributeName].setValue(value);
        //       }
        //       // console.debug(item, tag, attributeName, value, item.properties[attributeName]);
        //     }
        //   }
        // } else {//if (isModule){
        //   // isModule foorwaarde is opgenomen zodat bericht niet gaat rondzingen.
        //   for (var name in req){
        //     if (typeof aim[name] === 'function'){
        //       aim[name].apply(this, req[name]);
        //     }
        //   }
        //   try {
        //     console.error('DO FORWARD', isModule, req);
        //
        //     if (req.body){
        //       aim.handleAimItems(req.body);
        //     }
        //
        //
        //
        //
        //     aim.forward = req.forward;
        //     // aim().exec(req, res => {
        //     // 	res.id = req.id;
        //     // });
        //   } catch (err){
        //     console.error(err)
        //   }
        //   aim.forward = null;
        //   if (req.message_id && aim.WebsocketClient.requests[req.message_id]){
        //     aim.WebsocketClient.requests[req.message_id](req);
        //   }
        // }
        // aim().emit('message', req);
        // return;
        //
      });
    } },
    // his: { value: new His() },
    // importScript: { value: importScript, },
    object: { value: {
      isFile(ofile) {
        return (ofile.type || '').indexOf('image') != -1 || aim.string.isImgSrc(ofile.src)
      },
    },},
    promise: { value: function promise(selector, context) {
      const messageElem = aim.his.elem.statusbar ? aim('span').parent(aim.his.elem.statusbar.main).text(selector) : null;
      // aim().progress(1, 1);
      // const progressElem = aim.his.elem.statusbar.progress;
      // progressElem.elem.max += 1;
      // progressElem.elem.value = (progressElem.elem.value || 0) + 1;
      if (aim.LOGPROMISE) {
        console.debug(selector, 'start');
      }
      return new Promise( context ).then( result => {
        // aim().progress(-1, -1);
        if (messageElem) {
          messageElem.remove();
        }
        if (aim.LOGPROMISE) {
          console.debug(selector, 'end');
        }
        return result;
      }).catch( err => {
        // aim().progress(-1, -1);
        if (messageElem) {
          messageElem.text(selector, err).css('color','red');
        }
        // console.error('aaaaa', err, arguments);
        throw err;
      })
    },},
  });

  if (this.document) {
    this.$ = aim;
    this.aim = aim;
    const currentScript = document.currentScript;
    // console.warn(currentScript.src);
    const scriptPath = currentScript.src.replace(/\/js\/.*/, '');
    [...currentScript.attributes].forEach(attribute => aim.extend({config: minimist(['--'+attribute.name.replace(/^--/, ''), attribute.value])}));
    (new URLSearchParams(document.location.search)).forEach((value,key)=>aim.extend({config: minimist([key,value])}));

    $().on('load', e => {
      // $().url('/api/docs.php').post(JSON.stringify(defineClasses.classes, (k,v) => typeof v === 'function' ? String(v).replace(/\r/g,'') : v, 2)).then(console.error);
    })

  } else {
    fs = require('fs');
    atob = require('atob');
  }

  return aim;
}));
