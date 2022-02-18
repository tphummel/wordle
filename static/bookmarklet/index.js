const stats = JSON.parse(window.localStorage.getItem("nyt-wordle-statistics"));
const state = JSON.parse(window.localStorage.getItem("nyt-wordle-state"));

const completedAt = new Date(state.lastCompletedTs);

const fileText = `---\n
title: ${state.solution}\n
date: ${completedAt.toISOString()}\n
state: ${JSON.stringify(state, null, 2)}\n
stats: ${JSON.stringify(stats, null, 2)}
\n---`;

const encodedFileText = encodeURIComponent(fileText);
const filename = `${state.solution}.md`;
const githubQueryLink = "https://github.com/tphummel/wordle-static/new/main/content/w/new?value=" + encodedFileText +"&filename=" + filename;

window.open(githubQueryLink);
