const API_URL = "http://127.0.0.1:5000/api";

function showAppointments() {
    const patientId = document.getElementById('patient_id').value;
    fetch(`${API_URL}/viewPatientInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: patientId }),
    })
        .then(response => response.json())
        .then(data => {
            const appointmentsList = document.getElementById('appointments_list');
            appointmentsList.innerHTML = '';
            data.message.forEach(appt => {
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