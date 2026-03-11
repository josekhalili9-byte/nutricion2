import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
}

export default function CameraScanner({ onCapture }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError('No se pudo acceder a la cámara. Por favor, otorga permisos.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    // Stop tracks from the state stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    // Also stop tracks from the video element directly to prevent stale closure issues on unmount
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  React.useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        onCapture(base64Image);
      }
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl mb-6 flex items-center justify-center">
        {!isCameraActive ? (
          <div className="text-center p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">FoodScan AI</h3>
            <p className="text-gray-400 text-sm mb-6">Apunta a tu comida para descubrir su valor nutricional</p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCamera}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30 transition-colors flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Activar Cámara
            </motion.button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-3xl pointer-events-none"></div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={captureImage}
                className="w-20 h-20 bg-white rounded-full border-4 border-emerald-500 shadow-xl flex items-center justify-center focus:outline-none"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full"></div>
              </motion.button>
            </div>
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
