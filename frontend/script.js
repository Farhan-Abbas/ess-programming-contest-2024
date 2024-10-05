async function checkPatient() {
    
    var input = document.getElementById("userInput1").value;
    if (input) {
        const backendEndpoint = "http://127.0.0.1:5000/api/viewPatientApp";
        try {
            const response = await fetch(backendEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });
            const text = await response.text();
            const data = JSON.parse(text);
            if (response.ok) {
                console.log(data["message"]);
                console.log("Message received successfully!");

                var section1 = document.getElementById('section1');

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = 'Patient Information';
                section1.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][1][0];
                section1.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = "Patient's Appointment Information";
                section1.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][0][0];
                section1.appendChild(userMessageContainer)

            } else {
                console.error("Error receiving message!.");
            }
        } catch (error) {
            console.error("Error sending data!", error);
        }
    } else {
        alert("Please enter a patient ID or click 'New Patient' to register.");
    }
}

async function searchAvailableDoctors() {
    var input = document.getElementById("userInput2").value;
    if (input) {
        const backendEndpoint = "http://127.0.0.1:5000/api/searchAvailableDoctors";
        try {
            const response = await fetch(backendEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });
            const text = await response.text();
            const data = JSON.parse(text);
            if (response.ok) {
                console.log(data["message"]);
                console.log("Message received successfully!");

                var section2 = document.getElementById('section2');
                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = 'Available doctors based on speciality: ' + input;
                section2.append(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][0];
                section2.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][1];
                section2.appendChild(userMessageContainer)

            } else {
                console.error("Error receiving message!.");
            }
        } catch (error) {
            console.error("Error sending data!", error);
        }
    } else {
        alert("Please enter a patient ID or click 'New Patient' to register.");
    }
}

async function showTimeSlotForSelectedDoctor() {
    var input = document.getElementById("userInput3").value;
    if (input) {
        const backendEndpoint = "http://127.0.0.1:5000/api/showTimeSlotForSelectedDoctor";
        try {
            const response = await fetch(backendEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });
            const text = await response.text();
            const data = JSON.parse(text);
            if (response.ok) {
                console.log(data["message"]);
                console.log("Message received successfully!");

                var section3 = document.getElementById('section3');

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = 'Time slots available for the doctor with id: ' + input;
                section3.appendChild(userMessageContainer)
                
                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][0];
                section3.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][1];
                section3.appendChild(userMessageContainer)
            } else {
                console.error("Error receiving message!.");
            }
        } catch (error) {
            console.error("Error sending data!", error);
        }
    } else {
        alert("Please enter a patient ID or click 'New Patient' to register.");
    }
}

async function bookTimeSlot() {
    var input = document.getElementById("userInput4").value;
    var arraySplit = input.split(',');
    patientID = arraySplit[0];
    doctorID = arraySplit[1];
    hour = arraySplit[2];

    if (input) {
        const backendEndpoint = "http://127.0.0.1:5000/api/bookTimeSlot";
        try {
            const response = await fetch(backendEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: [patientID, doctorID, hour] }),
            });
            const text = await response.text();
            const data = JSON.parse(text);
            if (response.ok) {
                console.log(data["message"]);
                console.log("Message received successfully!");

                var section4 = document.getElementById('section4');

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = 'Booking Status: ' + data['message'];
                section4.appendChild(userMessageContainer)
            } else {
                console.error("Error receiving message!.");
            }
        } catch (error) {
            console.error("Error sending data!", error);
        }
    } else {
        alert("Please enter a patient ID or click 'New Patient' to register.");
    }
}

