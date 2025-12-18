
import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS } from './questions';
import { AppState, UserAnswer, QuestionType, Option } from './types';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Review from './components/Review';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    userName: '',
    isLoggedIn: false,
    currentStep: 'login',
    userAnswers: [],
    score: 0
  });

  const [shuffledQuestions, setShuffledQuestions] = useState([...QUESTIONS]);

  const playSound = (type: 'correct' | 'complete' | 'click') => {
    const urls = {
      correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
      complete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    };
    const audio = new Audio(urls[type]);
    audio.play().catch(() => {});
  };

  const handleLogin = (name: string) => {
    playSound('click');
    setState(prev => ({ ...prev, userName: name, isLoggedIn: true, currentStep: 'quiz' }));
    shuffleAll();
  };

  const shuffleAll = useCallback(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const newQuestions = QUESTIONS.map(q => {
      if (q.type === QuestionType.MULTIPLE_CHOICE && q.options) {
        const originalOptions = q.options;
        const correctText = originalOptions.find(o => o.id === q.correctAnswer)?.text;
        const shuffledTexts = shuffleArray(originalOptions.map(o => o.text));
        const newOptions = originalOptions.map((o, idx) => ({ id: o.id, text: shuffledTexts[idx] }));
        const newCorrectAnswer = newOptions.find(o => o.text === correctText)?.id;
        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      if (q.type === QuestionType.MULTI_SELECT && q.options) {
        const originalOptions = q.options;
        const correctTexts = originalOptions.filter(o => q.correctIds?.includes(o.id)).map(o => o.text);
        const shuffledTexts = shuffleArray(originalOptions.map(o => o.text));
        const newOptions = originalOptions.map((o, idx) => ({ id: o.id, text: shuffledTexts[idx] }));
        const newCorrectIds = newOptions.filter(o => correctTexts.includes(o.text)).map(o => o.id);
        return { ...q, options: newOptions, correctIds: newCorrectIds };
      }
      if (q.type === QuestionType.MATCHING && q.matchingOptions) {
        return {
          ...q,
          matchingOptions: {
            left: shuffleArray(q.matchingOptions.left),
            right: shuffleArray(q.matchingOptions.right)
          }
        };
      }
      return q;
    });
    setShuffledQuestions(shuffleArray(newQuestions));
  }, []);

  const handleCorrect = () => {
    playSound('correct');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#fbbf24']
    });
  };

  const handleFinish = (answers: UserAnswer[]) => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const finalScore = Math.round((correctCount / shuffledQuestions.length) * 10);
    
    setState(prev => ({
      ...prev,
      userAnswers: answers,
      score: finalScore,
      currentStep: 'result'
    }));

    if (finalScore === 10) {
      playSound('complete');
      
      const duration = 8 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#ffd700']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#ffd700']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Massive explosive bursts
      const explosion = (x: number, y: number) => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { x, y },
          scalar: 1.2,
          shapes: ['star'],
          colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF']
        });
      };

      setTimeout(() => explosion(0.5, 0.5), 0);
      setTimeout(() => explosion(0.2, 0.4), 1000);
      setTimeout(() => explosion(0.8, 0.4), 2000);
      setTimeout(() => explosion(0.5, 0.3), 3500);
      setTimeout(() => explosion(0.3, 0.6), 5000);
      setTimeout(() => explosion(0.7, 0.6), 6000);
    }
  };

  const restart = () => {
    playSound('click');
    shuffleAll();
    setState(prev => ({ ...prev, currentStep: 'quiz', userAnswers: [], score: 0 }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-300">
        {state.currentStep === 'login' && <Login onLogin={handleLogin} />}
        {state.currentStep === 'quiz' && (
          <Quiz 
            questions={shuffledQuestions} 
            onFinish={handleFinish} 
            onCorrect={handleCorrect}
            userName={state.userName}
          />
        )}
        {state.currentStep === 'result' && (
          <Result 
            score={state.score} 
            userName={state.userName} 
            onRestart={restart}
            onReview={() => setState(prev => ({ ...prev, currentStep: 'review' }))}
          />
        )}
        {state.currentStep === 'review' && (
          <Review 
            questions={shuffledQuestions} 
            userAnswers={state.userAnswers} 
            onBack={() => setState(prev => ({ ...prev, currentStep: 'result' }))} 
          />
        )}
      </div>
      <div className="mt-8 text-blue-500 font-bold flex items-center gap-2">
        <span>🚀 Học mà chơi, chơi mà học! 🌟</span>
      </div>
    </div>
  );
};

export default App;
