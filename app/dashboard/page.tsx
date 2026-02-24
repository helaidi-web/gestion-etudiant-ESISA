"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  enrollment_date: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError("Erreur lors du chargement des étudiants");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStudents();
    }
  }, [status]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Gestion des Étudiants - ESISA
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Connecté: {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Liste des Étudiants</h2>
            <Link
              href="/dashboard/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              + Ajouter un étudiant
            </Link>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">Chargement des données...</div>
          ) : students.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500 mb-4">Aucun étudiant enregistré</p>
              <Link
                href="/dashboard/add"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Commencer par ajouter un étudiant
              </Link>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.enrollment_date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/edit/${student.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Êtes-vous sûr de vouloir supprimer cet étudiant?"
                              )
                            ) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  async function deleteStudent(id: number) {
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  }
}
