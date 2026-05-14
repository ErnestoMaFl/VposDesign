import { useAppStore } from '@/store/useAppStore';
import { CardPanelLayout } from '@/components/layout/CardPanelLayout';
import { ConversationalQueryInterface } from '@/features/analytics/ConversationalQueryInterface';

export const ConsultasScreen = () => {
  // 1. Extraemos el estado global de nuestro "cerebro" (Zustand)
  const {
    connectionState,
    orbState,
    chatHistory,
    isQuerying,
    simulateQueryResponse,
  } = useAppStore();

  // 2. Preparamos lo que verá el Panel de Voz a la derecha (Truth Monitor)
  const getVoiceProps = () => {
    // Si la IA está pensando, reflejamos ese estado
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

    // Estado normal/espera
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

  // 3. Las píldoras de sugerencia que aparecen abajo en el chat
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
    >
      {/* Contenedor central donde vive el Chat */}
      <div className="flex-1 w-full min-h-0 relative bg-surface-base/40 rounded-2xl border border-surface-bright-edge/10 overflow-hidden shadow-inner">
        <ConversationalQueryInterface
          messages={chatHistory}
          suggestions={suggestions}
          // Al tocar una sugerencia, disparamos la simulación que hicimos en la Fase 0
          onSuggestionSelect={(pregunta) => simulateQueryResponse(pregunta)}
          isListening={orbState === 'listening'}
          isQuerying={isQuerying}
        />
      </div>
    </CardPanelLayout>
  );
};