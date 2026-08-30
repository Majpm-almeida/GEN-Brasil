export type AccessStatus = "pending" | "approved" | "rejected";

export function initialAccessStatus(email: string | null | undefined, managerEmail: string) : AccessStatus {
  return email?.trim().toLowerCase() === managerEmail.trim().toLowerCase() ? "approved" : "pending";
}

export function canEnterPlatform(status: AccessStatus) {
  return status === "approved";
}
