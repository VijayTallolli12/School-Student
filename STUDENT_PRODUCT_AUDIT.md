# STUDENT_PRODUCT_AUDIT

Date: 2026-08-06
Scope: Student-first UX audit across screens, navigation, and core modules

## Audit Table

| Screen | Student Value | Keep | Merge | Remove | Improve | Reason |
|---|---|---|---|---|---|---|
| Home Dashboard | Daily snapshot and entry point | Yes | No | No | Yes | Converted to student-day focus; still can enrich timetable/homework cards with richer backend fields |
| Academics Hub | Fast access to study modules | Yes | No | No | Yes | New student-first aggregation layer reducing navigation friction |
| Attendance | High daily relevance | Yes | No | No | Yes | Improve compact calendar readability and legends |
| Homework | Core daily workflow | Yes | Maybe with Assignments | No | Yes | Keep until business confirms whether assignments are distinct |
| Assignments | Core task workflow | Yes | Maybe with Homework | No | Yes | Needs explicit backend workflow distinction to avoid confusion |
| Timetable | Daily planning | Yes | No | No | Yes | Add current/next period highlights on screen |
| Exam Schedule | Medium relevance | Yes | No | No | Yes | Add countdown and exam urgency chips |
| Results | Medium-high relevance | Yes | No | No | Yes | Add trend line and recent result emphasis |
| Fees | Medium relevance | Yes | No | No | Yes | Keep tab-level access per business priority |
| Circulars | Medium relevance | Yes | No | No | Yes | Improve pinning for latest circular |
| Notifications | High relevance | Yes | No | No | Yes | Keep dedicated tab for urgent events |
| Calendar | Medium relevance | Yes | No | No | Yes | Improve filtering and visual event categories |
| Documents | Medium relevance | Yes | No | No | Yes | Renamed in IA context as study materials/resources |
| Leave Requests | Medium relevance | Yes | No | No | Yes | Keep under academics grouping |
| Transport | Conditional relevance | Yes | No | No | Yes | Keep only if school transport enabled |
| Student Profile | Identity and reference | Yes | No | No | Yes | Parent-centric labels removed from visible UI language |
| Profile/Settings | Account management | Yes | No | No | Yes | Keep security and personalization flows |

## Parent Remnant Findings
- Runtime parent route dependencies: Removed from student module routing.
- Parent wording in core navigation/dashboard: Removed from updated screens.
- Residual context labels in non-critical copy: Minimal and being phased out.

## Key Recommendations
1. Keep Homework and Assignments separate for now, add labels clarifying purpose.
2. Add richer dashboard sections as backend fields are finalized (today timetable, due homework count, upcoming exam countdown).
3. Continue replacing remaining contact labels with student-safe, role-neutral phrasing.
4. Add dedicated "More" grouping entry if IA requires explicit overflow destination.
