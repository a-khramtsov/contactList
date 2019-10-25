window.onload = function () {
    //Press on submit button: getting input's values and creating object with fields name, vacancy, phone
    document.querySelector('.js-submit-btn').addEventListener('click', () => {
        let contact = new Object();
        let nameInput = document.querySelector('.js-name-input');
        let vacancyInput = document.querySelector('.js-vacancy-input');
        let phoneInput = document.querySelector('.js-phone-input');

        //If all inputs not empty, creating new object, else - printing error ang highlights incorrect inputs 
        if (checkInput(nameInput) && checkInput(vacancyInput) && checkInput(phoneInput)) {            
            contact.name = nameInput.value.trim();
            contact.vacancy = vacancyInput.value.trim();
            contact.phone = phoneInput.value.trim();

            //getting first letter of name - will be key of object array - adding to table, list
            let firstLetter = nameInput.value.trim()[0].toLowerCase();
            addToTable(contact, firstLetter);
        } else
            showErrorBlock('Error');
    });

    function checkInput(input) {              
        let inputValue = input.value.trim().toLowerCase();
        let regLetters = /[a-zа-я ]/gmi;
        let regNumbers = /[0-9+]/gmi; 


        if (input.className.includes('js-phone-input')) {
            if (inputValue.length <= 5)
                showErrorInput("Can't be shorter than 5 symbols", input);
            else if (inputValue.length > 30)
                showErrorInput("Can't be longer than 30 symbols", input);
            else if (inputValue[0] !== '+' || !regNumbers.test(inputValue))
                showErrorInput("Invalid phone number", input);

            if (inputValue.length <= 5 || inputValue.length > 30 || inputValue[0] !== '+' || !regNumbers.test(inputValue))
                return false;
        } else {
            if (inputValue.length < 3)
                showErrorInput("Can't be shorter than 3 symbols", input);
            else if (inputValue.length > 20)
                showErrorInput("Can't be longer than 20 symbols", input);
            else if (!regLetters.test(inputValue))
                showErrorInput("Invalid value", input);

            if (inputValue.length < 3 || inputValue.length > 20 || !regLetters.test(inputValue))
                return false;
        }
        return true;
    }

    //Arguments: error text and object, which class will be toggled to active
    function showErrorInput(errText, obj = z1) {
        obj.classList.toggle(obj.classList[0] + '_active');
        let tempPlaceHolder = obj.getAttribute('placeholder');
        obj.value = "";
        obj.setAttribute('placeholder', errText);


        //Sand after 3 seconds hide error message
        setTimeout(function () {
            obj.classList.toggle(obj.classList[0] + '_active');
            obj.setAttribute('placeholder', tempPlaceHolder);

        }, 3000);
    }

    function showErrorBlock(errorText) {
        let error = document.querySelector('.js-error');
        error.classList.toggle('error_active');
        error.textContent = errorText;
        setTimeout(function () {
            error.classList.toggle('error_active');
        }, 3000);
    }
    
    





    //Add contact to list and table: adding to HTML table general SET list array of objects
    //(like {a: [0: {name: "Andrew", vacancy: "Prgrammer", phone: "+213123"}], b: [{name: "BAndrew", vacancy: "Prgrammer", phone: "+2131232"}}]})
    let contactSet = new Set();
    let letterContactsObj = {};

    function addToTable(contact, firstLetter) {
        let notEquals = true;
        //Set list of all elements of contact list
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
        } else {
            showErrorBlock("Contact List can't contain 2 equals contacts");
        }
    }

    //Change counter of 
    function changeCounter(firstLetter) {
        //If div hasn't span - creating it
        let hasSpan = false;
        let letter = document.querySelector('.js-column-letter[data-id=' + firstLetter + ']');
        for (let i = 0; i < letter.children.length; i++) {
            if (letter.children[i].tagName == 'SPAN') {
                hasSpan = true;
                break;
            }
        }

        if (!hasSpan) {
            let span = document.createElement('span');
            span.className = 'letter__couner letter__couner_active';
            span.textContent = '0';
            letter.appendChild(span);

            letter.classList.add('element__letter_active');
        }
        letter.children[0].textContent++;
    }


    //Adding block with info about contact to letter when 
    function addInfoToLetter(firstLetter, contact) {
        let letter = document.querySelector('.js-column-letter[data-id=' + firstLetter + ']');
        let letterInfo = letter.parentNode.querySelector('.js-letter-info');
        //Create and add contact's info to page
        for (let i = 1; i < letter.parentNode.children.length; i++) {
            letterInfo.classList.remove('letter__info_active');
        }
        let div = document.createElement('div');
        div.className = 'letter__info js-letter-info';
        div.innerText = `Name: ${contact.name}\n  Vacancy: ${contact.vacancy}\n  Phone: ${contact.phone}\n`;

        //Create and add window close symbol (button)
        let closeWindow = document.createElement('i');
        closeWindow.className = 'fa fa-window-close js-close';
        closeWindow.setAttribute('aria-hidden', true);
        letter.after(div);

        div.appendChild(closeWindow);
    }


    //Show elements info when click on letter element
    let tableElements = document.querySelectorAll('.js-column-letter');
    tableElements.forEach(function (item) {
        item.addEventListener('click', function (event) {
            let children = event.target.parentNode.children;

            for (let i = 1; i < children.length; i++) {

                children[i].classList.toggle('letter__info_active');
                //Adding for evert contact delete function               
                let delBtn = children[i].querySelector('.js-close');
                delBtn.addEventListener('click', function () {
                    deleteElement(delBtn.parentNode);
                });
            }
        });
    });


    //Deleting element - removing form general SET, array of objects, HTML table, reducting contact couner(if counter = 0 - removing span)
    function deleteElement(element) {       
        removeFromGeneralSet (element);              
        removeFromObjectArray(element);        
        spanReduciton(element);       
        element.remove();
    }


    function removeFromGeneralSet (element) {
        let delObj = textToObject(element.textContent);
        for (let contactSetElem of contactSet.keys()) {
            if (contactSetElem.name == delObj.name && contactSetElem.vacancy == delObj.vacancy && contactSetElem.phone == delObj.phone) {
                contactSet.delete(contactSetElem);
            }
        }
    }

    function removeFromObjectArray(element) {
        let delObj = textToObject(element.textContent);
        let firstLetter = element.parentNode.children[0].getAttribute('data-id');
        let letterContactsArray = letterContactsObj[firstLetter];

        for (let i = 0; i < letterContactsArray.length; i++) {
            if (letterContactsArray[i].name == delObj.name && letterContactsArray[i].vacancy == delObj.vacancy && letterContactsArray[i].phone == delObj.phone) {
                let index = i;
                letterContactsArray.splice(index, 1);
                break;
            }
        }
        letterContactsObj[firstLetter] = letterContactsArray;
    }

    function spanReduciton(element) {
        let span = element.parentNode.firstChild.querySelector('span');
        let elementLetter = element.parentNode.querySelector('.js-column-letter');
        span.textContent--;

        if (span.textContent == 0) {
            span.remove();
            elementLetter.classList.toggle('element__letter_active');
        }
    }

    //Converting HTML text to contact object (using for getting object of delete)
    function textToObject(text) {
        let delObj = {};
        let contactFullElements = text.split('  ');
        let contactElements = [];
        for (let contact of contactFullElements) {
            let contactEls = contact.split(':');
            contactElements.push(contactEls[1]);
        }

        delObj.name = contactElements[0].trim();
        delObj.vacancy = contactElements[1].trim();
        delObj.phone = contactElements[2].trim();
        return delObj;
    }

    //Press on Clear List button - deleting all general set and array of object
    document.querySelector('.js-clear-btn').addEventListener('click', function () {
        let lettersInfo = document.querySelectorAll('.js-letter-info');

        for (let element of lettersInfo) {
            deleteElement(element);
        }
    });
};