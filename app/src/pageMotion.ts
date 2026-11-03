import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function spatialPointerPose(x: number, y: number) {
  return { rotationX: -Math.max(-1, Math.min(1, y)) * 4, rotationY: Math.max(-1, Math.min(1, x)) * 6 };
}

// Pointer transforms have their own wrapper, so they never overwrite scroll poses.
// Resolve targets on each event: gallery tabs replace the artwork in place.
export function bindSpatialPointer(root: HTMLElement) {
  const selector = '.work-art, .project-slide-art, .experience-scene-stack';
  const hosts = root.matches(selector) ? [root] : Array.from(root.querySelectorAll<HTMLElement>(selector));
  const tweens = new Map<Element, { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>();
  const move = (event: PointerEvent) => {
    if (document.hidden || (event.pointerType && !['mouse', 'pen'].includes(event.pointerType))) return;
    const host = event.currentTarget as HTMLElement;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pose = spatialPointerPose((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
    host.querySelectorAll('.spatial-pointer').forEach(target => {
      // Retire replaced tab artwork; no detached tween targets accumulate.
      tweens.forEach((pair, previous) => { if (!root.contains(previous)) { pair.x.tween.kill(); pair.y.tween.kill(); tweens.delete(previous); } });
      if (!tweens.has(target)) tweens.set(target, { x: gsap.quickTo(target, 'rotationX', { duration: .5, ease: 'power2.out' }), y: gsap.quickTo(target, 'rotationY', { duration: .5, ease: 'power2.out' }) });
      const pair = tweens.get(target)!;
      pair.x(pose.rotationX); pair.y(pose.rotationY);
    });
  };
  const reset = () => tweens.forEach(pair => { pair.x(0); pair.y(0); });
  const hide = () => { if (document.hidden) tweens.forEach((pair, target) => { pair.x.tween.pause(); pair.y.tween.pause(); gsap.set(target, { rotationX: 0, rotationY: 0 }); }); };
  hosts.forEach(host => { host.addEventListener('pointermove', move); host.addEventListener('pointerleave', reset); });
  document.addEventListener('visibilitychange', hide);
  return () => {
    hosts.forEach(host => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset); });
    document.removeEventListener('visibilitychange', hide);
    tweens.forEach((pair, target) => { pair.x.tween.kill(); pair.y.tween.kill(); gsap.set(target, { rotationX: 0, rotationY: 0 }); });
    tweens.clear();
  };
}

// Chapter panels keep normal scrolling; only their visual depth follows progress.
export function useWorkGalleryMotion() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, ({ conditions }) => {
        if (!conditions?.motion) return;
        const desktop = conditions.desktop;
        const releasePointer = desktop && matchMedia('(hover: hover) and (pointer: fine)').matches ? bindSpatialPointer(root) : () => {};
        root.querySelectorAll<HTMLElement>('.project-slide').forEach((slide, index) => {
          const art = slide.querySelector('.project-slide-art');
          gsap.fromTo(art, { y: desktop ? 75 : 20, rotation: desktop ? (index % 2 ? 5 : -5) : 0, scale: .94 }, {
            y: desktop ? -45 : -12, rotation: desktop ? (index % 2 ? -2 : 2) : 0, scale: 1.02, ease: 'none',
            scrollTrigger: { id: `gallery-depth-${index}`, trigger: slide, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
          gsap.fromTo(slide.querySelector('.project-landscape'), { yPercent: -8, scale: 1.08 }, {
            yPercent: 8, scale: 1, ease: 'none',
            scrollTrigger: { trigger: slide, start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.fromTo(slide.querySelector('.project-slide-copy'), { y: desktop ? 42 : 16 }, {
            y: 0, ease: 'none', scrollTrigger: { trigger: slide, start: 'top 85%', end: 'top 15%', scrub: true },
          });
          // The panel survives project-tab changes; new art inherits its camera.
          gsap.fromTo(art, { rotationX: desktop ? 12 : 3, rotationY: desktop ? -18 : -4, transformPerspective: 1100 }, {
            rotationX: desktop ? -5 : 0, rotationY: desktop ? 10 : 3, ease: 'none',
            scrollTrigger: { id: `gallery-camera-${index}`, trigger: slide, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
        });
        return releasePointer;
      });
    }, root);
    return () => { media.revert(); context.revert(); };
  }, []);
  return ref;
}

// Normal document flow: each composition follows the reader, without extra pins.
export function usePageMotion() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, ({ conditions }) => {
        if (!conditions?.motion) return;
        const desktop = conditions.desktop;
        const releasePointer = desktop && matchMedia('(hover: hover) and (pointer: fine)').matches ? bindSpatialPointer(root) : () => {};
        const distance = desktop ? 72 : 24;
        root.querySelectorAll<HTMLElement>('.work-item').forEach((item, index) => {
          const art = item.querySelector<HTMLElement>('.work-art')!;
          const diagram = art.querySelector<HTMLElement>('.concept-art')!;
          gsap.fromTo(art, { y: distance, rotationX: desktop ? 12 : 0, rotationY: desktop ? (index % 2 ? -12 : 12) : 0, scale: .95 }, {
            y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'none',
            scrollTrigger: { id: `work-enter-${index}`, trigger: item, start: 'top bottom', end: 'top 32%', scrub: true, invalidateOnRefresh: true },
          });
          gsap.fromTo(diagram, { y: desktop ? 28 : 10, scale: 1.08, rotation: index % 2 ? -2 : 2 }, {
            y: desktop ? -28 : -10, scale: 1, rotation: 0, ease: 'none',
            scrollTrigger: { id: `work-depth-${index}`, trigger: art, start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.fromTo(art.querySelector('.spatial-camera'), { rotationX: desktop ? 10 : 3, rotationY: desktop ? -16 : -4 }, {
            rotationX: desktop ? -5 : 0, rotationY: desktop ? 12 : 3, ease: 'none',
            scrollTrigger: { id: `work-camera-${index}`, trigger: art, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
          gsap.fromTo(item.querySelector('.work-reveal-line'), { scaleX: 0 }, {
            scaleX: 1, ease: 'none', scrollTrigger: { trigger: item, start: 'top 85%', end: 'top 25%', scrub: true },
          });
        });
        root.querySelectorAll<HTMLElement>('.credential-list article').forEach((row, index) => {
          const card = row.querySelector<HTMLElement>('.credential-card')!;
          const timeline = gsap.timeline({ scrollTrigger: { id: `credential-${index}`, trigger: row, start: 'top 95%', end: 'top 30%', scrub: true, invalidateOnRefresh: true } });
          timeline.fromTo(card, { x: desktop ? -65 : -12, y: distance, rotation: desktop ? -9 : -3, rotationY: desktop ? -18 : 0, scale: .9 }, { x: 0, y: 0, rotation: 0, rotationY: 0, scale: 1, duration: 1, ease: 'power2.out' }, 0);
          timeline.fromTo(card.querySelector('.credential-symbol'), { y: 18, rotation: -12, scale: .8 }, { y: 0, rotation: 0, scale: 1, duration: .8 }, .15);
          timeline.fromTo(row.querySelector('.credential-details'), { y: desktop ? 28 : 12 }, { y: 0, duration: .8, ease: 'none' }, .1);
          timeline.fromTo(card.querySelector('.credential-glint'), { xPercent: -160 }, { xPercent: 160, duration: 1, ease: 'none' }, 0);
        });
        root.querySelectorAll<HTMLElement>('.github-heading, .github-stats, .github-latest, .about-grid h2, .about-body, .education-list, .skills-list, .principles, .contact-section h2, .contact-actions').forEach((element, index) => {
          gsap.fromTo(element, { y: desktop ? (index % 2 ? 34 : 54) : 18 }, {
            y: 0, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'top 60%', scrub: true },
          });
        });
        return releasePointer;
      });
    }, root);
    return () => { media.revert(); context.revert(); };
  }, []);
  return ref;
}
