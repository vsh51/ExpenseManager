$('#picker').datetimepicker({
    format:'Y-m-d H:i',
    formatTime:'H:i',
    formatDate:'Y-m-d',
    step: 5
});

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

function delete_transaction(id) {
    const endpoint = `/delete/${id}`;
    fetch(endpoint, {
        method: 'DELETE',  
    })
    .then((response) => {
        response.json().then((response_obj) => {
            if (response_obj.state === 'success') {
                appendAlert('Transaction deleted successfully!', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        });
    })
}

let form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
})

function edit_transaction_view(id) {
    fetch(`/get_transaction/${id}`, {
        method: 'GET'
    })
    .then((response) => {
        response.json()
        .then((final_response) => {
            var rend = final_response.body;
            let form = document.querySelector('form');

            document.querySelector('.modal-title').innerHTML = 'Edit a record';
            document.querySelector('.modal-footer .btn').innerHTML = 'Edit';

            var amount = document.querySelector('input#amount');
            var type = document.querySelector(`input#${rend.type}`);
            var category = document.querySelector(`#categ_list`);
            var category_options = document.querySelectorAll(`option`);
            
            amount.value = rend.amount;
            type.checked = true;

            if (final_response.category_title) {
                for (let option_index = 0; option_index < category_options.length; option_index++) {
                    if (category_options[option_index].innerHTML === final_response.category_title) {
                        category.options.selectedIndex = option_index;
                        break;
                    };
                }
            }


            var date = new Date(rend.datetime);
            let year = date.getFullYear();
            let month = (date.getUTCMonth() + 1 < 10) ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth();
            let day = (date.getUTCDate() < 10) ? '0' + (date.getUTCDate()) : date.getUTCDate();
            let hours = (date.getUTCHours() < 10) ? '0' + (date.getUTCHours()) : date.getUTCHours();
            let minutes = (date.getUTCMinutes() < 10) ? '0' + (date.getUTCMinutes()) : date.getUTCMinutes();
            document.querySelector('input#picker').value = `${year}-${month}-${day} ${hours}:${minutes}`;

            document.querySelector('.btn-modal-submit').setAttribute('onclick', `edit_transaction('${id}')`)
        })
    })
}

