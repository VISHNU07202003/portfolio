import { siteHref, sitePath, caseStudyReturn } from './sitePath';
import { useCallback, useEffect, useState } from 'react';
import content from './publicContent';
import portrait from './assets/portrait.jpg';
import Visual from './Visual';
import HeroIntro from './HeroIntro';
import { shouldShowIntro, useHeroMotion } from './heroMotion';
import Experience from './Experience';
import Manu from './Manu';
import ContactSection from './Contact';
import Certifications from './Certifications';
import { usePageMotion, useWorkGalleryMotion } from './pageMotion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GithubActivity from './GithubActivity';
import ufLogo from './assets/uf-ifas-logo.png';
import universityLogo from './assets/uf-logo.png';
import vitLogo from './assets/vit-ap-logo.png';
import smartLogo from './assets/smartinternz-logo.png';

const Arrow=()=> <span aria-hidden="true">↗</span>;
function Header({onIntro,gallery=false}:{onIntro:()=>void;gallery?:boolean}) {
  const [menu,setMenu]=useState(false);
  return <header className={`site-header frame${gallery?' gallery-header':''}`}><a className="wordmark" href={siteHref("/")} aria-label="Vishnu Sai Padyala home">VISHNU<span> SAI PADYALA</span><span className="wordmark-dot">.</span></a><button className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" onClick={()=>setMenu(!menu)}>{menu?'Close −':'Menu +'}</button><nav id="main-nav" className={menu?'is-open':''} aria-label="Main navigation">{['Work','Experience','About'].map(x=><a key={x} href={siteHref(x==='Work'?'/work/':`/#${x.toLowerCase()}`)} aria-current={gallery&&x==='Work'?'page':undefined} onClick={()=>setMenu(false)}>{x}</a>)}<a href={siteHref("/#contact")} className="nav-contact" onClick={()=>setMenu(false)}>Let’s talk <Arrow/></a><button className="intro-link" onClick={()=>{setMenu(false);onIntro();}}>View intro</button></nav></header>;
}
function Hero(){return <section className="hero" aria-labelledby="hero-name"><div className="hero-blackhole" aria-hidden="true"><div/><i/></div><div className="portrait-stage frame"><span className="split-word left" aria-hidden="true">DEVE</span><div className="portrait-wrap"><img src={portrait} width="900" height="1600" alt="Vishnu Sai Padyala, wearing a black jacket" fetchPriority="high"/></div><span className="split-word right" aria-hidden="true">LOPER</span></div><div className="hero-identity"><h1 id="hero-name">Vishnu Sai Padyala<span className="accent-dot">.</span></h1><p>{content.profile.headline}</p></div><a href="#experience" className="hero-chevron" aria-label="Scroll to Experience"><svg width="30" height="18" viewBox="0 0 30 18" fill="none" aria-hidden="true"><path d="m3 4 12 11L27 4" stroke="currentColor" strokeWidth="1.5"/></svg></a></section>}
function Work(){const projects=content.projects.filter(project=>project.featured);return <section id="work" className="work-section frame section-space"><div className="section-heading"><span className="eyebrow">02 / SELECTED WORK</span><span className="section-aside">Ideas, made tangible.</span></div><h2>A few things<br/>worth a closer look<span className="accent-dot">.</span></h2><div className="work-grid" data-count={projects.length}>{projects.map((p,i)=><a href={siteHref(`/work/${p.id}/`)} className={`work-item work-item-${i}`} key={p.id}><div className="work-art"><Visual kind={p.kind} compact/><span className="gallery-art-caption">Conceptual illustration</span><span className="work-open" aria-hidden="true">↗</span></div><span className="work-reveal-line" aria-hidden="true"/><div className="work-caption"><div><span className="eyebrow">{p.classification}</span><h3>{p.name}</h3></div><span className="work-number">0{i+1}</span></div><p>{p.heading}</p><span className="work-explore">Explore project ↗</span></a>)}</div></section>}

