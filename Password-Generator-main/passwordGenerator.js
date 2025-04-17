// fetch all the elements on which functionality has to be implemented
let passwordDisplay=document.querySelector('#displayPassword');
let copyButton=document.querySelector('#copyButton');
let copiedNotification=document.querySelector('#copiedNotification');
let passwordLengthInDigit=document.querySelector('#paswordLengthInDigit');
let slider=document.querySelector('#range');
let uppercase=document.querySelector('#uppercase');
let lowercase=document.querySelector('#Lowercase');
let numbers=document.querySelector('#Numbers');
let symbols=document.querySelector('#Symbols');
let colourIndicator =document.querySelector('#colour');
let generateButton=document.querySelector('#generateButton');
let allCheckbox=document.querySelectorAll('.checkbox');
 


//set initial values
let password=""; //initial password to be displayed 
let passwordLength=10; //initial password length
let totalchecked=0; //total number of selected checkboxes initially



//here we will call a function to set the slider at the initial password Length(i.e 10) as well as displayed value as 10 
setValues();

function setValues(){
    slider.value=passwordLength;
    passwordLengthInDigit.textContent=passwordLength;
}



//here we will generate a random number,uppercase and lowercase .

//this generateRandomInteger function is used to find random number,uppercase as well as lower case
function generateRandomInteger(min,max){
    let num=Math.floor(Math.random()*(max-min))+min;
    return num;
    //random method will generate a number only from 0 to 1(excluded).So,we will use this formula logic to get the value in the specified range.

    // -> let max=20 and min=10
    // -> random() will generate a number only from 0 to 1(excluded).
    // -> if we multiplied it by (max-min),then we will get a number from  range 0 to (max-min)
    // -> but we want to start our range from specified min value.but here the value starts from 0.so we will add the min value to it
}

function generateRandomNumber(){
    return generateRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(generateRandomInteger(97,123));
    //fromCharCode() will convert the integer(ASCII Value) into character.
}

function generateUpperCase(){
    return String.fromCharCode(generateRandomInteger(65,91));
}

function generateSymbol(){
    let str="`~!@#$%^&*()_-+={[}]|\:;'?/>.<,";
    let index=generateRandomInteger(0,str.length);
    return str.charAt(index);
    //There is no pattern of special characters.So, we will store all the characters in a string and return the element of any random index.
}



// calculate strength and set indicator.
function calculateStrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
    
    if(uppercase.checked==true) hasupper=true;
    if(lowercase.checked==true) haslower=true;
    if(numbers.checked==true) hasnum=true;
    if(symbols.checked==true) hassym=true;
    // .checked property will return a boolean value to identify whether the corresponding checkbox is marked or not.
    if(totalchecked==0){
        //it means there is no checkbox marked.Hence,we don't need to change any color.
    }
    else if(hasupper && haslower && (hassym || hasnum) && passwordLength>=10){
        setIndicator("green");
    }
    else if((haslower || hasupper) && (hassym ||hasnum) && passwordLength>5 ){
        setIndicator("orange");
    }
    else{
        setIndicator("red");
    }

}

//here,we will set the colour of the 'strength' indicator according to the above function
function setIndicator(color){
    colourIndicator.style.backgroundColor = color;
    colourIndicator.style.boxShadow = `0px 0px 12px 0px ${color}`;

}



//Theory to understand the concept of how to write a generated password to the clipboard:-

// 1) "await navigator.clipboard.writeText(passwordDisplay.value)" is a statement that uses the "clipboard API" to write the generated password to the clipboard.

// 2) The "writeText()" method of clipboard interface write the provide text to the clipboard. It returns a Promise that resolves when the text has been successfully written to the clipboard.

// 3) By using "await" keyword in the above statement, the code waits until the promise resolves before moving onto the next line of code. This ensures that the password is successfully written to the clipboard before any further actions are taken.

// Note:- we will use await here because when we click on the copy button,a text "copied" will be displayed on the screen.But this text should not be displayed before the promise is resolved otherwise it may be possible that our promise will get reject(i.e. text is not copy to the clipboard) and still we are displaying "copied" text on the screen.

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);

    }
    catch (e) {
        console.error("Failed to copy to clipboard", e);
    }
    
}



// update the value of password length on scrolling the slider
slider.addEventListener('input',(eve)=>{
    passwordLength=eve.target.value;
    setValues();

    // "value" attribute of "range" input tag represent the current value of slider.
    // In background,when we scroll the slider to left/right,the value of its "value" attribute changes.so,first of all,we will update the value of passwordLength according to the current value of slider attribute and then after we will call setValues() function to display it.
})



