import browser from "webextension-polyfill";
import log from "loglevel";

const logDir = "common/tabGroups";

export const queryTabGroups = async (queryInfo: browser.TabGroups.QueryQueryInfoType = {}) => {
  const tabGroups = await browser.tabGroups.query(queryInfo);
  
  log.log(logDir, "queryTabGroups", tabGroups);

  return tabGroups;
};

export const updateTabGroups = async (groupId: number, updateProperties: browser.TabGroups.TabGroup) => {
  log.log(logDir, "updateTabGroups");

  const tabGroup = await browser.tabGroups.get(groupId);

  const { title, color, collapsed } = updateProperties;

  if (title) tabGroup.title = title;
  tabGroup.color = color;
  tabGroup.collapsed = collapsed;
};