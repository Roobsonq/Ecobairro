import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  datetime,
  json
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow with role-based access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["morador", "prefeitura", "cooperativa", "admin"]).default("morador").notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  neighborhood: varchar("neighborhood", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).default("0"),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).default("0"),
  engagementScore: int("engagementScore").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Agendamentos de coleta seletiva.
 */
export const schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  materialType: varchar("materialType", { length: 100 }).notNull(), // papel, plástico, vidro, metal, eletrônicos, pilhas, óleo, etc
  estimatedVolume: varchar("estimatedVolume", { length: 50 }).notNull(), // pequeno, médio, grande
  address: text("address").notNull(),
  neighborhood: varchar("neighborhood", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).default("0"),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["pendente", "confirmado", "concluído"]).default("pendente").notNull(),
  notes: text("notes"),
  scheduledDate: datetime("scheduledDate"),
  completedDate: datetime("completedDate"),
  collectedVolume: varchar("collectedVolume", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;

/**
 * Pontos de descarte específicos por tipo de resíduo.
 */
export const disposalPoints = mysqlTable("disposal_points", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  materialTypes: json("materialTypes").$type<string[]>().notNull(), // JSON array de tipos de resíduos
  address: text("address").notNull(),
  neighborhood: varchar("neighborhood", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull().default("0"),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull().default("0"),
  phone: varchar("phone", { length: 20 }),
  operatingHours: varchar("operatingHours", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DisposalPoint = typeof disposalPoints.$inferSelect;
export type InsertDisposalPoint = typeof disposalPoints.$inferInsert;

/**
 * Conteúdo educativo sobre reciclagem e separação de resíduos.
 */
export const educationContent = mysqlTable("education_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // dicas, benefícios, como-fazer, etc
  materialType: varchar("materialType", { length: 100 }), // opcional, para conteúdo específico
  content: text("content").notNull(), // conteúdo em markdown ou HTML
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationContent = typeof educationContent.$inferSelect;
export type InsertEducationContent = typeof educationContent.$inferInsert;

/**
 * Métricas de coleta e reciclagem.
 */
export const metrics = mysqlTable("metrics", {
  id: int("id").autoincrement().primaryKey(),
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  totalVolumeCollected: decimal("totalVolumeCollected", { precision: 10, scale: 2 }).default("0").notNull(), // em kg
  baselineVolume: decimal("baselineVolume", { precision: 10, scale: 2 }).default("0").notNull(), // volume base para cálculo de aumento
  percentageIncrease: decimal("percentageIncrease", { precision: 5, scale: 2 }).default("0").notNull(), // aumento percentual
  totalSchedules: int("totalSchedules").default(0).notNull(),
  completedSchedules: int("completedSchedules").default(0).notNull(),
  activeUsers: int("activeUsers").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

/**
 * Notificações para usuários.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["agendamento", "coleta", "educacao", "sistema"]).default("sistema").notNull(),
  relatedScheduleId: int("relatedScheduleId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
