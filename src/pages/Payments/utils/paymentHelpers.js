// ==========================================
// FORMAT MONNAIE
// ==========================================

export function money(value) {
    return Number(value || 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
    });
}

// ==========================================
// PARSER DE DATE
// Compatible :
// - 2026-07-30
// - 2026-07-30T12:30:00
// - 30/07/2026
// ==========================================

export function parseDate(date) {
    if (!date) return null;

    if (date instanceof Date) {
        return date;
    }

    if (typeof date === "string") {
        // Format français : jj/mm/aaaa
        if (date.includes("/")) {
            const [day, month, year] = date.split("/");

            return new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );
        }

        // Format ISO
        return new Date(date);
    }

    return new Date(date);
}

// ==========================================
// FORMAT DATE
// ==========================================

export function formatDate(date) {
    const d = parseDate(date);

    if (!d || isNaN(d.getTime())) {
        return "-";
    }

    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

// ==========================================
// AUJOURD'HUI
// ==========================================

export function isToday(date) {
    const d = parseDate(date);

    if (!d || isNaN(d.getTime())) {
        return false;
    }

    const today = new Date();

    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

// ==========================================
// CETTE SEMAINE
// ==========================================

export function isThisWeek(date) {
    const d = parseDate(date);

    if (!d || isNaN(d.getTime())) {
        return false;
    }

    const today = new Date();

    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 7);

    return d >= firstDay && d < lastDay;
}

// ==========================================
// CE MOIS
// ==========================================

export function isThisMonth(date) {
    const d = parseDate(date);

    if (!d || isNaN(d.getTime())) {
        return false;
    }

    const today = new Date();

    return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}
// ==========================================
// COULEURS DES BADGES
// ==========================================

export function badgeColor(method) {
    switch (method) {
        case "Espèces":
            return "bg-green-100 text-green-700";

        case "Orange Money":
            return "bg-orange-100 text-orange-700";

        case "MTN Mobile Money":
            return "bg-yellow-100 text-yellow-700";

        case "Carte bancaire":
            return "bg-purple-100 text-purple-700";

        case "Virement":
            return "bg-blue-100 text-blue-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
}