import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "lib", "students.db");

// Ensure the directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

export const db = new sqlite3.Database(dbPath);

// Initialize database with tables
export const initializeDB = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err && !err.message.includes("already exists")) {
            reject(err);
          }
        }
      );

      // Create students table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          date_of_birth DATE,
          gender TEXT,
          address TEXT,
          city TEXT,
          postal_code TEXT,
          country TEXT,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err && !err.message.includes("already exists")) {
            reject(err);
          }
        }
      );

      // Create courses table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          code TEXT UNIQUE NOT NULL,
          description TEXT,
          credits INTEGER,
          semester TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err && !err.message.includes("already exists")) {
            reject(err);
          }
        }
      );

      // Create enrollments table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS enrollments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          grade TEXT,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          FOREIGN KEY(student_id) REFERENCES students(id),
          FOREIGN KEY(course_id) REFERENCES courses(id)
        )
      `,
        (err) => {
          if (err && !err.message.includes("already exists")) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
};

export const initializeDefaultUser = async () => {
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  return new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT OR IGNORE INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
      ["admin@esisa.ac.ma", "Admin", hashedPassword, "admin"],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};