function edit_transaction (id) {
    let form = document.querySelector('form');

    var myFormData = new FormData(form);
    var formDataObj = Object.fromEntries(myFormData.entries());

    fetch(`/edit_transaction/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then((response) => {
        response.json()
        .then((rend) => {
            $('.modal').modal('hide');
            if (rend.state === 'success') {
                setTimeout(() => {
                    appendAlert('Transaction updated successfully!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }, 1000);
            }
        })
    })
}

function create_transaction_view() {
    let form = document.querySelector('form');
    document.querySelector('.modal-title').innerHTML = 'Create a record';
    document.querySelector('.modal-footer .btn').innerHTML = 'Create';
    
    document.querySelector('input#amount').value = "";
    document.querySelector(`input#income`).checked = true;
    document.querySelector(`#categ_list`).options.selectedIndex = 0;
    document.querySelector('input#picker').value = "";

    document.querySelector('.btn-modal-submit').setAttribute('onclick', `create_transaction()`)
}

function create_transaction() {
    let form = document.querySelector('form');
    var formData = new FormData(form);
    var formDataObj = Object.fromEntries(formData.entries());

    fetch(`/create_transaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then((response) => {
        response.json()
        .then((rend) => {
            $('.modal').modal('hide');
            if (rend.state === 'success') {
                setTimeout(() => {
                    appendAlert('Transaction created successfully!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }, 1000);
            }
        })
    })
}

function sortTransactions(func, transformation) {
    var days = document.querySelectorAll('.day');
    for (let day_id = 0; day_id < days.length; ++day_id) {
        var day2sort = days[day_id].querySelectorAll('.transaction');
        day2sort = Array.prototype.slice.call(day2sort, 0);

        day2sort.sort((a, b) => {
            var elem1 = transformation(a);
            var elem2 = transformation(b);
            return func(elem1, elem2);
        })

        days[day_id].querySelectorAll('.transaction').innerHtml = "";
        for (let i = 0; i < day2sort.length; ++i) {
            days[day_id].appendChild(day2sort[i]);
        }
    }
}

var baa = document.querySelector('#baa');
var bad = document.querySelector('#bad');
var bta = document.querySelector('#bta');
var btd = document.querySelector('#btd');

function removeAllActive() {
    baa.classList.remove("active");
    bad.classList.remove("active");
    bta.classList.remove("active");
    btd.classList.remove("active");
}

baa.addEventListener('click', (e) => {
    removeAllActive();
    baa.classList.add("active");
    sortTransactions(
    (e1, e2) => {
        return (e1 > e2) ? 1 : -1;
    },
    (elem) => {
        return Number(elem.querySelector('.amount').innerHTML.replace("$ ", ''));
    });

    $('.dropdown-toggle').hover(function(){ 
        $('.dropdown-toggle', this).trigger('click'); 
    });
});

bad.addEventListener('click', (e) => {
    removeAllActive();
    bad.classList.add("active");
    sortTransactions(
    (e1, e2) => {
        return (e1 < e2) ? 1 : -1;
    },
    (elem) => {
        return Number(elem.querySelector('.amount').innerHTML.replace("$ ", ''));
    });

    $('.dropdown-toggle').hover(function(){ 
        $('.dropdown-toggle', this).trigger('click'); 
    });
});

bta.addEventListener('click', (e) => {
    removeAllActive();
    bta.classList.add("active");
    sortTransactions(
    (e1, e2) => {
        return (e1 > e2) ? 1 : -1;
    },
    (elem) => {
        return elem.querySelector('.time').innerHTML;
    });

    $('.dropdown-toggle').hover(function(){ 
        $('.dropdown-toggle', this).trigger('click'); 
    });
});

btd.addEventListener('click', (e) => {
    removeAllActive();
    btd.classList.add("active");
    sortTransactions(
    (e1, e2) => {
        return (e1 < e2) ? 1 : -1;
    },
    (elem) => {
        return elem.querySelector('.time').innerHTML;
    });

    $('.dropdown-toggle').hover(function(){ 
        $('.dropdown-toggle', this).trigger('click'); 
    });
});

var pagination = document.querySelector('.pagination');
var pgl1 = pagination.querySelector('#pgl1');
var pgl2 = pagination.querySelector('#pgl2');
var pgl3 = pagination.querySelector('#pgl3');
var pgl4 = pagination.querySelector('#pgl4');
var pgl5 = pagination.querySelector('#pgl5');

pgl2.innerHTML = location.href.substring(location.href.lastIndexOf('/') + 1);
const path = location.pathname.substr(0, location.pathname.lastIndexOf('/')) + '/';

pgl2.href = location.href;
pgl2.classList.add("disabled");

fetch(`${path}${Number(pgl2.innerHTML) - 1}`, {method: 'GET'})
.then((response) => {
    if (response.status == 404) {
        pgl1.classList.add("disabled");
    }
    else {
        pgl1.href = `${path}${pgl2.innerHTML - 1}`;
    }
})

fetch(`${path}${Number(pgl2.innerHTML) + 1}`, {method: 'GET'})
.then((response) => {
    if (response.status == 404) {
        pgl3.classList.add("disabled");
        pgl5.classList.add("disabled");
    }
    else {
        pgl3.href = `${path}${Number(pgl2.innerHTML) + 1}`;
        pgl5.href = `${path}${Number(pgl2.innerHTML) + 1}`;
    }
    pgl3.innerHTML = Number(pgl2.innerHTML) + 1;
})

fetch(`${path}${Number(pgl2.innerHTML) + 2}`, {method: 'GET'})
.then((response) => {
    if (response.status == 404) {
        pgl4.classList.add("disabled");   
    }
    else {
        pgl4.href = `${path}${Number(pgl2.innerHTML) + 2}`;
    }
    pgl4.innerHTML = Number(pgl2.innerHTML) + 2;

})