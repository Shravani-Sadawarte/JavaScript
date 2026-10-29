
export function parseDuration(value) {
  const parts = value.trim().split(":");

  if (parts.length === 1) {
    const minutes = Number(parts[0]);
    return Number.isFinite(minutes) && minutes > 0
      ? Math.round(minutes * 60)
      : 0;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts.map(Number);

    if (
      !parts.every(part => part.trim() !== "" && Number.isInteger(Number(part))) ||
      hours < 0 || minutes < 0 || minutes > 59 ||
      seconds < 0 || seconds > 59 ||
      hours < 0
    ) {
      return 0;
    }

    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : 0;
  }

  return 0;
}

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map(value => String(value).padStart(2, "0"))
    .join(":");
}

export function formatActualTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainder}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainder}s`;
  }

  return `${remainder}s`;
}

export function startClock(callback) {
  callback();
  return setInterval(callback, 200);
}
