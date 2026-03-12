# Candidate Task List

Please complete the following tasks. Each task builds on the existing codebase (SQLite3 + Express.js + pure HTML).

## Tasks

- [X] **Task 1 — Add Employee**
  Create an "Add Employee" form that allows submitting a new employee record to the database via a `POST /api/employees` endpoint.

- [X] **Task 2 — Edit Employee**
  Add an "Edit" button on each row that opens a form pre-filled with the employee's current data. Implement a `PUT /api/employees/:id` endpoint to save changes.

- [X] **Task 3 — Delete Employee**
  Add a "Delete" button on each row with a confirmation prompt. Implement a `DELETE /api/employees/:id` endpoint to remove the record.

- [X] **Task 4 — Pagination**
  Limit the employee table to 5 rows per page. Add Previous / Next controls and a page indicator. Pagination should work together with search and department filter.

- [X] **Task 5 — Department Salary Pie Chart**
  Add a `GET /api/salary-by-department` endpoint that returns the total salary grouped by department. On the frontend, render a pie chart using only pure HTML5 Canvas (no external chart libraries) that visualises each department's share of the total salary. Display the chart on the employee directory page.
