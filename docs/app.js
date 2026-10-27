/* Lead Desk click-through demo. Static and offline: no server, no API calls, no AI calls.
   Every draft and reply is prerecorded text from data.js. */
(function () {
  "use strict";
  var D = window.DEMO;
  var $ = function (s) { return document.querySelector(s); };
  var state;
  function fresh() {
    return { queue: D.approvals.map(function (a) { return Object.assign({}, a, { body: a.body.slice() }); }),
      ready: D.ready.slice(), decided: [], inquiry: null, custom: "" };
  }
  state = fresh();

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function cites(s) {
    return esc(s).replace(/\[\[([^|\]]+)\|(\d+)\]\]/g, '<span class="cite">$1<sup>[$2]</sup></span>')
      .replace(/\[\[(\d+)\]\]/g, '<sup class="mono">[$1]</sup>').replace(/\n/g, "<br>");
  }
  function plain(s) { return s.replace(/\[\[([^|\]]+)\|\d+\]\]/g, "$1").replace(/\[\[\d+\]\]/g, ""); }
  function money(n) { return "$" + n.toLocaleString("en-US"); }
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2200); }
  function head(title, sub) { return '<div class="page-h"><h1>' + esc(title) + "</h1>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div>"; }
  function chip(kind, text) { return '<span class="chip ' + kind + '">' + esc(text) + "</span>"; }
  function tile(k, v, s, href) { return '<div class="tile"><a href="' + (href || "#") + '"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div><div class="s">' + esc(s) + "</div></a></div>"; }

  /* Fake demo calculator: guests x menu price, plus a flat delivery fee. Not any real business's pricing. */
  function quote(menuId, guests) {
    var m = D.menus.filter(function (x) { return x.id === menuId; })[0] || D.menus[0];
    var food = m.perGuest * guests, delivery = 40, service = guests >= 50 ? 150 : 0;
    return { menu: m, guests: guests, lines: [[m.name + ", " + guests + " guests x " + money(m.perGuest), food], ["Delivery (flat, demo)", delivery], ["On-site staff (50+ guests, demo)", service]], total: food + delivery + service };
  }
  function quoteTable(q) {
    return '<table class="quote">' + q.lines.filter(function (l) { return l[1] > 0; }).map(function (l) { return "<tr><td>" + esc(l[0]) + '</td><td class="num">' + money(l[1]) + "</td></tr>"; }).join("") +
      '<tr class="total"><td>Estimate before tax</td><td class="num">' + money(q.total) + "</td></tr></table>" +
      '<p class="small muted">Fake demo calculator with made-up prices. In a real setup, prices come only from the business\'s own price list, never from the AI.</p>';
  }

  var VIEWS = [["Work", [["overview", "Overview"], ["approvals", "Approvals"], ["ready", "Ready to send"], ["try", "Try an inquiry"]]],
    ["Knowledge", [["radar", "Radar"], ["calendar", "Calendar"]]], ["Insight", [["analytics", "Analytics"], ["about", "About this demo"]]]];
  var HUE = { overview: "#8ec5ff", approvals: "#ffb36b", ready: "#9be3c4", try: "#ff9ec2", radar: "#7ef2a6", calendar: "#6ee7d3", analytics: "#b7f07a", about: "#c4a7ff" };
  var ICON = { overview: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", approvals: "M4 13h4l1.5 3h5L16 13h4M4 13V7a2 2 0 012-2h12a2 2 0 012 2v6M4 13v4a2 2 0 002 2h12a2 2 0 002-2v-4",
    ready: "M4 12l16-8-6 16-2.5-6.5zM11.5 13.5L20 4", try: "M4 5h16v11H9l-5 4z", radar: "M5 12a7 7 0 0114 0M8.5 12a3.5 3.5 0 017 0M12 12h.01", calendar: "M5 6h14v14H5zM5 10h14M9 3v4M15 3v4",
    analytics: "M4 19h16M6 15l4-5 3 3 5-7", about: "M12 8h.01M11 12h1v5h1M12 3a9 9 0 100 18 9 9 0 000-18z" };
  var current = "overview";
  function drawNav() {
    $("#nav").innerHTML = VIEWS.map(function (g) {
      return '<div class="nav-h">' + g[0] + "</div>" + g[1].map(function (v) {
        var c = v[0] === "approvals" && state.queue.length ? '<span class="count">' + state.queue.length + "</span>" : v[0] === "ready" && state.ready.length ? '<span class="count">' + state.ready.length + "</span>" : "";
        return '<a href="#' + v[0] + '" style="--hue:' + HUE[v[0]] + '"' + (v[0] === current ? ' aria-current="page"' : "") + '><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + ICON[v[0]] + '"/></svg>' + v[1] + c + "</a>";
      }).join("");
    }).join("");
  }

  var PAGES = {};
  PAGES.overview = function () {
    var pipe = D.pipeline.map(function (c) {
      var items = c[0] === "Awaiting approval" ? state.queue.map(function (a) { return [a.org, a.segment]; }) : c[1];
      var n = c[0] === "Awaiting approval" ? state.queue.length : c[2];
      return '<div class="col"><div class="col-h"><span>' + c[0] + "</span>" + chip("mute", n) + "</div>" + items.map(function (i) { return '<div class="lc"><b>' + esc(i[0]) + "</b><div>" + esc(i[1]) + "</div></div>"; }).join("") + "</div>";
    }).join("");
    var calls = D.calls.map(function (c) { return '<tr><td class="mono">' + c[0] + "</td><td>" + esc(c[1]) + '<div class="small muted">' + c[2] + "</div></td><td>" + esc(c[3]) + "</td><td>" + chip(c[4], c[5]) + "</td><td>" + esc(c[6]) + "</td></tr>"; }).join("");
    return '<div class="hero"><div class="grow"><h1>Good morning. ' + (state.queue.length ? state.queue.length + " drafts need your OK." : "Your queue is clear.") + "</h1><p>The desk researched, verified and drafted overnight. You decide what goes out.</p></div>" +
      (state.queue.length ? '<a class="btn" href="#approvals">Review drafts</a>' : '<a class="btn" href="#ready">See ready to send</a>') + "</div>" +
      '<div class="grid g4 mt">' + tile("Leads found", "33", "+7 this week", "#radar") + tile("Approved", String(14 + state.decided.filter(function (d) { return d.v !== "Rejected"; }).length), state.queue.length + " waiting on you", "#approvals") + tile("Replies", "3", "1 quote requested", "#analytics") + tile("Spend this month", "$18.40", "Cap $50.00", "#analytics") + "</div>" +
      '<div class="card mt"><div class="row"><h2 class="grow">Pipeline</h2><span class="small muted">One row per lead in the tracker sheet</span></div><div class="board mt">' + pipe + "</div></div>" +
      '<div class="card mt"><h2>Inbound calls</h2><p class="small muted">Summaries from the AI phone agent (sample).</p><div class="scroll"><table><thead><tr><th>When</th><th>Caller</th><th>Ask</th><th>Rating</th><th>Next</th></tr></thead><tbody>' + calls + "</tbody></table></div></div>";
  };

  PAGES.approvals = function () {
    var done = state.decided.length ? '<div class="card flat mt"><h3>Decided this session</h3>' + state.decided.map(function (d) { return '<div class="row small" style="margin-top:6px">' + chip(d.v === "Rejected" ? "bad" : "good", d.v) + "<span>" + esc(d.org) + " by " + esc(d.by) + "</span></div>"; }).join("") + "</div>" : "";
    if (!state.queue.length) return head("Approvals", "Nothing waiting.") + '<div class="card empty">All drafts are decided. Press Reset demo to start again.</div>' + done;
    return head("Approvals", "Each draft shows the source behind every claim and the checks it passed. Approve, edit or reject it. Nothing sends on its own.") +
      '<p class="hint">Click a card to open it.</p><div class="stack">' + state.queue.map(function (a, i) { return card(a, i === 0); }).join("") + "</div>" + done;
  };
  function card(a, open) {
    var checks = [["Every claim has a source", true], ["No price the business did not supply", true], ["Business address, not personal", a.kind === "lead"], ["Unsubscribe line and mailing address", true], ["Under 120 words", true]];
    if (a.kind !== "lead") checks[2] = ["Replying to the person who asked", true];
    return '<article class="card item ' + a.kind + (open ? " open" : "") + '" data-id="' + a.id + '">' +
      '<div class="item-h" data-toggle="' + a.id + '"><svg class="caret" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg><h3 class="grow">' + esc(a.org) + "</h3>" +
      chip(a.kind === "lead" ? "info" : "warn", a.kind === "lead" ? "Outbound lead" : "Phone call") + chip("good", a.confidence) + chip("mute", "Fit " + a.fit) + '<div class="item-peek">' + esc(a.subject) + "</div></div>" +
      '<div class="item-b"><div class="two"><div>' +
      '<div class="email"><div class="eh"><div><b>To:</b> ' + esc(a.contact) + ", " + esc(a.role) + " &lt;" + esc(a.email) + "&gt;</div><div><b>From:</b> " + D.business.email + "</div><div><b>Subject:</b> " + esc(a.subject) + "</div></div>" +
      '<div class="eb" id="body-' + a.id + '">' + a.body.map(function (p) { return "<p>" + cites(p) + "</p>"; }).join("") +
      '<div class="foot">' + esc(D.business.name) + ", " + esc(D.business.address) + '. Reply "stop" and we will not email you again.</div></div></div>' +
      '<div class="row mt"><label class="grow">Approver name<input id="by-' + a.id + '" value="Riley Chen" autocomplete="off"></label></div>' +
      '<div class="row" style="margin-top:10px"><button class="primary" data-act="approve" data-id="' + a.id + '">Approve</button><button data-act="edit" data-id="' + a.id + '">Edit</button><button class="danger" data-act="reject" data-id="' + a.id + '">Reject</button></div>' +
      '<p class="small muted">Approve moves the draft to Ready to send. The desk never sends email by itself.</p>' +
      '</div><div><h3>Sources behind every claim</h3>' + a.sources.map(function (s) { return '<div class="src"><sup class="mono">[' + s.n + "]</sup> <span class=\"mono\">" + esc(s.where) + "</span><q>" + esc(s.quote) + "</q></div>"; }).join("") +
      '<h3 class="mt">Quality gate</h3>' + checks.map(function (c) { return '<div class="ck"><b>✓</b>' + esc(c[0]) + "</div>"; }).join("") +
      '<h3 class="mt">Why this one</h3><p class="small">' + esc(a.angle) + "</p>" +
      '<details><summary>Decision trail</summary><dl class="kv">' + a.trail.map(function (t) { return "<dt>" + esc(t[0]) + "</dt><dd>" + esc(t[1]) + "</dd>"; }).join("") + "</dl></details>" +
      "</div></div></div></article>";
  }

  PAGES.ready = function () {
    return head("Ready to send", "Approved drafts. A person sends each one from their own email. The desk only marks it sent.") +
      (state.ready.length ? '<div class="card"><div class="scroll"><table><thead><tr><th>Organization</th><th>To</th><th>Subject</th><th>Approved by</th><th></th></tr></thead><tbody>' +
        state.ready.map(function (r, i) { return "<tr><td><b>" + esc(r.org) + "</b></td><td>" + esc(r.contact) + '<div class="mono muted">' + esc(r.email) + "</div></td><td>" + esc(r.subject) + "</td><td>" + esc(r.by) + '</td><td><button data-act="sent" data-i="' + i + '">Mark as sent</button></td></tr>'; }).join("") +
        "</tbody></table></div></div>" : '<div class="card empty">Nothing ready. Approve a draft first.</div>');
  };

  PAGES.try = function () {
    var q = state.inquiry;
    var left = '<div class="card"><h2>Pick a sample inquiry</h2><p class="small muted">Or type your own. Replies here are prerecorded, so typed text gets a template reply.</p><div class="samples mt">' +
      D.inquiries.map(function (x) { return '<button data-act="pick" data-q="' + x.id + '" aria-pressed="' + (q && q.id === x.id) + '">' + esc(x.label) + "</button>"; }).join("") + "</div>" +
      '<label class="mt">Or type an inquiry<textarea id="custom" placeholder="Example: Lunch for 40 people next Friday, buffet please.">' + esc(state.custom) + '</textarea></label><div class="row" style="margin-top:8px"><button class="primary" data-act="custom">Draft a reply</button></div></div>';
    var right;
    if (!q) right = '<div class="card empty">Pick an inquiry to see the reply draft and the price estimate.</div>';
    else {
      var qt = quote(q.menu, q.guests);
      var used = {}; q.reply.join(" ").replace(/\[\[(\d+)\]\]/g, function (_, n) { used[n] = 1; });
      right = '<div class="card"><div class="row"><h2 class="grow">Reply draft</h2>' + chip(q.rating[0], q.rating[1]) + chip("warn", "Awaiting approval") + "</div>" +
        '<blockquote>' + esc(q.text) + "</blockquote>" +
        '<dl class="kv mt"><dt>Guests</dt><dd>' + q.guests + "</dd><dt>Menu</dt><dd>" + esc(qt.menu.name) + "</dd><dt>Date</dt><dd>" + esc(q.date) + "</dd></dl>" +
        '<div class="email"><div class="eb">' + q.reply.map(function (p) { return "<p>" + cites(p) + "</p>"; }).join("") + "</div></div>" +
        '<h3 class="mt">Price estimate</h3>' + quoteTable(qt) +
        '<h3 class="mt">Sources</h3>' + Object.keys(used).map(function (n) { var s = D.replySources[n]; return '<div class="src"><sup class="mono">[' + n + "]</sup> <span class=\"mono\">" + esc(s[0]) + "</span><q>" + esc(s[1]) + "</q></div>"; }).join("") +
        '<div class="row mt"><button class="primary" data-act="approve-reply">Approve</button><button data-act="clear">Clear</button></div></div>';
    }
    return head("Try an inquiry", "See how the desk turns a call or email into a rated inquiry, a reply draft and a price estimate.") + '<div class="two">' + left + "<div>" + right + "</div></div>";
  };
  function customInquiry(text) {
    var m = text.match(/(\d{1,3})\s*(people|guests|ppl|persons|staff|employees)/i) || text.match(/for\s+(\d{1,3})\b/i);
    var guests = Math.max(10, Math.min(150, m ? parseInt(m[1], 10) : 20));
    var menu = /bbq|grill|barbecue/i.test(text) ? "bbq" : /box|sandwich/i.test(text) ? "boxed" : "buffet";
    var name = D.menus.filter(function (x) { return x.id === menu; })[0].name.toLowerCase();
    return { id: "custom", text: text, guests: guests, menu: menu, date: "Not given, ask the customer", rating: m ? ["good", "Worth it"] : ["warn", "Needs info"],
      reply: ["Hi there,", "Thanks for reaching out to Bluebird. For " + guests + " guests, our " + name + " is a good fit[[1]].", "The estimate is below. Our team confirms the final price.", "Every menu has a vegan and a gluten-free option[[2]]. What date did you have in mind?", "Thanks,\nRiley Chen\nBluebird Catering Co."] };
  }

  PAGES.radar = function () {
    return head("Daily lead radar", "Each morning the desk looks for organizations with a real, dated reason to reach out. Weak signals are dropped by rule.") +
      '<div class="grid g4">' + tile("Pages scanned", "214", "Today") + tile("Signals kept", "5", "With a source link") + tile("Signals dropped", "3", "Weak or out of date") + tile("Run cost", "$0.62", "Daily cap $2.00") + "</div>" +
      '<div class="card mt"><h2>Today\'s signals</h2><div class="scroll"><table><thead><tr><th>Organization</th><th>Signal and source</th><th>Possible angle</th><th>Status</th><th>Fit</th></tr></thead><tbody>' +
      D.signals.map(function (s) { return "<tr><td><b>" + esc(s[0]) + "</b></td><td>" + esc(s[1]) + '<div class="mono muted">' + esc(s[2]) + "</div></td><td>" + esc(s[3]) + "</td><td>" + chip(s[4] === "New" ? "info" : "mute", s[4]) + '</td><td><span class="sc"><i style="width:' + s[5] + '%"></i></span>' + s[5] + "</td></tr>"; }).join("") +
      '</tbody></table></div></div><div class="card mt"><h2>Dropped by the rules</h2><div class="scroll"><table><thead><tr><th>Organization</th><th>Signal</th><th>Why</th></tr></thead><tbody>' +
      D.dropped.map(function (s) { return "<tr><td>" + esc(s[0]) + "</td><td>" + esc(s[1]) + '</td><td class="muted">' + esc(s[2]) + "</td></tr>"; }).join("") + "</tbody></table></div></div>";
  };

  PAGES.calendar = function () {
    var c = D.calendar, first = new Date(c.year, c.month, 1), days = new Date(c.year, c.month + 1, 0).getDate(), lead = first.getDay(), cells = "";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(function (d) { cells += '<div class="dow">' + d + "</div>"; });
    for (var i = 0; i < lead; i++) cells += '<div class="day out"></div>';
    for (var d = 1; d <= days; d++) {
      var evs = c.events.filter(function (e) { return e[0] === d; }).map(function (e) { return '<span class="ev ' + (e[2] === "proposal" ? "proposal" : "") + '" title="' + esc(e[1]) + '">' + esc(e[1]) + "</span>"; }).join("");
      cells += '<div class="day">' + d + evs + "</div>";
    }
    var name = first.toLocaleString("en-US", { month: "long", year: "numeric" });
    return head("Calendar · " + name, "Booked events and proposed holds. The desk only proposes. A person accepts a hold before it goes on the real calendar.") +
      '<div class="card"><div class="row" style="margin-bottom:10px">' + chip("mute", "Booked") + chip("info", "Proposed hold") + '</div><div class="cal">' + cells + "</div></div>";
  };

  PAGES.analytics = function () {
    var A = D.analytics, max = 12;
    function bars(label, arr, color) { return "<h3 class=\"mt\">" + label + "</h3>" + arr.map(function (v, i) { return '<div class="bar-row"><span>' + A.weeks[i] + '</span><span class="bar" style="width:' + (v / max * 100) + "%;background:" + color + '"></span><span class="num">' + v + "</span></div>"; }).join(""); }
    return head("Analytics", "Counts, not just percentages, because a small business has small numbers.") +
      '<div class="grid g4">' + tile("Found", "33", "4 weeks") + tile("Approved by a person", "14", "42% of found") + tile("Replies", "3", "Of 11 sent") + tile("Cost per approved lead", "$1.31", "Demo number") + "</div>" +
      '<div class="grid g2 mt"><div class="card"><h2>By week</h2>' + bars("Leads found", A.found, "var(--c-lead)") + bars("Approved", A.approved, "var(--c-green)") + bars("Replies", A.replies, "var(--c-pink)") + "</div>" +
      '<div class="card"><h2>Leads by source</h2><p class="small muted">Every contact carries a source link.</p>' + A.sources.map(function (s) { return '<div class="bar-row"><span class="small">' + esc(s[0]) + '</span><span class="bar" style="width:' + (s[1] / 14 * 100) + '%;background:var(--c-analyst)"></span><span class="num">' + s[1] + "</span></div>"; }).join("") + "</div></div>";
  };

  PAGES.about = function () {
    return head("About this demo", "") + '<div class="card stack"><p>Lead Desk is the general version of an AI lead desk Lucas Walsh built for a small family business. Each business gets one profile with its offers, target customers and rules.</p>' +
      "<p>This page is a click-through demo. The business, leads, people, emails and phone numbers are fictional. The drafts and replies are prerecorded, and the price calculator uses made-up prices. Nothing here calls an AI model or sends anything.</p>" +
      "<p><b>How the real desk works:</b> small AI agents find organizations, verify a named contact on a public page, find one dated reason to reach out, and write a draft. A quality gate blocks any claim without a source. A person approves, edits or rejects every message.</p>" +
      '<p><a href="https://github.com/lucaswalsh90-ctrl/portfolio/blob/main/projects/castle-desk.md">Project write-up</a> · Code available on request.</p></div>';
  };

  function route() {
    var k = (location.hash || "#overview").slice(1);
    if (!PAGES[k]) k = "overview";
    current = k; drawNav();
    $("#main").innerHTML = PAGES[k]();
    document.title = (FLAT[k] || "Lead Desk") + " · Lead Desk demo";
    closeMenu();
  }
  var FLAT = {}; VIEWS.forEach(function (g) { g[1].forEach(function (v) { FLAT[v[0]] = v[1]; }); });

  function decide(id, verdict) {
    var a = state.queue.filter(function (x) { return x.id === id; })[0]; if (!a) return;
    var by = ($("#by-" + id) || {}).value || ""; by = by.trim();
    if (!by) { toast("Type your name first"); return; }
    state.queue = state.queue.filter(function (x) { return x.id !== id; });
    state.decided.push({ org: a.org, v: verdict, by: by });
    if (verdict !== "Rejected") state.ready.push({ org: a.org, contact: a.contact, email: a.email, subject: a.subject, by: by });
    toast(verdict === "Rejected" ? "Rejected. The draft will not be used." : verdict + ". Moved to Ready to send.");
    route();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act],[data-toggle]"); if (!t) return;
    if (t.dataset.toggle) { t.parentNode.classList.toggle("open"); return; }
    var act = t.dataset.act, id = t.dataset.id;
    if (act === "approve") decide(id, "Approved");
    else if (act === "reject") decide(id, "Rejected");
    else if (act === "edit") {
      var b = $("#body-" + id), a = state.queue.filter(function (x) { return x.id === id; })[0];
      if (t.textContent === "Edit") { b.innerHTML = '<textarea id="ta-' + id + '">' + esc(a.body.map(plain).join("\n\n")) + "</textarea>"; t.textContent = "Save and approve"; }
      else { a.body = $("#ta-" + id).value.split(/\n\n+/); decide(id, "Edited and approved"); }
    }
    else if (act === "sent") { var r = state.ready.splice(+t.dataset.i, 1)[0]; toast("Marked " + r.org + " as sent. In the real desk you send it from your own email."); route(); }
    else if (act === "pick") { state.inquiry = D.inquiries.filter(function (x) { return x.id === t.dataset.q; })[0]; route(); }
    else if (act === "custom") {
      var txt = ($("#custom").value || "").trim(); state.custom = txt;
      if (!txt) { toast("Type an inquiry first"); return; }
      $("#main").querySelector(".two > div:last-child").innerHTML = '<div class="card"><p class="typing">Drafting a reply...</p></div>';
      setTimeout(function () { state.inquiry = customInquiry(txt); route(); }, 700);
    }
    else if (act === "approve-reply") { toast("Approved. In the real desk it moves to Ready to send."); }
    else if (act === "clear") { state.inquiry = null; state.custom = ""; route(); }
  });

  function closeMenu() { $("#side").classList.remove("open"); $("#scrim").hidden = true; $("#menu").setAttribute("aria-expanded", "false"); }
  $("#menu").addEventListener("click", function () { $("#side").classList.add("open"); $("#scrim").hidden = false; this.setAttribute("aria-expanded", "true"); });
  $("#scrim").addEventListener("click", closeMenu);
  $("#reset").addEventListener("click", function () { state = fresh(); toast("Demo reset"); route(); });
  $("#theme").addEventListener("click", function () {
    var r = document.documentElement, dark = r.getAttribute("data-theme") === "dark" || (!r.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    r.setAttribute("data-theme", dark ? "light" : "dark");
  });
  window.addEventListener("hashchange", route);
  route();
})();
