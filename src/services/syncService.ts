
// A simple service to manage task synchronization across devices

interface SyncMessage {
  tasks: any[];
  timestamp: number;
}

class SyncService {
  private static instance: SyncService;
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private readonly WEBSOCKET_URL = 'wss://syncservice.lovable.dev/tasks'; // Placeholder URL
  private onMessageCallbacks: ((data: SyncMessage) => void)[] = [];
  private pendingMessages: SyncMessage[] = [];
  private connectionAttempts = 0;
  private readonly MAX_RECONNECT_DELAY = 30000; // 30 seconds max

  private constructor() {
    this.initWebSocket();
    
    // Also set up a fallback using localStorage for same-device sync
    window.addEventListener('storage', (e) => {
      if (e.key === 'tasks_v1' && e.newValue) {
        try {
          const parsedTasks = JSON.parse(e.newValue);
          const timestamp = parseInt(localStorage.getItem('tasks_last_modified') || Date.now().toString());
          this.notifySubscribers({ tasks: parsedTasks, timestamp });
        } catch (err) {
          console.error("Error parsing tasks from storage event:", err);
        }
      }
    });
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private initWebSocket() {
    try {
      // For now, use a BroadcastChannel as a WebSocket alternative
      // since we don't have an actual WebSocket server
      const channel = new BroadcastChannel('task-sync-channel');
      
      channel.onmessage = (event) => {
        console.log("SyncService: Message received", event.data);
        this.notifySubscribers(event.data);
      };
      
      channel.onmessageerror = (error) => {
        console.error("SyncService: Channel error:", error);
      };
      
      // Store the channel in a way we can use it later
      (this as any).channel = channel;
      
      console.log("SyncService: BroadcastChannel initialized");
      
      // Send any pending messages
      while (this.pendingMessages.length > 0) {
        const message = this.pendingMessages.shift();
        if (message) this.sendMessage(message);
      }
    } catch (error) {
      console.error("SyncService: BroadcastChannel initialization failed:", error);
      // Try to reconnect with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, this.connectionAttempts), this.MAX_RECONNECT_DELAY);
      this.connectionAttempts++;
      
      console.log(`SyncService: Will try to reconnect in ${delay}ms`);
      if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
      
      this.reconnectTimer = window.setTimeout(() => {
        this.initWebSocket();
      }, delay);
    }
  }

  public subscribe(callback: (data: SyncMessage) => void) {
    this.onMessageCallbacks.push(callback);
    return () => {
      this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(data: SyncMessage) {
    this.onMessageCallbacks.forEach(callback => callback(data));
  }

  public sendMessage(message: SyncMessage) {
    try {
      // If we're using the BroadcastChannel
      if ((this as any).channel) {
        (this as any).channel.postMessage(message);
        return;
      }
      
      // Real WebSocket implementation would be here
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        // Queue the message for when connection is established
        this.pendingMessages.push(message);
      }
    } catch (error) {
      console.error("SyncService: Error sending message:", error);
      // Queue the message for retry
      this.pendingMessages.push(message);
    }
  }

  public disconnect() {
    if ((this as any).channel) {
      (this as any).channel.close();
    }
    
    if (this.socket) {
      this.socket.close();
    }
    
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export default SyncService;
