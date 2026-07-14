import {
  icon,
  renderBrand,
  renderForegroundBar,
  renderLiveBadge,
  renderQrCard,
} from "../components/broadcastChrome.js";

export function createLayeredScene(config) {
  return {
    presenterZone: "left",

    renderUnderlay(context) {
      const id = config.id ?? context.slide.id;
      return `
        <section class="scene layered-scene reference-built-scene reference-scene-${id} layout-${config.layout} ${config.compact ? "is-compact" : ""} ${config.darkPanel ? "has-dark-panel" : ""}">
          ${renderBrand()}${renderLiveBadge()}
          <div class="layered-presenter-space" aria-label="Presenter camera placement"></div>
          <header class="layered-scene-heading">
            <h2>${config.title}</h2>
            <p>${config.subtitle}</p>
            <span class="layered-heading-rule">♥</span>
          </header>
          <div class="reference-scene-body">${renderSceneBody(id, config)}</div>
          ${config.qr && !["27", "34", "37", "39"].includes(id) ? `<aside class="layered-qr">${renderQrCard("Scan to Join")}</aside>` : ""}
          ${config.callout ? `<div class="layered-callout">${icon("heart")}<strong>${config.callout}</strong></div>` : ""}
        </section>`;
    },

    renderForeground(context) {
      return `
        <section class="scene-foreground layered-scene-foreground layered-scene-foreground-${context.slide.id}">
          <div class="layered-presenter-accent" aria-hidden="true"></div>
          ${renderForegroundBar(
            config.footer.map(([itemIcon, label]) => ({
              icon: itemIcon,
              label,
            })),
            config.utility
              ? "LIVE NOW"
              : config.title.split(" ").slice(0, 3).join(" "),
          )}
        </section>`;
    },
  };
}

function renderSceneBody(id, config) {
  const renderer = SCENE_BODY_RENDERERS[id];
  if (!renderer) throw new Error(`No dedicated card renderer registered for Scene ${id}`);
  return `<div class="scene-card-composition scene-card-composition-${id}" data-scene-card-design="${id}">${renderer(config)}</div>`;
}

// Keep these routes explicit. Each storyboard scene owns its markup entry and
// scene-scoped CSS, even when it reuses a low-level card primitive.
const SCENE_BODY_RENDERERS = {
  "06": (config) => renderFeatureCards("06", config),
  "07": (config) => renderFeatureCards("07", config),
  "09": (config) => renderFeatureCards("09", config),
  "10": (config) => renderFlow(config, "10"),
  "11": (config) => renderFlow(config, "11"),
  "12": (config) => renderLadder("12", config),
  "13": (config) => renderLadder("13", config),
  "15": (config) => renderStatus("15", config),
  "16": (config) => renderAppScene("16", config),
  "17": (config) => renderAppScene("17", config),
  "18": (config) => renderAppScene("18", config),
  "19": (config) => renderFeatureCards("19", config),
  "20": (config) => renderAssets(config),
  "21": (config) => renderTools(config),
  "22": (config) => renderFlow(config, "22"),
  "23": (config) => renderStatus("23", config),
  "24": (config) => renderImpactExplainer(config),
  "25": (config) => renderFeatureCards("25", config),
  "26": (config) => renderAppScene("26", config),
  "27": (config) => renderAppScene("27", config),
  "28": (config) => renderProfiles(config),
  "29": (config) => renderAppScene("29", config),
  "30": (config) => renderAppScene("30", config),
  "31": (config) => renderLadder("31", config),
  "32": (config) => renderLeaderboard(config),
  "33": (config) => renderFaq(config),
  "34": (config) => renderLiveAction("34", config),
  "35": (config) => renderFeatureCards("35", config),
  "36": (config) => renderFaq(config),
  "37": (config) => renderLiveAction("37", config),
  "39": (config) => renderLiveAction("39", config),
};

