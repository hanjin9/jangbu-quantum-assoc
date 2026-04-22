import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, consultationBookings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Save consultation booking
 */
export async function saveConsultationBooking(data: {
  userId: number;
  name: string;
  phone: string;
  consultationContent?: string;
  recordingUrl?: string;
  recordingDuration?: number;
  fileUrls?: string; // JSON array
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save consultation booking: database not available");
    return null;
  }

  try {
    const result = await db.insert(consultationBookings).values({
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      consultationContent: data.consultationContent,
      recordingUrl: data.recordingUrl,
      recordingDuration: data.recordingDuration,
      fileUrls: data.fileUrls,
      status: "pending",
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to save consultation booking:", error);
    throw error;
  }
}

/**
 * Get consultation bookings by user ID
 */
export async function getConsultationBookingsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get consultation bookings: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(consultationBookings)
      .where(eq(consultationBookings.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get consultation bookings:", error);
    throw error;
  }
}

/**
 * Get all consultation bookings (admin)
 */
export async function getAllConsultationBookings() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get consultation bookings: database not available");
    return [];
  }

  try {
    const result = await db.select().from(consultationBookings);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get all consultation bookings:", error);
    throw error;
  }
}

/**
 * Update consultation booking status
 */
export async function updateConsultationBookingStatus(
  bookingId: number,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update consultation booking: database not available");
    return null;
  }

  try {
    const result = await db
      .update(consultationBookings)
      .set({ status })
      .where(eq(consultationBookings.id, bookingId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update consultation booking:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
