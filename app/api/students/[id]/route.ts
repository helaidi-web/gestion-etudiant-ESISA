import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    return new Promise((resolve) => {
      db.get("SELECT * FROM students WHERE id = ?", [id], (err: any, row: any) => {
        if (err) {
          resolve(
            NextResponse.json({ error: "Database error" }, { status: 500 })
          );
        } else if (!row) {
          resolve(
            NextResponse.json({ error: "Student not found" }, { status: 404 })
          );
        } else {
          resolve(NextResponse.json(row));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
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
      status,
    } = data;

    return new Promise((resolve) => {
      db.run(
        `UPDATE students SET 
         first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?,
         gender = ?, address = ?, city = ?, postal_code = ?, country = ?, status = ?,
         updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
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
          status || "active",
          id,
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
          } else if (this.changes === 0) {
            resolve(
              NextResponse.json({ error: "Student not found" }, { status: 404 })
            );
          } else {
            resolve(
              NextResponse.json(
                { message: "Student updated successfully" },
                { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    return new Promise((resolve) => {
      db.run("DELETE FROM students WHERE id = ?", [id], function (err: any) {
        if (err) {
          resolve(
            NextResponse.json({ error: "Database error" }, { status: 500 })
          );
        } else if (this.changes === 0) {
          resolve(
            NextResponse.json({ error: "Student not found" }, { status: 404 })
          );
        } else {
          resolve(
            NextResponse.json(
              { message: "Student deleted successfully" },
              { status: 200 }
            )
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
