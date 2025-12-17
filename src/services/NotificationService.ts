import { Task } from '@/types/lifeEvent';

export interface ReminderSettings {
  enabled: boolean;
  daysBeforeDeadline: number[]; // e.g., [1, 3, 7] for 1 day, 3 days, 7 days before
  notificationTime: string; // e.g., "09:00" for 9 AM
}

export interface ScheduledReminder {
  id: string;
  taskId: string;
  taskTitle: string;
  deadline: string;
  reminderDate: Date;
  eventId: string;
  sent: boolean;
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

    // Handle specific dates if provided (future enhancement)
    // For now, return null for non-parseable deadlines
    return null;
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
      (r) => r.taskId !== task.id
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
          taskId: task.id,
          taskTitle: task.title,
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

  // Send a notification
  private sendNotification(reminder: ScheduledReminder): void {
    if (!this.isNotificationEnabled()) return;

    const notification = new Notification('LifeBridge - 期限リマインダー', {
      body: `「${reminder.taskTitle}」の期限が近づいています\n期限: ${reminder.deadline}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: reminder.id,
      requireInteraction: false,
      data: {
        taskId: reminder.taskId,
        eventId: reminder.eventId,
      },
    });

    notification.onclick = () => {
      window.focus();
      // Navigate to the task (this would need to be handled by the app)
      window.dispatchEvent(
        new CustomEvent('navigate-to-task', {
          detail: {
            eventId: reminder.eventId,
            taskId: reminder.taskId,
          },
        })
      );
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
      (r) => r.taskId !== taskId
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