function renderFeatureCards(id, config) {
  return `<div class="reference-feature-grid columns-${config.columns ?? config.items.length}">
    ${config.items
      .map(
        (item, index) => `
      <article class="reference-feature-card tone-${item.tone}" data-control-cue="${item.cue}" style="--item-index:${index}">
        <div class="reference-card-icon">${icon(item.icon)}</div>
        <h3>${item.title}</h3><p>${item.copy}</p>
        ${item.value ? `<strong class="reference-pill">${item.value}</strong>` : ""}
        <span class="reference-card-link">${id === "09" ? "Explore program" : id === "19" ? "View what is included" : "Learn more"} <b>→</b></span>
      </article>`,
      )
      .join("")}
  </div>`;
}

function renderFlow(config, id) {
  return `<div class="reference-flow reference-flow-${id}">
    <div class="reference-flow-line"></div>
    ${config.items
      .map(
        (item, index) => `
      <article class="reference-flow-step tone-${item.tone}" data-control-cue="${item.cue}" style="--item-index:${index}">
        <strong class="reference-flow-index">${item.value}</strong>
        <div class="reference-flow-icon">${icon(item.icon)}</div>
        <h3>${item.title}</h3><p>${item.copy}</p>
        ${index < config.items.length - 1 ? '<span class="reference-flow-arrow">→</span>' : ""}
      </article>`,
      )
      .join("")}
  </div>`;
}

function renderLadder(id, config) {
  const horizontal = id !== "12";
  if (horizontal)
    return `<div class="reference-tier-track">
    <div class="reference-tier-line"><span></span></div>
    ${config.items
      .map(
        (item, index) => `
      <article class="reference-tier tone-${item.tone}" data-control-cue="${item.cue}" style="--item-index:${index}">
        <div class="reference-tier-medal">${icon(item.icon)}</div><strong>${item.title}</strong><span>${item.copy}</span>
        <small>${item.value}${id === "31" ? " MILESTONE" : ""}</small>
      </article>`,
      )
      .join("")}
  </div>`;

  return `<div class="reference-access-layout">
    <div class="reference-access-intro"><strong>ACCESS<br />LEVELS</strong><p>The vertical climb within the campaign.</p><span>Choose the experience that fits you.</span></div>
    <div class="reference-access-ladder">
      ${config.items
        .map(
          (
            item,
            index,
          ) => `<article class="reference-access-row tone-${item.tone}" data-control-cue="${item.cue}" style="--item-index:${index}">
        <strong class="reference-access-rank">${item.value}</strong><div>${icon(item.icon)}</div><section><h3>${item.title}</h3><p>${item.copy}</p><small>${index === 0 ? "CORE ACCESS" : index === 1 ? "DEEPER EXPERIENCE" : "DEEPEST ACCESS"}</small></section>
      </article>`,
        )
        .join("")}
    </div>
  </div>`;
}

function renderStatus(id, config) {
  return `<div class="reference-status-panel">
    <div class="reference-status-rail"></div>
    ${config.items
      .map(
        (item, index) => `
      <article class="reference-status-row tone-${item.tone}" data-control-cue="${item.cue}" style="--item-index:${index}">
        <span class="reference-status-dot">${icon(item.icon)}</span>
        <div><h3>${item.title}</h3><p>${item.copy}</p></div>
        <strong>${item.value}</strong>
        <span class="reference-status-check">${id === "23" && index === 3 ? "×" : "✓"}</span>
      </article>`,
      )
      .join("")}
  </div>`;
}

function renderAppScene(id, config) {
  return `<div class="reference-app-shell app-scene-${id}">
    <div class="reference-app-topbar"><span class="reference-app-logo">bema<span>Hub</span></span><label>Search Bema Hub</label><i></i><i></i><b>JR</b></div>
    <nav class="reference-app-sidebar"><strong>Overview</strong><span>Home</span><span>Campaigns</span><span>Events</span><span>Changemakers</span><span>My Impact</span><small>ACCOUNT</small><span>Messages</span><span>Settings</span></nav>
    <main class="reference-app-content">${renderAppContent(id, config)}</main>
  </div>`;
}

