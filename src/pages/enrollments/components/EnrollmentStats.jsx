import {
    Users,
    BookOpen,
    Wallet,
    CircleDollarSign,
} from "lucide-react";

import StatCard from "../../../components/cards/StatCard";

export default function EnrollmentStats({

    total,

    pending,

    partial,

    paid,

}) {

    return (

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
                title="Total inscriptions"
                value={total}
                icon={BookOpen}
                color="blue"
            />

            <StatCard
                title="En attente"
                value={pending}
                icon={Users}
                color="orange"
            />

            <StatCard
                title="Paiements partiels"
                value={partial}
                icon={Wallet}
                color="purple"
            />

            <StatCard
                title="Soldées"
                value={paid}
                icon={CircleDollarSign}
                color="green"
            />

        </section>

    );

}