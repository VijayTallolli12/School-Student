# STUDENT_DASHBOARD_REDESIGN

Date: 2026-08-06
File: src/app/(tabs)/(home)/index.tsx

## Redesign Goals
- Make dashboard the student's daily command center.
- Prioritize immediate decisions: what to attend, what to complete, what is due.
- Remove parent-style informational overload.

## Implemented Layout
1. Identity Hero
- Student name
- Class, section, roll number
- Admission number
- Academic year
- Current date
- Attendance percentage badge

2. Today Status Card
- Attendance state
- Homework due indicator
- Upcoming exam indicator
- Unread alert count
- Fee pending summary
- Academic average snapshot

3. Quick Actions
- Homework
- Timetable
- Attendance
- Exams
- Results
- Fees
- Circulars
- Study materials

4. Recent Notifications
- Top alerts with relative timestamps
- One-tap deep links to full notification details

5. Academic Snapshot
- Average score
- Subject count
- Pending fees

## Design Decisions
- Card-first visual hierarchy for scanability.
- Dense but readable information blocks for short in-between-class usage.
- Reduced visual clutter by limiting low-value decorative elements.

## Further Enhancements
- Add true today timetable/current-next period rows from backend timetable payload if included in dashboard contract.
- Add due-today homework count once payload exposes due segmentation.
- Add upcoming exam countdown from schedule payload if available on dashboard response.
