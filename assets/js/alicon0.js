aim.libraries.edit = e => {

  aim.Elem.prototype.printpdf = function() {
    console.log('PRINT');
    fetch("pdf.php", {
      method: 'post',
      body: `
      <style>
      .pagenum:before {
        content: counter(page);
      }
      @page {
        margin: 100px 25px;
      }

      header {
        position: fixed;
        top: -60px;
        left: 0px;
        right: 0px;
        height: 50px;

        /** Extra personal styles **/
        background-color: #03a9f4;
        color: white;
        text-align: center;
        line-height: 35px;
      }

      footer {
        position: fixed;
        bottom: -60px;
        left: 0px;
        right: 0px;
        height: 50px;

        /** Extra personal styles **/
        background-color: #03a9f4;
        color: white;
        text-align: center;
        line-height: 35px;
      }
      </style>
      <body>
      <!-- Define header and footer blocks before your content -->
      <header>
      Our Code World
      </header>

      <footer>
      <span class="pagenum"></span>
      Copyright &copy; <?php echo date("Y");?>
      </footer>

      <!-- Wrap the content of your PDF inside a main tag -->
      <main>
      <p style="page-break-after: always;">
      Content Page 1ssss
      </p>
      <p style="page-break-after: never;">
      Content Page 2
      </p>
      </main>
      <div style="position:absolute;bottom:0;">LAST</div>
      </body>
      `,
      // headers: new Headers({
      //   "Authorization": "Bearer " + token
      // })
    })
    .then(response => response.blob())
    .then(blob => {
      var data_url = URL.createObjectURL(blob);
      const iframe = document.querySelector('iframe');
      iframe.src = data_url;
      iframe.onload = e => iframe.contentWindow.print();
    });
  }

  $('div').append(
    $('div').text('JA')
  ).printpdf();
  return;

  return;
  $().url('pdf.php')
  .input('HOI')
  .post()
  .then(e => {
    console.log(e.body);
  })

  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'pdf.php');
  xhr.onreadystatechange = handler;
  xhr.responseType = 'blob';
  // xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  xhr.send();

  function handler() {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        // this.response is a Blob, because we set responseType above
        var data_url = URL.createObjectURL(this.response);
        const iframe = document.querySelector('iframe');
        iframe.src = data_url;
        iframe.onload = e => iframe.contentWindow.print();

      } else {
        console.error('no pdf :(');
      }
    }
  }

  return;
  const searchPramas = new URLSearchParams(document.location.search);
  if (searchPramas.has('edit-src')) {
    const editSrc = searchPramas.get('edit-src');
    let to;
    $().url(editSrc + '.html').get().then(e => {
      console.log(e.body)
      const editElem = $('div').html(e.body).parent(document.body).contenteditable(true).style('padding:20px;border:solid 1px red;').on('keyup', e => {
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
