import React, { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";
import * as classes from "./_multiLink.module.css";

// Ported from https://yathag.github.io/multilink-safety-filter/ (the URL cited in
// the arXiv paper). That page names this one as canonical, so keep the two in sync.
const PAGE_URL = "https://yatharthagarwal.net/multi-link/";
const MEDIA = "/multi-link";

const BIBTEX = `@misc{agarwal2026multilinksafetyfilteringvla,
  title         = {Multi-Link Safety Filtering for {VLA} Policies
                   Around Moving Hazards},
  author        = {Agarwal, Yatharth and Raghunathan, Vijay},
  year          = {2026},
  eprint        = {2609.40007},
  archivePrefix = {arXiv},
  primaryClass  = {cs.RO},
  url           = {https://arxiv.org/abs/2609.40007}
}`;

function Clip({ name, children }) {
  return (
    <figure className={classes.Clip}>
      <video muted loop playsInline preload="none" poster={`${MEDIA}/images/poster_${name}.jpg`}>
        <source src={`${MEDIA}/videos/${name}.mp4`} type="video/mp4" />
      </video>
      <figcaption>{children}</figcaption>
    </figure>
  );
}

// One "escape" tile of the hazard-motion figure: the hazard slides from its
// start to a stop marker, then fades out.
function EscapeTile({ x, end, keyTime, label }) {
  const start = x + 26;
  return (
    <g>
      <rect className={classes.HzTile} x={x} y="291" width="232" height="279" rx="8" />
      <circle className={classes.HzPath} cx={start} cy="410.5" r="8" strokeWidth="2" />
      <line className={classes.HzPath} x1={start} y1="410.5" x2={end} y2="410.5" strokeWidth="3" />
      <rect className={classes.HzPath} x={end - 7} y="403.5" width="14" height="14" strokeWidth="2" />
      <circle className={classes.HzDot} cx={start} cy="410.5" r="11">
        <animate attributeName="cx" values={`${start};${end};${end}`} keyTimes={`0;${keyTime};1`} dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.95;1" dur="9s" repeatCount="indefinite" />
      </circle>
      <text className={classes.HzLabel} x={x + 116} y="536">{label}</text>
    </g>
  );
}

function CopyButton({ targetRef }) {
  const [label, setLabel] = useState("Copy");

  const onClick = () => {
    const pre = targetRef.current;
    const selectText = () => {
      const range = document.createRange();
      range.selectNodeContents(pre);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setLabel("Selected");
    };
    try {
      navigator.clipboard.writeText(pre.textContent).then(() => setLabel("Copied"), selectText);
    } catch (err) {
      selectText();
    }
    setTimeout(() => setLabel("Copy"), 1800);
  };

  return (
    <button className={classes.Copy} type="button" onClick={onClick}>{label}</button>
  );
}

export default function MultiLinkPage() {
  const rootRef = useRef(null);
  const motionRef = useRef(null);
  const bibRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const clips = rootRef.current.querySelectorAll("video");
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // React leaves `muted` out of the server-rendered HTML, and browsers block
    // play() on a clip that is not muted.
    clips.forEach((v) => { v.muted = true; });

    // Readers who ask for reduced motion get the hazard tiles frozen four
    // seconds in, where every tile shows its path, and video controls instead
    // of autoplay.
    const svg = motionRef.current;
    if (still && svg && svg.pauseAnimations) {
      svg.setCurrentTime(4);
      svg.pauseAnimations();
    }
    if (still || !("IntersectionObserver" in window)) {
      clips.forEach((v) => { v.preload = "metadata"; v.controls = true; });
      return undefined;
    }

    // Play a looping clip only while it is on screen, so the page does not
    // download and decode every video at once.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          const p = v.play();
          if (p && p.catch) p.catch(() => { v.controls = true; });
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    clips.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Seo
        title="Multi-Link Safety Filtering for VLA Policies"
        description="A training-free safety filter that keeps a pretrained vision-language-action robot policy from hitting moving objects, guarding the whole arm and running on one laptop."
      />
      <Helmet>
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Multi-Link Safety Filtering for VLA Policies Around Moving Hazards" />
        <meta property="og:description" content="A training-free safety filter that keeps a pretrained robot policy from hitting moving objects: it guards the gripper, wrist and forearm, follows the object as it moves, and runs on one laptop." />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={`https://yatharthagarwal.net${MEDIA}/images/poster_sim_escape-300.jpg`} />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>
      <Page>
        <div className={classes.MultiLink} ref={rootRef}>

          <header className={classes.Hero}>
            <Link to="/projectsPage/" className={classes.Breadcrumb}>
              <span className={classes.BackArrow}>←</span>Projects
            </Link>
            <span className={classes.Category}>Safe Robot Manipulation</span>
            <h1 className={classes.Title}>Multi-Link Safety Filtering for VLA Policies Around Moving Hazards</h1>
            <p className={classes.Authors}>
              <span>Yatharth Agarwal</span>
              <span>Vijay Raghunathan</span>
            </p>
            <p className={classes.Affil}>School of Electrical and Computer Engineering, Purdue University</p>
            <nav className={classes.Links} aria-label="Paper links">
              <a className={classes.Btn} href="https://arxiv.org/abs/2609.40007">arXiv</a>
              <a className={classes.Btn} href="#bibtex">BibTeX</a>
              <span className={`${classes.Btn} ${classes.Disabled}`} title="The code link appears here once it is released">Code (coming soon)</span>
            </nav>
          </header>

          <section className={classes.Teaser} aria-label="Overview">
            <div className={classes.Grid}>
              <Clip name="hw_1_unshielded_moving_hazard">
                <span className={`${classes.Pill} ${classes.BadBg}`}>No filter</span> The arm knocks the bottle over.
              </Clip>
              <Clip name="hw_2_shielded_moving_hazard">
                <span className={`${classes.Pill} ${classes.GoodBg}`}>With our filter</span> The cube reaches the cup and the bottle stays upright.
              </Clip>
            </div>
            <p className={classes.Lead}>A robot policy that follows language instructions can finish its task and still knock over things it was never asked to touch. We add a safety filter between the policy and the robot that keeps the whole arm away from a hazard, even while someone moves it, without retraining the policy.</p>
          </section>

          <section id="idea">
            <h2>The idea in three parts</h2>
            <div className={classes.Cards}>
              <article className={classes.Card}>
                <h3><span className={classes.Tag}>1</span> Guard the whole arm</h3>
                <p>Many safety filters for these policies only guard the gripper. Ours also guards the wrist and forearm, which can hit things before the gripper does as the arm reaches across the table.</p>
              </article>
              <article className={classes.Card}>
                <h3><span className={classes.Tag}>2</span> Follow moving objects</h3>
                <p>The object to avoid is found once, at the start. After that a lightweight tracker follows it as it moves, instead of searching for it again in every frame.</p>
              </article>
              <article className={classes.Card}>
                <h3><span className={classes.Tag}>3</span> Run on one laptop</h3>
                <p>The robot policy, the object finder and the safety filter all run on a single laptop processor. The filter only nudges the policy's commands when the arm gets too close.</p>
              </article>
            </div>
          </section>

          <section id="simulation">
            <h2>Moving hazards in simulation</h2>
            <p className={classes.Lead}>We built a simulated test in which the object to avoid moves while the robot works.</p>
            <figure className={classes.MotionLegend}>
              <svg ref={motionRef} viewBox="0 0 720 570" role="img" aria-labelledby="motion-title">
                <title id="motion-title">Six hazard conditions: stationary, a 25 mm orbit, a 300 mm shuttle, and one-way escapes of 50, 150 and 300 mm</title>
                <g>
                  <rect className={classes.HzTile} x="0" y="0" width="232" height="279" rx="8" />
                  <circle className={classes.HzDot} cx="116" cy="119.5" r="11" />
                  <text className={classes.HzLabel} x="116" y="245">Stationary</text>
                </g>
                <g>
                  <rect className={classes.HzTile} x="244" y="0" width="232" height="279" rx="8" />
                  <circle className={classes.HzPath} cx="360" cy="119.5" r="36" strokeWidth="3" strokeDasharray="7.5 5" />
                  <circle className={classes.HzDot} cx="396" cy="119.5" r="11">
                    <animateTransform attributeName="transform" type="rotate" from="0 360 119.5" to="360 360 119.5" dur="3.142s" repeatCount="indefinite" />
                  </circle>
                  <text className={classes.HzLabel} x="360" y="245">Orbit 25 mm</text>
                </g>
                <g>
                  <rect className={classes.HzTile} x="488" y="0" width="232" height="279" rx="8" />
                  <line className={classes.HzPath} x1="514" y1="119.5" x2="694" y2="119.5" strokeWidth="3" />
                  <circle className={classes.HzDot} cx="514" cy="119.5" r="11">
                    <animate attributeName="cx" values="514;694;514" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <text className={classes.HzLabel} x="604" y="245">Shuttle 300 mm</text>
                </g>
                <EscapeTile x={0} end={56} keyTime="0.1111" label="Escape 50 mm" />
                <EscapeTile x={244} end={360} keyTime="0.3333" label="Escape 150 mm" />
                <EscapeTile x={488} end={694} keyTime="0.6667" label="Escape 300 mm" />
              </svg>
              <figcaption>Six hazard conditions: one stationary, five moving at 50&nbsp;mm/s.</figcaption>
            </figure>
            <div className={classes.Specs}>
              <div className={classes.Spec}><div className={classes.SpecHead}>Simulator</div><div className={classes.SpecBody}>MuJoCo · Franka Panda, LIBERO suites</div></div>
              <div className={classes.Spec}><div className={classes.SpecHead}>Policy</div><div className={classes.SpecBody}>π<sub>0.5</sub>, public LIBERO checkpoint</div></div>
              <div className={classes.Spec}><div className={classes.SpecHead}>Perception</div><div className={classes.SpecBody}>Rendered RGB and registered depth</div></div>
              <div className={`${classes.Spec} ${classes.Warn}`}><div className={classes.SpecHead}>Collision</div><div className={classes.SpecBody}>Hazard displaced over 1&nbsp;mm at any step</div></div>
            </div>
            <p>Averaged over all six:</p>
            <div className={classes.Stats}>
              <div className={classes.Stat}>
                <div className={classes.StatLabel}>Episodes that hit the object</div>
                <div className={classes.StatRow}><span className={classes.Bad}>65.62%</span><span className={classes.Arrow} aria-hidden="true">→</span><span className={classes.Good}>27.27%</span></div>
                <div className={classes.StatNote}>no filter → with our filter (lower is better)</div>
              </div>
              <div className={classes.Stat}>
                <div className={classes.StatLabel}>Task done, object untouched</div>
                <div className={classes.StatRow}><span className={classes.Bad}>29.35%</span><span className={classes.Arrow} aria-hidden="true">→</span><span className={classes.Good}>50.43%</span></div>
                <div className={classes.StatNote}>no filter → with our filter (higher is better)</div>
              </div>
            </div>
            <p>Each clip runs the same scene and start twice: <strong>left, no filter</strong>; <strong>right, with our filter</strong>.</p>
            <div className={classes.Grid}>
              <Clip name="sim_stationary"><strong>Stationary.</strong> Without the filter, the forearm, not the gripper, strikes the moka pot.</Clip>
              <Clip name="sim_orbit-025"><strong>Orbit 25&nbsp;mm.</strong> The wine bottle circles in place.</Clip>
              <Clip name="sim_shuttle-300"><strong>Shuttle 300&nbsp;mm.</strong> The book never stops moving.</Clip>
              <Clip name="sim_escape-050"><strong>Escape 50&nbsp;mm.</strong> The milk carton slides a little, then stops.</Clip>
              <Clip name="sim_escape-150"><strong>Escape 150&nbsp;mm.</strong> The carton slides farther before it stops.</Clip>
              <Clip name="sim_escape-300"><strong>Escape 300&nbsp;mm.</strong> The carton travels the farthest, so tracking it matters most.</Clip>
            </div>
            <p className={classes.Note}>These are hand-picked examples in which the policy alone finishes the task but hits the object. The numbers above come from the full test in the paper.</p>
          </section>

          <section id="hardware">
            <h2>On a real robot arm</h2>
            <p className={classes.Lead}>The same filter runs on a low-cost SO-101 arm while a person carries a bottle into its path. The robot's task is to place a sugar cube in a cup.</p>
            <figure className={classes.Bench}>
              <svg viewBox="0 0 832 560" role="img" aria-labelledby="bench-title">
                <title id="bench-title">The hardware bench: an SO-101 arm, a RealSense D455 RGB-D camera on a tripod, and the green bottle that is carried into the arm's path</title>
                <defs><clipPath id="bench-clip"><rect width="566" height="560" rx="10" /></clipPath></defs>
                <image href={`${MEDIA}/images/hw_bench.jpg`} width="566" height="560" clipPath="url(#bench-clip)" />
                <polygon className={classes.Callout} points="315.6,496 345.6,481 345.6,511" />
                <rect className={classes.Callout} x="344.6" y="491" width="221.4" height="10" />
                <text className={classes.CalloutLabel} x="582" y="496">SO-101 arm</text>
                <polygon className={classes.Callout} points="353.9,19.8 383.9,4.8 383.9,34.8" />
                <rect className={classes.Callout} x="382.9" y="14.8" width="183.1" height="10" />
                <text className={classes.CalloutLabel} x="582" y="19.8">D455 RGB-D</text>
                <polygon className={classes.Callout} points="343.7,334.3 373.7,319.3 373.7,349.3" />
                <rect className={classes.Callout} x="372.7" y="329.3" width="193.3" height="10" />
                <text className={classes.CalloutLabel} x="582" y="334.3">Moving hazard</text>
              </svg>
              <figcaption>An SO-101 arm, a RealSense D455 depth camera and a wrist camera, all run by one Intel laptop.</figcaption>
            </figure>
            <div className={classes.Mapping}>
              <h3>One laptop runs the whole loop</h3>
              <p className={classes.Note}>Intel Core Ultra X7 358H</p>
              <div className={`${classes.Specs} ${classes.Three}`}>
                <div className={classes.Spec}><div className={classes.SpecHead}>CPU</div><div className={classes.SpecBody}>Safety filter and optical-flow tracker</div></div>
                <div className={`${classes.Spec} ${classes.Gpu}`}><div className={classes.SpecHead}>Integrated GPU</div><div className={classes.SpecBody}>Robot policy, object detector and hazard namer</div></div>
                <div className={`${classes.Spec} ${classes.Npu}`}><div className={classes.SpecHead}>NPU</div><div className={classes.SpecBody}>Measured 2.5× slower, so unused</div></div>
              </div>
            </div>
            <div className={classes.Grid}>
              <Clip name="hw_S2_sub1_ellipsoid">
                <span className={classes.Pill}>What the filter sees</span> Blue shapes cover the arm; the red shape covers the bottle. The filter keeps them apart.
              </Clip>
              <Clip name="hw_S2_sub3_tracked">
                <span className={classes.Pill}>Tracking</span> The red shape moves with the bottle as it is carried; the cyan line shows how far it has gone.
              </Clip>
            </div>
            <p>Across four tasks with four tries each, the arm touched the bottle in 3 of 16 tries with the filter and in 11 of 16 without it. It finished the task in 11 tries with the filter and in 13 without.</p>
          </section>

          <section id="edge">
            <h2>Small enough for a laptop</h2>
            <p className={classes.Lead}>Nothing runs on a server or over the network.</p>
            <div className={classes.Facts}>
              <div className={classes.Fact}><div className={classes.FactNum}>~2&nbsp;ms</div><div className={classes.FactText}>for the safety filter to check each command</div></div>
              <div className={classes.Fact}><div className={classes.FactNum}>343 → 177&nbsp;ms</div><div className={classes.FactText}>per policy decision, after trimming unused inputs and taking fewer refinement steps; the policy's weights are unchanged</div></div>
            </div>
          </section>

          <section id="abstract">
            <h2>Abstract</h2>
            <p>A vision–language–action (VLA) policy can finish a manipulation task while knocking over objects unrelated to it, so task success alone does not show that the policy is safe to deploy in clutter. We study how to keep a pretrained VLA policy clear of such hazards at run time without retraining it, which requires guarding more of the arm than the end effector, following the hazard as it moves, and sharing onboard compute with the policy. Our training-free shield covers the gripper, wrist, and forearm with five ellipsoids and filters every commanded motion through one barrier program against a keep-out ellipsoid fitted from RGB-D perception at reset. Sparse optical flow then carries that ellipsoid's center along with the hazard, with no repeated detection or refitting. Over six simulated hazard-motion conditions, the shield lowers collision from 65.62% to 27.27% and raises safe-success, task completion without collision, from 29.35% to 50.43%. Ablations show that guarding the arm links protects beyond end-effector shielding, and that tracking recovers most of the protection lost when the hazard estimate is frozen at reset. On heterogeneous edge hardware, the five-ellipsoid barrier runs on the CPU in 2.2&nbsp;ms at the 99th percentile, and trimming the vision–language prefix and taking fewer flow-matching steps shortens each π<sub>0.5</sub> policy call on the integrated GPU from 343 to 177.3&nbsp;ms. On a physical SO-101 arm across four tasks, the arm touched the hazard in 3 of 16 shielded episodes versus 11 of 16 unshielded ones.</p>
          </section>

          <section id="bibtex">
            <h2>BibTeX</h2>
            <div className={classes.Bib}>
              <CopyButton targetRef={bibRef} />
              <pre ref={bibRef}>{BIBTEX}</pre>
            </div>
          </section>

        </div>
      </Page>
    </>
  );
}