// call the copycontent function on clicking copy button
copyButton.addEventListener("click",()=>{
    //if passwordLength ==0 then there is nothing to copy
    if(password===""){
        //it means there is no password to copy,hence it will show some error kind of properties.
        copyButton.style.cssText="border:solid 2px red; color:red; outline:none";
        setTimeout(() => {
            copyButton.style.cssText="border:none; color:none"; //because there is no text color added to it."none" means by default.
        }, 200);
    }
    else{
        copycontent();
        //to display "copied" notification
        copiedNotification.style.display="unset";//it will remove/unset the css property {display:none} and make the element visible.
        setTimeout(() => {
            copiedNotification.style.display="none";//after 0,2 seconds,it will again make it hidden.
        }, 500);
    }
})



//to keep a track of total checked checkboxes

//whenever we click on any checkbox, this handlecheckboxes method will be called.so that it can update the count of totalchecked.
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckboxes);
});

function handleCheckboxes(){
    totalchecked=0; //when we click on any checkbox,it will check all checkboxes from the starting
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            totalchecked++;
        }
    });
    
    //special case:- suppose we select the password length=1 and checked all the 4 checkboxes,then it is not possible to include all characters in a 1 length password
    if(passwordLength<totalchecked){
        passwordLength=totalchecked;
        setValues();
    }
}



//Now, we will write our main logic of generate button
generateButton.addEventListener('click',()=>{
    //it means we are clicking on generate button before marked any checkbox
    if(passwordLength<=0){
        return;
    }

    //it means that we are clicking on generate button when passwordLength<total checked.So, we need to update the value of passwordLength according to the totalchecked value.
    if(passwordLength<totalchecked){
        passwordLength=totalchecked;
        setValues();
    }

    if(totalchecked==0){
        //when there is no checkbox marked,then it will not generate any password.hence,it will show some error kind of properties
        generateButton.style.cssText="border:solid 3px red; color:red; outline:none";
        setTimeout(() => {
            generateButton.style.cssText="border:none; color:white";//it will revert the properties after 0.2 seconds
        }, 200);
        colourIndicator.style.backgroundColor="white"; //suppose you generate 1 password of good strength(i.e indicator=green) and then try to generate password of zero length(i.e. no checkbox marked),still here,the indicator is green.Hence,to revert it back we will use this code.
        colourIndicator.style.boxShadow="0px 0px 12px 0px white";
    }
    //now, our main logic begins to generate a random password.
    password="" //we are removing the previously generated password on clicking on button.

    let functArray=[]; //this array will store the functions a/c to the checkboxes which generate random numbers,uppercase,lowercase and symbols.So that,we can randomly access its index and call its corresponding function.

    if(uppercase.checked) functArray.push(generateUpperCase);
    if(lowercase.checked) functArray.push(generateLowerCase);
    if(symbols.checked) functArray.push(generateSymbol);
    if(numbers.checked) functArray.push(generateRandomNumber);

    //Now,we are calling those functions which are mandatory to be present in our password(i.e. whose checkbox is marked) and add them to our password
    for(let i=0;i<functArray.length;i++){
        password+=functArray[i]();
    }

    //now we are adding the remaining digits to our password.suppose if we marked all 4 checkboxes then the above for loop will add 4 digits to our password and we want a password of length 10.so the remaining 6 digits can be anything
    for(let i=0;i<passwordLength-functArray.length;i++){
        let randomidx = generateRandomInteger(0, functArray.length);
        if (typeof functArray[randomidx] === 'function') {
            password += functArray[randomidx](); // Only call if it's a function
        }
    }
       
    // Till now,we will generate the password of required length.But as you can observe,from the first loop,the pattern of digits will be always same because the function callings in the first loop is in sequencial order.so the first digit is always uppercase(if marked),then lowercase,then symbols and then numbers.
    // SO,we need to suffle our password.
    password=shufflePassword(Array.from(password)); //Array.from() will convert the string into array.You can also use split method inside shuffle function 

    //display the password on screen
    passwordDisplay.value=password;

    //now, we need to calculate the strength of a password to change the color of the indicator.
    calculateStrength();
})

function shufflePassword(passwordArray) {
    //This is predefined algorithm to shuffle the array. It is known as fisher yates method
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
    }
    let str = "";
    passwordArray.forEach((ele) => str += ele);
    return str;
}

