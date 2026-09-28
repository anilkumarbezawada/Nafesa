import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  HeartHandshake,
  Menu,
  X,
} from 'lucide-react';
import './styles.css';

const nav = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Work', 'work'],
  ['Life', 'life'],
  ['Reach out', 'contact'],
];

const books = [
  { url: 'https://amzn.in/d/02jQqY9d', title: 'Echoes of Deception' },
  { url: 'https://amzn.in/d/0146EcMd', title: 'Ikigai' },
  { url: 'https://amzn.in/d/0aS4Czjj', title: "Man's Search For Meaning" },
  { url: 'https://amzn.in/d/0802oAjF', title: 'You Only Live Once' },
  { url: 'https://amzn.in/d/0amsKAhW', title: 'The Woman Under the Brim' },
];


const reveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const revealLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const revealRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(4px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

function CursorGlow() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  React.useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  return <motion.div className="cursor-glow" style={{ left: x, top: y }} />;
}

function Particles({ count = 16, light = false }) {
  const particles = React.useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      dur: Math.random() * 7 + 6,
      dx: Math.random() * 24 - 12,
    })), [count]);
  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`particle${light ? ' particle-light' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -50, 0], x: [0, p.dx, 0], opacity: [0.2, 0.65, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function Label({ children, light = false }) {
  return (
    <p className={`label${light ? ' label-light' : ''}`}>
      {children}
    </p>
  );
}

function Counter({ target, suffix = '' }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 1800;
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function MagneticBtn({ children, className = '', href }) {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.a
      ref={ref}
      className={className}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={move}
      onMouseLeave={reset}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.18 });
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const blobY = useTransform(scrollYProgress, [0, 0.3], [0, -130]);
  const closeMenu = () => setMenuOpen(false);
  const heroWord1 = 'Living'.split('');
  const heroWord2 = 'and writing.'.split('');

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <CursorGlow />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <motion.header
        className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.a className="wordmark" href="#home" onClick={closeMenu} whileHover={{ scale: 1.06 }}>
          Nafesa<span>&#x2733;</span>
        </motion.a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, id], i) => (
            <motion.a
              key={id} href={`#${id}`} className="nav-link"
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation">
          <AnimatePresence mode="wait">
            {menuOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.22 }}><X size={22} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.22 }}><Menu size={22} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              {nav.map(([label, id]) => (
                <motion.a key={id} href={`#${id}`} onClick={closeMenu} className="mobile-nav-link"
                  variants={staggerItem} whileHover={{ x: 10 }}
                >
                  {label}
                </motion.a>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section id="home" className="hero section-dark">
          <Particles count={22} />
          <div className="hero-orb hero-orb-1" aria-hidden="true" />
          <div className="hero-orb hero-orb-2" aria-hidden="true" />
          <motion.img className="hero-blob" src="/assets/olive-blob.svg" alt="" aria-hidden="true" style={{ y: blobY }} />
          <motion.img className="hero-botanical" src="/assets/botanical-sprig.png" alt="" aria-hidden="true"
            animate={{ rotate: [6, 10, 6], y: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img className="hero-dust" src="/assets/gold-dust.png" alt="" aria-hidden="true"
            animate={{ opacity: [0.88, 1, 0.88], scale: [1, 1.07, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="hero-inner" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div className="hero-copy" variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={staggerItem}><Label light>personal portfolio</Label></motion.div>
              <h1>
                <span className="hero-h1-line">
                  {heroWord1.map((l, i) => (
                    <motion.span key={i} className="hero-letter"
                      initial={{ opacity: 0, y: 64, rotateX: -45 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.28 + i * 0.065, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    >{l}</motion.span>
                  ))}
                </span>
                <br />
                <i className="hero-h1-line">
                  {heroWord2.map((l, i) => (
                    <motion.span key={i} className="hero-letter"
                      initial={{ opacity: 0, y: 64, rotateX: -45 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.5 + i * 0.048, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    >{l === ' ' ? '\u00A0' : l}</motion.span>
                  ))}
                </i>
              </h1>
              <motion.p className="hero-name" variants={staggerItem}>Nafesa Banu</motion.p>
              <motion.p className="hero-note" variants={staggerItem}>The 1999</motion.p>
            </motion.div>

          </motion.div>
          <motion.a className="scroll-cue" href="#about"
            animate={{ y: [0, 11, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1 }}
          >
            <ArrowDown size={16} /> read on
          </motion.a>
        </section>

        <section id="about" className="section about-section paper-section">
          <div className="section-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <Label>a little differently</Label>
              <h2>
                To whoever is reading this&#8230; <br />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <i>hi..</i>
                  <motion.span
                    style={{ display: 'inline-block', originX: '70%', originY: '70%', fontSize: '0.85em' }}
                    animate={{ rotate: [0, 20, -10, 20, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    👋
                  </motion.span>
                </span>
              </h2>
            </motion.div>
            <motion.div className="prose intro-prose" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              <p>Hi, I&#39;m <strong style={{ color: 'var(--terracotta)' }}>Nafesa</strong>. Rather than giving you a formal introduction, I&#39;d like to introduce myself a little differently.</p>
              <motion.div className="fact-list" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
                {[
                  'I can fix the light on my own like a 5 star Expert electrician.',
                  'I can lift a 25-litre water can on my own.',
                  'I can run a 10K in 40 minutes and then proudly rest for the rest of the week.',
                  'I\u2019m a proud stray dog mommy. \uD83D\uDC3E',
                  'I prefer to build long-term connections over digital noise.',
                  'Five days a week, I work in finance at Deloitte.',
                  'The other two days? Honestly, even I don\'t know where I\'ll end up.'
                ].map((fact, i) => (
                  <motion.p key={i} variants={staggerItem} whileHover={{ x: 7, color: 'var(--terracotta)' }} transition={{ duration: 0.2 }}>
                    <strong>0{i + 1}</strong> {fact}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          </div>
          <motion.div className="quote-strip" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={scaleIn}>
            <img src="/assets/star-swish.svg" alt="" aria-hidden="true" />
            <p>&#8220;One honest conversation can be the beginning of a very different future.&#8221;</p>
          </motion.div>
        </section>

        <section id="work" className="section section-olive">
          <Particles count={14} light />
          <div className="section-grid work-heading">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <Label light>learning &amp; work</Label>
              <h2>I&#39;ve always been <i>curious.</i></h2>
            </motion.div>
            <motion.p className="section-intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              Finance gave me a foundation. New chapters kept widening the frame.
            </motion.p>
          </div>
          <div className="education-block">
            <motion.div className="education-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealLeft} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260 }}>
              <span className="big-number">9.89</span>
              <span className="number-caption">CGPA &middot; B.Com &middot; 2020</span>
              <p>I have done my Bachelors in (B.Com) from Villa Marie Degree College for Women, Hyderabad, in 2020 with 9.89 CGPA.</p>
              <p>My degree introduced me to the world of Finance, Accounting and Taxation and gave me the foundation that eventually led me into my professional journey.</p>
              <p className="accent-line" style={{ color: '#ffffff', fontWeight: 'bold', textShadow: '0 0 10px rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
                BUT NOT A COVID PASS-OUT. 
                <motion.svg className="grad-cap-svg" viewBox="0 0 64 64" fill="none" style={{ display: 'inline-block', marginLeft: '10px', verticalAlign: 'middle', width: '36px', height: '36px' }}
                  animate={{ y: [0, -8, 0], rotate: [0, 8, -4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M4 28L32 16L60 28L32 40L4 28Z" fill="#ffb08e" />
                  <path d="M16 34V46C16 46 32 56 48 46V34" fill="#e87254" />
                  <path d="M32 22L50 34V48" stroke="#f2d388" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="50" cy="50" r="3" fill="#f2d388" />
                </motion.svg>
              </p>
            </motion.div>
            <motion.div className="education-copy education-copy-right" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={revealRight} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260 }}>
              <span className="big-number">10/10</span>
              <span className="number-caption">PG CERTIFICATE &middot; IIM KOZHIKODE &middot; 2023</span>
              <p>In 2023, I completed my Post Graduate Certificate from IIM Kozhikode (IIMK), specialising in Human Resources and Business Analytics, with a 10/10 CGPA.</p>
              <p>This chapter took me beyond my finance background and introduced me to a completely different side of business.</p>
              <p>What did I learn?</p>
              <motion.div className="skill-lines" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {[
                  '\uD83D\uDCCA Business Analytics',
                  '\uD83D\uDC65 Human Resources',
                  '\uD83D\uDCC8 Tableau & Data Visualisation',
                  '\uD83D\uDD0E Sourcing & Recruitment Concepts',
                  '\uD83D\uDCBC Business & Management Tools',
                ].map((s, i) => (
                  <motion.span key={i} variants={staggerItem} whileHover={{ scale: 1.06, color: '#ffb28f' }}>{s}</motion.span>
                ))}
              </motion.div>
              <p>I also worked on capstone projects, where I got the opportunity to take what I learned beyond textbooks and apply it to practical business scenarios.</p>
              <p>I explored several tools and concepts during the programme. While I&#39;m not currently hands-on with all of them in my day-to-day role, they gave me a broader understanding of how different functions come together in a business.</p>
            </motion.div>
          </div>
          <div className="career-block">
            <div className="career-title">
              <Label light>professional journey</Label>
              <h3>I carry <i>5+ years</i> of experience.</h3>
              <p className="career-note">Three chapters, each one teaching me a different way to work with people, pressure and change.</p>
            </div>
            <div className="career-stories">
              {[
                { num: '01', company: 'Deloitte', role: 'Vendor Master / Vendor Management', current: true, body: ['I joined Deloitte, and it has now been 3+ years of learning, growing and building my career here. I currently work in the Vendor Master / Vendor Management space, working across finance operations, vendor processes, controls and global teams.'] },
                { num: '02', company: 'IndiGo Airlines', role: 'Rajiv Gandhi International Airport', body: ['At the peak of COVID, when uncertainty was everywhere, I made a completely unexpected move into aviation and joined Indigo Airlines at Rajiv Gandhi International Airport.', 'It was challenging, unpredictable and completely different from my finance background but it taught me something invaluable. I learned to work with people, handle uncertainty, communicate under pressure and step outside my comfort zone.', 'Leaving the airport was genuinely difficult. It was not just a workplace anymore. It had become a part of my life.'] },
                { num: '03', company: 'Amazon', role: 'Accounts Payable Analyst', body: ['My professional journey began at Amazon, where I worked as an Accounts Payable Analyst.'] },
              ].map((s, i) => (
                <motion.article key={i} className={`career-story${s.current ? ' career-story--current' : ''}`}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={reveal}
                  whileHover={{ x: 7 }} transition={{ duration: 0.22 }}
                >
                  <div className="story-meta">
                    <h4>{s.company}</h4>
                    <p>{s.role}</p>
                    {s.current && (
                      <span className="current-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="3" width="16" height="14" rx="2" ry="2"></rect>
                          <line x1="2" y1="20" x2="22" y2="20"></line>
                        </svg>
                        Current
                      </span>
                    )}
                  </div>
                  <div className="story-body">{s.body.map((t, j) => <p key={j}>{t}</p>)}</div>
                </motion.article>
              ))}
            </div>

          </div>
        </section>

        <section id="life" className="section paper-section life-section">
          <motion.div className="life-feature" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <motion.div className="life-feature-copy" variants={revealLeft}>
              <div className="life-intro-heading">
                <Label>the other side</Label>
                <h2>Small moments.<br /><i>Big feeling.</i></h2>
              </div>
              <div className="prose life-intro-copy">
                <p>There&#39;s another side of me that I absolutely love. I love taking random pictures.</p>


              </div>
            </motion.div>
            <motion.div className="photo-grid" variants={staggerContainer}>
              {[
                { cls: 'photo-wide', src: '/assets/photo-puppies.jpeg', alt: 'Nafesa holding three puppies', cap: 'softness, in triplicate' },
                { cls: 'photo-tall', src: '/assets/photo-dogs-night.jpeg', alt: 'Two dogs sleeping outside at night', cap: 'the ones who find a warm light' },
                { cls: 'photo-tall', src: '/assets/photo-postcards.jpeg', alt: 'Handwritten postcards on a table', cap: 'notes worth keeping' },
                { cls: 'photo-sunset', src: '/assets/photo-sunset.jpeg', alt: 'A dark sunset with palm trees', cap: 'an evening in silhouette' },
              ].map((ph, i) => (
                <motion.figure key={i} className={`photo ${ph.cls}`} variants={staggerItem}
                  whileHover={{ scale: 1.025, zIndex: 2 }} transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img src={ph.src} alt={ph.alt} loading="lazy" />
                  <figcaption>{ph.cap}</figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </motion.div>
          <div className="life-panels">
            <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <BookOpen size={18} />
              <Label>writing</Label>
              <h3>I am very much into writing and surprisingly less into reading.</h3>
              <p className="prose">Early in my career, I wrote three books. Looking back now, I sometimes wonder what I was thinking.</p>
              <p className="prose">I was young, I knew very little about the world, and I was still figuring out life myself. Yet somehow, I had stories to tell.</p>
              <p className="prose">Those books carry a version of Nafesa who did not know much about life, but believed she had something to say about it.</p>
            </motion.article>
            <motion.article className="book-list" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              <p className="prose">So, if you&#39;re someone who actually has a habit of reading books unlike me here are a few that I genuinely think are worth your time.</p>
              <p className="prose">Maybe you&#39;ll find your next favourite book here. &#x1F4D6;</p>
              {books.map((book, index) => (
                <motion.a key={book.url} href={book.url} target="_blank" rel="noreferrer"
                  whileHover={{ x: 9, backgroundColor: 'rgba(232,114,84,0.07)' }} transition={{ duration: 0.2 }}
                >
                  <span className="book-num">0{index + 1}</span>
                  <span className="book-title">{book.title}</span>
                  <ArrowUpRight size={14} className="book-arrow" />
                </motion.a>
              ))}

            </motion.article>
          </div>
        </section>

        <section className="section section-dark speaking-section">
          <Particles count={16} />
          <img className="speaking-loop" src="/assets/botanical-loop.png" alt="" aria-hidden="true" />
          <div className="section-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <Label light>speaking</Label>
              <h2>Financial independence begins with a <i>conversation.</i></h2>
            </motion.div>
            <motion.div className="prose light-prose" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              <p>I have been part of platforms where I was invited to speak about financial independence, particularly with women who wanted to understand their finances, become more confident with money and take greater control of their financial future.</p>
              <p>And those conversations mean a lot to me.</p>
              <p>I especially love speaking with women who are looking for that confidence &mdash; not because I have all the answers, but because I believe sometimes one honest conversation can be the beginning of a very different future.</p>
              <motion.div className="principles" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {['Know where your money goes.', 'Understand your choices.', 'Be prepared for the unexpected.'].map((t, i) => (
                  <motion.span key={i} variants={staggerItem} whileHover={{ x: 7 }} transition={{ duration: 0.2 }}>{t}</motion.span>
                ))}
              </motion.div>
              <p>Because financial independence is not just about earning money. It is about knowing where your money goes. Understanding your choices. Being prepared for the unexpected.</p>
            </motion.div>
          </div>
        </section>

        <section className="section paper-section running-section">

          {/* Decorative background track */}
          <div className="run-track-bg" aria-hidden="true">
            <div className="run-track-line" />
            <div className="run-track-dot run-track-dot-1" />
            <div className="run-track-dot run-track-dot-2" />
            <div className="run-track-dot run-track-dot-3" />
          </div>

          <div className="section-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <Label>running</Label>
              <h2>One foot in front of the <i>other.</i></h2>
            </motion.div>
            <motion.div className="prose" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              <p>I have been part of 9 marathons so far.</p>
              <p>And somehow, I can run a 10K in around 40 minutes without questioning my life choices. &#x1F60C;</p>
              <p>But a 21K? Haven&#39;t tried it yet.</p>
              <p>I keep telling myself, &ldquo;Soon. Definitely soon.&rdquo;</p>
              <p>And once I conquer that, the ultimate challenge is waiting: <strong>42K</strong> &mdash; the full marathon.</p>
              <p>I&#39;ll try it someday. If I&#39;m still alive after the 21K, of course.</p>
            </motion.div>
          </div>

          {/* Premium stat cards */}
          <motion.div
            className="run-cards"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >

            {/* Card 1 – Marathons */}
            <motion.div
              className="run-card run-card-primary"
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="run-card-ring">
                <svg viewBox="0 0 120 120" className="run-ring-svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="50" className="run-ring-track" />
                  <motion.circle
                    cx="60" cy="60" r="50"
                    className="run-ring-fill"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  />
                </svg>
                <div className="run-card-icon-wrap">
                  <span className="run-card-emoji" aria-hidden="true">🏅</span>
                </div>
              </div>
              <div className="run-card-body">
                <div className="run-card-num">
                  <Counter target={9} suffix="" /><span className="run-card-unit">+</span>
                </div>
                <div className="run-card-label">Marathons</div>
                <div className="run-card-sub">completed &amp; counting</div>
              </div>
            </motion.div>

            {/* Card 2 – 10K Time */}
            <motion.div
              className="run-card run-card-accent"
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="run-card-ring">
                <svg viewBox="0 0 120 120" className="run-ring-svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="50" className="run-ring-track" />
                  <motion.circle
                    cx="60" cy="60" r="50"
                    className="run-ring-fill"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.74 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                  />
                </svg>
                <div className="run-card-icon-wrap">
                  <span className="run-card-emoji" aria-hidden="true">⏱️</span>
                </div>
              </div>
              <div className="run-card-body">
                <div className="run-card-num">
                  <Counter target={40} suffix="" /><span className="run-card-unit">min</span>
                </div>
                <div className="run-card-label">10K Pace</div>
                <div className="run-card-sub">personal best · 10 kilometres</div>
              </div>
            </motion.div>

            {/* Card 3 – Next Challenge */}
            <motion.div
              className="run-card run-card-challenge"
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="run-card-ring">
                <svg viewBox="0 0 120 120" className="run-ring-svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="50" className="run-ring-track" />
                  <motion.circle
                    cx="60" cy="60" r="50"
                    className="run-ring-fill run-ring-fill-challenge"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                  />
                </svg>
                <div className="run-card-icon-wrap">
                  <motion.span
                    className="run-card-emoji"
                    aria-hidden="true"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >🎯</motion.span>
                </div>
              </div>
              <div className="run-card-body">
                <div className="run-card-num">
                  42<span className="run-card-unit">K</span>
                </div>
                <div className="run-card-label">Next Challenge</div>
                <div className="run-card-sub">full marathon · coming soon</div>
              </div>
              {/* "Dream" badge */}
              <motion.div
                className="run-dream-badge"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              >
                <span>DREAM · TRAIN · RUN · </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Journey progress — running lady track */}
          <motion.div
            className="run-journey"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
          >
            <p className="run-journey-title">The Running Journey</p>

            {/* Animated running lady track */}
            <div className="run-lady-track">
              {/* Milestone labels row */}
              <div className="run-milestones-row">
                {[
                  { dist: '5K', done: true },
                  { dist: '10K', done: true },
                  { dist: '21K', done: false },
                  { dist: '42K', done: false },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    className={`run-milestone-flag${step.done ? ' run-milestone-flag--done' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    <span className="run-flag-emoji">
                      {step.done ? (
                        <motion.svg 
                          viewBox="0 0 24 24" fill="none" style={{ width: '24px', height: '24px', display: 'inline-block', marginRight: '6px', verticalAlign: '-4px' }}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.5, type: 'spring', bounce: 0.5, delay: 0.3 + i * 0.15 }}
                        >
                          <circle cx="12" cy="12" r="10" fill="#c8572a" />
                          <motion.path 
                            d="M7.5 12.5L10.5 15.5L16.5 8.5" 
                            stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
                          />
                        </motion.svg>
                      ) : '🚩'}
                    </span>
                    <span className="run-flag-label">{step.dist}</span>
                  </motion.div>
                ))}
              </div>

              {/* Track line with runner */}
              <div className="run-track-wrapper">
                {/* Dashed track */}
                <div className="run-track-road">
                  <div className="run-track-done" />
                  <motion.div
                    className="run-track-progress"
                    initial={{ width: 0 }}
                    whileInView={{ width: '52%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  />
                </div>

                {/* Running lady SVG — animates to 52% position */}
                <motion.div
                  className="run-lady-wrap"
                  initial={{ left: '0%' }}
                  whileInView={{ left: '49%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                >
                  <svg
                    className="run-lady-svg"
                    viewBox="0 0 64 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Running figure"
                  >
                    {/* RIGHT ARM (Background) */}
                    <motion.path
                      fill="none"
                      stroke="#c8572a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      animate={{ d: [
                        "M 36 21 L 42 28 L 50 22", 
                        "M 36 19 L 34 32 L 36 40", 
                        "M 36 21 L 28 28 L 24 20", 
                        "M 36 19 L 34 32 L 36 40", 
                        "M 36 21 L 42 28 L 50 22"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* RIGHT LEG (Background) */}
                    <motion.path
                      fill="none"
                      stroke="#3a2a1a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                      animate={{ d: [
                        "M 31 39 L 24 48 L 12 54 L 10 60", 
                        "M 31 37 L 42 44 L 42 56 L 46 60", 
                        "M 31 39 L 38 50 L 36 64 L 42 64", 
                        "M 31 37 L 31 52 L 24 64 L 28 64", 
                        "M 31 39 L 24 48 L 12 54 L 10 60"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* PONYTAIL */}
                    <motion.path
                      fill="none"
                      stroke="#2c1a0e" strokeWidth="4" strokeLinecap="round"
                      animate={{ d: [
                        "M 29 12 Q 18 10 14 16", 
                        "M 29 10 Q 18 14 14 20", 
                        "M 29 12 Q 18 8 14 10", 
                        "M 29 10 Q 18 14 14 20", 
                        "M 29 12 Q 18 10 14 16"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* HEAD */}
                    <motion.circle 
                      r="6" fill="#ffb08e"
                      animate={{ cx: [36, 36, 36, 36, 36], cy: [12, 10, 12, 10, 12] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* HAIR CAP */}
                    <motion.path 
                      fill="#2c1a0e"
                      animate={{ d: [
                        "M 30 12 A 6 6 0 0 1 42 12 Z", 
                        "M 30 10 A 6 6 0 0 1 42 10 Z", 
                        "M 30 12 A 6 6 0 0 1 42 12 Z", 
                        "M 30 10 A 6 6 0 0 1 42 10 Z", 
                        "M 30 12 A 6 6 0 0 1 42 12 Z"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* TORSO */}
                    <motion.path
                      fill="#e87254"
                      animate={{ d: [
                        "M 28 20 L 38 20 L 34 40 L 24 40 Z", 
                        "M 28 18 L 38 18 L 34 38 L 24 38 Z", 
                        "M 28 20 L 38 20 L 34 40 L 24 40 Z", 
                        "M 28 18 L 38 18 L 34 38 L 24 38 Z", 
                        "M 28 20 L 38 20 L 34 40 L 24 40 Z"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* LEFT LEG (Foreground) */}
                    <motion.path
                      fill="none"
                      stroke="#2c1a0e" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
                      animate={{ d: [
                        "M 27 39 L 34 50 L 32 64 L 38 64", 
                        "M 27 37 L 27 52 L 20 64 L 24 64", 
                        "M 27 39 L 20 48 L 8 54 L 6 60", 
                        "M 27 37 L 38 44 L 38 56 L 42 60", 
                        "M 27 39 L 34 50 L 32 64 L 38 64"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* LEFT ARM (Foreground) */}
                    <motion.path
                      fill="none"
                      stroke="#ffb08e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
                      animate={{ d: [
                        "M 30 21 L 22 28 L 18 20", 
                        "M 30 19 L 28 32 L 30 40", 
                        "M 30 21 L 36 28 L 44 22", 
                        "M 30 19 L 28 32 L 30 40", 
                        "M 30 21 L 22 28 L 18 20"
                      ] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                  </svg>

                  {/* Shadow — squishes as she bobs */}
                  <motion.div
                    className="run-lady-shadow"
                    animate={{ scaleX: [1, 0.7, 1, 0.7, 1], opacity: [0.3, 0.15, 0.3, 0.15, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>


        </section>


        <section className="section section-terracotta impact-section">
          <Particles count={12} light />
          <div className="section-grid">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft}>
              <Label light>volunteering &amp; impact</Label>
              <h2>Make room for the causes that feel <i>meaningful.</i></h2>
            </motion.div>
            <motion.div className="prose light-prose" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
              <p>I end up volunteering wherever I find a cause that feels meaningful to me.</p>
              <p>It could be Blue Cross, helping with vaccination drives and animal welfare. Or it could be working with women listening to them, educating them, and reminding them that their circumstances do not have to define their future.</p>
              <p>I have also been actively involved as an intern with the Women Safety Wing / Police Station initiatives, where I got the opportunity to witness and support work involving underprivileged women who were rescued, supported and connected with opportunities for employment and independence.</p>
            </motion.div>
          </div>
          <motion.div className="impact-bottom" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.div className="impact-mark" variants={staggerItem}>
              <motion.div animate={{ scale: [1, 1.16, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                <HeartHandshake size={30} />
              </motion.div>
              <span>for more choices</span>
            </motion.div>
            <motion.div className="prose light-prose" variants={staggerItem}>
              <p>But for me, it is not only about helping someone through a difficult situation. I want women to know that they do not always have to compromise on themselves.</p>
              <p>That they can work on themselves. Build their confidence. Learn new skills. Become financially independent. And create a life where they have choices.</p>
              <p>Through the programmes and sessions I have been part of, I have tried to encourage women to believe in themselves, keep learning and never compromise their self-worth.</p>
            </motion.div>
          </motion.div>
        </section>

        <section id="contact" className="section closing-section section-dark">
          <Particles count={22} />
          <div className="closing-ring" aria-hidden="true" />
          <img className="closing-botanical" src="/assets/botanical-sprig.png" alt="" aria-hidden="true" />
          <motion.div className="closing-content" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={staggerItem}><Label light>the story continues</Label></motion.div>
            <motion.h2 variants={staggerItem}>
              Thank you{' '}
              <motion.span
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
              >&#9825;</motion.span>
            </motion.h2>
            <motion.div className="closing-copy prose light-prose" variants={staggerItem}>
              <p>If you&#39;ve made it all the way here, thank you for taking the time to know a little more about me.</p>
              <p>This portfolio is not just a collection of degrees, job titles, achievements and certificates. It is a collection of little pieces of who I am, the work I do, the causes that create the impact.</p>
              <p>I may not have everything figured out yet. But I&#39;m learning, growing, running, writing, speaking, volunteering, taking random pictures and occasionally lifting 25-litre water cans.</p>
              <p>And the story is far from over.</p>
              <p>Thank you for being a part of this chapter.</p>
              <p className="signature">&mdash; Nafesa Banu</p>
            </motion.div>
            <motion.div variants={staggerItem}>
              <MagneticBtn className="contact-link" href="mailto:hello@nafesa.com">
                say hello <ArrowUpRight size={17} />
              </MagneticBtn>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <motion.footer className="site-footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <motion.a className="wordmark" href="#home" whileHover={{ scale: 1.05 }}>Nafesa<span>&#x2733;</span></motion.a>
        <p>&#169; 2026 Nafesa Banu &middot; made of many chapters</p>
        <motion.a href="#home" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>back to top &#8593;</motion.a>
      </motion.footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
