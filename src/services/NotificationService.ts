import { Task } from '@/types/lifeEvent';

export interface ReminderSettings {
  enabled: boolean;
  daysBeforeDeadline: number[]; // e.g., [1, 3, 7] for 1 day, 3 days, 7 days before
  notificationTime: string; // e.g., "09:00" for 9 AM
}

export interface ScheduledReminder {
  id: string;
  type: 'task' | 'subscription';
  targetId: string; // taskId or subscriptionId
  title: string; // taskTitle or subscriptionName
  deadline: string;
  reminderDate: Date;
  eventId?: string;
  sent: boolean;
  amount?: number;
  currency?: string;
}

const STORAGE_KEY = 'lifebridge_reminder_settings';
const REMINDERS_KEY = 'lifebridge_scheduled_reminders';

export class NotificationService {
  private static instance: NotificationService;
  private settings: ReminderSettings;
  private scheduledReminders: ScheduledReminder[] = [];
  private checkInterval: number | null = null;

  private constructor() {
    this.settings = this.loadSettings();
    this.scheduledReminders = this.loadReminders();
    this.startReminderCheck();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission from browser
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Check if notifications are supported and permitted
  isNotificationEnabled(): boolean {
    return (
      'Notification' in window &&
      Notification.permission === 'granted' &&
      this.settings.enabled
    );
  }

  // Get current settings
  getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  // Update settings
  updateSettings(newSettings: Partial<ReminderSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  // Calculate deadline date from task deadline string
  private parseDeadline(deadlineStr: string, eventDate?: Date): Date | null {
    const now = eventDate || new Date();

    // Handle relative deadlines like "出生から14日以内", "引越し後14日以内"
    const daysMatch = deadlineStr.match(/(\d+)日/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + days);
      return deadline;
    }

    // Handle specific date string (YYYY-MM-DD)
    const dateMatch = deadlineStr.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dateMatch) {
      return new Date(deadlineStr);
    }

    // Try parsing as standard date
    const date = new Date(deadlineStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  }

  // Schedule reminders for a subscription
  scheduleSubscriptionReminder(
    subscription: { id: string; name: string; nextPaymentDate: string; amount: number; currency: string; reminderDays?: number[] }
  ): void {
    if (!subscription.nextPaymentDate) return;

    const deadlineDate = new Date(subscription.nextPaymentDate);
    // Validate date
    if (isNaN(deadlineDate.getTime())) return;

    // Remove existing reminders for this subscription
    this.scheduledReminders = this.scheduledReminders.filter(
      (r) => !(r.type === 'subscription' && r.targetId === subscription.id)
    );

    // Use custom reminder days or default (1 day before and On the day)
    // Default: Today(0), Yesterday(1), 3 Days before(3)
    const reminderDays = subscription.reminderDays && subscription.reminderDays.length > 0
      ? subscription.reminderDays
      : [0, 1, 3];

    reminderDays.forEach((daysBefore) => {
      const reminderDate = new Date(deadlineDate);
      reminderDate.setDate(reminderDate.getDate() - daysBefore);

      // Set notification time (default 09:00)
      if (this.settings.notificationTime && this.settings.notificationTime.includes(':')) {
        const [hours, minutes] = this.settings.notificationTime.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        reminderDate.setHours(9, 0, 0, 0);
      }

      const now = new Date();
      let finalReminderTime = reminderDate.getTime();

      // If the calculated reminder time has passed
      if (finalReminderTime <= now.getTime()) {
        // If it's today but the scheduled time has passed, schedule it for immediate future (5 seconds later)
        // This ensures the user still receives the notification if they open the app late on the reminder day.
        if (reminderDate.toDateString() === now.toDateString()) {
          finalReminderTime = now.getTime() + 5000; // Schedule 5 seconds from now
        } else {
          // It's a past date (yesterday or before), so skip scheduling this reminder
          return;
        }
      }

      const reminder: ScheduledReminder = {
        id: `sub-${subscription.id}-${daysBefore}d`,
        type: 'subscription',
        targetId: subscription.id,
        title: subscription.name,
        deadline: subscription.nextPaymentDate,
        reminderDate: new Date(finalReminderTime), // Use the potentially adjusted time
        sent: false,
        amount: subscription.amount,
        currency: subscription.currency
      };

      this.scheduledReminders.push(reminder);
    });

    this.saveReminders();
  }

  // Schedule reminders for a task
  scheduleRemindersForTask(
    task: Task,
    eventId: string,
    eventDate?: Date
  ): void {
    if (!task.deadline) return;

    const deadlineDate = this.parseDeadline(task.deadline, eventDate);
    if (!deadlineDate) return;

    // Remove existing reminders for this task
    this.scheduledReminders = this.scheduledReminders.filter(
      (r) => !(r.type === 'task' && r.targetId === task.id)
    );

    // Create reminders based on settings
    this.settings.daysBeforeDeadline.forEach((daysBefore) => {
      const reminderDate = new Date(deadlineDate);
      reminderDate.setDate(reminderDate.getDate() - daysBefore);

      // Set specific time if configured
      if (this.settings.notificationTime && this.settings.notificationTime.includes(':')) {
        const [hours, minutes] = this.settings.notificationTime.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      // Only schedule if reminder is in the future
      if (reminderDate > new Date()) {
        const reminder: ScheduledReminder = {
          id: `${task.id}-${daysBefore}d`,
          type: 'task',
          targetId: task.id,
          title: task.title,
          deadline: task.deadline,
          reminderDate,
          eventId,
          sent: false,
        };

        this.scheduledReminders.push(reminder);
      }
    });

    this.saveReminders();
  }

  // Get all scheduled reminders
  getScheduledReminders(): ScheduledReminder[] {
    return [...this.scheduledReminders].sort(
      (a, b) => a.reminderDate.getTime() - b.reminderDate.getTime()
    );
  }

  // Get upcoming reminders (within next 7 days)
  getUpcomingReminders(): ScheduledReminder[] {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return this.scheduledReminders.filter(
      (r) =>
        !r.sent &&
        r.reminderDate >= now &&
        r.reminderDate <= weekFromNow
    );
  }

  // Send a test notification with sound
  sendTestNotification(): void {
    if (!this.isNotificationEnabled()) return;

    this.playAlertSound();
    new Notification('LifeBridge - 通知テスト', {
      body: 'これはサブスクリプションリマインダーのテスト通知です。',
      icon: '/favicon.ico',
    });
  }

  // Play a pleasant notification sound using Web Audio API
  private playAlertSound() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // "Ding" sound (Sine wave, high pitch, quick decay)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Failed to play notification sound:', e);
    }
  }

