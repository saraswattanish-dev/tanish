# Firestore Zero-Trust Security Specification

This specification documents the validation invariants, access constraints, and threat surface attacks (The "Dirty Dozen") designed to test our attribute-based access control (ABAC) in Firestore.

## 1. Data Invariants

1. **User Invariant**: A user profile in `/users/{userId}` can only be created or written by the authenticated user whose `request.auth.uid` is exactly `userId`.
2. **PII Invariant**: Reads to `/users/{userId}` are strictly owner-only. No blanket public lists are permitted.
3. **Meeting Invariant**: A meeting in `/meetings/{meetingId}` must have an `ownerId` matching `request.auth.uid`.
4. **Temporal Invariant**: Creation timestamps (`createdAt`) and update timestamps (`updatedAt`) must exactly match `request.time`.
5. **Aesthetic/Boundary Invariants**: String parameters (e.g., titles, tokens) must contain size caps (`size() <= 1000`) to prevent denial-of-wallet payload attacks.

---

## 2. The "Dirty Dozen" Threat Payloads

### Payload 1: PII Leak Attack
*   **Attack Vector**: Attacker attempts to `get` or `list` private user details under `/users/other-user-123` while logged in as `attacker-456`.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 2: Self-Appointed Identity Registration
*   **Attack Vector**: Logged in as `attacker-456`, attempts to create `/users/victim-789` representing a separate user profile.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 3: Email Hijacking / Profile Drift
*   **Attack Vector**: Attacker attempts to update the email field in `/users/owner-123` without matching authentication.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 4: Orphaned/Spoofed Ownership Attack
*   **Attack Vector**: Attacker attempts to create a meeting `/meetings/meet-999` with `ownerId: "victim-321"` to impersonate or inject meetings into another user's dashboard.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 5: Immutable Owner Tampering
*   **Attack Vector**: Attacker attempts to update an existing meeting `/meetings/meet-111` owned by them, changing its `ownerId` to someone else to orphan the document.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 6: Playback Bypass / Temporal Spoofing
*   **Attack Vector**: Client tries to write a custom historical `createdAt` time (`2000-01-01T00:00:00Z`) instead of utilizing the synchronized `request.time` sentinel.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 7: Denial of Wallet Space Swamping (ID Poisoning)
*   **Attack Vector**: Client attempts to create a document with an ID consisting of 1,000 junk characters to exhaust system token parsers.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 8: Anonymous Guest Write Attempts
*   **Attack Vector**: Unauthenticated guest tries to list or write meeting recordings.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 9: Schema Omission / Malformed Contract Write
*   **Attack Vector**: Client attempts to create a meeting with missing required keys (e.g., omitting `participants` or `tasks` array structures).
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 10: Shadow Field Injection (Ghost Update)
*   **Attack Vector**: Attacker attempts to bypass whitelists during an update by injecting an undocumented parameter `isSystemVerified: true` during a title edit action.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 11: Bulk Unbounded Scrapers (Query Trust Violation)
*   **Attack Vector**: Attacker calls a blanket `list` query on `/meetings` without filtering by `ownerId == auth.uid`.
*   **Expected Result**: `PERMISSION_DENIED`

### Payload 12: Value Type Poisoning
*   **Attack Vector**: Attacker attempts to update `status` to an invalid boolean or an extremely large string instead of the accepted enums ("processing", "completed", "failed").
*   **Expected Result**: `PERMISSION_DENIED`
