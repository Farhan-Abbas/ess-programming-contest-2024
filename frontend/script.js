const API_URL = "http://127.0.0.1:8000";

function checkPatient() {
    const patientId = document.getElementById('patient_id').value;
    if (patientId) {
        // Redirect to appointments page with patient ID
        window.location.href = `appointments.html?patient_id=${patientId}`;
    } else {
        alert("Please enter a patient ID or click 'New Patient' to register.");
    }
}

function showAppointments() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');
    fetch(`${API_URL}/appointments/${patientId}`)
        .then(response => response.json())
        .then(data => {
            const appointmentsList = document.getElementById('appointments_list');
            appointmentsList.innerHTML = '';
            data.forEach(appt => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(appt);
                appointmentsList.appendChild(li);
            });
        })
        .catch(error => {
            alert("Failed to fetch appointments");
            console.error('Error:', error);
        });
}

function showDoctors() {
    const specialty = document.getElementById('specialty').value;
    fetch(`${API_URL}/doctors?specialty=${specialty}`)
        .then(response => response.json())
        .then(data => {
            const doctorsList = document.getElementById('doctors_list');
            doctorsList.innerHTML = '';
            data.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(doc);
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
    alert(`Selected Doctor: ${doctor.name}`);
}

function showTimeSlots() {
    if (!selectedDoctor) {
        alert("Please select a doctor");
        return;
    }
    fetch(`${API_URL}/timeslots/${selectedDoctor[0]}`)
        .then(response => response.json())
        .then(data => {
            const timeSlotsList = document.getElementById('time_slots_list');
            timeSlotsList.innerHTML = '';
            data.forEach(slot => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(slot);
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
    alert(`Selected Time Slot: ${slot[3]} ${slot[4]} - ${slot[5]}`);
}

function bookAppointment() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');
    if (!selectedDoctor || !selectedTimeSlot) {
        alert("Please select a doctor and a time slot");
        return;
    }
    const [date, startTime, endTime] = [selectedTimeSlot[3], selectedTimeSlot[4], selectedTimeSlot[5]];
    fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            patient_id: patientId,
            doctor_id: selectedDoctor[0],
            date: date,
            start_time: startTime,
            end_time: endTime
        }),
    })
        .then(response => {
            if (response.status === 201) {
                alert("Appointment booked successfully");
            } else if (response.status === 409) {
                alert("Appointment conflict");
            } else {
                alert("Failed to book appointment");
            }
        })
        .catch(error => {
            alert("Failed to book appointment");
            console.error('Error:', error);
        });
}

function addPatient() {
    const name = document.getElementById('new_patient_name').value;
    const contact = document.getElementById('new_patient_contact').value;
    fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            contact: contact
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Patient added successfully with ID: ${data.patient_id}`);
                // Redirect back to the main page with the new patient ID
                window.location.href = `index.html?patient_id=${data.patient_id}`;
            } else {
                alert("Failed to add patient");
            }
        })
        .catch(error => {
            alert("Failed to add patient");
            console.error('Error:', error);
        });
}
