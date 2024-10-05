#!/usr/bin/env python3
"""
Documentation

See also https://www.python-boilerplate.com/flask
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2 import sql

def connect_db():
    return psycopg2.connect(
        dbname="your_db_name",
        user="your_db_user",
        password="your_db_password",
        host="your_db_host",
        port="your_db_port"
    )

def create_app(config=None):
    app = Flask(__name__)

    # See http://flask.pocoo.org/docs/latest/config/
    app.config.update(dict(DEBUG=True))
    app.config.update(config or {})

    # Setup cors headers to allow all domains
    # https://flask-cors.readthedocs.io/en/latest/
    CORS(app)

    @app.route('/appointments/<int:patient_id>', methods=['GET'])
    def get_appointments(patient_id):
        conn = connect_db()
        cur = conn.cursor()
        query = sql.SQL("SELECT * FROM Appointments WHERE patient_id = %s")
        cur.execute(query, (patient_id,))
        appointments = cur.fetchall()
        conn.close()
        return jsonify(appointments)

    @app.route('/doctors', methods=['GET'])
    def get_doctors():
        specialty = request.args.get('specialty')
        conn = connect_db()
        cur = conn.cursor()
        query = sql.SQL("SELECT * FROM Doctors WHERE specialty = %s AND available = TRUE")
        cur.execute(query, (specialty,))
        doctors = cur.fetchall()
        conn.close()
        return jsonify(doctors)

    @app.route('/timeslots/<int:doctor_id>', methods=['GET'])
    def get_time_slots(doctor_id):
        conn = connect_db()
        cur = conn.cursor()
        query = sql.SQL("SELECT * FROM Appointments WHERE doctor_id = %s AND date >= CURRENT_DATE")
        cur.execute(query, (doctor_id,))
        time_slots = cur.fetchall()
        conn.close()
        return jsonify(time_slots)

    @app.route('/book', methods=['POST'])
    def book_appointment():
        data = request.json
        patient_id = data['patient_id']
        doctor_id = data['doctor_id']
        date = data['date']
        start_time = data['start_time']
        end_time = data['end_time']
        
        conn = connect_db()
        cur = conn.cursor()
        query = sql.SQL("SELECT * FROM Appointments WHERE patient_id = %s AND date = %s AND start_time = %s")
        cur.execute(query, (patient_id, date, start_time))
        if cur.fetchone():
            conn.close()
            return jsonify({"success": False, "message": "Appointment conflict"}), 409
        
        query = sql.SQL("INSERT INTO Appointments (patient_id, doctor_id, date, start_time, end_time) VALUES (%s, %s, %s, %s, %s)")
        cur.execute(query, (patient_id, doctor_id, date, start_time, end_time))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Appointment booked successfully"}), 201

    @app.route('/patients', methods=['POST'])
    def add_patient():
        data = request.json
        name = data['name']
        contact = data['contact']
        
        conn = connect_db()
        cur = conn.cursor()
        
        # Get the current number of patients
        query = sql.SQL("SELECT COUNT(*) FROM Patients")
        cur.execute(query)
        patient_count = cur.fetchone()[0]
        
        # Generate new patient ID
        new_patient_id = patient_count + 1
        
        # Insert new patient into the database
        query = sql.SQL("INSERT INTO Patients (patient_id, name, contact) VALUES (%s, %s, %s)")
        cur.execute(query, (new_patient_id, name, contact))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Patient added successfully", "patient_id": new_patient_id}), 201

    return app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = create_app()
    app.run(host="0.0.0.0", port=port)