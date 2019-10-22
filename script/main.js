window.onload = function () {
    //Working with inputs

    //Changing name, vacancy inputs
    let inputs = document.querySelectorAll('.js-name-input, .js-vacancy-input');
    inputs.forEach(item => {
        item.addEventListener('change', function (event) {
            let target = event.target;
            if (target.value.trim().length < 3) {
                this.value = "";
                showError("Can't be shorter than 3 symbols", this);
            }
        })
    })

    //Changing phone input
    numbersArray = ["+", "1", "2", "3", '4', '5', '6', '7', '8', '9', '0'];
    //Error if length <= 5, not starts with + and if contains not number
    document.querySelector('.js-phone-input').addEventListener('change', function (event) {
        let target = event.target;

        if (target.value[0] !== '+' || !onlyNubmers(target.value, numbersArray) || target.value.trim().length <= 5) {
            this.value = "";
            showError("Invalid phone number", this);
        }
    })

    //Showing error
    function showError(err, obj = m) {
        let errorHolder = document.querySelector('.js-error-holder');
        errorHolder.classList.toggle('error-holder_active');
        obj.classList.toggle(obj.classList[0] + '_active');
        errorHolder.textContent = err;

        //Sand after 3 seconds hide error message
        setTimeout(function () {
            errorHolder.classList.toggle('error-holder_active');
            obj.classList.toggle(obj.classList[0] + '_active');
        }, 3000);
    }

    //If phone number contains letters
    function onlyNubmers(str, substrings) {
        let onlyNumbers = true;
        for (let i = 0; i < str.length; i++) {
            if (!substrings.includes(str[i])) {
                onlyNumbers = false;
            }
        }
        if (!onlyNumbers)
            return false;
        return true;
    }




    //Press on submit button
    document.querySelector('.js-submit-btn').addEventListener('click', () => {

        let contact = new Object();
        let nameInput = document.querySelector('.js-name-input');
        let vacancyInput = document.querySelector('.js-vacancy-input');
        let phoneInput = document.querySelector('.js-phone-input');

        let nameI = nameInput.value.trim();
        let vacancyI = vacancyInput.value.trim();
        let phoneI = phoneInput.value.trim();

        if (nameI != '' && vacancyI != '' && phoneI != "") {
            contact.name = nameI;
            contact.vacancy = vacancyI;
            contact.phone = phoneI;
            let firstLetter = nameI[0].toLowerCase();

            addToTable(contact, firstLetter);

        } else {
            showError('Empty input'); //Show error

            //If any input is empty, he will be active
            if (nameI == '')
                nameInput.classList.add(nameInput.classList[0] + '_active');
            if (vacancyI == '')
                vacancyInput.classList.add(vacancyInput.classList[0] + '_active');
            if (phoneI == '')
                phoneInput.classList.add(phoneInput.classList[0] + '_active');

            setTimeout(function () {
                nameInput.classList.remove(nameInput.classList[0] + '_active');
                vacancyInput.classList.remove(vacancyInput.classList[0] + '_active');
                phoneInput.classList.remove(phoneInput.classList[0] + '_active');
            }, 3000);
        }

    });

    //Add contact to list
    let contactSet = new Set();
    let letterContactsObj = {};

    function addToTable(contact, firstLetter) {
        let notEquals = true;

        //Set of all elements of contact list
        for (let contactE of contactSet.keys()) {
            if (contactE.name == contact.name && contactE.vacancy == contact.vacancy && contactE.phone == contact.phone) {
                notEquals = false;
            }
        }

        if (notEquals) {
            contactSet.add(contact);
            //If object hasn't this property, creating array at this property
            if (!letterContactsObj.hasOwnProperty(firstLetter)) {
                letterContactsObj[firstLetter] = new Array();
            }
            letterContactsObj[firstLetter].push(contact);
            changeCounter(firstLetter);
            addInfoToLetter(firstLetter, contact);
        }
        console.log(letterContactsObj);
    }


    function changeCounter(firstLetter) {
        //If div hasn't span - creating it
        let hasSpan = false;
        let letter = document.querySelector('.js-column-letter#' + firstLetter);
        for (let i = 0; i < letter.children.length; i++) {
            if (letter.children[i].tagName == 'SPAN') {
                hasSpan = true;
                break;
            }
        }

        if (!hasSpan) {
            let span = document.createElement('span');
            span.className = 'letter__couner';
            span.textContent = '0';
            letter.appendChild(span);

        }
        letter.children[0].textContent++;
    }



    function addInfoToLetter(firstLetter, contact) {
        let callCounter = 0;

        let letter = document.querySelector('.js-column-letter#' + firstLetter);
        let div = document.createElement('div');
        div.className = 'letter__info';
        div.innerText = `Name: ${contact.name} \nVacancy: ${contact.vacancy}\nPhone: ${contact.phone}\n`;
        letter.after(div);
    }


    //Show elements info
    let tableElements = document.querySelectorAll('.js-column-letter');

    tableElements.forEach(function (item) {
        item.addEventListener('click', function (event) {
            let children = event.target.parentNode.children;
                        
            for (let i = 1; i < children.length; i++) {
                children[i].classList.toggle('.letter__info_active');
                console.log(children[i]);
            }
        });
    });





    //Click on table element


};