function WorkGallery() {
 const ref=useWorkGalleryMotion();
 const chapters=content.workChapters;
 const projects=[...content.projects,...content.additionalWork];
 const logos:Record<string,string>={ifas:ufLogo,uf:universityLogo,'vit-ap':vitLogo,smartinternz:smartLogo};
 const [selection,setSelection]=useState<Record<string,string>>(()=>Object.fromEntries(chapters.map(c=>[c.id,c.projectIds.includes(location.hash.slice(1))?location.hash.slice(1):c.projectIds[0]])));
 useEffect(()=>{
  let frame=0;
  const syncHash=()=>{
   const id=location.hash.slice(1),chapter=chapters.find(c=>c.projectIds.includes(id));
   if(!chapter)return;
   setSelection(s=>({...s,[chapter.id]:id}));
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>document.getElementById(chapter.id)?.scrollIntoView({behavior:'instant'}));
  };
  window.addEventListener('hashchange',syncHash);
  return()=>{window.removeEventListener('hashchange',syncHash);cancelAnimationFrame(frame);};
 },[chapters]);
 function selectProject(chapter:string,id:string){setSelection(s=>({...s,[chapter]:id}));history.replaceState(null,'',`#${id}`);}
 useEffect(()=>{const frame=requestAnimationFrame(()=>ScrollTrigger.refresh());return()=>cancelAnimationFrame(frame);},[selection]);
 return <main ref={ref} id="main" tabIndex={-1} className="work-gallery">
  <div className="gallery-bar frame"><h1>Work, in context<span className="accent-dot">.</span></h1><nav aria-label="Work chapters">{chapters.map((c,i)=><a href={`#${c.id}`} key={c.id}>0{i+1}<span>{c.label}</span></a>)}<a href="#other-projects">0{chapters.length+1}<span>Other work</span></a></nav></div>
  {chapters.map((c,i)=>{const p=projects.find(p=>p.id===selection[c.id])!;return <section id={c.id} className={`project-slide project-slide-${c.id}`} aria-labelledby={`gallery-${c.id}`} key={c.id}>
   <div className="project-landscape" aria-hidden="true"><i/><i/><i/><span>{c.label}</span></div>
   <div className="chapter-identity frame"><div><span className="eyebrow">WORK / 0{i+1}</span><h2 id={`gallery-${c.id}`}>{c.organization}</h2></div><span className={`chapter-logo chapter-logo-${c.id}`}><img src={logos[c.id]} alt={`${c.label} logo`}/></span></div>
   <div className="chapter-project-tabs frame" role="tablist" aria-label={`${c.organization} projects`}>{c.projectIds.map((id,j)=>{const project=projects.find(p=>p.id===id)!;return <button key={id} id={`tab-${id}`} type="button" role="tab" aria-selected={p.id===id} aria-controls={`panel-${c.id}`} tabIndex={p.id===id?0:-1} onClick={()=>selectProject(c.id,id)} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?c.projectIds.length-1:(j+(event.key==='ArrowRight'?1:c.projectIds.length-1))%c.projectIds.length;selectProject(c.id,c.projectIds[next]);document.getElementById(`tab-${c.projectIds[next]}`)?.focus();}}><span>0{j+1}</span>{project.name}</button>;})}</div>
   <div id={`panel-${c.id}`} role="tabpanel" aria-labelledby={`tab-${p.id}`} tabIndex={0}>
   <div className="project-slide-inner frame">
    <div className="project-slide-copy" id={p.id}><span className="eyebrow">{p.category}</span><h3>{p.id==='campus-events'?'Campus Events':p.id==='yelp-analysis'?'Yelp Analysis':p.id==='covid-19'?'COVID-19 Trends':p.name}<span>.</span></h3><p className="project-slide-heading">{p.heading}</p><span className="project-classification">{p.classification}</span><p className="project-slide-summary">{p.summary}</p><a href={'repository' in p?p.repository:siteHref(`/work/${p.id}/?from=work`)} className="text-link">{'repository' in p?'Explore the repository':p.id==='plant-cropper'?'Explore the project overview':'Explore the case study'}<Arrow/></a></div>
    <figure className="project-slide-art"><div className="project-art-orbit" aria-hidden="true"/><div className="project-art-panel" key={p.id}><Visual kind={p.kind}/></div><span className="project-art-label" aria-hidden="true">{p.category}</span><figcaption>Conceptual illustration · not a product screenshot</figcaption></figure>
   </div>
   </div>
   <div className="project-slide-footer frame"><span>0{i+1} <span>/ 0{chapters.length+1}</span></span><a href={i<chapters.length-1?`#${chapters[i+1].id}`:'#other-projects'}>Next / {i<chapters.length-1?chapters[i+1].label:'Other work'}<span aria-hidden="true">↓</span></a></div>
  </section>;})}
  <section id="other-projects" className="gallery-other frame section-space"><span className="eyebrow">0{chapters.length+1} / OTHER WORK</span><h2>Still exploring<span className="accent-dot">.</span></h2><p>More projects and experiments on GitHub.</p><a href="https://github.com/VISHNU07202003?tab=repositories" className="text-link">Explore the repositories <Arrow/></a></section>
  <div className="gallery-return frame"><a href={siteHref('/#experience')} className="text-link">← Back to Experience</a><a href={siteHref('/#contact')} className="text-link">Let’s talk <Arrow/></a></div>
 </main>;
}
function About(){return <section id="about" className="about-section frame section-space"><span className="eyebrow">03 / THE PERSON BEHIND THE WORK</span><div className="about-grid"><h2>Curiosity,<br/>with intention<span className="accent-dot">.</span></h2><div className="about-body"><p className="about-lead">{content.profile.introduction}</p><p>{content.profile.bio}</p><a href="#contact" className="text-link">Start a conversation <Arrow/></a></div></div><div className="strengths" aria-label="Areas of focus">{content.profile.strengths.map(strength=><span key={strength}>{strength}</span>)}</div><div id="education" className="education-list"><h3>Education</h3>{content.profile.education.map(item=><div key={item.institution}><h4>{item.institution}</h4><p>{item.degree}</p><span>{item.dates}</span></div>)}</div><div id="skills" className="skills-list"><h3>Selected skills</h3><dl>{content.profile.skills.map(skill=><div key={skill.area}><dt>{skill.area}</dt><dd>{skill.items}</dd></div>)}</dl></div><div className="principles"><span>01 <strong>Look closer.</strong></span><span>02 <strong>Think clearly.</strong></span><span>03 <strong>Make it matter.</strong></span></div></section>}
function CaseStudy(){const id=sitePath(location.pathname).split('/').filter(Boolean)[1]||'';const p=content.projects.find(project=>project.id===id);const source=new URLSearchParams(location.search).get('from');const back=caseStudyReturn(p?.id||'',Boolean(p?.featured),source);return <main id="main" tabIndex={-1} className="case-page frame"><a className="text-link" href={siteHref(back.href)}>{back.label}</a>{p?<><div className="case-header"><span className="eyebrow">{p.category} / {p.id==='plant-cropper'?'PROJECT OVERVIEW':'CASE STUDY'}</span><h1>{p.name}<span className="accent-dot">.</span></h1><p>{p.heading}</p><span className="case-classification">{p.classification}</span><p className="case-summary">{p.summary}</p></div><div className="case-cover"><Visual kind={p.kind}/></div><div className="case-content"><aside><span className="eyebrow">IN THIS STORY</span>{p.sections.map((section,i)=><a key={section.title} href={`#part-${i}`}>{String(i+1).padStart(2,'0')} / {section.title}</a>)}<a href="#case-links">{String(p.sections.length+1).padStart(2,'0')} / Explore further</a></aside><div>{p.sections.map((section,i)=><section id={`part-${i}`} key={section.title}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{section.title}</h2><p>{section.body}</p></section>)}<section id="case-links"><span className="eyebrow">{String(p.sections.length+1).padStart(2,'0')}</span><h2>Explore further</h2>{p.links.map(link=><a key={link.href} href={siteHref(link.href)} className="text-link">{link.label} <Arrow/></a>)}</section></div></div><a href={siteHref(source==='work'?'/work/':'/#work')} className="text-link">Explore more work <Arrow/></a></>:<div className="case-header"><span className="eyebrow">NOT FOUND</span><h1>A page<br/>still unwritten.</h1><p>This case study is not available.</p><a href={siteHref("/")}>Return home ↗</a></div>}</main>}
export default function App() {
 const [intro,setIntro]=useState(shouldShowIntro);
 const [revealing,setRevealing]=useState(false);
 const { ref: heroRef, reduced, paused, toggle }=useHeroMotion();
 const pageRef=usePageMotion();
 const home=sitePath(location.pathname)==='/';
 const gallery=sitePath(location.pathname)==='/work';
 const closeIntro=useCallback(()=>{setIntro(false);setRevealing(false);},[]);
 const revealHero=useCallback(()=>setRevealing(true),[]);
 useEffect(()=>{
  const project=content.projects.find(item=>sitePath(location.pathname)===`/work/${item.id}`);
  document.title=home?'Vishnu Sai Padyala — Engineering & Imagination':`${gallery?'Selected Work':project?.name||'Page not found'} — Vishnu Sai Padyala`;
  // Resolve deep links after pin measurements, without a CSS smooth-scroll race.
  const frame=requestAnimationFrame(()=>{
   if(location.hash&&!(['#experience','#android-experience'].includes(location.hash)&&document.querySelector('.has-cinematic-stage'))){
    ScrollTrigger.refresh();
    const anchor=document.getElementById(location.hash.slice(1));
    (gallery?anchor?.closest('.project-slide')||anchor:anchor)?.scrollIntoView({behavior:'instant'});
    ScrollTrigger.update();
   }
  });
  return ()=>cancelAnimationFrame(frame);
 },[home,gallery]);
 return <><a className="skip-link" href="#main">Skip to content</a>
 <Header gallery={gallery} onIntro={()=>setIntro(true)}/>
 {home?<main ref={pageRef} id="main" tabIndex={-1}>
  <div className="story-sequence"><div className="story-stage"><div ref={heroRef} className={`hero-motion${revealing?' hero-revealing':''}`} data-motion="paused">
   <Hero/>
   <button className="motion-toggle" onClick={toggle} aria-pressed={paused} disabled={reduced}>
    {reduced?'Reduced motion':paused?'Resume motion':'Pause motion'}
   </button>
  </div><Experience/></div></div><Work/><GithubActivity/><About/><Certifications/><ContactSection/>
 </main>:gallery?<WorkGallery/>:<CaseStudy/>}
 <footer className="site-footer frame"><a href={siteHref("/")}>VISHNU SAI PADYALA<span className="accent-dot">.</span></a><span>ENGINEERING × IMAGINATION</span><a href="#main">Back to top ↑</a></footer>
 <Manu/>{intro&&<HeroIntro onClose={closeIntro} onReveal={revealHero}/>}</>;
}
