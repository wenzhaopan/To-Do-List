const inputBox = document.getElementById("taskbox");
const listContainer = document.getElementById("list-container");
const apiKey = "5e0686e64491f3bdd6356a0120f12295";
const currCity = "";
const currWeather = "";
const weatherInputBox = document.getElementById("weatherInput");
var temp1;
var temp2;
var lat;
var lon;
var precipitation = false;


function updateWeather(){
    if(weatherInputBox.value===''){
        alert("Please enter a city");
    }else{   
        document.getElementById('city').textContent = "Current location: " + weatherInputBox.value;
        inputVal=weatherInputBox.value;
        geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputVal}&limit=1&appid=${apiKey}`;
        fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            temp1=data[0].lat;
            temp2=data[0].lon;
            lat=temp1.toString();
            lon=temp2.toString();
            weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;


            fetch(weatherURL)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const weatherDescription = data.weather[0].description;
                    if (weatherDescription.includes('rain') || weatherDescription.includes('snow')) {
                        alert("There is precipitation right now. Consider not doing stuff outdoors");
                        precipitation=true;
                    }else{
                        precipitation=false;
                        alert("There is no precipitation right now. You can do stuff outdoors");
                    }
                    updateTasks();
                })
        })



        .catch(() => {
            msg.textContent = "Please search for a valid city";
        });
        weatherInputBox.value="";
    }
}


function updateTasks(){
    const taskItems = listContainer.getElementsByTagName("li");
    for(let i=0;i<taskItems.length;i++){
        var s = taskItems[i].textContent;
        var start = s.indexOf("(");
        var end = s.indexOf(")");
        var substr = s.substring(start+1, end);
        if(precipitation && substr === "Outdoors" && !(taskItems[i].classList.contains("notRN"))) taskItems[i].classList.add("notRN");
        else if(precipitation && substr === "Indoors" && taskItems[i].classList.contains("notRN")) taskItems[i].classList.remove("notRN");
        else if(taskItems[i].classList.contains("notRN")) taskItems[i].classList.remove("notRN");
    }
    saveData();
}



//function to update the text of the button to be "Indoors"
function updateIndoor(){
    document.getElementById('dropbtn').textContent = "Indoors"
}

//function to update the text of the button to be "Outdoors"
function updateOutdoor(){
    document.getElementById('dropbtn').textContent = "Outdoors"
}

//upon clicking the add task button, it checks if the text field is empty
//then checks if the indoor/outdoor option has been pressed
//if both are satisfied, it will add the task by making a new list element
//then it resets the text field and the indoor/outdoor button
function AddTask(){
    const outdoorText = document.getElementById("dropbtn").textContent;
    if(inputBox.value===''){
        alert("Please enter a task");
    }else if(outdoorText==="Indoor or Outdoor?"){
        alert("Please select if the activity will be indoors or outdoors");
    }else{
        let li=document.createElement("li");
        if(precipitation){
            li.innerHTML = inputBox.value + ' (' + outdoorText + ')';
        }else{
            li.innerHTML = inputBox.value + ' (' + outdoorText + ')';
        }
        
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value="";
    document.getElementById('dropbtn').textContent = "Indoor or Outdoor?";
    updateTasks();
}

//add event listener, if I click on the text, it checks or unchecks the task
//If I click on the SPAN (the 'x' at the end) it removes the task
listContainer.addEventListener("click", function(e){
    if(e.target.tagName==="LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);


//local storage, calls the function everytime the list updates to locally save the data to your browser
function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

//function that gets data from the save
function fetchData(){
    listContainer.innerHTML = localStorage.getItem("data");
}

//show the data in the browser
fetchData();
