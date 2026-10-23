import { multiFactor } from "firebase/auth";

/** True when the user has at least one enrolled MFA factor. */
export function hasEnrolledMfa(user) {
  if (!user) return false;
  try {
    const factors = multiFactor(user).enrolledFactors || [];
    return factors.length > 0;
  } catch {
    return false;
  }
}

/**
 * When REACT_APP_REQUIRE_ADMIN_MFA=true, admins without MFA are blocked.
 * Default false until Identity Platform / MFA is enabled in Firebase Console.
 */
export function isAdminMfaRequired() {
  return process.env.REACT_APP_REQUIRE_ADMIN_MFA === "true";
}
