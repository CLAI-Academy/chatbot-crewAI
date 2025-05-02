
import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHookProps {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

interface WebSocketHookResult {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (message: any) => void;
  error: Event | null;
}

const useWebSocket = ({ url, onOpen, onClose, onError }: WebSocketHookProps): WebSocketHookResult => {
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
    // Crear una nueva conexión WebSocket
    // Convert WebSocket URL to use secure protocol if page is loaded over HTTPS
    let secureUrl = url;
    if (window.location.protocol === 'https:' && url.startsWith('ws:')) {
      secureUrl = url.replace('ws://', 'wss://');
      console.log('Converting WebSocket to secure connection:', secureUrl);
    }
    
    // Create socket with potentially modified URL
    const socket = new WebSocket(secureUrl);
    socketRef.current = socket;

    // Evento: conexión establecida
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      onOpen?.();
    };

    // Evento: mensaje recibido
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
        setLastMessage(event.data);
      }
    };

    // Evento: conexión cerrada
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      onClose?.();
    };

    // Evento: error en la conexión
    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError(e);
      onError?.(e);
    };

    // Limpiar al desmontar
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [url, onOpen, onClose, onError]);

  return { isConnected, lastMessage, sendMessage, error };
};

export default useWebSocket;
