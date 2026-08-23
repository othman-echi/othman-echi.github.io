# Smart Attendance & Exam Register

This project is a static, instructor-owned class register designed for deployment at:

`https://othman-echi.github.io/attendance/`

## Main capabilities

- Multiple class sections and CSV roster import
- Instructor attendance marking: present, late, excused, absent
- Scanner-friendly student-ID kiosk, with optional camera QR scanning when supported
- Student QR check-in requiring ID, a rotating class code and a unique private access code
- Quizzes, exams, oral exams, projects and final exams
- Weighted totals or custom formulas, with mean, median, high score and standard deviation
- Attendance thresholds, student reports and personalised warning e-mail drafts
- CSV exports, printable reports, per-student HTML reports and JSON backup/restore

## Privacy model

The GitHub Pages site is only the application shell. No roster, score or attendance value is committed to the public website. The instructor's browser copy is protected by a required PIN and automatically locks after inactivity.

When the optional Google Apps Script service is used, it stores the roster and private student records in a spreadsheet owned by the instructor's Google account. E-mail addresses are never uploaded. Each student's random 16-character access code is converted to a SHA-256 hash before the record is stored. The public endpoint returns a record only when the student ID and matching private code are both correct, and it returns only that student's attendance and scores. Repeated failed record-access attempts are temporarily throttled.

Private codes are credentials. Distribute each code only to its matching student, preferably through the student's institutional e-mail. A student who deliberately shares their code also shares access to their own record; no website can prevent voluntary credential sharing.

Back up the register regularly from the **Backup** tab. Browser storage is device-specific and should not be the only long-term copy of important course records.

The instructor PIN locks the application's normal interface; it is not whole-device encryption. Protect the instructor's Windows account and browser profile, enable device encryption where available, and keep exported backups and private-code CSV files in encrypted storage. Someone with full access to the instructor's operating-system account or browser developer tools may be able to inspect local browser storage.

## Files

- `CLASS_REGISTER.html` — complete browser application
- `CHECKIN_SERVER.gs` — optional online QR check-in service for Google Apps Script
- `CHECKIN_LOCAL.py` and `START_CHECKIN.bat` — optional classroom-network check-in

## QR check-in setup

1. Open `CHECKIN_SERVER.gs` and follow the setup instructions at its top.
2. Deploy it as a Google Apps Script web app.
3. In the register's **QR check-in** tab, paste the web-app URL and token.
4. Export private access codes from **Roster** and distribute each row only to its matching student.
5. Publish the section, open the current session and show the generated QR code.
6. Students check in using their ID, private access code and the rotating class code.
7. Share the private record link; the same ID and private code reveal only the matching student's record.
8. After check-in, close the session and pull the successful check-ins into the register.

After replacing an older `CHECKIN_SERVER.gs`, run `resetToken()` once, copy the new 32-character instructor token into the register, and create a **new Apps Script deployment version** before using the private-record feature. The QR image is generated in the browser by QRCode.js. Change the rotating class code for every meeting and close the session promptly.

## Local classroom-network mode

Export `*-PRIVATE-access-codes.csv` from the **Roster** tab and place it beside `CHECKIN_LOCAL.py`. The server refuses to start without that file, and each check-in requires the student ID, matching private access code and current class code. The full `/list` and `/data` views accept connections only from the instructor's own computer; phones on the classroom network receive an instructor-only response. Keep the exported private-code CSV confidential.
