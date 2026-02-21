import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ReactConfetti from 'react-confetti';

// Animaciones
const roseFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
  50% { transform: translateY(-15px) rotate(5deg); opacity: 0.8; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
`;

// Componentes estilizados con diseño de carta
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #fce4e8 0%, #f8d7e3 50%, #fcc9d7 100%);
  font-family: 'Dancing Script', 'Great Vibes', 'Playfair Display', cursive;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 30% 40%, rgba(255, 182, 193, 0.1) 0%, transparent 30%),
                      radial-gradient(circle at 70% 60%, rgba(255, 105, 180, 0.1) 0%, transparent 40%);
    pointer-events: none;
  }
`;

const EnvelopeWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  perspective: 1500px;
`;

const Envelope = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 600px;
  background: #fff5f7;
  border-radius: 20px 20px 20px 20px;
  box-shadow: 
    0 15px 30px rgba(255, 105, 180, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.1),
    inset 0 -2px 5px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  border: 1px solid rgba(255, 182, 193, 0.5);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 50%, #ffb6c1 100%);
    border-bottom: 2px solid #ff99aa;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(to top, rgba(255, 182, 193, 0.3), transparent);
  }
`;

const LetterPaper = styled(motion.div)`
  position: relative;
  background: #fff9fb;
  margin: 35px 25px 25px 25px;
  padding: 45px 30px 40px 30px;
  border-radius: 15px;
  box-shadow: 
    0 5px 15px rgba(255, 105, 180, 0.1),
    inset 0 0 30px rgba(255, 240, 245, 0.8);
  border: 1px solid #ffe4e9;
  z-index: 10;
  min-height: 450px;
  display: flex;
  flex-direction: column;

  &::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 1px dashed #ffb6c1;
    border-radius: 10px;
    pointer-events: none;
    opacity: 0.4;
  }

  &::after {
    content: "🌸";
    position: absolute;
    bottom: 10px;
    right: 20px;
    font-size: 24px;
    opacity: 0.2;
    transform: rotate(-5deg);
  }
`;

const WaxSeal = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, #ff6b6b, #ff4757);
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(255, 71, 87, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #ffd700;
  border: 2px solid #ffa07a;
  z-index: 15;
  cursor: pointer;

  &::before {
    content: "✨";
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 16px;
    transform: rotate(15deg);
  }
`;

const Ribbon = styled.div`
  position: absolute;
  top: 50%;
  left: -10px;
  right: -10px;
  height: 40px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #ffb6c1 20%, 
    #ffc0cb 50%, 
    #ffb6c1 80%, 
    transparent 100%);
  transform: rotate(-3deg) translateY(-50%);
  opacity: 0.5;
  z-index: 5;
  box-shadow: 0 2px 5px rgba(255, 105, 180, 0.2);
`;

const CornerDecoration = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23ffb6c1" opacity="0.2" d="M20 20 Q 50 0, 80 20 Q 100 50, 80 80 Q 50 100, 20 80 Q 0 50, 20 20"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.3;
  pointer-events: none;
`;

const TopLeftCorner = styled(CornerDecoration)`
  top: 10px;
  left: 10px;
  transform: rotate(0deg);
`;

const BottomRightCorner = styled(CornerDecoration)`
  bottom: 10px;
  right: 10px;
  transform: rotate(180deg);
`;

const LetterDate = styled.p`
  font-size: 1.1rem;
  color: #ff69b4;
  text-align: right;
  font-style: italic;
  margin-bottom: 15px;
  font-family: 'Dancing Script', cursive;
  border-bottom: 1px dashed #ffb6c1;
  padding-bottom: 8px;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  color: #ff1493;
  font-weight: 700;
  font-family: 'Great Vibes', 'Dancing Script', cursive;
  text-align: center;
  margin: 5px 0 10px;
  text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.2);
  line-height: 1.2;
  letter-spacing: 1px;
  
  span {
    font-size: 2.5rem;
    display: block;
    color: #ff69b4;
    margin-top: 5px;
  }
`;

const SubTitle = styled.h2`
  font-size: 2.2rem;
  color: #ff69b4;
  font-weight: 600;
  font-family: 'Dancing Script', cursive;
  text-align: center;
  margin: 5px 0 15px;
  border-top: 2px dotted #ffb6c1;
  border-bottom: 2px dotted #ffb6c1;
  padding: 10px 0;
`;

const LetterBody = styled.div`
  font-size: 1.3rem;
  line-height: 1.8;
  color: #4a4a4a;
  text-align: center;
  margin: 15px 0;
  font-family: 'Dancing Script', cursive;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin-bottom: 15px;
  }

  .highlight {
    color: #ff1493;
    font-weight: 600;
    font-size: 1.5rem;
  }

  .emoji-big {
    font-size: 2rem;
    margin: 0 5px;
  }
`;

const InvitationDetails = styled.div`
  background: rgba(255, 240, 245, 0.7);
  padding: 20px;
  border-radius: 20px;
  margin: 15px 0;
  border: 2px dashed #ff69b4;
  box-shadow: 0 3px 15px rgba(255, 105, 180, 0.15);
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  font-size: 1.3rem;
  font-family: 'Dancing Script', cursive;
  
  .icon {
    font-size: 1.8rem;
    margin-right: 15px;
  }
  
  .label {
    font-weight: 600;
    color: #ff1493;
    margin-right: 10px;
    font-size: 1.4rem;
  }
  
  .value {
    color: #4a4a4a;
    font-size: 1.3rem;
  }
`;

const Signature = styled.div`
  margin-top: 20px;
  text-align: right;
  font-family: 'Great Vibes', cursive;
  font-size: 2rem;
  color: #ff1493;
  border-top: 1px dashed #ffb6c1;
  padding-top: 15px;
  
  small {
    font-size: 1.2rem;
    font-family: 'Dancing Script', cursive;
    color: #888;
    display: block;
    margin-top: 5px;
  }
`;

const Rose = styled.div`
  position: absolute;
  font-size: ${props => props.size || '28px'};
  opacity: ${props => props.opacity || '0.5'};
  z-index: 2;
  ${css`animation: ${roseFloat} ${props => props.duration || '8s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  filter: drop-shadow(0 0 4px rgba(255, 105, 180, 0.5));
  pointer-events: none;
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: ${props => props.size || '6px'};
  height: ${props => props.size || '6px'};
  background: ${props => props.color || '#ffffff'};
  border-radius: 50%;
  ${css`animation: ${sparkle} ${props => props.duration || '2s'} infinite ease-in-out ${props => props.delay || '0s'};`}
  pointer-events: none;
  filter: blur(0.8px);
  z-index: 3;
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? '#ff69b4' : '#ffb6c1'};
  opacity: ${props => props.active ? 1 : 0.5};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.3);
    opacity: 1;
  }
