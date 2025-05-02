import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHookProps {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  shouldReconnect?: (closeEvent: CloseEvent) => boolean;
  autoConnect?: boolean;  // New prop to control automatic connection
}

interface WebSocketHookResult {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (message: any) => void;
  error: Event | null;
  connect: () => void;  // Method to manually initiate connection
}

const useWebSocket = ({ 
  url, 
  onOpen, 
  onClose, 
  onError,
  shouldReconnect = () => false,
  autoConnect = true  // Default to auto-connect for backward compatibility
}: WebSocketHookProps): WebSocketHookResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const isUnmountedRef = useRef(false);

  // Ensure we're using secure WebSockets when on HTTPS
  const getSecureUrl = (wsUrl: string) => {
    // If already using secure WebSockets, return as is
    if (wsUrl.startsWith('wss://')) return wsUrl;
    
    // If page is loaded over HTTPS, upgrade to secure WebSockets
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return wsUrl.replace('ws://', 'wss://');
    }
    
    return wsUrl;
  };

  // Function to create a WebSocket connection
  const connect = useCallback(() => {
    if (isUnmountedRef.current || socketRef.current?.readyState === WebSocket.OPEN) return;
    
    try {
      const secureUrl = getSecureUrl(url);
      console.log(`🛠️ Intentando conectar a WebSocket en: ${secureUrl}`);
      
      const socket = new WebSocket(secureUrl);
      console.log(`🔧 Estado del WebSocket: ${socket.readyState} (0=CONNECTING)`);
      socketRef.current = socket;

      // Event: connection established
      socket.onopen = () => {
        console.log('✅ WebSocket conectado correctamente');
        if (!isUnmountedRef.current) {
          setIsConnected(true);
          onOpen?.();
        }
      };

      // Event: message received
      socket.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        
        console.log('📨 Mensaje recibido del servidor:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('🔄 Mensaje procesado:', data);
          setLastMessage(data);
        } catch (e) {
          console.error('❌ Error al parsear mensaje WebSocket:', e);
          setLastMessage(event.data);
        }
      };

      // Event: connection closed
      socket.onclose = (closeEvent) => {
        console.log(`🚫 WebSocket desconectado. Código: ${closeEvent.code}, Razón: ${closeEvent.reason || 'No especificada'}`);
        if (isUnmountedRef.current) return;
        
        setIsConnected(false);
        onClose?.();
        
        // Try to reconnect if shouldReconnect returns true
        if (shouldReconnect(closeEvent)) {
          console.log('🔄 Intentando reconectar en 2s...');
          setTimeout(connect, 2000); // Wait 2 seconds before reconnecting
        }
      };

      // Event: connection error
      socket.onerror = (e) => {
        console.error('⚠️ Error en WebSocket:', e);
        // Intentar extraer más información del error
        try {
          console.error('⚠️ Detalles del error:', JSON.stringify(e));
        } catch {
          console.error('⚠️ No se pudo serializar el error para más detalles');
        }
        if (!isUnmountedRef.current) {
          setError(e);
          onError?.(e);
        }
      };
    } catch (err) {
      console.error('⛔ Error al crear conexión WebSocket:', err);
      try {
        console.error('⛔ Detalles del error:', JSON.stringify(err));
      } catch {
        console.error('⛔ No se pudo serializar el error para más detalles');
      }
      onError?.(err as Event);
    }
  }, [url, onOpen, onClose, onError, shouldReconnect]);

  // Function to send messages
  const sendMessage = useCallback((message: any) => {
    // If socket doesn't exist or is not open, connect first
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log(`📤 Socket no disponible para enviar. Estado: ${socketRef.current?.readyState || 'no inicializado'}`);
      console.log('🔄 Iniciando conexión para enviar mensaje...');
      connect();
      
      // Queue the message to be sent once connected
      console.log('⏳ Esperando conexión para enviar mensaje...');
      const checkAndSend = setInterval(() => {
        console.log(`🔍 Verificando estado conexión: ${socketRef.current?.readyState}`);
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          clearInterval(checkAndSend);
          console.log('📤 Conexión lista, enviando mensaje:', message);
          socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
        } else if (socketRef.current?.readyState === WebSocket.CLOSED || socketRef.current?.readyState === WebSocket.CLOSING) {
          clearInterval(checkAndSend);
          console.error('❌ Conexión WebSocket fallida, no se puede enviar mensaje');
        }
      }, 100);
      
      return;
    }
    
    console.log('📤 Enviando mensaje por WebSocket:', message);
    socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
  }, [connect]);

  // Initialize WebSocket connection if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      isUnmountedRef.current = true;
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        socketRef.current.close();
      }
    };
  }, [url, autoConnect, connect]);

  return { isConnected, lastMessage, sendMessage, error, connect };
};

export default useWebSocket;
