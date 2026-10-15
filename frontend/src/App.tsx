import React, { useState, useEffect, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultsCard } from './components/ResultsCard';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { AboutSection } from './components/AboutSection';
import type { StudentDataRequest, PredictionResponse, ApiConnectionState } from './types/api';
import { DEFAULT_FORM_VALUES } from './utils/constants';
import { checkApiHealth, predictMentalHealthScore } from './services/api';
import { Activity, ArrowUp } from 'lucide-react';

export const App: React.FC = () => {
  const [formData, setFormData] = useState<StudentDataRequest>(DEFAULT_FORM_VALUES);
  const [submittedData, setSubmittedData] = useState<StudentDataRequest | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiConnectionState>('checking');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Check API health on mount and periodically
  const verifyApiHealth = useCallback(async () => {
    setApiStatus('checking');
    const status = await checkApiHealth();
    setApiStatus(status);
  }, []);

  useEffect(() => {
    verifyApiHealth();
    const interval = setInterval(() => {
      checkApiHealth().then((status) => setApiStatus(status));
    }, 15000); // Check every 15s

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [verifyApiHealth]);

  // Handle Form Submission
  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await predictMentalHealthScore(formData);
      setPredictionResult(response);
      setSubmittedData({ ...formData });

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unknown error occurred while communicating with the prediction model.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setServerError(null);
  };

  const handleNewAssessment = () => {
    const assessmentEl = document.getElementById('assessment');
    if (assessmentEl) {
      assessmentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Three.js Animated Background Layer */}
      <ThreeCanvas />

      {/* Top Fixed Navigation Bar */}
      <Navbar
        apiStatus={apiStatus}
        onRefreshHealth={verifyApiHealth}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          onStartAssessment={() => {
            const el = document.getElementById('assessment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Assessment Form Section */}
        <AssessmentForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmitAssessment}
          onClear={handleClearForm}
          isLoading={isLoading}
          serverError={serverError}
        />

        {/* Results Card Section (Appears after successful model run) */}
        {predictionResult && submittedData && (
          <ResultsCard
            result={predictionResult}
            submittedData={submittedData}
            onNewAssessment={handleNewAssessment}
          />
        )}

        {/* Personal Lifestyle & Time Allocation Dashboard */}
        <DashboardAnalytics
          submittedData={submittedData}
          predictionResult={predictionResult}
          onNavigateToAssessment={() => {
            const el = document.getElementById('assessment');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* About the ML Model & Privacy Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">MindScope AI</span>
            <span>— Mental Health Score Prediction Engine</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with React, TypeScript, Three.js & FastAPI</span>
          </div>
          <div className="text-slate-400">
            Local endpoint: <code className="text-cyan-400">http://127.0.0.1:2200</code>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white hover:bg-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-md transition-all duration-300 cursor-pointer"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default App;
