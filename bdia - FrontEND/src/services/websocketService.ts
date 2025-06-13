type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: { [event: string]: WebSocketCallback[] } = {};

  connect(token: string) {
    this.ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

    this.ws.onopen = () => this.emit('connected');
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    this.ws.onclose = () => this.emit('disconnected');
    this.ws.onerror = (error) => this.emit('error', error);
  }

  private handleMessage(data: any) {
    this.emit(data.type, data.payload || data);
  }

  on(event: string, callback: WebSocketCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: WebSocketCallback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export const wsService = new WebSocketService();
