import { db } from '../../db/index.js';
import { weeklyDrops } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { SubscribeWeeklyDropInput } from './weekly-drops.schema.js';

export class WeeklyDropsService {
  async subscribe(input: SubscribeWeeklyDropInput) {
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check if email is already in weekly_drops
    const existing = await db
      .select()
      .from(weeklyDrops)
      .where(eq(weeklyDrops.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].status !== 'active') {
        await db
          .update(weeklyDrops)
          .set({ status: 'active', updatedAt: new Date() })
          .where(eq(weeklyDrops.id, existing[0].id));
      }
      return {
        success: true,
        message: 'You are already subscribed to Weekly Drops!',
        alreadySubscribed: true,
      };
    }

    const [subscriber] = await db
      .insert(weeklyDrops)
      .values({
        email: normalizedEmail,
        source: input.source || 'footer',
        status: 'active',
      })
      .returning();

    return {
      success: true,
      message: 'Successfully subscribed to Weekly Drops!',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        createdAt: subscriber.createdAt,
      },
    };
  }

  async listSubscribers() {
    return db
      .select({
        id: weeklyDrops.id,
        email: weeklyDrops.email,
        source: weeklyDrops.source,
        status: weeklyDrops.status,
        createdAt: weeklyDrops.createdAt,
      })
      .from(weeklyDrops)
      .orderBy(weeklyDrops.createdAt);
  }
}
