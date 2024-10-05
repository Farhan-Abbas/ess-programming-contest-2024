import psycopg2

conn = psycopg2.connect(database="pets",
                        host="localhost",
                        user="oop",
                        password="ucalgary",
                        port="5432")
cursor = conn.cursor()

while True:
    print("What are you looking for?")
    print("1. view patient appointment")
    print("2. search for available doctors")
    print("3. show time slot for selected doctor")
    print("4. book a time slot")
    option = input("Enter your option: ")
    print()

    # if option == '1':
    #     patientID = input()
    #     cursor.execute(f"SELECT * FROM appointments WHERE appointments.patient_id = '{patientID}';")
    #     result = cursor.fetchall()
    #     print(result)

    # if option == '2':
    #     speciality = input()
    #     cursor.execute(f"SELECT * FROM doctor WHERE doctor.speciality = '{speciality}';")
    #     allDoctors = cursor.fetchall()
    #     availableDoctor = []
    #     for i in allDoctors:
    #         if True in i[-1]:
    #             availableDoctor.append(i[1])
    #     print(availableDoctor)


    # if option == '3':
    #     doctorId = input()
    #     cursor.execute(f"SELECT * FROM doctor WHERE doctor.doctor_id = '{doctorId}';")
    #     result = cursor.fetchall()
    #     print(result)
    #     availableTime = []
    #     temp = result[0][-1]
    #     print(temp)
    #     for i in range(len(temp)):
    #         if temp[i] == True:
    #             if 8 + i <= 10:
    #                 availableTime.append(f'{8 + i}am - {9 + i}am')
    #             elif 8 + i == 11:
    #                 availableTime.append(f'{8 + i}am - {9 + i}pm')
    #             else:
    #                 availableTime.append(f'{8 + i}pm - {9 + i}pm')
    from datetime import datetime
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
