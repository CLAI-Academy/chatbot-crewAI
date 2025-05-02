import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHookProps {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  shouldReconnect?: (closeEvent: CloseEvent) => boolean;
}

interface WebSocketHookResult {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (message: any) => void;
  error: Event | null;
}

const useWebSocket = ({ 
  url, 
  onOpen, 
  onClose, 
  onError,
  shouldReconnect = () => false
}: WebSocketHookProps): WebSocketHookResult => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);

  // Función para enviar mensajes
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  // Inicialización y limpieza del WebSocket
  useEffect(() => {
    let socket: WebSocket;
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;
      
      // Ya no necesitamos convertir la URL aquí porque lo haremos en el componente
      socket = new WebSocket(url);
      socketRef.current = socket;

      // Evento: conexión establecida
      socket.onopen = () => {
        console.log('WebSocket connected');
        if (!isUnmounted) {
          setIsConnected(true);
          onOpen?.();
        }
      };

      // Evento: mensaje recibido
      socket.onmessage = (event) => {
        if (isUnmounted) return;
        
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
          setLastMessage(event.data);
        }
      };

      // Evento: conexión cerrada
      socket.onclose = (closeEvent) => {
        console.log('WebSocket disconnected', closeEvent.code);
        if (isUnmounted) return;
        
        setIsConnected(false);
        onClose?.();
        
        // Intentar reconectar si shouldReconnect devuelve true
        if (shouldReconnect(closeEvent)) {
          console.log('Intentando reconectar...');
          setTimeout(connect, 2000); // Esperar 2 segundos antes de reconectar
        }
      };

      // Evento: error en la conexión
      socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        if (!isUnmounted) {
          setError(e);
          onError?.(e);
        }
      };
    };

    connect();

    // Limpiar al desmontar
    return () => {
      isUnmounted = true;
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        socket.close();
      }
    };
  }, [url, onOpen, onClose, onError, shouldReconnect]);

  return { isConnected, lastMessage, sendMessage, error };
};

export default useWebSocket;
