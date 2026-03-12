const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Task 4 - add pagination
app.get("/api/employees", (req, res) => {
  const {
    search,
    department,
    sort = "id",
    order = "asc",
    page = 1,
    limit = 5,
  } = req.query;

  const allowedSort = [
    "id",
    "name",
    "department",
    "position",
    "hire_date",
    "salary",
  ];
  const allowedOrder = ["asc", "desc"];
  const sortCol = allowedSort.includes(sort) ? sort : "id";
  const sortOrder = allowedOrder.includes(order) ? order : "asc";

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let where = "WHERE 1=1";
  const params = [];

  if (search) {
    where += " AND (name LIKE ? OR position LIKE ? OR email LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (department && department !== "all") {
    where += " AND department = ?";
    params.push(department);
  }

  // total count for pagination
  const total = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM employees
    ${where}
  `,
    )
    .get(...params).count;

  const employees = db
    .prepare(
      `
    SELECT *
    FROM employees
    ${where}
    ORDER BY ${sortCol} ${sortOrder.toUpperCase()}
    LIMIT ?
    OFFSET ?
  `,
    )
    .all(...params, limitNum, offset);

  res.json({
    data: employees,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

app.get("/api/departments", (req, res) => {
  const departments = db
    .prepare("SELECT DISTINCT department FROM employees ORDER BY department")
    .all();
  res.json(departments.map((d) => d.department));
});

// Task 1 - add employee
app.post("/api/employees", (req, res) => {
  const { name, department, position, email, phone, hire_date, salary } =
    req.body;
  if (
    !name ||
    !department ||
    !position ||
    !email ||
    !hire_date ||
    salary === undefined ||
    salary === ""
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const salaryNum = parseFloat(salary);
  if (isNaN(salaryNum) || salaryNum < 0) {
    return res.status(400).json({ error: "Invalid salary." });
  }

  if (phone && !/^\d+$/.test(phone)) {
    return res.status(400).json({
      error: "Phone number must contain digits only.",
    });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO employees (name, department, position, email, phone, hire_date, salary)
      VALUES (@name, @department, @position, @email, @phone, @hire_date, @salary)
    `);
    const result = stmt.run({
      name,
      department,
      position,
      email,
      phone: phone || null,
      hire_date,
      salary: salaryNum,
    });
    const newEmp = db
      .prepare("SELECT * FROM employees WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(newEmp);
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res
        .status(409)
        .json({ error: "An employee with that email already exists." });
    }
    res.status(500).json({ error: "Failed to create employee." });
  }
});

// Task 2 - edit employee
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  const { name, department, position, email, phone, hire_date, salary } =
    req.body;

  if (
    !name ||
    !department ||
    !position ||
    !email ||
    !hire_date ||
    salary === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const salaryNum = parseFloat(salary);

  if (isNaN(salaryNum) || salaryNum < 0) {
    return res.status(400).json({ error: "Invalid salary." });
  }

  try {
    const stmt = db.prepare(`
      UPDATE employees
      SET
        name = ?,
        department = ?,
        position = ?,
        email = ?,
        phone = ?,
        hire_date = ?,
        salary = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      name,
      department,
      position,
      email,
      phone || null,
      hire_date,
      salaryNum,
      id,
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const updated = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);

    res.json(updated);
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        error: "An employee with that email already exists.",
      });
    }

    console.error(err);

    res.status(500).json({ error: "Failed to update employee." });
  }
});

// Task 3 - delete employee
app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare(`
      DELETE FROM employees
      WHERE id = ?
    `);

    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Employee not found.",
      });
    }

    res.json({
      message: "Employee deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete employee.",
    });
  }
});

// Task 5-  salary by department
app.get("/api/salary-by-department", (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT department, SUM(salary) as total
    FROM employees
    GROUP BY department
    ORDER BY total DESC
  `,
    )
    .all();
  res.json(rows);
});

// get full stats
app.get("/api/stats", (req, res) => {
  const row = db
    .prepare(
      `
    SELECT COUNT(*) as total, AVG(salary) as avgSalary
    FROM employees
  `,
    )
    .get();
  res.json(row);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