  // Send a notification
  private sendNotification(reminder: ScheduledReminder): void {
    if (!this.isNotificationEnabled()) return;

    // Play sound
    this.playAlertSound();

    let title, body, tag;

    if (reminder.type === 'subscription') {
      title = `サブスクリプションの更新通知`;
      const amountStr = reminder.currency === 'JPY'
        ? `¥${reminder.amount?.toLocaleString()}`
        : `$${reminder.amount?.toLocaleString()}`;
      body = `「${reminder.title}」の支払日が近づいています\n金額: ${amountStr}\n更新日: ${reminder.deadline}`;
      tag = `sub-${reminder.targetId}`;
    } else {
      title = 'LifeBridge - 期限リマインダー';
      body = `「${reminder.title}」の期限が近づいています\n期限: ${reminder.deadline}`;
      tag = reminder.id;
    }

    const notification = new Notification(title, {
      body: body,
      icon: '/favicon.ico', // Ideally replace with category icon
      badge: '/favicon.ico',
      tag: tag,
      requireInteraction: false,
      data: {
        type: reminder.type,
        id: reminder.targetId,
        eventId: reminder.eventId,
      },
    });

    notification.onclick = () => {
      window.focus();

      if (reminder.type === 'subscription') {
        window.dispatchEvent(
          new CustomEvent('navigate-to-subscription', {
            detail: { subscriptionId: reminder.targetId }
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent('navigate-to-task', {
            detail: {
              eventId: reminder.eventId,
              taskId: reminder.targetId,
            },
          })
        );
      }
      notification.close();
    };

    // Mark as sent
    const index = this.scheduledReminders.findIndex((r) => r.id === reminder.id);
    if (index !== -1) {
      this.scheduledReminders[index].sent = true;
      this.saveReminders();
    }
  }

  // Check for due reminders (called periodically)
  private checkReminders(): void {
    if (!this.isNotificationEnabled()) return;

    const now = new Date();
    const dueReminders = this.scheduledReminders.filter(
      (r) => !r.sent && r.reminderDate <= now
    );

    dueReminders.forEach((reminder) => {
      this.sendNotification(reminder);
    });
  }

  // Start periodic reminder check
  private startReminderCheck(): void {
    if (this.checkInterval) return;

    // Check every minute
    this.checkInterval = window.setInterval(() => {
      this.checkReminders();
    }, 60000);

    // Also check immediately
    this.checkReminders();
  }

  // Stop periodic reminder check
  stopReminderCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Clear a specific reminder
  clearReminder(reminderId: string): void {
    this.scheduledReminders = this.scheduledReminders.filter(
      (r) => r.id !== reminderId
    );
    this.saveReminders();
  }

  // Clear all reminders for a task
  clearTaskReminders(taskId: string): void {
    this.scheduledReminders = this.scheduledReminders.filter(
      (r) => !(r.type === 'task' && r.targetId === taskId)
    );
    this.saveReminders();
  }

  // Storage methods
  private loadSettings(): ReminderSettings {
    const defaultSettings: ReminderSettings = {
      enabled: true,
      daysBeforeDeadline: [1, 3, 7],
      notificationTime: '09:00',
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load reminder settings', e);
    }

    return defaultSettings;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save reminder settings', e);
    }
  }

  private loadReminders(): ScheduledReminder[] {
    try {
      const stored = localStorage.getItem(REMINDERS_KEY);
      if (stored) {
        const reminders = JSON.parse(stored);
        // Convert date strings back to Date objects
        return reminders.map((r: any) => ({
          ...r,
          reminderDate: new Date(r.reminderDate),
        }));
      }
    } catch (e) {
      console.error('Failed to load reminders', e);
    }
    return [];
  }

  private saveReminders(): void {
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(this.scheduledReminders));
    } catch (e) {
      console.error('Failed to save reminders', e);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
