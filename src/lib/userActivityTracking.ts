/**
 * User Activity Tracking Service
 * Tracks user statistics: consultations, articles read, and active days
 */

export interface UserActivity {
  email: string;
  consultationCount: number;
  articlesRead: string[]; // Array of article IDs to prevent duplicates
  activeDays: string[]; // Array of dates (YYYY-MM-DD format)
  lastUpdated: string;
}

const STORAGE_KEY = 'userActivities';

/**
 * Get current user's email from localStorage
 */
function getCurrentUserEmail(): string | null {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    const userData = JSON.parse(user);
    return userData.email || null;
  } catch (error) {
    console.error('Error getting current user email:', error);
    return null;
  }
}

/**
 * Get all user activities from localStorage
 */
function getAllActivities(): UserActivity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading user activities:', error);
    return [];
  }
}

/**
 * Save user activities to localStorage
 */
function saveActivities(activities: UserActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving user activities:', error);
  }
}

/**
 * Get or create user activity record
 */
function getUserActivity(email: string): UserActivity {
  const activities = getAllActivities();
  let userActivity = activities.find(a => a.email === email);
  
  if (!userActivity) {
    userActivity = {
      email,
      consultationCount: 0,
      articlesRead: [],
      activeDays: [],
      lastUpdated: new Date().toISOString()
    };
    activities.push(userActivity);
    saveActivities(activities);
  }
  
  return userActivity;
}

/**
 * Update user activity record
 */
function updateUserActivity(activity: UserActivity): void {
  const activities = getAllActivities();
  const index = activities.findIndex(a => a.email === activity.email);
  
  if (index !== -1) {
    activities[index] = {
      ...activity,
      lastUpdated: new Date().toISOString()
    };
  } else {
    activities.push({
      ...activity,
      lastUpdated: new Date().toISOString()
    });
  }
  
  saveActivities(activities);
}

/**
 * Track a consultation (increments count)
 */
export function trackConsultation(): void {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const activity = getUserActivity(email);
  activity.consultationCount += 1;
  updateUserActivity(activity);
}

/**
 * Track an article read (prevents duplicates)
 * @param articleId Unique identifier for the article (e.g., disease name)
 */
export function trackArticleRead(articleId: string): void {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const activity = getUserActivity(email);
  
  // Only add if not already read
  if (!activity.articlesRead.includes(articleId)) {
    activity.articlesRead.push(articleId);
    updateUserActivity(activity);
  }
}

/**
 * Track daily activity (adds today's date if not already tracked)
 */
export function trackDailyActivity(): void {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const activity = getUserActivity(email);
  
  // Only add if today not already tracked
  if (!activity.activeDays.includes(today)) {
    activity.activeDays.push(today);
    updateUserActivity(activity);
  }
}

/**
 * Get statistics for current user
 */
export interface UserStats {
  consultationCount: number;
  articlesReadCount: number;
  activeDaysCount: number;
}

export function getUserStats(): UserStats {
  const email = getCurrentUserEmail();
  
  if (!email) {
    return {
      consultationCount: 0,
      articlesReadCount: 0,
      activeDaysCount: 0
    };
  }
  
  const activity = getUserActivity(email);
  
  return {
    consultationCount: activity.consultationCount,
    articlesReadCount: activity.articlesRead.length,
    activeDaysCount: activity.activeDays.length
  };
}

/**
 * Reset all statistics for current user (for testing)
 */
export function resetUserStats(): void {
  const email = getCurrentUserEmail();
  if (!email) return;
  
  const activities = getAllActivities();
  const index = activities.findIndex(a => a.email === email);
  
  if (index !== -1) {
    activities.splice(index, 1);
    saveActivities(activities);
  }
}

/**
 * Get all statistics (for admin/debugging)
 */
export function getAllUserStats(): UserActivity[] {
  return getAllActivities();
}
