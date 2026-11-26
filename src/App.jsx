  import { useEffect, useMemo, useRef, useState } from 'react'

/* ---------- Data ---------- */

const NAV_LINKS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['work', 'Work'],
  ['contact', 'Contact'],
]

const SOCIALS = [
  { label: 'GitHub', icon: 'fa-github', href: 'https://github.com/' },
  { label: 'Facebook', icon: 'fa-facebook-f', href: 'https://facebook.com/' },
  { label: 'Instagram', icon: 'fa-instagram', href: 'https://instagram.com/' },
  { label: 'LinkedIn', icon: 'fa-linkedin-in', href: 'https://linkedin.com/' },
]

const PHRASES = ['Prototyping ideas', 'Designing experiences', 'Building interfaces']

const STATS = [
  { target: 4, label: 'Years of experience' },
  { target: 38, label: 'Projects completed' },
  { target: 120, label: 'Designs created' },
  { target: 15, label: 'Technologies used' },
]

const DESIGN_SKILLS = [
  ['Figma', 95],
  ['Wireframing', 92],
  ['Prototyping', 90],
  ['User research', 85],
  ['User flows', 88],
  ['Design systems', 87],
  ['Usability testing', 83],
]

const FRONTEND_SKILLS = [
  ['HTML', 94],
  ['CSS', 92],
  ['JavaScript', 80],
  ['Responsive design', 90],
  ['Git / GitHub', 78],
]

const OTHER_SKILLS = ['Canva', 'Adobe XD', 'Visual design', 'Communication', 'Problem solving']

const PROJECTS = [
  {
    thumb: 'a',
    icon: 'fa-bag-shopping',
    category: 'UI/UX · Web design',
    title: 'E-commerce website',
    text: 'A full storefront redesign focused on faster checkout and clearer product discovery for a mid-size retailer.',
    tech: ['Figma', 'HTML', 'CSS', 'JavaScript'],
    featured: true,
  },
  {
    thumb: 'b',
    icon: 'fa-mobile-screen-button',
    category: 'UI/UX',
    title: 'Mobile banking app',
    text: 'A calmer, more trustworthy interface for everyday banking, with an emphasis on legible data and quick actions.',
    tech: ['Figma', 'Prototyping', 'User research'],
  },
  {
    thumb: 'c',
    icon: 'fa-plane',
    category: 'Web design',
    title: 'Travel booking platform',
    text: 'An end-to-end booking flow, from destination search to confirmation, built to feel effortless on mobile.',
    tech: ['Figma', 'Design systems', 'HTML/CSS'],
  },
  {
    thumb: 'd',
    icon: 'fa-chart-line',
    category: 'Frontend',
    title: 'Personal productivity dashboard',
    text: 'A single-page dashboard pulling tasks, habits, and time tracking into one clean, glanceable view.',
    tech: ['JavaScript', 'CSS', 'Responsive design'],
  },
  {
    thumb: 'e',
    icon: 'fa-graduation-cap',
    category: 'UI/UX · Web design',
    title: 'School management system',
    text: 'A grading and attendance system redesigned around what teachers actually check every day.',
    tech: ['Figma', 'Usability testing', 'HTML'],
  },
  {
    thumb: 'f',
    icon: 'fa-wand-magic-sparkles',
    category: 'Frontend',
    title: 'Creative landing page',
    text: 'A playful, motion-driven landing page built to show off what CSS can do without a heavy framework.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
]

/* ---------- Hooks ---------- */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Returns [ref, seen]. `seen` flips to true once the element enters the viewport. */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, seen]
}

/** Typewriter that cycles through phrases. */
function useTyping(phrases) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(phrases[0])
      return
    }

    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = phrases[phraseIndex]

      if (!deleting) {
        charIndex++
        setText(current.slice(0, charIndex))
        if (charIndex === current.length) {
          deleting = true
          timer = setTimeout(tick, 1400)
          return
        }
      } else {
        charIndex--
        setText(current.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
        }
      }
      timer = setTimeout(tick, deleting ? 35 : 65)
    }

    tick()
    return () => clearTimeout(timer)
  }, [phrases])

  return text
}

