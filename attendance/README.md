# Smart Attendance & Exam Register

This project is a static, instructor-owned class register designed for deployment at:

`https://othman-echi.github.io/attendance/`

## Main capabilities

- Multiple class sections and CSV roster import
- Instructor attendance marking: present, late, excused, absent
- Scanner-friendly student-ID kiosk, with optional camera QR scanning when supported
- Student QR check-in through the included Google Apps Script service
- Quizzes, exams, oral exams, projects and final exams
- Weighted totals or custom formulas, with mean, median, high score and standard deviation
- Attendance thresholds, student reports and personalised warning e-mail drafts
- CSV exports, printable reports, per-student HTML reports and JSON backup/restore

## Privacy model

The GitHub Pages site is only the application shell. Rosters, scores and attendance records are stored in the instructor's browser and are not committed to the public website. The QR check-in service receives only student IDs and names. It does not receive scores or e-mail addresses.

Back up the register regularly from the **Backup** tab. Browser storage is device-specific and should not be the only long-term copy of important course records.

## Files

- `CLASS_REGISTER.html` — complete browser application
- `CHECKIN_SERVER.gs` — optional online QR check-in service for Google Apps Script
- `CHECKIN_LOCAL.py` and `START_CHECKIN.bat` — optional classroom-network check-in

## QR check-in setup

1. Open `CHECKIN_SERVER.gs` and follow the setup instructions at its top.
2. Deploy it as a Google Apps Script web app.
3. In the register's **QR check-in** tab, paste the web-app URL and token.
4. Publish the roster, open the current session and show the generated QR code.
5. After check-in, close the session and pull the successful check-ins into the register.

The QR image is generated in the browser by QRCode.js. The rotating class code should be changed for every meeting and the session should be closed promptly.

