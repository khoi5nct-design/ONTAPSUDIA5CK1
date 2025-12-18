
import React from 'react';

interface ResultProps {
  score: number;
  userName: string;
  onRestart: () => void;
  onReview: () => void;
}

const Result: React.FC<ResultProps> = ({ score, userName, onRestart, onReview }) => {
  const getFeedback = () => {
    if (score === 10) return {
      title: "Oa! THẬT LÀ KÌ DIỆU!",
      message: `Bạn ${userName} ơi, bạn đúng là một SIÊU ANH HÙNG Lịch sử - Địa lí! 10 điểm tuyệt đối, quá là "xịn xò" luôn! 🏆🌈✨`,
      emoji: "👑",
      colorClass: "text-red-600"
    };
    if (score >= 8) return {
      title: "Giỏi quá bạn ơi!",
      message: `Quá đỉnh luôn! Bạn đã nắm bài rất chắc rồi đó. Cố gắng một chút nữa là đạt điểm tuyệt đối nha! 💪✨`,
      emoji: "🌟",
      colorClass: "text-blue-600"
    };
    if (score >= 5) return {
      title: "Khá lắm nha!",
      message: `Bạn đã vượt qua bài tập rồi nè. Hãy ôn luyện thêm một chút để đạt điểm cao hơn vào lần tới nhé! 📚🎈`,
      emoji: "👏",
      colorClass: "text-green-600"
    };
    return {
      title: "Đừng buồn nha!",
      message: `Không sao cả đâu, chúng mình chỉ đang học thôi mà. Xem lại bài rồi thử sức lại lần nữa, chắc chắn bạn sẽ tiến bộ! 🌈💖`,
      emoji: "🍀",
      colorClass: "text-orange-600"
    };
  };

  const feedback = getFeedback();
  const isPerfect = score === 10;

  return (
    <div className="p-8 text-center animate-in zoom-in duration-500">
      <div className={`text-8xl mb-4 ${isPerfect ? 'animate-bounce' : ''}`}>
        {feedback.emoji}
      </div>
      <h2 className={`text-4xl font-black mb-4 ${feedback.colorClass} drop-shadow-sm`}>
        {feedback.title}
      </h2>
      
      <div className={`inline-block px-10 py-6 rounded-3xl border-4 mb-6 transition-all ${
        isPerfect 
          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600 animate-glow animate-score' 
          : 'bg-yellow-100 border-yellow-400'
      }`}>
        <span className={`text-sm font-bold block uppercase tracking-widest ${isPerfect ? 'text-yellow-900' : 'text-yellow-600'}`}>
          Điểm của bạn
        </span>
        <div className="flex items-baseline justify-center">
          <span className={`text-7xl font-black ${isPerfect ? 'text-white drop-shadow-lg' : 'text-yellow-700'}`}>
            {score}
          </span>
          <span className={`text-3xl font-bold ${isPerfect ? 'text-yellow-900' : 'text-yellow-700'}`}>
            /10
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-xl mb-8 leading-relaxed max-w-md mx-auto italic font-medium">
        "{feedback.message}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onReview}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          🔍 Xem lại bài làm
        </button>
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          🔄 Luyện tập lại
        </button>
      </div>
    </div>
  );
};

export default Result;
