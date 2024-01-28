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

const add_category = document.querySelector('#add-category');
add_category.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.disabled = true;

    const formData = new FormData(add_category);
    const formDataObj = Object.fromEntries(formData.entries());

    fetch('/settings/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then((response) => {
        response.json()
        .then((result) => {
            if (result.status === "saved") {
                appendAlert('Category created!', 'success');
            }
            else {
                appendAlert('Failed to create category', 'danger');
            }
            setTimeout(() => {
                    location.reload();
                }, 2000);
        })
    })
})

fetch('/settings/get_categories_by_session_user', { method: 'GET' })
.then((response) => {
    response.json()
    .then((result) => {
        const parrents = document.querySelectorAll('.form-select');
        for (parrent_id = 0; parrent_id < parrents.length; ++parrent_id) {
            for (let i = 0; i < result.length; ++i) {
                const child = document.createElement('option');
                child.value = result[i]._id;
                child.innerHTML = result[i].title;
                parrents[parrent_id].appendChild(child);
            }
        }
    })
})

const delete_category = document.querySelector('.delete-category');
delete_category.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.disabled = true;

    const formData = new FormData(delete_category);
    const formDataObj = Object.fromEntries(formData.entries());

    fetch('/settings/delete_category', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then((response) => {
        response.json()
        .then((result) => {
            if (result.status === "deleted") {
                appendAlert('Category deleted successfully', 'success');
            }
            else {
                appendAlert('Failed to delete', 'danger');
            }
            setTimeout(() => {
                    location.reload();
            }, 2000);
        })
    })
})

const rename_category = document.querySelector('#rename_category');
rename_category.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.disabled = true;

    const formData = new FormData(rename_category);
    const formDataObj = Object.fromEntries(formData.entries());
    fetch('/settings/rename_category', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then((response) => {
        response.json()
        .then((result) => {
            if (result.status === "updated") {
                appendAlert('Category changed successfully', 'success');
            }
            else {
                appendAlert('Failed to update', 'danger');
            }
            setTimeout(() => {
                    location.reload();
            }, 2000);
        })
    })
})