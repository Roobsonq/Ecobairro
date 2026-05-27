import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, schedules, InsertSchedule, disposalPoints, educationContent, metrics, InsertMetric, notifications, InsertNotification } from "../drizzle/schema";
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
 * Schedules queries
 */
export async function createSchedule(data: InsertSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schedules).values(data);
  return result;
}

export async function getSchedulesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(schedules).where(eq(schedules.userId, userId));
}

export async function getScheduleById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(schedules).where(eq(schedules.id, id)).limit(1);
  return result[0];
}

export async function updateScheduleStatus(id: number, status: "pendente" | "confirmado" | "concluído") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(schedules).set({ status }).where(eq(schedules.id, id));
}

/**
 * Disposal Points queries
 */
export async function getDisposalPoints() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(disposalPoints).where(eq(disposalPoints.isActive, true));
}

export async function getDisposalPointById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(disposalPoints).where(eq(disposalPoints.id, id)).limit(1);
  return result[0];
}

/**
 * Education Content queries
 */
export async function getEducationContent() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(educationContent).where(eq(educationContent.isActive, true));
}

export async function getEducationContentByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(educationContent).where(
    and(eq(educationContent.category, category), eq(educationContent.isActive, true))
  );
}

/**
 * Metrics queries
 */
export async function getMetricsByMonth(month: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(metrics).where(eq(metrics.month, month)).limit(1);
  return result[0];
}

export async function createOrUpdateMetric(data: InsertMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getMetricsByMonth(data.month);
  if (existing) {
    return db.update(metrics).set(data).where(eq(metrics.month, data.month));
  }
  return db.insert(metrics).values(data);
}

/**
 * Notifications queries
 */
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notifications).values(data);
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id));
}
