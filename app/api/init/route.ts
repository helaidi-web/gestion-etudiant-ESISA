import { initializeDB, initializeDefaultUser } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await initializeDB();
    await initializeDefaultUser();
    return Response.json({
      message: "Database initialized successfully",
      defaultCredentials: {
        email: "admin@esisa.ac.ma",
        password: "admin123",
      },
    });
  } catch (error) {
    return Response.json({ error: "Failed to initialize database" }, { status: 500 });
  }
}
