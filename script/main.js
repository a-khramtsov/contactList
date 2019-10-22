window.onload = function () {
    //Working with inputs

    //Changing name, vacancy inputs
    let inputs = document.querySelectorAll('.js-name-input, .js-vacancy-input');
    inputs.forEach(item => {
        item.addEventListener('change', function (event) {
            let target = event.target;
            if (target.value.trim().length <= 3) {
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
                nameInput.classList.toggle('active');
            if (vacancyI == '')
                vacancyInput.classList.toggle('active');
            if (phoneI == '')
                phoneInput.classList.toggle('active');

            setTimeout(function () {
                nameInput.classList.remove('active');
                vacancyInput.classList.remove('active');
                phoneInput.classList.remove('active');
            }, 3000);
        }

    });

    //Add contact to list
    let contactMap = new Map();  
    function addToTable(contact, firstLetter) { 
        let notEquals = true; 

        //If contains equals element, then don't add this element
        for (let contactE of contactMap.keys()) {            
            if (contactE.name == contact.name && contactE.vacancy == contact.vacancy && contactE.phone == contact.phone) {               
                notEquals = false;          
            }
        }

        if (notEquals)
            contactMap.set(contact, firstLetter);

        console.log(contactMap);

        
        // let letter = document.querySelector('.js-column-letter#' + firstLetter);             

        // if (!contactMap.get(contact)){
        //     contactMap.set(contact, firstLetter);
        //     // let span = document.createElement('span');
        //     // span.className = 'letter__couner';
        //     // span.textContent = '0';
        //     // letter.appendChild(span);
        //     // letter.children[0].textContent++;

        // } 

    }







    // //Click on table element
    // let tableElements = document.querySelectorAll('.table-element')
    // tableElements.forEach(function(item) {
    //     item.addEventListener('click', function() {            
    //         console.log(this.childNodes[3].classList);
    //         this.childNodes[3].classList.toggle('active');
    //         this.childNodes[5].classList.toggle('active');
    //     });
    // });

};