function renderAppContent(id, config) {
  if (id === "17")
    return `<div class="app-title-row"><div><small>DISCOVER</small><h3>Campaigns</h3></div><button>Explore all</button></div><div class="app-filter-row"><span>All campaigns</span><span>Music</span><span>Community</span><span>Creative</span></div><div class="campaign-card-grid">${config.items
      .slice(0, 3)
      .map(
        (item, i) =>
          `<article class="campaign-mini tone-${item.tone}"><div class="campaign-art art-${i}">${icon(item.icon)}<b>${item.value}</b></div><small>CREATOR CAMPAIGN</small><h4>${item.title}</h4><p>${item.copy}</p><div class="mini-progress"><span style="width:${62 + i * 12}%"></span></div><footer><span>${42 + i * 18}% joined</span><button>View campaign</button></footer></article>`,
      )
      .join("")}</div>`;
  if (id === "18")
    return `<div class="campaign-detail-hero"><div class="campaign-cover">${icon("music")}<span>NEW SINGLE</span></div><section><small>FEATURED CAMPAIGN</small><h3>${config.items[0].title}</h3><p>${config.items[0].copy}</p><div class="creator-line"><b>JV</b><span>Jaylen Vibes<br /><small>Verified creator</small></span></div><button>Choose access level</button></section></div><div class="detail-tabs"><b>Overview</b><span>Participation assets</span><span>Updates</span><span>Community</span></div><div class="detail-panel-grid">${config.items
      .slice(1)
      .map(
        (item) =>
          `<article><div>${icon(item.icon)}<h4>${item.title}</h4></div><p>${item.copy}</p><strong>${item.value}</strong></article>`,
      )
      .join("")}</div>`;
  if (id === "26")
    return `<div class="app-title-row"><div><small>UPCOMING</small><h3>Events</h3></div><button>View calendar</button></div><div class="event-feature"><div><small>FEATURED EVENT</small><h3>${config.items[0].title}</h3><p>${config.items[0].copy}</p><button>Register now</button></div><time><b>28</b>MAY</time></div><div class="event-list">${config.items
      .slice(1)
      .map(
        (item, i) =>
          `<article><time><b>${30 + i}</b>MAY</time><div><small>${item.value}</small><h4>${item.title}</h4><p>${item.copy}</p></div><button>View details</button></article>`,
      )
      .join("")}</div>`;
  if (id === "27")
    return `<div class="event-detail-banner"><section><small>VIRTUAL EVENT · MAY 28</small><h3>${config.items[0].title}</h3><p>${config.items[0].copy}</p><div><span>10:00 AM – 3:30 PM</span><span>Bema Hub Virtual Stage</span></div></section>${renderQrCard("Register for free")}</div><div class="event-detail-grid">${config.items
      .slice(1)
      .map(
        (item) =>
          `<article><header>${icon(item.icon)}<h4>${item.title}</h4><strong>${item.value}</strong></header><p>${item.copy}</p><button>${item.title === "Register or Join" ? "Join the event" : "View full details"}</button></article>`,
      )
      .join("")}</div>`;
  if (id === "29")
    return `<div class="app-title-row"><div><small>COMMUNITY DELIVERY</small><h3>Creator stories & proof</h3></div><button>View all updates</button></div><div class="story-layout"><section class="story-feed">${config.items
      .slice(0, 3)
      .map(
        (item, i) =>
          `<article><b class="story-avatar">${["MA", "TK", "AS"][i]}</b><div><h4>${item.title}</h4><p>${item.copy}</p><div class="proof-thumbs"><i></i><i></i><i></i></div></div><strong>${item.value}</strong></article>`,
      )
      .join(
        "",
      )}</section><aside><small>CREATOR SPOTLIGHT</small><div class="spotlight-avatar">JK</div><h4>Jamal K.</h4><p>Video Producer</p><div class="progress-ring">92%</div><span>Deliverables on track</span></aside></div>`;
  if (id === "30")
    return `<div class="app-title-row"><div><small>WELCOME BACK, JOYCE</small><h3>My Impact</h3></div><button>Download report</button></div><div class="impact-metric-row">${config.items
      .slice(0, 3)
      .map(
        (item) =>
          `<article>${icon(item.icon)}<div><small>${item.title}</small><strong>${item.value}</strong><span>${item.copy}</span></div></article>`,
      )
      .join(
        "",
      )}</div><div class="impact-dashboard-grid"><article class="impact-chart"><header><div><small>LOOP ACTIVITY</small><h4>Activity growth</h4></div><strong>+18.4%</strong></header><div class="bar-chart">${[38, 54, 44, 70, 58, 86, 76, 94].map((v) => `<i style="height:${v}%"></i>`).join("")}</div><footer><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></footer></article><article class="tier-progress-card"><small>BUILDER TIER</small><h4>Silver Builder</h4><div class="progress-ring">49%</div><p>2,460 / 5,000 points</p><button>View progress</button></article></div>`;
  return `<div class="app-title-row"><div><small>WELCOME BACK, JOYCE</small><h3>Home Dashboard</h3></div><button>View profile</button></div><div class="home-metrics">${config.items
    .slice(0, 3)
    .map(
      (item) =>
        `<article>${icon(item.icon)}<div><strong>${item.value}</strong><span>${item.title}</span><small>${item.copy}</small></div></article>`,
    )
    .join(
      "",
    )}</div><div class="home-dashboard-grid"><section><header><h4>Featured campaigns</h4><button>View all</button></header><div class="featured-campaigns">${["Music for Change", "Creativity for Good", "Community Builders"].map((name, i) => `<article><div class="campaign-thumb art-${i}">${icon(["music", "heart", "people"][i])}</div><div><small>FEATURED</small><h5>${name}</h5><span>${64 + i * 8}% joined</span></div></article>`).join("")}</div></section><aside><header><h4>Upcoming events</h4></header><article><time><b>28</b>MAY</time><div><strong>Open Enrollment Kickoff</strong><span>10:00 AM · Virtual</span></div></article><article><time><b>30</b>MAY</time><div><strong>Creator Community Q&A</strong><span>2:00 PM · Live</span></div></article></aside></div>`;
}