`;

const CelebrationMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px 40px;
  border-radius: 30px;
  border: 3px solid #ff69b4;
  box-shadow: 0 15px 40px rgba(255, 105, 180, 0.4);
  z-index: 100;
  text-align: center;
  font-size: 1.8rem;
  color: #ff1493;
  font-family: 'Great Vibes', cursive;
`;

// Componente principal
const LetterInvitation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [roses, setRoses] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  // Función handleCelebration DEFINIDA ANTES de usarse en slides
  const handleCelebration = () => {
    setShowConfetti(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  // Slides con formato de carta - AHORA handleCelebration ya está definida
  const slides = [
    {
      content: (
        <>
          <LetterDate>Sábado 21 de Febrero, 2026</LetterDate>
          <MainTitle>
            ¡TE INVITO A MI FIESTA!
            <span>CASA DE MAMÁ GABY</span>
          </MainTitle>
          <LetterBody>
            <p className="emoji-big">🎉 🎂 🎈</p>
            <p>Con mucho cariño y alegría,</p>
            <p>quiero compartir este día tan especial</p>
            <p>con toda mi familia</p>
          </LetterBody>
        </>
      )
    },
    {
      content: (
        <>
          <LetterDate>¡Celebración Especial!</LetterDate>
          <SubTitle>Detalles de mi Fiesta</SubTitle>
          <InvitationDetails>
            <DetailRow>
              <span className="icon">📅</span>
              <span className="label">Fecha:</span>
              <span className="value">Sábado 21 de Febrero 2026</span>
            </DetailRow>
            <DetailRow>
              <span className="icon">⏰</span>
              <span className="label">Hora:</span>
              <span className="value">5:00 PM</span>
            </DetailRow>
            <DetailRow>
              <span className="icon">📍</span>
              <span className="label">Lugar:</span>
              <span className="value">Casa de Mamá Gaby</span>
            </DetailRow>
            
          </InvitationDetails>
        </>
      )
    },
    {
      content: (
        <>
          <LetterDate>Un Mensaje para Ti</LetterDate>
          <LetterBody>
            <p className="highlight">✨ Querida Familia ✨</p>
            <p>Los esperamos mañana sábado</p>
            <p>con el corazón lleno de alegría</p>
            <p>para celebrar juntos mi cumpleaños</p>
            <p className="emoji-big">🥳 💝 🎊</p>
            <p>Su presencia hará este día</p>
            <p>aún más especial e inolvidable</p>
          </LetterBody>
        </>
      )
    },
    {
      content: (
        <>
          <LetterDate>¡Nos Vemos Mañana!</LetterDate>
          <LetterBody>
            <p className="highlight">Los esperamos con mucho cariño</p>
            <p>para compartir momentos felices,</p>
            <p>abrazos sinceros y mucha diversión</p>
            <p>🎵 Música 🎂 Pastel 🎁 Sorpresas</p>
            <p className="emoji-big">💕 🌹 💕</p>
            <p>¡No falten!</p>
          </LetterBody>
          <Signature onClick={handleCelebration} style={{ cursor: 'pointer' }}>
            Con amor
            <small>Haz clic aquí para confirmar</small>
          </Signature>
        </>
      )
    }
  ];

  // Actualizar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Crear elementos decorativos
  useEffect(() => {
    const createDecorations = () => {
      const isMobile = window.innerWidth < 480;
      const newRoses = [];
      const newSparkles = [];
      
      // Rosas
      const roseCount = isMobile ? 8 : 15;
      for (let i = 0; i < roseCount; i++) {
        newRoses.push({
          id: `rose-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          content: ['🌹', '🌸', '🌺', '🌷'][Math.floor(Math.random() * 4)],
          size: `${20 + Math.random() * 30}px`,
          opacity: Math.random() * 0.3 + 0.2,
          delay: `${Math.random() * 5}s`,
          duration: `${Math.random() * 4 + 6}s`
        });
      }
      
      // Destellos
      const sparkleCount = isMobile ? 10 : 20;
      for (let i = 0; i < sparkleCount; i++) {
        newSparkles.push({
          id: `sparkle-${i}`,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: `${4 + Math.random() * 6}px`,
          color: `rgba(255, ${180 + Math.random() * 75}, ${200 + Math.random() * 55}, ${0.6 + Math.random() * 0.4})`,
          delay: `${Math.random() * 3}s`,
          duration: `${Math.random() * 2 + 1.5}s`
        });
      }
      
      setRoses(newRoses);
      setSparkles(newSparkles);
    };

    createDecorations();
    window.addEventListener('resize', createDecorations);
    return () => window.removeEventListener('resize', createDecorations);
  }, []);

  // Cambio automático de slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Container>
      {/* Rosas decorativas */}
      {roses.map(rose => (
        <Rose
          key={rose.id}
          style={{
            left: `${rose.left}%`,
            top: `${rose.top}%`,
          }}
          size={rose.size}
          opacity={rose.opacity}
          delay={rose.delay}
          duration={rose.duration}
        >
          {rose.content}
        </Rose>
      ))}

      {/* Destellos */}
      {sparkles.map(sparkle => (
        <SparkleEffect
          key={sparkle.id}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
          }}
          size={sparkle.size}
          color={sparkle.color}
          delay={sparkle.delay}
          duration={sparkle.duration}
        />
      ))}

      {/* Mensaje de celebración */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationMessage
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            ¡Gracias por confirmar!<br />
            <span style={{ fontSize: '1.2rem' }}>Los esperamos mañana 🎉</span>
          </CelebrationMessage>
        )}
      </AnimatePresence>

      {/* Confeti */}
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={250}
            colors={['#ffc0cb', '#ff69b4', '#ff1493', '#ffb6c1', '#fff0f5', '#ff9eb5']}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
      </AnimatePresence>

      {/* Carta de invitación */}
      <EnvelopeWrapper
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Envelope>
          <TopLeftCorner />
          <BottomRightCorner />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <LetterPaper>
                {slides[currentSlide].content}
              </LetterPaper>
            </motion.div>
          </AnimatePresence>

          <WaxSeal
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCelebration}
            animate={{ 
              rotate: [0, 3, -3, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            💝
          </WaxSeal>
          <Ribbon />
        </Envelope>

        <ProgressDots>
          {slides.map((_, index) => (
            <Dot 
              key={index}
              active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </ProgressDots>
      </EnvelopeWrapper>
    </Container>
  );
};

export default LetterInvitation;