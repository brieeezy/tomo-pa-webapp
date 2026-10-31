import {
  IconArrowDownRight,
  IconArrowRight,
  IconBolt,
  IconCalendarEvent,
  IconCheck,
  IconMessageChatbot,
  IconReceipt,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import Brand from "../components/Brand";

const features = [
  { icon: IconCalendarEvent, title: "Keep the moving parts together", description: "See your work, clients, and next steps in one calm, organized workspace.", tone: "aqua" },
  { icon: IconReceipt, title: "Stay on top of getting paid", description: "Create invoices and keep an eye on what is pending, paid, or overdue.", tone: "orange" },
  { icon: IconMessageChatbot, title: "Get a hand from Tomo", description: "Ask your AI assistant about the information already in your workspace.", tone: "jasmine" },
];

const projects = [
  { title: "Maven Module Builder", meta: "DEVELOPER TOOLING · 2020", description: "Narrowed large multi-module builds from about 45 minutes to roughly 1–5 minutes.", href: "https://github.com/swingspringer/MavenModuleBuilder", link: "View on GitHub" },
  { title: "Kube Switcher", meta: "DEVELOPER TOOLING · 2022", description: "A workflow utility for a microservices team working with shared environments and constrained local hardware.", href: "https://github.com/swingspringer/Kube-Switcher", link: "View on GitHub" },
  { title: "ViReX-E", meta: "RESEARCH & HARDWARE · 2019", description: "A thesis project that gave a repaired treadmill a second life as virtual reality exercise equipment.", href: "https://youtu.be/9vOnzmItaFo", link: "Watch project" },
];

export default function LandingPage() {
  return (
    <main className="tomo-marketing">
      <header className="tm-header">
        <a href="/" aria-label="Tomo home"><Brand /></a>
        <nav aria-label="Main navigation"><a href="#features">What Tomo does</a><a href="#about">About</a><a href="#work">Selected work</a></nav>
      </header>

      <section className="tm-hero">
        <div className="tm-hero-copy">
          <div className="tm-eyebrow"><span><IconSparkles size={15} /></span> A LITTLE MORE ROOM TO THINK</div>
          <h1>Your work,<br /><em>all together.</em></h1>
          <p>Meet Tomo, your AI personal assistant for keeping clients, invoices, and everyday work in sync.</p>
          <div className="tm-actions"><a href="#features" className="tm-secondary"><IconArrowDownRight size={16} /> See what Tomo can do</a></div>
          <div className="tm-assurance"><span><IconCheck size={14} /></span> One clear place for the work behind your work.</div>
        </div>
        <div className="tm-visual" aria-label="Tomo workspace preview">
          <div className="tm-orbit tm-orbit-one" /><div className="tm-orbit tm-orbit-two" /><span className="tm-sparkle">✦</span>
          <div className="tm-dashboard">
            <div className="tm-dash-top"><span className="tm-dots"><i /><i /><i /></span><b>tomo workspace</b><span className="tm-avatar">JM</span></div>
            <div className="tm-dash-body">
              <aside><div className="tm-dash-logo"><IconSparkles size={16} /></div><span className="selected"><IconBolt size={14} /> Overview</span><span><IconUsers size={14} /> Clients</span><span><IconReceipt size={14} /> Invoices</span></aside>
              <div className="tm-dash-main"><small>YOUR WORKSPACE</small><h3>A little more in sync.</h3><div className="tm-stat-grid"><div><small>INVOICED THIS MONTH</small><b>₱4,820</b><span>Across 8 invoices</span></div><div><small>AWAITING PAYMENT</small><b>₱1,240</b><span className="aqua-note">2 invoices pending</span></div></div><div className="tm-activity"><div className="tm-activity-head">Recent activity <span>View all</span></div><div><i className="orange-icon"><IconReceipt size={14} /></i><p><b>Invoice #1048</b><small>Studio North · Sent today</small></p><strong>₱860</strong></div><div><i className="aqua-icon"><IconCheck size={14} /></i><p><b>Payment received</b><small>Kindred Co. · Yesterday</small></p><strong className="paid">+₱1,200</strong></div></div><div className="tm-assistant"><IconSparkles size={14} /><span>TOMO ASSISTANT</span><b>What should I focus on today?</b><small>Ask Tomo anything <IconArrowRight size={12} /></small></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="tm-features" id="features">
        <div className="tm-section-label">LESS SCATTER. MORE FLOW.</div>
        <div className="tm-section-heading"><h2>Make space for the work<br />you’re here to do.</h2><p>Running a business comes with enough tabs open. Tomo brings day-to-day details into one thoughtful workspace, with an assistant close by when you need it.</p></div>
        <div className="tm-feature-grid">{features.map(({ icon: Icon, title, description, tone }, index) => <article className={`tm-feature ${tone}`} key={title}><div className="tm-feature-top"><span><Icon size={21} /></span><small>0{index + 1}</small></div><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="tm-about" id="about"><div className="tm-about-mark"><IconSparkles size={25} /></div><div className="tm-about-copy"><div className="tm-section-label">THOUGHTFULLY BUILT</div><h2>Made by an engineer who cares about the details.</h2><p>Tomo comes from Biglang-awa Consultancy, led by John Marvie Biglang-awa, a Senior Java Engineer in the Philippines with 7+ years building software. His work spans production issue diagnosis, developer productivity, and gradual modernization.</p><a href="https://biglang-awa-consultancy.web.app/" target="_blank" rel="noreferrer">Meet the engineer behind Tomo <IconArrowRight size={15} /></a><div className="tm-about-contact"><a href="mailto:john.biglang-awa@outlook.com">john.biglang-awa@outlook.com</a><a href="https://www.linkedin.com/in/jmbiglangawa/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div><div className="tm-about-years"><b>7+</b><span>years building<br />software</span><i /> <span>BIR registered sole proprietor<br />Business no. 0934 004 5058</span></div></section>

      <section className="tm-work" id="work"><div className="tm-section-label">SELECTED WORK</div><div className="tm-section-heading"><h2>Practical ideas.<br />Meaningful outcomes.</h2><p>A few tools and side projects by the engineer behind Tomo, spanning developer workflow, platform tooling, and hands-on experimentation.</p></div><div className="tm-project-grid">{projects.map((project) => <article className="tm-project" key={project.title}><small>{project.meta}</small><h3>{project.title}</h3><p>{project.description}</p><a href={project.href} target="_blank" rel="noreferrer">{project.link} <IconArrowRight size={14} /></a></article>)}</div><div className="tm-tech">JAVA <span>·</span> SPRING BOOT <span>·</span> REACT <span>·</span> JAVASCRIPT <span>·</span> MAVEN <span>·</span> DOCKER <span>·</span> KUBERNETES <span>·</span> KAFKA <span>·</span> SQL</div></section>

      <section className="tm-cta"><div className="tm-cta-icon"><IconBolt size={23} /></div><div><div className="tm-section-label">A CALMER KIND OF PRODUCTIVITY</div><h2>Less time keeping track.<br />More time moving forward.</h2></div><span className="tm-cta-star">✦</span></section>

      <footer className="tm-footer"><Brand /><span>Thoughtfully organized with Tomo · Biglang-awa Consultancy</span></footer>

    </main>
  );
}
