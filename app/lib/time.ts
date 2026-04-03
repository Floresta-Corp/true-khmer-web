function getElapsedMinutes(fromDate: Date, now: Date) {
    return Math.max(0, Math.floor((now.getTime() - fromDate.getTime()) / 60000))
}

export function getMinutesAgo(fromDateInput: Date | string | number, now = new Date()) {
    const fromDate = new Date(fromDateInput)

    if (Number.isNaN(fromDate.getTime())) {
        return null
    }

    return getElapsedMinutes(fromDate, now)
}

export function getHoursAgo(fromDateInput: Date | string | number, now = new Date()) {
    const minutesAgo = getMinutesAgo(fromDateInput, now)

    if (minutesAgo === null) {
        return null
    }

    return Math.floor(minutesAgo / 60)
}

export function formatMinutesOrHoursAgo(
    fromDateInput: Date | string | number,
    now = new Date(),
) {
    const fromDate = new Date(fromDateInput)

    if (Number.isNaN(fromDate.getTime())) {
        return ""
    }

    const minutesAgo = getMinutesAgo(fromDate, now)

    if (minutesAgo === null) {
        return ""
    }

    if (minutesAgo < 60) {
        return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`
    }

    if (minutesAgo >= 24 * 60) {
        return fromDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const hoursAgo = Math.floor(minutesAgo / 60)
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`
}