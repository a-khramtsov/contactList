window.onload = function () {

    //Working with inputs
    // let letterArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
    //Changing name, vacancy inputs    
    let inputs = document.querySelectorAll('.js-name-input, .js-vacancy-input');
    inputs.forEach(item => {
        item.addEventListener('change', function (event) {
            let target = event.target;
            if (target.value.trim().length < 3) {
                showError("Can't be shorter than 3 symbols", this);
            } else if (target.value.trim().length > 20) {
                showError("Can't be longer than 20 symbols", this);
            } 
            // else if (!onlyAllowedLetters(target.value.toLowerCase(), letterArray)) {
                // showError("Invalid value", this);
            // }

        });
    });

    //Changing phone input
    let numbersArray = ["+", "1", "2", "3", '4', '5', '6', '7', '8', '9', '0'];
    document.querySelector('.js-phone-input').addEventListener('change', function (event) {
        let target = event.target;
        //Showing error if length <= 5, not starts with + and if contains not number
        if (target.value[0] !== '+' || !onlyAllowedLetters(target.value, numbersArray)) {
            showError("Invalid phone number", this);
        } else if (target.value.trim().length <= 5) {
            showError("Can't be shorter than 3 symbols", this);
        } else if (target.value.trim().length > 30) {
            showError("Can't be longer than 30 symbols", this);
        }
    });

    //Showing error
    //Arguments: error text and object, which class will be toggled to active
    function showError(err, obj = z1) {
        let errorHolder = document.querySelector('.js-error-holder');
        errorHolder.classList.toggle('error-holder_active');
        obj.classList.toggle(obj.classList[0] + '_active');
        obj.value = "";
        errorHolder.textContent = err;

        //Sand after 3 seconds hide error message
        setTimeout(function () {
            errorHolder.classList.toggle('error-holder_active');
            obj.classList.toggle(obj.classList[0] + '_active');
        }, 3000);
    }

    //Function to check if a string contains invalid elements
    //Arguments: string and array of valid letters
    function onlyAllowedLetters(str, substrings) {
        let onlyAllowed = true;
        for (let i = 0; i < str.length; i++) {
            if (!substrings.includes(str[i])) {
                onlyAllowed = false;
            }
        }
        if (!onlyAllowed)
            return false;
        return true;
    }

    //Press on submit button: getting input's values and creating object with fields name, vacancy, phone
    document.querySelector('.js-submit-btn').addEventListener('click', () => {
        let contact = new Object();
        let nameInput = document.querySelector('.js-name-input');
        let vacancyInput = document.querySelector('.js-vacancy-input');
        let phoneInput = document.querySelector('.js-phone-input');

        let nameI = nameInput.value.trim();
        let vacancyI = vacancyInput.value.trim();
        let phoneI = phoneInput.value.trim();

        //If all inputs not empty, creating new object, else - printing error ang highlights incorrect inputs 
        if (nameI != '' && vacancyI != '' && phoneI != "") {
            contact.name = nameI;
            contact.vacancy = vacancyI;
            contact.phone = phoneI;
            //getting first letter of name - will be key of object array
            let firstLetter = nameI[0].toLowerCase();       

            addToTable(contact, firstLetter);
        } else {
            //If any input is empty, it will be highlighted and error will be shown 
            if (nameI == '')
                showError('Empty input', nameInput);                
            if (vacancyI == '')
                showError('Empty input', vacancyInput);               
            if (phoneI == '')
                showError('Empty input', phoneInput);            
        }

    });

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
            showError("Contact List can't contain 2 equals contacts");
        }
    }

    //Change counter of 
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
            span.className = 'letter__couner letter__couner_active';
            span.textContent = '0';
            letter.appendChild(span);

            letter.classList.add('element__letter_active');
        }
        letter.children[0].textContent++;
    }


    //Adding block with info about contact to letter when 
    function addInfoToLetter(firstLetter, contact) {
        let letter = document.querySelector('.js-column-letter#' + firstLetter);
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
    function deleteElement(child) {
        let delObj = textToObject(child.textContent);

        //Removing from general SET
        for (let contactSetElem of contactSet.keys()) {
            if (contactSetElem.name == delObj.name && contactSetElem.vacancy == delObj.vacancy && contactSetElem.phone == delObj.phone) {
                contactSet.delete(contactSetElem);
            }
        }
       
        //Removing from array of objects            
        let firstLetter = child.parentNode.children[0].id;
        let letterContactsArray = letterContactsObj[firstLetter];

        for (let i = 0; i < letterContactsArray.length; i++) {
            if (letterContactsArray[i].name == delObj.name && letterContactsArray[i].vacancy == delObj.vacancy && letterContactsArray[i].phone == delObj.phone) {
                let index = i;
                letterContactsArray.splice(index, 1);
                break;
            }
        }
        letterContactsObj[firstLetter] = letterContactsArray;

        //Reduction of letter counter
        let span = child.parentNode.firstChild.querySelector('span');
        let elementLetter = child.parentNode.querySelector('.js-column-letter');
        span.textContent--;

        if (span.textContent == 0) {
            span.remove();
            elementLetter.classList.toggle('element__letter_active');
        }

        //Removing contact from HTML table
        child.remove();
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