function renderAssets(config) {
  return `<div class="reference-assets-panel"><header><span>${icon("lock")}</span><div><small>YOUR PARTICIPATION PACKAGE</small><h3>Participation Assets Delivered</h3></div><strong>5 / 5 UNLOCKED</strong></header><div class="asset-list">${config.items.map((item, index) => `<article data-control-cue="${item.cue}"><span>${icon(item.icon)}</span><div><h4>${item.title}</h4><p>${item.copy}</p></div><small>${index === 0 ? "READY TO PLAY" : index === 3 ? "VIEW SCHEDULE" : "OPEN ASSET"}</small><b>✓</b></article>`).join("")}</div></div>`;
}

function renderTools(config) {
  return `<div class="reference-tools-layout"><section>${config.items
    .slice(0, 2)
    .map(
      (item, index) =>
        `<article class="tool-card tone-${item.tone}" data-control-cue="${item.cue}"><header>${icon(item.icon)}<div><small>PERSONAL TOOL</small><h3>${item.title}</h3></div><strong>ACTIVE</strong></header><div class="tool-value"><code>${item.copy}</code><button>${index ? "Reveal code" : "Copy link"}</button></div><footer><span>${item.value}</span><i></i><span>Ready to share</span></footer></article>`,
    )
    .join(
      "",
    )}</section><aside><header>${icon("people")}<div><small>LIVE</small><h3>Loop Activity</h3></div><strong>12 JOINED</strong></header>${["Alex joined via LoopLink", "Taylor joined via LoopCode", "Jamie joined via LoopLink", "Morgan activated a code"].map((text, i) => `<article><b>${["A", "T", "J", "M"][i]}</b><span>${text}<small>${i + 1} min ago</small></span><i>✓</i></article>`).join("")}</aside></div>`;
}

function renderImpactExplainer(config) {
  return `<div class="impact-explainer"><section><small>RECOGNIZED</small><strong>IMPACT</strong><span>EXPLAINED</span><p>Recognizing real value created through verified participation.</p><div class="impact-orbit">${icon("heart")}<i></i><i></i></div></section><div class="impact-points">${config.items.map((item) => `<article data-control-cue="${item.cue}"><span>${icon(item.icon)}</span><div><h3>${item.title}</h3><p>${item.copy}</p></div><strong>${item.value}</strong></article>`).join("")}</div></div>`;
}

