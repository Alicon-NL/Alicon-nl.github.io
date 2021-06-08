
function dofind(e) {
    //e.preventDefault();

    var xhr = new XMLHttpRequest();
    var params = new FormData();
    var c=document.getElementById('findform').getElementsByTagName('input');
    for (var i = 0, e; e = c[i]; i++) params.append(e.name, e.value);
    xhr.onload = function (e) {
        //console.log(xhr.responseText);
        var data = JSON.parse(xhr.responseText);

        var result= document.getElementById('result');
        with (result) {
            innerHTML = '';
            for (var i = 0, d; d = data[i]; i++) {
                if (result.innerHTML=='') {
                    with (appendChild(document.createElement('tr'))) {
                        for (var fieldname in d) {
                            with (appendChild(document.createElement('th'))) {
                                innerHTML=fieldname;
                            }
                        }
                    }
                }
                with (appendChild(document.createElement('tr'))) {
                    for (fieldname in d) {
                        with (appendChild(document.createElement('td'))) {
                            innerHTML = d[fieldname];
                        }
                    }
                }
            }
        }
    }

    xhr.open("POST", "admin.php", true);
    xhr.send(params);
    return false;
}