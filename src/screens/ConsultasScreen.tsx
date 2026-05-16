import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CardPanelLayout } from '@/components/layout/CardPanelLayout';
import { ConversationalQueryInterface } from '@/features/analytics/ConversationalQueryInterface';
import { DestructiveConfirmModal } from '@/components/shared/Modals/DestructiveConfirmModal';
import { Trash2 } from 'lucide-react';

export const ConsultasScreen = () => {
  // 1. Extraemos el estado global
  const {
    connectionState,
    orbState,
    chatHistory,
    isQuerying,
    simulateQueryResponse,
    clearHistory,
    addMessage,
    setOrbState
  } = useAppStore();

  // 2. Estado local para el Modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // 3. Acción real al confirmar el borrado
  const handleClearHistory = () => {
    setIsClearModalOpen(false);
    clearHistory();
    
    // Inyectamos de nuevo el mensaje de bienvenida
    addMessage({
      id: `welcome-${Date.now()}`,
      role: 'system',
      content: 'Hola. Soy tu Analista de Datos. ¿Qué te gustaría saber de tu negocio hoy?',
      timestamp: Date.now(),
      variant: 'text'
    });

    // Feedback visual en el Orb
    setOrbState('success');
    setTimeout(() => setOrbState('standby'), 1500);
  };

  // 4. Preparamos lo que verá el Panel de Voz a la derecha
  const getVoiceProps = () => {
    if (isQuerying) {
      return {
        status: 'processing' as const,
        transcriptText: "Generando reporte...",
        isPartialTranscript: false,
        detectedIntention: "CONSULTA_ANALÍTICA",
        interpretations: [
          { id: '1', text: 'Analizando base de datos de ventas...', status: 'success' as const, semanticType: 'search' as const },
          { id: '2', text: 'Generando visualización...', status: 'pending' as const }
        ],
        availableCommands: ['Cancelar consulta']
      };
    }

    return {
      status: orbState,
      transcriptText: orbState === 'listening' ? "cuál fue el mejor..." : "",
      isPartialTranscript: orbState === 'listening',
      interpretations: [],
      availableCommands: [
        '¿Qué vendí más hoy?',
        'Ventas de la semana',
        'Top 5 productos',
        'Volver al inicio'
      ]
    };
  };

  // 5. Sugerencias iniciales
  const suggestions = [
    '¿Cuál fue mi mejor día de la semana?',
    'Top 5 productos más vendidos',
    '¿Qué productos están por agotarse?'
  ];

  return (
    <CardPanelLayout
      headerProps={{
        moduleName: "Analista de Datos",
        connectionStatus: connectionState,
        cashierName: "Ernesto Macias",
        role: "Dueño",
        shift: "Turno Matutino"
      }}
      voiceProps={getVoiceProps()}
      stepContextMessage="MODO CONVERSACIONAL LIBRE"
      title="Consultas y Reportes."
      
      // NUEVO: Botón de Limpiar Historial en el Header
      headerAction={
        <button 
          onClick={() => setIsClearModalOpen(true)}
          // Solo se activa si hay más de 1 mensaje (es decir, si ya hay consultas además de la bienvenida)
          disabled={chatHistory.length <= 1} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-utility text-sm transition-all duration-300 ${
            chatHistory.length <= 1
              ? 'bg-surface-low text-on-surface-variant opacity-40 cursor-not-allowed'
              : 'bg-surface-low hover:bg-error/15 hover:text-error border border-transparent hover:border-error/20 text-on-surface-variant'
          }`}
        >
          <Trash2 size={16} /> Limpiar Análisis
        </button>
      }
    >
      
      {/* Contenedor central donde vive el Chat */}
      <div className="flex-1 w-full min-h-0 relative bg-surface-base/40 rounded-2xl border border-surface-bright-edge/10 overflow-hidden shadow-inner">
        <ConversationalQueryInterface
          messages={chatHistory}
          suggestions={suggestions}
          onSuggestionSelect={(pregunta) => simulateQueryResponse(pregunta)}
          isListening={orbState === 'listening'}
          isQuerying={isQuerying}
        />
      </div>

      {/* NUESTRO MODAL INYECTADO */}
      <DestructiveConfirmModal
        isOpen={isClearModalOpen}
        title="¿Borrar historial de análisis?"
        description="Se eliminarán todas las gráficas, tablas y respuestas de esta sesión. El Analista olvidará el contexto de las preguntas anteriores."
        confirmText="Sí, borrar historial"
        cancelText="Conservar datos"
        armingTimeMs={1000} // 1 segundo es suficiente aquí, no es tan crítico como una venta
        onConfirm={handleClearHistory}
        onCancel={() => setIsClearModalOpen(false)}
      />

    </CardPanelLayout>
  );
};