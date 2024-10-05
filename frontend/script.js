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
                userMessageContainer.innerText = data['message'][0][0];
                section1.appendChild(userMessageContainer)

                var userMessageContainer = document.createElement("p");
                userMessageContainer.innerText = data['message'][1][0];
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

function showDoctors() {
    const specialty = document.getElementById('specialty').value;
    fetch(`${API_URL}/showTimeSlot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specialty: specialty }),
    })
        .then(response => response.json())
        .then(data => {
            const doctorsList = document.getElementById('doctors_list');
            doctorsList.innerHTML = '';
            data.message.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = doc;
                li.onclick = () => selectDoctor(doc);
                doctorsList.appendChild(li);
            });
        })
        .catch(error => {
            alert("Failed to fetch doctors");
            console.error('Error:', error);
        });
}

let selectedDoctor = null;

function selectDoctor(doctor) {
    selectedDoctor = doctor;
    alert(`Selected Doctor: ${doctor}`);
}

function showTimeSlots() {
    if (!selectedDoctor) {
        alert("Please select a doctor");
        return;
    }
    fetch(`${API_URL}/bookTimeSlot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctor_id: selectedDoctor }),
    })
        .then(response => response.json())
        .then(data => {
            const timeSlotsList = document.getElementById('time_slots_list');
            timeSlotsList.innerHTML = '';
            data.message.forEach(slot => {
                const li = document.createElement('li');
                li.textContent = slot;
                li.onclick = () => selectTimeSlot(slot);
                timeSlotsList.appendChild(li);
            });
        })
        .catch(error => {
            alert("Failed to fetch time slots");
            console.error('Error:', error);
        });
}

let selectedTimeSlot = null;

function selectTimeSlot(slot) {
    selectedTimeSlot = slot;
    alert(`Selected Time Slot: ${slot}`);
}

function bookAppointment() {
    const patientId = document.getElementById('patient_id').value;
    if (!selectedDoctor || !selectedTimeSlot) {
        alert("Please select a doctor and a time slot");
        return;
    }
    const timeHour = parseInt(selectedTimeSlot.split(' ')[0]);
    fetch(`${API_URL}/bookTimeSlot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            patient_id: patientId,
            doctor_id: selectedDoctor,
            time_hour: timeHour
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Appointment booked successfully");
            } else {
                alert("Appointment conflict");
            }
        })
        .catch(error => {
            alert("Failed to book appointment");
            console.error('Error:', error);
        });
}