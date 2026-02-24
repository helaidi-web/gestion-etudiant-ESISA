import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return new Promise((resolve) => {
      db.all(
        "SELECT * FROM students ORDER BY created_at DESC",
        (err: any, rows: any) => {
          if (err) {
            resolve(
              NextResponse.json(
                { error: "Database error" },
                { status: 500 }
              )
            );
          } else {
            resolve(NextResponse.json(rows));
          }
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender,
      address,
      city,
      postal_code,
      country,
    } = data;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      db.run(
        `INSERT INTO students (first_name, last_name, email, phone, date_of_birth, gender, address, city, postal_code, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          email,
          phone || null,
          date_of_birth || null,
          gender || null,
          address || null,
          city || null,
          postal_code || null,
          country || null,
        ],
        function (err: any) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              resolve(
                NextResponse.json(
                  { error: "Email already exists" },
                  { status: 400 }
                )
              );
            } else {
              resolve(
                NextResponse.json(
                  { error: "Database error" },
                  { status: 500 }
                )
              );
            }
          } else {
            resolve(
              NextResponse.json(
                {
                  id: this.lastID,
                  first_name,
                  last_name,
                  email,
                  phone,
                  date_of_birth,
                  gender,
                  address,
                  city,
                  postal_code,
                  country,
                },
                { status: 201 }
              )
            );
          }
        }
      );
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
