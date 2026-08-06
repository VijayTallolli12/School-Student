# API_ENDPOINT_USAGE

Date: 2026-08-06
Scope: Student mobile API service endpoint inventory after contract enforcement

## Contract Source
- Backend contract artifacts requested in task were not present in this workspace:
  - student-openapi.yaml
  - student-openapi.json
  - STUDENT_API_CONTRACT.md
  - STUDENT_API_DOCUMENTATION.md
  - student-postman-collection.json
- Enforcement was completed using the verified endpoint list provided in the task instructions.

## Endpoint Inventory (Student App)

| Service Function | Method | Endpoint |
|---|---|---|
| fetchDashboard | GET | /student/dashboard |
| fetchProfile | GET | /me |
| fetchAttendance | GET | /student/attendance |
| fetchFees | GET | /student/fees |
| fetchExamResults | GET | /student/results |
| fetchTimetable | GET | /student/timetable |
| fetchMe | GET | /me |
| fetchNotifications | GET | /student/notifications |
| fetchUnreadCount | GET | /student/notifications/unread |
| markNotificationRead | POST | /student/notifications/{id}/read |
| markAllNotificationsRead | POST | /student/notifications/read-all |
| fetchHomework | GET | /student/homework |
| fetchAssignments | GET | /student/assignments |
| fetchExamSchedule | GET | /student/exams |
| fetchCalendar | GET | /student/calendar |
| fetchDocuments | GET | /student/documents |
| fetchCirculars | GET | /student/circulars |
| fetchCircularDetail | GET | /student/circulars/{id} |
| markCircularRead | POST | /student/circulars/{id}/read |
| fetchLeaveRequests | GET | /student/leave-requests |
| fetchLeaveRequestDetail | GET | /student/leave-requests/{id} |
| submitLeaveRequest | POST | /student/leave-requests |
| updateLeaveRequest | PUT | /student/leave-requests/{id} |
| updateProfile | PUT | /me |
| changePassword | PUT | /me/change-password |
| fetchTransportDashboard | GET | /student/transport |
| secureLogout | POST | /auth/logout |

## Authentication and Headers
- Axios request interceptor injects `Authorization: Bearer <token>` for authenticated requests.
- 401 handling includes refresh attempt and secure logout flow.

## Notes
- No endpoint fallback logic remains in `src/services/api.ts`.
- No legacy `/students/{uuid}/...` or `/me/...` fallback calls remain for student modules.