/** Tracks which section is currently in the middle of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}

function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return y
}

/* ---------- Small components ---------- */

function Reveal({ className = '', children }) {
  const [ref, seen] = useInView(0.15)
  return (
    <div ref={ref} className={`reveal ${seen ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function SectionHead({ title, sub }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      <p className="section-sub">{sub}</p>
    </div>
  )
}

function SocialLinks({ className, items = SOCIALS, label = (s) => s.label }) {
  return (
    <div className={className}>
      {items.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={label(s)}>
          <i className={`fa-brands ${s.icon}`} />
        </a>
      ))}
    </div>
  )
}

function CountUp({ target, suffix = '+' }) {
  const [ref, seen] = useInView(0.6)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    const duration = 1400
    const start = performance.now()
    let raf

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [seen, target])

  return (
    <span ref={ref} className="stat__number">
      {value}
      {suffix}
    </span>
  )
}

function SkillBar({ name, level }) {
  const [ref, seen] = useInView(0.4)
  return (
    <li>
      <span className="skill-bars__name">{name}</span>
      <span className="skill-bars__track">
        <span
          ref={ref}
          className={`skill-bars__fill ${seen ? 'is-visible' : ''}`}
          style={{ '--level': `${level}%` }}
        />
      </span>
    </li>
  )
}

/* ---------- Sections ---------- */

function Background() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
      })),
    []
  )

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="orb orb--magenta" />
      <div className="orb orb--peach" />
      <div className="orb orb--violet" />
      <div className="stars">
        {stars.map((s, i) => (
          <span key={i} style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
        ))}
      </div>
    </div>
  )
}

function Nav({ active, scrolled }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav" style={{ boxShadow: scrolled ? '0 10px 30px -20px rgba(0,0,0,.6)' : 'none' }}>
      <div className="nav__inner">
        <a href="#home" className="nav__brand">
          Rollence<span>.</span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} id="navLinks" aria-label="Primary">
          {NAV_LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav__link ${active === id ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <SocialLinks
          className="nav__social"
          items={SOCIALS.slice(0, 3)}
          label={(s) => `${s.label} profile`}
        />

        <button
          className="nav__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const typed = useTyping(PHRASES)

  return (
    <section className="hero" id="home">
      <div className="hero__text">
        <p className="hero__eyebrow">UI/UX Designer &amp; Frontend Developer</p>

        <h1 className="hero__name">
          Rollence Nel
          <br />
          <span className="hero__name-accent">Adamos.</span>
        </h1>

        <p className="hero__typing" aria-live="polite">
          <span>{typed}</span>
          <span className="hero__cursor" aria-hidden="true" />
        </p>

        <p className="hero__intro">
          I design interfaces with heart — playful, purposeful, and easy to fall in love with. I turn
          wireframes into experiences people actually want to use, one thoughtful screen at a time.
        </p>

        <div className="hero__ctas">
          <a href="#contact" className="btn btn--ghost">
            Contact me
          </a>
        </div>
      </div>

      <div className="hero__portrait">
        <div className="portrait-frame">
          <img src={import.meta.env.BASE_URL + 'rollence-photo.jpg'} alt="Portrait of Rollence Nel Adamos" />
        </div>
        <div className="portrait-glow" aria-hidden="true" />
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
        <span />
      </a>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about">
      <SectionHead title="About" sub="A quick look at how I got here and what drives the work." />

      <div className="about__grid">
        <Reveal className="about__bio">
          <p>
            I'm Rollence, a UI/UX designer and frontend developer who likes taking a rough idea and
            turning it into something people genuinely enjoy using. My process usually starts with a
            lot of questions — about the person using the product, the problem they're trying to
            solve, and the constraints we're working within — before a single pixel gets placed.
          </p>
          <p>
            I split my time between research and prototyping in Figma and bringing those designs to
            life in code. I care a lot about accessibility: a beautiful interface that only works for
            some people isn't finished yet. Whether it's a wireframe, a design system, or
            production-ready HTML and CSS, I try to leave every project a little more usable than I
            found it.
          </p>
        </Reveal>

        <Reveal className="about__stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <CountUp target={s.target} />
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="skills" id="skills">
      <SectionHead title="Skills" sub="The tools and disciplines I reach for most often." />

      <div className="skills__columns">
        <Reveal className="skill-group">
          <h3>UI/UX design</h3>
          <ul className="skill-bars">
            {DESIGN_SKILLS.map(([name, level]) => (
              <SkillBar key={name} name={name} level={level} />
            ))}
          </ul>
        </Reveal>

        <Reveal className="skill-group">
          <h3>Frontend development</h3>
          <ul className="skill-bars">
            {FRONTEND_SKILLS.map(([name, level]) => (
              <SkillBar key={name} name={name} level={level} />
            ))}
          </ul>
        </Reveal>

        <Reveal className="skill-group">
          <h3>Other</h3>
          <div className="skill-tags">
            {OTHER_SKILLS.map((tag) => (
              <span className="skill-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Project({ p }) {
  return (
    <Reveal className={`project ${p.featured ? 'project--featured' : ''}`}>
      <div className={`project__thumb project__thumb--${p.thumb}`} aria-hidden="true">
        <span className="project__thumb-icon">
          <i className={`fa-solid ${p.icon}`} />
        </span>
      </div>
      <div className="project__body">
        <span className="project__category">{p.category}</span>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
        <div className="project__tech">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <a href="#" className="project__link">
          View project <i className="fa-solid fa-arrow-right" />
        </a>
      </div>
    </Reveal>
  )
}

function Work() {
  return (
    <section className="work" id="work">
      <SectionHead title="Work" sub="A few projects I've designed, built, or both." />
      <div className="work__grid">
        {PROJECTS.map((p) => (
          <Project key={p.title} p={p} />
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const [status, setStatus] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      setStatus('Please fill in every field before sending.')
      return
    }
    setStatus('Thanks — your message is ready. Connect a backend or form service to send it for real.')
    form.reset()
  }

  return (
    <section className="contact" id="contact">
      <SectionHead
        title="Let's create something great together"
        sub="Have a project in mind, or just want to say hi? My inbox is open."
      />

      <div className="contact__grid">
        <Reveal className="contact__form">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="cf-name">Name</label>
              <input type="text" id="cf-name" name="name" autoComplete="name" required />
            </div>
            <div className="form-row">
              <label htmlFor="cf-email">Email</label>
              <input type="email" id="cf-email" name="email" autoComplete="email" required />
            </div>
            <div className="form-row">
              <label htmlFor="cf-subject">Subject</label>
              <input type="text" id="cf-subject" name="subject" required />
            </div>
            <div className="form-row">
              <label htmlFor="cf-message">Message</label>
              <textarea id="cf-message" name="message" rows="5" required />
            </div>
            <button type="submit" className="btn btn--primary btn--full">
              Send message
            </button>
            <p className="form-status" role="status" aria-live="polite">
              {status}
            </p>
          </form>
        </Reveal>

        <Reveal className="contact__info">
          <a className="contact__email" href="mailto:hello@rollence.design">
            <i className="fa-solid fa-envelope" /> hello@rollence.design
          </a>
          <p className="contact__note">
            I usually reply within a day or two. For project inquiries, a quick note about scope and
            timeline helps me get back to you faster.
          </p>
          <SocialLinks className="contact__social" />
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <a href="#home" className="footer__brand">
          Rollence<span>.</span>
        </a>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Rollence Nel Adamos. Designed and built with care.
        </p>
        <SocialLinks className="footer__social" />
      </div>
    </footer>
  )
}

function BackToTop({ visible }) {
  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    >
      <i className="fa-solid fa-arrow-up" />
    </button>
  )
}

/* ---------- App ---------- */

const SECTION_IDS = NAV_LINKS.map(([id]) => id)

export default function App() {
  const active = useActiveSection(SECTION_IDS)
  const scrollY = useScrollY()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Background />
      <Nav active={active} scrolled={scrollY > 20} />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Contact />
      </main>

      <Footer />
      <BackToTop visible={scrollY > 600} />
    </>
  )
}
