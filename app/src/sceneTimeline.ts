import { gsap } from 'gsap';

export const EXPERIENCE_START = .28;
export const experienceProgress = (scene: number, start = EXPERIENCE_START) => Math.max(0, Math.min(1, (scene - start) / (1 - start)));

// Keep the hero handoff at the same scroll distance as chapter count grows.
export function scenePacing(count: number) {
  const screens = 1.4 + 1.8 * Math.max(1, count - 1);
  return { screens, handoff: 1.4 / screens };
}

export function sceneAnchorProgress(hash: string, ids: string[], start = EXPERIENCE_START) {
  if (hash === '#experience') return start;
  const index = ids.findIndex(id => `#${id}` === hash);
  return index < 0 ? null : start + (1 - start) * chapterProgress(index, ids.length);
}

export function chapterState(progress: number, count: number) {
  const position = Math.max(0, Math.min(1, progress)) * (count - 1);
  const segment = Math.min(count - 2, Math.floor(position));
  const local = position - segment;
  return { segment, local, active: segment + Number(local >= .5) };
}

export const chapterProgress = (index: number, count: number) => (index === count - 1 ? index - 1 + .94 : index + .08) / (count - 1);

// One scene, one pin: the handoff precedes the existing independent-layer timeline.
export function buildSceneTimeline(hero: HTMLElement, experience: HTMLElement, layers: gsap.core.Timeline, start = EXPERIENCE_START) {
  const timeline = gsap.timeline({ paused: true });
  timeline.to({}, { duration: 1 }, 0);
  const handoff = gsap.timeline();
  handoff.to({}, { duration: EXPERIENCE_START }, 0);
  handoff.fromTo(hero.querySelector('.hero-chevron'), { opacity: 1 }, { opacity: 0, duration: .06, ease: 'none' }, .01);
  handoff.fromTo(hero.querySelector('.portrait-wrap'), { x: 0, y: 0, yPercent: 0, scale: 1, opacity: 1 }, { y: -65, scale: .96, opacity: 0, duration: .17, ease: 'power2.inOut' }, .035);
  handoff.fromTo(hero.querySelector('.split-word.left'), { x: 0, y: 0, opacity: 1 }, { x: -75, y: -25, opacity: 0, duration: .16, ease: 'power2.inOut' }, .035);
  handoff.fromTo(hero.querySelector('.split-word.right'), { x: 0, y: 0, opacity: 1 }, { x: 75, y: -25, opacity: 0, duration: .16, ease: 'power2.inOut' }, .035);
  handoff.fromTo(hero.querySelector('.hero-identity'), { y: 0, opacity: 1 }, { y: -24, opacity: 0, duration: .13, ease: 'power2.inOut' }, .06);
  handoff.fromTo(hero.querySelector('.hero-blackhole'), { scale: 1, rotation: -24, opacity: .62 }, { scale: 1.08, rotation: -18, opacity: .12, duration: .23, ease: 'none' }, 0);
  handoff.fromTo(hero, { opacity: 1 }, { opacity: 0, duration: .10, ease: 'none' }, .15);
  handoff.fromTo(experience.querySelector('.section-heading'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .12 }, .12);
  handoff.fromTo(experience.querySelector('.experience-copy-stack'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .13 }, .13);
  handoff.fromTo(experience.querySelector('.experience-scene-stack'), { y: 55, scale: .97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .15, ease: 'power2.out' }, .10);
  handoff.fromTo(experience.querySelector('.experience-stage-footer'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .08 }, .19);
  handoff.fromTo(experience.querySelector('.experience-progress'), { opacity: 0 }, { opacity: 1, duration: .06 }, .21);
  timeline.add(handoff.duration(start).play(), 0);
  timeline.add(layers.duration(1 - start).play(), start);
  return timeline;
}
