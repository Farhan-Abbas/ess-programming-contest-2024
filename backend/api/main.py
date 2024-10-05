# /api/chat.py
from flask import Flask, request
from flask_cors import CORS
import psycopg2
from datetime import datetime

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(database="pets",
                        host="localhost",
                        user="oop",
                        password="ucalgary",
                        port="5432")
cursor = conn.cursor()

@app.route('/api/viewPatientInfo', methods=['POST'])
def main():
    data = request.get_json()
    patientID = input()
    cursor.execute(f"SELECT * FROM appointments WHERE appointments.patient_id = '{patientID}';")
    result = cursor.fetchall()
    print(result)

    return {'message': result}

    
@app.route('/api/showTimeSlot', methods=['POST'])
def main():
    data = request.get_json()
    speciality = input()
    cursor.execute(f"SELECT * FROM doctor WHERE doctor.speciality = '{speciality}';")
    allDoctors = cursor.fetchall()
    availableDoctor = []
    for i in allDoctors:
    if True in i[-1]:
        availableDoctor.append(i[1])
    print(availableDoctor)
    return {'message': availableDoctor}
    
@app.route('/api/bookTimeSlot', methods=['POST'])
def main():
    data = request.get_json()
    doctorId = input()
    cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{doctorId}';")
    result = cursor.fetchall()
    print(result)
    availableTime = []
    temp = result[0][-1]
    print(temp)
    for i in range(len(temp)):
        if temp[i] == True:
            if 8 + i <= 10:
                availableTime.append(f'{8 + i}am - {9 + i}am')
            elif 8 + i == 11:
                availableTime.append(f'{8 + i}am - {9 + i}pm')
            else:
                availableTime.append(f'{8 + i}pm - {9 + i}pm')
    print(availableTime)
    return {'message': availableTime}

@app.route('/api/bookTimeSlot', methods=['POST'])
def main():
    data = request.get_json()
    patID = input()
    docID = input()
    timeHour = int(input())
    cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{docID}';")
    result = cursor.fetchall()
    if result[-1][-1][timeHour - 8] == True:
        cursor.execute(f"UPDATE doctor SET available[{timeHour - 8 + 1}] = '{False}' WHERE doctor_id = '{docID}';")
        print("success!")
        cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{docID}';")
        print(cursor.fetchall())
        dateToday = datetime.today().strftime('%Y-%m-%d')
        if timeHour < 10:
            timeHour = '0' + str(timeHour)
        else:
            timeHour = str(timeHour)
        cursor.execute(f"SELECT * FROM appointments;")
        appointmentTableLen = len(cursor.fetchall())
        cursor.execute(f"INSERT INTO appointments (appointment_id, patient_id, doctor_id, date, start_time, end_time) VALUES ('{appointmentTableLen + 1}', '{patID}', '{docID}', '{dateToday}', '{dateToday + ' ' + timeHour + ':00:00'}', '{dateToday + ' ' + str(int(timeHour) + 1) + ':00:00'}');")
        print('success!')
        return {'message': True}
    else:
        print("failure!")
        return {'message': False}


if __name__ == '__main__':
  app.run(debug=True)


























while True:
    print("What are you looking for?")
    print("1. view patient appointment")
    print("2. search for available doctors")
    print("3. show time slot for selected doctor")
    print("4. book a time slot")
    option = input("Enter your option: ")
    print()

    if option == '1':
        patientID = input()
        cursor.execute(f"SELECT * FROM appointments WHERE appointments.patient_id = '{patientID}';")
        result = cursor.fetchall()
        print(result)

    if option == '2':
        speciality = input()
        cursor.execute(f"SELECT * FROM doctor WHERE doctor.speciality = '{speciality}';")
        allDoctors = cursor.fetchall()
        availableDoctor = []
        for i in allDoctors:
            if True in i[-1]:
                availableDoctor.append(i[1])
        print(availableDoctor)


    if option == '3':
        doctorId = input()
        cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{doctorId}';")
        result = cursor.fetchall()
        print(result)
        availableTime = []
        temp = result[0][-1]
        print(temp)
        for i in range(len(temp)):
            if temp[i] == True:
                if 8 + i <= 10:
                    availableTime.append(f'{8 + i}am - {9 + i}am')
                elif 8 + i == 11:
                    availableTime.append(f'{8 + i}am - {9 + i}pm')
                else:
                    availableTime.append(f'{8 + i}pm - {9 + i}pm')

    if option == '4':
        patID = input()
        docID = input()
        timeHour = int(input())
        cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{docID}';")
        result = cursor.fetchall()
        if result[-1][-1][timeHour - 8] == True:
            cursor.execute(f"UPDATE doctor SET available[{timeHour - 8 + 1}] = '{False}' WHERE doctor_id = '{docID}';")
            print("success!")
            cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{docID}';")
            print(cursor.fetchall())
            dateToday = datetime.today().strftime('%Y-%m-%d')
            if timeHour < 10:
                timeHour = '0' + str(timeHour)
            else:
                timeHour = str(timeHour)
            cursor.execute(f"SELECT * FROM appointments;")
            appointmentTableLen = len(cursor.fetchall())
            cursor.execute(f"INSERT INTO appointments (appointment_id, patient_id, doctor_id, date, start_time, end_time) VALUES ('{appointmentTableLen + 1}', '{patID}', '{docID}', '{dateToday}', '{dateToday + ' ' + timeHour + ':00:00'}', '{dateToday + ' ' + str(int(timeHour) + 1) + ':00:00'}');")
            cursor.execute(f"Select * from appointments;")
            print(cursor.fetchall())
        else:
            print("failure!")
            cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{docID}';")
            print(cursor.fetchall())
