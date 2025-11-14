// Analytics implementation without ApiClient dependency

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

interface AnalyticsUser {
  id?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

class Analytics {
  private user: AnalyticsUser | null = null;
  private sessionId: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics() {
    const dev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';
    const devEnable = localStorage.getItem('analytics_dev_enable');
    const analyticsOptOut = localStorage.getItem('analytics_opt_out');
    if (analyticsOptOut === 'true') {
      this.isEnabled = false;
    }
    if (dev && devEnable !== 'true') {
      this.isEnabled = false;
    }

    // Track page view on initialization
    this.trackPageView();
  }

  private trackPageView() {
    if (!this.isEnabled) return;

    this.trackEvent('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      url: window.location.href,
      session_id: this.sessionId
    });
  }

  public setUser(user: AnalyticsUser) {
    this.user = user;
  }

  public trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        ...(this.user && {
          user_id: this.user.id,
          username: this.user.username,
          email: this.user.email
        })
      },
      timestamp: new Date().toISOString()
    };

    // Send to backend
    this.sendEvent(eventData);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }
  }

  private async sendEvent(eventData: AnalyticsEvent) {
    try {
      // Send analytics event to backend
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
      // Store in localStorage as fallback
      this.storeEventLocally(eventData);
    }
  }

  private storeEventLocally(eventData: AnalyticsEvent) {
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    storedEvents.push(eventData);
    
    // Keep only last 100 events to prevent storage bloat
    if (storedEvents.length > 100) {
      storedEvents.shift();
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
  }

  public async flushStoredEvents() {
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    
    if (storedEvents.length === 0) return;

    const failedEvents: AnalyticsEvent[] = [];

    for (const event of storedEvents) {
      try {
        await apiClient.trackAnalyticsEvent(event.event, event.properties);
      } catch (error) {
        failedEvents.push(event);
      }
    }

    // Store failed events back to localStorage
    localStorage.setItem('analytics_events', JSON.stringify(failedEvents));
  }

  public optOut() {
    this.isEnabled = false;
    localStorage.setItem('analytics_opt_out', 'true');
    this.trackEvent('analytics_opt_out');
  }

  public optIn() {
    this.isEnabled = true;
    localStorage.removeItem('analytics_opt_out');
    this.trackEvent('analytics_opt_in');
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  // Predefined event methods for common actions
  public trackUserLogin(method: string, success: boolean) {
    this.trackEvent('user_login', { method, success });
  }

  public trackUserLogout() {
    this.trackEvent('user_logout');
  }

  public trackWorkCreation(workId: string, workType: string) {
    this.trackEvent('work_created', { work_id: workId, work_type: workType });
  }

  public trackWorkView(workId: string, workTitle: string) {
    this.trackEvent('work_viewed', { work_id: workId, work_title: workTitle });
  }

  public trackWorkLike(workId: string, workTitle: string, liked: boolean) {
    this.trackEvent('work_liked', { work_id: workId, work_title: workTitle, liked });
  }

  public trackWorkComment(workId: string, workTitle: string) {
    this.trackEvent('work_commented', { work_id: workId, work_title: workTitle });
  }

  public trackUserFollow(userId: string, username: string, followed: boolean) {
    this.trackEvent('user_followed', { target_user_id: userId, target_username: username, followed });
  }

  public trackSocialNavigation(section: string) {
    this.trackEvent('social_navigation', { section });
  }

  public trackError(error: string, context: string) {
    this.trackEvent('error_occurred', { error, context });
  }

  public trackFeatureUsage(feature: string, action: string) {
    this.trackEvent('feature_used', { feature, action });
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export convenience functions
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  return analytics.trackEvent(event, properties);
};

export const setAnalyticsUser = (user: AnalyticsUser) => {
  return analytics.setUser(user);
};

export const trackUserLogin = (method: string, success: boolean) => {
  return analytics.trackUserLogin(method, success);
};

export const trackUserLogout = () => {
  return analytics.trackUserLogout();
};

export const trackWorkCreation = (workId: string, workType: string) => {
  return analytics.trackWorkCreation(workId, workType);
};

export const trackWorkView = (workId: string, workTitle: string) => {
  return analytics.trackWorkView(workId, workTitle);
};

export const trackWorkLike = (workId: string, workTitle: string, liked: boolean) => {
  return analytics.trackWorkLike(workId, workTitle, liked);
};

export const trackWorkComment = (workId: string, workTitle: string) => {
  return analytics.trackWorkComment(workId, workTitle);
};

export const trackUserFollow = (userId: string, username: string, followed: boolean) => {
  return analytics.trackUserFollow(userId, username, followed);
};

export const trackSocialNavigation = (section: string) => {
  return analytics.trackSocialNavigation(section);
};

export const trackError = (error: string, context: string) => {
  return analytics.trackError(error, context);
};

export const trackFeatureUsage = (feature: string, action: string) => {
  return analytics.trackFeatureUsage(feature, action);
};

export default analytics;
