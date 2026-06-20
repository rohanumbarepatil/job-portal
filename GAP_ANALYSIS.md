# Gap Analysis Report

## Overview
This report details the gaps identified between the initial implementation and the official project description for the Job Portal System.

## Identified Gaps

### 1. Application Status Workflow
**Gap:** The application statuses were not standardized across the backend and frontend. They used a mix of `REVIEWING`, `OFFERED`, `HIRED`, which lacked standard ATS terminology.
**Resolution:** Standardized the workflow into the following exact states:
- `APPLIED`
- `UNDER_REVIEW`
- `SHORTLISTED`
- `INTERVIEW_SCHEDULED`
- `INTERVIEW_COMPLETED`
- `SELECTED`
- `REJECTED`
- `WITHDRAWN`

### 2. Interview Module
**Gap:** The `InterviewEntity` lacked essential fields for a complete ATS workflow, such as `interviewMode` and `interviewerName`.
**Resolution:** 
- Added `interviewMode` enum (`ONLINE`, `OFFLINE`, `PHONE`).
- Added `interviewerName` field.
- Updated the scheduling frontend modal (`InterviewScheduler.jsx`) to capture and render these inputs conditionally.

### 3. Advanced Search Filters
**Gap:** The job search capability was limited to simple string matching (`keyword`, `location`, `type`).
**Resolution:**
- Replaced basic Spring Data JPA queries with `JobSpecification.java` utilizing `CriteriaBuilder`.
- Added dynamic filtering support for `experienceLevel`, `minSalary`, `locationType`, `companyId`, and `skills`.
- Added a dedicated "Advanced Filters" sidebar on the frontend `JobSearch.jsx` page.

### 4. Email Notifications
**Gap:** Several key ATS workflow events were not triggering email notifications, and the candidate notification content lacked specific details.
**Resolution:**
- Implemented email triggers for:
  - `REGISTRATION_SUCCESS`
  - `APPLICATION_SUBMITTED`
  - `SHORTLISTED`
  - `INTERVIEW_SCHEDULED`
  - `SELECTED`
  - `REJECTED`
- Updated `ApplicationService` and `InterviewService` to invoke `NotificationService` reliably.

### 5. Job Seeker Dashboard
**Gap:** The timeline logs were mock data, and the dashboard ATS pipeline did not map to the new status workflow.
**Resolution:**
- Updated the dashboard pipeline mapping.
- Ensured the actual `ApplicationLogEntity` timestamps and real events (e.g. `STATUS_CHANGED`) render perfectly on the timeline view.
