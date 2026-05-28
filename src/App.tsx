import { useEffect, useMemo } from 'react';
import { useConceptStore } from '@/store/conceptStore';
import { useUserStore } from '@/store/userStore';
import { useProgressStore } from '@/store/progressStore';
import { useUIStore } from '@/store/uiStore';
import { initConceptEngine, getConceptById } from '@/services/conceptEngine';
import { conceptGraph } from '@/data/graph';
import { CONCEPT_NODES } from '@/data/concepts';
import { LAYER_ORDER } from '@/data/constants';
import type { Layer } from '@/types';

import { useChallengeStore } from '@/store/challengeStore';

import { Header } from '@/components/layout/Header';
import { LayerNavigator } from '@/components/navigation/LayerNavigator';
import { ConceptTree } from '@/components/navigation/ConceptTree';
import { ConceptView } from '@/components/concept/ConceptView';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { ChallengeLobby } from '@/components/challenge/ChallengeLobby';
import { ChallengeArena } from '@/components/challenge/ChallengeArena';
import { ChallengeResult } from '@/components/challenge/ChallengeResult';

import '@/components/layout/Header.css';
import '@/components/layout/AppLayout.css';
import '@/components/concept/CodeBlock.css';

function App() {
  const initConcepts = useConceptStore((s) => s.init);
  const loadProfile = useUserStore((s) => s.load);
  const loadProgress = useProgressStore((s) => s.load);
  const isOnboarded = useUserStore((s) => s.isOnboarded);
  const darkMode = useUserStore((s) => s.profile.settings.dark_mode);
  const activeConceptId = useConceptStore((s) => s.activeConceptId);
  const currentView = useUIStore((s) => s.currentView);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const activeConcept = useMemo(
    () => activeConceptId ? getConceptById(activeConceptId) : undefined,
    [activeConceptId],
  );

  const challengeStatus = useChallengeStore((s) => s.status);

  useEffect(() => {
    // Initialize data layer
    initConceptEngine(CONCEPT_NODES, conceptGraph);
    initConcepts(CONCEPT_NODES);

    // Load persisted data
    loadProfile();

    // Calculate layer totals
    const conceptLayers: Record<string, Layer> = {};
    const totalPerLayer: Record<Layer, number> = {
      lexical: 0, morphological: 0, syntax: 0, semantic: 0, pragmatic: 0,
    };
    for (const c of CONCEPT_NODES) {
      conceptLayers[c.id] = c.layer;
      totalPerLayer[c.layer]++;
    }
    for (const l of LAYER_ORDER) {
      if (!(l in totalPerLayer)) totalPerLayer[l] = 0;
    }
    loadProgress(conceptLayers, totalPerLayer);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (currentView === 'welcome' && !isOnboarded) {
    return <WelcomeScreen />;
  }

  if (currentView === 'challenge') {
    return (
      <div className="app-layout">
        <Header />
        <div className="app-body">
          <main className="app-content challenge-content">
            {challengeStatus === 'idle' && <ChallengeLobby />}
            {challengeStatus === 'playing' && <ChallengeArena />}
            {challengeStatus === 'finished' && <ChallengeResult />}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <aside className={`app-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <LayerNavigator />
          <ConceptTree />
        </aside>
        <main className="app-content">
          {activeConcept ? (
            <ConceptView concept={activeConcept} />
          ) : (
            <div className="empty-content">
              <h2>Lang Master</h2>
              <p>从左侧选择一个概念开始探索</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
