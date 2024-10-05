const API_URL = "http://127.0.0.1:5000";

function showAppointments() {
    const patientId = document.getElementById('patient_id').value;
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
    const patientId = document.getElementById('patient_id').value;
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