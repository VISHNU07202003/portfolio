import { gsap } from 'gsap';

// Offsets are fractions of the illustration square, never random or accumulated.
export const scatterPoses = [
  { x: -.07, y: -.04, z: -35, rotation: -4, rotationX: 3, rotationY: -5, scale: .96 },
  { x: -.19, y: -.18, z: 65, rotation: -6, rotationX: -5, rotationY: 6, scale: 1.03 },
  { x: .10, y: -.16, z: 75, rotation: 6, rotationX: 5, rotationY: -6, scale: .97 },
  { x: .08, y: .12, z: 40, rotation: 4, rotationX: -4, rotationY: 3, scale: .98 },
  { x: -.10, y: .13, z: 55, rotation: -5, rotationX: 4, rotationY: -4, scale: 1.02 },
];
// Composed surfaces retain depth instead of collapsing back into one flat plane.
export const composedDepths = [0, 48, 80, 64, 96];
const surfaceTilt = [0, -4, 6, -3, 8];
export function buildExperienceTimeline(outgoing: gsap.TweenTarget[], incoming: gsap.TweenTarget[], size: () => number, rotations: number[][]) {
  const timeline = gsap.timeline({ paused: true });
  timeline.to({}, { duration: 1 }, 0); // Explicit holds at both ends.
  scatterPoses.forEach((pose, index) => {
    const start = .16 + index * .012;
    const outRotation = rotations[0][index];
    const inRotation = rotations[1][index];
    timeline.fromTo(outgoing[index], { x: 0, y: 0, z: 0, rotation: outRotation, rotationX: 0, rotationY: 0, scale: 1, opacity: 1 }, {
      x: () => pose.x * size(), y: () => pose.y * size(), z: pose.z,
      rotation: outRotation + pose.rotation, rotationX: pose.rotationX, rotationY: pose.rotationY,
      scale: pose.scale, duration: .30, ease: 'power2.inOut',
    }, start);
    timeline.to(outgoing[index], { opacity: 0, duration: .20, ease: 'none' }, .40 + index * .012);
    timeline.fromTo(incoming[index], {
      x: () => -pose.x * size() * .85, y: () => pose.y * size() * .85, z: pose.z,
      rotation: inRotation - pose.rotation, rotationX: -pose.rotationX, rotationY: -pose.rotationY,
      scale: pose.scale, opacity: 0,
    }, { opacity: 1, duration: .18, ease: 'none' }, .35 + index * .012);
    timeline.to(incoming[index], {
      x: 0, y: 0, z: 0, rotation: inRotation, rotationX: 0, rotationY: 0, scale: 1,
      duration: .35, ease: 'power2.inOut',
    }, .46 + index * .012);
  });
  return timeline;
}

// Middle chapters finish assembling before becoming the outgoing chapter.
// Later pairs must not render their initial poses while the first pair is playing.
export function buildExperienceSequence(groups: gsap.TweenTarget[][], size: () => number, rotations: number[][], cameras: gsap.TweenTarget[] = []) {
  const sequence = gsap.timeline({ paused: true });
  groups.slice(1).forEach(group => gsap.set(group, { opacity: 0 }));
  sequence.to({}, { duration: groups.length - 1 }, 0);
  cameras.forEach((camera, index) => {
    const start = Math.max(0, index - .65);
    const end = Math.min(groups.length - 1, index + .65);
    sequence.fromTo(camera, { rotationX: 8, rotationY: -16 }, {
      rotationX: -6, rotationY: 9, duration: end - start, ease: 'none',
    }, start);
  });
  for (let chapter = 0; chapter < groups.length - 1; chapter++) {
    scatterPoses.forEach((pose, index) => {
      const base = { x: 0, y: 0, z: composedDepths[index], rotationX: surfaceTilt[index], rotationY: 0, scale: 1 };
      sequence.fromTo(groups[chapter][index], { ...base, rotation: rotations[chapter][index] }, {
        x: () => pose.x * size() * 1.25, y: () => pose.y * size() * 1.25, z: composedDepths[index] + pose.z * 1.5,
        rotation: rotations[chapter][index] + pose.rotation, rotationX: pose.rotationX * 2, rotationY: pose.rotationY * 2.5,
        scale: pose.scale, duration: .30, ease: 'power2.inOut', immediateRender: chapter === 0,
      }, chapter + .16 + index * .012);
      sequence.fromTo(groups[chapter][index], { opacity: 1 }, { opacity: 0, duration: .20, ease: 'none', immediateRender: false }, chapter + .40 + index * .012);
      // One explicit transform tween makes early/late/reversed seeks identical.
      // Splitting initialization and assembly can retain stale poses after a seek.
      sequence.fromTo(groups[chapter + 1][index], {
        x: () => -pose.x * size(), y: () => pose.y * size(), z: composedDepths[index] + pose.z * 1.5,
        rotation: rotations[chapter + 1][index] - pose.rotation, rotationX: -pose.rotationX * 2, rotationY: -pose.rotationY * 2.5,
        scale: pose.scale, opacity: 0,
      }, { ...base, rotation: rotations[chapter + 1][index], opacity: 1, duration: .46, ease: 'power2.out', immediateRender: false }, chapter + .35 + index * .012);
    });
  }
  return sequence;
}
