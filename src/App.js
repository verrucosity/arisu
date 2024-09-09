import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');
  const [bgClass, setBgClass] = useState('morning');
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [finalSurprise, setFinalSurprise] = useState(false);
  const [emojiRain, setEmojiRain] = useState(false);
  const [particles, setParticles] = useState([]);
  const [collectedConfetti, setCollectedConfetti] = useState(0);

  // Define multiple greetings for morning, afternoon, and evening
  const morningGreetings = [
    'おはよう、ありす！がんばってね。',
    'おはよう、きょうもすてきなひにしようね。',
    'おはよう、あさごはんたべた？',
    'おはよう、きょうもいっしょにがんばろう！'
  ];

  const afternoonGreetings = [
    'こんにちは、ありす！きみのことをかんがえてるよ。',
    'こんにちは、ランチはもうたべた？',
    'こんにちは、きょうはいいてんきだね。',
    'こんにちは、きみのえがおがみたい！'
  ];

  const eveningGreetings = [
    'こんばんは、ありす！きょうはおつかれさま！',
    'こんばんは、ゆっくりやすんでね。',
    'こんばんは、きょうもいっしょにがんばったね！',
    'こんばんは、そろそろねるじかんだね。'
  ];

  // Function to get the current hour in UK time
  const getUKTime = () => {
    const ukTime = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
    const hour = new Date(ukTime).getHours();
    return hour;
  };

  // Function to pick a random greeting from the respective list based on time of day
  const getRandomGreeting = (greetings) => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Update the greeting based on the time of day
  useEffect(() => {
    const hour = getUKTime();
    
    if (hour < 12) {
      setCurrentTime(getRandomGreeting(morningGreetings)); // Random morning greeting
      setBgClass('morning');
    } else if (hour >= 12 && hour < 17) {
      setCurrentTime(getRandomGreeting(afternoonGreetings)); // Random afternoon greeting
      setBgClass('afternoon');
    } else {
      setCurrentTime(getRandomGreeting(eveningGreetings)); // Random evening greeting
      setBgClass('evening');
    }
  }, []);

  // Create particles that follow the mouse/finger
  const handleMouseMove = (e) => {
    createParticle(e.clientX, e.clientY);
  };

  const createParticle = (x, y) => {
    const newParticle = { x, y, id: Date.now() };
    setParticles((prevParticles) => [...prevParticles, newParticle]);

    setTimeout(() => {
      setParticles((prevParticles) => prevParticles.filter(p => p.id !== newParticle.id));
    }, 2000);
  };

  // Button click to show random messages and animate hearts
  const handleClick = () => {
    const hour = getUKTime();
    let randomMessage;

    if (hour < 12) {
      const morningMessages = [
        'きみはほんとうにすてきだよ！',
        'きょうもぼくはきみをおうえんしてる！',
        'ゆっくりあさごはんたべてね！'
      ];
      randomMessage = morningMessages[Math.floor(Math.random() * morningMessages.length)];
    } else if (hour >= 12 && hour < 17) {
      const afternoonMessages = [
        'きみのことをいつもおもってる。',
        'たいへんなことがあったらぼくにいってね！',
        'ちょっとやすんだほうがいいよ！'
      ];
      randomMessage = afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
    } else {
      const eveningMessages = [
        'きょうはよくやったね！おつかれさま！',
        'ねむくなったらすぐやすんでね。',
        'ぼくはきみのことをずっとおうえんしてるよ！'
      ];
      randomMessage = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    }
    setMessage(randomMessage);
    setHeartsVisible(true);
    setTimeout(() => setHeartsVisible(false), 2000);
    setBgClass(bgClass === 'morning' ? 'evening' : 'morning');
  };

  // Long press to reveal secret message with confetti
  const handleLongPress = () => {
    setSecretMessage('ありす、きみはぼくにとってとくべつだよ！');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setEmojiRain(true);
    setTimeout(() => setEmojiRain(false), 5000);  // Emoji rain lasts for 5 seconds
    setCollectedConfetti(collectedConfetti + 1);
  };

  // Tap counter for unlocking final surprise
  const handleTap = () => {
    setTapCount(tapCount + 1);
    if (tapCount >= 5) {
      setFinalSurprise(true);
      setEmojiRain(true);
      setTimeout(() => setEmojiRain(false), 5000);  // Emoji rain for final surprise
    }
  };

  // Shake event for secret message
  useEffect(() => {
    const handleShake = (e) => {
      const { acceleration } = e;
      if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        setSecretMessage('しぇいくしてくれてありがとう！');
      }
    };
    window.addEventListener('devicemotion', handleShake);

    return () => {
      window.removeEventListener('devicemotion', handleShake);
    };
  }, []);

  return (
    <div className={`App ${bgClass}`} onMouseMove={handleMouseMove}>
      <h1>{currentTime}</h1>
      <p>ありす、いつもがんばってるね。💖</p>

      <div className="buttons-container">
        <button onClick={handleClick}>
          クリックして
        </button>
        <button onMouseDown={handleLongPress}>
          ひみつをみる
        </button>
      </div>

      <div className="tap-area" onClick={handleTap}>
        {tapCount < 5 ? 'タップしてね！' : 'おめでとう！'}
      </div>

      {message && <p className="message">{message}</p>}
      {secretMessage && <p className="secret">{secretMessage}</p>}

      {heartsVisible && <div className="hearts">💖💖💖</div>}
      {showConfetti && <div className="confetti">🎉🎉🎉</div>}
      {finalSurprise && <p className="final-surprise">ありす、だいすきだよ！💖</p>}
      {emojiRain && (
        <div className="emoji-rain">
          <span>💖</span>
          <span>✨</span>
          <span>🌟</span>
          <span>💖</span>
          <span>✨</span>
          <span>🌟</span>
        </div>
      )}

      {/* Confetti Collection Counter */}
      <p className="collected-confetti">
        これまでに集めたコンフェッティ: {collectedConfetti}
      </p>

      {/* Render particles that follow the mouse */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{ top: particle.y, left: particle.x }}
        >
          💖
        </span>
      ))}
    </div>
  );
}

export default App;