function renderProfiles(config) {
  return `<div class="profile-directory">${config.items
    .map(
      (item, index) =>
        `<article class="profile-card" data-control-cue="${item.cue}"><div class="profile-avatar avatar-${index}">${item.title
          .split(" ")
          .map((word) => word[0])
          .join(
            "",
          )}</div><section><small>CHANGEMAKER</small><h3>${item.title}</h3><p>${item.copy}</p><span>● Verified profile</span></section><footer><strong>${item.value}</strong><small>IMPACT</small><button>View story</button></footer></article>`,
    )
    .join("")}</div>`;
}

function renderLeaderboard(config) {
  return `<div class="leaderboard-layout"><section><header><div><small>TOP REFERRERS</small><h3>Community leaders</h3></div><strong>LOOPLOCKS</strong></header>${config.items
    .slice(0, 5)
    .map(
      (item, index) =>
        `<article data-control-cue="${item.cue}"><b class="rank">${index + 1}</b><span class="leader-avatar">${item.title.slice(0, 2).toUpperCase()}</span><div><h4>${item.title}</h4><p>${item.copy}</p></div><strong>${item.value}</strong><i>${index < 2 ? "↑" : "—"}</i></article>`,
    )
    .join(
      "",
    )}</section><aside><small>WEEKLY MOMENTUM</small><strong>+24%</strong><p>Community movement this week</p><div class="momentum-chart">${[35, 48, 42, 67, 58, 81, 94].map((v) => `<i style="height:${v}%"></i>`).join("")}</div><dl><div><dt>1,248</dt><dd>Referrals</dd></div><div><dt>2,976</dt><dd>LoopLinks</dd></div><div><dt>4,532</dt><dd>Actions</dd></div></dl></aside></div>`;
}

function renderFaq(config) {
  return `<div class="faq-layout"><section><span class="faq-mark">?</span><h3>${config.utility ? "Ask us anything." : "Everything you need to know."}</h3><p>${config.utility ? "Drop your question in the live chat and the team will answer it." : "Clear answers before you choose your next step."}</p><button>${config.utility ? "LIVE CHAT IS OPEN" : "VISIT HELP CENTER"}</button></section><div class="faq-list">${config.items.map((item, index) => `<article data-control-cue="${item.cue}"><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${item.title}</h3><p>${item.copy}</p></div><b>+</b></article>`).join("")}</div></div>`;
}

function renderLiveAction(id, config) {
  if (id === "37")
    return `<div class="enrollment-progress-layout"><section><div class="live-metric-grid">${config.items
      .slice(0, 4)
      .map(
        (item) =>
          `<article>${icon(item.icon)}<strong>${item.value}</strong><span>${item.title}</span><small>${item.copy}</small></article>`,
      )
      .join(
        "",
      )}</div><div class="overall-progress"><header><div><small>OVERALL PROGRESS</small><h3>Enrollment movement</h3></div><strong>68%</strong></header><div><span></span></div><footer><span>0</span><span>Today’s goal: 350</span></footer></div><div class="live-feed"><header><span>● LIVE ACTIVITY</span><strong>JUST NOW</strong></header>${["Amina joined as a Builder", "Samuel activated LoopLink", "Joyce chose VIP Access"].map((x, i) => `<article><b>${["A", "S", "J"][i]}</b><span>${x}<small>${i + 1} min ago</small></span><i>✓</i></article>`).join("")}</div></section>${renderQrCard("Scan to enroll")}</div>`;
  return `<div class="reference-cta-layout"><aside>${renderQrCard(id === "34" ? "Scan to Join Now" : "Stay connected")}</aside><section><small>${id === "34" ? "ENROLLMENT IS OPEN" : "THANK YOU FOR JOINING"}</small><h3>${id === "34" ? "Choose how you want to participate." : "The loop continues."}</h3><div class="cta-option-grid">${config.items.map((item) => `<article data-control-cue="${item.cue}"><span>${icon(item.icon)}</span><div><h4>${item.title}</h4><p>${item.copy}</p></div><button>${item.value}</button></article>`).join("")}</div><footer><span>Secure enrollment</span><span>Instant access</span><span>Community support</span></footer></section></div>`;
}
