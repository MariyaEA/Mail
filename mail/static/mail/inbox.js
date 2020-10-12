document.addEventListener('DOMContentLoaded', function () {
    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);
    document.querySelector('#read-archive').addEventListener('click', function () {
        markasarchive(this.dataset.email, this.dataset.archived);
    });
    document.querySelector('#read-response').addEventListener('click', function () {
        respond(this.dataset.email);
    });
    document.querySelector('#compose-formcreating').onsubmit = submission;
    // By default, load the inbox
    load_mailbox('inbox');
});

function load_mailbox(mailbox) {
    const readcolor='list-group-item-secondary';
    const unreadcolor = 'list-group-item list-group-item-action ';
    fetch(`/emails/${mailbox}`)
        .then(response => {
            if (!response.ok) {
                throw Error(response.status + ' - ' + response.statusText);
            }
            return response.json();
        })
        .then(messages => {
            const feature = document.querySelector('#section-emails');
            feature.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
            sectionview('section-emails');
            if (messages.length === 0)
                return feature.innerHTML += '<h3>No Emails Found.</h3>';
            messages.forEach(function (email) {
                const groupelement = document.createElement('a');
                groupelement.addEventListener('click', () => {
                    read_email(email.id, (mailbox === 'sent'));
                });
                groupelement.className = unreadcolor + (email.read ? readcolor : '');
                groupelement.href='#';
                let messagebody=(mailbox!=='sent' ? `<b>From:</b> ${email.sender} ` : '');                
                messagebody+=`<span style="float: right" class="badge badge-light badge-pill">${email.timestamp}</span> <br/>`;
                messagebody+=(mailbox!=='inbox' ? `<br>To:</br> ${email.recipients} <br/>` : '');
                messagebody+=`<b>Subject:</b>` + (email.subject ? email.subject : ` (No Subject)`) ;
                groupelement.innerHTML = messagebody;
                feature.append(groupelement);
            })
        }).catch(errors => {
        erroritems(errors);
    });
}

function compose_email() {
    sectionview('section-compose');
    document.querySelectorAll(`[id*="field-"]`).forEach((item) => {
        item.value = '';
        item.className = 'field-control';
    })
}

function markasarchive(mailid, archived) {
    updatearchive(mailid, true, !(archived === 'true'), () => {
        load_mailbox('inbox');
    });
}


function respond(mailid) {
    get_email(mailid, (email) => {
        const mailcontents = {sender: 'field-recipients', subject: 'field-subject', body: 'field-body'}
        for (const key in mailcontents) {
            if (key === 'subject')
                email[key] = (email.subject.startsWith('Re: ') ? email.subject : "Re: " + email.subject);
            if (key === 'body')
                email[key] = `\n===========\nOn ${email.timestamp} ${email.sender} wrote:`
                    + ` \n${email.body}`;
            const formcontent = document.querySelector(`#${mailcontents[key]}`);
            formcontent.value = email[key];
            formcontent.className = 'field-control';
        }
        document.querySelector('#compose-title').innerHTML = `<h3>Reply to the Email</h3>`;
        sectionview('section-compose');
    });
}

function get_email(mailid, response1) {
    fetch(`/emails/${mailid}`)
        .then(response => {
            if (!response.ok) {
                throw Error(response.status + ' - ' + response.statusText);
            }
            return response.json();
        })
        .then(email => {
            return response1(email);
        })
        .catch(errors => {
            erroritems(errors);
        })
}

function updatearchive(mailid, read = true, archived = false, response1) {
    fetch(`/emails/${mailid}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: archived,
            read: read
        })
    }).then(response => {
        if (!response.ok) {
            throw Error(response.status + ' - ' + response.statusText);
        }
        if (response1) response1();
        return true;
    }).catch(errors => {
        erroritems(errors);
    })
}

function read_email(mailid, hide_archive = false) {
    get_email(mailid, (email) => {
        const mailcontents = ['sender', 'recipients', 'timestamp', 'subject', 'body'];
        mailcontents.forEach((key) => {
            document.querySelector(`#${key}`).innerText =
                (email[key] ? email[key] : `(No ` + key.charAt(0).toUpperCase() + key.slice(1) + ')');
        });
        document.querySelectorAll(`[id*="read-"]`).forEach((item) => {
            item.dataset.email = email.id;
            if (item.id === 'read-archive') {
                if (hide_archive) {
                    item.style.display = 'none';
                } else {
                    item.textContent = (email.archived ? 'Un-Archive' : 'Archive');
                    item.dataset.archived = email.archived;
                    item.style.display = 'block';
                }
            }
        });

        if (!email.read)
            updatearchive(email.id, true, email.archived);
        sectionview('section-readview');
    })
}

function erroritems(errors) {
    document.querySelector('#section-errormessage').innerHTML = `<h1>A Problem Occurred.</h1><p>${errors.message}</p>`;
    sectionview('section-errormessage');
    console.log(errors);
}

function submission() {
    const typedrecipients = document.querySelector('#field-recipients');
    let form_valid = function () {
        if (!typedrecipients.value) {
            typedrecipients.className = 'field-control is-invalid';
            return false;
        }
        typedrecipients.className = 'field-control is-valid';
        return true;
    }
    if (form_valid()) {
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: typedrecipients.value,
                subject: document.querySelector('#field-subject').value,
                body: document.querySelector('#field-body').value,
                read: false,
                archived: false
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    document.querySelector('#alertrecip').textContent = result.error;
                    document.querySelector('#field-recipients').className = 'field-control is-invalid';
                } else {
                    load_mailbox('sent');
                }
            }).catch(errors => {
            erroritems(errors);
        });
    }
    return false;
}

function sectionview(divview) {
    document.querySelectorAll(`[id*="section-"]`).forEach((item) => {
        item.style.display = (divview === item.id ? 'block' : 'none');
    })
    document.body.scrollTop;
}
