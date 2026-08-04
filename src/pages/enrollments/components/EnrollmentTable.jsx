import {
    Eye,
    Pencil,
    Trash2,
    Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function EnrollmentTable({

    enrollments = [],

}) {

    if (!enrollments.length) {

        return (

            <div className="rounded-3xl bg-white p-20 text-center shadow">

                <h2 className="text-2xl font-bold">

                    Aucune inscription

                </h2>

                <p className="mt-2 text-slate-500">

                    Commencez par créer une inscription.

                </p>

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-3xl bg-white shadow">

            <table className="w-full">

                <thead className="border-b bg-slate-50">

                    <tr className="text-left">

                        <th className="px-6 py-5">

                            Étudiant

                        </th>

                        <th>

                            Formation

                        </th>

                        <th>

                            Frais

                        </th>

                        <th>

                            Réduction

                        </th>

                        <th>

                            Payé

                        </th>

                        <th>

                            Solde

                        </th>

                        <th>

                            Progression

                        </th>

                        <th>

                            Statut

                        </th>

                        <th className="text-center">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        enrollments.map((enrollment) => (

                            <tr
                                key={enrollment.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">

                                            {

                                                enrollment.student.first_name[0]

                                            }

                                            {

                                                enrollment.student.last_name[0]

                                            }

                                        </div>

                                        <div>

                                            <h3 className="font-semibold">

                                                {

                                                    enrollment.student.first_name

                                                }{" "}

                                                {

                                                    enrollment.student.last_name

                                                }

                                            </h3>

                                            <p className="text-sm text-slate-500">

                                                {

                                                    enrollment.enrollment_number

                                                }

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td>

                                    <div>

                                        <h3 className="font-semibold">

                                            {

                                                enrollment.training.title

                                            }

                                        </h3>

                                        <p className="text-sm text-slate-500">

                                            {

                                                enrollment.training.duration_months

                                            } mois

                                        </p>

                                    </div>

                                </td>

                                <td>

                                    <span className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-700">

                                        {

                                            Number(
                                                enrollment.total_amount
                                            ).toLocaleString()

                                        } FCFA

                                    </span>

                                </td>

                                <td>

                                    <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">

                                        {

                                            Number(
                                                enrollment.discount
                                            ).toLocaleString()

                                        } FCFA

                                    </span>

                                </td>

                                <td className="font-semibold text-green-700">

                                    {

                                        Number(
                                            enrollment.amount_paid
                                        ).toLocaleString()

                                    } FCFA

                                </td>

                                <td className="font-semibold text-red-600">

                                    {

                                        Number(
                                            enrollment.balance
                                        ).toLocaleString()

                                    } FCFA

                                </td>

                                <td className="w-56">

                                    <div className="space-y-2">

                                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                            <div

                                                className="h-full rounded-full bg-green-500"

                                                style={{

                                                    width: `${enrollment.payment_progress}%`,

                                                }}

                                            />

                                        </div>

                                        <span className="text-sm font-semibold">

                                            {

                                                enrollment.payment_progress

                                            } %

                                        </span>

                                    </div>

                                </td>

                                <td>

                                    {

                                        enrollment.status === "paid" && (

                                            <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

                                                Soldée

                                            </span>

                                        )

                                    }

                                    {

                                        enrollment.status === "partial" && (

                                            <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">

                                                Partielle

                                            </span>

                                        )

                                    }

                                    {

                                        enrollment.status === "pending" && (

                                            <span className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">

                                                En attente

                                            </span>

                                        )

                                    }

                                </td>

                                <td>

                                    <div className="flex justify-center gap-2">

                                        <Link

                                            to={`/enrollments/${enrollment.id}`}

                                            className="rounded-xl bg-blue-100 p-3 text-blue-700 hover:bg-blue-200"

                                        >

                                            <Eye size={18} />

                                        </Link>

                                        <Link

                                            to={`/enrollments/${enrollment.id}/edit`}

                                            className="rounded-xl bg-yellow-100 p-3 text-yellow-700 hover:bg-yellow-200"

                                        >

                                            <Pencil size={18} />

                                        </Link>

                                        <Link

                                            to={`/payments/create?enrollment=${enrollment.id}`}

                                            className="rounded-xl bg-green-100 p-3 text-green-700 hover:bg-green-200"

                                        >

                                            <Wallet size={18} />

                                        </Link>

                                        <button

                                            className="rounded-xl bg-red-100 p-3 text-red-700 hover:bg-red-200"

                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}